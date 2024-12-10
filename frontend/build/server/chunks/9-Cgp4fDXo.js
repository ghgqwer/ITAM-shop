const load = async ({ params }) => {
  const id = params.id;
  console.log("Загружается товар с ID:", id);
  return { id };
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BB5r26hG.js')).default;
const universal_id = "src/routes/GoodCardAdmin/[id]/+page.ts";
const imports = ["_app/immutable/nodes/9.CQ_QzKt-.js","_app/immutable/chunks/scheduler.RGCH8erx.js","_app/immutable/chunks/index.BHBwDQaC.js","_app/immutable/chunks/entry.B0YtdMGf.js","_app/immutable/chunks/logic.vmqYchRS.js"];
const stylesheets = ["_app/immutable/assets/9.E44jiOKu.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=9-Cgp4fDXo.js.map
