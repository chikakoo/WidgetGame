let SkewModifier = {
    /**
     * Sets up the modifier - add any attributes that are needed. 
     * Be sure to set them in this function rather than in the initial declaration!
     */
     initialize: function() {
        this.typeString = "SkewModifier"; // IMPORTANT, SET THIS TO THE VARIABLE NAME!
        this.horizontalSkew = Random.getRandomNumber(5, 15);
        this.verticalSkew = Random.getRandomNumber(5, 15);
    },

    /**
     * Does the actual changes and uses the properties defined in initialize
     * @param widgetWrapper - the wrapper around the widget div - the actual widget div should be the only child at this point
     */
    apply: function(widgetWrapper) {
        widgetWrapper.style.transform = `skew(${this.horizontalSkew}deg, ${this.verticalSkew}deg)`;
    }
};