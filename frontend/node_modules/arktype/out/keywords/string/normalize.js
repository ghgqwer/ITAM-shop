import { rootSchema } from "@ark/schema";
import { flatMorph } from "@ark/util";
import { arkModule } from "../utils.js";
export const normalizedForms = ["NFC", "NFD", "NFKC", "NFKD"];
const preformattedNodes = flatMorph(normalizedForms, (i, form) => [
    form,
    rootSchema({
        domain: "string",
        predicate: (s) => s.normalize(form) === s,
        meta: `${form}-normalized unicode`
    })
]);
const normalizeNodes = flatMorph(normalizedForms, (i, form) => [
    form,
    rootSchema({
        in: "string",
        morphs: (s) => s.normalize(form),
        declaredOut: preformattedNodes[form]
    })
]);
export const NFC = arkModule({
    root: normalizeNodes.NFC,
    preformatted: preformattedNodes.NFC
});
export const NFD = arkModule({
    root: normalizeNodes.NFD,
    preformatted: preformattedNodes.NFD
});
export const NFKC = arkModule({
    root: normalizeNodes.NFKC,
    preformatted: preformattedNodes.NFKC
});
export const NFKD = arkModule({
    root: normalizeNodes.NFKD,
    preformatted: preformattedNodes.NFKD
});
export const normalize = arkModule({
    root: "NFC",
    NFC,
    NFD,
    NFKC,
    NFKD
});
