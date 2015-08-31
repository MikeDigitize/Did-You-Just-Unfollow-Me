var express = require("express");
var fs = require("fs");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var TwitterClient = require("./twitter-client.js");

server.listen(1337);
app.use(express.static(__dirname + "/build" ));

io.on("connection", function(socket) {

    var tc = new TwitterClient(io, socket.id);

    io.to(socket.id).emit("userid", socket.id);
    console.log("a user connected", socket.id);

    socket.on("user-name-entered", function (name) {
        tc.init(name);
    });

    socket.on("follow-user", function (id) {
        tc.follow(id);
    });

    socket.on("unfollow-user", function (id) {
        tc.unfollow(id);
    });

});
