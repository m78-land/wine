(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"9kvl":function(n,e,t){"use strict";var a=t("FfOG");t.d(e,"a",(function(){return a["b"]}));t("bCY9")},Rsk4:function(n,e,t){"use strict";t.r(e);var a=t("9og8"),i=t("WmNS"),r=t.n(i),d=t("rlch"),c="import React from 'react';\nimport Wine from '@m78/wine';\n\nconst Play = () => {\n  function renderHandle() {\n    Wine.render({\n      alignment: [0.45, 0.45],\n      content: (\n        <div>\n          <h2>window 1</h2>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n        </div>\n      ),\n      sizeRatio: 0.5,\n    });\n\n    Wine.render({\n      alignment: [0.5, 0.5],\n      content: (\n        <div>\n          <h2>window 2</h2>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n        </div>\n      ),\n      sizeRatio: 0.5,\n    });\n\n    Wine.render({\n      alignment: [0.55, 0.55],\n      content: (\n        <div>\n          <h2>window 3</h2>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n          <div>\ud83e\udd1e</div>\n        </div>\n      ),\n      sizeRatio: 0.5,\n    });\n  }\n\n  return (\n    <div>\n      <Wine.RenderBoxTarget />\n      <button onClick={renderHandle}>render window</button>\n    </div>\n  );\n};\n\nexport default Play;";e["default"]={"docs-play":{component:Object(d["dynamic"])({loader:function(){var n=Object(a["a"])(r.a.mark((function n(){return r.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,Promise.all([t.e(1),t.e(10),t.e(5)]).then(t.bind(null,"2X0w"));case 2:return n.abrupt("return",n.sent["default"]);case 3:case"end":return n.stop()}}),n)})));function e(){return n.apply(this,arguments)}return e}()}),previewerProps:{sources:{_:{tsx:c}},dependencies:{react:{version:"17.0.2"}},identifier:"docs-play"}}}},cJrn:function(n,e,t){"use strict";t.r(e);var a=t("q1tI"),i=t.n(a),r=t("dEAq"),d=t("0zqC"),c=t("ZpkN"),l=t("Rsk4"),o=i.a.memo(l["default"]["docs-play"].component);e["default"]=function(){return i.a.createElement(i.a.Fragment,null,i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:"markdown"},i.a.createElement("h2",{id:"\u5b89\u88c5"},i.a.createElement(r["AnchorLink"],{to:"#\u5b89\u88c5","aria-hidden":"true",tabIndex:-1},i.a.createElement("span",{className:"icon icon-link"})),"\u5b89\u88c5"),i.a.createElement(c["a"],{code:"yarn add @m78/wine",lang:"shell"}),i.a.createElement("p",null,"\u6216\u8005\u4f7f\u7528 npm"),i.a.createElement(c["a"],{code:"npm install @m78/wine",lang:"shell"}),i.a.createElement("br",null),i.a.createElement("h2",{id:"\u4f7f\u7528"},i.a.createElement(r["AnchorLink"],{to:"#\u4f7f\u7528","aria-hidden":"true",tabIndex:-1},i.a.createElement("span",{className:"icon icon-link"})),"\u4f7f\u7528")),i.a.createElement(d["default"],l["default"]["docs-play"].previewerProps,i.a.createElement(o,null))))}},x2v5:function(n){n.exports=JSON.parse("{}")}}]);