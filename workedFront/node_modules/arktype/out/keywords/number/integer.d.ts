import type { number } from "./number.ts";
export declare const integer: import("@ark/schema").BaseRoot<import("@ark/schema").InternalRootDeclaration>;
export type integer = number.divisibleBy<1>;
