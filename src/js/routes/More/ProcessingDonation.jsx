import React, {Component} from "react";

export default class ProcessingDonation extends Component {
  constructor (props) {
    super(props);

  }

  ComponentDidMount () {
    this.donateStoreListener = DonateStore.addListener(this._onDonateStoreChange.bind(this));
  }

  _onDonateStoreChange () {
    if(DonateStore.donation_success) {
      browserHistory.push("/more/donate_thank_you");
    } else {
      browserHistory.push("/more/donate");
    }
  }

  render () {
    return <div style={loadingScreenStyles}>
      <div>
        <h1 className="h1">Processing your Donation...</h1>
        <div className="u-loading-spinner u-loading-spinner--light" />
      </div>
    </div>;
  }
}
