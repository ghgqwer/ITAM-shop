import { w as writable, d as derived, a as readonly } from './index2-D_TwCJel.js';
import { p as page, n as navigating } from './stores-CYrMs1_A.js';
import { U as UNDEFINED, N as NAN, P as POSITIVE_INFINITY, h as NEGATIVE_INFINITY, k as NEGATIVE_ZERO, l as decode64, m as HOLE, B as BROWSER, f as stringify, n as fail$1 } from './stringify-Pcd8Ia2c.js';
import { g as get_store_value, o as onDestroy, a as set_current_component, r as run_all, c as current_component } from './lifecycle-BF8Cb2Co.js';
import { a as applyAction, i as invalidateAll } from './client-Bquu-9ER.js';

/**
 * Revive a value serialized with `devalue.stringify`
 * @param {string} serialized
 * @param {Record<string, (value: any) => any>} [revivers]
 */
function parse(serialized, revivers) {
	return unflatten(JSON.parse(serialized));
}

/**
 * Revive a value flattened with `devalue.stringify`
 * @param {number | any[]} parsed
 * @param {Record<string, (value: any) => any>} [revivers]
 */
function unflatten(parsed, revivers) {
	if (typeof parsed === 'number') return hydrate(parsed, true);

	if (!Array.isArray(parsed) || parsed.length === 0) {
		throw new Error('Invalid input');
	}

	const values = /** @type {any[]} */ (parsed);

	const hydrated = Array(values.length);

	/**
	 * @param {number} index
	 * @returns {any}
	 */
	function hydrate(index, standalone = false) {
		if (index === UNDEFINED) return undefined;
		if (index === NAN) return NaN;
		if (index === POSITIVE_INFINITY) return Infinity;
		if (index === NEGATIVE_INFINITY) return -Infinity;
		if (index === NEGATIVE_ZERO) return -0;

		if (standalone) throw new Error(`Invalid input`);

		if (index in hydrated) return hydrated[index];

		const value = values[index];

		if (!value || typeof value !== 'object') {
			hydrated[index] = value;
		} else if (Array.isArray(value)) {
			if (typeof value[0] === 'string') {
				const type = value[0];

				switch (type) {
					case 'Date':
						hydrated[index] = new Date(value[1]);
						break;

					case 'Set':
						const set = new Set();
						hydrated[index] = set;
						for (let i = 1; i < value.length; i += 1) {
							set.add(hydrate(value[i]));
						}
						break;

					case 'Map':
						const map = new Map();
						hydrated[index] = map;
						for (let i = 1; i < value.length; i += 2) {
							map.set(hydrate(value[i]), hydrate(value[i + 1]));
						}
						break;

					case 'RegExp':
						hydrated[index] = new RegExp(value[1], value[2]);
						break;

					case 'Object':
						hydrated[index] = Object(value[1]);
						break;

					case 'BigInt':
						hydrated[index] = BigInt(value[1]);
						break;

					case 'null':
						const obj = Object.create(null);
						hydrated[index] = obj;
						for (let i = 1; i < value.length; i += 2) {
							obj[value[i]] = hydrate(value[i + 1]);
						}
						break;

          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array": {
            const TypedArrayConstructor = globalThis[type];
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            const typedArray = new TypedArrayConstructor(arraybuffer);
            hydrated[index] = typedArray;
            break;
          }

          case "ArrayBuffer": {
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }

					default:
						throw new Error(`Unknown type ${type}`);
				}
			} else {
				const array = new Array(value.length);
				hydrated[index] = array;

				for (let i = 0; i < value.length; i += 1) {
					const n = value[i];
					if (n === HOLE) continue;

					array[i] = hydrate(n);
				}
			}
		} else {
			/** @type {Record<string, any>} */
			const object = {};
			hydrated[index] = object;

			for (const key in value) {
				const n = value[key];
				object[key] = hydrate(n);
			}
		}

		return hydrated[index];
	}

	return hydrate(0);
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var collectionClone = clone$2;

