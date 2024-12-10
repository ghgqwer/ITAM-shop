import { regexStringNode } from "./utils.js";
export const alphanumeric = regexStringNode(/^[A-Za-z\d]*$/, "only letters and digits 0-9");
