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
 * Atto text editor mathslate plugin.
 *
 * @package    local_mathslate
 * @copyright  2013 Daniel Thies  <dthies@ccal.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

M.local_mathslate = M.local_mathslate|| {};
/* Constructor function for an editor of a page.
 * @method Editor
 * @param string editorID
 * @param string config
 */
M.local_mathslate.Editor=function(editorID,config){
/* Callback function to insert math into text after button is clicked.
 * params string Markup to be inserted.
 */
    this.insertMath = null;
    var toolboxID=Y.guid();
    var workID=Y.guid();
    this.node=Y.one(editorID);
    this.node.appendChild(Y.Node.create('<div id="' +toolboxID +'">'));
    this.node.appendChild(Y.Node.create('<div id="' +workID +'" class="mathslate-workspace">'));

    var mje=new M.local_mathslate.MathJaxEditor('#'+workID);
    var me=this;
    function insertMath (m) {if(me.insertMath){me.insertMath(m);}}
    var undo=this.node.appendChild(Y.Node.create('<button>Undo</button>'));
    undo.on('click',function(){mje.undo();});
    var redo=this.node.appendChild(Y.Node.create('<button>Redo</button>'));
    redo.on('click',function(){mje.redo();});
    var clear=this.node.appendChild(Y.Node.create('<button>Clear</button>'));
    clear.on('click',function(){mje.clear();});
    var inlineTex=this.node.appendChild(Y.Node.create('<button>Inline TeX</button>'));
    inlineTex.on('click',function(){insertMath('\\('+mje.output('tex')+'\\)');});
    var displayTex=this.node.appendChild(Y.Node.create('<button>Display TeX</button>'));
    displayTex.on('click',function(){insertMath('\\['+mje.output('tex')+'\\]');});
    var html=this.node.appendChild(Y.Node.create('<button>Insert HTML</button>'));
    html.on('click',function(){insertMath(mje.output('HTML'));});
    var mathmml=this.node.appendChild(Y.Node.create('<button>Insert MathML</button>'));
    mathmml.on('click',function(){insertMath(mje.output('MathML'));});

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
        var tabs={children: []};
        tools.forEach(function(tab){
            var q=Y.Node.create('<span></span>');
            tab.tools.forEach(function(snippet){
                var t = new Tool(snippet);
                MathJax.HTML.addElement(q.getDOMNode(),'span',{},t.HTMLsnippet);
                });
            tabs.children.push({label: tab.label, content: q.getHTML()});
        });
        var tabview = new Y.TabView(
            tabs
            );
        if(Y.one('#'+toolboxID)){
        tabview.render('#'+toolboxID);
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
            mje.addMath(e.drop.get('node').get('id'),e.drag.get('data'));
        }
    });
 /* function passed to MathJax to initiate dragging after math is formated
  * @function makeToolsDraggable
  */
    function makeToolsDraggable(){
        tbox.tools.forEach(function(tool) {
        var d=new Y.DD.Drag({node: '#'+tool.id});
        d.set('data',tool.json);
        d.on('drag:end', function() {
            this.get('node').setStyle('top' , '0');
            this.get('node').setStyle('left' , '0');
            });
        });
    }
    
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
        "moodle-local_mathslate-mathjaxeditor"
    ]
});
