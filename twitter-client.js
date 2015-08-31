var twitter = require("twitter");
var config = require("./twitter-config");
var client = new twitter(config);

function TwitterClient(socketClient, socketid) {
    this.socketClient = socketClient;
    this.socketid = socketid;
    this.screen_name = null;
    this.friendsWhoDontFollow = null;
    this.followersNotFriendsWith = null;
    this.followerIds = null;
    this.friendsIds = null;
    this.friendsWhoDontFollowIds = null;
    this.followersNotFriendsWithIds = null;
}

TwitterClient.prototype.broadcast = function (data, msg) {
    this.socketClient.to(this.socketid).emit(msg || "server-update", data);
};

TwitterClient.prototype.init = function(name) {

    if(!name) {
        this.broadcast({
            hasStarted : false,
            pending : false,
            msg: "Please enter a Twitter name..."
        });
        return;
    }

    var params = {
        screen_name : name[0] === "@" ? name.substr(1, name.length) : name,
        count : 5000,
        cursor : "-1",
        skip_status : true,
        include_user_entities : false
    };

    var getData = this.getTwitterIds("/followers/ids.json", params, "Followers");
    getData.then(function (data) {

        this.followerIds = data;
        return this.getTwitterIds("/friends/ids.json", params, "Friends");

    }.bind(this)).then(function (data) {

        this.friendsIds = data;

        if(!this.friendsIds.length || !this.followerIds.length) {
            this.broadcast({
                error : true,
                pending : false,
                hasStarted : false,
                msg : "You don't have enough friends or followers yet to use this tool unfortunately."
            });
        }
        else {
            this.broadcast({
                msg : "Checking your data..."
            });
            this.calculateFriendsWhoDontFollow();
        }

    }.bind(this)).catch(function () {
        console.log("Error - most likely an incorrect username or incorrect Twitter config details.");
        this.broadcast({
            error : true,
            pending : false,
            hasStarted : false,
            msg : "There was an error retrieving user data. Please try again."
        });
    }.bind(this));

};

TwitterClient.prototype.getTwitterIds = function(url, params, desc) {

    return new Promise(function(resolve, reject) {

        client.get(url, params, function(error, data) {
            if (!error) {
                this.broadcast({
                    msg: desc + " data found..."
                });
                if(data.next_cursor) {
                    console.log("More user data available", desc);
                }
                resolve(data.ids);
            }
            else {
                this.broadcast({
                    error : true,
                    pending : false,
                    hasStarted : false,
                    msg : error[0].message.replace("that page", "that user") + " Please try again."
                });
                reject();
            }
        }.bind(this));

    }.bind(this));

};

TwitterClient.prototype.calculateFriendsWhoDontFollow = function () {

    this.friendsWhoDontFollowIds = this.friendsIds.filter(function(id) {
        return this.followerIds.indexOf(id) === -1;
    }.bind(this));

    this.broadcast({
        msg : "Found friends who don't follow (" + this.friendsWhoDontFollowIds.length + ")"
    });

    this.calculateFollowersNotFriendsWith();

};

TwitterClient.prototype.calculateFollowersNotFriendsWith = function () {

    this.followersNotFriendsWithIds = this.followerIds.filter(function(id) {
        return this.friendsIds.indexOf(id) === -1;
    }.bind(this));

    this.broadcast({
        msg : "Found followers not friends with (" + this.followersNotFriendsWithIds.length + ")"
    });

    this.createUserLists();

};

TwitterClient.prototype.createUserLists = function() {

    var params = {
        count : 100,
        include_user_entities : false
    };

    this.broadcast({
        msg : "Getting data on friends who don't follow. This could take some time..."
    });

    var getUsers = new Promise(function (resolve, reject) {
        this.getUserData(params, [], this.friendsWhoDontFollowIds, resolve, reject);
    }.bind(this));

    getUsers.then(function (data) {

        this.friendsWhoDontFollow = data;
        this.broadcast({
            msg : "Getting data on followers you're not friends with. Please be patient..."
        });

        return new Promise(function (resolve, reject) {
            this.getUserData(params, [], this.followersNotFriendsWithIds, resolve, reject);
        }.bind(this));

    }.bind(this)).then(function(data) {

        this.followersNotFriendsWith = data;

        this.broadcast({
            msg : "Crunching data, please wait a second or two..."
        });

        this.broadcast({
            friendCount : this.friendsIds.length,
            followerCount : this.followerIds.length,
            friendsWhoDontFollow : this.friendsWhoDontFollow,
            followersNotFriendsWith : this.followersNotFriendsWith
        }, "all-data-loaded");

    }.bind(this)).catch(function () {
        console.log("Error retrieving user data");
        this.broadcast({
            error : true,
            pending : false,
            hasStarted : false,
            msg : "There was an error retrieving user data. Please try again."
        });
    }.bind(this));
};

TwitterClient.prototype.getUserData = function (params, arrTo, arrFrom, resolve, reject) {

    var payload = arrFrom.slice(0, 100);
    if(arrFrom.length > 100) {
        arrFrom = arrFrom.slice(100, arrFrom.length);
    }
    else {
        arrFrom = [];
    }

    params.user_id = payload.join();

    client.get("/users/lookup.json", params, function(error, data) {
        if (!error) {
            arrTo = arrTo.concat(data);
            if(arrFrom.length) {
                this.getUserData(params, arrTo, arrFrom, resolve, reject);
            }
            else {
                resolve(arrTo);
            }
        }
        else {
            this.broadcast({
                error : true,
                pending : false,
                hasStarted : false,
                msg : error[0].message + " Please try again."
            });
            reject();
        }
    }.bind(this));

};

TwitterClient.prototype.follow = function (id) {
    client.post("/friendships/create.json", { user_id : id, follow : true }, function(error, data) {
        if(!error) {
            this.broadcast({
                msg : "User followed!"
            });
            this.broadcast({}, "user-followed");
        }
        else {
            this.broadcast({
                msg : "There's been an error. Please try again."
            });
            console.log(error);
        }
    }.bind(this));
};

TwitterClient.prototype.unfollow = function (id) {
    client.post("/friendships/destroy.json", { user_id : id }, function(error, data) {
        if(!error) {
            this.broadcast({
                msg : "User unfollowed!"
            });
            this.broadcast({}, "user-unfollowed");
        }
        else {
            this.broadcast({
                msg : "There's been an error. Please try again."
            });
            console.log(error);
        }
    }.bind(this));
};

module.exports = TwitterClient;