import { b as subscribe } from './lifecycle-BF8Cb2Co.js';
import { c as create_ssr_component, e as escape } from './ssr-BXSlJoex.js';
import { p as page } from './stores-CYrMs1_A.js';
import './client-Bquu-9ER.js';
import './exports-BGi7-Rnc.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-BARJ3Q8y.js.map
