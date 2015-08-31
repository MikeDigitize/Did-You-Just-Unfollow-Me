import React from "react";
import Events from "js/events";
import Animator from "js/animator.min";
import "styles/header.css";

export default class Header extends React.Component {

    constructor() {
        super(...arguments);
        this.state = {
            title : ["Did", "You", "Just", "Unfollow", "Me!?"]
        }
    }

    componentDidMount() {

        let header = document.querySelector("#header");
        let text = Array.from(React.findDOMNode(this.refs.title).querySelectorAll(".page-title"));
        let subtitle = React.findDOMNode(this.refs.subtitle);

        Animator.setStyles(header, {
            opacity : 0,
            "background-color" : "#F9F9F9"
        });

        Animator.setStyles(subtitle, {
            opacity : 0
        });

        Animator.addClass(text, "animated");

        Animator.createTransition({
            element : header,
            properties : ["opacity", "background-color"],
            duration : ["250ms", "500ms"],
            easing : "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        });

        Animator.createTransition({
            element : subtitle,
            properties : "opacity",
            duration : "750ms",
            easing : "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        });

        let sequence = Animator.transition({
            element : header,
            properties : ["opacity", "background-color"],
            setStyles : {
                before : {
                    "opacity" : 1,
                    "background-color" : "#55ACEE"
                }
            }
        });

        sequence.then(function () {
            Events.publish("show-login");
            return Animator.combo([
                Animator.animation({
                    element : text[0],
                    setStyles : {
                        before : {
                            opacity : 1
                        }
                    },
                    addClass : {
                        before : "bounceInLeft"
                    }
                }),
                Animator.animation({
                    element : text[1],
                    setStyles : {
                        before : {
                            opacity : 1
                        }
                    },
                    addClass : {
                        before : "bounceInUp"
                    }
                }),
                Animator.animation({
                    element : text[2],
                    setStyles : {
                        before : {
                            opacity : 1
                        }
                    },
                    addClass : {
                        before : "bounceInDown"
                    }
                }),
                Animator.animation({
                    element : text[3],
                    setStyles : {
                        before : {
                            opacity : 1
                        }
                    },
                    addClass : {
                        before : "bounceInLeft"
                    }
                }),
                Animator.animation({
                    element : text[4],
                    setStyles : {
                        before : {
                            opacity : 1
                        }
                    },
                    addClass : {
                        before : "bounceInRight"
                    }
                })
            ])
        }).then(function() {
            return Animator.transition({
                element : subtitle,
                properties : "opacity",
                setStyles : {
                    before : {
                        "opacity" : 1
                    }
                }
            });
        });

    }

    render() {
        return (
            <header className="col-xs-12">
                <h1 ref="title">
                    <span className="page-title">{ this.state.title[0] }</span> <span className="page-title">{ this.state.title[1] }</span> <span className="page-title">{ this.state.title[2] }</span> <span className="page-title">{ this.state.title[3] }</span> <span className="page-title">{ this.state.title[4] }</span>
                </h1>
                <p ref="subtitle">A tool to find which of your Twitter friends don't follow you and which of your followers you're not friends with.</p>
            </header>
        );
    }

}