/*
  Deep clones all properties except functions

  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

function clone$2(obj) {
  let result = obj;
  var type = {}.toString.call(obj).slice(8, -1);
  if (type == 'Set') {
    return new Set([...obj].map(value => clone$2(value)));
  }
  if (type == 'Map') {
    return new Map([...obj].map(kv => [clone$2(kv[0]), clone$2(kv[1])]));
  }
  if (type == 'Date') {
    return new Date(obj.getTime());
  }
  if (type == 'RegExp') {
    return RegExp(obj.source, getRegExpFlags(obj));
  }
  if (type == 'Array' || type == 'Object') {
    result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      // include prototype properties
      result[key] = clone$2(obj[key]);
    }
  }
  // primitives and non-supported objects (e.g. functions) land here
  return result;
}

function getRegExpFlags(regExp) {
  if (typeof regExp.source.flags == 'string') {
    return regExp.source.flags;
  } else {
    var flags = [];
    regExp.global && flags.push('g');
    regExp.ignoreCase && flags.push('i');
    regExp.multiline && flags.push('m');
    regExp.sticky && flags.push('y');
    regExp.unicode && flags.push('u');
    return flags.join('');
  }
}

// istanbul ignore next
const isObject = (obj) => {
    if (typeof obj === "object" && obj !== null) {
        if (typeof Object.getPrototypeOf === "function") {
            const prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }
        return Object.prototype.toString.call(obj) === "[object Object]";
    }
    return false;
};
const merge$1 = (...objects) => objects.reduce((result, current) => {
    if (Array.isArray(current)) {
        throw new TypeError("Arguments provided to ts-deepmerge must be objects, not arrays.");
    }
    Object.keys(current).forEach((key) => {
        if (["__proto__", "constructor", "prototype"].includes(key)) {
            return;
        }
        if (Array.isArray(result[key]) && Array.isArray(current[key])) {
            result[key] = merge$1.options.mergeArrays
                ? merge$1.options.uniqueArrayItems
                    ? Array.from(new Set(result[key].concat(current[key])))
                    : [...result[key], ...current[key]]
                : current[key];
        }
        else if (isObject(result[key]) && isObject(current[key])) {
            result[key] = merge$1(result[key], current[key]);
        }
        else {
            result[key] =
                current[key] === undefined
                    ? merge$1.options.allowUndefinedOverrides
                        ? current[key]
                        : result[key]
                    : current[key];
        }
    });
    return result;
}, {});
const defaultOptions$2 = {
    allowUndefinedOverrides: true,
    mergeArrays: true,
    uniqueArrayItems: true,
};
merge$1.options = defaultOptions$2;
merge$1.withOptions = (options, ...objects) => {
    merge$1.options = Object.assign(Object.assign({}, defaultOptions$2), options);
    const result = merge$1(...objects);
    merge$1.options = defaultOptions$2;
    return result;
};

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const browser = BROWSER;
function setPath(parent, key, value) {
  parent[key] = value;
  return "skip";
}
function isInvalidPath(originalPath, pathData) {
  return pathData.value !== void 0 && typeof pathData.value !== "object" && pathData.path.length < originalPath.length;
}
function pathExists(obj, path, options = {}) {
  if (!options.modifier) {
    options.modifier = (pathData) => isInvalidPath(path, pathData) ? void 0 : pathData.value;
  }
  const exists = traversePath(obj, path, options.modifier);
  if (!exists)
    return void 0;
  if (options.value === void 0)
    return exists;
  return options.value(exists.value) ? exists : void 0;
}
function traversePath(obj, realPath, modifier) {
  if (!realPath.length)
    return void 0;
  const path = [realPath[0]];
  let parent = obj;
  while (parent && path.length < realPath.length) {
    const key2 = path[path.length - 1];
    const value = modifier ? modifier({
      parent,
      key: String(key2),
      value: parent[key2],
      path: path.map((p) => String(p)),
      isLeaf: false,
      set: (v) => setPath(parent, key2, v)
    }) : parent[key2];
    if (value === void 0)
      return void 0;
    else
      parent = value;
    path.push(realPath[path.length]);
  }
  if (!parent)
    return void 0;
  const key = realPath[realPath.length - 1];
  return {
    parent,
    key: String(key),
    value: parent[key],
    path: realPath.map((p) => String(p)),
    isLeaf: true,
    set: (v) => setPath(parent, key, v)
  };
}
function traversePaths(parent, modifier, path = []) {
  for (const key in parent) {
    const value = parent[key];
    const isLeaf = value === null || typeof value !== "object";
    const pathData = {
      parent,
      key,
      value,
      path: path.concat([key]),
      // path.map(String).concat([key])
      isLeaf,
      set: (v) => setPath(parent, key, v)
    };
    const status = modifier(pathData);
    if (status === "abort")
      return status;
    else if (status === "skip")
      continue;
    else if (!isLeaf) {
      const status2 = traversePaths(value, modifier, pathData.path);
      if (status2 === "abort")
        return status2;
    }
  }
}
function eqSet(xs, ys) {
  return xs === ys || xs.size === ys.size && [...xs].every((x) => ys.has(x));
}
function comparePaths(newObj, oldObj) {
  const diffPaths = /* @__PURE__ */ new Map();
  function builtInDiff(one, other) {
    if (one instanceof Date && other instanceof Date && one.getTime() !== other.getTime())
      return true;
    if (one instanceof Set && other instanceof Set && !eqSet(one, other))
      return true;
    if (one instanceof File && other instanceof File && one !== other)
      return true;
    return false;
  }
  function isBuiltin(data) {
    return data instanceof Date || data instanceof Set || data instanceof File;
  }
  function checkPath(data, compareTo) {
    const otherData = compareTo ? traversePath(compareTo, data.path) : void 0;
    function addDiff() {
      diffPaths.set(data.path.join(" "), data.path);
      return "skip";
    }
    if (isBuiltin(data.value)) {
      if (!isBuiltin(otherData?.value) || builtInDiff(data.value, otherData.value)) {
        return addDiff();
      }
    }
    if (data.isLeaf) {
      if (!otherData || data.value !== otherData.value) {
        addDiff();
      }
    }
  }
  traversePaths(newObj, (data) => checkPath(data, oldObj));
  traversePaths(oldObj, (data) => checkPath(data, newObj));
  return Array.from(diffPaths.values());
}
function setPaths(obj, paths, value) {
  const isFunction = typeof value === "function";
  for (const path of paths) {
    const leaf = traversePath(obj, path, ({ parent, key, value: value2 }) => {
      if (value2 === void 0 || typeof value2 !== "object") {
        parent[key] = {};
      }
      return parent[key];
    });
    if (leaf)
      leaf.parent[leaf.key] = isFunction ? value(path, leaf) : value;
  }
}
function splitPath(path) {
  return path.toString().split(/[[\].]+/).filter((p) => p);
}
function mergePath(path) {
  return path.reduce((acc, next) => {
    const key = String(next);
    if (typeof next === "number" || /^\d+$/.test(key))
      acc += `[${key}]`;
    else if (!acc)
      acc += key;
    else
      acc += `.${key}`;
    return acc;
  }, "");
}
function clone$1(data) {
  return data && typeof data === "object" ? collectionClone(data) : data;
}
function assertSchema(schema, path) {
  if (typeof schema === "boolean") {
    throw new SchemaError("Schema property cannot be defined as boolean.", path);
  }
}
const conversionFormatTypes = ["unix-time", "bigint", "any", "symbol", "set"];
function schemaInfo(schema, isOptional, path) {
  assertSchema(schema, path);
  if (schema.allOf && schema.allOf.length) {
    return {
      ...merge$1.withOptions({ allowUndefinedOverrides: false }, ...schema.allOf.map((s) => schemaInfo(s, false, []))),
      schema
    };
  }
  const types = schemaTypes(schema, path);
  const array = schema.items && types.includes("array") ? (Array.isArray(schema.items) ? schema.items : [schema.items]).filter((s) => typeof s !== "boolean") : void 0;
  const additionalProperties = schema.additionalProperties && typeof schema.additionalProperties === "object" && types.includes("object") ? Object.fromEntries(Object.entries(schema.additionalProperties).filter(([, value]) => typeof value !== "boolean")) : void 0;
  const properties = schema.properties && types.includes("object") ? Object.fromEntries(Object.entries(schema.properties).filter(([, value]) => typeof value !== "boolean")) : void 0;
  const union = unionInfo(schema)?.filter((u) => u.type !== "null" && u.const !== null);
  return {
    types: types.filter((s) => s !== "null"),
    isOptional,
    isNullable: types.includes("null"),
    schema,
    union: union?.length ? union : void 0,
    array,
    properties,
    additionalProperties,
    required: schema.required
  };
}
function schemaTypes(schema, path) {
  assertSchema(schema, path);
  let types = schema.const === null ? ["null"] : [];
  if (schema.type) {
    types = Array.isArray(schema.type) ? schema.type : [schema.type];
  }
  if (schema.anyOf) {
    types = schema.anyOf.flatMap((s) => schemaTypes(s, path));
  }
  if (types.includes("array") && schema.uniqueItems) {
    const i = types.findIndex((t) => t != "array");
    types[i] = "set";
  } else if (schema.format && conversionFormatTypes.includes(schema.format)) {
    types.unshift(schema.format);
    if (schema.format == "unix-time") {
      const i = types.findIndex((t) => t == "integer");
      types.splice(i, 1);
    }
  }
  if (schema.const && schema.const !== null && typeof schema.const !== "function") {
    types.push(typeof schema.const);
  }
  return Array.from(new Set(types));
}
function unionInfo(schema) {
  if (!schema.anyOf || !schema.anyOf.length)
    return void 0;
  return schema.anyOf.filter((s) => typeof s !== "boolean");
}
function defaultValues(schema, isOptional = false, path = []) {
  return _defaultValues(schema, isOptional, path);
}
function _defaultValues(schema, isOptional, path) {
  if (!schema) {
    throw new SchemaError("Schema was undefined", path);
  }
  const info = schemaInfo(schema, isOptional, path);
  if (!info)
    return void 0;
  let objectDefaults = void 0;
  if ("default" in schema) {
    if (info.types.includes("object") && schema.default && typeof schema.default == "object" && !Array.isArray(schema.default)) {
      objectDefaults = schema.default;
    } else {
      if (info.types.length > 1) {
        if (info.types.includes("unix-time") && (info.types.includes("integer") || info.types.includes("number")))
          throw new SchemaError("Cannot resolve a default value with a union that includes a date and a number/integer.", path);
      }
      const [type] = info.types;
      return formatDefaultValue(type, schema.default);
    }
  }
  let _multiType;
  const isMultiTypeUnion = () => {
    if (!info.union || info.union.length < 2)
      return false;
    if (info.union.some((i) => i.enum))
      return true;
    if (!_multiType) {
      _multiType = new Set(info.types.map((i) => {
        return ["integer", "unix-time"].includes(i) ? "number" : i;
      }));
    }
    return _multiType.size > 1;
  };
  let output = {};
  if (!objectDefaults && info.union) {
    const singleDefault = info.union.filter((s) => typeof s !== "boolean" && s.default !== void 0);
    if (singleDefault.length == 1) {
      return _defaultValues(singleDefault[0], isOptional, path);
    } else if (singleDefault.length > 1) {
      throw new SchemaError("Only one default value can exist in a union, or set a default value for the whole union.", path);
    } else {
      if (info.isNullable)
        return null;
      if (info.isOptional)
        return void 0;
      if (isMultiTypeUnion()) {
        throw new SchemaError("Multi-type unions must have a default value, or exactly one of the union types must have.", path);
      }
      if (info.union.length && info.types[0] == "object") {
        output = info.union.length > 1 ? merge$1.withOptions({ allowUndefinedOverrides: true }, ...info.union.map((s) => _defaultValues(s, isOptional, path))) : _defaultValues(info.union[0], isOptional, path);
      }
    }
  }
  if (!objectDefaults) {
    if (info.isNullable)
      return null;
    if (info.isOptional)
      return void 0;
  }
  if (info.properties) {
    for (const [key, objSchema] of Object.entries(info.properties)) {
      assertSchema(objSchema, [...path, key]);
      const def = objectDefaults && objectDefaults[key] !== void 0 ? objectDefaults[key] : _defaultValues(objSchema, !info.required?.includes(key), [...path, key]);
      output[key] = def;
    }
    return output;
  } else if (objectDefaults) {
    return objectDefaults;
  }
  if (schema.enum) {
    return schema.enum[0];
  }
  if (isMultiTypeUnion()) {
    throw new SchemaError("Default values cannot have more than one type.", path);
  } else if (info.types.length == 0) {
    return void 0;
  }
  const [formatType] = info.types;
  return defaultValue(formatType, schema.enum);
}
function formatDefaultValue(type, value) {
  switch (type) {
    case "set":
      return Array.isArray(value) ? new Set(value) : value;
    case "Date":
    case "date":
    case "unix-time":
      if (typeof value === "string" || typeof value === "number")
        return new Date(value);
      break;
    case "bigint":
      if (typeof value === "string" || typeof value === "number")
        return BigInt(value);
      break;
    case "symbol":
      if (typeof value === "string" || typeof value === "number")
        return Symbol(value);
      break;
  }
  return value;
}
function defaultValue(type, enumType) {
  switch (type) {
    case "string":
      return enumType && enumType.length > 0 ? enumType[0] : "";
    case "number":
    case "integer":
      return enumType && enumType.length > 0 ? enumType[0] : 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    case "null":
      return null;
    case "Date":
    case "date":
    case "unix-time":
      return void 0;
    case "bigint":
      return BigInt(0);
    case "set":
      return /* @__PURE__ */ new Set();
    case "symbol":
      return Symbol();
    case "undefined":
    case "any":
      return void 0;
    default:
      throw new SchemaError("Schema type or format not supported, requires explicit default value: " + type);
  }
}
function defaultTypes(schema, path = []) {
  return _defaultTypes(schema, false, path);
}
function _defaultTypes(schema, isOptional, path) {
  if (!schema) {
    throw new SchemaError("Schema was undefined", path);
  }
  const info = schemaInfo(schema, isOptional, path);
  const output = {
    __types: info.types
  };
  if (info.schema.items && typeof info.schema.items == "object" && !Array.isArray(info.schema.items)) {
    output.__items = _defaultTypes(info.schema.items, info.isOptional, path);
  }
  if (info.properties) {
    for (const [key, value] of Object.entries(info.properties)) {
      assertSchema(value, [...path, key]);
      output[key] = _defaultTypes(info.properties[key], !info.required?.includes(key), [
        ...path,
        key
      ]);
    }
  }
  if (info.additionalProperties && info.types.includes("object")) {
    const additionalInfo = schemaInfo(info.additionalProperties, info.isOptional, path);
    if (additionalInfo.properties && additionalInfo.types.includes("object")) {
      for (const [key] of Object.entries(additionalInfo.properties)) {
        output[key] = _defaultTypes(additionalInfo.properties[key], !additionalInfo.required?.includes(key), [...path, key]);
      }
    }
  }
  if (info.isNullable && !output.__types.includes("null")) {
    output.__types.push("null");
  }
  if (info.isOptional && !output.__types.includes("undefined")) {
    output.__types.push("undefined");
  }
  return output;
}
class SuperFormError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, SuperFormError.prototype);
  }
}
class SchemaError extends SuperFormError {
  path;
  constructor(message, path) {
    super((path && path.length ? `[${Array.isArray(path) ? path.join(".") : path}] ` : "") + message);
    this.path = Array.isArray(path) ? path.join(".") : path;
    Object.setPrototypeOf(this, SchemaError.prototype);
  }
}
function mapErrors(errors, shape) {
  const output = {};
  function addFormLevelError(error) {
    if (!("_errors" in output))
      output._errors = [];
    if (!Array.isArray(output._errors)) {
      if (typeof output._errors === "string")
        output._errors = [output._errors];
      else
        throw new SuperFormError("Form-level error was not an array.");
    }
    output._errors.push(error.message);
  }
  for (const error of errors) {
    if (!error.path || error.path.length == 1 && !error.path[0]) {
      addFormLevelError(error);
      continue;
    }
    const isLastIndexNumeric = /^\d$/.test(String(error.path[error.path.length - 1]));
    const objectError = !isLastIndexNumeric && pathExists(shape, error.path.filter((p) => /\D/.test(String(p))))?.value;
    const leaf = traversePath(output, error.path, ({ value, parent: parent2, key: key2 }) => {
      if (value === void 0)
        parent2[key2] = {};
      return parent2[key2];
    });
    if (!leaf) {
      addFormLevelError(error);
      continue;
    }
    const { parent, key } = leaf;
    if (objectError) {
      if (!(key in parent))
        parent[key] = {};
      if (!("_errors" in parent[key]))
        parent[key]._errors = [error.message];
      else
        parent[key]._errors.push(error.message);
    } else {
      if (!(key in parent))
        parent[key] = [error.message];
      else
        parent[key].push(error.message);
    }
  }
  return output;
}
function updateErrors(New, Previous, force) {
  if (force)
    return New;
  traversePaths(Previous, (errors) => {
    if (!Array.isArray(errors.value))
      return;
    errors.set(void 0);
  });
  traversePaths(New, (error) => {
    if (!Array.isArray(error.value) && error.value !== void 0)
      return;
    setPaths(Previous, [error.path], error.value);
  });
  return Previous;
}
function flattenErrors(errors) {
  return _flattenErrors(errors, []);
}
function _flattenErrors(errors, path) {
  const entries = Object.entries(errors);
  return entries.filter(([, value]) => value !== void 0).flatMap(([key, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      const currPath = path.concat([key]);
      return { path: mergePath(currPath), messages };
    } else {
      return _flattenErrors(errors[key], path.concat([key]));
    }
  });
}
function mergeDefaults(parsedData, defaults) {
  if (!parsedData)
    return clone$1(defaults);
  return merge$1.withOptions({ mergeArrays: false }, defaults, parsedData);
}
function replaceInvalidDefaults(Data, Defaults, _schema, Errors, preprocessed) {
  const defaultType = _schema.additionalProperties && typeof _schema.additionalProperties == "object" ? { __types: schemaInfo(_schema.additionalProperties, false, []).types } : void 0;
  const Types = defaultTypes(_schema);
  function Types_correctValue(dataValue, defValue, type) {
    const types = type.__types;
    if (!types.length || types.every((t) => t == "undefined" || t == "null" || t == "any")) {
      return dataValue;
    } else if (types.length == 1 && types[0] == "array" && !type.__items) {
      return dataValue;
    }
    const dateTypes = ["unix-time", "Date", "date"];
    for (const schemaType of types) {
      const defaultTypeValue = defaultValue(schemaType, void 0);
      const sameType = typeof dataValue === typeof defaultTypeValue || dateTypes.includes(schemaType) && dataValue instanceof Date;
      const sameExistance = sameType && dataValue === null === (defaultTypeValue === null);
      if (sameType && sameExistance) {
        return dataValue;
      } else if (type.__items) {
        return Types_correctValue(dataValue, defValue, type.__items);
      }
    }
    if (defValue === void 0 && types.includes("null")) {
      return null;
    }
    return defValue;
  }
  function Data_traverse() {
    traversePaths(Defaults, Defaults_traverseAndReplace);
    Errors_traverseAndReplace();
    return Data;
  }
  function Data_setValue(currentPath, newValue) {
    setPaths(Data, [currentPath], newValue);
  }
  function Errors_traverseAndReplace() {
    for (const error of Errors) {
      if (!error.path)
        continue;
      Defaults_traverseAndReplace({
        path: error.path,
        value: pathExists(Defaults, error.path)?.value
      });
    }
  }
  function Defaults_traverseAndReplace(defaultPath) {
    const currentPath = defaultPath.path;
    if (!currentPath || !currentPath[0])
      return;
    if (typeof currentPath[0] === "string" && preprocessed?.includes(currentPath[0]))
      return;
    const dataPath = pathExists(Data, currentPath);
    if (!dataPath && defaultPath.value !== void 0 || dataPath && dataPath.value === void 0) {
      Data_setValue(currentPath, defaultPath.value);
    } else if (dataPath) {
      const defValue = defaultPath.value;
      const dataValue = dataPath.value;
      if (defValue !== void 0 && typeof dataValue === typeof defValue && dataValue === null === (defValue === null)) {
        return;
      }
      const typePath = currentPath.filter((p) => /\D/.test(String(p)));
      const pathTypes = traversePath(Types, typePath, (path) => {
        return "__items" in path.value ? path.value.__items : path.value;
      });
      if (!pathTypes) {
        throw new SchemaError("No types found for defaults", currentPath);
      }
      const fieldType = pathTypes.value ?? defaultType;
      if (!fieldType) {
        throw new SchemaError("No default value specified for field (can be undefined, but must be explicit)", currentPath);
      }
      Data_setValue(currentPath, Types_correctValue(dataValue, defValue, fieldType));
    }
  }
  {
    return Data_traverse();
  }
}
function cancelFlash(options) {
  if (!options.flashMessage || !browser)
    return;
  if (!shouldSyncFlash(options))
    return;
  document.cookie = `flash=; Max-Age=0; Path=${options.flashMessage.cookiePath ?? "/"};`;
}
function shouldSyncFlash(options) {
  if (!options.flashMessage || !browser)
    return false;
  return options.syncFlashMessage;
}
function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) {
    parsed.data = parse(parsed.data);
  }
  return parsed;
}
function clone(element) {
  return (
    /** @type {T} */
    HTMLElement.prototype.cloneNode.call(element)
  );
}
function enhance(form_element, submit = () => {
}) {
  const fallback_callback = async ({
    action,
    result,
    reset = true,
    invalidateAll: shouldInvalidateAll = true
  }) => {
    if (result.type === "success") {
      if (reset) {
        HTMLFormElement.prototype.reset.call(form_element);
      }
      if (shouldInvalidateAll) {
        await invalidateAll();
      }
    }
    if (location.origin + location.pathname === action.origin + action.pathname || result.type === "redirect" || result.type === "error") {
      applyAction();
    }
  };
  async function handle_submit(event) {
    const method = event.submitter?.hasAttribute("formmethod") ? (
      /** @type {HTMLButtonElement | HTMLInputElement} */
      event.submitter.formMethod
    ) : clone(form_element).method;
    if (method !== "post") return;
    event.preventDefault();
    const action = new URL(
      // We can't do submitter.formAction directly because that property is always set
      event.submitter?.hasAttribute("formaction") ? (
        /** @type {HTMLButtonElement | HTMLInputElement} */
        event.submitter.formAction
      ) : clone(form_element).action
    );
    const enctype = event.submitter?.hasAttribute("formenctype") ? (
      /** @type {HTMLButtonElement | HTMLInputElement} */
      event.submitter.formEnctype
    ) : clone(form_element).enctype;
    const form_data = new FormData(form_element);
    const submitter_name = event.submitter?.getAttribute("name");
    if (submitter_name) {
      form_data.append(submitter_name, event.submitter?.getAttribute("value") ?? "");
    }
    const controller = new AbortController();
    let cancelled = false;
    const cancel = () => cancelled = true;
    const callback = await submit({
      action,
      cancel,
      controller,
      formData: form_data,
      formElement: form_element,
      submitter: event.submitter
    }) ?? fallback_callback;
    if (cancelled) return;
    let result;
    try {
      const headers = new Headers({
        accept: "application/json",
        "x-sveltekit-action": "true"
      });
      if (enctype !== "multipart/form-data") {
        headers.set(
          "Content-Type",
          /^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(enctype) ? enctype : "application/x-www-form-urlencoded"
        );
      }
      const body = enctype === "multipart/form-data" ? form_data : new URLSearchParams(form_data);
      const response = await fetch(action, {
        method: "POST",
        headers,
        cache: "no-store",
        body,
        signal: controller.signal
      });
      result = deserialize(await response.text());
      if (result.type === "error") result.status = response.status;
    } catch (error) {
      if (
        /** @type {any} */
        error?.name === "AbortError"
      ) return;
      result = { type: "error", error };
    }
    callback({
      action,
      formData: form_data,
      formElement: form_element,
      update: (opts) => fallback_callback({
        action,
        result,
        reset: opts?.reset,
        invalidateAll: opts?.invalidateAll
      }),
      // @ts-expect-error generic constraints stuff we don't care about
      result
    });
  }
  HTMLFormElement.prototype.addEventListener.call(form_element, "submit", handle_submit);
  return {
    destroy() {
      HTMLFormElement.prototype.removeEventListener.call(form_element, "submit", handle_submit);
    }
  };
}
const noCustomValidityDataAttribute = "noCustomValidity";
async function updateCustomValidity(validityEl, errors) {
  if ("setCustomValidity" in validityEl) {
    validityEl.setCustomValidity("");
  }
  if (noCustomValidityDataAttribute in validityEl.dataset)
    return;
  setCustomValidity(validityEl, errors);
}
function setCustomValidityForm(formElement, errors) {
  for (const el of formElement.querySelectorAll("input,select,textarea,button")) {
    if ("dataset" in el && noCustomValidityDataAttribute in el.dataset || !el.name) {
      continue;
    }
    const path = traversePath(errors, splitPath(el.name));
    const error = path && typeof path.value === "object" && "_errors" in path.value ? path.value._errors : path?.value;
    setCustomValidity(el, error);
    if (error)
      return;
  }
}
function setCustomValidity(el, errors) {
  const message = errors && errors.length ? errors.join("\n") : "";
  el.setCustomValidity(message);
  if (message)
    el.reportValidity();
}
const isElementInViewport = (el, topOffset = 0) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= topOffset && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};
const scrollToAndCenter = (el, offset = 1.125, behavior = "smooth") => {
  const elementRect = el.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const top = absoluteElementTop - window.innerHeight / (2 * offset);
  window.scrollTo({ left: 0, top, behavior });
};
const immediateInputTypes = ["checkbox", "radio", "range", "file"];
function inputInfo(el) {
  const immediate = !!el && (el instanceof HTMLSelectElement || el instanceof HTMLInputElement && immediateInputTypes.includes(el.type));
  const multiple = !!el && el instanceof HTMLSelectElement && el.multiple;
  const file = !!el && el instanceof HTMLInputElement && el.type == "file";
  return { immediate, multiple, file };
}
var FetchStatus;
(function(FetchStatus2) {
  FetchStatus2[FetchStatus2["Idle"] = 0] = "Idle";
  FetchStatus2[FetchStatus2["Submitting"] = 1] = "Submitting";
  FetchStatus2[FetchStatus2["Delayed"] = 2] = "Delayed";
  FetchStatus2[FetchStatus2["Timeout"] = 3] = "Timeout";
})(FetchStatus || (FetchStatus = {}));
const activeTimers = /* @__PURE__ */ new Set();
function Form(formElement, timers, options) {
  let state = FetchStatus.Idle;
  let delayedTimeout, timeoutTimeout;
  const Timers = activeTimers;
  function Timers_start() {
    Timers_clear();
    Timers_setState(state != FetchStatus.Delayed ? FetchStatus.Submitting : FetchStatus.Delayed);
    delayedTimeout = window.setTimeout(() => {
      if (delayedTimeout && state == FetchStatus.Submitting)
        Timers_setState(FetchStatus.Delayed);
    }, options.delayMs);
    timeoutTimeout = window.setTimeout(() => {
      if (timeoutTimeout && state == FetchStatus.Delayed)
        Timers_setState(FetchStatus.Timeout);
    }, options.timeoutMs);
    Timers.add(Timers_clear);
  }
  function Timers_clear() {
    clearTimeout(delayedTimeout);
    clearTimeout(timeoutTimeout);
    delayedTimeout = timeoutTimeout = 0;
    Timers.delete(Timers_clear);
    Timers_setState(FetchStatus.Idle);
  }
  function Timers_clearAll() {
    Timers.forEach((t) => t());
    Timers.clear();
  }
  function Timers_setState(s) {
    state = s;
    timers.submitting.set(state >= FetchStatus.Submitting);
    timers.delayed.set(state >= FetchStatus.Delayed);
    timers.timeout.set(state >= FetchStatus.Timeout);
  }
  const ErrorTextEvents = formElement;
  function ErrorTextEvents__selectText(e) {
    const target = e.target;
    if (options.selectErrorText)
      target.select();
  }
  function ErrorTextEvents_addErrorTextListeners() {
    if (!options.selectErrorText)
      return;
    ErrorTextEvents.querySelectorAll("input").forEach((el) => {
      el.addEventListener("invalid", ErrorTextEvents__selectText);
    });
  }
  function ErrorTextEvents_removeErrorTextListeners() {
    if (!options.selectErrorText)
      return;
    ErrorTextEvents.querySelectorAll("input").forEach((el) => el.removeEventListener("invalid", ErrorTextEvents__selectText));
  }
  const Form2 = formElement;
  {
    ErrorTextEvents_addErrorTextListeners();
    const completed = (opts) => {
      if (!opts.clearAll)
        Timers_clear();
      else
        Timers_clearAll();
      if (!opts.cancelled)
        setTimeout(() => scrollToFirstError(Form2, options), 1);
    };
    onDestroy(() => {
      ErrorTextEvents_removeErrorTextListeners();
      completed({ cancelled: true });
    });
    return {
      submitting() {
        Timers_start();
      },
      completed,
      scrollToFirstError() {
        setTimeout(() => scrollToFirstError(Form2, options), 1);
      },
      isSubmitting: () => state === FetchStatus.Submitting || state === FetchStatus.Delayed
    };
  }
}
const scrollToFirstError = async (Form2, options) => {
  if (options.scrollToError == "off")
    return;
  const selector = options.errorSelector;
  if (!selector)
    return;
  await tick();
  let el;
  el = Form2.querySelector(selector);
  if (!el)
    return;
  el = el.querySelector(selector) ?? el;
  const nav = options.stickyNavbar ? document.querySelector(options.stickyNavbar) : null;
  if (typeof options.scrollToError != "string") {
    el.scrollIntoView(options.scrollToError);
  } else if (!isElementInViewport(el, nav?.offsetHeight ?? 0)) {
    scrollToAndCenter(el, void 0, options.scrollToError);
  }
  function Form_shouldAutoFocus(userAgent) {
    if (typeof options.autoFocusOnError === "boolean")
      return options.autoFocusOnError;
    else
      return !/iPhone|iPad|iPod|Android/i.test(userAgent);
  }
  if (!Form_shouldAutoFocus(navigator.userAgent))
    return;
  let focusEl;
  focusEl = el;
  if (!["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(focusEl.tagName)) {
    focusEl = focusEl.querySelector('input:not([type="hidden"]):not(.flatpickr-input), select, textarea');
  }
  if (focusEl) {
    try {
      focusEl.focus({ preventScroll: true });
      if (options.selectErrorText && focusEl.tagName == "INPUT") {
        focusEl.select();
      }
    } catch (err) {
    }
  }
};
function updateProxyField(obj, path, updater) {
  const output = traversePath(obj, path, ({ parent, key, value }) => {
    if (value === void 0)
      parent[key] = /\D/.test(key) ? {} : [];
    return parent[key];
  });
  if (output) {
    const newValue = updater(output.value);
    output.parent[output.key] = newValue;
  }
  return obj;
}
function superFieldProxy(superForm2, path, baseOptions) {
  const form = superForm2.form;
  const path2 = splitPath(path);
  const proxy = derived(form, ($form) => {
    const data = traversePath($form, path2);
    return data?.value;
  });
  return {
    subscribe(...params) {
      const unsub = proxy.subscribe(...params);
      return () => unsub();
    },
    update(upd, options) {
      form.update((data) => updateProxyField(data, path2, upd), options ?? baseOptions);
    },
    set(value, options) {
      form.update((data) => updateProxyField(data, path2, () => value), options ?? baseOptions);
    }
  };
}
function isSuperForm(form, options) {
  const isSuperForm2 = "form" in form;
  if (!isSuperForm2 && options?.taint !== void 0) {
    throw new SuperFormError("If options.taint is set, the whole superForm object must be used as a proxy.");
  }
  return isSuperForm2;
}
function fieldProxy(form, path, options) {
  const path2 = splitPath(path);
  if (isSuperForm(form, options)) {
    return superFieldProxy(form, path, options);
  }
  const proxy = derived(form, ($form) => {
    const data = traversePath($form, path2);
    return data?.value;
  });
  return {
    subscribe(...params) {
      const unsub = proxy.subscribe(...params);
      return () => unsub();
    },
    update(upd) {
      form.update((data) => updateProxyField(data, path2, upd));
    },
    set(value) {
      form.update((data) => updateProxyField(data, path2, () => value));
    }
  };
}
function schemaShape(schema, path = []) {
  const output = _schemaShape(schema, path);
  if (!output)
    throw new SchemaError("No shape could be created for schema.", path);
  return output;
}
function _schemaShape(schema, path) {
  assertSchema(schema, path);
  const info = schemaInfo(schema, false, path);
  if (info.array || info.union) {
    const arr = info.array || [];
    const union = info.union || [];
    return arr.concat(union).reduce((shape, next) => {
      const nextShape = _schemaShape(next, path);
      if (nextShape)
        shape = { ...shape ?? {}, ...nextShape };
      return shape;
    }, arr.length ? {} : void 0);
  }
  if (info.properties) {
    const output = {};
    for (const [key, prop] of Object.entries(info.properties)) {
      const shape = _schemaShape(prop, [...path, key]);
      if (shape)
        output[key] = shape;
    }
    return output;
  }
  return info.types.includes("array") || info.types.includes("object") ? {} : void 0;
}
function shapeFromObject(obj) {
  let output = {};
  const isArray = Array.isArray(obj);
  for (const [key, value] of Object.entries(obj)) {
    if (!value || typeof value !== "object")
      continue;
    if (isArray)
      output = { ...output, ...shapeFromObject(value) };
    else
      output[key] = shapeFromObject(value);
  }
  return output;
}
const formIds = /* @__PURE__ */ new WeakMap();
const initialForms = /* @__PURE__ */ new WeakMap();
const defaultOnError = (event) => {
  throw event.result.error;
};
const defaultFormOptions = {
  applyAction: true,
  invalidateAll: true,
  resetForm: true,
  autoFocusOnError: "detect",
  scrollToError: "smooth",
  errorSelector: '[aria-invalid="true"],[data-invalid]',
  selectErrorText: false,
  stickyNavbar: void 0,
  taintedMessage: false,
  onSubmit: void 0,
  onResult: void 0,
  onUpdate: void 0,
  onUpdated: void 0,
  onError: defaultOnError,
  dataType: "form",
  validators: void 0,
  customValidity: false,
  clearOnSubmit: "message",
  delayMs: 500,
  timeoutMs: 8e3,
  multipleSubmits: "prevent",
  SPA: void 0,
  validationMethod: "auto"
};
let LEGACY_MODE = false;
try {
  if (SUPERFORMS_LEGACY)
    LEGACY_MODE = true;
} catch {
}
let STORYBOOK_MODE = false;
try {
  if (globalThis.STORIES)
    STORYBOOK_MODE = true;
} catch {
}
function superForm(form, formOptions) {
  let initialForm;
  let options = {};
  let initialValidator = void 0;
  {
    if (options.legacy ?? LEGACY_MODE) {
      if (options.resetForm === void 0)
        options.resetForm = false;
      if (options.taintedMessage === void 0)
        options.taintedMessage = true;
    }
    if (STORYBOOK_MODE) {
      if (options.applyAction === void 0)
        options.applyAction = false;
    }
    if (typeof options.SPA === "string") {
      if (options.invalidateAll === void 0)
        options.invalidateAll = false;
      if (options.applyAction === void 0)
        options.applyAction = false;
    }
    initialValidator = options.validators;
    options = {
      ...defaultFormOptions,
      ...options
    };
    if ((options.SPA === true || typeof options.SPA === "object") && options.validators === void 0) {
      console.warn("No validators set for superForm in SPA mode. Add a validation adapter to the validators option, or set it to false to disable this warning.");
    }
    if (!form) {
      throw new SuperFormError("No form data sent to superForm. Make sure the output from superValidate is used (usually data.form) and that it's not null or undefined. Alternatively, an object with default values for the form can also be used, but then constraints won't be available.");
    }
    if (Context_isValidationObject(form) === false) {
      form = {
        id: options.id ?? Math.random().toString(36).slice(2, 10),
        valid: false,
        posted: false,
        errors: {},
        data: form,
        shape: shapeFromObject(form)
      };
    }
    form = form;
    const _initialFormId = form.id = options.id ?? form.id;
    const _currentPage = get_store_value(page) ?? (STORYBOOK_MODE ? {} : void 0);
    if (!initialForms.has(form)) {
      initialForms.set(form, form);
    }
    initialForm = initialForms.get(form);
    if (_currentPage.form && typeof _currentPage.form === "object") {
      const postedData = _currentPage.form;
      for (const postedForm of Context_findValidationForms(postedData).reverse()) {
        if (postedForm.id == _initialFormId && !initialForms.has(postedForm)) {
          initialForms.set(postedData, postedData);
          const pageDataForm = form;
          form = postedForm;
          form.constraints = pageDataForm.constraints;
          form.shape = pageDataForm.shape;
          if (form.valid && options.resetForm && (options.resetForm === true || options.resetForm())) {
            form = clone$1(pageDataForm);
            form.message = clone$1(postedForm.message);
          }
          break;
        }
      }
    } else {
      form = clone$1(initialForm);
    }
    onDestroy(() => {
      Unsubscriptions_unsubscribe();
      NextChange_clear();
      EnhancedForm_destroy();
      for (const events of Object.values(formEvents)) {
        events.length = 0;
      }
      formIds.get(_currentPage)?.delete(_initialFormId);
    });
    if (options.dataType !== "json") {
      const checkForNestedData = (key, value) => {
        if (!value || typeof value !== "object")
          return;
        if (Array.isArray(value)) {
          if (value.length > 0)
            checkForNestedData(key, value[0]);
        } else if (!(value instanceof Date) && !(value instanceof File) && !browser) {
          throw new SuperFormError(`Object found in form field "${key}". Set the dataType option to "json" and add use:enhance to use nested data structures. More information: https://superforms.rocks/concepts/nested-data`);
        }
      };
      for (const [key, value] of Object.entries(form.data)) {
        checkForNestedData(key, value);
      }
    }
  }
  const __data = {
    formId: form.id,
    form: clone$1(form.data),
    constraints: form.constraints ?? {},
    posted: form.posted,
    errors: clone$1(form.errors),
    message: clone$1(form.message),
    tainted: void 0,
    valid: form.valid,
    submitting: false,
    shape: form.shape
  };
  const Data = __data;
  const FormId = writable(options.id ?? form.id);
  function Context_findValidationForms(data) {
    const forms = Object.values(data).filter((v) => Context_isValidationObject(v) !== false);
    return forms;
  }
  function Context_isValidationObject(object) {
    if (!object || typeof object !== "object")
      return false;
    if (!("valid" in object && "errors" in object && typeof object.valid === "boolean")) {
      return false;
    }
    return "id" in object && typeof object.id === "string" ? object.id : false;
  }
  const _formData = writable(form.data);
  const Form$1 = {
    subscribe: _formData.subscribe,
    set: (value, options2 = {}) => {
      const newData = clone$1(value);
      Tainted_update(newData, options2.taint ?? true);
      return _formData.set(newData);
    },
    update: (updater, options2 = {}) => {
      return _formData.update((value) => {
        const newData = updater(value);
        Tainted_update(newData, options2.taint ?? true);
        return newData;
      });
    }
  };
  function Form_isSPA() {
    return options.SPA === true || typeof options.SPA === "object";
  }
  function Form_resultStatus(defaultStatus) {
    if (defaultStatus > 400)
      return defaultStatus;
    return (typeof options.SPA === "boolean" || typeof options.SPA === "string" ? void 0 : options.SPA?.failStatus) || defaultStatus;
  }
  async function Form_validate(opts = {}) {
    const dataToValidate = opts.formData ?? Data.form;
    let errors = {};
    let status;
    const validator = opts.adapter ?? options.validators;
    if (typeof validator == "object") {
      if (validator != initialValidator && !("jsonSchema" in validator)) {
        throw new SuperFormError('Client validation adapter found in options.validators. A full adapter must be used when changing validators dynamically, for example "zod" instead of "zodClient".');
      }
      status = await /* @__PURE__ */ validator.validate(dataToValidate);
      if (!status.success) {
        errors = mapErrors(status.issues, validator.shape ?? Data.shape ?? {});
      } else if (opts.recheckValidData !== false) {
        return Form_validate({ ...opts, recheckValidData: false });
      }
    } else {
      status = { success: true, data: {} };
    }
    const data = { ...Data.form, ...dataToValidate, ...status.success ? status.data : {} };
    return {
      valid: status.success,
      posted: false,
      errors,
      data,
      constraints: Data.constraints,
      message: void 0,
      id: Data.formId,
      shape: Data.shape
    };
  }
  function Form__changeEvent(event) {
    if (!options.onChange || !event.paths.length || event.type == "blur")
      return;
    let changeEvent;
    const paths = event.paths.map(mergePath);
    if (event.type && event.paths.length == 1 && event.formElement && event.target instanceof Element) {
      changeEvent = {
        path: paths[0],
        paths,
        formElement: event.formElement,
        target: event.target,
        set(path, value, options2) {
          fieldProxy({ form: Form$1 }, path, options2).set(value);
        },
        get(path) {
          return get_store_value(fieldProxy(Form$1, path));
        }
      };
    } else {
      changeEvent = {
        paths,
        target: void 0,
        set(path, value, options2) {
          fieldProxy({ form: Form$1 }, path, options2).set(value);
        },
        get(path) {
          return get_store_value(fieldProxy(Form$1, path));
        }
      };
    }
    options.onChange(changeEvent);
  }
  async function Form_clientValidation(event, force = false, adapter) {
    if (event) {
      if (options.validators == "clear") {
        Errors.update(($errors) => {
          setPaths($errors, event.paths, void 0);
          return $errors;
        });
      }
      setTimeout(() => Form__changeEvent(event));
    }
    let skipValidation = false;
    if (!force) {
      if (options.validationMethod == "onsubmit" || options.validationMethod == "submit-only") {
        skipValidation = true;
      } else if (options.validationMethod == "onblur" && event?.type == "input")
        skipValidation = true;
      else if (options.validationMethod == "oninput" && event?.type == "blur")
        skipValidation = true;
    }
    if (skipValidation || !event || !options.validators || options.validators == "clear") {
      if (event?.paths) {
        const formElement = event?.formElement ?? EnhancedForm_get();
        if (formElement)
          Form__clearCustomValidity(formElement);
      }
      return;
    }
    const result = await Form_validate({ adapter });
    if (result.valid && (event.immediate || event.type != "input")) {
      Form$1.set(result.data, { taint: "ignore" });
    }
    await tick();
    Form__displayNewErrors(result.errors, event, force);
    return result;
  }
  function Form__clearCustomValidity(formElement) {
    const validity = /* @__PURE__ */ new Map();
    if (options.customValidity && formElement) {
      for (const el of formElement.querySelectorAll(`[name]`)) {
        if (typeof el.name !== "string" || !el.name.length)
          continue;
        const message = "validationMessage" in el ? String(el.validationMessage) : "";
        validity.set(el.name, { el, message });
        updateCustomValidity(el, void 0);
      }
    }
    return validity;
  }
  async function Form__displayNewErrors(errors, event, force) {
    const { type, immediate, multiple, paths } = event;
    const previous = Data.errors;
    const output = {};
    let validity = /* @__PURE__ */ new Map();
    const formElement = event.formElement ?? EnhancedForm_get();
    if (formElement)
      validity = Form__clearCustomValidity(formElement);
    traversePaths(errors, (error) => {
      if (!Array.isArray(error.value))
        return;
      const currentPath = [...error.path];
      if (currentPath[currentPath.length - 1] == "_errors") {
        currentPath.pop();
      }
      const joinedPath = currentPath.join(".");
      function addError() {
        setPaths(output, [error.path], error.value);
        if (options.customValidity && isEventError && validity.has(joinedPath)) {
          const { el, message } = validity.get(joinedPath);
          if (message != error.value) {
            setTimeout(() => updateCustomValidity(el, error.value));
            validity.clear();
          }
        }
      }
      if (force)
        return addError();
      const lastPath = error.path[error.path.length - 1];
      const isObjectError = lastPath == "_errors";
      const isEventError = error.value && paths.some((path) => {
        return isObjectError ? currentPath && path && currentPath.length > 0 && currentPath[0] == path[0] : joinedPath == path.join(".");
      });
      if (isEventError && options.validationMethod == "oninput")
        return addError();
      if (immediate && !multiple && isEventError)
        return addError();
      if (multiple) {
        const errorPath = pathExists(get_store_value(Errors), error.path.slice(0, -1));
        if (errorPath?.value && typeof errorPath?.value == "object") {
          for (const errors2 of Object.values(errorPath.value)) {
            if (Array.isArray(errors2)) {
              return addError();
            }
          }
        }
      }
      const previousError = pathExists(previous, error.path);
      if (previousError && previousError.key in previousError.parent) {
        return addError();
      }
      if (isObjectError) {
        if (options.validationMethod == "oninput" || type == "blur" && Tainted_hasBeenTainted(mergePath(error.path.slice(0, -1)))) {
          return addError();
        }
      } else {
        if (type == "blur" && isEventError) {
          return addError();
        }
      }
    });
    Errors.set(output);
  }
  function Form_set(data, options2 = {}) {
    if (options2.keepFiles) {
      traversePaths(Data.form, (info) => {
        if (info.value instanceof File || browser) {
          const dataPath = pathExists(data, info.path);
          if (!dataPath || !(dataPath.key in dataPath.parent)) {
            setPaths(data, [info.path], info.value);
          }
        }
      });
    }
    return Form$1.set(data, options2);
  }
  function Form_shouldReset(validForm, successActionResult) {
    return validForm && successActionResult && options.resetForm && (options.resetForm === true || options.resetForm());
  }
  function Form_capture(removeFilesfromData = true) {
    let data = Data.form;
    let tainted = Data.tainted;
    if (removeFilesfromData) {
      const removed = removeFiles(Data.form);
      data = removed.data;
      const paths = removed.paths;
      if (paths.length) {
        tainted = clone$1(tainted) ?? {};
        setPaths(tainted, paths, false);
      }
    }
    return {
      valid: Data.valid,
      posted: Data.posted,
      errors: Data.errors,
      data,
      constraints: Data.constraints,
      message: Data.message,
      id: Data.formId,
      tainted,
      shape: Data.shape
    };
  }
  async function Form_updateFromValidation(form2, successResult) {
    if (form2.valid && successResult && Form_shouldReset(form2.valid, successResult)) {
      Form_reset({ message: form2.message, posted: true });
    } else {
      rebind({
        form: form2,
        untaint: successResult,
        keepFiles: true,
        // Check if the form data should be used for updating, or if the invalidateAll load function should be used:
        skipFormData: options.invalidateAll == "force"
      });
    }
    if (formEvents.onUpdated.length) {
      await tick();
    }
    for (const event of formEvents.onUpdated) {
      event({ form: form2 });
    }
  }
  function Form_reset(opts = {}) {
    if (opts.newState)
      initialForm.data = { ...initialForm.data, ...opts.newState };
    const resetData = clone$1(initialForm);
    resetData.data = { ...resetData.data, ...opts.data };
    if (opts.id !== void 0)
      resetData.id = opts.id;
    rebind({
      form: resetData,
      untaint: true,
      message: opts.message,
      keepFiles: false,
      posted: opts.posted,
      resetted: true
    });
  }
  async function Form_updateFromActionResult(result) {
    if (result.type == "error") {
      throw new SuperFormError(`ActionResult of type "${result.type}" cannot be passed to update function.`);
    }
    if (result.type == "redirect") {
      if (Form_shouldReset(true, true))
        Form_reset({ posted: true });
      return;
    }
    if (typeof result.data !== "object") {
      throw new SuperFormError("Non-object validation data returned from ActionResult.");
    }
    const forms = Context_findValidationForms(result.data);
    if (!forms.length) {
      throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
    }
    for (const newForm of forms) {
      if (newForm.id !== Data.formId)
        continue;
      await Form_updateFromValidation(newForm, result.status >= 200 && result.status < 300);
    }
  }
  const Message = writable(__data.message);
  const Constraints = writable(__data.constraints);
  const Posted = writable(__data.posted);
  const Shape = writable(__data.shape);
  const _errors = writable(form.errors);
  const Errors = {
    subscribe: _errors.subscribe,
    set(value, options2) {
      return _errors.set(updateErrors(value, Data.errors, options2?.force));
    },
    update(updater, options2) {
      return _errors.update((value) => {
        return updateErrors(updater(value), Data.errors, options2?.force);
      });
    },
    /**
     * To work with client-side validation, errors cannot be deleted but must
     * be set to undefined, to know where they existed before (tainted+error check in oninput)
     */
    clear: () => Errors.set({})
  };
  let NextChange = null;
  function NextChange_setHtmlEvent(event) {
    if (NextChange && event && Object.keys(event).length == 1 && event.paths?.length && NextChange.target && NextChange.target instanceof HTMLInputElement && NextChange.target.type.toLowerCase() == "file") {
      NextChange.paths = event.paths;
    } else {
      NextChange = event;
    }
    setTimeout(() => {
      Form_clientValidation(NextChange);
    }, 0);
  }
  function NextChange_additionalEventInformation(event, immediate, multiple, formElement, target) {
    if (NextChange === null) {
      NextChange = { paths: [] };
    }
    NextChange.type = event;
    NextChange.immediate = immediate;
    NextChange.multiple = multiple;
    NextChange.formElement = formElement;
    NextChange.target = target;
  }
  function NextChange_paths() {
    return NextChange?.paths ?? [];
  }
  function NextChange_clear() {
    NextChange = null;
  }
  const Tainted = {
    defaultMessage: "Leave page? Changes that you made may not be saved.",
    state: writable(),
    message: options.taintedMessage,
    clean: clone$1(form.data),
    // Important to clone form.data, so it's not comparing the same object,
    forceRedirection: false
  };
  function Tainted_enable() {
    options.taintedMessage = Tainted.message;
  }
  function Tainted_currentState() {
    return Tainted.state;
  }
  function Tainted_hasBeenTainted(path) {
    if (!Data.tainted)
      return false;
    if (!path)
      return !!Data.tainted;
    const field = pathExists(Data.tainted, splitPath(path));
    return !!field && field.key in field.parent;
  }
  function Tainted_isTainted(path) {
    if (!arguments.length)
      return Tainted__isObjectTainted(Data.tainted);
    if (typeof path === "boolean")
      return path;
    if (typeof path === "object")
      return Tainted__isObjectTainted(path);
    if (!Data.tainted || path === void 0)
      return false;
    const field = pathExists(Data.tainted, splitPath(path));
    return Tainted__isObjectTainted(field?.value);
  }
  function Tainted__isObjectTainted(obj) {
    if (!obj)
      return false;
    if (typeof obj === "object") {
      for (const obj2 of Object.values(obj)) {
        if (Tainted__isObjectTainted(obj2))
          return true;
      }
    }
    return obj === true;
  }
  function Tainted_update(newData, taintOptions) {
    if (taintOptions == "ignore")
      return;
    const paths = comparePaths(newData, Data.form);
    const newTainted = comparePaths(newData, Tainted.clean).map((path) => path.join());
    if (paths.length) {
      if (taintOptions == "untaint-all" || taintOptions == "untaint-form") {
        Tainted.state.set(void 0);
      } else {
        Tainted.state.update((currentlyTainted) => {
          if (!currentlyTainted)
            currentlyTainted = {};
          setPaths(currentlyTainted, paths, (path, data) => {
            if (!newTainted.includes(path.join()))
              return void 0;
            const currentValue = traversePath(newData, path);
            const cleanPath = traversePath(Tainted.clean, path);
            return currentValue && cleanPath && currentValue.value === cleanPath.value ? void 0 : taintOptions === true ? true : taintOptions === "untaint" ? void 0 : data.value;
          });
          return currentlyTainted;
        });
      }
      NextChange_setHtmlEvent({ paths });
    }
  }
  function Tainted_set(tainted, newClean) {
    Tainted.state.set(tainted);
    if (newClean)
      Tainted.clean = newClean;
  }
  const Submitting = writable(false);
  const Delayed = writable(false);
  const Timeout = writable(false);
  const Unsubscriptions = [
    // eslint-disable-next-line dci-lint/private-role-access
    Tainted.state.subscribe((tainted) => __data.tainted = clone$1(tainted)),
    // eslint-disable-next-line dci-lint/private-role-access
    Form$1.subscribe((form2) => __data.form = clone$1(form2)),
    // eslint-disable-next-line dci-lint/private-role-access
    Errors.subscribe((errors) => __data.errors = clone$1(errors)),
    FormId.subscribe((id) => __data.formId = id),
    Constraints.subscribe((constraints) => __data.constraints = constraints),
    Posted.subscribe((posted) => __data.posted = posted),
    Message.subscribe((message) => __data.message = message),
    Submitting.subscribe((submitting) => __data.submitting = submitting),
    Shape.subscribe((shape) => __data.shape = shape)
  ];
  function Unsubscriptions_unsubscribe() {
    Unsubscriptions.forEach((unsub) => unsub());
  }
  let EnhancedForm;
  function EnhancedForm_get() {
    return EnhancedForm;
  }
  function EnhancedForm_setAction(action) {
    if (EnhancedForm)
      EnhancedForm.action = action;
  }
  function EnhancedForm_destroy() {
    if (EnhancedForm?.parentElement) {
      EnhancedForm.remove();
    }
    EnhancedForm = void 0;
  }
  const AllErrors = derived(Errors, ($errors) => $errors ? flattenErrors($errors) : []);
  options.taintedMessage = void 0;
  function rebind(opts) {
    const form2 = opts.form;
    const message = opts.message ?? form2.message;
    if (opts.untaint || opts.resetted) {
      Tainted_set(typeof opts.untaint === "boolean" ? void 0 : opts.untaint, form2.data);
    }
    if (opts.skipFormData !== true) {
      Form_set(form2.data, {
        taint: "ignore",
        keepFiles: opts.keepFiles
      });
    }
    Message.set(message);
    if (opts.resetted)
      Errors.update(() => ({}), { force: true });
    else
      Errors.set(form2.errors);
    FormId.set(form2.id);
    Posted.set(opts.posted ?? form2.posted);
    if (form2.constraints)
      Constraints.set(form2.constraints);
    if (form2.shape)
      Shape.set(form2.shape);
    __data.valid = form2.valid;
    if (options.flashMessage && shouldSyncFlash(options)) {
      const flash = options.flashMessage.module.getFlash(page);
      if (message && get_store_value(flash) === void 0) {
        flash.set(message);
      }
    }
  }
  const formEvents = {
    onSubmit: options.onSubmit ? [options.onSubmit] : [],
    onResult: options.onResult ? [options.onResult] : [],
    onUpdate: options.onUpdate ? [options.onUpdate] : [],
    onUpdated: options.onUpdated ? [options.onUpdated] : [],
    onError: options.onError ? [options.onError] : []
  };
  function superFormEnhance(FormElement, events) {
    if (options.SPA !== void 0 && FormElement.method == "get")
      FormElement.method = "post";
    if (typeof options.SPA === "string") {
      if (options.SPA.length && FormElement.action == document.location.href) {
        FormElement.action = options.SPA;
      }
    } else {
      EnhancedForm = FormElement;
    }
    if (events) {
      if (events.onError) {
        if (options.onError === "apply") {
          throw new SuperFormError('options.onError is set to "apply", cannot add any onError events.');
        } else if (events.onError === "apply") {
          throw new SuperFormError('Cannot add "apply" as onError event in use:enhance.');
        }
        formEvents.onError.push(events.onError);
      }
      if (events.onResult)
        formEvents.onResult.push(events.onResult);
      if (events.onSubmit)
        formEvents.onSubmit.push(events.onSubmit);
      if (events.onUpdate)
        formEvents.onUpdate.push(events.onUpdate);
      if (events.onUpdated)
        formEvents.onUpdated.push(events.onUpdated);
    }
    Tainted_enable();
    let lastInputChange;
    async function onInput(e) {
      const info = inputInfo(e.target);
      if (info.immediate && !info.file)
        await new Promise((r) => setTimeout(r, 0));
      lastInputChange = NextChange_paths();
      NextChange_additionalEventInformation("input", info.immediate, info.multiple, FormElement, e.target ?? void 0);
    }
    async function onBlur(e) {
      if (Data.submitting)
        return;
      if (!lastInputChange || NextChange_paths() != lastInputChange) {
        return;
      }
      const info = inputInfo(e.target);
      if (info.immediate && !info.file)
        await new Promise((r) => setTimeout(r, 0));
      Form_clientValidation({
        paths: lastInputChange,
        immediate: info.multiple,
        multiple: info.multiple,
        type: "blur",
        formElement: FormElement,
        target: e.target ?? void 0
      });
      lastInputChange = void 0;
    }
    FormElement.addEventListener("focusout", onBlur);
    FormElement.addEventListener("input", onInput);
    onDestroy(() => {
      FormElement.removeEventListener("focusout", onBlur);
      FormElement.removeEventListener("input", onInput);
    });
    const htmlForm = Form(FormElement, { submitting: Submitting, delayed: Delayed, timeout: Timeout }, options);
    let currentRequest;
    let customRequest = void 0;
    const enhanced = enhance(FormElement, async (submitParams) => {
      let jsonData = void 0;
      let validationAdapter = options.validators;
      const submit = {
        ...submitParams,
        jsonData(data) {
          if (options.dataType !== "json") {
            throw new SuperFormError("options.dataType must be set to 'json' to use jsonData.");
          }
          jsonData = data;
        },
        validators(adapter) {
          validationAdapter = adapter;
        },
        customRequest(request) {
          customRequest = request;
        }
      };
      const _submitCancel = submit.cancel;
      let cancelled = false;
      function clientValidationResult(validation) {
        const validationResult = { ...validation, posted: true };
        const status = validationResult.valid ? 200 : Form_resultStatus(400);
        const data = { form: validationResult };
        const result = validationResult.valid ? { type: "success", status, data } : { type: "failure", status, data };
        setTimeout(() => validationResponse({ result }), 0);
      }
      function clearOnSubmit() {
        switch (options.clearOnSubmit) {
          case "errors-and-message":
            Errors.clear();
            Message.set(void 0);
            break;
          case "errors":
            Errors.clear();
            break;
          case "message":
            Message.set(void 0);
            break;
        }
      }
      async function triggerOnError(result, status) {
        result.status = status;
        if (options.onError !== "apply") {
          const event = { result, message: Message, form };
          for (const onErrorEvent of formEvents.onError) {
            if (onErrorEvent !== "apply" && (onErrorEvent != defaultOnError || !options.flashMessage?.onError)) {
              await onErrorEvent(event);
            }
          }
        }
        if (options.flashMessage && options.flashMessage.onError) {
          await options.flashMessage.onError({
            result,
            flashMessage: options.flashMessage.module.getFlash(page)
          });
        }
        if (options.applyAction) {
          if (options.onError == "apply") {
            await applyAction();
          } else {
            await applyAction({
              type: "failure",
              status: Form_resultStatus(result.status),
              data: result
            });
          }
        }
      }
      function cancel(opts = {
        resetTimers: true
      }) {
        cancelled = true;
        if (opts.resetTimers && htmlForm.isSubmitting()) {
          htmlForm.completed({ cancelled });
        }
        return _submitCancel();
      }
      submit.cancel = cancel;
      if (htmlForm.isSubmitting() && options.multipleSubmits == "prevent") {
        cancel({ resetTimers: false });
      } else {
        if (htmlForm.isSubmitting() && options.multipleSubmits == "abort") {
          if (currentRequest)
            currentRequest.abort();
        }
        htmlForm.submitting();
        currentRequest = submit.controller;
        for (const event of formEvents.onSubmit) {
          try {
            await event(submit);
          } catch (error) {
            cancel();
            triggerOnError({ type: "error", error }, 500);
          }
        }
      }
      if (cancelled && options.flashMessage)
        cancelFlash(options);
      if (!cancelled) {
        const noValidate = !Form_isSPA() && (FormElement.noValidate || (submit.submitter instanceof HTMLButtonElement || submit.submitter instanceof HTMLInputElement) && submit.submitter.formNoValidate);
        let validation = void 0;
        const validateForm = async () => {
          return await Form_validate({ adapter: validationAdapter });
        };
        clearOnSubmit();
        if (!noValidate) {
          validation = await validateForm();
          if (!validation.valid) {
            cancel({ resetTimers: false });
            clientValidationResult(validation);
          }
        }
        if (!cancelled) {
          if (options.flashMessage && (options.clearOnSubmit == "errors-and-message" || options.clearOnSubmit == "message") && shouldSyncFlash(options)) {
            options.flashMessage.module.getFlash(page).set(void 0);
          }
          const submitData = "formData" in submit ? submit.formData : submit.data;
          lastInputChange = void 0;
          if (Form_isSPA()) {
            if (!validation)
              validation = await validateForm();
            cancel({ resetTimers: false });
            clientValidationResult(validation);
          } else if (options.dataType === "json") {
            if (!validation)
              validation = await validateForm();
            const postData = clone$1(jsonData ?? validation.data);
            traversePaths(postData, (data) => {
              if (data.value instanceof File) {
                const key = "__superform_file_" + mergePath(data.path);
                submitData.append(key, data.value);
                return data.set(void 0);
              } else if (Array.isArray(data.value) && data.value.length && data.value.every((v) => v instanceof File)) {
                const key = "__superform_files_" + mergePath(data.path);
                for (const file of data.value) {
                  submitData.append(key, file);
                }
                return data.set(void 0);
              }
            });
            Object.keys(postData).forEach((key) => {
              if (typeof submitData.get(key) === "string") {
                submitData.delete(key);
              }
            });
            const chunks = chunkSubstr(stringify(postData), options.jsonChunkSize ?? 5e5);
            for (const chunk of chunks) {
              submitData.append("__superform_json", chunk);
            }
          }
          if (!submitData.has("__superform_id")) {
            const id = Data.formId;
            if (id !== void 0)
              submitData.set("__superform_id", id);
          }
          if (typeof options.SPA === "string") {
            EnhancedForm_setAction(options.SPA);
          }
        }
      }
      function chunkSubstr(str, size) {
        const numChunks = Math.ceil(str.length / size);
        const chunks = new Array(numChunks);
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
          chunks[i] = str.substring(o, o + size);
        }
        return chunks;
      }
      async function validationResponse(event) {
        let cancelled2 = false;
        currentRequest = null;
        let result = "type" in event.result && "status" in event.result ? event.result : {
          type: "error",
          status: Form_resultStatus(parseInt(String(event.result.status)) || 500),
          error: event.result.error instanceof Error ? event.result.error : event.result
        };
        const cancel2 = () => cancelled2 = true;
        const data = {
          result,
          formEl: FormElement,
          formElement: FormElement,
          cancel: cancel2
        };
        const unsubCheckforNav = STORYBOOK_MODE || !Form_isSPA() ? () => {
        } : navigating.subscribe(($nav) => {
          if (!$nav || $nav.from?.route.id === $nav.to?.route.id)
            return;
          cancel2();
        });
        function setErrorResult(error, data2, status) {
          data2.result = {
            type: "error",
            error,
            status: Form_resultStatus(status)
          };
        }
        for (const event2 of formEvents.onResult) {
          try {
            await event2(data);
          } catch (error) {
            setErrorResult(error, data, Math.max(result.status ?? 500, 400));
          }
        }
        result = data.result;
        if (!cancelled2) {
          if ((result.type === "success" || result.type === "failure") && result.data) {
            const forms = Context_findValidationForms(result.data);
            if (!forms.length) {
              throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
            }
            for (const newForm of forms) {
              if (newForm.id !== Data.formId)
                continue;
              const data2 = {
                form: newForm,
                formEl: FormElement,
                formElement: FormElement,
                cancel: () => cancelled2 = true,
                result
              };
              for (const event2 of formEvents.onUpdate) {
                try {
                  await event2(data2);
                } catch (error) {
                  setErrorResult(error, data2, Math.max(result.status ?? 500, 400));
                }
              }
              result = data2.result;
              if (!cancelled2) {
                if (options.customValidity) {
                  setCustomValidityForm(FormElement, data2.form.errors);
                }
                if (Form_shouldReset(data2.form.valid, result.type == "success")) {
                  data2.formElement.querySelectorAll('input[type="file"]').forEach((e) => e.value = "");
                }
              }
            }
          }
          if (!cancelled2) {
            if (result.type !== "error") {
              if (result.type === "success" && options.invalidateAll) {
                await invalidateAll();
              }
              if (options.applyAction) {
                await applyAction();
              } else {
                await Form_updateFromActionResult(result);
              }
            } else {
              await triggerOnError(result, Math.max(result.status ?? 500, 400));
            }
          }
        }
        if (cancelled2 && options.flashMessage) {
          cancelFlash(options);
        }
        if (cancelled2 || result.type != "redirect") {
          htmlForm.completed({ cancelled: cancelled2 });
        } else if (STORYBOOK_MODE) {
          htmlForm.completed({ cancelled: cancelled2, clearAll: true });
        } else {
          const unsub = navigating.subscribe(($nav) => {
            if ($nav)
              return;
            setTimeout(() => {
              try {
                if (unsub)
                  unsub();
              } catch {
              }
            });
            if (htmlForm.isSubmitting()) {
              htmlForm.completed({ cancelled: cancelled2, clearAll: true });
            }
          });
        }
        unsubCheckforNav();
      }
      if (!cancelled && customRequest) {
        _submitCancel();
        const response = await customRequest(submitParams);
        let result;
        if (response instanceof Response) {
          result = deserialize(await response.text());
        } else if (response instanceof XMLHttpRequest) {
          result = deserialize(response.responseText);
        } else {
          result = response;
        }
        if (result.type === "error")
          result.status = response.status;
        validationResponse({ result });
      }
      return validationResponse;
    });
    return {
      destroy: () => {
        for (const [name, events2] of Object.entries(formEvents)) {
          formEvents[name] = events2.filter((e) => e === options[name]);
        }
        enhanced.destroy();
      }
    };
  }
  function removeFiles(formData) {
    const paths = [];
    traversePaths(formData, (data2) => {
      if (data2.value instanceof File) {
        paths.push(data2.path);
        return "skip";
      } else if (Array.isArray(data2.value) && data2.value.length && data2.value.every((d) => d instanceof File)) {
        paths.push(data2.path);
        return "skip";
      }
    });
    if (!paths.length)
      return { data: formData, paths };
    const data = clone$1(formData);
    setPaths(data, paths, (path) => pathExists(initialForm.data, path)?.value);
    return { data, paths };
  }
  return {
    form: Form$1,
    formId: FormId,
    errors: Errors,
    message: Message,
    constraints: Constraints,
    tainted: Tainted_currentState(),
    submitting: readonly(Submitting),
    delayed: readonly(Delayed),
    timeout: readonly(Timeout),
    options,
    capture: Form_capture,
    restore: (snapshot) => {
      rebind({ form: snapshot, untaint: snapshot.tainted ?? true });
    },
    async validate(path, opts = {}) {
      if (!options.validators) {
        throw new SuperFormError("options.validators must be set to use the validate method.");
      }
      if (opts.update === void 0)
        opts.update = true;
      if (opts.taint === void 0)
        opts.taint = false;
      if (typeof opts.errors == "string")
        opts.errors = [opts.errors];
      let data;
      const splittedPath = splitPath(path);
      if ("value" in opts) {
        if (opts.update === true || opts.update === "value") {
          Form$1.update(($form) => {
            setPaths($form, [splittedPath], opts.value);
            return $form;
          }, { taint: opts.taint });
          data = Data.form;
        } else {
          data = clone$1(Data.form);
          setPaths(data, [splittedPath], opts.value);
        }
      } else {
        data = Data.form;
      }
      const result = await Form_validate({ formData: data });
      const error = pathExists(result.errors, splittedPath);
      if (error && error.value && opts.errors) {
        error.value = opts.errors;
      }
      if (opts.update === true || opts.update == "errors") {
        Errors.update(($errors) => {
          setPaths($errors, [splittedPath], error?.value);
          return $errors;
        });
      }
      return error?.value;
    },
    async validateForm(opts = {}) {
      if (!options.validators && !opts.schema) {
        throw new SuperFormError("options.validators or the schema option must be set to use the validateForm method.");
      }
      const result = opts.update ? await Form_clientValidation({ paths: [] }, true, opts.schema) : Form_validate({ adapter: opts.schema });
      const enhancedForm = EnhancedForm_get();
      if (opts.update && enhancedForm) {
        setTimeout(() => {
          if (!enhancedForm)
            return;
          scrollToFirstError(enhancedForm, {
            ...options,
            scrollToError: opts.focusOnError === false ? "off" : options.scrollToError
          });
        }, 1);
      }
      return result || Form_validate({ adapter: opts.schema });
    },
    allErrors: AllErrors,
    posted: Posted,
    reset(options2) {
      return Form_reset({
        message: options2?.keepMessage ? Data.message : void 0,
        data: options2?.data,
        id: options2?.id,
        newState: options2?.newState
      });
    },
    submit(submitter) {
      const form2 = EnhancedForm_get() ? EnhancedForm_get() : submitter && submitter instanceof HTMLElement ? submitter.closest("form") : void 0;
      if (!form2) {
        throw new SuperFormError("use:enhance must be added to the form to use submit, or pass a HTMLElement inside the form (or the form itself) as an argument.");
      }
      if (!form2.requestSubmit) {
        return form2.submit();
      }
      const isSubmitButton = submitter && (submitter instanceof HTMLButtonElement && submitter.type == "submit" || submitter instanceof HTMLInputElement && ["submit", "image"].includes(submitter.type));
      form2.requestSubmit(isSubmitButton ? submitter : void 0);
    },
    isTainted: Tainted_isTainted,
    enhance: superFormEnhance
  };
}
let legacyMode = false;
try {
  if (SUPERFORMS_LEGACY)
    legacyMode = true;
} catch {
}
const unionError = 'FormData parsing failed: Unions are only supported when the dataType option for superForm is set to "json".';
async function parseRequest(data, schemaData, options) {
  let parsed;
  if (data instanceof FormData) {
    parsed = parseFormData(data, schemaData, options);
  } else if (data instanceof URL || data instanceof URLSearchParams) {
    parsed = parseSearchParams(data, schemaData, options);
  } else if (data instanceof Request) {
    parsed = await tryParseFormData(data, schemaData, options);
  } else if (
    // RequestEvent
    data && typeof data === "object" && "request" in data && data.request instanceof Request
  ) {
    parsed = await tryParseFormData(data.request, schemaData, options);
  } else {
    parsed = {
      id: void 0,
      data,
      posted: false
    };
  }
  return parsed;
}
async function tryParseFormData(request, schemaData, options) {
  let formData = void 0;
  try {
    formData = await request.formData();
  } catch (e) {
    if (e instanceof TypeError && e.message.includes("already been consumed")) {
      throw e;
    }
    return { id: void 0, data: void 0, posted: false };
  }
  return parseFormData(formData, schemaData, options);
}
function parseSearchParams(data, schemaData, options) {
  if (data instanceof URL)
    data = data.searchParams;
  const convert = new FormData();
  for (const [key, value] of data.entries()) {
    convert.append(key, value);
  }
  const output = parseFormData(convert, schemaData, options);
  output.posted = false;
  return output;
}
function parseFormData(formData, schemaData, options) {
  function tryParseSuperJson() {
    if (formData.has("__superform_json")) {
      try {
        const output = parse(formData.getAll("__superform_json").join("") ?? "");
        if (typeof output === "object") {
          const filePaths = Array.from(formData.keys());
          for (const path of filePaths.filter((path2) => path2.startsWith("__superform_file_"))) {
            const realPath = splitPath(path.substring(17));
            setPaths(output, [realPath], formData.get(path));
          }
          for (const path of filePaths.filter((path2) => path2.startsWith("__superform_files_"))) {
            const realPath = splitPath(path.substring(18));
            const allFiles = formData.getAll(path);
            setPaths(output, [realPath], Array.from(allFiles));
          }
          return output;
        }
      } catch {
      }
    }
    return null;
  }
  const data = tryParseSuperJson();
  const id = formData.get("__superform_id")?.toString();
  return data ? { id, data, posted: true } : {
    id,
    data: _parseFormData(formData, schemaData, options),
    posted: true
  };
}
function _parseFormData(formData, schema, options) {
  const output = {};
  let schemaKeys;
  if (options?.strict) {
    schemaKeys = new Set([...formData.keys()].filter((key) => !key.startsWith("__superform_")));
  } else {
    let unionKeys = [];
    if (schema.anyOf) {
      const info = schemaInfo(schema, false, []);
      if (info.union?.some((s) => s.type !== "object")) {
        throw new SchemaError("All form types must be an object if schema is a union.");
      }
      unionKeys = info.union?.flatMap((s) => Object.keys(s.properties ?? {})) ?? [];
    }
    schemaKeys = new Set([
      ...unionKeys,
      ...Object.keys(schema.properties ?? {}),
      ...schema.additionalProperties ? formData.keys() : []
    ].filter((key) => !key.startsWith("__superform_")));
  }
  function parseSingleEntry(key, entry, info) {
    if (options?.preprocessed && options.preprocessed.includes(key)) {
      return entry;
    }
    if (entry && typeof entry !== "string") {
      const allowFiles = legacyMode ? options?.allowFiles === true : options?.allowFiles !== false;
      return !allowFiles ? void 0 : entry.size ? entry : info.isNullable ? null : void 0;
    }
    if (info.types.length > 1) {
      throw new SchemaError(unionError, key);
    }
    const [type] = info.types;
    return parseFormDataEntry(key, entry, type ?? "any", info);
  }
  const defaultPropertyType = typeof schema.additionalProperties == "object" ? schema.additionalProperties : { type: "string" };
  for (const key of schemaKeys) {
    const property = schema.properties ? schema.properties[key] : defaultPropertyType;
    assertSchema(property, key);
    const info = schemaInfo(property ?? defaultPropertyType, !schema.required?.includes(key), [
      key
    ]);
    if (!info)
      continue;
    if (!info.types.includes("boolean") && !schema.additionalProperties && !formData.has(key)) {
      continue;
    }
    const entries = formData.getAll(key);
    if (info.union && info.union.length > 1) {
      throw new SchemaError(unionError, key);
    }
    if (info.types.includes("array") || info.types.includes("set")) {
      const items = property.items ?? (info.union?.length == 1 ? info.union[0] : void 0);
      if (!items || typeof items == "boolean" || Array.isArray(items) && items.length != 1) {
        throw new SchemaError('Arrays must have a single "items" property that defines its type.', key);
      }
      const arrayType = Array.isArray(items) ? items[0] : items;
      assertSchema(arrayType, key);
      const arrayInfo = schemaInfo(arrayType, info.isOptional, [key]);
      if (!arrayInfo)
        continue;
      const isFileArray = entries.length && entries.some((e) => e && typeof e !== "string");
      const arrayData = entries.map((e) => parseSingleEntry(key, e, arrayInfo));
      if (isFileArray && arrayData.every((file) => !file))
        arrayData.length = 0;
      output[key] = info.types.includes("set") ? new Set(arrayData) : arrayData;
    } else {
      output[key] = parseSingleEntry(key, entries[entries.length - 1], info);
    }
  }
  return output;
}
function parseFormDataEntry(key, value, type, info) {
  if (!value) {
    if (type == "boolean" && info.isOptional && info.schema.default === true) {
      return false;
    }
    const defaultValue2 = defaultValues(info.schema, info.isOptional, [key]);
    if (info.schema.enum && defaultValue2 !== null && defaultValue2 !== void 0) {
      return value;
    }
    if (defaultValue2 !== void 0)
      return defaultValue2;
    if (info.isNullable)
      return null;
    if (info.isOptional)
      return void 0;
  }
  function typeError() {
    throw new SchemaError(type[0].toUpperCase() + type.slice(1) + ` type found. Set the dataType option to "json" and add use:enhance on the client to use nested data structures. More information: https://superforms.rocks/concepts/nested-data`, key);
  }
  switch (type) {
    case "string":
    case "any":
      return value;
    case "integer":
      return parseInt(value ?? "", 10);
    case "number":
      return parseFloat(value ?? "");
    case "boolean":
      return Boolean(value == "false" ? "" : value).valueOf();
    case "unix-time": {
      const date = new Date(value ?? "");
      return !isNaN(date) ? date : void 0;
    }
    case "bigint":
      return BigInt(value ?? ".");
    case "symbol":
      return Symbol(String(value));
    case "set":
    case "array":
    case "object":
      return typeError();
    default:
      throw new SuperFormError("Unsupported schema type for FormData: " + type);
  }
}

