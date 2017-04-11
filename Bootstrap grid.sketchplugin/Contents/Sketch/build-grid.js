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
    createShape: function(x, y, width, height, index, overlayColor, overlayOpacity) {
        var shape = MSRectangleShape.alloc().initWithFrame(NSMakeRect(x, y, width, height));
        var shapeGroup = MSShapeGroup.shapeWithPath(shape);

        shapeGroup.setName("Col " + index);
        shapeGroup.style().contextSettings().setOpacity(overlayOpacity/100);
        // shapeGroup.setIsLocked(true);
        var fill = shapeGroup.style().addStylePartOfType(0);
        fill.color = MSImmutableColor.colorWithSVGString('#' + overlayColor);

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
     * Grid render.
     */
    renderGrid: function(params) {
        var target = params.context.selection;
        var document = params.context.document;
        var page = document.currentPage();
        var artboard = page.currentArtboard();
        var parentLayer = artboard || page;
        var containersArr = [];

        for (var selectionIndex = 0; selectionIndex < target.count(); selectionIndex++) {
            var layer = this.getParent(target[selectionIndex]);
            var container = this.createGroup(selectionIndex);
            var layerParams = this.getLayerParams(layer.frame());
            var colWidth = (layerParams.width - params.offsetLeft - params.offsetRight - params.gutterWidth * (params.colCount * 2 - 2))/params.colCount;
            var indent = colWidth + params.gutterWidth * 2;
            var overlays = [];

            if (params.gutterWidth * (params.colCount * 2 - 2) + params.colCount > layerParams.width) {
                return Helpers.renderAlert("Incorrect selection width", "Please, make a larger selection for current configuration.");
            }

            for (var i = 1; i <= params.colCount; i++) {
                var posX = layerParams.posX + params.offsetLeft + indent * (i - 1);
                var overlay = this.createShape(posX, layerParams.posY, colWidth, layerParams.height, i, params.overlayColor, params.overlayOpacity);
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
    init: function(params) {
        if (params.context.selection.count() == 0) {
            Helpers.renderAlert("No layers are selected", "Please, select layer for which yon want insert grid.");
        } else {
            this.renderGrid(params);
        };
    }
}

/**
 * Build grid.
 */
var buildGrid = function(context) {

    // if (!context.document.currentPage().currentArtboard()) {
    //     Helpers.renderAlert("This plugin needs Artboard.", "Please, insert Artboard.");
    //     return;
    // }

    var params = {
        context: context,
        colCount: userDefaults.colCount,
        gutterWidth: userDefaults.gutterWidth,
        offsetLeft: userDefaults.offsetLeft,
        offsetRight: userDefaults.offsetRight,
        overlayColor: userDefaults.overlayColor,
        overlayOpacity: userDefaults.overlayOpacity
    };

    Plugin.init(params);
}