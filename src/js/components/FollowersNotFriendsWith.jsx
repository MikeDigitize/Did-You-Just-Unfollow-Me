import React from "react";
import Events from "js/events";
import Format from "js/number-formatter";
import NavBtnsRow from "./NavButtonsRow.jsx";
import ResultsSelect from "./ResultsSelect.jsx";
import Modal from "./Modal.jsx";
import "styles/tables.css";

export default class FNFWTable extends React.Component {

    constructor() {

        super(...arguments);
        this.state = {
            followersNotFriendsWith : [],
            usersToDisplay : [],
            page : 0,
            results : 3,
            maxPage : 0,
            displaying : {
                min : 0,
                max : 0
            }
        };

        Events.subscribe("create-dom", (data) => {

            let usersToDisplay = this.getUsersToDisplay(data.followersNotFriendsWith);
            let maxPage = Math.floor(data.followersNotFriendsWith.length / this.state.results);
            if(data.followersNotFriendsWith.length % this.state.results === 0) {
                maxPage--;
            }

            this.setState({
                followersNotFriendsWith : data.followersNotFriendsWith,
                usersToDisplay : usersToDisplay,
                maxPage : maxPage
            });

        });

        Events.subscribe("user-followed", () => {
            Events.publish("info-update", { desc : "user-followed", data : this.state.followersNotFriendsWith });
        });

    }

    setData(page) {
        this.setState({
            page : page
        }, () => {
            let usersToDisplay = this.getUsersToDisplay(this.state.followersNotFriendsWith);
            this.setState({
                usersToDisplay : usersToDisplay
            })
        });
    }

    getUsersToDisplay(followersNotFriendsWith) {
        let max = (this.state.page + 1) * this.state.results;
        let min = this.state.page * this.state.results;

        if(max > followersNotFriendsWith.length) {
            max = followersNotFriendsWith.length;
        }

        this.setState({
            displaying : {
                min : min,
                max : max
            }
        });

        return followersNotFriendsWith.slice(min, max);
    }

    nextPage() {
        let page = this.state.page;
        if(page === this.state.maxPage) {
            page = 0;
        }
        else {
            page++;
        }
        this.setData(page);
    }

    prevPage() {
        let page = this.state.page;
        if(page === 0) {
            page = this.state.maxPage;
        }
        else {
            page--;
        }
        this.setData(page);
    }

    followFollower(evt) {

        let id = (evt.target || evt.srcElement).getAttribute("data-id");
        let user = this.state.followersNotFriendsWith.filter((user) => {
            return user.id_str === id;
        })[0].name;

        Events.publish("show-follow-modal", { id : id, user : user });

    }

    modalConfirm(allow, id) {

        if(allow) {

            let fnfw = this.state.followersNotFriendsWith.filter((user) => {
                return user.id_str !== id;
            });
            let usersToDisplay = this.getUsersToDisplay(fnfw);
            let maxPage = Math.floor(fnfw.length / this.state.results);
            let page = this.state.page;

            if(fnfw.length % this.state.results === 0) {
                maxPage--;
            }
            if(page > maxPage) {
                page = maxPage;
            }

            this.setState({
                maxPage : maxPage,
                page : page,
                followersNotFriendsWith : fnfw,
                usersToDisplay : usersToDisplay
            }, function () {
                Events.publish("follow-user", id);
            });

        }

    }

    setPageResults() {

        let select = document.querySelector("#followers-select");
        let options = select.options;
        let resultsToDisplay = Number(options[select.selectedIndex].getAttribute("value"));

        let maxPage = Math.floor(this.state.followersNotFriendsWith.length / resultsToDisplay);
        let page = this.state.page;
        if(this.state.followersNotFriendsWith.length % resultsToDisplay === 0) {
            maxPage--;
        }
        if(page > maxPage) {
            page = maxPage;
        }

        this.setState({
            results : resultsToDisplay,
            maxPage : maxPage,
            page : page
        }, () => {
            let usersToDisplay = this.getUsersToDisplay(this.state.followersNotFriendsWith);
            this.setState({
                usersToDisplay : usersToDisplay
            });
        });

    }

    render() {

        let url = "https://twitter.com/";

        if(this.state.usersToDisplay.length) {

            let markup = this.state.usersToDisplay.map((follower, i) => {

                let bkimg = follower.profile_background_image_url_https ? "url(" + follower.profile_background_image_url_https + ") top center / cover no-repeat" : "#666";
                let background = { background : bkimg };
                let bimg = follower.profile_banner_url ? "url(" + follower.profile_banner_url + ") top center / cover no-repeat" : "#666";
                let banner = { background : bimg };

                return (
                    <tr key={i} style={background} className="user-row">
                        <td>
                            <div className="profile-banner" style={banner}>
                                <span className="friend-num">{Format((i + 1) + (this.state.page * this.state.results))}</span>
                                <a className="friend-img-link" target="_blank" href={url + follower.screen_name}>
                                    <img className="friend-img" src={follower.profile_image_url} />
                                </a>
                                <span className="friend-name">{follower.name}</span>
                            </div>
                            <div className="friend-info">
                                <div className="col-sm-12">
                                    <a target="_blank" className="friend-handle-link" href={url + follower.screen_name}>
                                        <p className="friend-handle">@{follower.screen_name}</p>
                                    </a>
                                    <p className="friend-location">{ follower.location || "No location" }</p>
                                    <p className="friend-description">{ follower.description || "No description" }</p>
                                    <hr className="hr-wide" />
                                </div>
                                <div className="count-holder row">
                                    <div className="col-xs-6 col-border-right">
                                        <a target="_blank" href={url + follower.screen_name + "/following" }>
                                            <p className="count-title">Friends</p>
                                            <p className="count">{ Format(follower.friends_count) }</p>
                                        </a>
                                    </div>
                                    <div className="col-xs-6">
                                        <a target="_blank" href={url + follower.screen_name + "/followers" }>
                                            <p className="count-title">Followers</p>
                                            <p className="count">{ Format(follower.followers_count) }</p>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-sm-12 btn-holder">
                                    <button className="btn user-btn" data-id={follower.id_str} onClick={this.followFollower.bind(this)}>Follow</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                );

            });

            return (
                <div className="col-xs-12">
                    <h4 className="table-title">Followers you're not friends with</h4>
                    <div className="col-md-8 col-md-offset-2">
                        <div>
                            <div className="col-sm-8 col-sm-offset-2">
                                <div className="col-sm-8 col-sm-offset-2">
                                    <ResultsSelect
                                        setPageResults={this.setPageResults.bind(this)}
                                        min={this.state.displaying.min + 1}
                                        max={this.state.displaying.max}
                                        count = {this.state.followersNotFriendsWith.length}
                                        id="followers-select"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-8 col-sm-offset-2">
                                    <table className="table table-bordered user-table" id="followers">
                                        <thead>
                                        <NavBtnsRow prev={this.prevPage.bind(this)} next={this.nextPage.bind(this)} title="Followers" />
                                        </thead>
                                        <tbody>
                                        { markup }
                                        </tbody>
                                        <tfoot>
                                        <NavBtnsRow prev={this.prevPage.bind(this)} next={this.nextPage.bind(this)} />
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <Modal
                                msg="Are you sure you want to follow userX?"
                                onShow="show-follow-modal"
                                onUserInput={ this.modalConfirm.bind(this) }
                            />
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return false;
        }

    }
}