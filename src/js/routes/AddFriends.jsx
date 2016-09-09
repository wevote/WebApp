import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../components/LoadingWheel";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479679 */
export default class AddFriends extends Component {
  static propTypes = {
  };

  constructor (props) {
      super(props);
      this.state = {
        redirect_url_upon_save: "/friends/sign_in",
        loading: false,
        voter: {}
      };
  }

  componentDidMount () {
    this.setState({ voter: VoterStore.getVoter() });
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  _ballotLoaded (){
    browserHistory.push(this.state.redirect_url_upon_save);
  }

  updateVoterAddress (e) {
    this.setState({
      voter_address: e.target.value
    });
  }

  saveVoterAddress (e) {
    e.preventDefault();
    var { voter_address } = this.state;
    VoterActions.saveAddress(voter_address);
    this.setState({loading: true});
  }

	render () {
    var { loading, voter } = this.state;
    if (loading){
      return LoadingWheel;
    }
    var floatRight = {
        float: "right"
    };
    let voter_is_signed_in = voter !== undefined ? voter.signed_in_personal : false;

    console.log("voter:", voter);
		return <div className="container-fluid well u-gutter__top--small fluff-full1">
      <h2 className="text-center">Add Friends</h2>
      <form onSubmit={this.saveVoterAddress.bind(this)}>
      <div>
        <Input type="text" addonBefore="@" name="email_address" className="form-control"
             placeholder="Enter email addresses here, separated by commas" />
        <div>These friends will see what you support, oppose, and which opinions you follow.
          We will never sell your email.</div>
        <br />
        <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
        <input type="text" name="add_friends_message" className="form-control"
             defaultValue="Please join me in preparing for the upcoming election." /><br />
      </div>
      </form>

      <div className="u-gutter__top--small">
        <ButtonToolbar bsClass="btn-toolbar">
          <span style={floatRight}>
            <Button
              onClick={this.saveVoterAddress.bind(this)}
              bsStyle="primary">
              { voter_is_signed_in ?
                <span>Send &gt;</span> :
                <span>Next &gt;</span>
              }
            </Button>
          </span>
        </ButtonToolbar>
      </div>
		</div>;
	}
}
