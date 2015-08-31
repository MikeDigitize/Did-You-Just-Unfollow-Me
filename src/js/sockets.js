import Events from "js/events";

class Sockets {

    constructor() {
        this.socket = io();
        this.socket.on("userid", this.onUserId.bind(this));
        this.socket.on("server-update", this.onServerUpdate.bind(this));
        this.socket.on("all-data-loaded", this.onDataLoaded.bind(this));
        this.socket.on("user-followed", this.onUserFollow.bind(this));
        this.socket.on("user-unfollowed", this.onUserUnfollow.bind(this));
        Events.subscribe("user-name-entered", this.onUserNameEntered.bind(this));
        Events.subscribe("follow-user", this.onFollowUser.bind(this));
        Events.subscribe("unfollow-user", this.onUnfollowUser.bind(this));

    }

    onUserId(data) {
        console.log("socket id", data);
    }

    onServerUpdate(data) {
        Events.publish("state-update", data);
    }

    onUserNameEntered(data) {
        this.socket.emit("user-name-entered", data);
    }

    onFollowUser(data) {
        this.socket.emit("follow-user", data);
    }

    onUnfollowUser(data) {
        this.socket.emit("unfollow-user", data);
    }

    onUserFollow() {
        Events.publish("user-followed");
    }

    onUserUnfollow() {
        Events.publish("user-unfollowed");
    }

    onDataLoaded(data) {
        Events.publish("all-data-loaded", data);
    }

}

let sockets = new Sockets();
export default sockets;