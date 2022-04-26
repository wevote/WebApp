import { Box, Button, Tab, Tabs } from '@mui/material';
import { Launch } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import IssueActions from '../../actions/IssueActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuidePossibilityActions from '../../actions/VoterGuidePossibilityActions';
import apiCalming from '../../common/utils/apiCalming';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { renderLog } from '../../common/utils/logging';
import CandidateItemEndorsement from '../../components/Ballot/CandidateItemEndorsement';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuidePossibilityStore from '../../stores/VoterGuidePossibilityStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

const CandidateItem = React.lazy(() => import(/* webpackChunkName: 'CandidateItem' */ '../../components/Ballot/CandidateItem'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));


// https://localhost:3000/candidate-for-extension?candidate_name=Phil%20Ting&candidate_we_vote_id=wv02cand40131&endorsement_page_url=https%3A%2F%2Fwww.sierraclub.org%2Fcalifornia%2F2020-endorsements&candidate_specific_endorsement_url=https%3A%2F%2Fwww.philting.com%2F
class CandidateForExtension extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateWeVoteId: '',
      organizationWeVoteId: '',
      activeTabIndex: 0,
      voterGuidePossibilityId: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');

    // Don't even load Stripe, Google Analytics, Google Maps, FontAwesome and Zen, they make startup very slow and are not needed for the Chrome Extension
    window.leanLoadForChromeExtension = true;

    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.voterGuidePossibilityStoreListener = VoterGuidePossibilityStore.addListener(this.onVoterGuidePossibilityStoreChange.bind(this));
    const { organization_we_vote_id: organizationWeVoteId } = this.props.location.query;
    let { candidate_we_vote_id: candidateWeVoteId, endorsement_page_url: endorsementPageUrl } = this.props.location.query;
    // console.log('candidateWeVoteId:', candidateWeVoteId);

    if (candidateWeVoteId) {
      const expires = new Date(new Date().getTime() + 300 * 1000);// 300 seconds
      Cookies.set('candidateWeVoteId', candidateWeVoteId, { expires, path: '/' });
      Cookies.set('candidateWeVoteId', candidateWeVoteId, { expires, path: '/' });
    } else {
      candidateWeVoteId = Cookies.get('candidateWeVoteId');
      endorsementPageUrl = Cookies.get('endorsementPageUrl');
    }

    VoterGuidePossibilityActions.voterGuidePossibilityRetrieve(endorsementPageUrl);

    if (candidateWeVoteId) {
      this.setState({
        candidateWeVoteId,
      });
      CandidateActions.candidateRetrieve(candidateWeVoteId);
    }

    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    // We want to make sure we have all of the position information so that comments show up
    const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidateWeVoteId);

    if (voterGuidesForThisBallotItem) {
      voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
        // console.log('oneVoterGuide: ', oneVoterGuide);
        if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
          OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
        }
      });
    }
    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
    }

    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), candidateWeVoteId);
    this.setState({
      candidateWeVoteId,
      // endorsementPageUrl,
      organizationWeVoteId,
    });
  }

  componentWillUnmount () {
    // console.log('Candidate componentWillUnmount');
    this.candidateStoreListener.remove();
    this.voterGuidePossibilityStoreListener.remove();
  }

  handleChange (event, newActiveTabIndex) {
    this.setState({
      activeTabIndex: newActiveTabIndex,
    });
  }

  onCandidateStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  onVoterGuidePossibilityStoreChange () {
    const { candidateWeVoteId } = this.state;
    const voterGuidePossibilityId = VoterGuidePossibilityStore.getVoterGuidePossibilityId();
    const voterGuidePossibility = VoterGuidePossibilityStore.getVoterGuidePossibility();
    const possibleOrganizationName = voterGuidePossibility.possible_organization_name || '';
    // Position specific data
    const voterGuidePossibilityPosition = VoterGuidePossibilityStore.getVoterGuidePossibilityPositionByCandidateId(candidateWeVoteId);
    const ballotItemName = voterGuidePossibilityPosition.ballot_item_name || '';
    this.setState({
      ballotItemName,
      possibleOrganizationName,
      voterGuidePossibilityId,
    });
  }

  render () {
    renderLog('CandidateForExtension');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      candidate_name: candidateName, endorsement_page_url: endorsementPageUrl, candidate_specific_endorsement_url: candidateSpecificEndorsementUrl,
      show_data: showDevelopmentData,
    } = this.props.location.query;
    const {
      ballotItemName, candidateWeVoteId, organizationWeVoteId, possibleOrganizationName, activeTabIndex, voterGuidePossibilityId,
    } = this.state;

    return (
      <Wrapper>
        <Tabs variant="fullWidth" classes={{ indicator: classes.indicator }} value={activeTabIndex} onChange={this.handleChange}>
          <Tab classes={{ root: classes.tab }} variant="fullWidth" color="primary" label="Your Opinion" />
          <Tab classes={{ root: classes.tab }} variant="fullWidth" color="primary" label="Official Endorsement" />
        </Tabs>
        <div
          role="tabpanel"
          hidden={activeTabIndex !== 0}
          id={`simple-tabpanel-${0}`}
          aria-labelledby={`simple-tab-${0}`}
          value={0}
        >
          {activeTabIndex === 0 && (
            <Box classes={{ root: classes.Box }} p={3}>
              <Suspense fallback={<></>}>
                <CandidateItem
                  blockOnClickShowOrganizationModalWithPositions
                  inModal
                  candidateWeVoteId={candidateWeVoteId}
                  organizationWeVoteId={organizationWeVoteId}
                  expandIssuesByDefault
                  forMoreInformationTextOff
                  hideCandidateUrl
                  hideShowMoreFooter
                  showLargeImage
                  showOfficeName
                  showPositionStatementActionBar
                  showTopCommentByBallotItem
                />
              </Suspense>
              <Buttons>
                <OneButton>
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="candidateWeVoteId"
                      className=""
                      body={(
                        <Button
                          classes={{ root: classes.oneButtonShown }}
                          color="primary"
                          variant="outlined"
                        >
                          Jump To We Vote
                        </Button>
                      )}
                      target="_blank"
                      url={`https://WeVote.US/candidate/${candidateWeVoteId}/b/btdb`}
                    />
                  </Suspense>
                </OneButton>
                {/* <OneButton> */}
                {/*  <Button classes={{ root: classes.button }} variant="outlined" color="primary">Save</Button> */}
                {/* </OneButton> */}
              </Buttons>
              {candidateSpecificEndorsementUrl && (
                <OriginalLinkWrapper>
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="candidateSpecificEndorsement"
                      className=""
                      body={(
                        <OriginalLinkStyle>
                          {candidateSpecificEndorsementUrl}
                          {' '}
                          <Launch
                            style={{
                              height: 14,
                              marginLeft: 2,
                              marginTop: '-3px',
                              width: 14,
                            }}
                          />
                        </OriginalLinkStyle>
                      )}
                      target="_blank"
                      url={candidateSpecificEndorsementUrl}
                    />
                  </Suspense>
                </OriginalLinkWrapper>
              )}
            </Box>
          )}
        </div>
        <div
          role="tabpanel"
          hidden={activeTabIndex !== 1}
          id={`simple-tabpanel-${1}`}
          aria-labelledby={`simple-tab-${1}`}
          value={1}
        >
          {activeTabIndex === 1 && (
            <Box classes={{ root: classes.Box }} p={3}>
              <OrganizationNameHeader>
                Official Endorsement from
                {' '}
                {possibleOrganizationName}
              </OrganizationNameHeader>
              <ExplanationContainer>
                <ExplanationTextStyled>
                  {(possibleOrganizationName && ballotItemName) && (
                    <>
                      Help us capture this official endorsement so other voters can see what
                      {' '}
                      <strong>
                        {possibleOrganizationName}
                      </strong>
                      {' '}
                      thinks about
                      {' '}
                      <strong>
                        {ballotItemName}
                      </strong>
                      .
                    </>
                  )}
                </ExplanationTextStyled>
              </ExplanationContainer>
              <CandidateItemEndorsement
                candidateSpecificEndorsementUrlIncoming={candidateSpecificEndorsementUrl}
                candidateWeVoteId={candidateWeVoteId}
                showLargeImage
                showOfficeName
                voterGuidePossibilityId={voterGuidePossibilityId}
              />
            </Box>
          )}
        </div>
        {showDevelopmentData && (
          <div style={{ margin: '20px' }}>
            <div>
              <strong>candidateName:</strong>
              {candidateName}
            </div>
            <div>
              <strong>candidateWeVoteId:</strong>
              {candidateWeVoteId}
            </div>
            <div>
              <strong>endorsementPageUrl:</strong>
              {endorsementPageUrl}
            </div>
            <div>
              <strong>candidateSpecificEndorsementUrl:</strong>
              {candidateSpecificEndorsementUrl}
            </div>
          </div>
        )}
      </Wrapper>
    );
  }
}
CandidateForExtension.propTypes = {
  classes: PropTypes.object,
  location: PropTypes.object,
};

