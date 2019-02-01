import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";
import { extractTwitterHandleFromTextString } from "../../utils/textFormat";


export default class TwitterHandleBox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      twitterHandle: "",
    };
  }

  componentDidMount () {
    this.setState({ twitterHandle: VoterStore.getTwitterHandle() });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  submitTwitterHandle = (e) => {
    e.preventDefault();
    let { twitterHandle } = this.state;
    this.setState({ loading: true });
    twitterHandle = extractTwitterHandleFromTextString(twitterHandle);
    historyPush(`/${twitterHandle}`);
  }

  onVoterStoreChange () {
    this.setState({ twitterHandle: VoterStore.getTwitterHandle(), loading: false });
  }

  updateTwitterHandle (e) {
    this.setState({
      twitterHandle: e.target.value,
    });
  }

  twitterHandleStripped () {
    const { twitterHandle } = this.state;
    if (twitterHandle === undefined) {
      return "";
    } else {
      return extractTwitterHandleFromTextString(twitterHandle);
    }
  }

  render () {
    renderLog(__filename);
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const twitterHandleStripped = this.twitterHandleStripped();
    const claimYourPageButtonText = twitterHandleStripped.length === 0 ? "Claim Your Page" : `Claim @${twitterHandleStripped}`;
    return (
      <div>
        <form onSubmit={this.submitTwitterHandle.bind(this)} className="u-stack--md">
          <input
            type="text"
            onChange={this.updateTwitterHandle.bind(this)}
            name="twitterHandle"
            value={this.state.twitterHandle}
            className="form-control"
            placeholder="Enter your twitter handle"
          />
          <Button
            onClick={this.submitTwitterHandle}
            variant="primary"
          >
            {claimYourPageButtonText}
          </Button>
        </form>
      </div>
    );
  }
}
