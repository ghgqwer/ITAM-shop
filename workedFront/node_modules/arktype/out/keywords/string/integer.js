import { intrinsic, rootSchema } from "@ark/schema";
import { wellFormedIntegerMatcher } from "@ark/util";
import { arkModule } from "../utils.js";
import { regexStringNode } from "./utils.js";
const root = regexStringNode(wellFormedIntegerMatcher, "a well-formed integer string");
export const integer = arkModule({
    root,
    parse: rootSchema({
        in: root,
        morphs: (s, ctx) => {
            const parsed = Number.parseInt(s);
            return Number.isSafeInteger(parsed) ? parsed : (ctx.error("an integer in the range Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER"));
        },
        declaredOut: intrinsic.integer
    })
});