const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const defaultOptions$1 = {
    name: undefined,
    $refStrategy: "root",
    basePath: ["#"],
    effectStrategy: "input",
    pipeStrategy: "all",
    dateStrategy: "format:date-time",
    mapStrategy: "entries",
    removeAdditionalStrategy: "passthrough",
    definitionPath: "definitions",
    target: "jsonSchema7",
    strictUnions: false,
    definitions: {},
    errorMessages: false,
    markdownDescription: false,
    patternStrategy: "escape",
    applyRegexFlags: false,
    emailStrategy: "format:email",
    base64Strategy: "contentEncoding:base64",
    nameStrategy: "ref"
};
const getDefaultOptions = (options) => (typeof options === "string"
    ? {
        ...defaultOptions$1,
        name: options,
    }
    : {
        ...defaultOptions$1,
        ...options,
    });

const getRefs = (options) => {
    const _options = getDefaultOptions(options);
    const currentPath = _options.name !== undefined
        ? [..._options.basePath, _options.definitionPath, _options.name]
        : _options.basePath;
    return {
        ..._options,
        currentPath: currentPath,
        propertyPath: undefined,
        seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [
            def._def,
            {
                def: def._def,
                path: [..._options.basePath, _options.definitionPath, name],
                // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
                jsonSchema: undefined,
            },
        ])),
    };
};

