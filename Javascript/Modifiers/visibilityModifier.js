let VisibilityModifier = {
    /**
     * Sets up the modifier - add any attributes that are needed. 
     * Be sure to set them in this function rather than in the initial declaration!
     */
     initialize: function() {
        this.typeString = "VisiblityModifier";
        this.hideOnHover = Random.getRandomBoolean();
    },

    /**
     * Does the actual changes and uses the properties defined in initialize
     * @param widgetWrapper - the wrapper around the widget div - the actual widget div should be the only child at this point
     */
    apply: function(widgetWrapper) {
        if (this.hideOnHover) {
            addCssClass(widgetWrapper, "modifiers-visibility-hide-on-hover");
        } else {
            addCssClass(widgetWrapper, "modifiers-visibility-hide-unless-hover");
        }
        
    }
};