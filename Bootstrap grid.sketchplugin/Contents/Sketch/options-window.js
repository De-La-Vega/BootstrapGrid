@import 'build-grid.js';
@import 'helpers.js';
@import 'pluginDefaults.js';

var OptionsWindow = {

    /**
     * Show window with options.
     */
    showGridOptionsWindow: function(context, colCount, gutterWidth, offsetLeft, offsetRight) {
        var optionsWindow = [COSAlertWindow new];
        var FIELDS = [
            {
                text: "Columns count (max 12):",
                fieldName: "colCount",
                value: colCount
            },
            {
                text: "Gutter space (px):",
                fieldName: "gutterWidth",
                value: gutterWidth
            },
            {
                text: "Left offset (px):",
                fieldName: "offsetLeft",
                value: offsetLeft
            },
            {
                text: "Right offset (px):",
                fieldName: "offsetRight",
                value: offsetRight
            }
        ];

        [optionsWindow setIcon: NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path())]
        [optionsWindow setMessageText: 'Grid options']
        // [optionsWindow setInformativeText: 'Message about using setting'];
        [optionsWindow addButtonWithTitle: 'Set grid'];
        [optionsWindow addButtonWithTitle: 'Cancel'];
        // [optionsWindow addButtonWithTitle: 'Reset Defaults'];

        // Create fields
        for (var i = 0; i < FIELDS.length; i++) {
            [optionsWindow addTextLabelWithValue: FIELDS[i].text]
            [optionsWindow addTextFieldWithValue: FIELDS[i].value]
            userDefaults[FIELDS[i].fieldName] = FIELDS[i].value;
        }

        return [optionsWindow];
    }
};


/**
 * Open options.
 */
var openOptionsWindow = function(context) {
    var window = OptionsWindow.showGridOptionsWindow(context, userDefaults.colCount, userDefaults.gutterWidth, userDefaults.offsetLeft, userDefaults.offsetRight)[0];
    var response = window.runModal();

    switch (response) {
        // OK
        case 1000:
            userDefaults.colCount = Helpers.getValueAtIndex(window, 1);
            userDefaults.gutterWidth = Helpers.getValueAtIndex(window, 3);
            userDefaults.offsetLeft = Helpers.getValueAtIndex(window, 5);
            userDefaults.offsetRight = Helpers.getValueAtIndex(window, 7);
            saveDefaults(userDefaults);

            Plugin.init(
                context,
                userDefaults.colCount,
                userDefaults.gutterWidth,
                userDefaults.offsetLeft,
                userDefaults.offsetRight
            )
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