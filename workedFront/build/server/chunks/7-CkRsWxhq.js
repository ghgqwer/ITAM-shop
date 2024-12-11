import './client-Bquu-9ER.js';
import { z, s as superValidate, a as zod, b as setError, f as fail } from './zod-ByBoZeAL.js';
import './stringify-Pcd8Ia2c.js';
import './exports-BGi7-Rnc.js';
import './index2-D_TwCJel.js';
import './lifecycle-BF8Cb2Co.js';
import './stores-CYrMs1_A.js';

const schema = z.object({
  password: z.string(),
  email: z.string().email()
});
const load = async ({ params }) => {
  const form = await superValidate(zod(schema));
  return { form };
};
const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(schema));
    if (form.data.password == "") {
      setError(form, "password", "Введите пароль");
      return fail(400, { form });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Czz8A8_o.js')).default;
const server_id = "src/routes/Exict/+page.server.ts";
const imports = ["_app/immutable/nodes/7.myKf2te2.js","_app/immutable/chunks/scheduler.RGCH8erx.js","_app/immutable/chunks/index.BHBwDQaC.js","_app/immutable/chunks/entry.B0YtdMGf.js","_app/immutable/chunks/formData.CNmCM1Pb.js","_app/immutable/chunks/stores.BSndGV9U.js"];
const stylesheets = ["_app/immutable/assets/7.DmMsAnjH.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-CkRsWxhq.js.map
