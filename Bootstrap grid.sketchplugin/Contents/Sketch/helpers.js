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
        overlayColor: "ff0000",
        overlayOpacity: 0.5
    },

    /**
     * Is valid color.
     */
    isValidColor: function(h) {
        var a = parseInt(h, 16);
        return (a.toString(16) == h.toLowerCase());
    },

    /**
     * Is valid opacity.
     */
    isValidOpacity: function(opacity) {
        return opacity > 0 && opacity <= 100;
    },

    /**
     * Is valid columns count.
     */
    isValidColCount: function(colCount) {
        return colCount <= 12;
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
     * Render alert.
     */
    renderAlert: function(title, message) {
        var app = [NSApplication sharedApplication];
        [app displayDialog: message withTitle: title];
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
    getValueAtIndex: function(view, index, type) {
        var element = this.getElementAtIndex(view, index);
        var result;

        switch(type){
            case 'colCount':
            case 'gutterWidth':
            case 'offsetLeft':
            case 'offsetRight':
                result = this.getInputValue(element);
                break;
            case 'overlayColor':
                result = element.stringValue();
                break;
        }

        return result;
    }
};

var userDefaults = initDefaults("sketch-bootstrap-grid.ru", Helpers.defaultPresets);

// Reset params.
// saveDefaults(Helpers.defaultPresets);