import { ArkErrors, intrinsic, rootSchema } from "@ark/schema";
import { number } from "../number/number.js";
import { arkModule } from "../utils.js";
import { integer } from "./integer.js";
import { regexStringNode } from "./utils.js";
const dayDelimiterMatcher = /^[./-]$/;
// ISO 8601 date/time modernized from https://github.com/validatorjs/validator.js/blob/master/src/lib/isISO8601.js
// Based on https://tc39.es/ecma262/#sec-date-time-string-format, the T
// delimiter for date/time is mandatory. Regex from validator.js strict matcher:
export const iso8601Matcher = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const isValidDateInstance = (date) => !Number.isNaN(+date);
const writeFormattedExpected = (format) => `a ${format}-formatted date`;
export const tryParseDatePattern = (data, opts) => {
    if (!opts?.format) {
        const result = new Date(data);
        return isValidDateInstance(result) ? result : "a valid date";
    }
    if (opts.format === "iso") {
        return iso8601Matcher.test(data) ?
            new Date(data)
            : writeFormattedExpected("iso");
    }
    const dataParts = data.split(dayDelimiterMatcher);
    // will be the first delimiter matched, if there is one
    const delimiter = data[dataParts[0].length];
    const formatParts = delimiter ? opts.format.split(delimiter) : [opts.format];
    if (dataParts.length !== formatParts.length)
        return writeFormattedExpected(opts.format);
    const parsedParts = {};
    for (let i = 0; i < formatParts.length; i++) {
        if (dataParts[i].length !== formatParts[i].length &&
            // if format is "m" or "d", data is allowed to be 1 or 2 characters
            !(formatParts[i].length === 1 && dataParts[i].length === 2))
            return writeFormattedExpected(opts.format);
        parsedParts[formatParts[i][0]] = dataParts[i];
    }
    const date = new Date(`${parsedParts.m}/${parsedParts.d}/${parsedParts.y}`);
    if (`${date.getDate()}` === parsedParts.d)
        return date;
    return writeFormattedExpected(opts.format);
};
const isParsableDate = (s) => !Number.isNaN(new Date(s).valueOf());
const parsableDate = rootSchema({
    domain: "string",
    predicate: {
        meta: "a parsable date",
        predicate: isParsableDate
    }
}).assertHasKind("intersection");
const epochRoot = integer.root.internal
    .narrow((s, ctx) => {
    // we know this is safe since it has already
    // been validated as an integer string
    const n = Number.parseInt(s);
    const out = number.epoch(n);
    if (out instanceof ArkErrors) {
        ctx.errors.merge(out);
        return false;
    }
    return true;
})
    .withMeta({
    description: "an integer string representing a safe Unix timestamp"
})
    .assertHasKind("intersection");
const epoch = arkModule({
    root: epochRoot,
    parse: rootSchema({
        in: epochRoot,
        morphs: (s) => new Date(s),
        declaredOut: intrinsic.Date
    })
});
const isoRoot = regexStringNode(iso8601Matcher, "an ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) date").internal.assertHasKind("intersection");
const iso = arkModule({
    root: isoRoot,
    parse: rootSchema({
        in: isoRoot,
        morphs: (s) => new Date(s),
        declaredOut: intrinsic.Date
    })
});
export const stringDate = arkModule({
    root: parsableDate,
    parse: rootSchema({
        declaredIn: parsableDate,
        in: "string",
        morphs: (s, ctx) => {
            const date = new Date(s);
            if (Number.isNaN(date.valueOf()))
                return ctx.error("a parsable date");
            return date;
        },
        declaredOut: intrinsic.Date
    }),
    iso,
    epoch
});
