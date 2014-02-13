YUI.add("moodle-local_mathslate-editor",function(e,t){M.local_mathslate=M.local_mathslate||{};var n={TOOLBOX:"mathslate-toolbox",UNDO:"mathslate-undo-button",REDO:"mathslate-redo-button",CLEAR:"mathslate-clear-button"};M.local_mathslate.Editor=function(t,r){function h(){c.tools.forEach(function(t){e.one("#"+t.id).on("click",function(){o.addMath(t.json)});var n=new e.DD.Drag({node:"#"+t.id});n.set("data",t.json),n.on("drag:end",function(){this.get("node").setStyle("top","0"),this.get("node").setStyle("left","0")})})}MathJax.Hub.setRenderer("HTML-CSS");var i=e.guid(),s=e.guid();this.node=e.one(t),this.node.addClass("mathslate-editor"),this.node.appendChild(e.Node.create('<div id="'+i+'" class="'+n.TOOLBOX+'">')),this.node.appendChild(e.Node.create('<div id="'+s+'" >'));var o=new M.local_mathslate.MathJaxEditor("#"+s),u=e.Node.create('<button class="'+n.UNDO+'">'+'<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'+M.util.image_url("undo","local_mathslate")+'" title="Undo"/></button>');o.workspace.insert(u,1);var a=e.Node.create('<button class="'+n.REDO+'">'+'<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'+M.util.image_url("redo","local_mathslate")+'" title="Redo"/></button>');o.workspace.insert(a,1);var f=e.Node.create('<button class="'+n.CLEAR+'">'+'<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'+M.util.image_url("delete","local_mathslate")+'" title="Clear"/></button>');o.workspace.insert(f,1);var l=this;l.output=function(e){return o.output(e)},a.on("click",function(){o.redo()}),u.on("click",function(){o.undo()}),f.on("click",function(){o.clear()});var c={tools:[],fillToolBox:function(t){function n(t){function n(t){Array.isArray(t[2])&&t[2].forEach(function(r){Array.isArray(r)?n(r):r==="[]"&&(newID=e.guid(),t[2][t[2].indexOf(r)]=["mn",{},"[]"])})}this.id=e.guid(),this.json=JSON.stringify(t),this.HTMLsnippet=[["span",{id:this.id},[["math",{},[t]]]]],n(t),c.tools.push(this)}var r={children:[{label:'<math><mi>T</mi><mspace width="-.14em" /><mpadded height="-.5ex" depth="+.5ex" voffset="-.5ex"><mrow class="MJX-TeXAtom-ORD"><mi>E</mi></mrow></mpadded><mspace width="-.115em" /> <mi>X</mi> </math>',content:"<span id='latex-input'></span>"}]};t.forEach(function(t){var i=e.Node.create("<p></p>");t.tools.forEach(function(e){var t=new n(e);MathJax.HTML.addElement(i.getDOMNode(),"span",{},t.HTMLsnippet),e[0]&&e[0]!=="br"&&i.append("&thinsp; &thinsp;")}),r.children.push({label:t.label,content:i.getHTML()})});var s=new e.TabView(r);e.one("#"+i)&&(s.render("#"+i),new M.local_mathslate.TeXTool("#latex-input",function(e){o.addMath(e)}))},getToolByID:function(e){var t;return this.tools.forEach(function(n){n.id&&n.id===e&&(t=n)}),t}};o.canvas.on("drop:hit",function(e){e.drag.get("data")&&o.addMath(e.drag.get("data"))}),e.on("io:success",function(t,n){c.tools.length===0&&(c.fillToolBox(e.JSON.parse(n.response)),MathJax.Hub.Queue(["Typeset",MathJax.Hub,i]),MathJax.Hub.Queue(h))}),r===undefined?e.io(M.local_mathslate.config):e.io(r)}},"@VERSION@",{requires:["dd-drag","dd-proxy","dd-drop","event","tabview","io-base","json","moodle-local_mathslate-textool","moodle-local_mathslate-mathjaxeditor"]});
