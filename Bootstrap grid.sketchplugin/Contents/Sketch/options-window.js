@import 'build-grid.js';
@import 'helpers.js';
@import 'pluginDefaults.js';

var OptionsWindow = {

    /**
     * Show window with options.
     */
    showGridOptionsWindow: function(params) {
        var optionsWindow = [COSAlertWindow new];
        var FIELDS = [
            {
                text: "Columns count (max 12):",
                fieldName: "colCount",
                value: params.colCount
            },
            {
                text: "Gutter space (px):",
                fieldName: "gutterWidth",
                value: params.gutterWidth
            },
            {
                text: "Left offset (px):",
                fieldName: "offsetLeft",
                value: params.offsetLeft
            },
            {
                text: "Right offset (px):",
                fieldName: "offsetRight",
                value: params.offsetRight
            },
            {
                text: "Overlay color (hex):",
                fieldName: "overlayColor",
                value: params.overlayColor
            },
            {
                text: "Overlay opacity (from 1 to 100):",
                fieldName: "overlayOpacity",
                value: params.overlayOpacity
            }
        ];

        [optionsWindow setIcon: NSImage.alloc().initByReferencingFile(params.context.plugin.urlForResourceNamed("icon.png").path())];
        [optionsWindow setMessageText: 'Grid options'];
        // [optionsWindow setInformativeText: 'Message about using setting'];
        [optionsWindow addButtonWithTitle: 'Set grid'];
        [optionsWindow addButtonWithTitle: 'Cancel'];
        // [optionsWindow addButtonWithTitle: 'Reset Defaults'];

        // Create fields
        for (var i = 0; i < FIELDS.length; i++) {
            [optionsWindow addTextLabelWithValue: FIELDS[i].text];
            [optionsWindow addTextFieldWithValue: FIELDS[i].value];
            userDefaults[FIELDS[i].fieldName] = FIELDS[i].value;
        }

        return [optionsWindow];
    }
};


/**
 * Open options.
 */
var openOptionsWindow = function(context) {

    // if (!context.document.currentPage().currentArtboard()) {
    //     Helpers.renderAlert("This plugin needs Artboard.", "Please, insert Artboard.");
    //     return;
    // }

    var paramsInitial = {
        context: context,
        colCount: userDefaults.colCount,
        gutterWidth: userDefaults.gutterWidth,
        offsetLeft: userDefaults.offsetLeft,
        offsetRight: userDefaults.offsetRight,
        overlayColor: userDefaults.overlayColor,
        overlayOpacity: userDefaults.overlayOpacity
    };
    
    var window = OptionsWindow.showGridOptionsWindow(paramsInitial)[0];
    var response = window.runModal();

    switch (response) {
        // OK
        case 1000:
            userDefaults.colCount = Helpers.getValueAtIndex(window, 1, 'colCount');
            userDefaults.gutterWidth = Helpers.getValueAtIndex(window, 3, 'gutterWidth');
            userDefaults.offsetLeft = Helpers.getValueAtIndex(window, 5, 'offsetLeft');
            userDefaults.offsetRight = Helpers.getValueAtIndex(window, 7, 'offsetRight');
            userDefaults.overlayColor = Helpers.getValueAtIndex(window, 9, 'overlayColor');
            userDefaults.overlayOpacity = Helpers.getValueAtIndex(window, 11, 'overlayOpacity');

            if (!Helpers.isValidColCount(userDefaults.colCount)){
                Helpers.renderAlert('Invalid columns count', 'You must set maximum 12 columns.');
                return;
            }

            if (!Helpers.isValidColor(userDefaults.overlayColor)){
                Helpers.renderAlert('Invalid color', 'You must insert HEX color.');
                return;
            }

            if (!Helpers.isValidOpacity(userDefaults.overlayOpacity)){
                Helpers.renderAlert('Invalid opacity', 'You must insert value between 1 and 100.');
                return;
            }

            var paramsUpdated = {
                context: context,
                colCount: userDefaults.colCount,
                gutterWidth: userDefaults.gutterWidth,
                offsetLeft: userDefaults.offsetLeft,
                offsetRight: userDefaults.offsetRight,
                overlayColor: userDefaults.overlayColor,
                overlayOpacity: userDefaults.overlayOpacity
            };

            saveDefaults(userDefaults);

            Plugin.init(paramsUpdated);
            break;

        // Cancel
        case 1001:
            log('Cancel case');
            break;

        // Reset
        case 1002:
            log('Reset case');
            break;
    }
}