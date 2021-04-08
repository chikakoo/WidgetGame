let ExternalBounceModifier = {
    /**
     * Sets up the initial values for the marquee
     */
    initialize: function() {
        this.typeString = "ExternalBounceModifier"; // IMPORTANT, SET THIS TO THE VARIABLE NAME!
        this.bounceSpeedX = Random.getRandomNumber(8, 12) * 1000;
        this.bounceSpeedY = Random.getRandomNumber(8, 12) * 1000;
        this.yAnimDiv = dce("div");
    },

    /**
     * Does the actual changes and uses the properties defined in initialize
     * @param widgetWrapper - the wrapper div
     */
    apply: function (widgetWrapper) {

        this.yDirectionDiv = dce("div");

        widgetWrapper.animate([
            // keyframes
            { transform: `translateX(${window.innerWidth - widgetWrapper.offsetWidth - widgetWrapper.getBoundingClientRect().left}px)` },
        ], {
            // timing options
            direction: "alternate",
            duration: this.bounceSpeedX,
            iterations: Infinity,
        });

        this.yDirectionDiv.animate([
            // keyframes
            { transform: `translateY(${window.innerHeight - widgetWrapper.offsetHeight - widgetWrapper.getBoundingClientRect().top}px)` },
        ], {
            // timing options
            direction: "alternate",
            duration: this.bounceSpeedY,
            iterations: Infinity,
        });

        let widgetDiv = widgetWrapper.firstChild;
        widgetWrapper.insertBefore(this.yDirectionDiv, widgetDiv);
        this.yDirectionDiv.appendChild(widgetDiv);

    },
};