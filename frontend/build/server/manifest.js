const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["AddGoodButton.svg","backPicture.svg","backToMain.svg","basket.svg","coins.svg","delete.svg","deleteB.svg","forGoods.svg","icon-plus.svg","image.png","inventar.svg","itamF.svg","itamS.svg","itamS2.svg","lupa.svg","minus.png","profile.svg","кр2.pdf"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".pdf":"application/pdf"},
	_: {
		client: {"start":"_app/immutable/entry/start.Cs-UPDM3.js","app":"_app/immutable/entry/app.DUPsDCfY.js","imports":["_app/immutable/entry/start.Cs-UPDM3.js","_app/immutable/chunks/entry.B0YtdMGf.js","_app/immutable/chunks/scheduler.RGCH8erx.js","_app/immutable/entry/app.DUPsDCfY.js","_app/immutable/chunks/scheduler.RGCH8erx.js","_app/immutable/chunks/index.BHBwDQaC.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-cXbauqUR.js')),
			__memo(() => import('./chunks/1-jiclJEDx.js')),
			__memo(() => import('./chunks/2-Ba8xCmgf.js')),
			__memo(() => import('./chunks/3-Mebtw5sp.js')),
			__memo(() => import('./chunks/4-mwHni0JV.js')),
			__memo(() => import('./chunks/5-DGhAqjs6.js')),
			__memo(() => import('./chunks/6-TzX-7I0c.js')),
			__memo(() => import('./chunks/7-CkRsWxhq.js')),
			__memo(() => import('./chunks/8-pPxeN20f.js')),
			__memo(() => import('./chunks/9-Cgp4fDXo.js')),
			__memo(() => import('./chunks/10-CyVBs7Fo.js')),
			__memo(() => import('./chunks/11-U-WkvBmZ.js')),
			__memo(() => import('./chunks/12-Dk0sot8O.js'))
		],
		routes: [
			{
				id: "/AdminCatalog",
				pattern: /^\/AdminCatalog\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/AdminEntrance",
				pattern: /^\/AdminEntrance\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/Basket",
				pattern: /^\/Basket\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/Catalog",
				pattern: /^\/Catalog\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/Entrance",
				pattern: /^\/Entrance\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/Exict",
				pattern: /^\/Exict\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/GoodCardAdmin/[id]",
				pattern: /^\/GoodCardAdmin\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/GoodCard/[id]",
				pattern: /^\/GoodCard\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/Inventar",
				pattern: /^\/Inventar\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/SignIn",
				pattern: /^\/SignIn\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/qr",
				pattern: /^\/qr\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
