import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import AddressBox from "../../components/AddressBox";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import { isWebApp } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";

export default class SettingsAddress extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      electionsLocationsList: [],
      voterBallotList: [],
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    // Steve March 2018, removed 50 lines of non-functional copied code.  Does the following line and componentDidMount, add value?
    AnalyticsActions.saveActionElections(VoterStore.election_id());
  }

  render () {
    renderLog(__filename);
    return <div>
        <div className="u-stack--md">
          <Helmet title="Enter Address - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="card">
            <div className="card-main">
              <h3 className="h3">
                Enter address where you are registered to vote
              </h3>
              <div className={ isWebApp() ? "u-padding-bottom--md" : "SettingsCardBottomCordova" } >
                <AddressBox {...this.props} saveUrl="/ballot" />
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
}
