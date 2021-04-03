let LiquidPourWidget = {
    /**
     * The difficulties that this widget can be
     */
    difficulties: [Difficulties.HARD],

    /**
     * The current difficulty - this is set to a random value based on the difficulties array
     * See WidgetHelpers._initialize
     */
    difficulty: Difficulties.HARD,

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
     * Initializes any properties on the widget, including randomizing any relevant settings
     */
    initialize: function() {
        this.div = dce("div", "widget-liquidPour");
        this.liquidDiv = dce("div", "widget-liquidPour-liquid");

        this.fillButton = dce("button", "widget-liquidPour-fillButton");
        this.fillButton.onmousedown = this.pourLiquid.bind(this);
        this.fillButton.onmouseup = this.stopMovingLiquid.bind(this);
        this.fillButton.onmouseleave = this.stopMovingLiquid.bind(this);

        this.emptyButton = dce("button", "widget-liquidPour-emptyButton");
        this.emptyButton.onmousedown = this.emptyLiquid.bind(this);
        this.emptyButton.onmouseup = this.stopMovingLiquid.bind(this);
        this.emptyButton.onmouseleave = this.stopMovingLiquid.bind(this);

        this.div.appendChild(this.liquidDiv);
        this.div.appendChild(this.fillButton);
        this.div.appendChild(this.emptyButton);
        
        if (this.client) {
            this.liquidBeginPer = 0;
            this.liquidCurrPer = 0;
        } else {
            this.liquidGoalPer = 0;
            addCssClass(this.fillButton, "hidden");
            addCssClass(this.emptyButton, "hidden");
        }
    },

    /**
     * Randomizes aspects of the widget
     */
    randomize: function() {
        if (this.client) {
            this.liquidBeginPer = Random.getRandomNumber(0, 100);    
            this.liquidCurrPer = this.liquidBeginPer;
            this.liquidDiv.style.height = `${this.liquidCurrPer}%`;
        } else {
            this.liquidGoalPer = Random.getRandomNumber(0, 100);
            this.liquidDiv.style.height = `${this.liquidGoalPer}%`;
            console.log("Goal: " + this.liquidGoalPer);
        }

    },

    pourLiquid: function(){
        this.timer = setInterval(this.pourLiquidStep.bind(this), 50);
    },

    emptyLiquid: function() {
        this.timer = setInterval(this.emptyLiquidStep.bind(this), 50);
    },

    stopMovingLiquid: function(){
        clearInterval(this.timer);
    },

    pourLiquidStep: function(){
        if (this.liquidCurrPer < 100) this.liquidCurrPer++;
        this.liquidDiv.style.height = `${this.liquidCurrPer}%`;
        console.log("Current: " + this.liquidCurrPer);
    },

    emptyLiquidStep: function(){
        if (this.liquidCurrPer > 0) this.liquidCurrPer--;
        this.liquidDiv.style.height = `${this.liquidCurrPer}%`;
        console.log("Current: " + this.liquidCurrPer);
    },

    /**
     * Compares this widget to the given widget to check whether they match
     * @param otherWidget - the other widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(serverWidget) {
        if (this.liquidCurrPer >= (serverWidget.liquidGoalPer - 3)){
            if (this.liquidCurrPer <= (serverWidget.liquidGoalPer + 3)) return true;
        }        
        return false;
    }
};