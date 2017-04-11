@import 'build-grid.js';
@import 'helpers.js';

/**
 * Default grid.
 */
var buildDefaultGrid = function(context) {
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

    Plugin.init(params);
}