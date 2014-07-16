function PPTXImporter(file, container) {
    var _api = {}

    var map = {
        "title": "layout-title-slide",
        "obj":"layout-title-content",
        "twoObj":"layout-two-content",
        "titleOnly":"layout-title-only"
    }

    var renderMap={
        "layout-title-slide":renderLayoutTitleSlide,
        "layout-title-content":renderLayoutTitleContent,
        "layout-two-content":renderLayoutTwoContent,
        "layout-title-only":renderLayoutTitleOnly
    }

    function _init() {
        parseFile();
    }

    function parseFile() {
        var ooxmlparser = new OOXMLParser(file, onSuccess, onError);
    }

    function onSuccess(ooxmlFiles) {
        _api.pres = new Presentation(ooxmlFiles);
        render();
    }

    function onError(err) {
        console.log(err);
    }

    function render() {
        container.style.visibility = 'hidden';

        var stageElem = document.getElementById(container.ref);
        stageElem.style.display = 'block';
        stageElem.appendChild(document.createElement('kino-transition-left-to-right-emphasis'));
        var kinoPresElem = document.createElement('kino-pres');
        kinoPresElem.setAttribute("transition", "kino-transition-left-to-right-emphasis")

        var slides = _api.pres.slides;
        if (stageElem) {
            for (var i = 0; i < slides.length; i++) {
                var slideElem = renderSlide(slides[i]);
                kinoPresElem.appendChild(slideElem);
            }

            stageElem.appendChild(kinoPresElem);
        }
    }

    function renderSlide(slide) {
        var slideElem = document.createElement('kino-slide');
        var layoutContainerElem = document.createElement("section");
        layoutContainerElem.className = "slide";

        var layoutName = map[slide.layoutName];

        var layoutElem = renderMap[layoutName](slide);

        for(var index=0;index<slide.shapes.length;index++){
            var shape = slide.shapes[index];
            var shapeElem = renderShape(shape,slideElem);

            slideElem.appendChild(shapeElem);
        }

        layoutContainerElem.appendChild(layoutElem);
        slideElem.appendChild(layoutContainerElem);


        return slideElem;
    }

    function renderLayoutTitleSlide(slide){

        var layoutName = map[slide.layoutName];
        var layoutElem = document.createElement(layoutName);

        var titleBoxElem = document.createElement("box-title");
        var subTitleBoxElem = document.createElement("box-subTitle");


        titleBoxElem.innerHTML = slide.content.title;
        subTitleBoxElem.innerHTML = slide.content.subTitle;
        layoutElem.appendChild(titleBoxElem);
        layoutElem.appendChild(subTitleBoxElem);

        return layoutElem;

    }

    function renderLayoutTitleContent(slide){
        var layoutName = map[slide.layoutName];
        var layoutElem = document.createElement(layoutName);

        var titleBoxElem = document.createElement("box-title");
        var contentBoxElem = document.createElement("box-content");


        titleBoxElem.innerHTML = slide.content.title;
        contentBoxElem.innerHTML = slide.content.content;
        layoutElem.appendChild(titleBoxElem);
        layoutElem.appendChild(contentBoxElem);

        return layoutElem;
    }



    function renderLayoutTwoContent(slide){
        var layoutName = map[slide.layoutName];
        var layoutElem = document.createElement(layoutName);

        var titleBoxElem = document.createElement("box-title");
        var contentBoxLeftElem = document.createElement("box-content");
        var contentBoxRightElem = document.createElement("box-content");

        contentBoxLeftElem.className="left";
        contentBoxRightElem.className="right";


        titleBoxElem.innerHTML = slide.content.title;
        contentBoxLeftElem.innerHTML = slide.content["content-1"];
        contentBoxRightElem.innerHTML = slide.content["content-2"];
        layoutElem.appendChild(titleBoxElem);
        layoutElem.appendChild(contentBoxLeftElem);
        layoutElem.appendChild(contentBoxRightElem);

        return layoutElem;
    }

    function renderLayoutTitleOnly(slide){
        var layoutName = map[slide.layoutName];
        var layoutElem = document.createElement(layoutName);

        var titleBoxElem = document.createElement("box-title");
        titleBoxElem.innerHTML = slide.content.title;
        layoutElem.appendChild(titleBoxElem);

        return layoutElem;
    }

    function renderShape(shape,slideElem){
        var shapeElem = document.createElement("kino-shape");

//        var horzScale = slideElem.clientWidth/_api.pres.size.width;
//        var vertScale = slideElem.clientHeight/ _api.pres.size.height;
        var horzScale = 800/_api.pres.size.width;
        var vertScale = 600/ _api.pres.size.height;

        var left = shape.pos.left * horzScale;
        var top = shape.pos.top * vertScale;
        var width = shape.dim.width * horzScale;
        var height=shape.dim.height * vertScale;

        shapeElem.setAttribute("type",shape.type);
        shapeElem.setAttribute("left",left);
        shapeElem.setAttribute("top",top);
        shapeElem.setAttribute("width",width);
        shapeElem.setAttribute("height",height);
        shapeElem.setAttribute("rotation",shape.rotation);

        return shapeElem;

    }


    _init();
    return _api;
}