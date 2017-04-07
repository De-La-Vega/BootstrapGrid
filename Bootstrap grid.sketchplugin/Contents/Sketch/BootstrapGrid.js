var colCount = 12;
var gutterWidth = 12;
var overlayOpacity = 0.5;
var overlayColor = "#ff0000";

/**
 * Creating group.
 */
function createGroup () {
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
 * Get layers parent.
 */
var getParent = function(object) {
    var objParentGroup = object.parentGroup();
    var isParentArtboard = objParentGroup.isKindOfClass(MSArtboardGroup);
    var isParentPage = objParentGroup.isKindOfClass(MSPage);
    var result;

    if (isParentArtboard || isParentPage) {
        result = object;
    } else {
        result = getParent(objParentGroup);
    }

    return result;
};

/**
 * Plugin.
 */
var onRun = function(context) {
    //reference the Application
    var app = [NSApplication sharedApplication];

    var target = context.selection;
    var targetCount = target.count();
    var document = context.document;
    var page = document.currentPage();
    var artboard = page.currentArtboard();
    var current = artboard || page;
    
    if (targetCount == 0) {
        // log('No layers are selected.');

        // show a message at the bottom of Sketch
        // doc.showMessage("MyPlugin Finished!");

        //send an alert message to the application
        [app displayDialog: "Please, select layer for which yon want insert grid" withTitle: "No layers are selected!"];
    } else {
        var containersArr = [];

        for (var selectionIndex = 0; selectionIndex < targetCount; selectionIndex++) {
            var layer = getParent(target[selectionIndex]);
            var container = createGroup();
            var params = getLayerParams(layer.frame());
            var colWidth = (params.width - gutterWidth * 22)/colCount;
            var indent = colWidth + gutterWidth * 2;
            var overlays = [];

            for (var i = 1; i <= colCount; i++) {
                var x = i == 1 ? params.posX : params.posX + indent * (i - 1);
                var overlay = addShape(x, params.posY, colWidth, params.height, i);
                overlays.push(overlay);
            }

            container.setName('Grid Folder ' + selectionIndex);
            container.setIsLocked(true);
            container.addLayers(overlays);

            containersArr.push(container);
        }

        current.addLayers(containersArr);
    };
}
