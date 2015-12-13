import React from "react";
import Events from "js/events";
import Animator from "js/animator.min";
import "styles/login.css";

export default class ScreenNameForm extends React.Component {

    constructor() {
        super();
        Events.subscribe("re-enable-login", this.reset.bind(this));
        Events.subscribe("show-login", this.show.bind(this));
    }

    show() {

        let input = React.findDOMNode(this.refs.screenNameInput);
        let button = React.findDOMNode(this.refs.submit);
        let label = React.findDOMNode(this.refs.screenNameLabel);

        Animator.setStyles(input, {
            opacity : 0,
            display : "block"
        });

        Animator.setStyles(button, {
            opacity : 0,
            width : "1px",
            height : "1px",
            display : "block"
        });

        Animator.setStyles(label, Animator.createCSSRule(["opacity", Animator.getPrefix("animation-duration")], [0, "500ms"]));

        Animator.createTransition({
            element : input,
            properties : "opacity",
            duration : "500ms",
            easing : "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        });

        Animator.createTransition({
            element : button,
            properties : ["width", "height", "opacity", "background-color"],
            duration : ["800ms", "700ms", "800ms", "1s"],
            easing : "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        });

        let sequence = Animator.combo([Animator.transition({
            element : input,
            properties : "opacity",
            setStyles : {
                before : {
                    opacity : 1
                }
            }
        }), Animator.animation({
            element: input,
            addClass: {
                before: "rubberBand"
            },
            removeClass: {
                after: "rubberBand"
            }
        })]);

        sequence.then(function () {
            return Animator.animation({
                element: label,
                addClass: {
                    before: "slideInUp"
                },
                removeClass: {
                    after: "slideInUp"
                },
                setStyles : {
                    before : {
                        opacity : 1
                    }
                }
            });
        }).then(function () {
            return Animator.transition({
                element: button,
                properties: ["width", "height", "opacity"],
                setStyles: {
                    before: {
                        width: "100%",
                        height: "40px",
                        opacity: 1
                    }
                }
            });
        }).then(function() {
            input.focus();
        });

    }

    reset() {

        let input = React.findDOMNode(this.refs.screenNameInput);
        let btn = React.findDOMNode(this.refs.submit);
        input.removeAttribute("readonly");
        btn.removeAttribute("disabled");
        input.value = "";
        input.focus();
    }

    submit(evt) {

        evt.preventDefault();
        let input = React.findDOMNode(this.refs.screenNameInput);

        function onInvalidInput() {
            Events.publish("state-update", {
                msg : "Please enter a Twitter name..."
            });
            input.focus();
        }

        if(input.value.length) {

            if(input.value.length === 1 && input.value[0] !== "@" || input.value.length > 1) {
                React.findDOMNode(this.refs.submit).setAttribute("disabled", "disabled");
                input.setAttribute("readonly", "readonly");
                Events.publish("state-update", {
                    error : false,
                    hasStarted : true,
                    pending : true,
                    msg : "Searching for username..."
                });
                Events.publish("user-name-entered", input.value);
            }
            else {
                onInvalidInput();
            }

        }
        else {
            onInvalidInput();
        }

    }

    render() {

        return (
            <form onSubmit={this.submit.bind(this)}>
                <div className="form-group" ref="form" id="loginForm">
                    <input type="text" className="form-control animated" id="screenName" ref="screenNameInput" placeholder="Your Twitter name" />
                    <label ref="screenNameLabel" className="animated" htmlFor="screenName">Your Twitter name e.g. @Your_Twitter_Handle</label>
                </div>
                <button type="submit" id="submit" ref="submit" className="btn btn-default">Search!</button>
            </form>
        );

    }

}