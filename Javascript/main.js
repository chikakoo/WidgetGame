let Main = {
    /**
     * The current room you're connected to
     */
    roomName: "",

    /**
     * Debug properties
     */
    clientWidget: WidgetHelpers.createClient(WidgetShape),
    serverWidget: WidgetHelpers.createServer(WidgetShape),

    /**
     * Initialize the application
     */
    initialize: function() {
        if (Settings.debugMode) {
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
        this.roomName = roomName;

        addCssClass(document.getElementById("preRoomJoin"), "nodisp");
        removeCssClass(document.getElementById("roomLobby"), "nodisp");
        SocketClient.updateConnectedUsernames();
    },

    /**
     * Update the list of connected users
     * @param usernames - the usernames
     */
    updateConnectedUsernames: function(usernames) {
        let playerList = document.getElementById("playerList");
        playerList.innerText = usernames.join(" ");
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