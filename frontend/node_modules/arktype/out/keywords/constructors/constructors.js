import { ecmascriptConstructors, flatMorph, platformConstructors } from "@ark/util";
import { arkModule } from "../utils.js";
import { arkArray } from "./Array.js";
import { arkFormData } from "./FormData.js";
import { TypedArray } from "./TypedArray.js";
const omittedPrototypes = {
    Boolean: 1,
    Number: 1,
    String: 1
};
export const arkPrototypes = arkModule({
    ...flatMorph({ ...ecmascriptConstructors, ...platformConstructors }, (k, v) => (k in omittedPrototypes ? [] : [k, ["instanceof", v]])),
    Array: arkArray,
    TypedArray,
    FormData: arkFormData
});
