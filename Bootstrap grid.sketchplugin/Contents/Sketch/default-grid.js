@import 'build-grid.js';
@import 'helpers.js';

/**
 * Default grid.
 */
var buildDefaultGrid = function(context) {
    saveDefaults(Helpers.defaultPresets);
    
    Plugin.init(
        context,
        Helpers.defaultPresets.colCount,
        Helpers.defaultPresets.gutterWidth,
        Helpers.defaultPresets.offsetLeft,
        Helpers.defaultPresets.offsetRight,
        Helpers.defaultPresets.overlayColor
    );
}