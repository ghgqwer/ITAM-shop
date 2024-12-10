import { rootSchema } from "@ark/schema";
import { arkModule } from "../utils.js";
import { regexStringNode } from "./utils.js";
const preformatted = regexStringNode(/^[A-Z].*$/, "capitalized");
export const capitalize = arkModule({
    root: rootSchema({
        in: "string",
        morphs: (s) => s.charAt(0).toUpperCase() + s.slice(1),
        declaredOut: preformatted
    }),
    preformatted
});
