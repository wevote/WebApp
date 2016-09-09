import React, { Component } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../../components/LoadingWheel";
import VoterStore from "../../stores/VoterStore";
import { extractTwitterHandleFromTextString } from "../../utils/textFormat";

export default class TwitterHandleBox extends Component {
  constructor (props) {
      super(props);
      this.state = { loading: false };
  }

  componentDidMount () {
    this.setState({ twitter_handle: VoterStore.getTwitterHandle() });
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ twitter_handle: VoterStore.getTwitterHandle(), loading: false });
  }

  updateTwitterHandle (e) {
    this.setState({
      twitter_handle: e.target.value
    });
  }

  submitTwitterHandle (e) {
    e.preventDefault();
    var { twitter_handle } = this.state;
    this.setState({loading: true});
    twitter_handle = extractTwitterHandleFromTextString(twitter_handle);
    browserHistory.push("/" + twitter_handle);
  }

  twitterHandleStripped () {
    var { twitter_handle } = this.state;
    if (twitter_handle === undefined) {
      return "";
    } else {
      return extractTwitterHandleFromTextString(twitter_handle);
    }
  }

  render () {
    var { loading, twitter_handle } = this.state;
    if (loading){
      return LoadingWheel;
    }
    var floatRight = {
        float: "right"
    };
    var twitter_handle_stripped = this.twitterHandleStripped();
    var claim_your_page_button_text = twitter_handle_stripped.length === 0 ? "Claim Your Page" : "Claim @" + twitter_handle_stripped;
    return <div>
        <form onSubmit={this.submitTwitterHandle.bind(this)}>
        <input
          type="text"
          onChange={this.updateTwitterHandle.bind(this)}
          name="twitter_handle"
          value={twitter_handle}
          className="form-control"
          placeholder="Enter your twitter handle"
        />
        </form>

        <div className="u-gutter__top--small">
          <ButtonToolbar bsClass="btn-toolbar">
            <span style={floatRight}>
              <Button
                onClick={this.submitTwitterHandle.bind(this)}
                bsStyle="primary">
                {claim_your_page_button_text}</Button>
            </span>
          </ButtonToolbar>
        </div>
      </div>;
  }
}
