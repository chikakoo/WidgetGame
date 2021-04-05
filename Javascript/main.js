let Main = {
    /**
     * The current room you're connected to
     */
    roomName: "",

    /**
     * Whether you're the client
     */
    isClient: true,

    /**
     * An object of active widgets, keyed by widget ID
     */
    activeWidgets: {},

    /**
     * A map of widget types to their default objects
     */
    map: {
        "ShapeWidget": ShapeWidget
    },

    /**
     * Debug properties
     */
    clientWidget: null,
    serverWidget: null,

    /**
     * Initialize the application
     */
    initialize: function() {
        if (Settings.debugMode) {
            let widgets = WidgetHelpers.create(ShapeWidget);
            this.clientWidget = widgets.client;
            this.serverWidget = widgets.server;
            this._initializeForDebug();
        }

        SocketClient.connect();
        SocketClient.updateRooms();
    },

    /**
     * Creates and joins the new server room
     */
    onCreateRoomClicked: function() {
        let errorDiv = document.getElementById("errors");
        addCssClass(errorDiv, "nodisp");

        let roomAndUsername = this._getRoomAndUsername();
        if (!roomAndUsername) {
            return;
        }
        SocketClient.createRoom(roomAndUsername.roomName, roomAndUsername.username);
    },

    /**
     * Gets the room and user name - includes showing errors if necessary
     * @skipRoomName - pass true if you only want the username
     * @return - the room and username in an object (roomName, username as properties); falsey if there's a problem
     */
    _getRoomAndUsername: function(skipRoomName) {
        let roomName = document.getElementById("inputRoomName").value;
        if (!roomName && !skipRoomName) {
            this._showError("Please enter a room name!");
            return null;
        }

        let username = document.getElementById("inputUsername").value;
        if (!username) {
            this._showError("Please enter a username!");
            return null;
        }

        return { roomName: roomName, username: username };
    },

    /**
     * Shows an error in the error div
     * @param error - the error message
     */
    _showError: function(error) {
        let errorDiv = document.getElementById("errors");
        errorDiv.innerText = error;
        removeCssClass(errorDiv, "nodisp");
    },

    /**
     * Updates the list of rooms to join
     */
    updateRoomList: function(roomList) {
        let roomListDiv = document.getElementById("roomList");
        roomListDiv.innerHTML = "";

        roomList.forEach(function(roomName) {
            let roomButton = dce("button");
            roomButton.innerText = roomName;

            roomButton.onclick = function() {
                let roomAndUsername = Main._getRoomAndUsername(true);
                if (!roomAndUsername) {
                    return;
                }
                SocketClient.joinRoom(roomButton.innerText, roomAndUsername.username);
            }
            roomListDiv.appendChild(roomButton);
        });
    },

    /**
     * Called when a room is joined
     * @param roomname - the name of the room
     */
    onRoomJoined: function(roomName) {
        Main.roomName = roomName;

        addCssClass(document.getElementById("preRoomJoin"), "nodisp");
        removeCssClass(document.getElementById("roomLobby"), "nodisp");
        document.getElementById("startGame").setAttribute("disabled", "");

        SocketClient.updateConnectedUsernames();
    },

    /**
     * Update the list of connected users
     * Also enables the start game button for the host if there's more than one player
     * @param usernames - the usernames
     */
    updateConnectedUsernames: function(usernames) {
        let playerList = document.getElementById("playerList");
        playerList.innerText = usernames.join(" | ");

        if (!Main.isClient && usernames.length > 1) {
            document.getElementById("startGame").removeAttribute("disabled");
        }
    },

    /**
     * Starts the game
     */
    onStartGameClicked: function() {
        this._createAndSetWidgetsForGame();
        SocketClient.roundStart();
        this.showGameWidgets(this.activeWidgets);
    },

    /**
     * Gets an array of widgets to use for the next game
     * TODO: the real logic for this
     * @param levelNumber - the level number to use for difficulty, etc.
     */
    _createAndSetWidgetsForGame: function(levelNumber) {
        let widget = WidgetHelpers.create(ShapeWidget);

        this.activeWidgets = {};
        this.activeWidgets[widget.id] = widget;
    },

    /**
     * Shows the game widgets
     */
    showGameWidgets: function(widgets) {
        let gameWinDiv = document.getElementById("checkGameWin");
        if (Main.isClient) {
            Main.activeWidgets = widgets;
            Main.rehydrateWidgets(Main.activeWidgets, true);
            removeCssClass(gameWinDiv, "hidden");
        } else {
            addCssClass(gameWinDiv, "hidden");
        }

        let widgetContainer = document.getElementById("widgetContainer");
        widgetContainer.innerHTML = "";
        Object.keys(widgets).forEach(function(id) {
            widgetContainer.appendChild(widgets[id].div);
        });
        
        addCssClass(document.getElementById("roomLobby"), "nodisp");
        removeCssClass(document.getElementById("gameActive"), "nodisp");
    },

    /**
     * Rehydrate the widgets - includes re-randomizing them
     * @param widgets - the widgets to rehydrate
     * @param randomize - whether to re-randomize the widget
     */
    rehydrateWidgets: function(widgets, randomize) {
        Object.keys(widgets).forEach(function(id) {
            widgets[id] = Object.assign({}, Main.map[widgets[id].typeString], widgets[id]);
            widgets[id].client = true;
            if (randomize) { widgets[id].randomize() };
            widgets[id].createDiv();
        });
    },

    /**
     * Executed when the game win button is clicked
     */
    onCheckGameWinClicked: function() {
        SocketClient.checkRound(this.activeWidgets);
    },

    /**
     * Called when the server gives us the server the client widgets
     * Checks the win state and acts accordingly
     */
    checkWinState: function(clientWidgets) {
        Main.rehydrateWidgets(clientWidgets);

        let allMatch = true;
        Object.keys(Main.activeWidgets).forEach(function(widgetId) {
            if (!Main.activeWidgets[widgetId].compare(clientWidgets[widgetId])) {
                allMatch = false;
            }
        });

        SocketClient.onWinStateChecked(allMatch);

        if (allMatch) {
            Main.onRoundWin();
        } else {
            Main.onRoundChecked();
        }
    },

    /**
     * Executed when the round has been checked, but not won yet
     * TODO STILL
     */
    onRoundChecked: function() {
        console.log("NOT WON!");
    },

    /**
     * Executed when the round is won
     * TODO STILL
     */
    onRoundWin: function() {
        console.log("WIN!");
    },

    /** DEBUG MODE AREA */

    /**
     * Initialize for debug mode
     */
    _initializeForDebug: function() {
        let header = dce("h1");
        header.innerText = "Figure out the answer";

        let testButton = dce("button");
        testButton.innerText = "Check"
        testButton.onclick = this.testButtonClick.bind(this);

        document.body.appendChild(header);
        document.body.appendChild(testButton);

        document.body.appendChild(this.clientWidget.div);
        //document.body.appendChild(this.serverWidget.div);
    },

    testButtonClick: function() {
        let h1Text = this.clientWidget.compare(this.serverWidget) ? "Good!" : "Nope.";
        document.getElementById("header").innerText = h1Text;
    }
};