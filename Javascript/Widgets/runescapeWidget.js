let RunescapeWidget = {
    /**
     * The widget type - set to the variable name above AND THIS IN INITIALIZE TOO!
     */
     typeString: "RunescapeWidget",

    /**
     * The difficulties that this widget can be
     */
    difficulties: [Difficulties.EASY, Difficulties.MEDIUM, Difficulties.HARD],

    /**
     * The current difficulty - this is set to a random value based on the difficulties array
     * See WidgetHelpers._initialize
     */
    difficulty: Difficulties.EASY,

    /**
     * The div that will be used for this widget
     */
    div: null,

    _findNextEmptyInventorySlot: function() {
        for (let i = 0; i < this.itemList.length; i++) {
            if (this.itemList[i] === "EMPTY") {
                return i;
            }
        }
        throw "ERROR: Runescape widget - could not find empty inventory slot!";
    },

    _getRandomEmptyInventorySlots: function(amount) {
        let _this = this;
        let emptySlots = Object.keys(this.itemList).filter(x => _this.itemList[x] === "EMPTY");
        if (emptySlots < amount) {
            return null; // Not enough slots
        }

        return Random.getRandomValuesFromArray(emptySlots, amount);
    },

    /**
     * Initializes any properties on the widget
     */
    initialize: function() {
        this.typeString = "RunescapeWidget";
        let numberOfItems = Random.getRandomNumber(5, 10); //TODO: set this somehow based on difficulty
        this.initializeProperties();

        this.itemList = [];
        let _this = this;
        for (let i = 0; i < 28; i++) {
            if (i < numberOfItems) {
                let eligibleKeys = [];
                Object.keys(this.items).forEach(function(key) {
                    if (!_this.items[key].exclude) {
                        eligibleKeys.push(key);
                    }
                })

                let randomItem = Random.getRandomValueFromArray(eligibleKeys);
                this.itemList.push(randomItem);
            } else {
                this.itemList.push("EMPTY");
            }
        }
    },

    /**
     * Initializes the item properties, etc
     */
    initializeProperties: function() {
        /**
         * The list of possible items
         */
        this.items = {
            FEATHER: { 
                name: "feather",
                onClick: function(index) {
                    this.itemClickHandlers.TRY_CRAFT.call(this, index, "ARROW_SHAFT", "HEADLESS_ARROW");
                }
            },
            ARROW_SHAFT: { 
                onClick: function(index) {
                    this.itemClickHandlers.TRY_CRAFT.call(this, index, "FEATHER", "HEADLESS_ARROW");
                },
                name: "arrow_shaft" 
            },
            HEADLESS_ARROW: { 
                name: "headless_arrow",
                components: ["FEATHER", "ARROW_SHAFT"]
            },

            RAW_LOBSTER: { name: "raw_lobster" },
            LOBSTER: { 
                name: "lobster",
                onClick: function(index) {
                    this.itemClickHandlers.FOOD.call(this, index);
                },
                getModifiedKey: function(index) {
                    return this.itemModifiers.FOOD.call(this, "LOBSTER");
                }
            },

            RAW_SHARK: { name: "raw_shark" },
            SHARK: { 
                name: "shark",
                onClick: function(index) {
                    this.itemClickHandlers.FOOD.call(this, index);
                },
                getModifiedKey: function() {
                    return this.itemModifiers.FOOD.call(this, "SHARK");
                }
            },

            CAKE: { 
                name: "cake",
                onClick: function(index) {
                    if (this.selectedIndex) {
                        this.itemClickHandlers.NOTHING_INTERESTING_HAPPENS.call(this);
                        return;
                    }

                    this.itemList[index] = "CAKE_ONE_BITE";
                    this._refreshItemsContainer();
                },
                getModifiedKey: function() {
                    switch(Random.getRandomNumber(1, 4)) {
                        case 1:
                            return "CAKE";
                        case 2:
                            return "CAKE_ONE_BITE";
                        case 3: 
                            return "CAKE_TWO_BITES";
                        case 4: 
                            return "EMPTY";
                    }
                }
            },

            CAKE_ONE_BITE: {
                name: "cake_one_bite",
                exclude: true,
                onClick: function(index) {
                    if (this.selectedIndex) {
                        this.itemClickHandlers.NOTHING_INTERESTING_HAPPENS.call(this);
                        return;
                    }

                    this.itemList[index] = "CAKE_TWO_BITES";
                    this._refreshItemsContainer();
                },
                getModifiedKey: function() {
                    switch(Random.getRandomNumber(1, 3)) {
                        case 1:
                            return "CAKE_ONE_BITE";
                        case 2: 
                            return "CAKE_TWO_BITES";
                        case 3: 
                            return "EMPTY";
                    }
                }
            },

            CAKE_TWO_BITES: {
                name: "cake_two_bites",
                exclude: true,
                onClick: function(index) {
                    this.itemClickHandlers.FOOD.call(this, index);
                },
                getModifiedKey: function() {
                    return this.itemModifiers.FOOD.call(this, "CAKE_TWO_BITES");
                }
            }
        };

        this.itemClickHandlers = {
            DEFAULT: function(index) {
                if (this.selectedIndex) {
                    this.itemClickHandlers.NOTHING_INTERESTING_HAPPENS.call(this);
                    return;
                }

                if (this.itemList[index] === "EMPTY") {
                    return;
                }

                this.selectedIndex = index;
                addCssClass(this.divList[index], "widget-runescape-item-selected");
            },
            NOTHING_INTERESTING_HAPPENS: function() {
                removeCssClass(this.divList[this.selectedIndex], "widget-runescape-item-selected");
                this.selectedIndex = 0;
            },
            FOOD: function(index, itemDiv) {
                if (this.selectedIndex) {
                    this.itemClickHandlers.NOTHING_INTERESTING_HAPPENS.call(this);
                    return;
                }

                this.itemList[index] = "EMPTY";
                this._refreshItemsContainer();
            },
            TRY_CRAFT: function(index, otherIngredient, itemToCraft) {
                if (!this.selectedIndex) {
                    this.itemClickHandlers.DEFAULT.call(this, index);
                    return;
                }

                if (this.selectedIndex && this.itemList[this.selectedIndex] === otherIngredient) {
                    this.itemClickHandlers.CRAFT.call(this, itemToCraft, index, this.selectedIndex);
                    return;
                }
                this.itemClickHandlers.NOTHING_INTERESTING_HAPPENS.call(this);
            },
            CRAFT: function(itemToCraft, index1, index2) {
                this.itemList[index1] = "EMPTY";
                this.itemList[index2] = "EMPTY";
                this.itemList[this._findNextEmptyInventorySlot()] = itemToCraft;
                this._refreshItemsContainer();
            }
        },

        this.itemModifiers = {
            FOOD: function(oldKey) {
                if (Random.getRandomBooleanFromPercentage(20)) {
                    return "EMPTY";
                }
                return oldKey;
            }
        };
    },


    /**
     * Randomizes the runescape widget
     * Does a weird thing to make sure the item list isn't messed up due to reference issues
     */
    randomize: function() {
        let temp = this.itemList;
        this.itemList = [];
        for (let i = 0; i < temp.length; i++) {
            this.itemList.push(temp[i]);
        }

        this.itemList.shuffle();
        this.initialState = [];
        for (let i = 0; i < this.itemList.length; i++) {
            this.initialState.push(this.itemList[i]);
        }

        if (this.client) {
            this._randomizeForClient();
        } else {
            this._randomizeForServer();
        }
    },

    /**
     * Modifies the item list by having a chance to break down items into crafting components
     */
    _randomizeForClient: function() {
        for (let i = 0; i < this.itemList.length; i++) {
            let itemObj = this.items[this.itemList[i]];

            // Chance of breaking down an item into its crafting components
            if (itemObj && itemObj.components && Random.getRandomBooleanFromPercentage(80)) {
                let currentItem = this.itemList[i];
                this.itemList[i] = "EMPTY";

                let emptySlots = this._getRandomEmptyInventorySlots(itemObj.components.length);
                if (emptySlots) {
                    for (let i = 0; i < emptySlots.length; i++) {
                        let emptySlot = emptySlots[i];
                        this.itemList[emptySlot] = itemObj.components[i];
                    }
                } else {
                    this.itemList[i] = currentItem;
                }
            }
        }
    },

    /**
     * Sets up the answer key as well as any modifications to the items
     */
    _randomizeForServer: function() {
        this.answer = [];
        for (let i = 0; i < this.itemList.length; i++) {
            let itemKey = this.itemList[i];
            let itemObj = this.items[itemKey];

            // Chance of modifying an item in some way
            // For instance, eating a piece of food
            if (itemObj && itemObj.getModifiedKey) {
                itemKey = itemObj.getModifiedKey.call(this, i);
            }

            this.answer.push(itemKey);
        }
    },

    /**
     * Compares the state of the inventory of the client with the server
     * @param serverWidget - the server widget
     * @return - true if they're the same, false otherwise
     */
    compare: function(serverWidget) {
        let isEqual = true;

        for (let i = 0; i < this.itemList.length; i++) {
            let thisItem = this.itemList[i];
            let serverItem = serverWidget.answer[i];

            if (thisItem !== serverItem) {
                isEqual = false;
                break;
            }
        }

        return isEqual;
    },

    /**
     * All the logic related to DOM elements needs to go here and nowhere else!
     */
    createDiv: function() {
        this.initializeProperties();
        this.div = dce("div", "widget-runescape");

        let refreshButton = dce("div", "widget-runescape-refresh-button");
        refreshButton.onclick = this.refresh.bind(this);

        this.itemsContainer = dce("div", "widget-runescape-items")

        this.div.appendChild(refreshButton);
        this.div.appendChild(this.itemsContainer);

        this._refreshItemsContainer();
    },

    /**
     * Redraws the items container to reflect any changes
     */
    _refreshItemsContainer: function() {
        this.itemsContainer.innerHTML = "";
        this.divList = [];
        let _this = this;

        let listToUse = this.client ? this.itemList : this.answer;
        for (let i = 0; i < listToUse.length; i++) {
            let itemKey = listToUse[i];
            let item = this.items[itemKey];
            let itemDiv = dce("div", "widget-runescape-item");

            if (!this.client && this.eaten && this.eaten[i]) {
                itemKey = "EMPTY";
                item = null;
            }

            this._setItemOnClickHandler(item, i, itemDiv);
            if (item) {
                itemDiv.style.background = `center / contain no-repeat url("Images/RunescapeWidget/${item.name}.png")`;
            }
            
            if (this.client) {
                let itemDivId = `WidgetRunescape-${this.id}-${i}`;
                itemDiv.id = itemDivId;

                itemDiv.draggable = true;
                itemDiv.ondragstart = function(event) {
                    event.dataTransfer.setData("target_id", event.target.id);
                    event.dataTransfer.setData("target_index", i);
                };
                itemDiv.ondragover = function(event) {
                    event.preventDefault();
                };
                itemDiv.ondrop = function(event) {
                    event.preventDefault();
                    let targetId = event.dataTransfer.getData("target_id");
                    let targetIndex = Number(event.dataTransfer.getData("target_index"));
    
                    // Don't do anything if we're dragging onto a DIFFERENT runescape widget!
                    if (targetId.split("-")[1] !== String(_this.id)) {
                        return;
                    }
    
                    let tempValue = _this.itemList[i];
                    _this.itemList[i] = _this.itemList[targetIndex];
                    _this.itemList[targetIndex] = tempValue;

                    _this._refreshItemsContainer();
                };
            }

            this.divList.push(itemDiv);
            this.itemsContainer.appendChild(itemDiv);
        }
    },

    /**
     * Sets up the on click handler for the given item and its div
     * @param item - the item
     * @param index - the index of the item
     * @param itemDiv - the div to set the click handler for
     */
    _setItemOnClickHandler: function(item, index, itemDiv) {
        if (this.client) {
            if (item && item.onClick) {
                itemDiv.onclick = item.onClick.bind(this, index);
            } else {
                itemDiv.onclick = this.itemClickHandlers.DEFAULT.bind(this, index);
            }
        }
    },

    /**
     * Refreshes the invenstory in case a mistake was made
     */
    refresh: function() {
        if (this.client) {
            for (let i = 0; i < this.itemList.length; i++) {
                this.itemList[i] = this.initialState[i];
                this._refreshItemsContainer();
            }
        }
    }
};