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

        this._socket.on('room_joined', function(roomName) {
            Main.onRoomJoined(roomName);
        });

        this._socket.on('update_rooms', function(rooms) {
            Main.updateRoomList(rooms);
        });

        this._socket.on('update_connected_usernames', function(usernames) {
            Main.updateConnectedUsernames(usernames);
        });

        this._socket.on('round_start', function(clientWidgets) {
            Main.showGameWidgets(clientWidgets);
        });

        this._socket.on('round_checked', function() {
            console.log("Round checked - not won yet");
        });

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
     * Starts the round
     * @param serverWidgets - an object of server widgets, keyed by id
     * @param clientWidgets - an object of client widgets, keyed by id
     */
    roundStart: function(serverWidgets, clientWidgets) {
        if (this._socket) {
            this._socket.emit("round_start", Main.roomName, serverWidgets, clientWidgets);
        }
    },

    /**
     * Checks the state of the given client widgets against the server
     * @param clientWidgets - an object of client widgets, keyed by id
     */
    checkRound: function(clientWidgets) {
        if (this._socket) {
            this._socket.emit("check_round", clientWidgets);
        }
    }
};
