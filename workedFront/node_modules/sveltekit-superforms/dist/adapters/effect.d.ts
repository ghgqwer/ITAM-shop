import { Schema } from '@effect/schema';
import type { JSONSchema as TJSONSchema } from '../jsonSchema/index.js';
import { type AdapterOptions, type ClientValidationAdapter, type Infer, type InferIn, type ValidationAdapter } from './adapters.js';
import type { ParseOptions } from '@effect/schema/AST';
export declare const effectToJSONSchema: <A, I>(schema: Schema.Schema<A, I>) => TJSONSchema;
type AnySchema = Schema.Schema<any, any>;
export declare const effect: <T extends AnySchema>(schema: T, options?: (AdapterOptions<Infer<T>> & {
    parseOptions?: ParseOptions;
}) | undefined) => ValidationAdapter<Infer<T>, InferIn<T>>;
export declare const effectClient: <T extends AnySchema>(schema: T, options?: (AdapterOptions<Infer<T>> & {
    parseOptions?: ParseOptions;
}) | undefined) => ClientValidationAdapter<Infer<T>, InferIn<T>>;
export {};
