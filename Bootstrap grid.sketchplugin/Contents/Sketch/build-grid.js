@import 'pluginDefaults.js';

var Plugin = {

    /**
     * Defaults.
     */
    defaultSettings: function (colCount, gutterWidth, offsetLeft, offsetRight) {
        var colCount = colCount || userDefaults.colCount;
        var gutterWidth = gutterWidth || userDefaults.gutterWidth;
        var offsetLeft = offsetLeft || userDefaults.offsetLeft;
        var offsetRight = offsetRight || userDefaults.offsetRight;

        return {
            colCount: colCount,
            gutterWidth: gutterWidth,
            overlayOpacity: 0.5,
            overlayColor: "#ff0000",
            offsetLeft: offsetLeft,
            offsetRight: offsetRight
        }
    },

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
        var settings = this.defaultSettings();

        shapeGroup.setName("Col " + index);
        shapeGroup.style().contextSettings().setOpacity(settings.overlayOpacity);
        // shapeGroup.setIsLocked(true);
        var fill = shapeGroup.style().addStylePartOfType(0);
        fill.color = MSImmutableColor.colorWithSVGString(settings.overlayColor);

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
     * Showing error. No layer selection.
     */
    renderNoSelection: function() {
        var app = [NSApplication sharedApplication];
        [app displayDialog: "Please, select layer for which yon want insert grid" withTitle: "No layers are selected!"];
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
            var settings = this.defaultSettings(colCount, gutterWidth, offsetLeft, offsetRight);
            var colWidth = (params.width - settings.offsetLeft - settings.offsetRight - settings.gutterWidth * (settings.colCount * 2 - 2))/settings.colCount;
            var indent = colWidth + settings.gutterWidth * 2;
            var overlays = [];

            for (var i = 1; i <= settings.colCount; i++) {
                var x;

                if (i == 1) {
                    x = params.posX + settings.offsetLeft;
                } else {
                    x = params.posX + settings.offsetLeft + indent * (i - 1);
                }

                var overlay = this.createShape(x, params.posY, colWidth, params.height, i);
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
            this.renderNoSelection();
        } else {
            this.renderGrid(context, colCount, gutterWidth, offsetLeft, offsetRight);
        };
    }
}

/**
 * Build grid.
 */
var buildGrid = function(context) {
    Plugin.init(context);
}