function addErrorMessage(res, key, errorMessage, refs) {
    if (!refs?.errorMessages)
        return;
    if (errorMessage) {
        res.errorMessage = {
            ...res.errorMessage,
            [key]: errorMessage,
        };
    }
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
    res[key] = value;
    addErrorMessage(res, key, errorMessage, refs);
}

var util;
(function (util) {
    util.assertEqual = (val) => val;
    function assertIs(_arg) { }
    util.assertIs = assertIs;
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
            obj[item] = item;
        }
        return obj;
    };
    util.getValidEnumValues = (obj) => {
        const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
            filtered[k] = obj[k];
        }
        return util.objectValues(filtered);
    };
    util.objectValues = (obj) => {
        return util.objectKeys(obj).map(function (e) {
            return obj[e];
        });
    };
    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
        ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
        : (object) => {
            const keys = [];
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    util.find = (arr, checker) => {
        for (const item of arr) {
            if (checker(item))
                return item;
        }
        return undefined;
    };
    util.isInteger = typeof Number.isInteger === "function"
        ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
        : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
        return array
            .map((val) => (typeof val === "string" ? `'${val}'` : val))
            .join(separator);
    }
    util.joinValues = joinValues;
    util.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    };
})(util || (util = {}));
var objectUtil;
(function (objectUtil) {
    objectUtil.mergeShapes = (first, second) => {
        return {
            ...first,
            ...second, // second overwrites first
        };
    };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
]);
const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return ZodParsedType.undefined;
        case "string":
            return ZodParsedType.string;
        case "number":
            return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
            return ZodParsedType.boolean;
        case "function":
            return ZodParsedType.function;
        case "bigint":
            return ZodParsedType.bigint;
        case "symbol":
            return ZodParsedType.symbol;
        case "object":
            if (Array.isArray(data)) {
                return ZodParsedType.array;
            }
            if (data === null) {
                return ZodParsedType.null;
            }
            if (data.then &&
                typeof data.then === "function" &&
                data.catch &&
                typeof data.catch === "function") {
                return ZodParsedType.promise;
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return ZodParsedType.map;
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return ZodParsedType.set;
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return ZodParsedType.date;
            }
            return ZodParsedType.object;
        default:
            return ZodParsedType.unknown;
    }
};

const ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite",
]);
const quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
class ZodError extends Error {
    constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
            this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
            this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            // eslint-disable-next-line ban/ban
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
    }
    get errors() {
        return this.issues;
    }
    format(_mapper) {
        const mapper = _mapper ||
            function (issue) {
                return issue.message;
            };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
            for (const issue of error.issues) {
                if (issue.code === "invalid_union") {
                    issue.unionErrors.map(processError);
                }
                else if (issue.code === "invalid_return_type") {
                    processError(issue.returnTypeError);
                }
                else if (issue.code === "invalid_arguments") {
                    processError(issue.argumentsError);
                }
                else if (issue.path.length === 0) {
                    fieldErrors._errors.push(mapper(issue));
                }
                else {
                    let curr = fieldErrors;
                    let i = 0;
                    while (i < issue.path.length) {
                        const el = issue.path[i];
                        const terminal = i === issue.path.length - 1;
                        if (!terminal) {
                            curr[el] = curr[el] || { _errors: [] };
                            // if (typeof el === "string") {
                            //   curr[el] = curr[el] || { _errors: [] };
                            // } else if (typeof el === "number") {
                            //   const errorArray: any = [];
                            //   errorArray._errors = [];
                            //   curr[el] = curr[el] || errorArray;
                            // }
                        }
                        else {
                            curr[el] = curr[el] || { _errors: [] };
                            curr[el]._errors.push(mapper(issue));
                        }
                        curr = curr[el];
                        i++;
                    }
                }
            }
        };
        processError(this);
        return fieldErrors;
    }
    static assert(value) {
        if (!(value instanceof ZodError)) {
            throw new Error(`Not a ZodError: ${value}`);
        }
    }
    toString() {
        return this.message;
    }
    get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
        return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
            if (sub.path.length > 0) {
                fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                fieldErrors[sub.path[0]].push(mapper(sub));
            }
            else {
                formErrors.push(mapper(sub));
            }
        }
        return { formErrors, fieldErrors };
    }
    get formErrors() {
        return this.flatten();
    }
}
ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
};

