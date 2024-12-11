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
const load = async ({ params, cookies }) => {
  const form = await superValidate(zod(schema));
  const visited = cookies.get("visited");
  cookies.set("visited", "true", { path: "/" });
  return {
    visited: visited || null,
    // можно вернуть значение visited
    form
  };
};
const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(schema));
    if (form.data.password == "") {
      setError(form, "password", "Введите пароль");
      return fail(400, { form });
    }
    cookies.set("jwt", "123", { path: "/" });
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bc4UvsAS.js')).default;
const server_id = "src/routes/AdminEntrance/+page.server.ts";
const imports = ["_app/immutable/nodes/3.NyvYmu96.js","_app/immutable/chunks/scheduler.RGCH8erx.js","_app/immutable/chunks/index.BHBwDQaC.js","_app/immutable/chunks/entry.B0YtdMGf.js","_app/immutable/chunks/formData.CNmCM1Pb.js","_app/immutable/chunks/stores.BSndGV9U.js"];
const stylesheets = ["_app/immutable/assets/3.DdlGvbyg.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-Mebtw5sp.js.map