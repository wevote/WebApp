import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BallotActions from '../../actions/BallotActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import SelectVoterGuidesSideBar from '../../components/Navigation/SelectVoterGuidesSideBar';
import SettingsPersonalSideBar from '../../components/Navigation/SettingsPersonalSideBar';
import SettingsAddress from '../../components/Settings/SettingsAddress';
import SettingsAnalytics from '../../components/Settings/SettingsAnalytics';
import SettingsDomain from '../../components/Settings/SettingsDomain';
import SettingsElection from '../../components/Settings/SettingsElection';
import SettingsIssueLinks from '../../components/Settings/SettingsIssueLinks';
import SettingsNotifications from '../../components/Settings/SettingsNotifications';
import SettingsProfile from '../../components/Settings/SettingsProfile';
import SettingsPromotedOrganizations from '../../components/Settings/SettingsPromotedOrganizations';
import SettingsSharing from '../../components/Settings/SettingsSharing';
import SettingsSiteText from '../../components/Settings/SettingsSiteText';
import SettingsSubscriptionPlan from '../../components/Settings/SettingsSubscriptionPlan';
import ToolsToShareOnOtherWebsites from '../../components/Settings/ToolsToShareOnOtherWebsites';
import { PageContentContainer } from '../../utils/pageLayoutStyles';
import BallotStore from '../../stores/BallotStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { isProperlyFormattedVoterGuideWeVoteId } from '../../utils/textFormat';

const SettingsAccount = React.lazy(() => import(/* webpackChunkName: 'SettingsAccount' */ '../../components/Settings/SettingsAccount'));


