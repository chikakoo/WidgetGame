/**
 * The base class that should be used as a template for other widgets
 */
 let TextboxWidget = {
    /**
     * The difficulties that this widget can be
     */
    difficulties: [Difficulties.EASY],

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
        this.div = dce("div", "widget-textbox");
        this._input = dce("input");

        let _this = this;
        this._input.onchange = function() {
            _this.text = _this._input.value.trim();
        };

        this.div.appendChild(this._input);
    },

    /**
     * Randomizes the text in the textbox
     */
    randomize: function() {
        this.text = String(Random.getRandomNumber(100000, 1000000));
        this._input.value = this.text;
    },

    /**
     * Compares this widget to the given widget to check whether they match
     * Currently just compares the textboxes
     * @param otherWidget - the other widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(otherWidget) {
        return this.text === otherWidget.text;
    },
};