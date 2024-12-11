import { rootSchema } from "@ark/schema";
import { arkModule } from "../utils.js";
const isParsableUrl = (s) => {
    if (URL.canParse)
        return URL.canParse(s);
    // Can be removed once Node 18 is EOL
    try {
        new URL(s);
        return true;
    }
    catch {
        return false;
    }
};
const root = rootSchema({
    domain: "string",
    predicate: {
        meta: "a URL string",
        predicate: isParsableUrl
    }
});
export const url = arkModule({
    root,
    parse: rootSchema({
        declaredIn: root,
        in: "string",
        morphs: (s, ctx) => {
            try {
                return new URL(s);
            }
            catch {
                return ctx.error("a URL string");
            }
        },
        declaredOut: rootSchema(URL)
    })
});
