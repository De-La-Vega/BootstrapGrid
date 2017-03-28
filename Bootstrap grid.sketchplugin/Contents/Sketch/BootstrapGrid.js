var colCount = 12;
var gutterWidth = 12;
var overlayOpacity = 0.5;
var overlayColor = "#ff0000";

/**
 * Creating group.
 */
function addGroup () {
    return MSLayerGroup.new();
}

/**
 * Creating shape.
 */
function addShape (x, y, width, height, index) {
    var shape = MSRectangleShape.alloc().initWithFrame(NSMakeRect(x, y, width, height));
    var shapeGroup = MSShapeGroup.shapeWithPath(shape);

    shapeGroup.setName("Col " + index);
    shapeGroup.style().contextSettings().setOpacity(overlayOpacity);
    // shapeGroup.setIsLocked(true); 
    var fill = shapeGroup.style().addStylePartOfType(0);
    fill.color = MSImmutableColor.colorWithSVGString(overlayColor);

    return shapeGroup;
}

/**
 * Layer params.
 */
function getLayerParams (frame) {
    return {
        width: Math.round(frame.width()),
        height: Math.round(frame.height()),
        posX: Math.round(frame.x()),
        posY: Math.round(frame.y())
    };
}

/**
 * Plugin.
 */
var onRun = function(context) {
    var target = context.selection;
    var targetCount = target.count();
    var document = context.document;
    var page = document.currentPage();
    var artboard = page.currentArtboard();
    var current = artboard || page;
    var container = addGroup();
    var overlays = [];

    current.addLayers([container]);

    if (targetCount == 0) {
        log('No layers are selected.');
    } else {
        for (var i = 0; i < targetCount; i++) {
            var layer = target[i];
            var params = getLayerParams(layer.frame());
            var colWidth = (params.width - gutterWidth * 22)/colCount;
            var indent = colWidth + gutterWidth * 2;

            for (var i = 1; i <= colCount; i++) {
                var x = i == 1 ? params.posX : params.posX + indent * (i - 1);
                var overlay = addShape(x, params.posY, colWidth, params.height, i);
                overlays.push(overlay);
            }
        }
    };

    container.setName('Grid Folder');
    container.setIsLocked(true);
    container.addLayers(overlays);
}
