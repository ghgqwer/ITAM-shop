const load = async ({ params }) => {
  const id = params.id;
  console.log("Загружается товар с ID:", id);
  return { id };
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DTToLbEz.js')).default;
const universal_id = "src/routes/GoodCard/[id]/+page.ts";
const imports = ["_app/immutable/nodes/8.KbJ09kIl.js","_app/immutable/chunks/scheduler.RGCH8erx.js","_app/immutable/chunks/index.BHBwDQaC.js","_app/immutable/chunks/entry.B0YtdMGf.js"];
const stylesheets = ["_app/immutable/assets/8.fTATi2TR.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=8-pPxeN20f.js.map
