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
        <div className="modal fade" id="signinModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="model-title">Sign in</h4>
              </div>
              <div className="modal-body">
                  {!this.state.facebookIsLoggedIn ? <FacebookSignIn /> : null}
                  {/* this.state.facebookIsLoggedIn ? <FacebookDisconnect /> : null */}
                  <Link to="add_friends_confirmed" className="btn btn-block btn-social btn-lg btn-twitter">
                      <i className="fa fa-twitter"></i>Sign in with Twitter
                  </Link>
                  <Link to="add_friends_confirmed" className="btn btn-block btn-social btn-lg btn-google">
                      <i className="fa fa-google"></i>Sign in with Google
                  </Link>
              </div>
            </div>
          </div>
        </div>
		);
	}
}
