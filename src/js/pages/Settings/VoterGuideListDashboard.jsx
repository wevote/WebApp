import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import SelectVoterGuidesSideBar from '../../components/Navigation/SelectVoterGuidesSideBar';
import VoterGuideListSearchResults from '../../components/Settings/VoterGuideListSearchResults';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../components/SignIn/SignInOptionsPanel'));


class VoterGuideListDashboard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: '',
      voterIsSignedIn: false,
      clearSearchTextNow: false,
      searchIsUnderway: false,
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchUnderway = this.searchUnderway.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
      voterIsSignedIn,
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
          // organization,
        });
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
    window.scrollTo(0, 0);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voterIsSignedIn,
      currentGoogleCivicElectionId: VoterStore.electionId(),
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
          // organization,
        });
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    // const { linkedOrganizationWeVoteId } = this.state;
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, linkedOrganizationWeVoteId: ", this.state.linkedOrganizationWeVoteId);
    this.setState({
      // organization: OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    this.setState();
  }

  onVoterStoreChange () {
    const { linkedOrganizationWeVoteId: previousLinkedOrganizationWeVoteId } = this.state;
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voterIsSignedIn,
      currentGoogleCivicElectionId: VoterStore.electionId(),
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && (previousLinkedOrganizationWeVoteId !== linkedOrganizationWeVoteId)) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  clearSearch () {
    // console.log('VoterGuidePositions, clearSearch');
    this.setState({
      clearSearchTextNow: true,
      searchIsUnderway: false,
    });
  }

  searchUnderway (searchIsUnderway) {
    // console.log('VoterGuidePositions, searchIsUnderway: ', searchIsUnderway);
    this.setState({
      clearSearchTextNow: false,
      searchIsUnderway,
    });
  }

  render () {
    renderLog('VoterGuideListDashboard');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      clearSearchTextNow, searchIsUnderway,
      linkedOrganizationWeVoteId, currentGoogleCivicElectionId,
      voterIsSignedIn,
    } = this.state;
    // console.log(clearSearchTextNow, searchIsUnderway, linkedOrganizationWeVoteId, currentGoogleCivicElectionId);
    // const currentGoogleCivicElectionId = 0;
    return (
      <div className="settings-dashboard">
        <Helmet title="Your Endorsements - We Vote" />
        <PageContentContainer>
          <div className="container-fluid">
            <div className="row">
              {/* Mobile and Desktop mode, these bootstrap breakpoints don't work well in Cordova, please don't add more of them */}
              <div className="col-12 col-md-4 sidebar-menu">
                <div className="u-show-mobile">
                  <VoterGuideListSearchResults
                        clearSearchTextNow={clearSearchTextNow}
                        googleCivicElectionId={currentGoogleCivicElectionId}
                        organizationWeVoteId={linkedOrganizationWeVoteId}
                        searchUnderwayFunction={this.searchUnderway}
                  />
                </div>
                <SelectVoterGuidesSideBar />
              </div>
              <div className="d-none d-sm-block col-md-8">
                <VoterGuideListSearchResults
                      clearSearchTextNow={clearSearchTextNow}
                      googleCivicElectionId={currentGoogleCivicElectionId}
                      organizationWeVoteId={linkedOrganizationWeVoteId}
                      searchUnderwayFunction={this.searchUnderway}
                />
                { !voterIsSignedIn && (
                  <Suspense fallback={<></>}>
                    <DelayedLoad waitBeforeShow={1000}>
                      <SignInOptionsPanel />
                    </DelayedLoad>
                  </Suspense>
                )}
                {!(searchIsUnderway) && (
                  <div className="card">
                    <div className="card-main">
                      <Faq>Frequently Asked Questions</Faq>
                      <br />
                      <Questions>Why enter endorsements?</Questions>
                      <Description>
                        Enter your own endorsements so your friends and community can learn from you.
                        {' '}
                        Help the people who share your values decide how to vote, so they aren&apos;t making hard choices alone.
                      </Description>
                      <Questions>How do I start entering my opinions?</Questions>
                      <Description>
                        Choose the election you have opinions about by clicking the &quot;Choose New Election&quot; button.
                        {' '}
                        If you have already chosen or opposed any candidates (or measures), you can click &quot;Edit&quot; under the election in the left column.
                      </Description>
                      <Questions>What does an endorsement look like as I am entering it?</Questions>
                      <img src={normalizedImagePath('../../../img/global/screens/endorsement-1422x354.png')} alt="" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageContentContainer>
      </div>
    );
  }
}

const Faq = styled('h3')`
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 8px;
  margin-bottom: 4px;
  @media (max-width: 576px) {
    text-align: center;
  }
`;

const Questions = styled('p')`
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  text-align: left;
  @media (max-width: 576px) {
    text-align: center;
  }
`;

const Description = styled('p')`
  color: #A9A9A9;
  font-size: 16px;
  margin-top: 8px;
`;

export default VoterGuideListDashboard;
