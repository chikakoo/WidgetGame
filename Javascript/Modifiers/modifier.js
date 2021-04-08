let BaseModifier = {
    /**
     * Sets up the modifier - add any attributes that are needed. 
     * Be sure to set them in this function rather than in the initial declaration!
     */
    initialize: function() {
        this.typeString = "BaseModifier"; // IMPORTANT, SET THIS TO THE VARIABLE NAME!
        throw "ERROR: Initialize not defined in modifier!";
    },

    /**
     * Does the actual changes and uses the properties defined in initialize
     * @param widgetWrapper - the wrapper around the widget div - the actual widget div should be the only child at this point
     */
    apply: function(widgetWrapper) {
        throw "ERROR: Apply not defined in modifier!";
    }
};

let ModifierHelpers = {
    /**
     * A map of modifier type names to the modifier
     */
    map: {
        "MarqueeModifier": MarqueeModifier,
        "VisiblityModifier": VisibilityModifier,
        "SkewModifier": SkewModifier,
        "FlipModifier": FlipModifier,
        "SizeModifier": SizeModifier,
        "ExternalBounceModifier": ExternalBounceModifier,
        "SpinModifier": SpinModifier
    },

    /**
     * Handles inserting modifiers for the current widgets
     * @param widget - the widget
     * @param currentLevel - the current level
     */
     tryAddModifier: function(widget, currentLevel) {
        //TODO: make this based on level somehow? Currently a 15% chance of getting a modifier
        if (!Random.getRandomBooleanFromPercentage(20) || Settings.disableModifiers) {
            return;
        }

        //let modifier = Object.create(MarqueeModifier); // Use this for testing and comment the line below and the return above
        let modifier = Object.create(Random.getRandomValueFromArray(Object.values(this.map)));
        if (modifier.widgetsToExclude && modifier.widgetsToExclude.includes(widget.typeString)) {
            return;
        }

        modifier.initialize();

        widget.modifiers = widget.modifiers || [];
        widget.modifiers.push(modifier);
    },

    /**
     * Handles applying the widget modifiers
     * @param widget - the widget that contains the modifier data
     * @param widgetWrapper - the widget wrapper
     */
    applyModifiers: function(widget, widgetWrapper) {
        if (!widget.modifiers || widget.modifiers.length === 0) {
            return;
        }

        widget.modifiers.forEach(function(modifier) {
            modifier = Object.assign({}, ModifierHelpers.map[modifier.typeString], modifier);
            modifier.apply(widgetWrapper);
        });
    }
};