@import 'build-grid.js';
@import 'helpers.js';
@import 'pluginDefaults.js';

var OptionsWindow = {

    /**
     * Create labels for input fields.
     */
    // createLabel: function(frame, text) {
    //     var label = NSTextField.alloc().initWithFrame(frame);

    //     label.setStringValue(text);
    //     label.setSelectable(false);
    //     label.setEditable(false);
    //     label.setBezeled(false);
    //     label.setDrawsBackground(false);

    //     return label;
    // },

    /**
     * Create window with options.
     */
    createOptionsWindow: function(context, view) {
        var optionsWindow = COSAlertWindow.new();

        optionsWindow.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
        optionsWindow.setMessageText("Grid options")
        optionsWindow.addButtonWithTitle("Set");
        optionsWindow.addButtonWithTitle("Cancel");
        optionsWindow.addAccessoryView(view);

        return [optionsWindow];
    },

    /**
     * Show window with options.
     */
    showGridOptionsWindow: function(context, colCount, gutterWidth, offsetLeft, offsetRight) {
        var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 120));
        var itemsWidth = 150;
        var itemsHeight = 22;

        var FIELDS = [
            {
                text: "Columns count (max 12):",
                posY: 100,
                fieldName: "colCount",
                value: colCount
            },
            {
                text: "Gutter space (px):",
                posY: 70,
                fieldName: "gutterWidth",
                value: gutterWidth
            },
            {
                text: "Left offset (px):",
                posY: 40,
                fieldName: "offsetLeft",
                value: offsetLeft
            },
            {
                text: "Right offset (px):",
                posY: 10,
                fieldName: "offsetRight",
                value: offsetRight
            }
        ];

        // Columns count
        // columnLabel = this.createLabel(NSMakeRect(0, FIELDS[0].posY, itemsWidth, itemsHeight), FIELDS[0].text);
        // columnInput = NSTextField.alloc().initWithFrame(NSMakeRect(150, FIELDS[0].posY, itemsWidth, itemsHeight));
        // // columnInput.setStringValue('' + FIELDS[0].value);
        // view.addSubview(columnLabel);
        // view.addSubview(columnInput);

        // // Gutter space
        // gutterLabel = this.createLabel(NSMakeRect(0, FIELDS[1].posY, itemsWidth, itemsHeight), FIELDS[1].text);
        // gutterInput = NSTextField.alloc().initWithFrame(NSMakeRect(150, FIELDS[1].posY, itemsWidth, itemsHeight));
        // // gutterInput.setStringValue('' + FIELDS[1].value);
        // view.addSubview(gutterLabel);
        // view.addSubview(gutterInput);

        // // Left offset
        // offsetLeftLabel = this.createLabel(NSMakeRect(0, FIELDS[2].posY, itemsWidth, itemsHeight), FIELDS[2].text);
        // offsetLeftInput = NSTextField.alloc().initWithFrame(NSMakeRect(150, FIELDS[2].posY, itemsWidth, itemsHeight));
        // // offsetLeftInput.setStringValue('' + FIELDS[2].value);
        // view.addSubview(offsetLeftLabel);
        // view.addSubview(offsetLeftInput);

        // // Right offset
        // offsetRightLabel = this.createLabel(NSMakeRect(0, FIELDS[3].posY, itemsWidth, itemsHeight), FIELDS[3].text);
        // offsetRightInput = NSTextField.alloc().initWithFrame(NSMakeRect(150, FIELDS[3].posY, itemsWidth, itemsHeight));
        // // offsetRightInput.setStringValue('' + FIELDS[3].value);
        // view.addSubview(offsetRightLabel);
        // view.addSubview(offsetRightInput);

        var optionsWindow = COSAlertWindow.new();

        optionsWindow.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
        optionsWindow.setMessageText("Grid options")
        optionsWindow.addButtonWithTitle("Set");
        optionsWindow.addButtonWithTitle("Cancel");
        // optionsWindow.addAccessoryView(view);



        // [alert addButtonWithTitle: 'OK'];
        // [alert addButtonWithTitle: 'Cancel'];

        // [alert addButtonWithTitle: 'Reset Defaults'];

        // [alert setMessageText: 'Awesome Plugin Settings']

        // return [optionsWindow];

        // Create fields
        for (var i = 0; i < FIELDS.length; i++) {
            // var label = this.createLabel(NSMakeRect(0, FIELDS[i].posY, itemsWidth, itemsHeight), FIELDS[i].text);
            // var input = NSTextField.alloc().initWithFrame(NSMakeRect(150, FIELDS[i].posY, itemsWidth, itemsHeight));

            // input.setStringValue('' + FIELDS[i].value);
            // view.addSubview(label);
            // view.addSubview(input);

            [optionsWindow addTextLabelWithValue: FIELDS[i].text]
            [optionsWindow addTextFieldWithValue: FIELDS[i].value]

            userDefaults[FIELDS[i].fieldName] = FIELDS[i].value;
        }

        return [optionsWindow];

        // return this.createOptionsWindow(context, view);
    }
};


/**
 * Open options.
 */
var openOptionsWindow = function(context) {
    var window = OptionsWindow.showGridOptionsWindow(context, userDefaults.colCount, userDefaults.gutterWidth, userDefaults.offsetLeft, userDefaults.offsetRight)[0];
    var response = window.runModal();

    if (response == "1000") {
        userDefaults.colCount = parseInt(valueAtIndex(window, 1));
        userDefaults.gutterWidth = parseInt(valueAtIndex(window, 3));
        userDefaults.offsetLeft = parseInt(valueAtIndex(window, 5));
        userDefaults.offsetRight = parseInt(valueAtIndex(window, 7));
        saveDefaults(userDefaults)

        Plugin.init(
            context,
            userDefaults.colCount,
            userDefaults.gutterWidth,
            userDefaults.offsetLeft,
            userDefaults.offsetRight
        )
    }
}



var elementAtIndex = function(view, index) {
    return [view viewAtIndex: index];
}

var valueAtIndex = function(view, index) {
    var element = elementAtIndex(view, index);
    return [element stringValue];
}