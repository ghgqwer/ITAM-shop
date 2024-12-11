import type { type } from 'arktype';
import { type ValidationAdapter, type RequiredDefaultsOptions, type ClientValidationAdapter } from './adapters.js';
export declare const arktype: <T extends type.Any>(schema: T, options: RequiredDefaultsOptions<T["infer"]>) => ValidationAdapter<T["infer"], T["inferIn"]>;
export declare const arktypeClient: <T extends type.Any>(schema: T) => ClientValidationAdapter<T["infer"], T["inferIn"]>;
