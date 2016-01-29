import React from "react";
import Events from "js/events";
import Info from "./Info.jsx";
import Login from "./Login.jsx";
import FriendsWhoDontFollow from "./FriendsWhoDontFollow.jsx";
import FollowersNotFriendsWith from "./FollowersNotFriendsWith.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

import "styles/app.css";

export default class TwitterApp extends React.Component {

    constructor() {

        super(...arguments);
        this.state = {
            hasStarted : false,
            error : false,
            pending : false,
            msg : null
        };

        Events.subscribe("state-update", this.onStateUpdate.bind(this));
        Events.subscribe("all-data-loaded", this.onAllDataLoaded.bind(this));

    }

    onStateUpdate(data) {

        let newState = {};
        newState.error = data.error !== undefined ? data.error : this.state.error;
        newState.pending = data.pending !== undefined ? data.pending : this.state.pending;
        newState.hasStarted = data.hasStarted !== undefined ? data.hasStarted : this.state.hasStarted;
        newState.msg = data.msg !== undefined ? data.msg : this.state.msg;

        this.setState(newState);

        if(data.error) {
            Events.publish("re-enable-login");
        }

    }

    onAllDataLoaded(data) {
        this.setState({
            hasStarted : true,
            error : false,
            pending : false,
            msg : "Loaded!"
        }, function() {
            Events.publish("create-dom", data);
        });
    }

    render() {

        let display;

        if(this.state.error || !this.state.hasStarted) {
            display = (
                <div>
                    <div className="col-md-6 col-md-offset-3">
                        <Login />
                        <p className="state-msg">{this.state.msg}</p>
                    </div>
                </div>
            );
        }
        else if(this.state.pending) {
            display = (
                <div>
                    <div className="col-md-6 col-md-offset-3">
                        <Login />
                        <p className="state-msg">{this.state.msg}</p>
                        <LoadingSpinner />
                    </div>
                </div>
            );
        }
        else {
            display = (
                <div>
                    <div className="col-md-6 col-md-offset-3">
                        <Login />
                        <p className="state-msg">{this.state.msg}</p>
                    </div>
                    <div className="col-md-8 col-md-offset-2">
                        <Info />
                    </div>
                    <FriendsWhoDontFollow />
                    <FollowersNotFriendsWith />
                </div>
            );
        }

        return (<div>{display}</div>);
    }

}