/**
 * A widget that shows a div of various shapes
 * Its color can be changed with left click; shape with right click (?)
 */
 let ShapeWidget = {
    /**
     * The widget type - set to the variable name above AND THIS IN INITIALIZE TOO!
     */
     typeString: "ShapeWidget",

    /**
     * The difficulties that this widget can be
     */
    difficulties: [Difficulties.EASY],

    /**
     * The current difficulty - this is set to a random value based on the difficulties array
     * See WidgetHelpers._initialize
     */
    difficulty: Difficulties.EASY,

    /**
     * The div that will be used for this widget
     */
    div: null,

    /**
     * The main div containing the shape itself
     */
    _shapeDiv: null,

    /**
     * An array of the current shapes being used
     */
    _currentShapes: [],

    /**
     * The current shape of the widget
     */
    shape: null,

    /**
     * All potential colors that could be hard-coded in the color-picker
     */
    _allColors: [
        "#FF0000",
        "#FFA500",
        "#FFFF00",
        "#008000",
        "#0000FF",
        "#800080",
        "#FFC0CB",
        "#000000",
        "#A52A2A"
    ],

    /**
     * The colors that are hard-coded in the color-picker
     */
    _usedColors: [],

    /**
     * The current color of the widget
     */
    color: "green",

    /**
     * The color picker
     */
    _colorPicker: null,

    /**
     * Initializes any properties on the widget, including randomizing any relevant settings
     */
    initialize: function() {
        this.typeString = "ShapeWidget";
        this._populateAllShapes();
        this._setUpUsedColors();
    },

    /**
     * Populates the current shapes with a number of shapes from allShapes
     */
    _populateAllShapes: function() {
        //TODO: set this to another number
        this._currentShapes = Random.getRandomValuesFromArray(Object.values(Shapes.values), 5);//Shapes.values.length);
    },

    /**
     * Gets a randomly generated array of rgb colors to cycle through
     * Easy mode will use a random set of colors
     * TODO: this - a different amount based on difficulty
     * @returns an array of colors
     */
    _setUpUsedColors: function() {
        this._usedColors = Random.getRandomValuesFromArray(this._allColors, 3);//this._allColors.length);
    },

    /**
     * Randomizes aspects of the widget
     */
    randomize: function() {
        this._colorPicker = false;
        this.shape = Random.getRandomValueFromArray(this._currentShapes);
        this.color = Random.getRandomValueFromArray(this._usedColors);
    },

    /**
     * Compares this widget to the given widget to check whether they match
     * @param serverWidget - the server widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(serverWidget) {
        // TODO: color ranges if custom colors are used
        return this.shape === serverWidget.shape && this.color.toLowerCase() === serverWidget.color.toLowerCase();
    },

    /**
     * Creates the div for the widget
     */
    createDiv: function() {
        this.div = dce("div", "widget-shape-container");

        if (this.client) {
            this.div.onclick = this._advanceShape.bind(this, 1);
            this.div.oncontextmenu = this._advanceShape.bind(this, -1);
        }

        this._refreshUI();
    },

    /**
     * Advances the shape by the given amount
     * @param amount - the amount
     */
    _advanceShape: function(amount) {
        let shapeIndex = this._currentShapes.indexOf(this.shape);
        if (shapeIndex >= 0) {
            shapeIndex += amount;
            if (shapeIndex < 0) { shapeIndex = this._currentShapes.length - 1; }
            if (shapeIndex >= this._currentShapes.length) { shapeIndex = 0; }

            this.shape = this._currentShapes[shapeIndex];
            this._refreshUI();
        }
    },

    /**
     * Refreshes the UI - sets the css class and the color
     */
    _refreshUI: function() {
        if (this._shapeDiv) {
            this._shapeDiv.remove();
        }

        this._shapeDiv = Shapes.createDiv(this.shape, this.color);
        this.div.appendChild(this._shapeDiv);
        this._setUpColorPicker();
    },

    /**
     * Sets up the color picker
     */
    _setUpColorPicker: function() {
        if (!this._colorPicker && this.client) {
            this._colorPicker = ColorPicker.create(this._usedColors);

            let colorPickerDiv = dce("div", "widget-shape-color-picker-container");
            colorPickerDiv.appendChild(this._colorPicker.element);
            this.div.appendChild(colorPickerDiv);

            this._colorPicker.input.value = this.color;

            let _this = this;
            this._colorPicker.input.onchange = function() {
                _this.color = _this._colorPicker.input.value;
                _this._refreshUI();
            }
        }
    }
};