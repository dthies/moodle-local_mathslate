YUI.add("moodle-local_mathslate-mathjaxeditor",function(e,t){M.local_mathslate=M.local_mathslate||{},M.local_mathslate.MathJaxEditor=function(t){function o(){i.setHTML(r.preview("tex")),r.forEach(function(t){var n=s.get("node").one("#"+t[1].id);if(!n)return;n.on("click",function(e){e.stopPropagation();var t=s.get("node").one(".mathslate-selected");if(!t){n.addClass("mathslate-selected"),r.select(n.getAttribute("id")),i.one("#"+n.getAttribute("id")).addClass("mathslate-selected"),i.one("#"+n.getAttribute("id")).focus();return}if(t===n){n.removeClass("mathslate-selected"),i.one("#"+n.getAttribute("id")).removeClass("mathslate-selected"),r.select();return}if(n.one("#"+t.getAttribute("id")))return;r.insertSnippet(t.getAttribute("id"),r.removeSnippet(n.getAttribute("id"))),u()}),n.on("dblclick",function(e){e.stopPropagation(),r.removeSnippet(n.getAttribute("id")),u()});if(!t[1]||!t[1]["class"]||t[1]["class"]!=="blank"){var o=(new e.DD.Drag({node:n})).plug(e.Plugin.DDProxy,{resizeFrame:!1,moveOnEnd:!1});o.on("drag:start",function(){s.get("node").one(".mathslate-selected")&&(r.select(),s.get("node").one(".mathslate-selected").removeClass("mathslate-selected"));var n=e.guid();this.get("dragNode").set("innerHTML",""),MathJax.Hub.Queue(["addElement",MathJax.HTML,this.get("dragNode").getDOMNode(),"span",{id:n},[["math",{},[e.JSON.parse(r.getItemByID(t[1].id))]]]]),MathJax.Hub.Queue(["Typeset",MathJax.Hub,n])})}var a=new e.DD.Drop({node:n});a.on("drop:hit",function(e){var n=e.drag.get("node").get("id");e.drag.get("data")?r.insertSnippet(t[1].id,r.createItem(e.drag.get("data"))):n!==t[1].id&&r.isItem(n)&&!s.get("node").one("#"+n).one("#"+t[1].id)&&r.insertSnippet(e.drop.get("node").get("id"),r.removeSnippet(n)),u()}),a.on("drop:enter",function(e){e.stopPropagation(),s.get("node").all(".highlight").each(function(e){e.removeClass("highlight")}),this.get("node").addClass("highlight")}),a.on("drop:exit",function(){this.get("node").removeClass("highlight")})}),r.getSelected()&&s.get("node").one("#"+r.getSelected())&&s.get("node").one("#"+r.getSelected()).addClass("mathslate-selected")}function u(){r.rekey(),s.get("node").setHTML(""),MathJax.Hub.Queue(["addElement",MathJax.HTML,s.get("node").getDOMNode(),"span",{},[["math",{},n]]]),MathJax.Hub.Queue(["Typeset",MathJax.Hub,"canvas"]),MathJax.Hub.Queue(o)}var n=[],r=new M.local_mathslate.mSlots;r.slots.push(n),this.workspace=e.one(t).append('<div id="canvas" class="mathslate-workspace"/>');var i=e.one(t).appendChild(e.Node.create('<div class="mathslate-preview">')),s=new e.DD.Drop({node:this.workspace.one("#canvas")});this.canvas=s,this.workspace.on("click",function(){r.select(),u()}),this.render=u,this.addMath=function(t){e.one(".mathslate-selected")?r.insertSnippet(e.one(".mathslate-selected").getAttribute("id"),r.createItem(t)):r.append(r.createItem(t)),u()},this.clear=function(){e.one(".mathslate-selected")?r.removeSnippet(e.one(".mathslate-selected").getAttribute("id")):(n=[],r=new M.local_mathslate.mSlots,r.slots.push(n)),u()},this.output=function(e){return e==="MathML"?s.get("node").one("script").getHTML():e==="HTML"?s.get("node").one("span").getHTML():r.output(e)},this.preview=function(e){return r.output(e)},this.getHTML=function(){return s.get("node").one("span").getHTML()},this.redo=function(){r.redo(),u()},this.undo=function(){r.undo(),u()},u()}},"@VERSION@",{requires:["moodle-local_mathslate-snippeteditor","dd-proxy","dd-drop"]});
