import { regexStringNode } from "./utils.js";
export const email = regexStringNode(
// https://www.regular-expressions.info/email.html
/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "an email address");
