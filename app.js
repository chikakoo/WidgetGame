/**
 * Flow for future reference:
 * 
 * All widgets have widget.createDiv() that will handle ALL div creation
 * All widgets' randomize() functions must be repeatable so that if ran again, it's possible to get it back to the previous state
 * 
 * Host will set isClient to FALSE when creating a room
 * When someone joins, isClient will be changed to TRUE only for them!
 * ONLY the host will have the "Start" button be active (and only when there's 2 players)
 * 
 * When the game is started...
 * The host side will create all the widgets and put them in the object to be stored locally (client = false at this point)
 * They will then be sent across to the server as is
 * The server will send them over to the other player
 * The other player will then locally set them all to client = true AND call Object.assign, AND widget.createDiv() to refersh the object
 * ONLY the non-host will have the ability to check for a win
 * 
 * When checking for a win...
 * The non-host will send their objects across to the host
 * The host will then call Object.assign AND widget.createDiv() for safety
 * The widget.compare() function will then be called to compare everything
 * If it's a match or not, then we'll call the appropriate server events
 */


const staticServer = require('node-static');
const http = require('http');
const port = 25565;

/**
 * Contains keys of room names with an object of client Ids and their
 * corresponding names
 */
var rooms = {};

var file = new(staticServer.Server)();

// Static server (for css, image, etc.)
var httpServer = http.createServer(function (req, res) {
    file.serve(req, res);
});

const io = require('socket.io')(httpServer);
io.on('connection', function(client) {
    console.log(`Connection to client ${client.id} established`);

    client.on('disconnect', function() {
        console.log(`Client ${client.id} has disconnected`);
    });

    client.on("create_room", function(roomName, username) {
        // One day we should deal with overwriting existing room names
        rooms[roomName] = {
            name: roomName,
            players: {}
        };
        rooms[roomName].players[client.id] = {
            username: username,
            isHost: true
        };
        client.join(roomName);
        client.emit("room_created", roomName);
        client.broadcast.emit("update_rooms", Object.keys(rooms));
    });

    client.on("join_room", function(roomName, username) {
        if (!rooms[roomName]) {
            console.log(`ERROR: ${username} tried to join non-existant room ${roomName}`);
        }

        rooms[roomName].players[client.id] = {
            username: username
        };

        client.join(roomName);
        client.emit("room_joined", roomName);
        client.broadcast.emit("update_connected_usernames", getConnectedUsernames(roomName));
        console.log(`${username} joined room ${roomName}!`);
    });

    client.on("update_rooms", function() {
        client.emit("update_rooms", Object.keys(rooms));
    });

    client.on('update_connected_usernames', function(roomName) {
        client.emit("update_connected_usernames", getConnectedUsernames(roomName));
    });

    /**
     * The round start - widgets contains an id-separated list of widgets
     * Sends back the list of client widgets to be used by the client
     */
    client.on('round_start', function(roomName, clientWidgets) {
        client.to(roomName).broadcast.emit('round_start', clientWidgets);
    });

    /**
     * Check the state of the round - passes the client widgets over to the host
     */
    client.on('check_round', function(roomName, clientWidgets) {
        client.to(roomName).broadcast.emit('check_round', clientWidgets);
    });

    /**
     * Called when checking the win state of the game
     */
    client.on('win_state_checked', function(roomName, gameWon) {
        if (gameWon) {
            client.to(roomName).broadcast.emit('round_win');
        } else {
            client.to(roomName).broadcast.emit('round_checked');
        }
    })
});

/**
 * Gets the list of connected usernames in a given room
 * @param roomName - the name of the room
 */
getConnectedUsernames = function(roomName) {
    let players = rooms[roomName].players;
    let usernames = [];

    Object.keys(players).forEach(function(playerId) {
        usernames.push(players[playerId].username);
    });

    return usernames;
};

httpServer.listen(port, function(err) {
    if (err) throw err;
    console.log(`listening on port ${port}`);
});