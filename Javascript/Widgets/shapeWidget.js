/**
 * A widget that shows a div of various shapes
 * Its color can be changed with left click; shape with right click (?)
 */
 let WidgetShape = {
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
     * An array of all the shapes the widget can be
     */
    _allShapes: [
        "square",
        "rectangle",
        "circle",
        "oval",
        "pill",
        "triangle-up",
        // "triangle-down",
        // "triangle-left",
        // "triangle-right",
        // "triangle-top-left",
        // "triangle-top-right",
        // "triangle-bottom-left",
        // "triangle-bottom-right",
        // "curved-tail-arrow",
        "chevron-up",
        "chevron-down",
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
     * An array of the current colors being used
     */
    _currentColors: [],

    /**
     * The current color of the widget
     */
    color: "green",

    /**
     * Initializes any properties on the widget, including randomizing any relevant settings
     */
    initialize: function() {
        this.div = dce("div", "widget-shape");
        this.populateAllShapes();

        let _this = this;
        this.div.onclick = function() {
            let shapeIndex = _this._currentShapes.indexOf(_this.shape);
            if (shapeIndex >= 0) {
                shapeIndex++;
                shapeIndex = shapeIndex < _this._currentShapes.length ? shapeIndex : 0;
                _this.shape = _this._currentShapes[shapeIndex];
                _this._refreshUI();
            }
        }
    },

    /**
     * Populates the current shapes with a number of shapes from allShapes
     */
    populateAllShapes: function() {
        //TODO: set this to another number
        this._currentShapes = Random.getRandomValuesFromArray(this._allShapes, this._allShapes.length);
    },

    /**
     * Randomizes aspects of the widget
     */
    randomize: function() {
        this.shape = Random.getRandomValueFromArray(this._allShapes);
        this.color = Random.getRandomValueFromArray(this._getRandomColors());
        this._refreshUI();
    },

    /**
     * Gets a randomly generated array of rgb colors to cycle through
     * Easy mode will use a random set of colors
     * TODO: this
     * @returns an array of colors
     */
    _getRandomColors: function() {
        return ["green", "red", "cyan"];
    },

    /**
     * Refreshes the UI - sets the css class and the color
     */
    _refreshUI: function() {
        this.div.className = "";
        this.div.style = "";

        addCssClass(this.div, `widget-shape`);
        addCssClass(this.div, `widget-shape-${this.shape}`);
        this._adjustInlineStyleForShape();
    },

    /**
     * Adjusts the inline style based on the current shape
     */
    _adjustInlineStyleForShape: function() {
        switch(this.shape) {
            case "triangle-up":
                this.div.style.borderBottom = `100px solid ${this.color}`;
                break;
            case "chevron-up":
            case "chevron-down":
                this.div.style["border"] = `10px solid ${this.color}`;
                this.div.style["border-top"] = "0";
                this.div.style["border-left"] = "0";
                break;
            default:
                this.div.style.backgroundColor = this.color;
                break;
        }
    },

    /**
     * Compares this widget to the given widget to check whether they match
     * @param serverWidget - the server widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(serverWidget) {
        return this.shape === serverWidget.shape && this.color === serverWidget.color;
    }
};