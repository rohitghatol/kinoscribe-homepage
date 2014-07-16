/**
 * Created by rohitghatol on 7/15/14.
 */
function Relationships(node, ooxmlFiles) {

    var _api = {}
    _api.rels = {};


    var xmlElementMap = {
        'Relationship': parseRelationship
    }


    function _init() {
        parse(node);
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

    function parseRelationship(relationship) {

        _api.rels[relationship.getAttribute("Id")] =

                    {
                        target: relationship.getAttribute("Target"),
                        type:relationship.getAttribute("Type"),
                        xmlNode: ooxmlFiles["ppt/" + relationship.getAttribute("Target")]
                    }

    }

    _api.getRelationships = function () {
        return _api.rels;
    }

    _init();
    return _api;
}