export default class SettingsDashboard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      editMode: '',
      linkedOrganizationWeVoteId: '',
      voter: {},
      organizationType: 'none',
      voterGuideWeVoteId: '',
    };
  }

  componentDidMount () {
    const { match: { params } } = this.props;
    if (params.edit_mode) {
      this.setState({ editMode: params.edit_mode });
    } else {
      this.setState({ editMode: 'address' });
    }

    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;

    // console.log("SettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organizationType: organization.organization_type || 'none',
        });
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
    // Get Voter Guide information
    // let voterGuideFound = false;
    if (params.voter_guide_we_vote_id && isProperlyFormattedVoterGuideWeVoteId(params.voter_guide_we_vote_id)) {
      this.setState({
        voterGuideWeVoteId: params.voter_guide_we_vote_id,
      });
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(params.voter_guide_we_vote_id);
      if (voterGuide && voterGuide.we_vote_id) {
        if (voterGuide.google_civic_election_id && voterGuide.google_civic_election_id !== BallotStore.currentBallotGoogleCivicElectionId) {
          // console.log("VoterGuideSettingsDashboard componentDidMount retrieving ballot for: ", voterGuide.google_civic_election_id);
          BallotActions.voterBallotItemsRetrieve(voterGuide.google_civic_election_id, '', '');
        }
      }
    }
    window.scrollTo(0, 0);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const voter = VoterStore.getVoter();
    const { match: { params: nextParams } } = nextProps;
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;

    // console.log("SettingsDashboard componentWillReceiveProps linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organizationType: organization.organization_type,
        });
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }

    if (nextParams.edit_mode) {
      this.setState({ editMode: nextParams.edit_mode });
      window.scrollTo(0, 0);
    }
    if (nextParams.voter_guide_we_vote_id && isProperlyFormattedVoterGuideWeVoteId(nextParams.voter_guide_we_vote_id)) {
      this.setState({
        voterGuideWeVoteId: nextParams.voter_guide_we_vote_id,
      });
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(nextParams.voter_guide_we_vote_id);
      if (voterGuide && voterGuide.we_vote_id) {
        if (voterGuide.google_civic_election_id && voterGuide.google_civic_election_id !== BallotStore.currentBallotGoogleCivicElectionId) {
          // console.log("VoterGuideSettingsDashboard componentDidMount retrieving ballot for: ", voterGuide.google_civic_election_id);
          BallotActions.voterBallotItemsRetrieve(voterGuide.google_civic_election_id, '', '');
        }
      }
    } else {
      this.setState({
        voterGuideWeVoteId: '',
      });
    }
  }

  componentWillUnmount () {
    if (this.organizationStoreListener) {
      this.organizationStoreListener.remove();
      this.voterGuideStoreListener.remove();
      this.voterStoreListener.remove();
    }
  }

  onOrganizationStoreChange () {
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, org_we_vote_id: ", this.state.linkedOrganizationWeVoteId);
    const organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    if (organization && organization.organization_type) {
      this.setState({
        organizationType: organization.organization_type,
      });
    }
  }

  onVoterGuideStoreChange () {
    this.setState();
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;

    // console.log("SettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  render () {
    renderLog('SettingsDashboard');  // Set LOG_RENDER_EVENTS to log all renders
    let settingsComponentToDisplayDesktop = null;
    let settingsComponentToDisplayMobile = null;
    const { editMode } = this.state;
    switch (editMode) {
      case 'account':
        settingsComponentToDisplayDesktop = <SettingsAccount externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsAccount externalUniqueId="domainMobile" />;
        break;
      case 'address':
        settingsComponentToDisplayDesktop = <SettingsAddress externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsAddress externalUniqueId="domainMobile" />;
        break;
      case 'analytics':
        settingsComponentToDisplayDesktop = <SettingsAnalytics externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsAnalytics externalUniqueId="domainMobile" />;
        break;
      case 'domain':
        settingsComponentToDisplayDesktop = <SettingsDomain externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsDomain externalUniqueId="domainMobile" />;
        break;
      case 'election':
        settingsComponentToDisplayDesktop = <SettingsElection externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsElection externalUniqueId="domainMobile" />;
        break;
      case 'issues_linked':
      case 'issues_to_link':
        settingsComponentToDisplayDesktop = <SettingsIssueLinks externalUniqueId="domainDesktop" organizationWeVoteId={this.state.voter.we_vote_id} params={{ active_tab: editMode }} />;
        settingsComponentToDisplayMobile = <SettingsIssueLinks externalUniqueId="domainMobile" organizationWeVoteId={this.state.voter.we_vote_id} params={{ active_tab: editMode }} />;
        break;
      case 'issues':
        settingsComponentToDisplayDesktop = <SettingsIssueLinks externalUniqueId="domainDesktop" organizationWeVoteId={this.state.voter.we_vote_id} params={{ active_tab: '' }} />;
        settingsComponentToDisplayMobile = <SettingsIssueLinks externalUniqueId="domainMobile" organizationWeVoteId={this.state.voter.we_vote_id} params={{ active_tab: '' }} />;
        break;
      case 'notifications':
        settingsComponentToDisplayDesktop = <SettingsNotifications externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsNotifications externalUniqueId="domainMobile" />;
        break;
      default:
      case 'profile':
        settingsComponentToDisplayDesktop = <SettingsProfile externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsProfile externalUniqueId="domainMobile" />;
        break;
      case 'promoted':
        settingsComponentToDisplayDesktop = <SettingsPromotedOrganizations />;
        settingsComponentToDisplayMobile = <SettingsPromotedOrganizations />;
        break;
      case 'sharing':
        settingsComponentToDisplayDesktop = <SettingsSharing externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsSharing externalUniqueId="domainMobile" />;
        break;
      case 'subscription':
        settingsComponentToDisplayDesktop = <SettingsSubscriptionPlan externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsSubscriptionPlan externalUniqueId="domainMobile" />;

        break;
      case 'text':
        settingsComponentToDisplayDesktop = <SettingsSiteText externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <SettingsSiteText externalUniqueId="domainMobile" />;
        break;
      case 'tools':
        settingsComponentToDisplayDesktop = <ToolsToShareOnOtherWebsites externalUniqueId="domainDesktop" />;
        settingsComponentToDisplayMobile = <ToolsToShareOnOtherWebsites externalUniqueId="domainMobile" />;
        break;
    }

    return (
      <PageContentContainer>
        <div className={isWebApp() ? 'settings-dashboard u-stack--xl' : 'settings-dashboard SettingsCardBottomCordova'}>
          {/* Desktop left navigation + Settings content.
            WebApp only, since the dashboard doesn't go well with the HamburgerMenu on iPad */}
          { isWebApp() && (
          <div className="d-none d-md-block">
            <div className="container-fluid">
              <div className="row">
                {/* Desktop mode left navigation */}
                <div className="col-md-4 sidebar-menu">
                  <SettingsPersonalSideBar
                    editMode={editMode}
                    isSignedIn={this.state.voter.is_signed_in}
                    organizationType={this.state.organizationType}
                  />
                  <SelectVoterGuidesSideBar
                    voterGuideWeVoteIdSelected={this.state.voterGuideWeVoteId}
                  />

                  <div className="h4 text-left" />
                  <div className="u-padding-top--md">
                    <span className="terms-and-privacy">
                      <Link to="/more/terms">
                        <span className="u-no-break">Terms of Service</span>
                      </Link>
                      <span style={{ paddingLeft: 20 }} />
                      <Link to="/more/privacy">
                        <span className="u-no-break">Privacy Policy</span>
                      </Link>
                    </span>
                  </div>
                  <div>
                    <span className="terms-and-privacy">
                      <Link to="/more/faq">Questions?</Link>
                      <span style={{ paddingLeft: 20 }} />
                      <Link to="/more/attributions">Attributions</Link>
                    </span>
                  </div>
                </div>
                {/* Desktop mode content */}
                <div className="col-md-8">
                  {settingsComponentToDisplayDesktop}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Mobile Settings content */}
          { isWebApp() ? (
            <div className="d-block d-md-none">
              {/* Mobile mode content */}
              <div className="col-12">
                {settingsComponentToDisplayMobile}
              </div>
            </div>
          ) : (
            <div className="col-12">
              {settingsComponentToDisplayMobile}
            </div>
          )}
        </div>
      </PageContentContainer>
    );
  }
}
SettingsDashboard.propTypes = {
  match: PropTypes.object,
};
