@import 'pluginDefaults.js';

var presets = {
    colCount: 12,
    gutterWidth: 15,
    offsetLeft: 0,
    offsetRight: 0
};
var userDefaults = initDefaults("sketch-bootstrap-grid.ru", presets);

var Helpers = {

    /**
     * Is retina display.
     */
    isRetinaDisplay: function() {
        return NSScreen.isOnRetinaScreen();
    },

    /**
     * Set icon.
     */
    imageSuffix: function() {
        return isRetinaDisplay() ? "@2x" : "";
    },

    /**
     * Get value from input field.
     */
    getInputValue: function(value) {
        return parseInt(value.stringValue().replace(/[^0-9.,]/g, ''));
    },

    /**
     * Open external URL.
     */
    openUrl: function(url) {
        NSWorkspace
            .sharedWorkspace()
            .openURL(NSURL.URLWithString(url));
    }
};