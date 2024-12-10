import { c as create_ssr_component, b as add_attribute } from './ssr-BXSlJoex.js';
import './lifecycle-BF8Cb2Co.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let url;
  return `<input${add_attribute("value", url, 0)}> <img alt="qr"${add_attribute("src", `https://qrtag.net/api/qr.png?url=${url}`, 0)}>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-FLgrO-Kn.js.map
