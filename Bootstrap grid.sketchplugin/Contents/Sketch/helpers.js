@import 'pluginDefaults.js';

var Helpers = {

    /**
     * Default params.
     */
    defaultPresets: {
        colCount: 12,
        gutterWidth: 15,
        offsetLeft: 0,
        offsetRight: 0,
        overlayColor: "#ff0000",
        overlayOpacity: 0.5
    },

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
    },

    /**
     * Get element at index.
     */
    getElementAtIndex: function(view, index) {
        return [view viewAtIndex: index];
    },

    /**
     * Get elements value at index.
     */
    getValueAtIndex: function(view, index) {
        var element = this.getElementAtIndex(view, index);
        return this.getInputValue(element);
    }
};

var userDefaults = initDefaults("sketch-bootstrap-grid.ru", Helpers.defaultPresets);

// Reset params.
// saveDefaults(Helpers.defaultPresets);