const styles = (theme) => ({
  indicator: {
    backgroundColor: theme.palette.primary.main,
    height: 2.5,
  },
  tab: {
    fontWeight: 600,
  },
  oneButtonShown: {
    width: '100%',
  },
  twoButtonsShown: {
    width: '50%',
    margin: 16,
  },
  Box: {
    padding: 2,
  },
});

const Wrapper = styled('div')`
  height: 100vh;
  background: white;
`;

const Buttons = styled('div')`
  padding: 0 16px;
  width: calc(100% + 32px);
  margin: -16px -16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OneButton = styled('div')`
  width: 100%;
  margin: 16px;
`;

const OriginalLinkStyle = styled('div')`
  font-size: 18px;
  font-weight: 600;
`;

const OriginalLinkWrapper = styled('div')`
  width: 100%;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrganizationNameHeader = styled('div')`
  font-size: 18px;
  font-weight: 600;
  margin: 0 15px 8px 15px;
`;

const ExplanationContainer = styled('div')`
  display: block;
  float: right;
  background-color: white;
  border-radius: 4px;
  width: 100%;
  @media print{
    display: none;
  }
`;

const ExplanationTextStyled = styled('div')`
  display: block;
  color: #2e3c5d;
  font-weight: 200;
  font-family: ${'$heading-font-stack'};
  text-align: left;
  margin: -5px 15px 15px 15px;
  border-width: medium;
  font-size: 14px;
  line-height: normal;
  :after {
    content: "";
    display: block;
    margin: 0 auto;
    width: 50%;
    padding-top: 15px;
    border-bottom: .5px solid;
  }
`;

export default withStyles(styles)(CandidateForExtension);
