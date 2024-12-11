import { rootSchema } from "@ark/schema";
import { arkModule } from "../utils.js";
import { regexStringNode } from "./utils.js";
const preformatted = regexStringNode(/^[a-z]*$/, "only lowercase letters");
export const lower = arkModule({
    root: rootSchema({
        in: "string",
        morphs: (s) => s.toLowerCase(),
        declaredOut: preformatted
    }),
    preformatted
});