const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
                message = "Required";
            }
            else {
                message = `Expected ${issue.expected}, received ${issue.received}`;
            }
            break;
        case ZodIssueCode.invalid_literal:
            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
            break;
        case ZodIssueCode.unrecognized_keys:
            message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
            break;
        case ZodIssueCode.invalid_union:
            message = `Invalid input`;
            break;
        case ZodIssueCode.invalid_union_discriminator:
            message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
            break;
        case ZodIssueCode.invalid_enum_value:
            message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
            break;
        case ZodIssueCode.invalid_arguments:
            message = `Invalid function arguments`;
            break;
        case ZodIssueCode.invalid_return_type:
            message = `Invalid function return type`;
            break;
        case ZodIssueCode.invalid_date:
            message = `Invalid date`;
            break;
        case ZodIssueCode.invalid_string:
            if (typeof issue.validation === "object") {
                if ("includes" in issue.validation) {
                    message = `Invalid input: must include "${issue.validation.includes}"`;
                    if (typeof issue.validation.position === "number") {
                        message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                    }
                }
                else if ("startsWith" in issue.validation) {
                    message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                }
                else if ("endsWith" in issue.validation) {
                    message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                }
                else {
                    util.assertNever(issue.validation);
                }
            }
            else if (issue.validation !== "regex") {
                message = `Invalid ${issue.validation}`;
            }
            else {
                message = "Invalid";
            }
            break;
        case ZodIssueCode.too_small:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${issue.minimum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${new Date(Number(issue.minimum))}`;
            else
                message = "Invalid input";
            break;
        case ZodIssueCode.too_big:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
            else if (issue.type === "bigint")
                message = `BigInt must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `smaller than or equal to`
                        : `smaller than`} ${new Date(Number(issue.maximum))}`;
            else
                message = "Invalid input";
            break;
        case ZodIssueCode.custom:
            message = `Invalid input`;
            break;
        case ZodIssueCode.invalid_intersection_types:
            message = `Intersection results could not be merged`;
            break;
        case ZodIssueCode.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`;
            break;
        case ZodIssueCode.not_finite:
            message = "Number must be finite";
            break;
        default:
            message = _ctx.defaultError;
            util.assertNever(issue);
    }
    return { message };
};

let overrideErrorMap = errorMap;
function setErrorMap(map) {
    overrideErrorMap = map;
}
function getErrorMap() {
    return overrideErrorMap;
}

const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...(issueData.path || [])];
    const fullIssue = {
        ...issueData,
        path: fullPath,
    };
    if (issueData.message !== undefined) {
        return {
            ...issueData,
            path: fullPath,
            message: issueData.message,
        };
    }
    let errorMessage = "";
    const maps = errorMaps
        .filter((m) => !!m)
        .slice()
        .reverse();
    for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
        ...issueData,
        path: fullPath,
        message: errorMessage,
    };
};
const EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.common.contextualErrorMap,
            ctx.schemaErrorMap,
            overrideMap,
            overrideMap === errorMap ? undefined : errorMap, // then global default map
        ].filter((x) => !!x),
    });
    ctx.common.issues.push(issue);
}
class ParseStatus {
    constructor() {
        this.value = "valid";
    }
    dirty() {
        if (this.value === "valid")
            this.value = "dirty";
    }
    abort() {
        if (this.value !== "aborted")
            this.value = "aborted";
    }
    static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
            if (s.status === "aborted")
                return INVALID;
            if (s.status === "dirty")
                status.dirty();
            arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
                key,
                value,
            });
        }
        return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
            const { key, value } = pair;
            if (key.status === "aborted")
                return INVALID;
            if (value.status === "aborted")
                return INVALID;
            if (key.status === "dirty")
                status.dirty();
            if (value.status === "dirty")
                status.dirty();
            if (key.value !== "__proto__" &&
                (typeof value.value !== "undefined" || pair.alwaysSet)) {
                finalObject[key.value] = value.value;
            }
        }
        return { status: status.value, value: finalObject };
    }
}
const INVALID = Object.freeze({
    status: "aborted",
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var errorUtil;
(function (errorUtil) {
    errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));

var _ZodEnum_cache, _ZodNativeEnum_cache;
class ParseInputLazyPath {
    constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
    }
    get path() {
        if (!this._cachedPath.length) {
            if (this._key instanceof Array) {
                this._cachedPath.push(...this._path, ...this._key);
            }
            else {
                this._cachedPath.push(...this._path, this._key);
            }
        }
        return this._cachedPath;
    }
}
const handleResult = (ctx, result) => {
    if (isValid(result)) {
        return { success: true, data: result.value };
    }
    else {
        if (!ctx.common.issues.length) {
            throw new Error("Validation failed but no issues detected.");
        }
        return {
            success: false,
            get error() {
                if (this._error)
                    return this._error;
                const error = new ZodError(ctx.common.issues);
                this._error = error;
                return this._error;
            },
        };
    }
};
function processCreateParams(params) {
    if (!params)
        return {};
    const { errorMap, invalid_type_error, required_error, description } = params;
    if (errorMap && (invalid_type_error || required_error)) {
        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap)
        return { errorMap: errorMap, description };
    const customMap = (iss, ctx) => {
        var _a, _b;
        const { message } = params;
        if (iss.code === "invalid_enum_value") {
            return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
        }
        if (typeof ctx.data === "undefined") {
            return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
        }
        if (iss.code !== "invalid_type")
            return { message: ctx.defaultError };
        return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
    };
    return { errorMap: customMap, description };
}
class ZodType {
    constructor(def) {
        /** Alias of safeParseAsync */
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
    }
    get description() {
        return this._def.description;
    }
    _getType(input) {
        return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
        return (ctx || {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent,
        });
    }
    _processInputParams(input) {
        return {
            status: new ParseStatus(),
            ctx: {
                common: input.parent.common,
                data: input.data,
                parsedType: getParsedType(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent,
            },
        };
    }
    _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
            throw new Error("Synchronous parse encountered promise.");
        }
        return result;
    }
    _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
    }
    parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    safeParse(data, params) {
        var _a;
        const ctx = {
            common: {
                issues: [],
                async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
    }
    async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    async safeParseAsync(data, params) {
        const ctx = {
            common: {
                issues: [],
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                async: true,
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult)
            ? maybeAsyncResult
            : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
    }
    refine(check, message) {
        const getIssueProperties = (val) => {
            if (typeof message === "string" || typeof message === "undefined") {
                return { message };
            }
            else if (typeof message === "function") {
                return message(val);
            }
            else {
                return message;
            }
        };
        return this._refinement((val, ctx) => {
            const result = check(val);
            const setError = () => ctx.addIssue({
                code: ZodIssueCode.custom,
                ...getIssueProperties(val),
            });
            if (typeof Promise !== "undefined" && result instanceof Promise) {
                return result.then((data) => {
                    if (!data) {
                        setError();
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
            if (!result) {
                setError();
                return false;
            }
            else {
                return true;
            }
        });
    }
    refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
            if (!check(val)) {
                ctx.addIssue(typeof refinementData === "function"
                    ? refinementData(val, ctx)
                    : refinementData);
                return false;
            }
            else {
                return true;
            }
        });
    }
    _refinement(refinement) {
        return new ZodEffects({
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "refinement", refinement },
        });
    }
    superRefine(refinement) {
        return this._refinement(refinement);
    }
    optional() {
        return ZodOptional.create(this, this._def);
    }
    nullable() {
        return ZodNullable.create(this, this._def);
    }
    nullish() {
        return this.nullable().optional();
    }
    array() {
        return ZodArray.create(this, this._def);
    }
    promise() {
        return ZodPromise.create(this, this._def);
    }
    or(option) {
        return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
        return new ZodEffects({
            ...processCreateParams(this._def),
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "transform", transform },
        });
    }
    default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
            ...processCreateParams(this._def),
            innerType: this,
            defaultValue: defaultValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodDefault,
        });
    }
    brand() {
        return new ZodBranded({
            typeName: ZodFirstPartyTypeKind.ZodBranded,
            type: this,
            ...processCreateParams(this._def),
        });
    }
    catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
            ...processCreateParams(this._def),
            innerType: this,
            catchValue: catchValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodCatch,
        });
    }
    describe(description) {
        const This = this.constructor;
        return new This({
            ...this._def,
            description,
        });
    }
    pipe(target) {
        return ZodPipeline.create(this, target);
    }
    readonly() {
        return ZodReadonly.create(this);
    }
    isOptional() {
        return this.safeParse(undefined).success;
    }
    isNullable() {
        return this.safeParse(null).success;
    }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
