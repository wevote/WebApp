import React, { Component } from "react";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import AddFriendsByEmail from "../components/Friends/AddFriendsByEmail";
import AddFriendsByFacebook from "../components/Friends/AddFriendsByFacebook";
import AddFriendsByTwitter from "../components/Friends/AddFriendsByTwitter";
import AddFriendsFilter from "../components/Navigation/AddFriendsFilter";

/* VISUAL DESIGN HERE: https://invis.io/E45246B2C */

export default class Connect extends Component {
	static propTypes = {

	};

	constructor (props) {
		super(props);
    this.state = {
      add_friends_type: "ADD_FRIENDS_BY_EMAIL"
    };
	}

	static getProps () {
		return {};
	}

  changeAddFriendsType (event) {
    this.setState({add_friends_type: event.target.id});
  }

	render () {
		var floatRight = {
			float: "right"
		};
    let add_friends_header;
    let add_friends_html;
    if (this.state.add_friends_type == "ADD_FRIENDS_BY_TWITTER") {
      add_friends_header = "Add Friends By Twitter Handle";
      add_friends_html = <AddFriendsByTwitter />
    } else if (this.state.add_friends_type == "ADD_FRIENDS_BY_FACEBOOK") {
      add_friends_header = "Add Friends From Facebook";
      add_friends_html = <AddFriendsByFacebook />
    } else {
      add_friends_header = "Add Friends By Email";
      add_friends_html = <AddFriendsByEmail />
    }

		return <div>
			<div className="container-fluid well u-gutter__top--small fluff-full1">
        <h4 className="text-left">{add_friends_header}</h4>
        <div className="ballot__filter"><AddFriendsFilter add_friends_type={this.state.add_friends_type}
                                                          changeAddFriendsTypeFunction={this.changeAddFriendsType.bind(this)} /></div>
        {add_friends_html}
        <Link to="/friends">See current friends</Link>
      </div>

			<div className="container-fluid well u-gutter__top--small fluff-full1">
				<h4 className="text-left">Who You Can Follow</h4>
				<span style={floatRight}>
					<Link to="/opinions"><Button bsStyle="primary">Next &#x21AC;</Button></Link>
				</span>
				<p>Find voter guides you can follow. These voter guides have been created by nonprofits, public figures, your friends, and more.<br />
				<br /></p>
        <Link to="/more/opinions/followed">See who you are following</Link>
      </div>

		</div>;
	}
}
