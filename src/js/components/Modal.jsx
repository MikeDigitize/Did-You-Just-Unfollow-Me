import React from "react";
import Events from "js/events";
import Animator from "js/animator.min";
import "styles/modal.css";

export default class Modal extends React.Component {

    constructor() {
        super(...arguments);
        this.state = {
            allowClick : true,
            msg : this.props.msg
        };
        Events.subscribe(this.props.onShow, this.show.bind(this));
    }

    show(data) {

        if(this.state.allowClick) {

            let msg = this.state.msg.replace("userX", data.user);

            this.setState({
                allowClick : false,
                currentId : data.id,
                username : data.user,
                msg : msg
            });

            let modal = React.findDOMNode(this.refs.modal);
            let overlay = document.createElement("div");
            overlay.classList.add("overlay");
            overlay.addEventListener("click", this.confirm.bind(this, false), false);

            Animator.createTransition({
                element : overlay,
                properties : "opacity",
                duration : "800ms",
                easing : "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
            });

            Animator.setStyles(overlay, {
                height : document.documentElement.offsetHeight + "px"
            });

            document.body.insertBefore(overlay, document.body.firstChild);

            let sequence = Animator.combo([
                Animator.transition({
                    element : overlay,
                    properties : "opacity",
                    setStyles : {
                        before : {
                            opacity : 1
                        }
                    }
                }),
                Animator.animation({
                    element : modal,
                    setStyles : {
                        before : {
                            top : "35%"
                        }
                    },
                    addClass : {
                        before : "bounceInDown"
                    },
                    removeClass : {
                        after : "bounceInDown"
                    }
                })
            ]);

            sequence.then(function () {
                this.setState({
                    allowClick : true
                });
            }.bind(this));

        }

    }

    hide() {

        if(this.state.allowClick) {

            this.setState({
                allowClick : false
            });

            let modal = React.findDOMNode(this.refs.modal);
            let overlay = document.querySelector(".overlay");
            let msg = this.state.msg.replace(this.state.username, "userX");

            let sequence = Animator.combo([
                Animator.animation({
                    element : modal,
                    setStyles : {
                        after : {
                            top : "-350px"
                        }
                    },
                    addClass : {
                        before : "bounceOutUp"
                    },
                    removeClass : {
                        after : "bounceOutUp"
                    }
                }),
                Animator.transition({
                    element : overlay,
                    properties : "opacity",
                    setStyles : {
                        before : {
                            opacity : 0
                        }
                    }
                })
            ]);

            sequence.then(function () {
                document.body.removeChild(overlay);
                this.setState({
                    allowClick : true,
                    msg : msg
                });
            }.bind(this));

        }

    }

    confirm(allow) {
        this.hide();
        this.props.onUserInput(allow, this.state.currentId);
    }

    render() {
        return (
            <div className="action-modal animated" ref="modal">
                <div className="row">
                    <div className="col-xs-12">
                        <h3>Are You Sure?</h3>
                        <p>{ this.state.msg }</p>
                    </div>
                    <div className="col-xs-6">
                        <button className="btn modal-btn-confirm" onClick={this.confirm.bind(this, true)}>Confirm</button>
                    </div>
                    <div className="col-xs-6">
                        <button className="btn modal-btn-cancel" onClick={this.confirm.bind(this, false)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}