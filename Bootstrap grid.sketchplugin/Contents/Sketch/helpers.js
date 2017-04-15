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
        overlayOpacity: 50
    },

    /**
     * Has artboard and selection.
     */
    hasWrapper (context) {
        if (!this.hasArtboard(context) && !this.hasLayerSelection(context)) {
            this.renderAlert(context, 'noArtboardAndLayerSelection');
            return false;
        }

        if (!this.hasArtboard(context)) {
            this.renderNoArtboard(context);
            return false;
        }

        if (!this.hasLayerSelection(context)) {
            this.renderNoLayerSelection(context);
            return false;
        }

        return true;
    },

    /**
     * Has user selected any layer.
     */
    hasLayerSelection (context) {
        return context.selection.count() != 0;
    },

    /**
     * Has artboard.
     */
    hasArtboard (context) {
        return context.document.currentPage().currentArtboard();
    },

    /**
     * Is valid columns count.
     */
    isValidColCount (colCount) {
        return colCount <= 12;
    },

    /**
     * Is valid color.
     */
    isValidColor (h) {
        var a = parseInt(h, 16);
        return (a.toString(16) == h.toLowerCase());
    },

    /**
     * Is valid opacity.
     */
    isValidOpacity (opacity) {
        return opacity > 0 && opacity <= 100;
    },

    /**
     * Is retina display.
     */
    isRetinaDisplay () {
        return NSScreen.isOnRetinaScreen();
    },

    /**
     * Set icon.
     */
    imageSuffix () {
        return this.isRetinaDisplay() ? "@2x" : "";
    },

    /**
     * Open external URL.
     */
    openUrl (url) {
        NSWorkspace
            .sharedWorkspace()
            .openURL(NSURL.URLWithString(url));
    },

    /**
     * @deprecated
     * 
     * Get layers parent.
     */
    getParent (object) {
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
     * Getting layer params.
     */
    getLayerParams (layer) {
        return {
            width: Math.round(layer.absoluteRect().width()),
            height: Math.round(layer.absoluteRect().height()),
            posX: Math.round(layer.absoluteRect().rulerX()),
            posY: Math.round(layer.absoluteRect().rulerY())
        };
    },

    /**
     * Get value from input field.
     */
    getInputValue (value) {
        return parseInt(value.stringValue().replace(/[^0-9.,]/g, ''));
    },

    /**
     * Get element at index.
     */
    getElementAtIndex (view, index) {
        return [view viewAtIndex: index];
    },

    /**
     * Get elements value at index.
     */
    getValueAtIndex (view, index, type) {
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
            case 'overlayOpacity':
                result = parseInt(element.stringValue());
                break;
        }

        return result;
    },

    /**
     * Field value in object.
     */
    deepFind(obj, path) {
        var paths = path.split('.');
        var current = obj;
        var i;

        for (i = 0; i < paths.length; ++i) {
            if (current[ paths[i] ] == undefined) {
                return undefined;
            } else {
                current = current[ paths[i] ];
            }
        }

        return current;
    },

    /**
     * Read json data.
     */
    readData (context, fileName, field) {
        var filePath = context
            .plugin
            .url()
            .URLByAppendingPathComponent("Contents")
            .URLByAppendingPathComponent("Resources")
            .URLByAppendingPathComponent("i18n")
            .URLByAppendingPathComponent("en")
            .URLByAppendingPathComponent(fileName + ".json")
            .path();
        var file = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(filePath), 0, nil);

        return this.deepFind(file, field);
    },

    /**
     * Render alert.
     */
    renderAlert (context, section) {
        var title = this.readData(context, 'alerts', section + '.title');
        var message = this.readData(context, 'alerts', section + '.message');
        var app = [NSApplication sharedApplication];
        [app displayDialog: message withTitle: title];
    },

    /**
     * No artboard.
     */
    renderNoArtboard (context) {        
        this.renderAlert(context, 'noArtboard');
    },

    /**
     * No one layer was selected.
     */
    renderNoLayerSelection (context) {
        this.renderAlert(context, 'noLayerSelection');
    }
};

var userDefaults = initDefaults("sketch-bootstrap-grid.ru", Helpers.defaultPresets);

// Reset params.
// saveDefaults(Helpers.defaultPresets);