import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Button from '@material-ui/core/Button';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import BallotStore from '../../stores/BallotStore';
import { historyPush } from '../../utils/cordovaUtils';
import { toTitleCase } from '../../utils/textFormat';
import CandidateStore from '../../stores/CandidateStore';
import ImageHandler from '../ImageHandler';
import IssuesByBallotItemDisplayList from '../Values/IssuesByBallotItemDisplayList';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import OfficeActions from '../../actions/OfficeActions';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import SupportStore from '../../stores/SupportStore';
import TopCommentByBallotItem from '../Widgets/TopCommentByBallotItem';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 4;

// This is related to components/VoterGuide/VoterGuideOfficeItemCompressed
class OfficeItemCompressed extends Component {
  static propTypes = {
    officeWeVoteId: PropTypes.string.isRequired,
    ballotItemDisplayName: PropTypes.string.isRequired,
    candidateList: PropTypes.array,
    classes: PropTypes.object,
    externalUniqueId: PropTypes.string,
    organization: PropTypes.object,
    organizationWeVoteId: PropTypes.string,
    theme: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      changeFound: false,
      componentDidMount: false,
      maximumNumberOrganizationsToDisplay: NUMBER_OF_CANDIDATES_TO_DISPLAY,
      organizationWeVoteId: '',
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.generateCandidates = this.generateCandidates.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onCandidateStoreChange();
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organizationWeVoteId;
    // console.log('OfficeItemCompressed componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      organizationWeVoteId,
      componentDidMount: true,
    });
  }

  componentWillReceiveProps (nextProps) {
    // 2018-05-10 I don't think we need to trigger a new render because the incoming candidateList should be the same
    // if (nextProps.candidateList && nextProps.candidateList.length) {
    //   this.setState({
    //     candidateList: nextProps.candidateList,
    //   });
    // }

    const organizationWeVoteId = (nextProps.organization && nextProps.organization.organization_we_vote_id) ? nextProps.organization.organization_we_vote_id : nextProps.organizationWeVoteId;
    // console.log('officeItemCompressed componentWillReceiveProps, organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      organizationWeVoteId,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.componentDidMount !== nextState.componentDidMount) {
      // console.log('this.state.componentDidMount: ', this.state.componentDidMount, ', nextState.componentDidMount: ', nextState.componentDidMount);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId: ', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId: ', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.changeFound !== nextState.changeFound) {
      // console.log('this.state.changeFound: ', this.state.changeFound, ', nextState.changeFound: ', nextState.changeFound);
      return true;
    }
    if (this.props.ballotItemDisplayName !== nextProps.ballotItemDisplayName) {
      // console.log('this.props.ballotItemDisplayName: ', this.props.ballotItemDisplayName, ', nextProps.ballotItemDisplayName: ', nextProps.ballotItemDisplayName);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCandidateStoreChange () {
    const { candidateList, officeWeVoteId } = this.props;
    let changeFound = false;
    if (candidateList && candidateList.length && officeWeVoteId) {
      if (!BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)) {
        OfficeActions.positionListForBallotItemPublic(officeWeVoteId);
      }
      const newCandidateList = [];
      let newCandidate = {};
      if (candidateList) {
        candidateList.forEach((candidate) => {
          if (candidate && candidate.we_vote_id) {
            newCandidate = CandidateStore.getCandidate(candidate.we_vote_id);
            newCandidateList.push(newCandidate);
            if (!changeFound) {
              if (candidate.ballot_item_display_name !== newCandidate.ballot_item_display_name) {
                changeFound = true;
              }
              if (candidate.candidate_photo_url_medium !== newCandidate.candidate_photo_url_medium) {
                changeFound = true;
              }
              if (candidate.party !== newCandidate.party) {
                changeFound = true;
              }
            }
          }
        });
      }
      this.setState({
        candidateList: newCandidateList,
        changeFound,
      });
    }
  }

  getCandidateLink (candidateWeVoteId) {
    if (this.state.organizationWeVoteId) {
      // If there is an organizationWeVoteId, signal that we want to link back to voter_guide for that organization
      return `/candidate/${candidateWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organizationWeVoteId, signal that we want to link back to default ballot
      return `/candidate/${candidateWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  getOfficeLink () {
    if (this.state.organizationWeVoteId) {
      // If there is an organizationWeVoteId, signal that we want to link back to voter_guide for that organization
      return `/office/${this.props.officeWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organizationWeVoteId, signal that we want to link back to default ballot
      return `/office/${this.props.officeWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('OfficeItemCompressed caught error: ', `${error} with info: `, info);
  }

  goToCandidateLink (candidateWeVoteId) {
    const candidateLink = this.getCandidateLink(candidateWeVoteId);
    historyPush(candidateLink);
  }

  goToOfficeLink () {
    const officeLink = this.getOfficeLink();
    historyPush(officeLink);
  }

  generateCandidates () {
    const { classes, externalUniqueId, theme } = this.props;
    const { candidateList } = this.state;
    const candidatePreviewLimit = this.state.maximumNumberOrganizationsToDisplay;
    const supportedCandidatesList = candidateList.filter(candidate => SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id));
    const candidatesToRender = supportedCandidatesList.length ? supportedCandidatesList : candidateList;
    return (
      <Container candidateLength={candidatesToRender.length}>
        { candidatesToRender.slice(0, candidatePreviewLimit)
          .map((oneCandidate) => {
            if (!oneCandidate || !oneCandidate.we_vote_id) {
              return null;
            }
            const candidatePartyText = oneCandidate.party && oneCandidate.party.length ? `${oneCandidate.party}` : '';
            const localUniqueId = oneCandidate.we_vote_id;
            return (
              <CandidateInfo
                brandBlue={theme.palette.primary.main}
                candidateLength={candidatesToRender.length}
                id={`officeItemCompressedCandidateInfo-${oneCandidate.we_vote_id}`}
                key={`candidate_preview-${oneCandidate.we_vote_id}`}
              >
                <CandidateTopRow>
                  <Candidate onClick={() => this.goToCandidateLink(oneCandidate.we_vote_id)}>
                    {/* Candidate Image */}
                    <ImageHandler
                      className="card-main__avatar-compressed"
                      sizeClassName="icon-candidate-small u-push--sm "
                      imageUrl={oneCandidate.candidate_photo_url_medium}
                      alt="candidate-photo"
                      kind_of_ballot_item="CANDIDATE"
                    />
                    {/* Candidate Name */}
                    <div>
                      <h4 className="card-main__candidate-name card-main__candidate-name-link u-f5">
                        {oneCandidate.ballot_item_display_name}
                        <br />
                        <span className="card-main__candidate-party-description">{candidatePartyText}</span>
                      </h4>
                    </div>
                  </Candidate>
                  {/* Show check mark or score */}
                  <BallotItemSupportOpposeCountDisplay
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                    goToBallotItem={this.goToCandidateLink}
                  />
                </CandidateTopRow>
                <CandidateBottomRow>
                  {/* If there is a quote about the candidate, show that. If not, show issues related to candidate */}
                  <TopCommentByBallotItem
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                    // learnMoreUrl={this.getCandidateLink(oneCandidate.we_vote_id)}
                    onClickFunction={this.goToCandidateLink}
                  >
                    <span>
                      <IssuesByBallotItemDisplayList
                        ballotItemDisplayName={oneCandidate.ballot_item_display_name}
                        ballotItemWeVoteId={oneCandidate.we_vote_id}
                        disableMoreWrapper
                      />
                      <MoreButtonWrapper onClick={() => this.goToCandidateLink(oneCandidate.we_vote_id)}>
                        <Button
                          id={`topCommentButtonOffice-${externalUniqueId}-${localUniqueId}`}
                          variant="outlined"
                          color="primary"
                          classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
                        >
                          More
                        </Button>
                      </MoreButtonWrapper>
                    </span>
                  </TopCommentByBallotItem>
                </CandidateBottomRow>
              </CandidateInfo>
            );
          })}
      </Container>
    );
  }

  render () {
    renderLog('OfficeItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    let { ballotItemDisplayName } = this.props;
    const { officeWeVoteId, classes } = this.props;
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    const unsortedCandidateList = this.state.candidateList ? this.state.candidateList.slice(0) : {};
    const totalNumberOfCandidatesToDisplay = this.state.candidateList.length;
    const arrayOfCandidatesVoterSupports = [];
    // let advisersThatMakeVoterIssuesScoreDisplay;
    // let advisersThatMakeVoterNetworkScoreCount = 0;
    // let advisersThatMakeVoterNetworkScoreDisplay = null;
    // let atLeastOneCandidateChosenByIssueScore = false;
    // let candidateWeVoteWithMostSupportFromNetwork = null;
    // let candidateWeVoteIdWithHighestIssueScore = null;
    // let voterSupportsAtLeastOneCandidate = false;
    let ballotItemStatSheet;
    let numberOfOpposePositionsForScore = 0;
    let numberOfSupportPositionsForScore = 0;
    let voterSupportsBallotItem;
    let voterIssuesScoreForCandidate;

    // Prepare an array of candidate names that are supported by voter
    unsortedCandidateList.forEach((candidate) => {
      ballotItemStatSheet = SupportStore.getBallotItemStatSheet(candidate.we_vote_id);
      if (ballotItemStatSheet) {
        ({ numberOfOpposePositionsForScore, numberOfSupportPositionsForScore, voterSupportsBallotItem } = ballotItemStatSheet);
        voterIssuesScoreForCandidate = IssueStore.getIssuesScoreByBallotItemWeVoteId(candidate.we_vote_id);
        candidate.voterNetworkScoreForCandidate = Math.abs(numberOfSupportPositionsForScore - numberOfOpposePositionsForScore);
        candidate.voterIssuesScoreForCandidate = Math.abs(voterIssuesScoreForCandidate);
        candidate.is_support = voterSupportsBallotItem;
        if (voterSupportsBallotItem) {
          arrayOfCandidatesVoterSupports.push(candidate.ballot_item_display_name);
          // voterSupportsAtLeastOneCandidate = true;
        }
      }
    });

    const sortedCandidateList = unsortedCandidateList;
    sortedCandidateList.sort((optionA, optionB) => optionB.voterNetworkScoreForCandidate - optionA.voterNetworkScoreForCandidate ||
                                                   (optionA.is_support === optionB.is_support ? 0 : optionA.is_support ? -1 : 1) ||  // eslint-disable-line no-nested-ternary
                                                   optionB.voterIssuesScoreForCandidate - optionA.voterIssuesScoreForCandidate);

    // If the voter isn't supporting any candidates, then figure out which candidate the voter's network likes the best
    if (arrayOfCandidatesVoterSupports.length === 0) {
      // This function finds the highest support count for each office but does not handle ties. If two candidates have
      // the same network support count, only the first candidate will be displayed.
      let largestNetworkSupportCount = 0;
      let largestIssueScore = 0;
      sortedCandidateList.forEach((candidate) => {
        // Support in voter's network
        ballotItemStatSheet = SupportStore.getBallotItemStatSheet(candidate.we_vote_id);
        if (ballotItemStatSheet) {
          ({ numberOfOpposePositionsForScore, numberOfSupportPositionsForScore } = ballotItemStatSheet);
          if (numberOfSupportPositionsForScore > numberOfOpposePositionsForScore) {
            if (numberOfSupportPositionsForScore > largestNetworkSupportCount) {
              largestNetworkSupportCount = numberOfSupportPositionsForScore;
            }
          }
        }
        // Support based on Issue score
        if (voterIssuesScoreForCandidate > largestIssueScore) {
          largestIssueScore = voterIssuesScoreForCandidate;
        }
      });
    }

    return (
      <div className="card-main office-item">
        <a // eslint-disable-line
          className="anchor-under-header"
          name={officeWeVoteId}
        />
        <div className="card-main__content">
          {/* Desktop */}
          <Link id={`officeItemCompressedTopNameLink-${officeWeVoteId}`} to={this.getOfficeLink()}>
            <Title>
              {ballotItemDisplayName}
              <ArrowForwardIcon
                classes={{ root: classes.cardHeaderIconRoot }}
              />
            </Title>
          </Link>
          {/* *************************
            Display either a) the candidates the voter supports, or b) the first several candidates running for this office
            ************************* */}
          {this.generateCandidates()}

          { totalNumberOfCandidatesToDisplay > this.state.maximumNumberOrganizationsToDisplay ?
            <ShowMoreFooter showMoreId={`officeItemCompressedShowMoreFooter-${officeWeVoteId}`} showMoreLink={() => this.goToOfficeLink()} showMoreText={`Show all ${totalNumberOfCandidatesToDisplay} candidates`} /> :
            <ShowMoreFooter showMoreId={`officeItemCompressedShowMoreFooter-${officeWeVoteId}`} showMoreLink={() => this.goToOfficeLink()} />
          }
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: 4,
    width: 60,
    height: 30,
    [theme.breakpoints.down('md')]: {
      width: 60,
      height: 30,
    },
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 50,
      height: 30,
      padding: '0 8px',
      fontSize: 10,
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
  cardHeaderIconRoot: {
    marginTop: '-.3rem',
    fontSize: 20,
    marginLeft: '.3rem',
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .3rem',
    [theme.breakpoints.down('lg')]: {
      marginBottom: '.2rem',
    },
  },
});

const CandidateInfo = styled.div`
  display: flex;
  flex-flow: column;
  padding: 16px 16px 0 16px;
  margin-bottom: 8px;
  overflow-x: hidden;
  transition: all 200ms ease-in;
  border: 1px solid ${({ theme }) => theme.colors.grayBorder};
  width: ${({ candidateLength }) => (candidateLength > 1 ? '48%' : '100%')};
  margin-right: 8px;
  border-radius: 4px;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.linkHoverBorder};
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column;
    width: 100%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-flow: column;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.grayBorder};
    padding: 16px 0 0 0;
    margin-bottom: 8px;
    width: 100%;
    &:hover {
      border: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.grayBorder};
      box-shadow: none;
    }
  }
`;

const Candidate = styled.div`
  display: flex;
  flex-grow: 8;
`;

const CandidateTopRow = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const CandidateBottomRow = styled.div`
  padding-bottom: 10px;
`;

const Container = styled.div`
  display: flex;
  flex-flow: ${({ candidateLength }) => (candidateLength > 2 ? 'row wrap' : 'row')};
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: row wrap;
  }
`;

const MoreButtonWrapper = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  cursor: pointer;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

export default withTheme(withStyles(styles)(OfficeItemCompressed));
