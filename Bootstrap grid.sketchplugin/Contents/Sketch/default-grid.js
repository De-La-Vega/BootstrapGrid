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

    saveDefaults(Helpers.defaultPresets);

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