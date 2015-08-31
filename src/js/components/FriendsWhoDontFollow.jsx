import React from "react";
import Events from "js/events";
import Format from "js/number-formatter";
import NavBtnsRow from "./NavButtonsRow.jsx";
import ResultsSelect from "./ResultsSelect.jsx";
import Modal from "./Modal.jsx";
import "styles/tables.css";

export default class FWDFTable extends React.Component {

    constructor() {

        super(...arguments);
        this.state = {
            friendsWhoDontFollow : [],
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

            let usersToDisplay = this.getUsersToDisplay(data.friendsWhoDontFollow);
            let maxPage = Math.floor(data.friendsWhoDontFollow.length / this.state.results);
            if(data.friendsWhoDontFollow.length % this.state.results === 0) {
                maxPage--;
            }

            this.setState({
                friendsWhoDontFollow : data.friendsWhoDontFollow,
                usersToDisplay : usersToDisplay,
                maxPage : maxPage
            });

        });

        Events.subscribe("user-unfollowed", () => {
            Events.publish("info-update", { desc : "user-unfollowed", data : this.state.friendsWhoDontFollow });
        });

    }

    unfollowFriend(evt) {

        let id = (evt.target || evt.srcElement).getAttribute("data-id");
        let user = this.state.friendsWhoDontFollow.filter((user) => {
            return user.id_str === id;
        })[0].name;

        Events.publish("show-unfollow-modal", { id : id, user : user });

    }

    modalConfirm(allow, id) {

        if(allow) {
            let fwdf = this.state.friendsWhoDontFollow.filter((user) => {
                return user.id_str !== id;
            });
            let usersToDisplay = this.getUsersToDisplay(fwdf);
            let maxPage = Math.floor(fwdf.length / this.state.results);
            let page = this.state.page;

            if(fwdf.length % this.state.results === 0) {
                maxPage--;
            }
            if(page > maxPage) {
                page = maxPage;
            }

            this.setState({
                page : page,
                friendsWhoDontFollow : fwdf,
                usersToDisplay : usersToDisplay
            }, function() {
                Events.publish("unfollow-user", id);
            });

        }

    }

    setData(page) {
        this.setState({
            page : page
        }, () => {
            let usersToDisplay = this.getUsersToDisplay(this.state.friendsWhoDontFollow);
            this.setState({
                usersToDisplay : usersToDisplay
            });
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

    setPageResults(evt) {

        let select = document.querySelector("#friends-select");
        let options = select.options;
        let resultsToDisplay = Number(options[select.selectedIndex].getAttribute("value"));

        let maxPage = Math.floor(this.state.friendsWhoDontFollow.length / resultsToDisplay);
        let page = this.state.page;
        if(this.state.friendsWhoDontFollow.length % resultsToDisplay === 0) {
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
            let usersToDisplay = this.getUsersToDisplay(this.state.friendsWhoDontFollow);
            this.setState({
                usersToDisplay : usersToDisplay
            })
        });

    }

    render() {

        let url = "https://twitter.com/";

        let markup = this.state.usersToDisplay.map((friend, i) => {

            let bkimg = friend.profile_background_image_url_https ? "url(" + friend.profile_background_image_url_https + ") top center / cover no-repeat" : "#666";
            let background = { background : bkimg };
            let bannerImg = friend.profile_banner_url ? "url(" + friend.profile_banner_url + ") top center / cover no-repeat" : "#666";
            let banner = { background : bannerImg };

            return (
                <tr key={i} style={background} className="user-row">
                    <td>
                        <div className="profile-banner" style={banner}>
                            <span className="friend-num">{Format((i + 1) + (this.state.page * this.state.results))}</span>
                            <a target="_blank" className="friend-img-link" href={url + friend.screen_name}>
                                <img className="friend-img" src={friend.profile_image_url} />
                            </a>
                            <span className="friend-name">{friend.name}</span>
                        </div>
                        <div className="friend-info">
                            <div className="col-sm-12">
                                <a target="_blank" className="friend-handle-link" href={url + friend.screen_name}>
                                    <p className="friend-handle">@{friend.screen_name}</p>
                                </a>
                                <p className="friend-location">{ friend.location || "No location" }</p>
                                <p className="friend-description">{ friend.description || "No description" }</p>
                                <hr className="hr-wide" />
                            </div>
                            <div className="count-holder row">
                                <div className="col-xs-6 col-border-right">
                                    <a target="_blank" href={url + friend.screen_name + "/following" }>
                                        <p className="count-title">Friends</p>
                                        <p className="count">{ Format(friend.friends_count) }</p>
                                    </a>
                                </div>
                                <div className="col-xs-6">
                                    <a target="_blank" href={url + friend.screen_name + "/followers" }>
                                        <p className="count-title">Followers</p>
                                        <p className="count">{ Format(friend.followers_count) }</p>
                                    </a>
                                </div>
                            </div>
                            <div className="col-sm-12 btn-holder">
                                <button className="btn user-btn" data-id={friend.id_str} onClick={this.unfollowFriend.bind(this)}>Unfollow</button>
                            </div>
                        </div>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="col-sm-8 col-sm-offset-2">
                        <ResultsSelect
                            setPageResults={this.setPageResults.bind(this)}
                            min={this.state.displaying.min + 1}
                            max={this.state.displaying.max}
                            count = {this.state.friendsWhoDontFollow.length}
                            id="friends-select"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-8 col-sm-offset-2">
                        <table className="table table-bordered user-table">
                            <thead>
                                <NavBtnsRow prev={this.prevPage.bind(this)} next={this.nextPage.bind(this) } title="Friends" />
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
                    msg="Are you sure you want to unfollow userX?"
                    onShow="show-unfollow-modal"
                    onUserInput={ this.modalConfirm.bind(this) }
                    />
            </div>
        );
    }
}