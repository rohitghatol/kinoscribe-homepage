/**
 * Created by rohitghatol on 7/15/14.
 */
function Slide(slideData,ooxmlFiles) {
    var _api = {}
    _api.rels=null;
    _api.layoutName="";
    _api.content={};
    _api.shapes = [];

    var map={
        "title":"title",
        "ctrTitle":"title",
        "subTitle":"subTitle",
        "body":"subTitle",
        "":"content"
    }
    var nsResolver =null;
    var xmlElementMap = {
        'p:ph': parsePlaceHolder,
        'a:prstGeom': parsePrstGeom

    }


    function _init() {
        _api.rels=readRels();
        _api.layoutName=readLayoutName();

        nsResolver= slideData.xmlNode.createNSResolver( slideData.xmlNode.ownerDocument == null ? slideData.xmlNode.documentElement : slideData.xmlNode.ownerDocument.documentElement );

        parse(slideData.xmlNode);


    }
    function readRels(){
        var relFile = slideData.target.replace("slides","slides/_rels")+".rels";
        var relationships = new Relationships(ooxmlFiles["ppt/"+relFile],ooxmlFiles);
        return relationships.rels;
    }

    function readLayoutName(){
        var slideLayoutPath = "";
        for(var key in _api.rels){
            if(_api.rels[key].type=="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout"){
                slideLayoutPath=_api.rels[key].target;
                break;
            }
        }
        var slideLayutXMLNode= ooxmlFiles["ppt/"+slideLayoutPath.replace("../","")].childNodes[0];
        return slideLayutXMLNode.getAttribute("type");
    }
    function parse(xmlnode) {

        var parseFunction = xmlElementMap[xmlnode.nodeName];
        if (parseFunction) {
            parseFunction(xmlnode);
        }

        var children = xmlnode.children;
        for (var index=0;index<children.length;index++) {
            parse(children[index]);
        }
    }


    function parsePlaceHolder(xmlNode){
        var type=xmlNode.getAttribute("type")||"";
        var parentNode = xmlNode.parentNode.parentNode.parentNode;

        var result=parentNode.ownerDocument.evaluate("//a:t",parentNode,nsResolver,XPathResult.ANY_TYPE, null )

        var contentType=map[type];
        if(_api.content[contentType]!=null){
            //FIXME - Fragile logic
            //More than one entries found and assuming only max 2 duplicates exists
            _api.content[map[type]+"-1"]=_api.content[map[type]];
            _api.content[map[type]+"-2"]=result.iterateNext().childNodes[0].nodeValue;
            delete _api.content[map[type]];
        }
        else{
            _api.content[map[type]]=result.iterateNext().childNodes[0].nodeValue;
        }

    }

    function parsePrstGeom(xmlNode){

        var shape={};
        shape.type=xmlNode.getAttribute("prst")||"";

        var parentNode = xmlNode.parentNode;

        var xfrm = null;
        for(var index=0;index<parentNode.childNodes.length;index++){
            var childNode = parentNode.childNodes[index];
            if(childNode.nodeName=="a:xfrm"){
                xfrm=childNode;
                break;
            }
        }

        if(xfrm!=null){
            var pos=xfrm.children[0];
            var dim=xfrm.children[1];

            shape.pos={
                left:Number(pos.getAttribute("x")),
                top:Number(pos.getAttribute("y"))
            }
            shape.dim={
                width:Number(dim.getAttribute("cx")),
                height:Number(dim.getAttribute("cy"))
            }

            var rot=xfrm.getAttribute("rot");
            if(rot!=null){
                shape.rotation = Number(rot)/60000;
            }
            else{
                shape.rotation=0;
            }
        }
        _api.shapes.push(shape);

    }
    _api.getShapes=function(){
        return _api.shapes;
    }
    _api.getLayout=function(){
        return _api.layout;
    }
    _api.getContent=function(){
        return _api.content;
    }
    _init();
    return _api;
}