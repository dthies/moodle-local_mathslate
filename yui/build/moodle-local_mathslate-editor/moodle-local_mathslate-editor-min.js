YUI.add("moodle-local_mathslate-editor",function(e,t){M.local_mathslate=M.local_mathslate||{},M.local_mathslate.Editor=function(t,n){function c(){l.tools.forEach(function(t){e.one("#"+t.id).on("click",function(){a.addMath(t.json)});var n=new e.DD.Drag({node:"#"+t.id});n.set("data",t.json),n.on("drag:end",function(){this.get("node").setStyle("top","0"),this.get("node").setStyle("left","0")})})}MathJax.Hub.setRenderer("HTML-CSS");var r=e.guid(),i=e.guid();this.node=e.one(t);var s=this.node.appendChild(e.Node.create("<button>Undo</button>")),o=this.node.appendChild(e.Node.create("<button>Redo</button>")),u=this.node.appendChild(e.Node.create("<button>Clear</button>"));this.node.appendChild(e.Node.create('<div id="'+r+'">')),this.node.appendChild(e.Node.create('<div id="'+i+'" >'));var a=new M.local_mathslate.MathJaxEditor("#"+i),f=this;f.output=function(e){return a.output(e)},s.on("click",function(){a.undo()}),o.on("click",function(){a.redo()}),u.on("click",function(){a.clear()});var l={tools:[],fillToolBox:function(t){function n(t){function n(t){Array.isArray(t[2])&&t[2].forEach(function(r){Array.isArray(r)?n(r):r==="[]"&&(newID=e.guid(),t[2][t[2].indexOf(r)]=["mn",{},"[]"])})}this.id=e.guid(),this.json=JSON.stringify(t),this.HTMLsnippet=[["span",{id:this.id},[["math",{},[t]]]]],n(t),l.tools.push(this)}var i={children:[{label:"LaTeX",content:"<span id='latex-input'></span>"}]};t.forEach(function(t){var r=e.Node.create("<span></span>");t.tools.forEach(function(e){var t=new n(e);MathJax.HTML.addElement(r.getDOMNode(),"span",{},t.HTMLsnippet)}),i.children.push({label:t.label,content:r.getHTML()})});var s=new e.TabView(i);e.one("#"+r)&&(s.render("#"+r),new M.local_mathslate.TeXTool("#latex-input",function(e){a.addMath(e)}))},getToolByID:function(e){var t;return this.tools.forEach(function(n){n.id&&n.id===e&&(t=n)}),t}};a.canvas.on("drop:hit",function(e){e.drag.get("data")&&a.addMath(e.drag.get("data"))}),e.on("io:success",function(t,n){l.tools.length===0&&(l.fillToolBox(e.JSON.parse(n.response)),MathJax.Hub.Queue(["Typeset",MathJax.Hub,r]),MathJax.Hub.Queue(c))}),n===undefined?e.io(M.local_mathslate.config):e.io(n)}},"@VERSION@",{requires:["dd-drag","dd-proxy","dd-drop","event","tabview","io-base","json","moodle-local_mathslate-textool","moodle-local_mathslate-mathjaxeditor"]});
