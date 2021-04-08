let FlipModifier = {
    /**
     * Sets up the initial values for the marquee
     */
    initialize: function() {
        this.typeString = "FlipModifier"; // IMPORTANT, SET THIS TO THE VARIABLE NAME!
        this.direction = Random.getRandomValueFromArray(["vertical", "horizontal"]);
        this.flipSpeed = Random.getRandomNumber(4, 10);
    },

    /**
     * Does the actual changes and uses the properties defined in initialize
     * @param widgetWrapper - the wrapper div
     */
    apply: function(widgetWrapper) {
        widgetWrapper.style.animation = `${this.direction}FlipAnim ${this.flipSpeed}s infinite linear`;    
    },
};