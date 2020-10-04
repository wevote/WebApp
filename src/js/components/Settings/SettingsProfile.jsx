import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Info } from '@material-ui/icons';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import SettingsWidgetAccountType from './SettingsWidgetAccountType';
import SettingsWidgetFirstLastName from './SettingsWidgetFirstLastName';
import SettingsWidgetOrganizationDescription from './SettingsWidgetOrganizationDescription';
import SettingsWidgetOrganizationWebsite from './SettingsWidgetOrganizationWebsite';
import VoterStore from '../../stores/VoterStore';


class SettingsProfile extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
  };

  render () {
    renderLog('SettingsProfile');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, externalUniqueId } = this.props;

    if (!this.state.voter) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <Helmet title="General Settings - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card u-padding-bottom--lg">
          <div className="card-main">
            <h1 className="h2">General Settings</h1>
            <IntroductionWrapper>
              <Info classes={{ root: classes.informationIcon }} />
              We are serious about protecting your information. We are a nonprofit, and will never sell your information.
              {' '}
              <Link id="profileFAQ" to="/more/faq">
                <span className="u-no-break u-link-color">Frequently Asked Questions</span>
              </Link>
            </IntroductionWrapper>
            <div>
              <SettingsWidgetFirstLastName externalUniqueId={externalUniqueId} />
              <SettingsWidgetOrganizationWebsite externalUniqueId={externalUniqueId} />
              <SettingsWidgetOrganizationDescription externalUniqueId={externalUniqueId} />
              <SettingsWidgetAccountType
                externalUniqueId={externalUniqueId}
                closeEditFormOnChoice
                showEditToggleOption
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
SettingsProfile.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
});

const IntroductionWrapper = styled.div`
`;

export default withStyles(styles)(SettingsProfile);
