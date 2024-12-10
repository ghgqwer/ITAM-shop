import { rootSchema } from "@ark/schema";
import { arkModule } from "../utils.js";
import { regexStringNode } from "./utils.js";
const preformatted = regexStringNode(
// no leading or trailing whitespace
/^\S.*\S$|^\S?$/, "trimmed");
export const trim = arkModule({
    root: rootSchema({
        in: "string",
        morphs: (s) => s.trim(),
        declaredOut: preformatted
    }),
    preformatted
});
