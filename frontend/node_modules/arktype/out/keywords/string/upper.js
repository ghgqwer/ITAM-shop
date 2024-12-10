import { rootSchema } from "@ark/schema";
import { arkModule } from "../utils.js";
import { regexStringNode } from "./utils.js";
const preformatted = regexStringNode(/^[A-Z]*$/, "only uppercase letters");
export const upper = arkModule({
    root: rootSchema({
        in: "string",
        morphs: (s) => s.toUpperCase(),
        declaredOut: preformatted
    }),
    preformatted
});
