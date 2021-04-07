let MarqueeModifier = {
    /**
     * Sets up the initial values for the marquee
     */
    initialize: function() {
        this.typeString = "MarqueeModifier"; // IMPORTANT, SET THIS TO THE VARIABLE NAME!
        this.direction = Random.getRandomValueFromArray(["up", "down", "left", "right"]);
        this.scrollAmount = Random.getRandomNumber(1, 3);
    },

    /**
     * Does the actual changes and uses the properties defined in initialize
     * @param widgetWrapper - the wrapper div to insert the marquee in
     */
    apply: function(widgetWrapper) {
        let marquee = dce("marquee");
        marquee.direction = this.direction;
        marquee.scrollAmount = this.scrollAmount;

        let widgetDiv = widgetWrapper.firstChild;
        widgetWrapper.insertBefore(marquee, widgetDiv);
        marquee.appendChild(widgetDiv);
    },
};