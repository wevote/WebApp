import { Info } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { HeaderContentContainer } from '../Style/pageLayoutStyles';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import SettingsProfilePicture from './SettingsProfilePicture';
import SettingsWidgetAccountType from './SettingsWidgetAccountType';
import SettingsWidgetFirstLastName from './SettingsWidgetFirstLastName';
import SettingsWidgetOrganizationDescription from './SettingsWidgetOrganizationDescription';
import SettingsWidgetOrganizationWebsite from './SettingsWidgetOrganizationWebsite';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

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
      <HeaderContentContainer>
        <Helmet title="Name & Photo Settings - WeVote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card u-padding-bottom--lg">
          <div className="card-main">
            <HeaderContainer>
              <IdIcon />
              <h1 className="h2">Name &amp; Photo Settings</h1>
            </HeaderContainer>
            <IntroductionWrapper>
              <Info classes={{ root: classes.informationIcon }} />
              We are serious about protecting your information. We are a nonprofit, and will never sell your information.
              {' '}
              <Link id="profileFAQ" to="/more/faq">
                <span className="u-no-break u-link-color">Frequently Asked Questions</span>
              </Link>
            </IntroductionWrapper>
            <div>
              <SettingsProfilePicture />
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
      </HeaderContentContainer>
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

const IntroductionWrapper = styled('div')`
  margin-bottom: 12px;
`;

const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const IdIcon = styled(AccountBoxIcon)`
  color: black;
  height: 23px;
  width: 23px;
  margin: 8px 8px 0px -2px;
`;

export default withStyles(styles)(SettingsProfile);
