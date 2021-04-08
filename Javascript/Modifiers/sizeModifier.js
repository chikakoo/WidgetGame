let SizeModifier = {
    /**
     * Sets up the initial values for the marquee
     */
    initialize: function() {
        this.typeString = "SizeModifier"; // IMPORTANT, SET THIS TO THE VARIABLE NAME!
        this.direction = Random.getRandomValueFromArray(["big", "small"]);
        this.scaleSpeed = Random.getRandomNumber(4, 10);
    },

    /**
     * Does the actual changes and uses the properties defined in initialize
     * @param widgetWrapper - the wrapper div
     */
    apply: function(widgetWrapper) {
        widgetWrapper.style.animation = `${this.direction}ResizeAnim ${this.scaleSpeed}s infinite linear`;    
    },
};