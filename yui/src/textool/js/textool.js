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
M.local_mathslate.TeXTool=function(editorID){
    var input=Y.Node.create('<input type="text">');
    var tool=Y.Node.create('<span>\\( \\)</span>');
    Y.one(editorID).appendChild(input);
    Y.one(editorID).appendChild(tool);
    var drag=new Y.DD.Drag({node: tool});
    drag.on('drag:end', function() {
        this.get('node').setStyle('top' , '0');
        this.get('node').setStyle('left' , '0');
    });
    input.on ('change',function(){
        tool.setHTML('<span>\\('+input.getDOMNode().value+'\\)</span>');
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,tool.generateID()]);

        var snippet;
        function findSnippet() {
            var mml = MathJax.Hub.getAllJax(tool.generateID())[0].root.toMathML();
            mml = mml.replace(/.*<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\">\s*/,'[').replace(/\s*<\/math.*/,']');
            if (/<mtext mathcolor="red">/.test(mml)||/<merror/.test(mml)) {
                snippet=[''];
                tool.json=null;
                tool.setHTML('Unrecognized Expression');
                return;
            }
            snippet = mml.replace('<mrow>', '["mrow",{"tex": "'+input.getDOMNode().value +'"},[');
            snippet = snippet.replace(/ class="[^"]*"/g,'');
            ['mrow','mfrac','msub','msup','msubsup','munder','mover','munderover','msqrt','mroot'].forEach(function(tag){
                snippet = snippet.replace(new RegExp('<'+tag+'>','g'),'["'+tag+'",{},[').replace(new RegExp('</'+tag+'>',"g"),"]],");
            });
            snippet=snippet.replace(/<mo stretchy="false">/g,'["mo",{"stretchy": "false"},"');
    
            ['mo','mi','mn','mtext'].forEach(function(tag){
                snippet = snippet.replace(new RegExp('<'+tag+'>','g'),'["'+tag+'",{},"').replace(new RegExp('</'+tag+'>',"g"),'"],');
            });

            snippet=snippet.replace(/<mi mathvariant="italic">/g,'["mi",{"mathvariant": "italic"},"');
            snippet=snippet.replace(/<mstyle displaystyle="true">/g,'["mstyle",{"displaystyle": "true"},[').replace(/<\/mstyle>/g,']]');
            snippet=snippet.replace(/,\s*\]/g,']');
            snippet=snippet.replace(/\\/g,'\\\\');
            snippet=snippet.replace(/<!--.*?-->/g,'');
            snippet=snippet.replace(/&#x([\dA-F]{4});/g,'\\u$1');

            snippet='["mrow", {"tex":["'+input.getDOMNode().value.replace(/\\/g,'\\\\')+'"]},' + snippet + ']';
    
            tool.json=snippet;
            snippet=[Y.JSON.parse(snippet)];
            tool.setHTML('');
        }
        MathJax.Hub.Queue(findSnippet);

        MathJax.Hub.Queue(['addElement',MathJax.HTML,tool.getDOMNode(), 'span',{},[['math',{},snippet]]]);
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,tool.generateID()]);
        MathJax.Hub.Queue(function(){
            drag.set('data',tool.json);
        });
    });
};

