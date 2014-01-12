YUI.add('moodle-local_mathslate-mathjaxeditor', function (Y, NAME) {

M.local_mathslate = M.local_mathslate|| {};
M.local_mathslate.MathJaxEditor=function(id){
        var math=[];
        var se=new M.local_mathslate.mSlots();
        se.slots.push(math);
        this.workspace=Y.one(id).append('<div id="canvas" class="mathslate-workspace"/>');
        var preview = Y.one(id).appendChild(Y.Node.create('<div class="mathslate-preview">'));

        var canvas=new Y.DD.Drop({
            node: this.workspace.one('#canvas')});
        this.canvas=canvas;
        this.workspace.on('click',function(){
            se.select();
            render();
        });
        function makeDraggable () {
            preview.setHTML(se.output('tex'));
            se.forEach(function(m){
                var node=canvas.get('node').one('#'+m[1].id);
                if(!node){return;}
                node.on('click',function(e){
                    e.stopPropagation();
                    var selectedNode = canvas.get('node').one('.mathslate-selected');
                    if(!selectedNode){
                        node.addClass('mathslate-selected');
                        se.select(node.getAttribute('id'));
                        return;
                    }
                    if(selectedNode===node){
                        node.removeClass('mathslate-selected');
                        se.select();
                        return;
                    }
                    if(node.one('#'+selectedNode.getAttribute('id'))){return;}
                    se.insertSnippet(selectedNode.getAttribute('id'), se.removeSnippet(node.getAttribute('id')));
                    render();
                });
                node.on('dblclick',function(e){
                    e.stopPropagation();
                    se.removeSnippet(node.getAttribute('id'));
                    render();
                });
                if(!m[1]||!m[1]['class']||m[1]['class']!=='blank'){
                    var drag = new Y.DD.Drag({node: node}).plug(Y.Plugin.DDProxy, {
                        resizeFrame: false,
                        moveOnEnd: false
                    });
                    drag.on('drag:start', function(){
                        if(canvas.get('node').one('.mathslate-selected')){
                            se.select();
                            canvas.get('node').one('.mathslate-selected').removeClass('mathslate-selected');
                        }
                        var id = Y.guid();
                        this.get('dragNode').set('innerHTML','' );
                        MathJax.Hub.Queue(['addElement',MathJax.HTML,
                            this.get('dragNode').getDOMNode(),'span',{id: id},
                            [['math',{},[Y.JSON.parse(se.getItemByID(m[1].id))]]]]);
                        MathJax.Hub.Queue(['Typeset',MathJax.Hub,id]);
                    
                    });
                }


                var drop = new Y.DD.Drop({node: node});
                drop.on('drop:hit',function(e){
                    var dragTarget=e.drag.get('node').get('id');
                    if(e.drag.get('data')) {
                        se.insertSnippet(m[1].id,se.createItem(e.drag.get('data')));
                    }
                    else if(dragTarget!==m[1].id&&se.isItem(dragTarget)&&!canvas.get('node').one('#'+dragTarget).one('#'+m[1].id)) {
                        se.insertSnippet(e.drop.get('node').get('id'), se.removeSnippet(dragTarget));
                    }
                    render();
                });
                drop.on('drop:enter',function(e){
                    e.stopPropagation();
                    canvas.get('node').all('.highlight').each(function(n){
                         n.removeClass('highlight');
                    });
                    this.get('node').addClass('highlight');
                });
                drop.on('drop:exit',function(){
                    this.get('node').removeClass('highlight');
                });
                
            });
            if(se.getSelected()&&canvas.get('node').one('#'+se.getSelected())) {
                canvas.get('node').one('#'+se.getSelected()).addClass('mathslate-selected');
            }
        }
        function render() {
            se.rekey();
            canvas.get('node').setHTML('');
            MathJax.Hub.Queue(['addElement',MathJax.HTML,canvas.get('node').getDOMNode(),'span',{},[['math',{},math]]]);
            MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'canvas']);
            MathJax.Hub.Queue(makeDraggable);
        }
        this.render = render;
        this.addMath=function(json){
            if(Y.one('.mathslate-selected')){
                se.insertSnippet(Y.one('.mathslate-selected').getAttribute('id'),se.createItem(json));
            } else {
                se.append(se.createItem(json));
            }
            render();
        };
        this.clear = function(){
            if(Y.one('.mathslate-selected')){
                se.removeSnippet(Y.one('.mathslate-selected').getAttribute('id'));
            } else {
                math=[];
                se=new M.local_mathslate.mSlots();
                se.slots.push(math);
            }
            render();
        };
        this.output = function(format){
            if(format==='MathML') {
                return canvas.get('node').one('script').getHTML();
            }
            if(format==='HTML') {
                return canvas.get('node').one('span').getHTML();
            }
            return se.output(format);
        };
        this.getHTML = function(){
            return canvas.get('node').one('span').getHTML();
        };
        this.redo = function(){
            se.redo();
            render();
        };
        this.undo = function(){
            se.undo();
            render();
        };
        render();
};


}, '@VERSION@', {"requires": ["moodle-local_mathslate-snippeteditor", "dd-proxy", "dd-drop"]});
