import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Tab, Box, Button, withStyles } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import CandidateItem from '../../components/Ballot/CandidateItem';
// import CandidateStore from '../../stores/CandidateStore';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

// https://localhost:3000/candidate-for-extension?candidate_name=Phil%20Ting&candidate_we_vote_id=wv02cand40131&endorsement_page_url=https%3A%2F%2Fwww.sierraclub.org%2Fcalifornia%2F2020-endorsements&candidate_home_page=https%3A%2F%2Fwww.philting.com%2F
// TODO: This would be better as https://localhost:3000/candidate-for-extension&candidate_name... if you can figure out the chages in Root.jsx, I Will change the extension.
class CandidateForExtension extends Component {
  static propTypes = {
    classes: PropTypes.object,
    location: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateWeVoteId: '',
      organizationWeVoteId: '',
      value: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');
    const { candidate_we_vote_id: candidateWeVoteId, organization_we_vote_id: organizationWeVoteId } = this.props.location.query;
    // console.log('candidateWeVoteId:', candidateWeVoteId);
    if (candidateWeVoteId) {
      this.setState({
        candidateWeVoteId,
      });
      CandidateActions.candidateRetrieve(candidateWeVoteId);
    }

    OrganizationActions.organizationsFollowedRetrieve();

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

    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), candidateWeVoteId);
    this.setState({
      candidateWeVoteId,
      organizationWeVoteId,
    });
  }

  handleChange (event, newValue) {
    this.setState({
      value: newValue,
    });
  }

  render () {
    renderLog('CandidateForExtension');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      candidate_name: candidateName, endorsement_page_url: endorsementPageUrl, candidate_home_page: candidateHomePage,
      show_data: showDevelopmentData,
    } = this.props.location.query;

    const { classes } = this.props;

    // const { allCachedPositionsForThisCandidate, candidate, organizationWeVoteId, scrolledDown, candidateWeVoteId, value } = this.state;
    const { organizationWeVoteId, candidateWeVoteId, value } = this.state;

    /* eslint-disable react/jsx-one-expression-per-line */
    return (
      <Wrapper>
        <Tabs variant="fullWidth" classes={{ indicator: classes.indicator }} value={value} onChange={this.handleChange}>
          <Tab classes={{ root: classes.tab }} variant="fullWidth" color="primary" label="Your Opinion" />
          <Tab classes={{ root: classes.tab }} variant="fullWidth" color="primary" label="Capture Endorsement" />
        </Tabs>
        <div
          role="tabpanel"
          hidden={value !== 0}
          id={`simple-tabpanel-${0}`}
          aria-labelledby={`simple-tab-${0}`}
          value={0}
        >
          {value === 0 && (
            <Box p={3}>
              <CandidateItem
                inModal
                candidateWeVoteId={candidateWeVoteId}
                organizationWeVoteId={organizationWeVoteId}
                hideShowMoreFooter
                expandIssuesByDefault
                showLargeImage
                showTopCommentByBallotItem
                showOfficeName
                showPositionStatementActionBar
              />
              <Buttons>
                <OneButton>
                  <OpenExternalWebSite
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
                    url={`https://WeVote.US/candidate/${candidateWeVoteId}/b/btdb/`}
                  />
                </OneButton>
                {/* <OneButton> */}
                {/*  <Button classes={{ root: classes.button }} variant="outlined" color="primary">Save</Button> */}
                {/* </OneButton> */}
              </Buttons>
              {candidateHomePage && (
                <OriginalLinkWrapper>
                  <OpenExternalWebSite
                    body={(
                      <OriginalLinkStyle>
                        {candidateHomePage}
                        {' '}
                        <i className="fas fa-external-link-alt" aria-hidden="true" />
                      </OriginalLinkStyle>
                    )}
                    target="_blank"
                    url={candidateHomePage}
                  />
                </OriginalLinkWrapper>
              )}
            </Box>
          )}
        </div>
        <div
          role="tabpanel"
          hidden={value !== 1}
          id={`simple-tabpanel-${1}`}
          aria-labelledby={`simple-tab-${1}`}
          value={1}
        >
          {value === 1 && <Box p={3}>Coming Soon</Box>}
        </div>
        {showDevelopmentData && (
          <div style={{ margin: '20px' }}>
            <div>
              <b>candidateName:</b> {candidateName}
            </div>
            <div>
              <b>candidateWeVoteId:</b> {candidateWeVoteId}
            </div>
            <div>
              <b>endorsementPageUrl:</b> {endorsementPageUrl}
            </div>
            <div>
              <b>candidateHomePage:</b> {candidateHomePage}
            </div>
          </div>
        )}
      </Wrapper>
    );
  }
}

const styles = theme => ({
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
});

const Wrapper = styled.div`
  height: 100vh;
  background: white;
`;

const Buttons = styled.div`
  padding: 0 16px;
  width: calc(100% + 32px);
  margin: -16px -16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OneButton = styled.div`
  width: 100%;
  margin: 16px;
`;

const OriginalLinkStyle = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const OriginalLinkWrapper = styled.div`
  width: 100%;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default withStyles(styles)(CandidateForExtension);
