let MorseWidget = {
    /**
     * The widget type - set to the variable name above AND THIS IN INITIALIZE TOO!
     */
    typeString: "MorseWidget",

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

    _letterToMorseMapping: {
        A: ". -",
        B: "- . . .",
        C: "- . - .",
        D: "- . .",
        E: ". . - .",
        F: ". . - .",
        G: "- - .",
        H: ". . . .",
        I: ". .",
        J: ". - - -",
        K: "- . -",
        L: ". - . .",
        M: "- -",
        N: "- .",
        O: "- - -",
        P: ". - - .",
        Q: "- - . -",
        R: ". - .",
        S: ". . .",
        T: "-",
        U: ". . -",
        V: ". . . -",
        W: ". - -",
        X: "- . . -",
        Y: "- . - -",
        Z: "- - . ."
    },

    /**
     * Initializes the rotation speed settings
     */
    initialize: function() {
        this.typeString = "MorseWidget";
    
        this.answerLetters = "";
        this.answerMorse = "";

        this.dotSpeed = 250;
        this.dashSpeed = 500;
        this.defaultSpeed = 250;

        this.currentDisplayedSymbolIndex = 0;

    },

    /**
     * Randomizes aspects of the widget
     */
    randomize: function() {
        if(!this.client){
            this.answerLetters = Random.getRandomValueFromArray(Wordlist.words);

            this.answerLetters = this.answerLetters.toUpperCase();

            for (i = 0; i < this.answerLetters.length; i++) {
                this.answerMorse += Object.values(this._letterToMorseMapping)[this.answerLetters.charCodeAt(i)-65] + "   ";
            }

            this.answerMorse = this.answerMorse.slice(0, -1);

        } else {
            this.answerLetters = "";
            this.answerMorse = "";
        }

        //console.log(this.answerLetters);
        //console.log(this.answerMorse);
    },


    /**
     * Compares this widget to the given widget to check whether they match
     * @param otherWidget - the other widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(serverWidget) {
        if (this.answerInput.toUpperCase() === serverWidget.answerLetters.toUpperCase()) return true;
        else return false;
    },

    showMorseStep: function(){
        var speed = 0;

        if (this.answerMorse.charAt(this.currentDisplayedSymbolIndex) === '.') speed = this.dotSpeed;
        else if (this.answerMorse.charAt(this.currentDisplayedSymbolIndex) === '-') speed = this.dashSpeed;
        else speed = this.defaultSpeed;
        
        if (this.currentDisplayedSymbolIndex < this.answerMorse.length) {
            this.answerDiv.innerHTML = this.answerMorse.charAt(this.currentDisplayedSymbolIndex);
            this.currentDisplayedSymbolIndex++;
        } else {
            this.currentDisplayedSymbolIndex = 0;
            this.answerDiv.innerHTML = " ";
            this.answerDiv.style.backgroundColor = Random.getRandomColorHexString();
            speed = 1000;
        }

        setTimeout(this.showMorseStep.bind(this), speed);
    },

    /**
     * Handles the div creation
     */
    createDiv: function() {
        this.div = dce("div", "widget-morse");
        this.mainContainerDiv = dce("div", "widget-morse-main")

        this.morseKeyDiv = dce("div", "widget-morse-key"); // Client side only- shows mapping of letters to morse
        this.morseKeyDiv.innerText= "A: .-\nB: -...\nC: -.-.\nD: -..\nE: ..-.\nF: ..-.\nG: --.\nH: ....\nI: ..\nJ: .-- -\nK: -.-\nL: .-..\nM: --\nN: -.\nO: ---\nP: .--.\nQ: --.-\nR: .-.\nS: ...\nT: -\nU: ..-\nV: ...-\nW: .--\nX: -..-\nY: -.--\nZ: --..";
        this.morseKeyDiv.style.backgroundColor = Random.getRandomColorHexString();

        this.answerDiv = dce("div", "widget-morse-answerBox"); // Server side only- shows the morse code being tapped out
        this.answerDiv.style.backgroundColor = Random.getRandomColorHexString();
        this.input = dce("input"); // Client side only- place to enter the answer 
        this.input.value = "";

        let _this = this;
        this.input.onchange = function() {
            _this.answerInput = _this.input.value.trim();
        };

        if (this.client) {
            addCssClass(this.answerDiv, "nodisp");      
        } else {
            addCssClass(this.morseKeyDiv, "nodisp");
            addCssClass(this.input, "nodisp");
        }
        
        this.div.appendChild(this.mainContainerDiv);
        this.mainContainerDiv.appendChild(this.answerDiv);
        this.mainContainerDiv.appendChild(this.morseKeyDiv);
        this.mainContainerDiv.appendChild(this.input);

        var speed = 0;

        if (this.answerMorse.charAt(this.currentDisplayedSymbolIndex) === '.') speed = this.dotSpeed;
        else if (this.answerMorse.charAt(this.currentDisplayedSymbolIndex) === '-') speed = this.dashSpeed;
        else speed = this.defaultSpeed;

        if (!this.client) setTimeout(this.showMorseStep.bind(this), speed);
    }
};