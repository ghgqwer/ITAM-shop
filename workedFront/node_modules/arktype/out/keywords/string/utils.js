import { node } from "@ark/schema";
// Non-trivial expressions should have an explanation or attribution
export const regexStringNode = (regex, description) => node("intersection", {
    domain: "string",
    pattern: {
        rule: regex.source,
        flags: regex.flags,
        meta: description
    }
});
