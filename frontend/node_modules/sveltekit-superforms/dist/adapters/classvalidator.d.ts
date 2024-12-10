import { type ValidationAdapter, type Infer, type InferIn, type ClientValidationAdapter, type RequiredDefaultsOptions } from './adapters.js';
import type { Schema } from '@typeschema/class-validator';
export declare const classvalidator: <T extends Schema>(schema: T, options: RequiredDefaultsOptions<Infer<T>>) => ValidationAdapter<Infer<T>, InferIn<T>>;
export declare const classvalidatorClient: <T extends Schema>(schema: T) => ClientValidationAdapter<Infer<T>, InferIn<T>>;
