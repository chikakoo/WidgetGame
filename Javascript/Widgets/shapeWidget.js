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
     * An array of all the shapes the widget can be
     */
    _allShapes: [
        "square",
        "rectangle",
        "circle",
        "oval",
        "pill",
        "triangle-up",
        "triangle-down",
        "triangle-left",
        "triangle-right",
        "triangle-top-left",
        "triangle-top-right",
        "triangle-bottom-left",
        "triangle-bottom-right",
        "chevron-up",
        "chevron-down",
        "chevron-fat",
        "curved-tail-arrow",
        "trapezoid",
        "parallelogram",
        "star-6",
        "star-5",
        "pentagon",
        "hexagon",
        "heart",
        "infinity",
        "diamond-square",
        "diamond-shield",
        "diamond-narrow",
        "diamond-cut",
        "egg",
        "cross",
        "base",
        "lock",
        "cone",
        "moon",
        "facebook",
        "magnifying-glass",
        "pac-man",
        "talk-bubble",
        "rss",
        "burst-12",
        "burst-8",
        "yin-yang",
        "ribbon",
        "space-invader",
        "tv-screen"
    ],

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
        this._currentShapes = Random.getRandomValuesFromArray(this._allShapes, 5);//this._allShapes.length);
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
        this._shapeDiv = dce("div", "widget-shape");
        this.div.appendChild(this._shapeDiv);

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
        this._shapeDiv.className = "";
        this._shapeDiv.style = "";

        addCssClass(this._shapeDiv, `widget-shape`);
        addCssClass(this._shapeDiv, `widget-shape-${this.shape}`);
        this._adjustInlineStyleForShape();

        this._setUpColorPicker();
    },

    /**
     * Adjusts the inline style based on the current shape
     */
    _adjustInlineStyleForShape: function() {
        switch(this.shape) {
            case "triangle-up":
            case "triangle-bottom-left":
            case "triangle-bottom-right":
                this._shapeDiv.style.borderBottom = `100px solid ${this.color}`;
                break;
            case "triangle-down":
            case "triangle-top-left":
            case "triangle-top-right":
                this._shapeDiv.style.borderTop = `100px solid ${this.color}`;
                break;
            case "triangle-left":
                this._shapeDiv.style.borderLeft = `100px solid ${this.color}`;
                break;
            case "triangle-right":
                this._shapeDiv.style.borderRight = `100px solid ${this.color}`;
                break;
            case "trapezoid":
                this._shapeDiv.style.borderBottom = `50px solid ${this.color}`;
                break;
            case "chevron-up":
            case "chevron-down":
                this._shapeDiv.style.border = `10px solid ${this.color}`;
                this._shapeDiv.style.borderTop = "0";
                this._shapeDiv.style.borderLeft = "0";
                break;
            case "chevron-fat":
                this._shapeDiv.pseudoStyle("before", "background", this.color);
                this._shapeDiv.pseudoStyle("after", "background", this.color);
                break;
            case "curved-tail-arrow":
                this._shapeDiv.style.borderRight = `45px solid ${this.color}`;
                this._shapeDiv.pseudoStyle("after", "border-top", `15px solid ${this.color}`);
                break;
            case "star-6":
                this._shapeDiv.style.borderBottom = `75px solid ${this.color}`;
                this._shapeDiv.pseudoStyle("after", "border-top", `75px solid ${this.color}`);
                break;
            case "star-5":
                this._shapeDiv.style.color = this.color;
                this._shapeDiv.style.borderBottom = `35px solid ${this.color}`;
                this._shapeDiv.pseudoStyle("before", "border-bottom", `40px solid ${this.color}`);
                this._shapeDiv.pseudoStyle("after", "color", this.color);
                this._shapeDiv.pseudoStyle("after", "border-bottom", `35px solid ${this.color}`);
                break;
            case "pentagon":
                this._shapeDiv.style.borderColor = `${this.color} transparent`;
                this._shapeDiv.pseudoStyle("before", "border-color", `transparent transparent ${this.color}`);
                break;
            case "hexagon":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.pseudoStyle("before", "border-bottom", `21.65px solid ${this.color}`);
                this._shapeDiv.pseudoStyle("after", "border-top", `21.65px solid ${this.color}`);
                break;
            case "heart":
                this._shapeDiv.pseudoStyle("before", "background", this.color);
                this._shapeDiv.pseudoStyle("after", "background", this.color);
                break;
            case "infinity":
                this._shapeDiv.pseudoStyle("before", "border", `20px solid ${this.color}`);
                this._shapeDiv.pseudoStyle("after", "border", `20px solid ${this.color}`);
                break;
            case "diamond-square":
                this._shapeDiv.style.borderBottomColor = this.color;
                this._shapeDiv.pseudoStyle("after", "border-top", `50px solid ${this.color}`);
                break;
            case "diamond-shield":
                this._shapeDiv.style.borderBottom = `20px solid ${this.color}`;
                this._shapeDiv.pseudoStyle("after", "border-top", `70px solid ${this.color}`);
                break;
            case "diamond-narrow":
                this._shapeDiv.style.borderBottom = `70px solid ${this.color}`;
                this._shapeDiv.pseudoStyle("after", "border-top", `70px solid ${this.color}`);
                break;
            case "diamond-cut":
                this._shapeDiv.style.borderColor = `transparent transparent ${this.color} transparent`;
                this._shapeDiv.pseudoStyle("after", "border-color", `${this.color} transparent transparent transparent`);
                break;
            case "cross":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.pseudoStyle("after", "background", this.color);
                break;
            case "base":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.pseudoStyle("before", "border-bottom", `35px solid ${this.color}`);
                break;
            case "lock":
                this._shapeDiv.style.border = `3.5em solid ${this.color}`;
                this._shapeDiv.style.borderRightWidth = "7.5em";
                this._shapeDiv.style.borderLeftWidth = "7.5em";
                this._shapeDiv.pseudoStyle("before", "border", `2.5em solid ${this.color}`);
                this._shapeDiv.pseudoStyle("after", "border", `1em solid ${this.color}`);
                break;
            case "cone":
                this._shapeDiv.style.borderTop = `100px solid ${this.color}`;
                break;
            case "moon":
                this._shapeDiv.style.boxShadow = `15px 15px 0 0 ${this.color}`;
                break;
            case "facebook":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.style.border = `15px solid ${this.color}`;
                this._shapeDiv.style.borderBottom = 0;
                this._shapeDiv.pseudoStyle("before", "background", this.color);
                break;
            case "magnifying-glass":
                this._shapeDiv.style.border = `0.1em solid ${this.color}`;
                this._shapeDiv.pseudoStyle("before", "background", this.color);
                break;
            case "pac-man":
                this._shapeDiv.style.borderTop = `60px solid ${this.color}`;
                this._shapeDiv.style.borderBottom = `60px solid ${this.color}`;
                this._shapeDiv.style.borderLeft = `60px solid ${this.color}`;
                break;
            case "talk-bubble":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.pseudoStyle("before", "border-right", `26px solid ${this.color}`);
                break;
            case "rss":
                this._shapeDiv.style.backgroundColor = this.color;
                this._shapeDiv.pseudoStyle("after", "background", this.color);
                this._shapeDiv.pseudoStyle("after", "box-shadow", `-2em 2em 0 0 #fff inset, -4em 4em 0 0 ${this.color} inset, -6em 6em 0 0 #fff inset`);
                break;
            case "burst-12":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.pseudoStyle("before", "background", this.color);
                this._shapeDiv.pseudoStyle("after", "background", this.color);
                break;
            case "burst-8":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.pseudoStyle("before", "background", this.color);
                break;
            case "yin-yang":
                this._shapeDiv.style.borderColor = this.color;
                this._shapeDiv.pseudoStyle("before", "border", `18px solid ${this.color}`);
                this._shapeDiv.pseudoStyle("after", "background", this.color);
                break;
            case "ribbon":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.pseudoStyle("before", "border-bottom", `70px solid ${this.color}`);
                this._shapeDiv.pseudoStyle("after", "border-bottom", `70px solid ${this.color}`);
                break;
            case "space-invader":
                this._shapeDiv.style.background = this.color;
                this._shapeDiv.style.boxShadow = 
                    `0 0 0 1em ${this.color},
                    0 1em 0 1em ${this.color},
                    -2.5em 1.5em 0 .5em ${this.color},
                    2.5em 1.5em 0 .5em ${this.color},
                    -3em -3em 0 0 ${this.color},
                    3em -3em 0 0 ${this.color},
                    -2em -2em 0 0 ${this.color},
                    2em -2em 0 0 ${this.color},
                    -3em -1em 0 0 ${this.color},
                    -2em -1em 0 0 ${this.color},
                    2em -1em 0 0 ${this.color},
                    3em -1em 0 0 ${this.color},
                    -4em 0 0 0 ${this.color},
                    -3em 0 0 0 ${this.color},
                    3em 0 0 0 ${this.color},
                    4em 0 0 0 ${this.color},
                    -5em 1em 0 0 ${this.color},
                    -4em 1em 0 0 ${this.color},
                    4em 1em 0 0 ${this.color},
                    5em 1em 0 0 ${this.color},
                    -5em 2em 0 0 ${this.color},
                    5em 2em 0 0 ${this.color},
                    -5em 3em 0 0 ${this.color},
                    -3em 3em 0 0 ${this.color},
                    3em 3em 0 0 ${this.color},
                    5em 3em 0 0 ${this.color},
                    -2em 4em 0 0 ${this.color},
                    -1em 4em 0 0 ${this.color},
                    1em 4em 0 0 ${this.color},
                    2em 4em 0 0 ${this.color}`;
                break;
            default:
                this._shapeDiv.style.backgroundColor = this.color;
                break;
        }
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