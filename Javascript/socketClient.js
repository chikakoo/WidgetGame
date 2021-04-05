SocketClient = {
	_socket: null,

    isServerRunning: function() {
		return typeof io !== 'undefined';
	},
	
	connect: function() {
		if (!this.isServerRunning()) {
			return;
		}

		this._socket = io();
		this._socket.connect('http://127.0.0.1:25565');

		// Connect/Disconnect listeners
		this._socket.on('connect', function() {
			console.log("Connected to the server");
		});
		
		this._socket.on('disconnect', function() {
			console.log('Disconnected from the server');
		});

        /**
         * Used by the host so that the isClient flag is set to false
         * Also handles the UI for the lobby
         */
        this._socket.on('room_created', function(roomName) {
            Main.isClient = false;
            Main.onRoomJoined(roomName);
        });

        /**
         * Used by the client so that the isClient flag is set to true
         * Also handles the UI for the lobby
         */
        this._socket.on('room_joined', function(roomName) {
            Main.isClient = true;
            Main.onRoomJoined(roomName);
        });

        /**
         * Updates the list of rooms to join
         */
        this._socket.on('update_rooms', function(rooms) {
            Main.updateRoomList(rooms);
        });

        /**
         * Updates the list of connected players
         */
        this._socket.on('update_connected_usernames', function(usernames) {
            Main.updateConnectedUsernames(usernames);
        });

        /**
         * Only called on the non-host; passes along the created widgets for the client to rehydrate, randomize, and display
         */
        this._socket.on('round_start', function(clientWidgets) {
            console.log("Round starting!");
            Main.showGameWidgets(clientWidgets);
        });

        /**
         * Passes the widget data from the non-host over to the host so that they can be compared
         */
        this._socket.on("check_round", function(clientWidgets) {
            Main.checkWinState(clientWidgets);
        })

        /**
         * Called when the state has been checked, but it isn't a win
         */
        this._socket.on('round_checked', function() {
            Main.onRoundChecked();
        });

        /**
         * Called when the round is won
         */
        this._socket.on('round_win', function() {
            Main.onRoundWin();
        });
    },

    /**
     * Creates the server room
     * @param roomName - the name of the room
     * @param username - the user who created the room
     */
    createRoom: function(roomName, username) {
        if (this._socket) {
            this._socket.emit("create_room", roomName, username);
        }
    },

    /**
     * Joins the room
     * @param roomName - the room name 
     * @param username - the user who is joining
     */
    joinRoom: function(roomName, username) {
        if (this._socket) {
            this._socket.emit("join_room", roomName, username);
        }
    },

    /**
     * Updates the room list
     */
    updateRooms: function() {
        if (this._socket) {
            this._socket.emit("update_rooms");
        }
    },

    /**
     * Updates the current set of connected users
     * @param roomName - the room name
     */
    updateConnectedUsernames: function() {
        if (this._socket) {
            this._socket.emit("update_connected_usernames", Main.roomName);
        }
    },

    /**
     * Starts the round - uses the properties set in Main
     */
    roundStart: function() {
        if (this._socket) {
            this._socket.emit("round_start", Main.roomName, Main.activeWidgets);
        }
    },

    /**
     * Checks the state of the given client widgets against the server
     * @param clientWidgets - an object of client widgets, keyed by id
     */ 
    checkRound: function(clientWidgets) {
        if (this._socket) {
            this._socket.emit("check_round", Main.roomName, clientWidgets);
        }
    },

    /**
     * Called when the win state is checked
     * @param gameWon - true if the game was won
     */
    onWinStateChecked: function(gameWon) {
        if (this._socket) {
            this._socket.emit("win_state_checked", Main.roomName, gameWon);
        }
    }
};
