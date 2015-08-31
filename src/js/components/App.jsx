import React from "react";
import TwitterApp from "./TwitterApp.jsx";
import Sockets from "js/sockets";
import Header from "./Header.jsx";

import "styles/bootstrap.min.css";
import "styles/animate.css";

React.render(<TwitterApp />, document.getElementById("twitterApp"));
React.render(<Header />, document.getElementById("header"));