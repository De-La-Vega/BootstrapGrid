@import 'build-grid.js';
@import 'helpers.js';

/**
 * Default grid.
 */

var buildDefaultGrid = function(context) {

    // Checking artboard and selection
    if (!Helpers.hasWrapper(context)){
        return;
    }

    // saveDefaults(Helpers.defaultPresets);

    var params = {
        context: context,
        colCount: Helpers.defaultPresets.colCount,
        gutterWidth: Helpers.defaultPresets.gutterWidth,
        offsetLeft: Helpers.defaultPresets.offsetLeft,
        offsetRight: Helpers.defaultPresets.offsetRight,
        overlayColor: Helpers.defaultPresets.overlayColor,
        overlayOpacity: Helpers.defaultPresets.overlayOpacity
    };

    BuildGrid.init(params);
}