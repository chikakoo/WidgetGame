let SpinModifier = {
    /**
     * Sets up the initial values for the marquee
     */
    initialize: function() {
        this.typeString = "SpinModifier"; // IMPORTANT, SET THIS TO THE VARIABLE NAME!
        this.direction = Random.getRandomValueFromArray(["clockwise", "counterclockwise"]);
        this.spinSpeed = Random.getRandomNumber(5, 10);
    },

    /**
     * Does the actual changes and uses the properties defined in initialize
     * @param widgetWrapper - the wrapper div
     */
    apply: function(widgetWrapper) {
        widgetWrapper.style.animation = `${this.direction}SpinAnim ${this.spinSpeed}s infinite linear`;    
    },
};