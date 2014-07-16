/**
 * Created by rohitghatol on 7/15/14.
 */
function Presentation(ooxmlFiles) {
    var _api = {}
    _api.rels=null;
    _api.slides=[];
    _api.size={};
    var xmlElementMap = {
        'p:sldId': parseSlideId,
        'p:sldSz': parseSlideSize
    }


    function _init() {
        var relationships = new Relationships(ooxmlFiles["ppt/_rels/presentation.xml.rels"],ooxmlFiles);
        _api.rels = relationships.rels;

        parse(ooxmlFiles["ppt/presentation.xml"]);

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

    function parseSlideId(sldId){
        _api.slides.push(new Slide(_api.rels[sldId.getAttribute("r:id")],ooxmlFiles));
    }
    function parseSlideSize(sldSz){
        _api.size.width=Number(sldSz.getAttribute("cx"));
        _api.size.height=Number(sldSz.getAttribute("cy"));
    }
    _api.getSlides=function(){
        return _api.slides;
    }
    _api.getSize=function(){
        return _api.size;
    }
    _init();
    return _api;
}