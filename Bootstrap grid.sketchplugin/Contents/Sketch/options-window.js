@import 'build-grid.js';
@import 'helpers.js';
@import 'pluginDefaults.js';


/**
 * Show window with options.
 */
function showGridOptionsWindow (params) {
    var optionsWindow = [COSAlertWindow new];
    var icon = "icon" + Helpers.imageSuffix() + ".png";

    var FIELDS = [
        {
            label: "Columns count (max 12):",
            fieldName: "colCount",
            field: params.colCount
        },
        {
            label: "Gutter space (px):",
            fieldName: "gutterWidth",
            field: params.gutterWidth
        },
        {
            label: "Left offset (px):",
            fieldName: "offsetLeft",
            field: params.offsetLeft
        },
        {
            label: "Right offset (px):",
            fieldName: "offsetRight",
            field: params.offsetRight
        },
        {
            label: "Overlay color (hex):",
            fieldName: "overlayColor",
            field: params.overlayColor
        },
        {
            label: "Overlay opacity (from 1 to 100):",
            fieldName: "overlayOpacity",
            field: params.overlayOpacity
        }
    ];

    [optionsWindow setIcon: NSImage.alloc().initByReferencingFile(params.context.plugin.urlForResourceNamed(icon).path())];
    [optionsWindow setMessageText: 'Grid options'];
    // [optionsWindow setInformativeText: 'Message about using setting'];
    [optionsWindow addButtonWithTitle: 'Set grid'];
    [optionsWindow addButtonWithTitle: 'Cancel'];
    // [optionsWindow addButtonWithTitle: 'Reset Defaults'];

    // Create fields
    for (var i = 0; i < FIELDS.length; i++) {
        [optionsWindow addTextLabelWithValue: FIELDS[i].label];
        [optionsWindow addTextFieldWithValue: FIELDS[i].field];
        userDefaults[FIELDS[i].fieldName] = FIELDS[i].field;
    }

    return [optionsWindow];
}


/**
 * Open options.
 */
var openOptionsWindow = function(context) {

    // Checking artboard and selection
    if (!Helpers.hasWrapper(context)){
        return;
    }

    var paramsInitial = {
        context: context,
        colCount: userDefaults.colCount,
        gutterWidth: userDefaults.gutterWidth,
        offsetLeft: userDefaults.offsetLeft,
        offsetRight: userDefaults.offsetRight,
        overlayColor: userDefaults.overlayColor,
        overlayOpacity: userDefaults.overlayOpacity
    };
    
    var window = showGridOptionsWindow(paramsInitial)[0];
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
                Helpers.renderAlert(context, 'invalidColumnsCount');
                return;
            }

            if (!Helpers.isValidColor(userDefaults.overlayColor)){
                Helpers.renderAlert(context, 'invalidColor');
                return;
            }

            if (!Helpers.isValidOpacity(userDefaults.overlayOpacity)){
                Helpers.renderAlert(context, 'invalidOpacity');
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

            BuildGrid.init(paramsUpdated);
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