// const uuidRegex =
//   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
// from https://stackoverflow.com/a/46181/1550155
// old version: too slow, didn't support unicode
// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
//old email regex
// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
// eslint-disable-next-line
// const emailRegex =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
// const emailRegex =
//   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const emailRegex =
//   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
// const emailRegex =
//   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex$1;
// faster, simpler, safer
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
// simple
// const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
// no leap year validation
// const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
// with leap year validation
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
    // let regex = `\\d{2}:\\d{2}:\\d{2}`;
    let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
    if (args.precision) {
        regex = `${regex}\\.\\d{${args.precision}}`;
    }
    else if (args.precision == null) {
        regex = `${regex}(\\.\\d+)?`;
    }
    return regex;
}
function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
        opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
        return true;
    }
    return false;
}
class ZodString extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.string,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const status = new ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.length < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.length > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "length") {
                const tooBig = input.data.length > check.value;
                const tooSmall = input.data.length < check.value;
                if (tooBig || tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    if (tooBig) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            maximum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    else if (tooSmall) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            minimum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    status.dirty();
                }
            }
            else if (check.kind === "email") {
                if (!emailRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "email",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "emoji") {
                if (!emojiRegex$1) {
                    emojiRegex$1 = new RegExp(_emojiRegex, "u");
                }
                if (!emojiRegex$1.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "emoji",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "uuid") {
                if (!uuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "uuid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "nanoid") {
                if (!nanoidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "nanoid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid") {
                if (!cuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cuid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid2") {
                if (!cuid2Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cuid2",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ulid") {
                if (!ulidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "ulid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "url") {
                try {
                    new URL(input.data);
                }
                catch (_a) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "url",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "regex") {
                check.regex.lastIndex = 0;
                const testResult = check.regex.test(input.data);
                if (!testResult) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "regex",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "trim") {
                input.data = input.data.trim();
            }
            else if (check.kind === "includes") {
                if (!input.data.includes(check.value, check.position)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { includes: check.value, position: check.position },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "toLowerCase") {
                input.data = input.data.toLowerCase();
            }
            else if (check.kind === "toUpperCase") {
                input.data = input.data.toUpperCase();
            }
            else if (check.kind === "startsWith") {
                if (!input.data.startsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { startsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "endsWith") {
                if (!input.data.endsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { endsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "datetime") {
                const regex = datetimeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "datetime",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "date") {
                const regex = dateRegex;
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "date",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "time") {
                const regex = timeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "time",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "duration") {
                if (!durationRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "duration",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ip") {
                if (!isValidIP(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "ip",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "base64") {
                if (!base64Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "base64",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
            validation,
            code: ZodIssueCode.invalid_string,
            ...errorUtil.errToObj(message),
        });
    }
    _addCheck(check) {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
        var _a, _b;
        if (typeof options === "string") {
            return this._addCheck({
                kind: "datetime",
                precision: null,
                offset: false,
                local: false,
                message: options,
            });
        }
        return this._addCheck({
            kind: "datetime",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
            local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    date(message) {
        return this._addCheck({ kind: "date", message });
    }
    time(options) {
        if (typeof options === "string") {
            return this._addCheck({
                kind: "time",
                precision: null,
                message: options,
            });
        }
        return this._addCheck({
            kind: "time",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex, message) {
        return this._addCheck({
            kind: "regex",
            regex: regex,
            ...errorUtil.errToObj(message),
        });
    }
    includes(value, options) {
        return this._addCheck({
            kind: "includes",
            value: value,
            position: options === null || options === void 0 ? void 0 : options.position,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    startsWith(value, message) {
        return this._addCheck({
            kind: "startsWith",
            value: value,
            ...errorUtil.errToObj(message),
        });
    }
    endsWith(value, message) {
        return this._addCheck({
            kind: "endsWith",
            value: value,
            ...errorUtil.errToObj(message),
        });
    }
    min(minLength, message) {
        return this._addCheck({
            kind: "min",
            value: minLength,
            ...errorUtil.errToObj(message),
        });
    }
    max(maxLength, message) {
        return this._addCheck({
            kind: "max",
            value: maxLength,
            ...errorUtil.errToObj(message),
        });
    }
    length(len, message) {
        return this._addCheck({
            kind: "length",
            value: len,
            ...errorUtil.errToObj(message),
        });
    }
    /**
     * @deprecated Use z.string().min(1) instead.
     * @see {@link ZodString.min}
     */
    nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "trim" }],
        });
    }
    toLowerCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toLowerCase" }],
        });
    }
    toUpperCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toUpperCase" }],
        });
    }
    get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodString.create = (params) => {
    var _a;
    return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params),
    });
};
// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / Math.pow(10, decCount);
}
class ZodNumber extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.number,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        let ctx = undefined;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "int") {
                if (!util.isInteger(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: "integer",
                        received: "float",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "min") {
                const tooSmall = check.inclusive
                    ? input.data < check.value
                    : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive
                    ? input.data > check.value
                    : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (floatSafeRemainder(input.data, check.value) !== 0) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_finite,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodNumber({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodNumber({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    int(message) {
        return this._addCheck({
            kind: "int",
            message: errorUtil.toString(message),
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value: value,
            message: errorUtil.toString(message),
        });
    }
    finite(message) {
        return this._addCheck({
            kind: "finite",
            message: errorUtil.toString(message),
        });
    }
    safe(message) {
        return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message: errorUtil.toString(message),
        })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message: errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
    get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" ||
            (ch.kind === "multipleOf" && util.isInteger(ch.value)));
    }
    get isFinite() {
        let max = null, min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "finite" ||
                ch.kind === "int" ||
                ch.kind === "multipleOf") {
                return true;
            }
            else if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
            else if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return Number.isFinite(min) && Number.isFinite(max);
    }
}
ZodNumber.create = (params) => {
    return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params),
    });
};
class ZodBigInt extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = BigInt(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.bigint,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        let ctx = undefined;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                const tooSmall = check.inclusive
                    ? input.data < check.value
                    : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        type: "bigint",
                        minimum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive
                    ? input.data > check.value
                    : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        type: "bigint",
                        maximum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (input.data % check.value !== BigInt(0)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodBigInt({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodBigInt({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value,
            message: errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodBigInt.create = (params) => {
    var _a;
    return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params),
    });
};
class ZodBoolean extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.boolean,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodBoolean.create = (params) => {
    return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params),
    });
};
class ZodDate extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.date,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (isNaN(input.data.getTime())) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_date,
            });
            return INVALID;
        }
        const status = new ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.getTime() < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        minimum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.getTime() > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        maximum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return {
            status: status.value,
            value: new Date(input.data.getTime()),
        };
    }
    _addCheck(check) {
        return new ZodDate({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    min(minDate, message) {
        return this._addCheck({
            kind: "min",
            value: minDate.getTime(),
            message: errorUtil.toString(message),
        });
    }
    max(maxDate, message) {
        return this._addCheck({
            kind: "max",
            value: maxDate.getTime(),
            message: errorUtil.toString(message),
        });
    }
    get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min != null ? new Date(min) : null;
    }
    get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max != null ? new Date(max) : null;
    }
}
ZodDate.create = (params) => {
    return new ZodDate({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params),
    });
};
class ZodSymbol extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.symbol,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodSymbol.create = (params) => {
    return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params),
    });
};
class ZodUndefined extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.undefined,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodUndefined.create = (params) => {
    return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params),
    });
};
class ZodNull extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.null,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodNull.create = (params) => {
    return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params),
    });
};
class ZodAny extends ZodType {
    constructor() {
        super(...arguments);
        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
        this._any = true;
    }
    _parse(input) {
        return OK(input.data);
    }
}
ZodAny.create = (params) => {
    return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params),
    });
};
class ZodUnknown extends ZodType {
    constructor() {
        super(...arguments);
        // required
        this._unknown = true;
    }
    _parse(input) {
        return OK(input.data);
    }
}
ZodUnknown.create = (params) => {
    return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params),
    });
};
class ZodNever extends ZodType {
    _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.never,
            received: ctx.parsedType,
        });
        return INVALID;
    }
}
ZodNever.create = (params) => {
    return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params),
    });
};
class ZodVoid extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.void,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodVoid.create = (params) => {
    return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params),
    });
};
class ZodArray extends ZodType {
    _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.array,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (def.exactLength !== null) {
            const tooBig = ctx.data.length > def.exactLength.value;
            const tooSmall = ctx.data.length < def.exactLength.value;
            if (tooBig || tooSmall) {
                addIssueToContext(ctx, {
                    code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
                    minimum: (tooSmall ? def.exactLength.value : undefined),
                    maximum: (tooBig ? def.exactLength.value : undefined),
                    type: "array",
                    inclusive: true,
                    exact: true,
                    message: def.exactLength.message,
                });
                status.dirty();
            }
        }
        if (def.minLength !== null) {
            if (ctx.data.length < def.minLength.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: def.minLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.minLength.message,
                });
                status.dirty();
            }
        }
        if (def.maxLength !== null) {
            if (ctx.data.length > def.maxLength.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: def.maxLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.maxLength.message,
                });
                status.dirty();
            }
        }
        if (ctx.common.async) {
            return Promise.all([...ctx.data].map((item, i) => {
                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
            })).then((result) => {
                return ParseStatus.mergeArray(status, result);
            });
        }
        const result = [...ctx.data].map((item, i) => {
            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
    }
    get element() {
        return this._def.type;
    }
    min(minLength, message) {
        return new ZodArray({
            ...this._def,
            minLength: { value: minLength, message: errorUtil.toString(message) },
        });
    }
    max(maxLength, message) {
        return new ZodArray({
            ...this._def,
            maxLength: { value: maxLength, message: errorUtil.toString(message) },
        });
    }
    length(len, message) {
        return new ZodArray({
            ...this._def,
            exactLength: { value: len, message: errorUtil.toString(message) },
        });
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodArray.create = (schema, params) => {
    return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params),
    });
};
function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
        const newShape = {};
        for (const key in schema.shape) {
            const fieldSchema = schema.shape[key];
            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject({
            ...schema._def,
            shape: () => newShape,
        });
    }
    else if (schema instanceof ZodArray) {
        return new ZodArray({
            ...schema._def,
            type: deepPartialify(schema.element),
        });
    }
    else if (schema instanceof ZodOptional) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodNullable) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodTuple) {
        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    }
    else {
        return schema;
    }
}
class ZodObject extends ZodType {
    constructor() {
        super(...arguments);
        this._cached = null;
        /**
         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
         * If you want to pass through unknown properties, use `.passthrough()` instead.
         */
        this.nonstrict = this.passthrough;
        // extend<
        //   Augmentation extends ZodRawShape,
        //   NewOutput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   }>,
        //   NewInput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }>
        // >(
        //   augmentation: Augmentation
        // ): ZodObject<
        //   extendShape<T, Augmentation>,
        //   UnknownKeys,
        //   Catchall,
        //   NewOutput,
        //   NewInput
        // > {
        //   return new ZodObject({
        //     ...this._def,
        //     shape: () => ({
        //       ...this._def.shape(),
        //       ...augmentation,
        //     }),
        //   }) as any;
        // }
        /**
         * @deprecated Use `.extend` instead
         *  */
        this.augment = this.extend;
    }
    _getCached() {
        if (this._cached !== null)
            return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        return (this._cached = { shape, keys });
    }
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever &&
            this._def.unknownKeys === "strip")) {
            for (const key in ctx.data) {
                if (!shapeKeys.includes(key)) {
                    extraKeys.push(key);
                }
            }
        }
        const pairs = [];
        for (const key of shapeKeys) {
            const keyValidator = shape[key];
            const value = ctx.data[key];
            pairs.push({
                key: { status: "valid", value: key },
                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (this._def.catchall instanceof ZodNever) {
            const unknownKeys = this._def.unknownKeys;
            if (unknownKeys === "passthrough") {
                for (const key of extraKeys) {
                    pairs.push({
                        key: { status: "valid", value: key },
                        value: { status: "valid", value: ctx.data[key] },
                    });
                }
            }
            else if (unknownKeys === "strict") {
                if (extraKeys.length > 0) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.unrecognized_keys,
                        keys: extraKeys,
                    });
                    status.dirty();
                }
            }
            else if (unknownKeys === "strip") ;
            else {
                throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
            }
        }
        else {
            // run catchall validation
            const catchall = this._def.catchall;
            for (const key of extraKeys) {
                const value = ctx.data[key];
                pairs.push({
                    key: { status: "valid", value: key },
                    value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                    ),
                    alwaysSet: key in ctx.data,
                });
            }
        }
        if (ctx.common.async) {
            return Promise.resolve()
                .then(async () => {
                const syncPairs = [];
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    syncPairs.push({
                        key,
                        value,
                        alwaysSet: pair.alwaysSet,
                    });
                }
                return syncPairs;
            })
                .then((syncPairs) => {
                return ParseStatus.mergeObjectSync(status, syncPairs);
            });
        }
        else {
            return ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get shape() {
        return this._def.shape();
    }
    strict(message) {
        errorUtil.errToObj;
        return new ZodObject({
            ...this._def,
            unknownKeys: "strict",
            ...(message !== undefined
                ? {
                    errorMap: (issue, ctx) => {
                        var _a, _b, _c, _d;
                        const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                        if (issue.code === "unrecognized_keys")
                            return {
                                message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError,
                            };
                        return {
                            message: defaultError,
                        };
                    },
                }
                : {}),
        });
    }
    strip() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "strip",
        });
    }
    passthrough() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "passthrough",
        });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
        return new ZodObject({
            ...this._def,
            shape: () => ({
                ...this._def.shape(),
                ...augmentation,
            }),
        });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
        const merged = new ZodObject({
            unknownKeys: merging._def.unknownKeys,
            catchall: merging._def.catchall,
            shape: () => ({
                ...this._def.shape(),
                ...merging._def.shape(),
            }),
            typeName: ZodFirstPartyTypeKind.ZodObject,
        });
        return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
        return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
        return new ZodObject({
            ...this._def,
            catchall: index,
        });
    }
    pick(mask) {
        const shape = {};
        util.objectKeys(mask).forEach((key) => {
            if (mask[key] && this.shape[key]) {
                shape[key] = this.shape[key];
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    omit(mask) {
        const shape = {};
        util.objectKeys(this.shape).forEach((key) => {
            if (!mask[key]) {
                shape[key] = this.shape[key];
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    /**
     * @deprecated
     */
    deepPartial() {
        return deepPartialify(this);
    }
    partial(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
            const fieldSchema = this.shape[key];
            if (mask && !mask[key]) {
                newShape[key] = fieldSchema;
            }
            else {
                newShape[key] = fieldSchema.optional();
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    required(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
            if (mask && !mask[key]) {
                newShape[key] = this.shape[key];
            }
            else {
                const fieldSchema = this.shape[key];
                let newField = fieldSchema;
                while (newField instanceof ZodOptional) {
                    newField = newField._def.innerType;
                }
                newShape[key] = newField;
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    keyof() {
        return createZodEnum(util.objectKeys(this.shape));
    }
}
ZodObject.create = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
class ZodUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
            // return first issue-free validation if it exists
            for (const result of results) {
                if (result.result.status === "valid") {
                    return result.result;
                }
            }
            for (const result of results) {
                if (result.result.status === "dirty") {
                    // add issues from dirty option
                    ctx.common.issues.push(...result.ctx.common.issues);
                    return result.result;
                }
            }
            // return invalid
            const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union,
                unionErrors,
            });
            return INVALID;
        }
        if (ctx.common.async) {
            return Promise.all(options.map(async (option) => {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                return {
                    result: await option._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: childCtx,
                    }),
                    ctx: childCtx,
                };
            })).then(handleResults);
        }
        else {
            let dirty = undefined;
            const issues = [];
            for (const option of options) {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                const result = option._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx,
                });
                if (result.status === "valid") {
                    return result;
                }
                else if (result.status === "dirty" && !dirty) {
                    dirty = { result, ctx: childCtx };
                }
                if (childCtx.common.issues.length) {
                    issues.push(childCtx.common.issues);
                }
            }
            if (dirty) {
                ctx.common.issues.push(...dirty.ctx.common.issues);
                return dirty.result;
            }
            const unionErrors = issues.map((issues) => new ZodError(issues));
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union,
                unionErrors,
            });
            return INVALID;
        }
    }
    get options() {
        return this._def.options;
    }
}
ZodUnion.create = (types, params) => {
    return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params),
    });
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////                                 //////////
//////////      ZodDiscriminatedUnion      //////////
//////////                                 //////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
    }
    else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
    }
    else if (type instanceof ZodLiteral) {
        return [type.value];
    }
    else if (type instanceof ZodEnum) {
        return type.options;
    }
    else if (type instanceof ZodNativeEnum) {
        // eslint-disable-next-line ban/ban
        return util.objectValues(type.enum);
    }
    else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
    }
    else if (type instanceof ZodUndefined) {
        return [undefined];
    }
    else if (type instanceof ZodNull) {
        return [null];
    }
    else if (type instanceof ZodOptional) {
        return [undefined, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
    }
    else {
        return [];
    }
};
class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [discriminator],
            });
            return INVALID;
        }
        if (ctx.common.async) {
            return option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
        else {
            return option._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
    }
    get discriminator() {
        return this._def.discriminator;
    }
    get options() {
        return this._def.options;
    }
    get optionsMap() {
        return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
        // Get all the valid discriminator values
        const optionsMap = new Map();
        // try {
        for (const type of options) {
            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
            if (!discriminatorValues.length) {
                throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
            }
            for (const value of discriminatorValues) {
                if (optionsMap.has(value)) {
                    throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                }
                optionsMap.set(value, type);
            }
        }
        return new ZodDiscriminatedUnion({
            typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
            discriminator,
            options,
            optionsMap,
            ...processCreateParams(params),
        });
    }
}
function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
        const bKeys = util.objectKeys(b);
        const sharedKeys = util
            .objectKeys(a)
            .filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
        if (a.length !== b.length) {
            return { valid: false };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    else if (aType === ZodParsedType.date &&
        bType === ZodParsedType.date &&
        +a === +b) {
        return { valid: true, data: a };
    }
    else {
        return { valid: false };
    }
}
class ZodIntersection extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
            if (isAborted(parsedLeft) || isAborted(parsedRight)) {
                return INVALID;
            }
            const merged = mergeValues(parsedLeft.value, parsedRight.value);
            if (!merged.valid) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_intersection_types,
                });
                return INVALID;
            }
            if (isDirty(parsedLeft) || isDirty(parsedRight)) {
                status.dirty();
            }
            return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
            return Promise.all([
                this._def.left._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
                this._def.right._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
            ]).then(([left, right]) => handleParsed(left, right));
        }
        else {
            return handleParsed(this._def.left._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }), this._def.right._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }));
        }
    }
}
ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
        left: left,
        right: right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params),
    });
};
class ZodTuple extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.array,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            status.dirty();
        }
        const items = [...ctx.data]
            .map((item, itemIndex) => {
            const schema = this._def.items[itemIndex] || this._def.rest;
            if (!schema)
                return null;
            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        })
            .filter((x) => !!x); // filter nulls
        if (ctx.common.async) {
            return Promise.all(items).then((results) => {
                return ParseStatus.mergeArray(status, results);
            });
        }
        else {
            return ParseStatus.mergeArray(status, items);
        }
    }
    get items() {
        return this._def.items;
    }
    rest(rest) {
        return new ZodTuple({
            ...this._def,
            rest,
        });
    }
}
ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params),
    });
};
class ZodRecord extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
            pairs.push({
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (ctx.common.async) {
            return ParseStatus.mergeObjectAsync(status, pairs);
        }
        else {
            return ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get element() {
        return this._def.valueType;
    }
    static create(first, second, third) {
        if (second instanceof ZodType) {
            return new ZodRecord({
                keyType: first,
                valueType: second,
                typeName: ZodFirstPartyTypeKind.ZodRecord,
                ...processCreateParams(third),
            });
        }
        return new ZodRecord({
            keyType: ZodString.create(),
            valueType: first,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(second),
        });
    }
}
class ZodMap extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.map,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
            return {
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
            };
        });
        if (ctx.common.async) {
            const finalMap = new Map();
            return Promise.resolve().then(async () => {
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    if (key.status === "aborted" || value.status === "aborted") {
                        return INVALID;
                    }
                    if (key.status === "dirty" || value.status === "dirty") {
                        status.dirty();
                    }
                    finalMap.set(key.value, value.value);
                }
                return { status: status.value, value: finalMap };
            });
        }
        else {
            const finalMap = new Map();
            for (const pair of pairs) {
                const key = pair.key;
                const value = pair.value;
                if (key.status === "aborted" || value.status === "aborted") {
                    return INVALID;
                }
                if (key.status === "dirty" || value.status === "dirty") {
                    status.dirty();
                }
                finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
        }
    }
}
ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params),
    });
};
class ZodSet extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.set,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
            if (ctx.data.size < def.minSize.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: def.minSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.minSize.message,
                });
                status.dirty();
            }
        }
        if (def.maxSize !== null) {
            if (ctx.data.size > def.maxSize.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: def.maxSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.maxSize.message,
                });
                status.dirty();
            }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements) {
            const parsedSet = new Set();
            for (const element of elements) {
                if (element.status === "aborted")
                    return INVALID;
                if (element.status === "dirty")
                    status.dirty();
                parsedSet.add(element.value);
            }
            return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
            return Promise.all(elements).then((elements) => finalizeSet(elements));
        }
        else {
            return finalizeSet(elements);
        }
    }
    min(minSize, message) {
        return new ZodSet({
            ...this._def,
            minSize: { value: minSize, message: errorUtil.toString(message) },
        });
    }
    max(maxSize, message) {
        return new ZodSet({
            ...this._def,
            maxSize: { value: maxSize, message: errorUtil.toString(message) },
        });
    }
    size(size, message) {
        return this.min(size, message).max(size, message);
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodSet.create = (valueType, params) => {
    return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params),
    });
};
class ZodFunction extends ZodType {
    constructor() {
        super(...arguments);
        this.validate = this.implement;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.function,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        function makeArgsIssue(args, error) {
            return makeIssue({
                data: args,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    getErrorMap(),
                    errorMap,
                ].filter((x) => !!x),
                issueData: {
                    code: ZodIssueCode.invalid_arguments,
                    argumentsError: error,
                },
            });
        }
        function makeReturnsIssue(returns, error) {
            return makeIssue({
                data: returns,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    getErrorMap(),
                    errorMap,
                ].filter((x) => !!x),
                issueData: {
                    code: ZodIssueCode.invalid_return_type,
                    returnTypeError: error,
                },
            });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return OK(async function (...args) {
                const error = new ZodError([]);
                const parsedArgs = await me._def.args
                    .parseAsync(args, params)
                    .catch((e) => {
                    error.addIssue(makeArgsIssue(args, e));
                    throw error;
                });
                const result = await Reflect.apply(fn, this, parsedArgs);
                const parsedReturns = await me._def.returns._def.type
                    .parseAsync(result, params)
                    .catch((e) => {
                    error.addIssue(makeReturnsIssue(result, e));
                    throw error;
                });
                return parsedReturns;
            });
        }
        else {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return OK(function (...args) {
                const parsedArgs = me._def.args.safeParse(args, params);
                if (!parsedArgs.success) {
                    throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
                }
                const result = Reflect.apply(fn, this, parsedArgs.data);
                const parsedReturns = me._def.returns.safeParse(result, params);
                if (!parsedReturns.success) {
                    throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
                }
                return parsedReturns.data;
            });
        }
    }
    parameters() {
        return this._def.args;
    }
    returnType() {
        return this._def.returns;
    }
    args(...items) {
        return new ZodFunction({
            ...this._def,
            args: ZodTuple.create(items).rest(ZodUnknown.create()),
        });
    }
    returns(returnType) {
        return new ZodFunction({
            ...this._def,
            returns: returnType,
        });
    }
    implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    static create(args, returns, params) {
        return new ZodFunction({
            args: (args
                ? args
                : ZodTuple.create([]).rest(ZodUnknown.create())),
            returns: returns || ZodUnknown.create(),
            typeName: ZodFirstPartyTypeKind.ZodFunction,
            ...processCreateParams(params),
        });
    }
}
class ZodLazy extends ZodType {
    get schema() {
        return this._def.getter();
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
}
ZodLazy.create = (getter, params) => {
    return new ZodLazy({
        getter: getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params),
    });
};
class ZodLiteral extends ZodType {
    _parse(input) {
        if (input.data !== this._def.value) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_literal,
                expected: this._def.value,
            });
            return INVALID;
        }
        return { status: "valid", value: input.data };
    }
    get value() {
        return this._def.value;
    }
}
ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
        value: value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params),
    });
};
function createZodEnum(values, params) {
    return new ZodEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodEnum,
        ...processCreateParams(params),
    });
}
class ZodEnum extends ZodType {
    constructor() {
        super(...arguments);
        _ZodEnum_cache.set(this, void 0);
    }
    _parse(input) {
        if (typeof input.data !== "string") {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
                expected: util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodIssueCode.invalid_type,
            });
            return INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache)) {
            __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values));
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache).has(input.data)) {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return INVALID;
        }
        return OK(input.data);
    }
    get options() {
        return this._def.values;
    }
    get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    extract(values, newDef = this._def) {
        return ZodEnum.create(values, {
            ...this._def,
            ...newDef,
        });
    }
    exclude(values, newDef = this._def) {
        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
            ...this._def,
            ...newDef,
        });
    }
}
_ZodEnum_cache = new WeakMap();
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
    constructor() {
        super(...arguments);
        _ZodNativeEnum_cache.set(this, void 0);
    }
    _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string &&
            ctx.parsedType !== ZodParsedType.number) {
            const expectedValues = util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
                expected: util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodIssueCode.invalid_type,
            });
            return INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache)) {
            __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)));
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache).has(input.data)) {
            const expectedValues = util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return INVALID;
        }
        return OK(input.data);
    }
    get enum() {
        return this._def.values;
    }
}
_ZodNativeEnum_cache = new WeakMap();
ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
        values: values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params),
    });
};
class ZodPromise extends ZodType {
    unwrap() {
        return this._def.type;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise &&
            ctx.common.async === false) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.promise,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise
            ? ctx.data
            : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
            return this._def.type.parseAsync(data, {
                path: ctx.path,
                errorMap: ctx.common.contextualErrorMap,
            });
        }));
    }
}
ZodPromise.create = (schema, params) => {
    return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params),
    });
};
class ZodEffects extends ZodType {
    innerType() {
        return this._def.schema;
    }
    sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
            ? this._def.schema.sourceType()
            : this._def.schema;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
            addIssue: (arg) => {
                addIssueToContext(ctx, arg);
                if (arg.fatal) {
                    status.abort();
                }
                else {
                    status.dirty();
                }
            },
            get path() {
                return ctx.path;
            },
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
            const processed = effect.transform(ctx.data, checkCtx);
            if (ctx.common.async) {
                return Promise.resolve(processed).then(async (processed) => {
                    if (status.value === "aborted")
                        return INVALID;
                    const result = await this._def.schema._parseAsync({
                        data: processed,
                        path: ctx.path,
                        parent: ctx,
                    });
                    if (result.status === "aborted")
                        return INVALID;
                    if (result.status === "dirty")
                        return DIRTY(result.value);
                    if (status.value === "dirty")
                        return DIRTY(result.value);
                    return result;
                });
            }
            else {
                if (status.value === "aborted")
                    return INVALID;
                const result = this._def.schema._parseSync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx,
                });
                if (result.status === "aborted")
                    return INVALID;
                if (result.status === "dirty")
                    return DIRTY(result.value);
                if (status.value === "dirty")
                    return DIRTY(result.value);
                return result;
            }
        }
        if (effect.type === "refinement") {
            const executeRefinement = (acc) => {
                const result = effect.refinement(acc, checkCtx);
                if (ctx.common.async) {
                    return Promise.resolve(result);
                }
                if (result instanceof Promise) {
                    throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                }
                return acc;
            };
            if (ctx.common.async === false) {
                const inner = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inner.status === "aborted")
                    return INVALID;
                if (inner.status === "dirty")
                    status.dirty();
                // return value is ignored
                executeRefinement(inner.value);
                return { status: status.value, value: inner.value };
            }
            else {
                return this._def.schema
                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                    .then((inner) => {
                    if (inner.status === "aborted")
                        return INVALID;
                    if (inner.status === "dirty")
                        status.dirty();
                    return executeRefinement(inner.value).then(() => {
                        return { status: status.value, value: inner.value };
                    });
                });
            }
        }
        if (effect.type === "transform") {
            if (ctx.common.async === false) {
                const base = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (!isValid(base))
                    return base;
                const result = effect.transform(base.value, checkCtx);
                if (result instanceof Promise) {
                    throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                }
                return { status: status.value, value: result };
            }
            else {
                return this._def.schema
                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                    .then((base) => {
                    if (!isValid(base))
                        return base;
                    return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
                });
            }
        }
        util.assertNever(effect);
    }
}
ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params),
    });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params),
    });
};
class ZodOptional extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
            return OK(undefined);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodOptional.create = (type, params) => {
    return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params),
    });
};
class ZodNullable extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
            return OK(null);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodNullable.create = (type, params) => {
    return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params),
    });
};
class ZodDefault extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
            data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    removeDefault() {
        return this._def.innerType;
    }
}
ZodDefault.create = (type, params) => {
    return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function"
            ? params.default
            : () => params.default,
        ...processCreateParams(params),
    });
};
class ZodCatch extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        // newCtx is used to not collect issues from inner types in ctx
        const newCtx = {
            ...ctx,
            common: {
                ...ctx.common,
                issues: [],
            },
        };
        const result = this._def.innerType._parse({
            data: newCtx.data,
            path: newCtx.path,
            parent: {
                ...newCtx,
            },
        });
        if (isAsync(result)) {
            return result.then((result) => {
                return {
                    status: "valid",
                    value: result.status === "valid"
                        ? result.value
                        : this._def.catchValue({
                            get error() {
                                return new ZodError(newCtx.common.issues);
                            },
                            input: newCtx.data,
                        }),
                };
            });
        }
        else {
            return {
                status: "valid",
                value: result.status === "valid"
                    ? result.value
                    : this._def.catchValue({
                        get error() {
                            return new ZodError(newCtx.common.issues);
                        },
                        input: newCtx.data,
                    }),
            };
        }
    }
    removeCatch() {
        return this._def.innerType;
    }
}
ZodCatch.create = (type, params) => {
    return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params),
    });
};
class ZodNaN extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.nan,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return { status: "valid", value: input.data };
    }
}
ZodNaN.create = (params) => {
    return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params),
    });
};
const BRAND = Symbol("zod_brand");
class ZodBranded extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    unwrap() {
        return this._def.type;
    }
}
class ZodPipeline extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
            const handleAsync = async () => {
                const inResult = await this._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inResult.status === "aborted")
                    return INVALID;
                if (inResult.status === "dirty") {
                    status.dirty();
                    return DIRTY(inResult.value);
                }
                else {
                    return this._def.out._parseAsync({
                        data: inResult.value,
                        path: ctx.path,
                        parent: ctx,
                    });
                }
            };
            return handleAsync();
        }
        else {
            const inResult = this._def.in._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
            if (inResult.status === "aborted")
                return INVALID;
            if (inResult.status === "dirty") {
                status.dirty();
                return {
                    status: "dirty",
                    value: inResult.value,
                };
            }
            else {
                return this._def.out._parseSync({
                    data: inResult.value,
                    path: ctx.path,
                    parent: ctx,
                });
            }
        }
    }
    static create(a, b) {
        return new ZodPipeline({
            in: a,
            out: b,
            typeName: ZodFirstPartyTypeKind.ZodPipeline,
        });
    }
}
class ZodReadonly extends ZodType {
    _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
            if (isValid(data)) {
                data.value = Object.freeze(data.value);
            }
            return data;
        };
        return isAsync(result)
            ? result.then((data) => freeze(data))
            : freeze(result);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params),
    });
};
function custom(check, params = {}, 
/**
 * @deprecated
 *
 * Pass `fatal` into the params object instead:
 *
 * ```ts
 * z.string().custom((val) => val.length > 5, { fatal: false })
 * ```
 *
 */
fatal) {
    if (check)
        return ZodAny.create().superRefine((data, ctx) => {
            var _a, _b;
            if (!check(data)) {
                const p = typeof params === "function"
                    ? params(data)
                    : typeof params === "string"
                        ? { message: params }
                        : params;
                const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
                const p2 = typeof p === "string" ? { message: p } : p;
                ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
            }
        });
    return ZodAny.create();
}
const late = {
    object: ZodObject.lazycreate,
};
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {
    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const instanceOfType = (
// const instanceOfType = <T extends new (...args: any[]) => any>(
cls, params = {
    message: `Input not instance of ${cls.name}`,
}) => custom((data) => data instanceof cls, params);
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const nanType = ZodNaN.create;
const bigIntType = ZodBigInt.create;
const booleanType = ZodBoolean.create;
const dateType = ZodDate.create;
const symbolType = ZodSymbol.create;
const undefinedType = ZodUndefined.create;
const nullType = ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
const neverType = ZodNever.create;
const voidType = ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const strictObjectType = ZodObject.strictCreate;
const unionType = ZodUnion.create;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
const intersectionType = ZodIntersection.create;
const tupleType = ZodTuple.create;
const recordType = ZodRecord.create;
const mapType = ZodMap.create;
const setType = ZodSet.create;
const functionType = ZodFunction.create;
const lazyType = ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
const nativeEnumType = ZodNativeEnum.create;
const promiseType = ZodPromise.create;
const effectsType = ZodEffects.create;
const optionalType = ZodOptional.create;
const nullableType = ZodNullable.create;
const preprocessType = ZodEffects.createWithPreprocess;
const pipelineType = ZodPipeline.create;
const ostring = () => stringType().optional();
const onumber = () => numberType().optional();
const oboolean = () => booleanType().optional();
const coerce = {
    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
    boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true,
    })),
    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
    date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
};
const NEVER = INVALID;

