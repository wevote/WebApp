import React, { Component } from "react";
import { Button, InputGroup } from "react-bootstrap";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import VoterStore from "../../stores/VoterStore";
import { extractTwitterHandleFromTextString } from "../../utils/textFormat";

export default class TwitterHandleBox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      twitter_handle: "",
    };
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
    historyPush("/" + twitter_handle);
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
    var { loading } = this.state;
    if (loading){
      return LoadingWheel;
    }
    var twitter_handle_stripped = this.twitterHandleStripped();
    var claim_your_page_button_text = twitter_handle_stripped.length === 0 ? "Claim Your Page" : "Claim @" + twitter_handle_stripped;
    return <div>
      <form onSubmit={this.submitTwitterHandle.bind(this)} className="u-stack--md">
        <InputGroup>
          <input
            type="text"
            onChange={this.updateTwitterHandle.bind(this)}
            name="twitter_handle"
            value={this.state.twitter_handle}
            className="form-control"
            placeholder="Enter your twitter handle"
          />
          <InputGroup.Button>
            <Button
              onClick={this.submitTwitterHandle.bind(this)}
              bsStyle="primary">
              {claim_your_page_button_text}</Button>
          </InputGroup.Button>
        </InputGroup>
      </form>
    </div>;
  }
}
