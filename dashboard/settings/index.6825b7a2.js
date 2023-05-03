var e={buildButton:function(e,n,t){const o=document.createElement("button");return t&&t.length>0&&o.classList.add(...t),o.name=e,o.innerText=n,o},buildLabel:function(e,n,t){const o=document.createElement("label");return t&&t.length>0&&o.classList.add(...t),o.htmlFor=e,o.innerText=n,o},buildTextInput:function(e,n,t){const o=document.createElement("input");return t&&t.length>0&&o.classList.add(...t),o.type="text",o.name=e,o.value=n,o},buildSelect:function(e,n,t){const o=document.createElement("select");return e&&e.length>0&&o.classList.add(...e),o.name=n,t.forEach((e=>{const n=document.createElement("option");n.value=e.value,n.innerText=e.label,n.selected=e.selected,o.add(n)})),o},buildHiddenInput:function(e,n){const t=document.createElement("input");return t.type="hidden",t.name=e,t.value=n,t},buildSpan:function(e,n){const t=document.createElement("span");return n&&n.length>0&&t.classList.add(...n),t.innerText=e,t},buildDiv:function(e,n){const t=document.createElement("div");return n&&n.length>0&&t.classList.add(...n),e&&(t.id=e),t},buildNumberInput:function(e,n,t){const o=document.createElement("input");return t&&t.length>0&&o.classList.add(...t),o.type="number",o.name=e,o.value=n,o},buildForm:function(e,n,t){const o=document.createElement("form");return e&&(o.name=e),n&&(o.id=n),t&&t.length>0&&o.classList.add(...t),o}};let n;var t;let o;(t=n||(n={})).soundCueConfig="soundCueConfig",t.soundCuesEnabled="soundCuesEnabled",t.soundCueList="soundCueList",t.soundCueLog="soundCueLog",t.soundCueTypes="soundCueTypes",t.soundCueCommandIndex="soundCueCommandIndex",t.nodeCGServerSoundCues="soundCues",(o||(o={})).change="change";var d=o;let a;var l;let i;(l=a||(a={})).commandFormRow="commandFormRow",l.btnRemove="btnRemove",l.btnAdd="btnAdd",l.formGroup="formGroup",l.middle="middle",l.btnToggleEnabled="btnToggleEnabled",l.enabled="enabled",l.readOnly="readOnly",l.hidden="hidden",l.cueSelectWrapper="cueSelectWrapper",(i||(i={})).cueConfigPanel="cueConfigPanel";const r=nodecg.Replicant(n.soundCueConfig),u=nodecg.Replicant(n.soundCueTypes),c=nodecg.Replicant(n.soundCueList);function s(e){if(e.preventDefault(),!r||!r.value)return void console.error("Failed enabling/disabling sound alert - replicant not available.");if(!e.target)return void console.error("Failed enabling/disabling sound alert - no event target found.");const n=e.target;if(!n.dataset.cmdName)return void console.error("Failed enabling/disabling sound alert - command name found.");const t=n.dataset.cmdName,o=r.value.find((e=>e.commandName===t));if(!o)return void console.error(`Failed enabling/disabling sound alert - command matching "${t}" not found.`);const d="true"===n.dataset.enabled;o.enabled=!d}function m(e){const n=e.querySelectorAll(".fieldValue");if(n&&n.length>0)for(let t=0;t<n.length;t++){const o=n[t];e.removeChild(o)}}function p(n){if(!c||!c.value)throw Error("Failed sound alert edit - sound cue replicant not available.");const t=c.value;return n.map((n=>{const o=t.map((e=>({label:e,value:e,selected:n===e})));return e.buildSelect([],"commandType",o)}))}function b(n){if(n.preventDefault(),!r||!r.value)return void console.error("Failed sound alert edit - config replicant not available.");if(!u||!u.value)return void console.error("Failed sound alert edit - type replicant not available.");if(!n.target)return void console.error("Failed sound alert edit - no event target found.");const t=n.target.closest("form");if(!t)return void console.error("Failed sound alert edit - unable to locate form.");const o=t.dataset.id?parseInt(t.dataset.id):-1;if(o<0)return void console.error("Failed sound alert edit - no ID found.");const d=t.querySelectorAll("div.formGroup");if(d.length<=0)return void console.error("Failed sound alert edit - unable to locate form groups.");const l=r.value.find((e=>e.id===o));if(l)for(let n=0;n<d.length;n++){const t=d[n];switch(t.dataset.fieldName){case"name":const n=e.buildTextInput("commandName",l.commandName);m(t),t.appendChild(n);break;case"cooldown":const o=l.coolDownMs?l.coolDownMs.toString():"0",d=e.buildNumberInput("cooldownMs",o);m(t),t.appendChild(d);break;case"type":const i=u.value.map((e=>({label:e,value:e,selected:l.commandType===e}))),r=e.buildSelect([],"commandType",i);m(t),t.appendChild(r);break;case"cues":const c=p(l.mappedCues);m(t),t.append(...c);break;case"edit":const s=e.buildButton("btnSave","Save",[a.btnAdd]),b=e.buildButton("btnCancel","Cancel",[]),f=e.buildButton("btnDelete","Delete",[a.btnRemove]);t.replaceChildren(s,b,f)}}else console.error(`Failed sound alert edit - command matching ID "${o}" not found.`)}function f(n){let t=[a.formGroup];n&&(t=t.concat(n));return e.buildDiv(void 0,t)}function g(n,t,o,d){const a=f();a.dataset.fieldName=n;let l=e.buildLabel(t,o);const i=e.buildSpan(d,["fieldValue"]);return a.append(l,i),a}function v(n,t){if(!u||!u.value)throw Error("Unable to map command rows - no command types are loaded.");if(!c||!c.value)throw Error("Unable to map command rows - no sound cues are loaded.");console.log(JSON.stringify(n));const o=e.buildForm(`commandForm-${n.id}`,null,[]);o.dataset.id=n.id.toString(),o.dataset.commandName=n.commandName,o.dataset.index=t.toString();const d=e.buildDiv(`cmd-row-${n.commandName}`,[a.commandFormRow]);let l=f([a.middle]),i=function(n,t){let o=n?"On":"Off";const d=e.buildButton("btnEnabled",o,[a.btnToggleEnabled]);return n&&d.classList.add(a.enabled),d.onclick=s,d.dataset.cmdName=t,d.dataset.enabled=n.toString(),d}(n.enabled,n.commandName);l.appendChild(i),d.appendChild(l),l=f([a.middle]);let r=e.buildSpan(n.id.toString());l.appendChild(r),d.appendChild(l),l=g("name","commandName","Name",n.commandName),d.appendChild(l),l=g("cooldown","coolDownMs","Cooldown",n.coolDownMs?`${n.coolDownMs} ms`:"None"),d.appendChild(l),l=g("type","commandType","Type",n.commandType),d.appendChild(l);return l=g("cues","mappedCues","Cues",n.mappedCues.length<=0?"None":n.mappedCues.join(", ")),d.appendChild(l),l=f([a.middle]),l.dataset.fieldName="edit",i=e.buildButton("","Edit",[]),i.onclick=b,l.appendChild(i),d.appendChild(l),o.appendChild(d),o}function C(e,n){Array.isArray(e)?e&&!n?function(e){const n=document.getElementById(i.cueConfigPanel);if(!n)return void console.error("Unable to locate panel, skipping form initialization.");const t=e.map(v);n.append(...t)}(e):e&&n?document.getElementById(i.cueConfigPanel)||console.error("Unable to locate panel, skipping form update."):!e&&n&&(document.getElementById(i.cueConfigPanel)||console.error("Unable to locate panel, skipping form teardown.")):console.error("No config was provided, skipping form render.")}document.addEventListener("DOMContentLoaded",(function(){NodeCG.waitForReplicants(r,u,c).then((()=>{r.on(d.change,C)}))}));
//# sourceMappingURL=index.6825b7a2.js.map
