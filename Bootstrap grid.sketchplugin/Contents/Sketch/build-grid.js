@import 'pluginDefaults.js';
@import 'helpers.js';

var Plugin = {

    /**
     * Creating group.
     */
    createGroup: function(selectionIndex) {
        var group = MSLayerGroup.new();

        group.setName('Grid Folder ' + selectionIndex);
        group.setIsLocked(true);

        return group;
    },

    /**
     * Creating shape.
     */
    createShape: function(x, y, width, height, index) {
        var shape = MSRectangleShape.alloc().initWithFrame(NSMakeRect(x, y, width, height));
        var shapeGroup = MSShapeGroup.shapeWithPath(shape);

        shapeGroup.setName("Col " + index);
        shapeGroup.style().contextSettings().setOpacity(userDefaults.overlayOpacity);
        // shapeGroup.setIsLocked(true);
        var fill = shapeGroup.style().addStylePartOfType(0);
        fill.color = MSImmutableColor.colorWithSVGString(userDefaults.overlayColor);

        return shapeGroup;
    },

    /**
     * Getting layer params.
     */
    getLayerParams: function(frame) {
        return {
            width: Math.round(frame.width()),
            height: Math.round(frame.height()),
            posX: Math.round(frame.x()),
            posY: Math.round(frame.y())
        };
    },

    /**
     * Get layers parent.
     */
    getParent: function(object) {
        var objParentGroup = object.parentGroup();
        var isParentArtboard = objParentGroup.isKindOfClass(MSArtboardGroup);
        var isParentPage = objParentGroup.isKindOfClass(MSPage);
        var result;

        if (isParentArtboard || isParentPage) {
            result = object;
        } else {
            result = this.getParent(objParentGroup);
        }

        return result;
    },

    /**
     * Render alert.
     */
    renderAlert: function(title, message) {
        var app = [NSApplication sharedApplication];
        [app displayDialog: message withTitle: title];
    },

    /**
     * Grid render.
     */
    renderGrid: function(context, colCount, gutterWidth, offsetLeft, offsetRight) {
        var target = context.selection;
        var document = context.document;
        var page = document.currentPage();
        var artboard = page.currentArtboard();
        var parentLayer = artboard || page;
        var containersArr = [];

        for (var selectionIndex = 0; selectionIndex < target.count(); selectionIndex++) {
            var layer = this.getParent(target[selectionIndex]);
            var container = this.createGroup(selectionIndex);
            var params = this.getLayerParams(layer.frame());
            var colWidth = (params.width - offsetLeft - offsetRight - gutterWidth * (colCount * 2 - 2))/colCount;
            var indent = colWidth + gutterWidth * 2;
            var overlays = [];

            if (gutterWidth * (colCount * 2 - 2) + colCount > params.width) {
                return this.renderAlert("Incorrect selection width!", "Please, make a larger selection for current configuration");
            }

            for (var i = 1; i <= colCount; i++) {
                var posX = params.posX + offsetLeft + indent * (i - 1);
                var overlay = this.createShape(posX, params.posY, colWidth, params.height, i);
                overlays.push(overlay);
            }

            container.addLayers(overlays);

            containersArr.push(container);
        }

        parentLayer.addLayers(containersArr);
    },

    /**
     * Init plugin.
     */
    init: function(context, colCount, gutterWidth, offsetLeft, offsetRight) {
        if (context.selection.count() == 0) {
            this.renderAlert("No layers are selected!", "Please, select layer for which yon want insert grid");
        } else {
            this.renderGrid(context, colCount, gutterWidth, offsetLeft, offsetRight);
        };
    }
}

/**
 * Build grid.
 */
var buildGrid = function(context) {
    Plugin.init(
        context,
        userDefaults.colCount,
        userDefaults.gutterWidth,
        userDefaults.offsetLeft,
        userDefaults.offsetRight
    );
}