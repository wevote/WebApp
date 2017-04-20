import React, {Component} from "react";
import { browserHistory } from "react-router";
import DonateStore from "../../stores/DonateStore";

var loadingScreenStyles = {
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
  flexDirection: "column"
};

export default class ProcessingDonation extends Component {
  constructor (props) {
    super(props);

    this.state = {
      donation_response_received: false,
      donation_success: false
    };

    this._onDonateStoreChange = this._onDonateStoreChange.bind(this);
  }

  componentDidMount () {
//    this._onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this._onDonateStoreChange);

  }

  componentWillUnmount (){
    this.donateStoreListener.remove();
  }

  _onDonateStoreChange () {
     this.setState({donation_response_received: DonateStore.donation_response_received(), donation_success: DonateStore.donation_success()});
    }


  render () {
    if (this.state.donation_response_received) {
      if (this.state.donation_success) {
        browserHistory.push("/more/donate_thank_you");
      } else {
        browserHistory.push("/more/donate");
      }
    }

    return <div style={loadingScreenStyles}>
      <div>
        <h1 className="h1">Processing your Donation...</h1>
        <div className="u-loading-spinner u-loading-spinner--light" />
      </div>
    </div>;
  }
}
