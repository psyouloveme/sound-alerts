var e={buildButton:function(e,n,t){const o=document.createElement("button");return t&&t.length>0&&o.classList.add(...t),o.name=e,o.innerText=n,o},buildLabel:function(e,n,t){const o=document.createElement("label");return t&&t.length>0&&o.classList.add(...t),o.htmlFor=e,o.innerText=n,o},buildTextInput:function(e,n,t){const o=document.createElement("input");return t&&t.length>0&&o.classList.add(...t),o.type="text",o.name=e,o.value=n,o},buildSelect:function(e,n,t){const o=document.createElement("select");return e&&e.length>0&&o.classList.add(...e),o.name=n,t.forEach((e=>{const n=document.createElement("option");n.value=e.value,n.innerText=e.label,n.selected=e.selected,o.add(n)})),o},buildHiddenInput:function(e,n){const t=document.createElement("input");return t.type="hidden",t.name=e,t.value=n,t},buildSpan:function(e,n){const t=document.createElement("span");return n&&n.length>0&&t.classList.add(...n),t.innerText=e,t},buildDiv:function(e,n){const t=document.createElement("div");return n&&n.length>0&&t.classList.add(...n),e&&(t.id=e),t},buildNumberInput:function(e,n,t){const o=document.createElement("input");return t&&t.length>0&&o.classList.add(...t),o.type="number",o.name=e,o.value=n,o},buildForm:function(e,n,t){const o=document.createElement("form");return e&&(o.name=e),n&&(o.id=n),t&&t.length>0&&o.classList.add(...t),o}};let n;var t;let o;(t=n||(n={})).soundCueConfig="soundCueConfig",t.soundCuesEnabled="soundCuesEnabled",t.soundCueList="soundCueList",t.soundCueLog="soundCueLog",t.soundCueTypes="soundCueTypes",t.soundCueCommandIndex="soundCueCommandIndex",t.nodeCGServerSoundCues="soundCues",(o||(o={})).change="change";var a=o;let d;var l;let r;(l=d||(d={})).commandFormRow="commandFormRow",l.btnRemove="btnRemove",l.btnAdd="btnAdd",l.formGroup="formGroup",l.middle="middle",l.btnToggleEnabled="btnToggleEnabled",l.enabled="enabled",l.readOnly="readOnly",l.hidden="hidden",l.cueSelectWrapper="cueSelectWrapper",(r||(r={})).cueConfigPanel="cueConfigPanel";const i=nodecg.Replicant(n.soundCueConfig),c=nodecg.Replicant(n.soundCueTypes),u=nodecg.Replicant(n.soundCueList);function s(e){if(!i||!i.value)throw Error("Unable to retrieve command config - config replicant not available.");const n=i.value.find((n=>n.id===e));if(!n)throw Error(`Unable to find command with ID ${e}.`);return{...n}}function m(e){if(!c||!c.value)throw Error("Unable to retrieve command types.");return c.value.reduce(((n,t)=>(n.push({label:t,value:t,selected:e===t}),n)),[{label:"Select one",value:"-1",selected:!e}])}function p(e){if(!u||!u.value)throw Error("Sound cue replicant not available.");const n=u.value,t=e.map((e=>function(e,n){let t;if(n)t=n;else{if(!u||!u.value)throw Error("Sound cue replicant not available.");t=u.value}return t.reduce(((n,t)=>(n.push({label:t,value:t,selected:e===t}),n)),[{label:"Select one",value:"-1",selected:!e}])}(e,n)));return t}function f(e){if(e.preventDefault(),!i||!i.value)return void console.error("Failed enabling/disabling sound alert - replicant not available.");if(!e.target)return void console.error("Failed enabling/disabling sound alert - no event target found.");const n=e.target;if(!n.dataset.cmdName)return void console.error("Failed enabling/disabling sound alert - command name found.");const t=n.dataset.cmdName,o=i.value.find((e=>e.commandName===t));if(!o)return void console.error(`Failed enabling/disabling sound alert - command matching "${t}" not found.`);const a="true"===n.dataset.enabled;o.enabled=!a}function b(e){const n=e.querySelectorAll(".fieldValue");if(n&&n.length>0)for(let t=0;t<n.length;t++){const o=n[t];e.removeChild(o)}}function g(n){if(n.preventDefault(),!n.target)return void console.error("Failed sound alert edit - no event target found.");const t=n.target.closest("form");if(!t)return void console.error("Failed sound alert edit - unable to locate form.");const o=t.dataset.id?parseInt(t.dataset.id):-1;if(o<0)return void console.error("Failed sound alert edit - no ID found.");const a=t.querySelectorAll("div.formGroup");if(a.length<=0)return void console.error("Failed sound alert edit - unable to locate form groups.");const d=s(o),l=["fieldValue"];for(let n=0;n<a.length;n++){const t=a[n];switch(t.dataset.fieldName){case"name":const n=e.buildSpan(d.commandName,l);b(t),t.appendChild(n);break;case"cooldown":const o=d.coolDownMs?d.coolDownMs.toString():"0",a=e.buildSpan(o,l);b(t),t.appendChild(a);break;case"type":const r=e.buildSpan(d.commandType,l);b(t),t.appendChild(r);break;case"cues":const i=e.buildSpan(d.mappedCues.join(", "),l);b(t),t.append(i);break;case"edit":const c=e.buildButton("btnEdit","Edit",[]);c.onclick=v,t.replaceChildren(c)}}t.dataset.editing="false"}function v(n){if(n.preventDefault(),!n.target)return void console.error("Failed sound alert edit - no event target found.");const t=n.target.closest("form");if(!t)return void console.error("Failed sound alert edit - unable to locate form.");t.dataset.editing="true";const o=t.dataset.id?parseInt(t.dataset.id):-1;if(o<0)return void console.error("Failed sound alert edit - no ID found.");const a=t.querySelectorAll("div.formGroup");if(a.length<=0)return void console.error("Failed sound alert edit - unable to locate form groups.");const l=s(o),r=["fieldValue"];for(let n=0;n<a.length;n++){const t=a[n];switch(t.dataset.fieldName){case"name":const n=e.buildTextInput("commandName",l.commandName,r);b(t),t.appendChild(n);break;case"cooldown":const o=l.coolDownMs?l.coolDownMs.toString():"0",a=e.buildNumberInput("cooldownMs",o,r);b(t),t.appendChild(a);break;case"type":const i=m(l.commandType),c=e.buildSelect(r,"commandType",i);b(t),t.appendChild(c);break;case"cues":const u=p(l.mappedCues).map((n=>e.buildSelect(r,"mappedCues",n)));b(t),t.append(...u);break;case"edit":const s=e.buildButton("btnSave","Save",[d.btnAdd]),f=e.buildButton("btnCancel","Cancel",[]);f.onclick=g;const v=e.buildButton("btnDelete","Delete",[d.btnRemove]);t.replaceChildren(s,f,v)}}}function C(n){let t=[d.formGroup];n&&(t=t.concat(n));return e.buildDiv(void 0,t)}function h(n,t,o,a){const d=C();d.dataset.fieldName=n;let l=e.buildLabel(t,o);const r=e.buildSpan(a,["fieldValue"]);return d.append(l,r),d}function w(n,t){if(!c||!c.value)throw Error("Unable to map command rows - no command types are loaded.");if(!u||!u.value)throw Error("Unable to map command rows - no sound cues are loaded.");console.log(JSON.stringify(n));const o=e.buildForm(`commandForm-${n.id}`,null,[]);o.dataset.id=n.id.toString(),o.dataset.commandName=n.commandName,o.dataset.index=t.toString(),o.dataset.editing="false";const a=e.buildDiv(`cmd-row-${n.commandName}`,[d.commandFormRow]);let l=C([d.middle]),r=function(n,t){let o=n?"On":"Off";const a=e.buildButton("btnEnabled",o,[d.btnToggleEnabled]);return n&&a.classList.add(d.enabled),a.onclick=f,a.dataset.cmdName=t,a.dataset.enabled=n.toString(),a}(n.enabled,n.commandName);l.appendChild(r),a.appendChild(l),l=C([d.middle]);let i=e.buildSpan(n.id.toString());l.appendChild(i),a.appendChild(l),l=h("name","commandName","Name",n.commandName),a.appendChild(l),l=h("cooldown","coolDownMs","Cooldown",n.coolDownMs?`${n.coolDownMs} ms`:"None"),a.appendChild(l),l=h("type","commandType","Type",n.commandType),a.appendChild(l);return l=h("cues","mappedCues","Cues",n.mappedCues.length<=0?"None":n.mappedCues.join(", ")),a.appendChild(l),l=C([d.middle]),l.dataset.fieldName="edit",r=e.buildButton("","Edit",[]),r.onclick=v,l.appendChild(r),a.appendChild(l),o.appendChild(a),o}function E(e,n){Array.isArray(e)?e&&!n?function(e){const n=document.getElementById(r.cueConfigPanel);if(!n)return void console.error("Unable to locate panel, skipping form initialization.");const t=e.map(w);n.append(...t)}(e):e&&n?document.getElementById(r.cueConfigPanel)||console.error("Unable to locate panel, skipping form update."):!e&&n&&(document.getElementById(r.cueConfigPanel)||console.error("Unable to locate panel, skipping form teardown.")):console.error("No config was provided, skipping form render.")}document.addEventListener("DOMContentLoaded",(function(){NodeCG.waitForReplicants(i,c,u).then((()=>{i.on(a.change,E)}))}));
//# sourceMappingURL=index.d000ec4b.js.map