var z = /*#__PURE__*/Object.freeze({
    __proto__: null,
    defaultErrorMap: errorMap,
    setErrorMap: setErrorMap,
    getErrorMap: getErrorMap,
    makeIssue: makeIssue,
    EMPTY_PATH: EMPTY_PATH,
    addIssueToContext: addIssueToContext,
    ParseStatus: ParseStatus,
    INVALID: INVALID,
    DIRTY: DIRTY,
    OK: OK,
    isAborted: isAborted,
    isDirty: isDirty,
    isValid: isValid,
    isAsync: isAsync,
    get util () { return util; },
    get objectUtil () { return objectUtil; },
    ZodParsedType: ZodParsedType,
    getParsedType: getParsedType,
    ZodType: ZodType,
    datetimeRegex: datetimeRegex,
    ZodString: ZodString,
    ZodNumber: ZodNumber,
    ZodBigInt: ZodBigInt,
    ZodBoolean: ZodBoolean,
    ZodDate: ZodDate,
    ZodSymbol: ZodSymbol,
    ZodUndefined: ZodUndefined,
    ZodNull: ZodNull,
    ZodAny: ZodAny,
    ZodUnknown: ZodUnknown,
    ZodNever: ZodNever,
    ZodVoid: ZodVoid,
    ZodArray: ZodArray,
    ZodObject: ZodObject,
    ZodUnion: ZodUnion,
    ZodDiscriminatedUnion: ZodDiscriminatedUnion,
    ZodIntersection: ZodIntersection,
    ZodTuple: ZodTuple,
    ZodRecord: ZodRecord,
    ZodMap: ZodMap,
    ZodSet: ZodSet,
    ZodFunction: ZodFunction,
    ZodLazy: ZodLazy,
    ZodLiteral: ZodLiteral,
    ZodEnum: ZodEnum,
    ZodNativeEnum: ZodNativeEnum,
    ZodPromise: ZodPromise,
    ZodEffects: ZodEffects,
    ZodTransformer: ZodEffects,
    ZodOptional: ZodOptional,
    ZodNullable: ZodNullable,
    ZodDefault: ZodDefault,
    ZodCatch: ZodCatch,
    ZodNaN: ZodNaN,
    BRAND: BRAND,
    ZodBranded: ZodBranded,
    ZodPipeline: ZodPipeline,
    ZodReadonly: ZodReadonly,
    custom: custom,
    Schema: ZodType,
    ZodSchema: ZodType,
    late: late,
    get ZodFirstPartyTypeKind () { return ZodFirstPartyTypeKind; },
    coerce: coerce,
    any: anyType,
    array: arrayType,
    bigint: bigIntType,
    boolean: booleanType,
    date: dateType,
    discriminatedUnion: discriminatedUnionType,
    effect: effectsType,
    'enum': enumType,
    'function': functionType,
    'instanceof': instanceOfType,
    intersection: intersectionType,
    lazy: lazyType,
    literal: literalType,
    map: mapType,
    nan: nanType,
    nativeEnum: nativeEnumType,
    never: neverType,
    'null': nullType,
    nullable: nullableType,
    number: numberType,
    object: objectType,
    oboolean: oboolean,
    onumber: onumber,
    optional: optionalType,
    ostring: ostring,
    pipeline: pipelineType,
    preprocess: preprocessType,
    promise: promiseType,
    record: recordType,
    set: setType,
    strictObject: strictObjectType,
    string: stringType,
    symbol: symbolType,
    transformer: effectsType,
    tuple: tupleType,
    'undefined': undefinedType,
    union: unionType,
    unknown: unknownType,
    'void': voidType,
    NEVER: NEVER,
    ZodIssueCode: ZodIssueCode,
    quotelessJson: quotelessJson,
    ZodError: ZodError
});

function parseAnyDef() {
    return {};
}

function parseArrayDef(def, refs) {
    const res = {
        type: "array",
    };
    if (def.type?._def && def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
        res.items = parseDef(def.type._def, {
            ...refs,
            currentPath: [...refs.currentPath, "items"],
        });
    }
    if (def.minLength) {
        setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
    }
    if (def.maxLength) {
        setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
    }
    if (def.exactLength) {
        setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
        setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
    }
    return res;
}

function parseBigintDef(def, refs) {
    const res = {
        type: "integer",
        format: "int64",
    };
    if (!def.checks)
        return res;
    for (const check of def.checks) {
        switch (check.kind) {
            case "min":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMinimum = true;
                    }
                    setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                }
                break;
            case "max":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMaximum = true;
                    }
                    setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                }
                break;
            case "multipleOf":
                setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
                break;
        }
    }
    return res;
}

function parseBooleanDef() {
    return {
        type: "boolean",
    };
}

function parseBrandedDef(_def, refs) {
    return parseDef(_def.type._def, refs);
}

const parseCatchDef = (def, refs) => {
    return parseDef(def.innerType._def, refs);
};

function parseDateDef(def, refs, overrideDateStrategy) {
    const strategy = overrideDateStrategy ?? refs.dateStrategy;
    if (Array.isArray(strategy)) {
        return {
            anyOf: strategy.map((item, i) => parseDateDef(def, refs, item)),
        };
    }
    switch (strategy) {
        case "string":
        case "format:date-time":
            return {
                type: "string",
                format: "date-time",
            };
        case "format:date":
            return {
                type: "string",
                format: "date",
            };
        case "integer":
            return integerDateParser(def, refs);
    }
}
const integerDateParser = (def, refs) => {
    const res = {
        type: "integer",
        format: "unix-time",
    };
    if (refs.target === "openApi3") {
        return res;
    }
    for (const check of def.checks) {
        switch (check.kind) {
            case "min":
                setResponseValueAndErrors(res, "minimum", check.value, // This is in milliseconds
                check.message, refs);
                break;
            case "max":
                setResponseValueAndErrors(res, "maximum", check.value, // This is in milliseconds
                check.message, refs);
                break;
        }
    }
    return res;
};

function parseDefaultDef(_def, refs) {
    return {
        ...parseDef(_def.innerType._def, refs),
        default: _def.defaultValue(),
    };
}

function parseEffectsDef(_def, refs) {
    return refs.effectStrategy === "input"
        ? parseDef(_def.schema._def, refs)
        : {};
}

function parseEnumDef(def) {
    return {
        type: "string",
        enum: def.values,
    };
}

const isJsonSchema7AllOfType = (type) => {
    if ("type" in type && type.type === "string")
        return false;
    return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
    const allOf = [
        parseDef(def.left._def, {
            ...refs,
            currentPath: [...refs.currentPath, "allOf", "0"],
        }),
        parseDef(def.right._def, {
            ...refs,
            currentPath: [...refs.currentPath, "allOf", "1"],
        }),
    ].filter((x) => !!x);
    let unevaluatedProperties = refs.target === "jsonSchema2019-09"
        ? { unevaluatedProperties: false }
        : undefined;
    const mergedAllOf = [];
    // If either of the schemas is an allOf, merge them into a single allOf
    allOf.forEach((schema) => {
        if (isJsonSchema7AllOfType(schema)) {
            mergedAllOf.push(...schema.allOf);
            if (schema.unevaluatedProperties === undefined) {
                // If one of the schemas has no unevaluatedProperties set,
                // the merged schema should also have no unevaluatedProperties set
                unevaluatedProperties = undefined;
            }
        }
        else {
            let nestedSchema = schema;
            if ("additionalProperties" in schema &&
                schema.additionalProperties === false) {
                const { additionalProperties, ...rest } = schema;
                nestedSchema = rest;
            }
            else {
                // As soon as one of the schemas has additionalProperties set not to false, we allow unevaluatedProperties
                unevaluatedProperties = undefined;
            }
            mergedAllOf.push(nestedSchema);
        }
    });
    return mergedAllOf.length
        ? {
            allOf: mergedAllOf,
            ...unevaluatedProperties,
        }
        : undefined;
}

function parseLiteralDef(def, refs) {
    const parsedType = typeof def.value;
    if (parsedType !== "bigint" &&
        parsedType !== "number" &&
        parsedType !== "boolean" &&
        parsedType !== "string") {
        return {
            type: Array.isArray(def.value) ? "array" : "object",
        };
    }
    if (refs.target === "openApi3") {
        return {
            type: parsedType === "bigint" ? "integer" : parsedType,
            enum: [def.value],
        };
    }
    return {
        type: parsedType === "bigint" ? "integer" : parsedType,
        const: def.value,
    };
}

let emojiRegex;
/**
 * Generated from the regular expressions found here as of 2024-05-22:
 * https://github.com/colinhacks/zod/blob/master/src/types.ts.
 *
 * Expressions with /i flag have been changed accordingly.
 */
const zodPatterns = {
    /**
     * `c` was changed to `[cC]` to replicate /i flag
     */
    cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    /**
     * `a-z` was added to replicate /i flag
     */
    email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    /**
     * Constructed a valid Unicode RegExp
     *
     * Lazily instantiate since this type of regex isn't supported
     * in all envs (e.g. React Native).
     *
     * See:
     * https://github.com/colinhacks/zod/issues/2433
     * Fix in Zod:
     * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
     */
    emoji: () => {
        if (emojiRegex === undefined) {
            emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
        }
        return emojiRegex;
    },
    /**
     * Unused
     */
    uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    /**
     * Unused
     */
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    /**
     * Unused
     */
    ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    nanoid: /^[a-zA-Z0-9_-]{21}$/,
};
function parseStringDef(def, refs) {
    const res = {
        type: "string",
    };
    function processPattern(value) {
        return refs.patternStrategy === "escape"
            ? escapeNonAlphaNumeric(value)
            : value;
    }
    if (def.checks) {
        for (const check of def.checks) {
            switch (check.kind) {
                case "min":
                    setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number"
                        ? Math.max(res.minLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "max":
                    setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number"
                        ? Math.min(res.maxLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "email":
                    switch (refs.emailStrategy) {
                        case "format:email":
                            addFormat(res, "email", check.message, refs);
                            break;
                        case "format:idn-email":
                            addFormat(res, "idn-email", check.message, refs);
                            break;
                        case "pattern:zod":
                            addPattern(res, zodPatterns.email, check.message, refs);
                            break;
                    }
                    break;
                case "url":
                    addFormat(res, "uri", check.message, refs);
                    break;
                case "uuid":
                    addFormat(res, "uuid", check.message, refs);
                    break;
                case "regex":
                    addPattern(res, check.regex, check.message, refs);
                    break;
                case "cuid":
                    addPattern(res, zodPatterns.cuid, check.message, refs);
                    break;
                case "cuid2":
                    addPattern(res, zodPatterns.cuid2, check.message, refs);
                    break;
                case "startsWith":
                    addPattern(res, RegExp(`^${processPattern(check.value)}`), check.message, refs);
                    break;
                case "endsWith":
                    addPattern(res, RegExp(`${processPattern(check.value)}$`), check.message, refs);
                    break;
                case "datetime":
                    addFormat(res, "date-time", check.message, refs);
                    break;
                case "date":
                    addFormat(res, "date", check.message, refs);
                    break;
                case "time":
                    addFormat(res, "time", check.message, refs);
                    break;
                case "duration":
                    addFormat(res, "duration", check.message, refs);
                    break;
                case "length":
                    setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number"
                        ? Math.max(res.minLength, check.value)
                        : check.value, check.message, refs);
                    setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number"
                        ? Math.min(res.maxLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "includes": {
                    addPattern(res, RegExp(processPattern(check.value)), check.message, refs);
                    break;
                }
                case "ip": {
                    if (check.version !== "v6") {
                        addFormat(res, "ipv4", check.message, refs);
                    }
                    if (check.version !== "v4") {
                        addFormat(res, "ipv6", check.message, refs);
                    }
                    break;
                }
                case "emoji":
                    addPattern(res, zodPatterns.emoji, check.message, refs);
                    break;
                case "ulid": {
                    addPattern(res, zodPatterns.ulid, check.message, refs);
                    break;
                }
                case "base64": {
                    switch (refs.base64Strategy) {
                        case "format:binary": {
                            addFormat(res, "binary", check.message, refs);
                            break;
                        }
                        case "contentEncoding:base64": {
                            setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
                            break;
                        }
                        case "pattern:zod": {
                            addPattern(res, zodPatterns.base64, check.message, refs);
                            break;
                        }
                    }
                    break;
                }
                case "nanoid": {
                    addPattern(res, zodPatterns.nanoid, check.message, refs);
                }
            }
        }
    }
    return res;
}
const escapeNonAlphaNumeric = (value) => Array.from(value)
    .map((c) => (/[a-zA-Z0-9]/.test(c) ? c : `\\${c}`))
    .join("");
const addFormat = (schema, value, message, refs) => {
    if (schema.format || schema.anyOf?.some((x) => x.format)) {
        if (!schema.anyOf) {
            schema.anyOf = [];
        }
        if (schema.format) {
            schema.anyOf.push({
                format: schema.format,
                ...(schema.errorMessage &&
                    refs.errorMessages && {
                    errorMessage: { format: schema.errorMessage.format },
                }),
            });
            delete schema.format;
            if (schema.errorMessage) {
                delete schema.errorMessage.format;
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
            }
        }
        schema.anyOf.push({
            format: value,
            ...(message &&
                refs.errorMessages && { errorMessage: { format: message } }),
        });
    }
    else {
        setResponseValueAndErrors(schema, "format", value, message, refs);
    }
};
const addPattern = (schema, regex, message, refs) => {
    if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
        if (!schema.allOf) {
            schema.allOf = [];
        }
        if (schema.pattern) {
            schema.allOf.push({
                pattern: schema.pattern,
                ...(schema.errorMessage &&
                    refs.errorMessages && {
                    errorMessage: { pattern: schema.errorMessage.pattern },
                }),
            });
            delete schema.pattern;
            if (schema.errorMessage) {
                delete schema.errorMessage.pattern;
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
            }
        }
        schema.allOf.push({
            pattern: processRegExp(regex, refs),
            ...(message &&
                refs.errorMessages && { errorMessage: { pattern: message } }),
        });
    }
    else {
        setResponseValueAndErrors(schema, "pattern", processRegExp(regex, refs), message, refs);
    }
};
// Mutate z.string.regex() in a best attempt to accommodate for regex flags when applyRegexFlags is true
const processRegExp = (regexOrFunction, refs) => {
    const regex = typeof regexOrFunction === "function" ? regexOrFunction() : regexOrFunction;
    if (!refs.applyRegexFlags || !regex.flags)
        return regex.source;
    // Currently handled flags
    const flags = {
        i: regex.flags.includes("i"),
        m: regex.flags.includes("m"),
        s: regex.flags.includes("s"), // `.` matches newlines
    };
    // The general principle here is to step through each character, one at a time, applying mutations as flags require. We keep track when the current character is escaped, and when it's inside a group /like [this]/ or (also) a range like /[a-z]/. The following is fairly brittle imperative code; edit at your peril!
    const source = flags.i ? regex.source.toLowerCase() : regex.source;
    let pattern = "";
    let isEscaped = false;
    let inCharGroup = false;
    let inCharRange = false;
    for (let i = 0; i < source.length; i++) {
        if (isEscaped) {
            pattern += source[i];
            isEscaped = false;
            continue;
        }
        if (flags.i) {
            if (inCharGroup) {
                if (source[i].match(/[a-z]/)) {
                    if (inCharRange) {
                        pattern += source[i];
                        pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
                        inCharRange = false;
                    }
                    else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
                        pattern += source[i];
                        inCharRange = true;
                    }
                    else {
                        pattern += `${source[i]}${source[i].toUpperCase()}`;
                    }
                    continue;
                }
            }
            else if (source[i].match(/[a-z]/)) {
                pattern += `[${source[i]}${source[i].toUpperCase()}]`;
                continue;
            }
        }
        if (flags.m) {
            if (source[i] === "^") {
                pattern += `(^|(?<=[\r\n]))`;
                continue;
            }
            else if (source[i] === "$") {
                pattern += `($|(?=[\r\n]))`;
                continue;
            }
        }
        if (flags.s && source[i] === ".") {
            pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
            continue;
        }
        pattern += source[i];
        if (source[i] === "\\") {
            isEscaped = true;
        }
        else if (inCharGroup && source[i] === "]") {
            inCharGroup = false;
        }
        else if (!inCharGroup && source[i] === "[") {
            inCharGroup = true;
        }
    }
    try {
        const regexTest = new RegExp(pattern);
    }
    catch {
        console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
        return regex.source;
    }
    return pattern;
};

function parseRecordDef(def, refs) {
    if (refs.target === "openApi3" &&
        def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
        return {
            type: "object",
            required: def.keyType._def.values,
            properties: def.keyType._def.values.reduce((acc, key) => ({
                ...acc,
                [key]: parseDef(def.valueType._def, {
                    ...refs,
                    currentPath: [...refs.currentPath, "properties", key],
                }) ?? {},
            }), {}),
            additionalProperties: false,
        };
    }
    const schema = {
        type: "object",
        additionalProperties: parseDef(def.valueType._def, {
            ...refs,
            currentPath: [...refs.currentPath, "additionalProperties"],
        }) ?? {},
    };
    if (refs.target === "openApi3") {
        return schema;
    }
    if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString &&
        def.keyType._def.checks?.length) {
        const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType,
        };
    }
    else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
        return {
            ...schema,
            propertyNames: {
                enum: def.keyType._def.values,
            },
        };
    }
    else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded &&
        def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString &&
        def.keyType._def.type._def.checks?.length) {
        const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType,
        };
    }
    return schema;
}

function parseMapDef(def, refs) {
    if (refs.mapStrategy === "record") {
        return parseRecordDef(def, refs);
    }
    const keys = parseDef(def.keyType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", "items", "0"],
    }) || {};
    const values = parseDef(def.valueType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", "items", "1"],
    }) || {};
    return {
        type: "array",
        maxItems: 125,
        items: {
            type: "array",
            items: [keys, values],
            minItems: 2,
            maxItems: 2,
        },
    };
}

function parseNativeEnumDef(def) {
    const object = def.values;
    const actualKeys = Object.keys(def.values).filter((key) => {
        return typeof object[object[key]] !== "number";
    });
    const actualValues = actualKeys.map((key) => object[key]);
    const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
    return {
        type: parsedTypes.length === 1
            ? parsedTypes[0] === "string"
                ? "string"
                : "number"
            : ["string", "number"],
        enum: actualValues,
    };
}

function parseNeverDef() {
    return {
        not: {},
    };
}

function parseNullDef(refs) {
    return refs.target === "openApi3"
        ? {
            enum: ["null"],
            nullable: true,
        }
        : {
            type: "null",
        };
}

const primitiveMappings = {
    ZodString: "string",
    ZodNumber: "number",
    ZodBigInt: "integer",
    ZodBoolean: "boolean",
    ZodNull: "null",
};
function parseUnionDef(def, refs) {
    if (refs.target === "openApi3")
        return asAnyOf(def, refs);
    const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
    // This blocks tries to look ahead a bit to produce nicer looking schemas with type array instead of anyOf.
    if (options.every((x) => x._def.typeName in primitiveMappings &&
        (!x._def.checks || !x._def.checks.length))) {
        // all types in union are primitive and lack checks, so might as well squash into {type: [...]}
        const types = options.reduce((types, x) => {
            const type = primitiveMappings[x._def.typeName]; //Can be safely casted due to row 43
            return type && !types.includes(type) ? [...types, type] : types;
        }, []);
        return {
            type: types.length > 1 ? types : types[0],
        };
    }
    else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
        // all options literals
        const types = options.reduce((acc, x) => {
            const type = typeof x._def.value;
            switch (type) {
                case "string":
                case "number":
                case "boolean":
                    return [...acc, type];
                case "bigint":
                    return [...acc, "integer"];
                case "object":
                    if (x._def.value === null)
                        return [...acc, "null"];
                case "symbol":
                case "undefined":
                case "function":
                default:
                    return acc;
            }
        }, []);
        if (types.length === options.length) {
            // all the literals are primitive, as far as null can be considered primitive
            const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
            return {
                type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
                enum: options.reduce((acc, x) => {
                    return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
                }, []),
            };
        }
    }
    else if (options.every((x) => x._def.typeName === "ZodEnum")) {
        return {
            type: "string",
            enum: options.reduce((acc, x) => [
                ...acc,
                ...x._def.values.filter((x) => !acc.includes(x)),
            ], []),
        };
    }
    return asAnyOf(def, refs);
}
const asAnyOf = (def, refs) => {
    const anyOf = (def.options instanceof Map
        ? Array.from(def.options.values())
        : def.options)
        .map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", `${i}`],
    }))
        .filter((x) => !!x &&
        (!refs.strictUnions ||
            (typeof x === "object" && Object.keys(x).length > 0)));
    return anyOf.length ? { anyOf } : undefined;
};

function parseNullableDef(def, refs) {
    if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) &&
        (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
        if (refs.target === "openApi3") {
            return {
                type: primitiveMappings[def.innerType._def.typeName],
                nullable: true,
            };
        }
        return {
            type: [
                primitiveMappings[def.innerType._def.typeName],
                "null",
            ],
        };
    }
    if (refs.target === "openApi3") {
        const base = parseDef(def.innerType._def, {
            ...refs,
            currentPath: [...refs.currentPath],
        });
        if (base && '$ref' in base)
            return { allOf: [base], nullable: true };
        return base && { ...base, nullable: true };
    }
    const base = parseDef(def.innerType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", "0"],
    });
    return base && { anyOf: [base, { type: "null" }] };
}

function parseNumberDef(def, refs) {
    const res = {
        type: "number",
    };
    if (!def.checks)
        return res;
    for (const check of def.checks) {
        switch (check.kind) {
            case "int":
                res.type = "integer";
                addErrorMessage(res, "type", check.message, refs);
                break;
            case "min":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMinimum = true;
                    }
                    setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                }
                break;
            case "max":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMaximum = true;
                    }
                    setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                }
                break;
            case "multipleOf":
                setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
                break;
        }
    }
    return res;
}

function decideAdditionalProperties(def, refs) {
    if (refs.removeAdditionalStrategy === "strict") {
        return def.catchall._def.typeName === "ZodNever"
            ? def.unknownKeys !== "strict"
            : parseDef(def.catchall._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalProperties"],
            }) ?? true;
    }
    else {
        return def.catchall._def.typeName === "ZodNever"
            ? def.unknownKeys === "passthrough"
            : parseDef(def.catchall._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalProperties"],
            }) ?? true;
    }
}
function parseObjectDef(def, refs) {
    const result = {
        type: "object",
        ...Object.entries(def.shape()).reduce((acc, [propName, propDef]) => {
            if (propDef === undefined || propDef._def === undefined)
                return acc;
            const parsedDef = parseDef(propDef._def, {
                ...refs,
                currentPath: [...refs.currentPath, "properties", propName],
                propertyPath: [...refs.currentPath, "properties", propName],
            });
            if (parsedDef === undefined)
                return acc;
            return {
                properties: { ...acc.properties, [propName]: parsedDef },
                required: propDef.isOptional()
                    ? acc.required
                    : [...acc.required, propName],
            };
        }, { properties: {}, required: [] }),
        additionalProperties: decideAdditionalProperties(def, refs),
    };
    if (!result.required.length)
        delete result.required;
    return result;
}

