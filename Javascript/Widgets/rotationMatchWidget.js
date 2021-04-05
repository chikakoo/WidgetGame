let RotationMatchWidget = {
    /**
     * The widget type - set to the variable name above AND THIS IN INITIALIZE TOO!
     */
    typeString: "RotationMatchWidget",

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

    _rotationSpeed: {
        VERY_SLOW: 25,
        SLOW: 10,
        AVERAGE: 5,
        FAST:  2,
        VERY_FAST: 1
    },

    /**
     * Initializes the rotation speed settings
     */
    initialize: function() {
        this.typeString = "RotationMatchWidget";
    
        this.rotationSpeedBegin = 0;
        this.rotationSpeedCurr = this.rotationSpeedBegin;
        this.rotationSpeedCurr = 0;
        this.shapeColor = Random.getRandomColorHexString();
        this.shapeType = Random.getRandomValueFromArray(Object.values(Shapes.values));
        console.log(this.shapeColor);

    },

    /**
     * Randomizes aspects of the widget
     */
    randomize: function() {
        this.rotationSpeedBegin = Random.getRandomNumber(0, 4); 
        this.rotationSpeedCurr = this.rotationSpeedBegin;      
    },

    changeSpeed: function(isIncrease){
        if (isIncrease && this.rotationSpeedCurr < 4) {
            this.rotationSpeedCurr++;
            this.shapeDiv.style.animation = `widget-rotationMatch-rotatingAnim ${Object.values(this._rotationSpeed)[this.rotationSpeedCurr]}s linear infinite`;
        } else if (!isIncrease && this.rotationSpeedCurr > 0){
            this.rotationSpeedCurr--;
            this.shapeDiv.style.animation = `widget-rotationMatch-rotatingAnim ${Object.values(this._rotationSpeed)[this.rotationSpeedCurr]}s linear infinite`;
        }
    },


    /**
     * Compares this widget to the given widget to check whether they match
     * @param otherWidget - the other widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(serverWidget) {
        return this.rotationSpeedCurr === serverWidget.rotationSpeedCurr;
    },

    /**
     * Handles the div creation
     */
    createDiv: function() {
        this.div = dce("div", "widget-rotationMatch");
        this.shapeDiv = Shapes.createDiv(this.shapeType, this.shapeColor);
        addCssClass(this.shapeDiv, "widget-rotationMatch-shape");
        addCssClass(this.shapeDiv, "widget-rotationMatch-rotating");
        this.shapeDiv.style.animation = `widget-rotationMatch-rotatingAnim ${Object.values(this._rotationSpeed)[this.rotationSpeedCurr]}s linear infinite`;
        console.log(Object.keys(this._rotationSpeed)[this.rotationSpeedCurr]);

        this.increaseSpeedButton = dce("div", "widget-rotationMatch-increaseButton");
        this.increaseSpeedButton.onmousedown = this.changeSpeed.bind(this, true);

        this.decreaseSpeedButton = dce("div", "widget-rotationMatch-decreaseButton");    
        this.decreaseSpeedButton.onmousedown = this.changeSpeed.bind(this, false);

        if (!this.client){
            addCssClass(this.increaseSpeedButton, "hidden");
            addCssClass(this.decreaseSpeedButton, "hidden");
        }

        this.div.appendChild(this.shapeDiv);
        this.div.appendChild(this.increaseSpeedButton);
        this.div.appendChild(this.decreaseSpeedButton);

    }
};