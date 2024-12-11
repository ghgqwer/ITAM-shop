import { intrinsic, rootSchema } from "@ark/schema";
import { arkModule } from "../utils.js";
import { epoch } from "./epoch.js";
import { integer } from "./integer.js";
export const number = arkModule({
    root: intrinsic.number,
    integer,
    epoch,
    safe: rootSchema({
        domain: "number",
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
        predicate: {
            predicate: n => !Number.isNaN(n),
            meta: "a safe number"
        }
    }),
    NaN: ["===", Number.NaN],
    Infinity: ["===", Number.POSITIVE_INFINITY],
    NegativeInfinity: ["===", Number.NEGATIVE_INFINITY]
});
