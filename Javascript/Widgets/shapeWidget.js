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
        "curved-tail-arrow",
        "trapezoid",
        "parallelogram",
        "star-6",
        "star-5",
        //TODO: on pentagon!
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
        this.div = dce("div", "widget-shape-container");
        this._shapeDiv = dce("div", "widget-shape");
        this.div.appendChild(this._shapeDiv);

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
        this._shapeDiv.className = "";
        this._shapeDiv.style = "";

        addCssClass(this._shapeDiv, `widget-shape`);
        addCssClass(this._shapeDiv, `widget-shape-${this.shape}`);
        this._adjustInlineStyleForShape();
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
            default:
                this._shapeDiv.style.backgroundColor = this.color;
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