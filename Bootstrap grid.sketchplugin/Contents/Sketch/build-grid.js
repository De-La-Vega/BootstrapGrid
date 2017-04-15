@import 'pluginDefaults.js';
@import 'helpers.js';

var BuildGrid = {

    /**
     * Creating group.
     */
    createGroup (layer) {
        var group = MSLayerGroup.new();

        group.setName('GRID for ' + layer.name());
        group.setIsLocked(true);

        return group;
    },

    /**
     * Creating shape.
     */
    createShape (x, y, width, height, index, overlayColor, overlayOpacity) {
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
     * Grid render.
     */
    renderGrid (params) {
        var target = params.context.selection;
        var document = params.context.document;
        var page = document.currentPage();
        var artboard = page.currentArtboard();
        var parentLayer = artboard || page;
        var containersArr = [];

        for (var selectionIndex = 0; selectionIndex < target.count(); selectionIndex++) {
            var layer = target[selectionIndex];
            var container = this.createGroup(layer);
            var layerParams = Helpers.getLayerParams(layer);
            var colWidth = (layerParams.width - params.offsetLeft - params.offsetRight - params.gutterWidth * (params.colCount * 2 - 2))/params.colCount;
            var indent = colWidth + params.gutterWidth * 2;
            var overlays = [];

            if (params.gutterWidth * (params.colCount * 2 - 2) + params.colCount > layerParams.width) {
                return Helpers.renderAlert(params.context, 'invalidSelectionWidth');
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
    init (params) {
        this.renderGrid(params);
    }
}

/**
 * Build grid.
 */
var buildGrid = function(context) {

    // Checking artboard and selection
    if (!Helpers.hasWrapper(context)){
        return;
    }

    var params = {
        context: context,
        colCount: userDefaults.colCount,
        gutterWidth: userDefaults.gutterWidth,
        offsetLeft: userDefaults.offsetLeft,
        offsetRight: userDefaults.offsetRight,
        overlayColor: userDefaults.overlayColor,
        overlayOpacity: userDefaults.overlayOpacity
    };

    BuildGrid.init(params);
}