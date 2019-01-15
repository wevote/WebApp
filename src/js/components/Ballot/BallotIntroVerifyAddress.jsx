import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import AddressBox from "../AddressBox";
import { isWebApp } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";

export default class BallotIntroVerifyAddress extends Component {
  static propTypes = {
    manualFocus: PropTypes.bool,
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

    return (
      <div className="intro-modal">
        <div className="intro-modal__h1">Verify your Address</div>
        <div className="intro-modal__top-description">Please enter your full address so we can look up your full ballot.</div>
        <div className={isWebApp() ? "intro-modal__address-box u-padding-bottom--md" : "SettingsCardBottomCordova"}>
          <AddressBox {...this.props} saveUrl="/ballot" waitingMessage="Thank you! Click 'See Your Ballot' below." disableAutoFocus />
        </div>
        <div className="u-flex-auto" />
        <div className="intro-modal__button-wrap">
          <Button variant="contained" color="secondary" onClick={this.props.next}>See Your Ballot</Button>
        </div>
      </div>
    );
  }
}
