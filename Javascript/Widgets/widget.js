/**
 * This is a static class that should be used as a template for creating widgets
 * Widgets will fall back on these methods if the appropriate methods aren't defined on them
 */

/**
 * An enum of difficulty levels
 * A widget can be restricted to one or multiple of these
 */
let Difficulties = {
    EASY: 0,
    NORMAL: 1,
    HARD: 2
};

/**
 * The base class that should be used as a template for other widgets
 */
let WidgetBase = {
    /**
     * The widget type - set to the variable name above AND THIS IN INITIALIZE TOO!
     */
     typeString: "WidgetBase",

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
     * A range between executions of the onTimeout callback, in ms
     * Set max to 0 to disable it
     */
    timeoutRange: { min: 0, max: 0 },

    /**
     * The callback to be used for the timeout
     * This is all set up in WidgetHelpers._initialize
     */
    timeoutCallback: null,

    /**
     * The div that will be used for this widget
     */
    div: null,

    /**
     * Initializes any properties on the widget
     */
    initialize: function() {
        this.typeString = "WidgetBase"; // REMEMBER TO CHANGE THIS WHEN YOU COPY THIS OVER
        throw "ERROR: initialize not defined!";
    },

    /**
     * Randomizes aspects of the widget
     * This NEEDS to be recallable so that it's possible to solve from the previous state
     */
    randomize: function() {
        throw "ERROR: randomize not defined!";
    },

    /**
     * Compares this widget to the given widget to check whether they match
     * Intended to be called by the client widget only
     * DO NOT use any DOM objects here!
     * @param serverWidget - the server widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(serverWidget) {
        throw "ERROR: compare not defined!";
    },

    /**
     * All the logic related to DOM elements needs to go here and nowhere else!
     */
    createDiv: function() {
        throw "ERROR: createDiv not defined!";
    }
};

/**
 * A class containing functions that would be shared across widgets
 * @return - the div that corresponds to the widget we created
 */
let WidgetHelpers = {
    /**
     * Creates a client and server widget
     * @param widget - the widget to create
     * @return - the created widget
     */
    create: function(widget) {
        let newWidget = Object.create(widget);
        newWidget.id = Globals.widgets++;
        this._initialize(newWidget);

        return newWidget;
    },

    /**
     * Initializes the widget
     * @param widget: the widget
     */
    _initialize: function(widget) {
        widget.difficulty = this.getRandomDifficulty(widget);
        widget.initialize();
        widget.randomize();
        widget.createDiv();

        let min = 0, max = 0;
        let callback = widget.timeoutCallback;

        if (widget.timeoutRange) {
            min = widget.timeoutRange.min;
            max = widget.timeoutRange.max;
        }

        if (max > 0 && min > 0 && max >= min && callback) {
            let timeoutValue = Random.getRandomNumber(min, max);
            setInterval(callback.bind(widget), timeoutValue);
        }
    },

    /**
     * Gets a random difficulty for the widget
     */
    getRandomDifficulty: function(widget) {
        return Random.getRandomValueFromArray(widget.difficulties);
    }
};