const parseOptionalDef = (def, refs) => {
    if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
        return parseDef(def.innerType._def, refs);
    }
    const innerSchema = parseDef(def.innerType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", "1"],
    });
    return innerSchema
        ? {
            anyOf: [
                {
                    not: {},
                },
                innerSchema,
            ],
        }
        : {};
};

const parsePipelineDef = (def, refs) => {
    if (refs.pipeStrategy === "input") {
        return parseDef(def.in._def, refs);
    }
    else if (refs.pipeStrategy === "output") {
        return parseDef(def.out._def, refs);
    }
    const a = parseDef(def.in._def, {
        ...refs,
        currentPath: [...refs.currentPath, "allOf", "0"],
    });
    const b = parseDef(def.out._def, {
        ...refs,
        currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"],
    });
    return {
        allOf: [a, b].filter((x) => x !== undefined),
    };
};

function parsePromiseDef(def, refs) {
    return parseDef(def.type._def, refs);
}

function parseSetDef(def, refs) {
    const items = parseDef(def.valueType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items"],
    });
    const schema = {
        type: "array",
        uniqueItems: true,
        items,
    };
    if (def.minSize) {
        setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
    }
    if (def.maxSize) {
        setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
    }
    return schema;
}

function parseTupleDef(def, refs) {
    if (def.rest) {
        return {
            type: "array",
            minItems: def.items.length,
            items: def.items
                .map((x, i) => parseDef(x._def, {
                ...refs,
                currentPath: [...refs.currentPath, "items", `${i}`],
            }))
                .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
            additionalItems: parseDef(def.rest._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalItems"],
            }),
        };
    }
    else {
        return {
            type: "array",
            minItems: def.items.length,
            maxItems: def.items.length,
            items: def.items
                .map((x, i) => parseDef(x._def, {
                ...refs,
                currentPath: [...refs.currentPath, "items", `${i}`],
            }))
                .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
        };
    }
}

function parseUndefinedDef() {
    return {
        not: {},
    };
}

function parseUnknownDef() {
    return {};
}

const parseReadonlyDef = (def, refs) => {
    return parseDef(def.innerType._def, refs);
};

function parseDef(def, refs, forceResolution = false) {
    const seenItem = refs.seen.get(def);
    if (refs.override) {
        const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
        if (overrideResult !== ignoreOverride) {
            return overrideResult;
        }
    }
    if (seenItem && !forceResolution) {
        const seenSchema = get$ref(seenItem, refs);
        if (seenSchema !== undefined) {
            return seenSchema;
        }
    }
    const newItem = { def, path: refs.currentPath, jsonSchema: undefined };
    refs.seen.set(def, newItem);
    const jsonSchema = selectParser(def, def.typeName, refs);
    if (jsonSchema) {
        addMeta(def, refs, jsonSchema);
    }
    newItem.jsonSchema = jsonSchema;
    return jsonSchema;
}
const get$ref = (item, refs) => {
    switch (refs.$refStrategy) {
        case "root":
            return { $ref: item.path.join("/") };
        case "relative":
            return { $ref: getRelativePath(refs.currentPath, item.path) };
        case "none":
        case "seen": {
            if (item.path.length < refs.currentPath.length &&
                item.path.every((value, index) => refs.currentPath[index] === value)) {
                console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                return {};
            }
            return refs.$refStrategy === "seen" ? {} : undefined;
        }
    }
};
const getRelativePath = (pathA, pathB) => {
    let i = 0;
    for (; i < pathA.length && i < pathB.length; i++) {
        if (pathA[i] !== pathB[i])
            break;
    }
    return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
const selectParser = (def, typeName, refs) => {
    switch (typeName) {
        case ZodFirstPartyTypeKind.ZodString:
            return parseStringDef(def, refs);
        case ZodFirstPartyTypeKind.ZodNumber:
            return parseNumberDef(def, refs);
        case ZodFirstPartyTypeKind.ZodObject:
            return parseObjectDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBigInt:
            return parseBigintDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBoolean:
            return parseBooleanDef();
        case ZodFirstPartyTypeKind.ZodDate:
            return parseDateDef(def, refs);
        case ZodFirstPartyTypeKind.ZodUndefined:
            return parseUndefinedDef();
        case ZodFirstPartyTypeKind.ZodNull:
            return parseNullDef(refs);
        case ZodFirstPartyTypeKind.ZodArray:
            return parseArrayDef(def, refs);
        case ZodFirstPartyTypeKind.ZodUnion:
        case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return parseUnionDef(def, refs);
        case ZodFirstPartyTypeKind.ZodIntersection:
            return parseIntersectionDef(def, refs);
        case ZodFirstPartyTypeKind.ZodTuple:
            return parseTupleDef(def, refs);
        case ZodFirstPartyTypeKind.ZodRecord:
            return parseRecordDef(def, refs);
        case ZodFirstPartyTypeKind.ZodLiteral:
            return parseLiteralDef(def, refs);
        case ZodFirstPartyTypeKind.ZodEnum:
            return parseEnumDef(def);
        case ZodFirstPartyTypeKind.ZodNativeEnum:
            return parseNativeEnumDef(def);
        case ZodFirstPartyTypeKind.ZodNullable:
            return parseNullableDef(def, refs);
        case ZodFirstPartyTypeKind.ZodOptional:
            return parseOptionalDef(def, refs);
        case ZodFirstPartyTypeKind.ZodMap:
            return parseMapDef(def, refs);
        case ZodFirstPartyTypeKind.ZodSet:
            return parseSetDef(def, refs);
        case ZodFirstPartyTypeKind.ZodLazy:
            return parseDef(def.getter()._def, refs);
        case ZodFirstPartyTypeKind.ZodPromise:
            return parsePromiseDef(def, refs);
        case ZodFirstPartyTypeKind.ZodNaN:
        case ZodFirstPartyTypeKind.ZodNever:
            return parseNeverDef();
        case ZodFirstPartyTypeKind.ZodEffects:
            return parseEffectsDef(def, refs);
        case ZodFirstPartyTypeKind.ZodAny:
            return parseAnyDef();
        case ZodFirstPartyTypeKind.ZodUnknown:
            return parseUnknownDef();
        case ZodFirstPartyTypeKind.ZodDefault:
            return parseDefaultDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBranded:
            return parseBrandedDef(def, refs);
        case ZodFirstPartyTypeKind.ZodReadonly:
            return parseReadonlyDef(def, refs);
        case ZodFirstPartyTypeKind.ZodCatch:
            return parseCatchDef(def, refs);
        case ZodFirstPartyTypeKind.ZodPipeline:
            return parsePipelineDef(def, refs);
        case ZodFirstPartyTypeKind.ZodFunction:
        case ZodFirstPartyTypeKind.ZodVoid:
        case ZodFirstPartyTypeKind.ZodSymbol:
            return undefined;
        default:
            /* c8 ignore next */
            return ((_) => undefined)();
    }
};
const addMeta = (def, refs, jsonSchema) => {
    if (def.description) {
        jsonSchema.description = def.description;
        if (refs.markdownDescription) {
            jsonSchema.markdownDescription = def.description;
        }
    }
    return jsonSchema;
};

const zodToJsonSchema = (schema, options) => {
    const refs = getRefs(options);
    const definitions = typeof options === "object" && options.definitions
        ? Object.entries(options.definitions).reduce((acc, [name, schema]) => ({
            ...acc,
            [name]: parseDef(schema._def, {
                ...refs,
                currentPath: [...refs.basePath, refs.definitionPath, name],
            }, true) ?? {},
        }), {})
        : undefined;
    const name = typeof options === "string"
        ? options
        : options?.nameStrategy === "title"
            ? undefined
            : options?.name;
    const main = parseDef(schema._def, name === undefined
        ? refs
        : {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name],
        }, false) ?? {};
    const title = typeof options === "object" &&
        options.name !== undefined &&
        options.nameStrategy === "title"
        ? options.name
        : undefined;
    if (title !== undefined) {
        main.title = title;
    }
    const combined = name === undefined
        ? definitions
            ? {
                ...main,
                [refs.definitionPath]: definitions,
            }
            : main
        : {
            $ref: [
                ...(refs.$refStrategy === "relative" ? [] : refs.basePath),
                refs.definitionPath,
                name,
            ].join("/"),
            [refs.definitionPath]: {
                ...definitions,
                [name]: main,
            },
        };
    if (refs.target === "jsonSchema7") {
        combined.$schema = "http://json-schema.org/draft-07/schema#";
    }
    else if (refs.target === "jsonSchema2019-09") {
        combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
    }
    return combined;
};

var memoize$1;
var hasRequiredMemoize;

function requireMemoize () {
	if (hasRequiredMemoize) return memoize$1;
	hasRequiredMemoize = 1;
	function isPrimitive(value) {
	  return ((typeof value !== 'object') && (typeof value !== 'function')) || (value === null);
	}

	function MapTree() {
	  this.childBranches = new WeakMap();
	  this.primitiveKeys = new Map();
	  this.hasValue = false;
	  this.value = undefined;
	}

	MapTree.prototype.has = function has(key) {
	  var keyObject = (isPrimitive(key) ? this.primitiveKeys.get(key) : key);
	  return (keyObject ? this.childBranches.has(keyObject) : false);
	};

	MapTree.prototype.get = function get(key) {
	  var keyObject = (isPrimitive(key) ? this.primitiveKeys.get(key) : key);
	  return (keyObject ? this.childBranches.get(keyObject) : undefined);
	};

	MapTree.prototype.resolveBranch = function resolveBranch(key) {
	  if (this.has(key)) { return this.get(key); }
	  var newBranch = new MapTree();
	  var keyObject = this.createKey(key);
	  this.childBranches.set(keyObject, newBranch);
	  return newBranch;
	};

	MapTree.prototype.setValue = function setValue(value) {
	  this.hasValue = true;
	  return (this.value = value);
	};

	MapTree.prototype.createKey = function createKey(key) {
	  if (isPrimitive(key)) {
	    var keyObject = {};
	    this.primitiveKeys.set(key, keyObject);
	    return keyObject;
	  }
	  return key;
	};

	MapTree.prototype.clear = function clear() {
	  if (arguments.length === 0) {
	    this.childBranches = new WeakMap();
	    this.primitiveKeys.clear();
	    this.hasValue = false;
	    this.value = undefined;
	  } else if (arguments.length === 1) {
	    var key = arguments[0];
	    if (isPrimitive(key)) {
	      var keyObject = this.primitiveKeys.get(key);
	      if (keyObject) {
	        this.childBranches.delete(keyObject);
	        this.primitiveKeys.delete(key);
	      }
	    } else {
	      this.childBranches.delete(key);
	    }
	  } else {
	    var childKey = arguments[0];
	    if (this.has(childKey)) {
	      var childBranch = this.get(childKey);
	      childBranch.clear.apply(childBranch, Array.prototype.slice.call(arguments, 1));
	    }
	  }
	};

	memoize$1 = function memoize(fn) {
	  var argsTree = new MapTree();

	  function memoized() {
	    var args = Array.prototype.slice.call(arguments);
	    var argNode = args.reduce(function getBranch(parentBranch, arg) {
	      return parentBranch.resolveBranch(arg);
	    }, argsTree);
	    if (argNode.hasValue) { return argNode.value; }
	    var value = fn.apply(null, args);
	    return argNode.setValue(value);
	  }

	  memoized.clear = argsTree.clear.bind(argsTree);

	  return memoized;
	};
	return memoize$1;
}

var memoizeWeak;
var hasRequiredMemoizeWeak;

function requireMemoizeWeak () {
	if (hasRequiredMemoizeWeak) return memoizeWeak;
	hasRequiredMemoizeWeak = 1;
	memoizeWeak = requireMemoize();
	return memoizeWeak;
}

var memoizeWeakExports = requireMemoizeWeak();
var baseMemoize = /*@__PURE__*/getDefaultExportFromCjs(memoizeWeakExports);

function constraints(schema) {
  return _constraints(schemaInfo(schema, false, []), []);
}
function merge(...constraints2) {
  const filtered = constraints2.filter((c) => !!c);
  if (!filtered.length)
    return void 0;
  if (filtered.length == 1)
    return filtered[0];
  return merge$1(...filtered);
}
function _constraints(info, path) {
  if (!info)
    return void 0;
  let output = void 0;
  if (info.union && info.union.length) {
    const infos = info.union.map((s) => schemaInfo(s, info.isOptional, path));
    const merged = infos.map((i) => _constraints(i, path));
    output = merge(output, ...merged);
    if (output && (info.isNullable || info.isOptional || infos.some((i) => i?.isNullable || i?.isOptional))) {
      delete output.required;
    }
  }
  if (info.array) {
    output = merge(output, ...info.array.map((i) => _constraints(schemaInfo(i, info.isOptional, path), path)));
  }
  if (info.properties) {
    const obj = {};
    for (const [key, prop] of Object.entries(info.properties)) {
      const propInfo = schemaInfo(prop, !info.required?.includes(key) || prop.default !== void 0, [key]);
      const propConstraint = _constraints(propInfo, [...path, key]);
      if (typeof propConstraint === "object" && Object.values(propConstraint).length > 0) {
        obj[key] = propConstraint;
      }
    }
    output = merge(output, obj);
  }
  return output ?? constraint(info);
}
function constraint(info) {
  const output = {};
  const schema = info.schema;
  const type = schema.type;
  const format = schema.format;
  if (type == "integer" && format == "unix-time") {
    const date = schema;
    if (date.minimum !== void 0)
      output.min = new Date(date.minimum).toISOString();
    if (date.maximum !== void 0)
      output.max = new Date(date.maximum).toISOString();
  } else if (type == "string") {
    const str = schema;
    const patterns = [
      str.pattern,
      ...str.allOf ? str.allOf.map((s) => typeof s == "boolean" ? void 0 : s.pattern) : []
    ].filter((s) => s !== void 0);
    if (patterns.length > 0)
      output.pattern = patterns[0];
    if (str.minLength !== void 0)
      output.minlength = str.minLength;
    if (str.maxLength !== void 0)
      output.maxlength = str.maxLength;
  } else if (type == "number" || type == "integer") {
    const num = schema;
    if (num.minimum !== void 0)
      output.min = num.minimum;
    else if (num.exclusiveMinimum !== void 0)
      output.min = num.exclusiveMinimum + (type == "integer" ? 1 : Number.MIN_VALUE);
    if (num.maximum !== void 0)
      output.max = num.maximum;
    else if (num.exclusiveMaximum !== void 0)
      output.max = num.exclusiveMaximum - (type == "integer" ? 1 : Number.MIN_VALUE);
    if (num.multipleOf !== void 0)
      output.step = num.multipleOf;
  } else if (type == "array") {
    const arr = schema;
    if (arr.minItems !== void 0)
      output.min = arr.minItems;
    if (arr.maxItems !== void 0)
      output.max = arr.maxItems;
  }
  if (!info.isNullable && !info.isOptional) {
    output.required = true;
  }
  return Object.keys(output).length > 0 ? output : void 0;
}
function schemaHash(schema) {
  return hashCode(_schemaHash(schemaInfo(schema, false, []), 0, []));
}
function _schemaHash(info, depth, path) {
  if (!info)
    return "";
  function tab() {
    return "  ".repeat(depth);
  }
  function mapSchemas(schemas) {
    return schemas.map((s) => _schemaHash(schemaInfo(s, info?.isOptional ?? false, path), depth + 1, path)).filter((s) => s).join("|");
  }
  function nullish() {
    const output = [];
    if (info?.isNullable)
      output.push("null");
    if (info?.isOptional)
      output.push("undefined");
    return !output.length ? "" : "|" + output.join("|");
  }
  if (info.union) {
    return "Union {\n  " + tab() + mapSchemas(info.union) + "\n" + tab() + "}" + nullish();
  }
  if (info.properties) {
    const output = [];
    for (const [key, prop] of Object.entries(info.properties)) {
      const propInfo = schemaInfo(prop, !info.required?.includes(key) || prop.default !== void 0, [key]);
      output.push(key + ": " + _schemaHash(propInfo, depth + 1, path));
    }
    return "Object {\n  " + tab() + output.join(",\n  ") + "\n" + tab() + "}" + nullish();
  }
  if (info.array) {
    return "Array[" + mapSchemas(info.array) + "]" + nullish();
  }
  return info.types.join("|") + nullish();
}
function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  if (hash < 0)
    hash = hash >>> 0;
  return hash.toString(36);
}
// @__NO_SIDE_EFFECTS__
function createAdapter(adapter, jsonSchema) {
  if (!adapter || !("superFormValidationLibrary" in adapter)) {
    throw new SuperFormError('Superforms v2 requires a validation adapter for the schema. Import one of your choice from "sveltekit-superforms/adapters" and wrap the schema with it.');
  }
  if (!jsonSchema)
    jsonSchema = adapter.jsonSchema;
  return {
    ...adapter,
    constraints: adapter.constraints ?? constraints(jsonSchema),
    defaults: adapter.defaults ?? defaultValues(jsonSchema),
    shape: schemaShape(jsonSchema),
    id: schemaHash(jsonSchema)
  };
}
async function superValidate(data, adapter, options) {
  if (data && "superFormValidationLibrary" in data) {
    options = adapter;
    adapter = data;
    data = void 0;
  }
  const validator = adapter;
  const defaults = options?.defaults ?? validator.defaults;
  const jsonSchema = validator.jsonSchema;
  const parsed = await parseRequest(data, jsonSchema, options);
  const addErrors = options?.errors ?? (options?.strict ? true : !!parsed.data);
  const parsedData = options?.strict ? parsed.data ?? {} : mergeDefaults(parsed.data, defaults);
  let status;
  if (!!parsed.data || addErrors) {
    status = await /* @__PURE__ */ validator.validate(parsedData);
  } else {
    status = { success: false, issues: [] };
  }
  const valid = status.success;
  const errors = valid || !addErrors ? {} : mapErrors(status.issues, validator.shape);
  const dataWithDefaults = valid ? status.data : replaceInvalidDefaults(options?.strict ? mergeDefaults(parsedData, defaults) : parsedData, defaults, jsonSchema, status.issues, options?.preprocessed);
  let outputData;
  if (jsonSchema.additionalProperties === false) {
    outputData = {};
    for (const key of Object.keys(jsonSchema.properties ?? {})) {
      if (key in dataWithDefaults)
        outputData[key] = dataWithDefaults[key];
    }
  } else {
    outputData = dataWithDefaults;
  }
  const output = {
    id: parsed.id ?? options?.id ?? validator.id,
    valid,
    posted: parsed.posted,
    errors,
    data: outputData
  };
  if (!parsed.posted) {
    output.constraints = validator.constraints;
    if (Object.keys(validator.shape).length) {
      output.shape = validator.shape;
    }
  }
  return output;
}
function setError(form, path, error, options) {
  if (options === void 0)
    options = {};
  const errArr = Array.isArray(error) ? error : [error];
  if (!form.errors)
    form.errors = {};
  {
    const realPath = splitPath(path);
    const leaf = traversePath(form.errors, realPath, ({ parent, key, value }) => {
      if (value === void 0)
        parent[key] = {};
      return parent[key];
    });
    if (leaf) {
      leaf.parent[leaf.key] = Array.isArray(leaf.value) && !options.overwrite ? leaf.value.concat(errArr) : errArr;
    }
  }
  form.valid = false;
  const output = options.removeFiles === false ? { form } : withFiles({ form });
  return fail$1(options.status ?? 400, output);
}
function withFiles(obj) {
  if (typeof obj !== "object")
    return obj;
  for (const key in obj) {
    const value = obj[key];
    if (value instanceof File)
      delete obj[key];
    else if (value && typeof value === "object")
      withFiles(value);
  }
  return obj;
}
const removeFiles = withFiles;
function fail(status, data) {
  function checkForm(data2) {
    return !!data2 && typeof data2 === "object" && "valid" in data2 && "data" in data2 && "id" in data2;
  }
  function checkObj(data2) {
    if (data2 && typeof data2 === "object") {
      for (const key in data2) {
        const v = data2[key];
        if (checkForm(v)) {
          v.valid = false;
          removeFiles(v);
        } else if (v && typeof v === "object") {
          checkObj(v);
        }
      }
    }
    return data2;
  }
  return fail$1(status, checkObj(data));
}
const memoize = baseMemoize;
const defaultOptions = {
  dateStrategy: "integer",
  pipeStrategy: "output",
  $refStrategy: "none"
};
const zodToJSONSchema = /* @__NO_SIDE_EFFECTS__ */ (...params) => {
  params[1] = typeof params[1] == "object" ? { ...defaultOptions, ...params[1] } : defaultOptions;
  return zodToJsonSchema(...params);
};
async function validate(schema, data, errorMap) {
  const result = await schema.safeParseAsync(data, { errorMap });
  if (result.success) {
    return {
      data: result.data,
      success: true
    };
  }
  return {
    issues: result.error.issues.map(({ message, path }) => ({ message, path })),
    success: false
  };
}
function _zod(schema, options) {
  return /* @__PURE__ */ createAdapter({
    superFormValidationLibrary: "zod",
    validate: async (data) => validate(schema, data, options?.errorMap),
    jsonSchema: options?.jsonSchema ?? /* @__PURE__ */ zodToJSONSchema(schema, options?.config),
    defaults: options?.defaults
  });
}
const zod = /* @__PURE__ */ memoize(_zod);

export { zod as a, setError as b, superForm as c, fail as f, superValidate as s, z };
//# sourceMappingURL=zod-ByBoZeAL.js.map
