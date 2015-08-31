import React from "react";
import Events from "js/events";
import Format from "js/number-formatter";
import Animator from "js/animator.min";
import "styles/info.css";

export default class Info extends React.Component {

    constructor() {

        super(...arguments);
        this.state = {
            followerCount : [],
            friendCount : [],
            friendsWhoDontFollow : [],
            followersNotFriendsWith : [],
            percent : "0%"
        };

        Events.subscribe("create-dom", data => {
            let percent = this.getFollowerCoefficient(data);
            this.setState({
                followerCount : data.followerCount,
                friendCount : data.friendCount,
                friendsWhoDontFollow : data.friendsWhoDontFollow,
                followersNotFriendsWith : data.followersNotFriendsWith,
                percent : percent
            });
        });

        Events.subscribe("info-update", data => {

            if(data.desc === "user-followed") {
                let friendsCount = this.state.friendCount + 1;
                let percent = this.getFollowerCoefficient({
                    followerCount : this.state.followerCount,
                    followersNotFriendsWith : data.data
                });
                this.setState({
                    percent : percent,
                    friendCount : friendsCount,
                    followersNotFriendsWith : data.data
                });
            }
            else {
                let friendsCount = this.state.friendCount - 1;
                this.setState({
                    friendCount : friendsCount,
                    friendsWhoDontFollow : data.data
                });
            }

        });

    }

    componentDidMount() {
        this.show();
    }

    getFollowerCoefficient(data) {
        var diff = data.followerCount - data.followersNotFriendsWith.length;
        var percent = (diff / data.followerCount) * 100;
        return percent.toFixed(2) + "%";
    }

    show() {

        let infoBoxes = React.findDOMNode(this.refs.infoHolder).querySelectorAll(".col-sm-3");
        let percentage = React.findDOMNode(this.refs.infoHolder).querySelector(".percent");
        let styles = {
            opacity : 0
        };
        styles[Animator.getPrefix("animation-duration")] = "500ms";
        Animator.setStyles(infoBoxes, styles);

        Animator.createTransition({
            element : infoBoxes,
            properties : "opacity",
            duration : "300ms",
            easing : "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        });

        Animator.createTransition({
            element : percentage,
            properties : "opacity",
            duration : "800ms",
            easing : "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        });

        let sequence = Animator.combo([Animator.transition({
            element : infoBoxes[0],
            properties : "opacity",
            setStyles : {
                before : {
                    opacity : 1
                }
            }
        }), Animator.animation({
            element: infoBoxes[0],
            addClass: {
                before: "slideInLeft"
            },
            removeClass: {
                after: "slideInLeft"
            }
        })]);

        sequence.then(function() {
            return Animator.combo([Animator.transition({
                element : infoBoxes[1],
                properties : "opacity",
                setStyles : {
                    before : {
                        opacity : 1
                    }
                }
            }), Animator.animation({
                element: infoBoxes[1],
                addClass: {
                    before: "slideInUp"
                },
                removeClass: {
                    after: "slideInUp"
                }
            })]);
        }).then(function () {
            return Animator.combo([Animator.transition({
                element : infoBoxes[2],
                properties : "opacity",
                setStyles : {
                    before : {
                        opacity : 1
                    }
                }
            }), Animator.animation({
                element: infoBoxes[2],
                addClass: {
                    before: "slideInDown"
                },
                removeClass: {
                    after: "slideInDown"
                }
            })]);
        }).then(function () {
            return Animator.combo([Animator.transition({
                element : infoBoxes[3],
                properties : "opacity",
                setStyles : {
                    before : {
                        opacity : 1
                    }
                }
            }), Animator.animation({
                element: infoBoxes[3],
                addClass: {
                    before: "slideInRight"
                },
                removeClass: {
                    after: "slideInRight"
                }
            })]);
        }).then(function () {
            return Animator.transition({
                element : percentage,
                properties : "opacity",
                setStyles : {
                    before : {
                        opacity : 1
                    }
                }
            });
        });

    }

    render() {

        return(
            <div className="info" ref="infoHolder">
                <div className="col-sm-3 col-xs-6 animated">
                    <p>You have <span className="info-value">{ Format(this.state.friendCount) }</span> friends.</p>
                </div>
                <div className="col-sm-3 col-xs-6 animated">
                    <p>You have <span className="info-value">{ Format(this.state.followerCount) }</span> followers.</p>
                </div>
                <div className="col-sm-3 col-xs-6 animated">
                    <p>You have <span className="info-value">{ Format(this.state.friendsWhoDontFollow.length) }</span> { this.state.friendsWhoDontFollow.length > 1 ? "friends" : "friend" } who don't follow you back.</p>
                </div>
                <div className="col-sm-3 col-xs-6 animated">
                    <p>You have <span className="info-value">{ Format(this.state.followersNotFriendsWith.length) }</span> { this.state.followersNotFriendsWith.length > 1 ? "followers" : "follower" } you aren't friends with.</p>
                </div>
                <div className="col-sm-12">
                    <em className="percent">You're friends with { this.state.percent } of your followers.</em>
                </div>
            </div>
        );

    }

}