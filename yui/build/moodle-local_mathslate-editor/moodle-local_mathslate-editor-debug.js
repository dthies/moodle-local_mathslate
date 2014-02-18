YUI.add('moodle-local_mathslate-editor', function (Y, NAME) {

//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Text editor mathslate plugin.
 *
 * @package    local_mathslate
 * @copyright  2013 Daniel Thies  <dthies@ccal.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

M.local_mathslate = M.local_mathslate|| {};
var CSS = {
   TOOLBOX: 'mathslate-toolbox',
   UNDO: 'mathslate-undo-button',
   REDO: 'mathslate-redo-button',
   CLEAR: 'mathslate-clear-button',
   HELP: 'mathslate-help-button'
};
/* Constructor function for an editor of a page.
 * @method Editor
 * @param string editorID
 * @param string config
 */
M.local_mathslate.Editor=function(editorID,config){
    //Set MathJax to us HTML-CSS rendering on all browsers
    MathJax.Hub.setRenderer('HTML-CSS');
    var toolboxID=Y.guid();
    var workID=Y.guid();
    this.node=Y.one(editorID);
    this.node.addClass('mathslate-editor');
    //Place math editor on page
    this.node.appendChild(Y.Node.create('<div id="' +toolboxID +'" class="'+CSS.TOOLBOX+'">'));
    this.node.appendChild(Y.Node.create('<div id="' +workID +'" >'));

    var mje=new M.local_mathslate.MathJaxEditor('#'+workID);
    //Place buttons for internal editor functions along top of preview
    var undo=Y.Node.create('<button type="button" class="'
           +CSS.UNDO+'">'+ '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('undo', 'local_mathslate') + '" title="Undo"/></button>');
    var redo=Y.Node.create('<button type="button" class="'
           +CSS.REDO+'">'+ '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('redo', 'local_mathslate') + '" title="Redo"/></button>');
    var clear=Y.Node.create('<button type="button" class="'
           +CSS.CLEAR+'">'+ '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('delete', 'local_mathslate') + '" title="Clear"/></button>');
    var help=Y.Node.create('<button type="submit" class="'
           +CSS.HELP+'", formaction="https://github.com/dthies/moodle-local_mathslate/wiki/Using-Mathslate" formtarget="_blank">'
           + '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('help', 'core') + '" title="Help"/></button>');
    var toolbar=Y.Node.create('<form></form>');
    mje.workspace.insert(toolbar,1);
    toolbar.appendChild(clear);
    toolbar.appendChild(undo);
    toolbar.appendChild(redo);
    toolbar.appendChild(help);

    var me=this;
    me.output = function(f){return mje.output(f);};
    redo.on('click',function(){mje.redo();});
    undo.on('click',function(){mje.undo();});
    clear.on('click',function(){mje.clear();});

    var tbox={tools: [],
        fillToolBox: function(tools){
        function Tool(snippet) {
            function findBlank(snippet) {
                if (Array.isArray(snippet[2])) {
                    snippet[2].forEach(function(a){
                    if (Array.isArray(a)) {
                            findBlank(a);
                        }
                        else if(a==='[]') {
                        newID=Y.guid();
                        snippet[2][snippet[2].indexOf(a)]=['mn',{},'[]'];
                        }
                    });
                }
            }
            this.id=Y.guid();
            
            this.json=JSON.stringify(snippet);
            this.HTMLsnippet=[['span', {id: this.id}, [['math', {}, [snippet]]]]];
            
            findBlank(snippet);
            tbox.tools.push(this);
        }
        var tabs={children: [{label: "<math><mi>T</mi><mspace width=\"-.14em\" />"
             +"<mpadded height=\"-.5ex\" depth=\"+.5ex\" voffset=\"-.5ex\">"
             +"<mrow class=\"MJX-TeXAtom-ORD\"><mi>E</mi></mrow></mpadded>"
             +"<mspace width=\"-.115em\" /> <mi>X</mi> </math>",
        content: "<span id='latex-input'></span>"}]};
        tools.forEach(function(tab){
            var q=Y.Node.create('<p></p>');
            tab.tools.forEach(function(snippet){
                var t = new Tool(snippet);
                MathJax.HTML.addElement(q.getDOMNode(),'span',{},t.HTMLsnippet);
                if(snippet[0]&&snippet[0]!=='br'){q.append('&thinsp; &thinsp;');}
                });
            tabs.children.push({label: tab.label, content: q.getHTML()});
        });
        var tabview = new Y.TabView(
            tabs
            );
        if(Y.one('#'+toolboxID)){
            tabview.render('#'+toolboxID);
            new M.local_mathslate.TeXTool('#latex-input',function(json){mje.addMath(json);});
        }
    
    },
        getToolByID: function(id){
        var t;
        this.tools.forEach(function(tool){
            if(tool.id){ if(tool.id===id) {t=tool;}}
        });
        return t;
    }
    };


    mje.canvas.on('drop:hit',function(e){
        if(e.drag.get('data')) {
            mje.addMath(e.drag.get('data'));
        }
    });
 /* function passed to MathJax to initiate dragging after math is formated
  * @function makeToolsDraggable
  */
    function makeToolsDraggable(){
        tbox.tools.forEach(function(tool) {
        Y.one('#'+tool.id).on('click',function(){
            mje.addMath(tool.json);
        });
        var d=new Y.DD.Drag({node: '#'+tool.id});
        d.set('data',tool.json);
        d.on('drag:end', function() {
            this.get('node').setStyle('top' , '0');
            this.get('node').setStyle('left' , '0');
            });
        });
    }
    
    //Fetch configuration string for tools and initialyze
    Y.on('io:success',function(id,o){
        if(tbox.tools.length===0) {
            tbox.fillToolBox(Y.JSON.parse(o.response));
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,toolboxID]);
            MathJax.Hub.Queue(makeToolsDraggable);
        }
    });
    if(config===undefined) {
        Y.io(M.local_mathslate.config);
    } else {
        Y.io(config);
    }
    
};


}, '@VERSION@', {
    "requires": [
        "dd-drag",
        "dd-proxy",
        "dd-drop",
        "event",
        "tabview",
        "io-base",
        "json",
        "moodle-local_mathslate-textool",
        "moodle-local_mathslate-mathjaxeditor"
    ]
});
