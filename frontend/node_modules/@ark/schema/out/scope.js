import { ParseError, flatMorph, hasDomain, isArray, isThunk, printable, throwInternalError, throwParseError } from "@ark/util";
import { resolveConfig } from "./config.js";
import { GenericRoot, LazyGenericBody } from "./generic.js";
import { nodeImplementationsByKind } from "./kinds.js";
import { RootModule, bindModule } from "./module.js";
import { nodesByRegisteredId, parseNode, registerNodeId, schemaKindOf, withId } from "./parse.js";
import { Alias } from "./roots/alias.js";
import { CompiledFunction, NodeCompiler } from "./shared/compile.js";
import { $ark } from "./shared/registry.js";
import { arkKind, hasArkKind, isNode } from "./shared/utils.js";
const schemaBranchesOf = (schema) => isArray(schema) ? schema
    : "branches" in schema && isArray(schema.branches) ? schema.branches
        : undefined;
const throwMismatchedNodeRootError = (expected, actual) => throwParseError(`Node of kind ${actual} is not valid as a ${expected} definition`);
export const writeDuplicateAliasError = (alias) => `#${alias} duplicates public alias ${alias}`;
const scopesById = {};
$ark.ambient ??= {};
let rawUnknownUnion;
export class BaseScope {
    config;
    resolvedConfig;
    id = `${Object.keys(scopesById).length}$`;
    get [arkKind]() {
        return "scope";
    }
    referencesById = {};
    references = [];
    resolutions = {};
    json = {};
    exportedNames = [];
    aliases = {};
    resolved = false;
    nodesByHash = {};
    constructor(
    /** The set of names defined at the root-level of the scope mapped to their
     * corresponding definitions.**/
    def, config) {
        this.config = config ?? {};
        this.resolvedConfig = resolveConfig(config);
        const aliasEntries = Object.entries(def).map(entry => this.preparseOwnAliasEntry(...entry));
        aliasEntries.forEach(([k, v]) => {
            let name = k;
            if (k[0] === "#") {
                name = k.slice(1);
                if (name in this.aliases)
                    throwParseError(writeDuplicateAliasError(name));
                this.aliases[name] = v;
            }
            else {
                if (name in this.aliases)
                    throwParseError(writeDuplicateAliasError(k));
                this.aliases[name] = v;
                this.exportedNames.push(name);
            }
            if (!hasArkKind(v, "module") &&
                !hasArkKind(v, "generic") &&
                // TODO: proto thunk defs?
                !isThunk(v)) {
                const preparsed = this.preparseOwnDefinitionFormat(v, { alias: name });
                if (hasArkKind(preparsed, "root"))
                    this.resolutions[name] = this.bindReference(preparsed);
                else
                    this.resolutions[name] = this.createParseContext(preparsed).id;
            }
        });
        // reduce union of all possible values reduces to unknown
        rawUnknownUnion ??= this.node("union", {
            branches: [
                "string",
                "number",
                "object",
                "bigint",
                "symbol",
                { unit: true },
                { unit: false },
                { unit: undefined },
                { unit: null }
            ]
        }, { prereduced: true });
        this.nodesByHash[rawUnknownUnion.hash] = this.node("intersection", {}, { prereduced: true });
        scopesById[this.id] = this;
    }
    get internal() {
        return this;
    }
    defineSchema(def) {
        return def;
    }
    generic = (...params) => {
        const $ = this;
        return (def, possibleHkt) => new GenericRoot(params, possibleHkt ? new LazyGenericBody(def) : def, $, $);
    };
    units = (values, opts) => {
        const uniqueValues = [];
        for (const value of values)
            if (!uniqueValues.includes(value))
                uniqueValues.push(value);
        const branches = uniqueValues.map(unit => this.node("unit", { unit }, opts));
        return this.node("union", branches, {
            ...opts,
            prereduced: true
        });
    };
    lazyResolutions = [];
    lazilyResolve(resolve, syntheticAlias) {
        const node = this.node("alias", {
            reference: syntheticAlias ?? "synthetic",
            resolve
        }, { prereduced: true });
        if (!this.resolved)
            this.lazyResolutions.push(node);
        return node;
    }
    schema = (schema, opts) => this.finalize(this.parseSchema(schema, opts));
    parseSchema = (schema, opts) => this.node(schemaKindOf(schema), schema, opts);
    preparseNode(kinds, schema, opts) {
        let kind = typeof kinds === "string" ? kinds : schemaKindOf(schema, kinds);
        if (isNode(schema) && schema.kind === kind)
            return schema;
        if (kind === "alias" && !opts?.prereduced) {
            const { reference } = Alias.implementation.normalize(schema, this);
            if (reference.startsWith("$")) {
                const resolution = this.resolveRoot(reference.slice(1));
                schema = resolution;
                kind = resolution.kind;
            }
        }
        else if (kind === "union" && hasDomain(schema, "object")) {
            const branches = schemaBranchesOf(schema);
            if (branches?.length === 1) {
                schema = branches[0];
                kind = schemaKindOf(schema);
            }
        }
        const impl = nodeImplementationsByKind[kind];
        const normalizedSchema = impl.normalize?.(schema, this) ?? schema;
        // check again after normalization in case a node is a valid collapsed
        // schema for the kind (e.g. sequence can collapse to element accepting a Node')
        if (isNode(normalizedSchema)) {
            return normalizedSchema.kind === kind ?
                normalizedSchema
                : throwMismatchedNodeRootError(kind, normalizedSchema.kind);
        }
        return {
            ...opts,
            $: this,
            kind,
            def: normalizedSchema,
            prefix: opts.alias ?? kind
        };
    }
    bindReference(reference) {
        const bound = reference.$ === this ? reference
            : isNode(reference) ?
                new reference.constructor(reference.attachments, this)
                : new GenericRoot(reference.params, reference.bodyDef, reference.$, this);
        if (!this.resolved) {
            // we're still parsing the scope itself, so defer compilation but
            // add the node as a reference
            Object.assign(this.referencesById, bound.referencesById);
        }
        return bound;
    }
    resolveRoot(name) {
        return (this.maybeResolveRoot(name) ??
            throwParseError(writeUnresolvableMessage(name)));
    }
    maybeResolveRoot(name) {
        const result = this.maybeResolve(name);
        if (hasArkKind(result, "generic"))
            return;
        return result;
    }
    /** If name is a valid reference to a submodule alias, return its resolution  */
    maybeResolveSubalias(name) {
        return (maybeResolveSubalias(this.aliases, name) ??
            maybeResolveSubalias(this.ambient, name));
    }
    get ambient() {
        return $ark.ambient;
    }
    maybeResolve(name) {
        const cached = this.resolutions[name];
        if (cached) {
            if (typeof cached !== "string")
                return cached;
            const v = nodesByRegisteredId[cached];
            if (hasArkKind(v, "root"))
                return (this.resolutions[name] = v);
            if (hasArkKind(v, "context")) {
                if (v.phase === "resolving") {
                    return this.node("alias", { reference: `$${name}` }, { prereduced: true });
                }
                if (v.phase === "resolved") {
                    return throwInternalError(`Unexpected resolved context for was uncached by its scope: ${printable(v)}`);
                }
                v.phase = "resolving";
                const node = this.bindReference(this.parseOwnDefinitionFormat(v.def, v));
                v.phase = "resolved";
                nodesByRegisteredId[node.id] = node;
                nodesByRegisteredId[v.id] = node;
                return (this.resolutions[name] = node);
            }
            return throwInternalError(`Unexpected nodesById entry for ${cached}: ${printable(v)}`);
        }
        let def = this.aliases[name] ?? this.ambient?.[name];
        if (!def)
            return this.maybeResolveSubalias(name);
        def = this.normalizeRootScopeValue(def);
        if (hasArkKind(def, "generic"))
            return (this.resolutions[name] = this.bindReference(def));
        if (hasArkKind(def, "module")) {
            if (def.root)
                return (this.resolutions[name] = this.bindReference(def.root));
            else
                return throwParseError(writeMissingSubmoduleAccessMessage(name));
        }
        return (this.resolutions[name] = this.parse(def, {
            alias: name
        }));
    }
    createParseContext(input) {
        const id = input.id ?? registerNodeId(input.prefix);
        return (nodesByRegisteredId[id] = Object.assign(input, {
            [arkKind]: "context",
            $: this,
            id,
            phase: "unresolved"
        }));
    }
    import(...names) {
        return new RootModule(flatMorph(this.export(...names), (alias, value) => [
            `#${alias}`,
            value
        ]));
    }
    precompilation;
    _exportedResolutions;
    _exports;
    export(...names) {
        if (!this._exports) {
            this._exports = {};
            for (const name of this.exportedNames) {
                const def = this.aliases[name];
                this._exports[name] =
                    hasArkKind(def, "module") ?
                        bindModule(def, this)
                        : bootstrapAliasReferences(this.maybeResolve(name));
            }
            this.lazyResolutions.forEach(node => node.resolution);
            if (this.resolvedConfig.ambient === true)
                // spread all exports to ambient
                Object.assign($ark.ambient, this._exports);
            else if (typeof this.resolvedConfig.ambient === "string") {
                // add exports as a subscope with the config value as a name
                Object.assign($ark.ambient, {
                    [this.resolvedConfig.ambient]: new RootModule({
                        ...this._exports
                    })
                });
            }
            this._exportedResolutions = resolutionsOfModule(this, this._exports);
            Object.assign(this.json, resolutionsToJson(this._exportedResolutions));
            Object.assign(this.resolutions, this._exportedResolutions);
            this.references = Object.values(this.referencesById);
            if (!this.resolvedConfig.jitless) {
                this.precompilation = writePrecompilation(this.references);
                bindPrecompilation(this.references, this.precompilation);
            }
            this.resolved = true;
        }
        const namesToExport = names.length ? names : this.exportedNames;
        return new RootModule(flatMorph(namesToExport, (_, name) => [
            name,
            this._exports[name]
        ]));
    }
    resolve(name) {
        return this.export()[name];
    }
    node = (kinds, nodeSchema, opts = {}) => {
        const ctxOrNode = this.preparseNode(kinds, nodeSchema, opts);
        if (isNode(ctxOrNode))
            return this.bindReference(ctxOrNode);
        const ctx = this.createParseContext(ctxOrNode);
        return (nodesByRegisteredId[ctx.id] = this.bindReference(parseNode(ctx)));
    };
    parse = (def, opts = {}) => this.finalize(this.parseDefinition(def, opts));
    parseDefinition(def, opts = {}) {
        if (hasArkKind(def, "root"))
            return this.bindReference(def);
        const ctxInputOrNode = this.preparseOwnDefinitionFormat(def, opts);
        if (hasArkKind(ctxInputOrNode, "root"))
            return this.bindReference(ctxInputOrNode);
        const ctx = this.createParseContext(ctxInputOrNode);
        nodesByRegisteredId[ctx.id] = ctx;
        let node = this.bindReference(this.parseOwnDefinitionFormat(def, ctx));
        // if the node is recursive e.g. { box: "this" }, we need to make sure it
        // has the original id from context so that its references compile correctly
        if (node.isCyclic)
            node = withId(node, ctx.id);
        nodesByRegisteredId[ctx.id] = node;
        return node;
    }
    finalize(node) {
        bootstrapAliasReferences(node);
        if (!node.precompilation && !this.resolvedConfig.jitless)
            precompile(node.references);
        return node;
    }
}
export class SchemaScope extends BaseScope {
    parseOwnDefinitionFormat(def, ctx) {
        return parseNode(ctx);
    }
    preparseOwnDefinitionFormat(schema, opts) {
        return this.preparseNode(schemaKindOf(schema), schema, opts);
    }
    preparseOwnAliasEntry(k, v) {
        return [k, v];
    }
    normalizeRootScopeValue(v) {
        return v;
    }
}
const bootstrapAliasReferences = (resolution) => {
    resolution.references
        .filter(node => node.hasKind("alias"))
        .forEach(aliasNode => {
        Object.assign(aliasNode.referencesById, aliasNode.resolution.referencesById);
        resolution.references.forEach(ref => {
            if (aliasNode.id in ref.referencesById)
                Object.assign(ref.referencesById, aliasNode.referencesById);
        });
    });
    return resolution;
};
const resolutionsToJson = (resolutions) => flatMorph(resolutions, (k, v) => [
    k,
    hasArkKind(v, "root") || hasArkKind(v, "generic") ? v.json
        : hasArkKind(v, "module") ? resolutionsToJson(v)
            : throwInternalError(`Unexpected resolution ${printable(v)}`)
]);
const maybeResolveSubalias = (base, name) => {
    const dotIndex = name.indexOf(".");
    if (dotIndex === -1)
        return;
    const dotPrefix = name.slice(0, dotIndex);
    const prefixSchema = base[dotPrefix];
    // if the name includes ".", but the prefix is not an alias, it
    // might be something like a decimal literal, so just fall through to return
    if (prefixSchema === undefined)
        return;
    if (!hasArkKind(prefixSchema, "module"))
        return throwParseError(writeNonSubmoduleDotMessage(dotPrefix));
    const subalias = name.slice(dotIndex + 1);
    const resolution = prefixSchema[subalias];
    if (resolution === undefined)
        return maybeResolveSubalias(prefixSchema, subalias);
    if (hasArkKind(resolution, "root") || hasArkKind(resolution, "generic"))
        return resolution;
    if (hasArkKind(resolution, "module")) {
        return (resolution.root ??
            throwParseError(writeMissingSubmoduleAccessMessage(name)));
    }
    throwInternalError(`Unexpected resolution for alias '${name}': ${printable(resolution)}`);
};
export const schemaScope = (aliases, config) => new SchemaScope(aliases, config);
export const rootSchemaScope = new SchemaScope({});
export const parseAsSchema = (def, opts) => {
    try {
        return rootSchema(def, opts);
    }
    catch (e) {
        if (e instanceof ParseError)
            return e;
        throw e;
    }
};
const resolutionsOfModule = ($, typeSet) => {
    const result = {};
    for (const k in typeSet) {
        const v = typeSet[k];
        if (hasArkKind(v, "module")) {
            const innerResolutions = resolutionsOfModule($, v);
            const prefixedResolutions = flatMorph(innerResolutions, (innerK, innerV) => [`${k}.${innerK}`, innerV]);
            Object.assign(result, prefixedResolutions);
        }
        else if (hasArkKind(v, "root") || hasArkKind(v, "generic"))
            result[k] = v;
        else
            throwInternalError(`Unexpected scope resolution ${printable(v)}`);
    }
    return result;
};
export const writeUnresolvableMessage = (token) => `'${token}' is unresolvable`;
export const writeNonSubmoduleDotMessage = (name) => `'${name}' must reference a module to be accessed using dot syntax`;
export const writeMissingSubmoduleAccessMessage = (name) => `Reference to submodule '${name}' must specify an alias`;
const precompile = (references) => bindPrecompilation(references, writePrecompilation(references));
const bindPrecompilation = (references, precompilation) => {
    const compiledTraversals = instantiatePrecompilation(precompilation);
    for (const node of references) {
        if (node.precompilation) {
            // if node has already been bound to another scope or anonymous type, don't rebind it
            continue;
        }
        node.traverseAllows =
            compiledTraversals[`${node.id}Allows`].bind(compiledTraversals);
        if (node.isRoot() && !node.allowsRequiresContext) {
            // if the reference doesn't require context, we can assign over
            // it directly to avoid having to initialize it
            node.allows = node.traverseAllows;
        }
        node.traverseApply =
            compiledTraversals[`${node.id}Apply`].bind(compiledTraversals);
        node.precompilation = precompilation;
    }
};
const instantiatePrecompilation = (precompilation) => new CompiledFunction().return(precompilation).compile()();
const writePrecompilation = (references) => references.reduce((js, node) => {
    const allowsCompiler = new NodeCompiler("Allows").indent();
    node.compile(allowsCompiler);
    const allowsJs = allowsCompiler.write(`${node.id}Allows`);
    const applyCompiler = new NodeCompiler("Apply").indent();
    node.compile(applyCompiler);
    const applyJs = applyCompiler.write(`${node.id}Apply`);
    return `${js}${allowsJs},\n${applyJs},\n`;
}, "{\n") + "}";
// ensure the scope is resolved so JIT will be applied to future types
rootSchemaScope.export();
export const rootSchema = rootSchemaScope.schema;
export const node = rootSchemaScope.node;
export const defineSchema = rootSchemaScope.defineSchema;
export const genericNode = rootSchemaScope.generic;
