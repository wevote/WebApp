import React, { Component } from "react";
import { historyPush } from "../../utils/cordovaUtils";
import DonateStore from "../../stores/DonateStore";

let loadingScreenStyles = {
  position: "fixed",
  height: "100vh",
  width: "100vw",
  display: "flex",
  top: 0,
  left: 0,
  backgroundColor: "#4f5f6f",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
  color: "#fff",
  flexDirection: "column",
};

export default class ProcessingDonation extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this._onDonateStoreChange = this._onDonateStoreChange.bind(this);
  }

  componentDidMount () {
    this.donateStoreListener = DonateStore.addListener(this._onDonateStoreChange);
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  _onDonateStoreChange () {
    if (DonateStore.donation_response_received()) {
      if (DonateStore.donation_success()) {
        historyPush("/more/donate_thank_you");
      } else {
        historyPush("/more/donate");
      }
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
