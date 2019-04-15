import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import SettingsWidgetAccountType from '../../components/Settings/SettingsWidgetAccountType';

export default class VoterGuideOrganizationType extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount () {
    document.body.style.backgroundColor = '#A3A3A3';
    document.body.className = 'story-view';
  }

  componentDidMount () {
    // AnalyticsActions.saveActionVoterGuideGetStarted(VoterStore.electionId());
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = '';
    this.timer = null;
  }

  goToBallotLink = () => {
    const sampleBallotLink = '/ballot';
    historyPush(sampleBallotLink);
  }

  goToOrganizationInfo = () => {
    historyPush('/voterguideorginfo');
  }


  render () {
    renderLog(__filename);

    return (
      <div>
        <Helmet title="Type of Profile - We Vote" />
        <div className="intro-story container well u-inset--md">
          <a href="/voterguideorgtype" onClick={this.goToBallotLink}>
            <img src={cordovaDot('/img/global/icons/x-close.png')} className="x-close" alt="close" />
          </a>
          <div className="create-voter-guide__h1 xs-text-left">Create Your Voter Guide</div>
          <div className="create-voter-guide__steps xs-text-left">
            Step 2 of 5
          </div>
          <div className="row">
            <div className="col-sm-2 col-xs-1">&nbsp;</div>
            <div className="col-sm-8 col-xs-10">
              <p className="u-stack--md" />
              <SettingsWidgetAccountType editFormOpen />
            </div>
            <div className="col-sm-2 col-xs-1">&nbsp;</div>
          </div>
          <footer className="create-voter-guide__footer">
            <button
              type="button"
              className="btn btn-lg btn-success"
              onClick={this.goToOrganizationInfo}
            >
              Next&nbsp;&nbsp;&gt;
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
