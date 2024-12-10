import { intrinsic, rootSchema } from "@ark/schema";
import { wellFormedNumberMatcher } from "@ark/util";
import { arkModule } from "../utils.js";
import { regexStringNode } from "./utils.js";
const root = regexStringNode(wellFormedNumberMatcher, "a well-formed numeric string");
export const numeric = arkModule({
    root,
    parse: rootSchema({
        in: root,
        morphs: (s) => Number.parseFloat(s),
        declaredOut: intrinsic.number
    })
});
