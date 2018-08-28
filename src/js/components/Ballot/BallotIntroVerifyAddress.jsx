import React, { Component } from "react";
import PropTypes from "prop-types";
import AddressBox from "../../components/AddressBox";
import { isWebApp } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";

export default class BallotIntroVerifyAddress extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    toggleSelectAddressModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    renderLog(__filename);

    return <div className="intro-modal">
      <div className="intro-modal__h1">Verify your Address</div>
      <div className="intro-modal__h3">Please enter your full address so we can look up your full ballot.</div>
      <div className={ isWebApp() ? "u-padding-bottom--md" : "SettingsCardBottomCordova" } >
        <AddressBox {...this.props} saveUrl="/ballot" waitingMessage="Thank you! Click 'See Your Ballot' below." disableAutoFocus />
      </div>

      <div className="intro-modal__h2"><br /></div>
      <div className="intro-modal__button-wrap">
        <button type="button" className="btn btn-success intro-modal__button" onClick={this.props.next}>See Your Ballot&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
