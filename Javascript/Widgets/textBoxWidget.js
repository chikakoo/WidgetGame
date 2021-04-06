/**
 * The base class that should be used as a template for other widgets
 */
 let TextboxWidget = {
    /**
     * The widget type - set to the variable name above AND THIS IN INITIALIZE TOO!
     */
    typeString: "TextboxWidget",

    /**
     * The difficulties that this widget can be
     */
    difficulties: [Difficulties.EASY, Difficulties.MEDIUM, Difficulties.HARD],

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
     * The text in the textbox
     */
    text: "",

    /**
     * The textbox itself
     */
    _input: null,

    /**
     * Initializes the timeout stuff
     */
    initialize: function() { 
        this.typeString = "TextboxWidget";
    },

    /**
     * Randomizes the text in the textbox
     */
    randomize: function() {
        switch (this.difficulty) {
            case Difficulties.EASY:
                this.text = String(Random.getRandomNumber(100, 999));
                break;
            case Difficulties.MEDIUM:
                this.text = String(Random.getRandomNumber(10000, 99999));
                break;
            case Difficulties.HARD:
                this.text = Random.getRandomASCIIString(5);
                break;
        }

        
    },

    /**
     * Compares this widget to the given widget to check whether they match
     * Currently just compares the textboxes
     * @param serverWidget - the server widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(serverWidget) {
        return this.text.trim() === serverWidget.text.trim();
    },

    /**
     * Handles div creation
     */
    createDiv: function() {
        this.div = dce("div", "widget-textbox");
        this._input = dce("input");
        this._input.value = this.text;
        this._input.setAttribute("size", "5");

        let _this = this;
        this._input.onchange = function() {
            _this.text = _this._input.value.trim();
        };

        if (!this.client) {
            this._input.setAttribute("disabled", "");
        }

        this.div.appendChild(this._input);
    }
};