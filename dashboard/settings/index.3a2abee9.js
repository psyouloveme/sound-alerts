var e={buildButton:function(e,n,t){const o=document.createElement("button");return t&&t.length>0&&o.classList.add(...t),o.name=e,o.innerText=n,o},buildLabel:function(e,n,t){const o=document.createElement("label");return t&&t.length>0&&o.classList.add(...t),o.htmlFor=e,o.innerText=n,o},buildTextInput:function(e,n,t){const o=document.createElement("input");return t&&t.length>0&&o.classList.add(...t),o.type="text",o.name=e,o.value=n,o},buildSelect:function(e,n,t){const o=document.createElement("select");return e&&e.length>0&&o.classList.add(...e),o.name=n,t.forEach((e=>{const n=document.createElement("option");n.value=e.value,n.innerText=e.label,n.selected=e.selected,o.add(n)})),o},buildHiddenInput:function(e,n){const t=document.createElement("input");return t.type="hidden",t.name=e,t.value=n,t},buildSpan:function(e,n){const t=document.createElement("span");return n&&n.length>0&&t.classList.add(...n),t.innerText=e,t},buildDiv:function(e,n){const t=document.createElement("div");return n&&n.length>0&&t.classList.add(...n),e&&(t.id=e),t},buildNumberInput:function(e,n,t){const o=document.createElement("input");return t&&t.length>0&&o.classList.add(...t),o.type="number",o.name=e,o.value=n,o},buildForm:function(e,n,t){const o=document.createElement("form");return e&&(o.name=e),n&&(o.id=n),t&&t.length>0&&o.classList.add(...t),o}};let n;var t;let o;(t=n||(n={})).soundCueConfig="soundCueConfig",t.soundCuesEnabled="soundCuesEnabled",t.soundCueList="soundCueList",t.soundCueLog="soundCueLog",t.soundCueTypes="soundCueTypes",t.soundCueCommandIndex="soundCueCommandIndex",t.nodeCGServerSoundCues="soundCues",(o||(o={})).change="change";var d=o;let a;var l;let i;(l=a||(a={})).commandFormRow="commandFormRow",l.btnRemove="btnRemove",l.btnAdd="btnAdd",l.formGroup="formGroup",l.middle="middle",l.btnToggleEnabled="btnToggleEnabled",l.enabled="enabled",l.readOnly="readOnly",l.hidden="hidden",l.cueSelectWrapper="cueSelectWrapper",(i||(i={})).cueConfigPanel="cueConfigPanel";const r=nodecg.Replicant(n.soundCueConfig),c=nodecg.Replicant(n.soundCueTypes),u=nodecg.Replicant(n.soundCueList);function s(e){if(e.preventDefault(),!r||!r.value)return void console.error("Failed enabling/disabling sound alert - replicant not available.");if(!e.target)return void console.error("Failed enabling/disabling sound alert - no event target found.");const n=e.target;if(!n.dataset.cmdName)return void console.error("Failed enabling/disabling sound alert - command name found.");const t=n.dataset.cmdName,o=r.value.find((e=>e.commandName===t));if(!o)return void console.error(`Failed enabling/disabling sound alert - command matching "${t}" not found.`);const d="true"===n.dataset.enabled;o.enabled=!d}function m(e){const n=e.querySelectorAll(".fieldValue");if(n&&n.length>0)for(let t=0;t<n.length;t++){const o=n[t];e.removeChild(o)}}function p(n){if(n.preventDefault(),!r||!r.value)return void console.error("Failed sound alert edit - config replicant not available.");if(!c||!c.value)return void console.error("Failed sound alert edit - type replicant not available.");if(!u||!u.value)return void console.error("Failed sound alert edit - sound cue replicant not available.");if(!n.target)return void console.error("Failed sound alert edit - no event target found.");const t=n.target.closest("form");if(!t)return void console.error("Failed sound alert edit - unable to locate form.");const o=t.dataset.id?parseInt(t.dataset.id):-1;if(o<0)return void console.error("Failed sound alert edit - no ID found.");const d=t.querySelectorAll("div.formGroup");if(d.length<=0)return void console.error("Failed sound alert edit - unable to locate form groups.");const l=r.value.find((e=>e.id===o));if(l)for(let n=0;n<d.length;n++){const t=d[n];switch(t.dataset.fieldName){case"name":const n=e.buildTextInput("commandName",l.commandName);n.disabled=!0,t.replaceChildren(n);break;case"cooldown":const o=l.coolDownMs?l.coolDownMs.toString():"0",d=e.buildNumberInput("cooldownMs",o);d.disabled=!0,m(t),t.appendChild(d);break;case"type":const i=c.value.map((e=>({label:e,value:e,selected:l.commandType===e}))),r=e.buildSelect([],"commandType",i);r.disabled=!0,m(t),t.appendChild(r);break;case"cues":const s=u.value.map((e=>({label:e,value:e,selected:l.mappedCues.includes(e)}))),p=e.buildSelect([],"commandType",s);p.disabled=!0,m(t),t.appendChild(p);break;case"edit":const b=e.buildButton("btnSave","Save",[a.btnAdd]);b.disabled=!0;const f=e.buildButton("btnCancel","Cancel",[]);f.disabled=!0;const g=e.buildButton("btnDelete","Delete",[a.btnRemove]);g.disabled=!0,t.replaceChildren(b,f,g)}}else console.error(`Failed sound alert edit - command matching ID "${o}" not found.`)}function b(n){let t=[a.formGroup];n&&(t=t.concat(n));return e.buildDiv(void 0,t)}function f(n,t,o,d){const a=b();a.dataset.fieldName=n;let l=e.buildLabel(t,o);const i=e.buildSpan(d,["fieldValue"]);return a.append(l,i),a}function g(n,t){if(!c||!c.value)throw Error("Unable to map command rows - no command types are loaded.");if(!u||!u.value)throw Error("Unable to map command rows - no sound cues are loaded.");console.log(JSON.stringify(n));const o=e.buildForm(`commandForm-${n.id}`,null,[]);o.dataset.id=n.id.toString(),o.dataset.commandName=n.commandName,o.dataset.index=t.toString();const d=e.buildDiv(`cmd-row-${n.commandName}`,[a.commandFormRow]);let l=b([a.middle]),i=function(n,t){let o=n?"On":"Off";const d=e.buildButton("btnEnabled",o,[a.btnToggleEnabled]);return n&&d.classList.add(a.enabled),d.onclick=s,d.dataset.cmdName=t,d.dataset.enabled=n.toString(),d}(n.enabled,n.commandName);l.appendChild(i),d.appendChild(l),l=b([a.middle]);let r=e.buildSpan(n.id.toString());l.appendChild(r),d.appendChild(l),l=f("name","commandName","Name",n.commandName),d.appendChild(l),l=f("cooldown","coolDownMs","Cooldown",n.coolDownMs?`${n.coolDownMs} ms`:"None"),d.appendChild(l),l=f("type","commandType","Type",n.commandType),d.appendChild(l);return l=f("cues","mappedCues","Cues",n.mappedCues.length<=0?"None":n.mappedCues.join(", ")),d.appendChild(l),l=b([a.middle]),l.dataset.fieldName="edit",i=e.buildButton("","Edit",[]),i.onclick=p,l.appendChild(i),d.appendChild(l),o.appendChild(d),o}function v(e,n){Array.isArray(e)?e&&!n?function(e){const n=document.getElementById(i.cueConfigPanel);if(!n)return void console.error("Unable to locate panel, skipping form initialization.");const t=e.map(g);n.append(...t)}(e):e&&n?document.getElementById(i.cueConfigPanel)||console.error("Unable to locate panel, skipping form update."):!e&&n&&(document.getElementById(i.cueConfigPanel)||console.error("Unable to locate panel, skipping form teardown.")):console.error("No config was provided, skipping form render.")}document.addEventListener("DOMContentLoaded",(function(){NodeCG.waitForReplicants(r,c,u).then((()=>{r.on(d.change,v)}))}));
//# sourceMappingURL=index.3a2abee9.js.map
