import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import VoterStore from '../../stores/VoterStore';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { extractTwitterHandleFromTextString } from '../../utils/textFormat';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';


export default class TwitterHandleBox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      twitterHandle: '',
    };
  }

  componentDidMount () {
    this.setState({ twitterHandle: VoterStore.getTwitterHandle() });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ twitterHandle: VoterStore.getTwitterHandle(), loading: false });
  }

  submitTwitterHandle = (e) => {
    e.preventDefault();
    let { twitterHandle } = this.state;
    this.setState({ loading: true });
    twitterHandle = extractTwitterHandleFromTextString(twitterHandle);
    historyPush(`/${twitterHandle}`);
  };

  updateTwitterHandle (e) {
    this.setState({
      twitterHandle: e.target.value,
    });
  }

  twitterHandleStripped () {
    const { twitterHandle } = this.state;
    if (twitterHandle === undefined) {
      return '';
    } else {
      return extractTwitterHandleFromTextString(twitterHandle);
    }
  }

  render () {
    renderLog('TwitterHandleBox');  // Set LOG_RENDER_EVENTS to log all renders
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const twitterHandleStripped = this.twitterHandleStripped();
    const claimYourPageButtonText = twitterHandleStripped.length === 0 ? 'Claim Your Page' : `Claim @${twitterHandleStripped}`;
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
