import { genericNode, intrinsic } from "@ark/schema";
import { Hkt } from "@ark/util";
import { arkModule } from "./utils.js";
class MergeHkt extends Hkt {
}
const Merge = genericNode(["base", intrinsic.object], ["props", intrinsic.object])(args => args.base.merge(args.props), MergeHkt);
export const arkBuiltins = arkModule({
    Key: intrinsic.key,
    Merge
});
