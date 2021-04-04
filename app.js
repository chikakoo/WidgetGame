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
        
        client.emit("room_joined", roomName);
        client.broadcast.emit("update_rooms", Object.keys(rooms));
    });

    client.on("join_room", function(roomName, username) {
        if (!rooms[roomName]) {
            console.log(`ERROR: ${username} tried to join non-existant room ${roomName}`);
        }

        rooms[roomName].players[client.id] = {
            username: username
        };

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
    client.on('round_start', function(roomName, serverWidgets, clientWidgets) {
        console.log("TEST: " + clientWidgets[0].onclick);

        rooms[roomName].activeWidgets = serverWidgets;
        client.broadcast.emit('round_start', clientWidgets);
    });

    /**
     * Check the state of the round - compares the list of client widgets to the goal state of the server widgets
     */
    client.on('check_round', function(roomName, clientWidgets) {
        console.log("Checking round...");

        let serverWidgets = rooms[roomName].activeWidgets;
        let allMatch = true;
        Object.keys(serverWidgets).forEach(function(widgetId) {
            if (!clientWidgets[widgetId].compare(serverWidgets[widgetId])) {
                allMatch = false;
            }
        });

        if (allMatch) {
            console.log("Round win!");
            client.broadcast.emit('round_win');
        } else {
            console.log("No win yet...");
            client.broadcast.emit('round_checked');
        }
    });
});

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