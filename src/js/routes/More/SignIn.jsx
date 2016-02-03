import React, { Component } from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";
import { Link } from "react-router";
import FacebookActionCreators from '../../actions/FacebookActionCreators';
import FacebookStore from '../../stores/FacebookStore';
import FacebookDisconnect from '../../components/Facebook/FacebookDisconnect';
import FacebookLogin from '../../components/Facebook/FacebookLogin';
import FacebookLogout from '../../components/Facebook/FacebookLogout';
import FacebookDownloadPicture from '../../components/Facebook/FacebookDownloadPicture';
import FacebookPicture from '../../components/Facebook/FacebookPicture';
import FacebookSignIn from '../../components/Facebook/FacebookSignIn';
import Main from '../../components/Facebook/Main';

{/* VISUAL DESIGN HERE: ??? */}

export default class SignIn extends Component {
	constructor(props) {
		super(props);
        this.state = this.getFacebookState();
	}

    getFacebookState() {
        return {
            accessToken: FacebookStore.accessToken,
            facebookIsLoggedIn: FacebookStore.loggedIn,
            userId: FacebookStore.userId,
            facebookPictureStatus: FacebookStore.facebookPictureStatus,
            facebookPictureUrl: FacebookStore.facebookPictureUrl
        }
    }

    componentDidMount() {
        FacebookActionCreators.initFacebook();
        FacebookStore.addChangeListener(() => this._onFacebookChange());
    }

    componentWillUnmount() {
        FacebookStore.removeChangeListener(this._onFacebookChange);
      }

    _onFacebookChange() {
        this.setState(this.getFacebookState());
    }

	static getProps() {
		return {};
	}

	render() {
	    return (
<div>
	<div className="container-fluid well well-90">
		<h2 className="text-center">Sign In</h2>
		<div className="text-center">
			{!this.state.facebookIsLoggedIn ? <FacebookSignIn /> : null}
			{/* this.state.facebookIsLoggedIn ? <FacebookDisconnect /> : null */}
			<br />

			<Link to="add_friends_confirmed">
				<Button bsStyle="primary">Sign in with Twitter</Button>
			</Link><br />
		</div>
		<br />
		<br />
		<div className="text-center">
			{this.state.facebookIsLoggedIn ? <span>Signed into Facebook <br /></span> : null}
		</div>
	</div>
	<Main />
</div>
		);
	}
}
