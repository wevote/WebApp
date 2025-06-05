import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import VoterSessionActions from '../../actions/VoterSessionActions';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { ImportContactsOutlined, AccountBoxRounded, Lock, SecurityRounded, CampaignRounded, PeopleAltRounded, TextsmsRounded, ExitToAppRounded  } from '@mui/icons-material';


const SettingsAccountLevelChip = React.lazy(() => import(/* webpackChunkName: 'SettingsAccountLeveLChip' */ '../Settings/SettingsAccountLevelChip'));

// https://stackoverflow.com/questions/32647215/declaring-static-constants-in-es6-classes
const CORPORATION = 'C';
const GROUP = 'G';
const NONPROFIT = 'NP';
const NONPROFIT_501C3 = 'C3';
const NONPROFIT_501C4 = 'C4';
const NEWS_ORGANIZATION = 'NW';
const POLITICAL_ACTION_COMMITTEE = 'P';
const PUBLIC_FIGURE = 'PF';

export default class SettingsPersonalSideBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOnPartnerUrl: false,
      isOrganization: false,
      isSignedIn: false,
      showPremiumFeatures: false,
      voterIsAdminForThisUrl: false,
    };
  }

  componentDidMount () {
    if (this.props.organizationType) {
      this.setState({ isOrganization: this.isOrganization(this.props.organizationType) });
    }
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    const { isSignedIn } = this.props;
    this.setState({
      isOnPartnerUrl: AppObservableStore.isOnPartnerUrl(),
      voterIsAdminForThisUrl: AppObservableStore.isVoterAdminForThisUrl(VoterStore.getLinkedOrganizationWeVoteId()),
      isSignedIn,
    });
  }

  componentDidUpdate (prevProps) {
    // console.log('SettingsPersonalSideBar componentDidUpdate');
    if (prevProps.organizationType !== this.props.organizationType) {
      this.setState({ isOrganization: this.isOrganization(this.props.organizationType) });
    }
    if (prevProps.isSignedIn !== this.props.isSignedIn) {
      this.setState({
        isOnPartnerUrl: AppObservableStore.isOnPartnerUrl(),
        voterIsAdminForThisUrl: AppObservableStore.isVoterAdminForThisUrl(VoterStore.getLinkedOrganizationWeVoteId()),
        isSignedIn: this.props.isSignedIn,
      });
    }
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    this.setState({
      isOnPartnerUrl: AppObservableStore.isOnPartnerUrl(),
    });
  }

  voterSignOut = () => {
    VoterSessionActions.voterSignOut();
  }

  isOrganization (organizationType) {
    return organizationType === NONPROFIT_501C3 || organizationType === NONPROFIT_501C4 ||
        organizationType === POLITICAL_ACTION_COMMITTEE || organizationType === NONPROFIT ||
        organizationType === GROUP || organizationType === PUBLIC_FIGURE ||
        organizationType === NEWS_ORGANIZATION || organizationType === CORPORATION;
  }

  render () {
    renderLog('SettingsPersonalSideBar');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log("SettingsPersonalSideBar, isOrganization: ", this.state.isOrganization);
    const { editMode } = this.props;
    const { isOnPartnerUrl, isSignedIn, isOrganization, showPremiumFeatures, voterIsAdminForThisUrl } = this.state;
    const showSettingsInDevelopment = false; // If developing any of the new settings, change this to true
    const isOnPartnerUrlAndNotAdmin = isOnPartnerUrl && !voterIsAdminForThisUrl;
    const alwaysTrue = true; // A temp fix for https://wevoteusa.atlassian.net/browse/WV-168
    const pigsCanFly = false;

    return (
      <div className="card">
        <div className="card-main">
          <div className="SettingsItem__summary__title">Your Settings</div>

          {isSignedIn && (
            <div className={String(editMode) === 'contacts' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <BorderBottomContainer>
                <Link to="/settings/profile" className="SettingsItem__summary__item">
                  <ImportContactsIcon $isActive={String(editMode) === 'contact'} />
                  <LinkSpan $isActive={String(editMode) === 'contacts'}>
                    Import Contacts
                  </LinkSpan>
                </Link>
              </BorderBottomContainer>
            </div>
          )}

          {isSignedIn && (
            // <div className={String(editMode) === 'profile' ?
            //   'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
            //   'SettingsItem__summary__item-container '}
            // >
            <LinkContainer $isActive={String(editMode) === 'profile'}>
              <div>
                <Link to="/settings/profile" className="SettingsItem__summary__item">
                  <ProfileIcon $isActive={String(editMode) === 'profile'} />
                  <LinkSpan $isActive={String(editMode) === 'profile'}>
                    Name &amp; Photo
                  </LinkSpan>
                </Link>
              </div>
            </LinkContainer>
          )}

          <LinkContainer $isActive={String(editMode) === 'account'}>
            <div>
              <Link to="/settings/account" className="SettingsItem__summary__item" id="securityAndSignIn">
                <SecurityIcon $isActive={String(editMode) === 'account'} />
                <LinkSpan $isActive={String(editMode) === 'account'}>
                  {isSignedIn ?
                    <span>Security & Sign In</span> :
                    <span>Sign In</span> }
                </LinkSpan>
              </Link>
            </div>
          </LinkContainer>

          {(isSignedIn) && (
            <LinkContainer $isActive={String(editMode) === 'yourdata'}>
              <div>
                <Link to="/settings/yourdata" className="SettingsItem__summary__item" id="yourData">
                  <PrivacyIcon $isActive={String(editMode) === 'yourdata'} />
                  <LinkSpan $isActive={String(editMode) === 'yourdata'}>
                    Privacy &amp; Data
                  </LinkSpan>
                </Link>
              </div>
            </LinkContainer>
          )}

          <LinkContainer $isActive={String(editMode) === 'notifications'}>
            <div>
              <Link to="/settings/notifications" className="SettingsItem__summary__item" id="settingsNotifications">
                <NotificationsIcon $isActive={String(editMode) === 'notifications'} />
                <LinkSpan $isActive={String(editMode) === 'notifications'}>
                  Notifications
                </LinkSpan>
              </Link>
            </div>
          </LinkContainer>

          {alwaysTrue && (/* {!isOnPartnerUrl && ( */
            <LinkContainer $isActive={String(editMode) === 'friends'}>
              <div>
                <Link to="/friends" className="SettingsItem__summary__item" id="settingsFriends">
                  <FriendsIcon $isActive={String(editMode) === 'friends'} />
                  <LinkSpan $isActive={String(editMode) === 'friends'}>
                    Friends
                  </LinkSpan>
                </Link>
              </div>
            </LinkContainer>
          )}

          {(isSignedIn && alwaysTrue/* && !isOnPartnerUrl */) && (
            <LinkContainer $isActive={String(editMode) === 'discuss'}>
              <div>
                <Link to="/news" className="SettingsItem__summary__item" id="settingsDiscuss">
                  <DiscussIcon $isActive={String(editMode) === 'discuss'} />
                  <LinkSpan $isActive={String(editMode) === 'discuss'}>
                    Discuss
                  </LinkSpan>
                </Link>
              </div>
            </LinkContainer>
          )}

          {(isSignedIn && showPremiumFeatures && !isOnPartnerUrlAndNotAdmin) && (
            <div className={String(editMode) === 'domain' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/domain" className="SettingsItem__summary__item" id="settingsDomain">
                  <LinkSpan $isActive={String(editMode) === 'domain'}>
                    Domain
                  </LinkSpan>
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip ignoreIfUpgraded onClickDisabled requiredFeaturePackage="PROFESSIONAL" />
                  </Suspense>
                </Link>
              </div>
            </div>
          )}

          {(isSignedIn && showPremiumFeatures && !isOnPartnerUrlAndNotAdmin) && (
            <div className={String(editMode) === 'text' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/text" className="SettingsItem__summary__item" id="settingsSiteText">
                  <span className={String(editMode) === 'text' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Site Text
                  </span>
                </Link>
              </div>
            </div>
          )}

          {(isSignedIn && showPremiumFeatures && !isOnPartnerUrlAndNotAdmin) && (
            <div className={String(editMode) === 'sharing' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/sharing" className="SettingsItem__summary__item" id="settingsSharing">
                  <span className={String(editMode) === 'sharing' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Logo & Sharing
                  </span>
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip ignoreIfUpgraded onClickDisabled requiredFeaturePackage="PROFESSIONAL" />
                  </Suspense>
                </Link>
              </div>
            </div>
          )}

          {(isSignedIn && showPremiumFeatures && !isOnPartnerUrlAndNotAdmin) && (
            <div className={String(editMode) === 'subscription' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/subscription" className="SettingsItem__summary__item" id="settingsSubscriptionPlan">
                  <span className={String(editMode) === 'subscription' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Subscription Plan
                  </span>
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip ignoreIfUpgraded onClickDisabled requiredFeaturePackage="PROFESSIONAL" />
                  </Suspense>
                </Link>
              </div>
            </div>
          )}

          {(isSignedIn && showPremiumFeatures && !isOnPartnerUrlAndNotAdmin) && (
            <div className={String(editMode) === 'analytics' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/analytics" className="SettingsItem__summary__item" id="settingsAnalytics">
                  <span className={String(editMode) === 'analytics' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Analytics
                  </span>
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip ignoreIfUpgraded onClickDisabled requiredFeaturePackage="PROFESSIONAL" />
                  </Suspense>
                </Link>
              </div>
            </div>
          )}

          {(isSignedIn && isOrganization && showPremiumFeatures && !isOnPartnerUrlAndNotAdmin) && (
            <div className={String(editMode) === 'issues' || String(editMode) === 'issues_to_link' || String(editMode) === 'issues_linked' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/issues" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'issues' || String(editMode) === 'issues_to_link' || String(editMode) === 'issues_linked' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Organizational Values
                  </span>
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip ignoreIfUpgraded onClickDisabled requiredFeaturePackage="PROFESSIONAL" />
                  </Suspense>
                </Link>
              </div>
            </div>
          )}

          {(isSignedIn && showPremiumFeatures && showSettingsInDevelopment && !isOnPartnerUrlAndNotAdmin) && (
            <div className={String(editMode) === 'promoted' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/promoted" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'promoted' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Promoted Organizations
                  </span>
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip ignoreIfUpgraded onClickDisabled requiredFeaturePackage="PROFESSIONAL" />
                  </Suspense>
                </Link>
              </div>
            </div>
          )}

          {(showPremiumFeatures && !isOnPartnerUrlAndNotAdmin) && (
            <div className={String(editMode) === 'tools' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/tools" className="SettingsItem__summary__item" id="toolsForYourWebsite">
                  <span className={String(editMode) === 'tools' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Tools for Your Website
                  </span>
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip ignoreIfUpgraded onClickDisabled requiredFeaturePackage="PROFESSIONAL" />
                  </Suspense>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && (
            <LinkContainer $isActive={String(editMode) === 'text'}>
              <BorderTopContainer onClick={this.voterSignOut}>
                <Link to="/ready" className="SettingsItem__summary__item" id="site text">
                  <SignOutIcon />
                  <LinkSpan
                    $isActive={String(editMode) === 'text'}
                    id="signOut_Settings"
                  >
                    Sign Out
                  </LinkSpan>
                </Link>
              </BorderTopContainer>
            </LinkContainer>
          )}
        </div>
      </div>
    );
  }
}

const BorderBottomContainer = styled('div')`
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  padding-bottom: 1rem;
`;

const ImportContactsIcon = styled(ImportContactsOutlined)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  margin: -3px 10px 0 8px;
`;

const ProfileIcon = styled(AccountBoxRounded)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  margin: -3px 10px 0 6px;
`;

const SecurityIcon = styled(Lock)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  margin: -3px 10px 0 6px;
`;

const PrivacyIcon = styled(SecurityRounded)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  margin: -3px 10px 0 6px;
`;

const NotificationsIcon = styled(CampaignRounded)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  margin: -3px 7px 0 9px;
`;

const FriendsIcon = styled(PeopleAltRounded)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  margin: -3px 10px 0 8px;
`;

const DiscussIcon = styled(TextsmsRounded)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  margin: -3px 10px 0 8px;
`;

const SignOutIcon = styled(ExitToAppRounded)`
  color: ${DesignTokenColors.neutralUI600};
  margin: -3px 10px 0 8px;
`;

const BorderTopContainer = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutralUI200};
  margin-top: 1rem;
  padding-top: 1rem;
`;

const LinkContainer = styled('div')`
  border-left: ${(props) => (props.$isActive ? `3px solid ${DesignTokenColors.primary600}` : 'none')};
  margin: 0 0 .25rem ${(props) => (props.$isActive ? '-.2rem' : 0)};
  padding-bottom: .25rem;
`;

const LinkSpan = styled('span')`
  color: ${(props) => (props.$isActive ? `${DesignTokenColors.primary600}` : `${DesignTokenColors.neutral600}`)};
  fontSize: '1rem',
  textDecoration: 'none',
`;

SettingsPersonalSideBar.propTypes = {
  editMode: PropTypes.string,
  isSignedIn: PropTypes.bool,
  organizationType: PropTypes.string.isRequired,
};
