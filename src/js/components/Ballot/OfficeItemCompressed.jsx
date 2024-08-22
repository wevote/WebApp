import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OfficeActions from '../../actions/OfficeActions';
import { BallotScrollingOuterWrapper } from '../../common/components/Style/ScrollingStyles';
import signInModalGlobalState from '../../common/components/Widgets/signInModalGlobalState';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import SupportStore from '../../stores/SupportStore';
import { sortCandidateList } from '../../utils/positionFunctions';
import { OfficeItemCompressedWrapper, OfficeNameH2 } from '../Style/BallotStyles';
import BallotScrollingContainer from './BallotScrollingContainer';

const ShowMoreButtons = React.lazy(() => import(/* webpackChunkName: 'ShowMoreButtons' */ '../Widgets/ShowMoreButtons'));

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 5;

// This is related to components/VoterGuide/VoterGuideOfficeItemCompressed
class OfficeItemCompressed extends Component {
  targetRef = React.createRef();

  constructor (props) {
    super(props);
    this.state = {
      candidateListLength: 0,
      candidateListForDisplay: [],
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      showAllCandidates: false,
      totalNumberOfCandidates: 0,
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.showAllCandidates = this.showAllCandidates.bind(this);
    this.showLessCandidates = this.showLessCandidates.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.onCandidateStoreChange();
    const { candidateList, officeWeVoteId } = this.props;
    let candidateListLength = 0;
    if (candidateList && candidateList.length > 0) {
      candidateListLength = candidateList.length;
    }
    let totalNumberOfCandidates = 0;
    if (officeWeVoteId) {
      totalNumberOfCandidates = CandidateStore.getNumberOfCandidatesRetrievedByOffice(officeWeVoteId);
    }
    this.setState({
      candidateListLength,
      totalNumberOfCandidates,
    });
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organizationWeVoteId;
    // console.log('OfficeItemCompressed componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      organizationWeVoteId,
      // componentDidMount: true,
    });
    if (candidateList && candidateList.length && officeWeVoteId) {
      if (officeWeVoteId &&
        !this.localPositionListHasBeenRetrievedOnce(officeWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        OfficeActions.positionListForBallotItemPublic(officeWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[officeWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (officeWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        OfficeActions.positionListForBallotItemFromFriends(officeWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[officeWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('OfficeItemCompressed caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.supportStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have "Oh snap" page
    console.log('OfficeItemCompressed error:', error);
    return { hasError: true };
  }

  onCandidateStoreChange () {
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('OfficeItemCompressed, onCandidateStoreChange');
      const { candidateList, officeWeVoteId } = this.props;
      let candidateListLength = 0;
      if (candidateList && candidateList.length > 0) {
        candidateListLength = candidateList.length;
      }
      let totalNumberOfCandidates = 0;
      if (officeWeVoteId) {
        totalNumberOfCandidates = CandidateStore.getNumberOfCandidatesRetrievedByOffice(officeWeVoteId);
      }
      this.setState({
        candidateListLength,
        totalNumberOfCandidates,
      });
      // console.log('OfficeItemCompressed onCandidateStoreChange officeWeVoteId:', officeWeVoteId, ', totalNumberOfCandidates:', totalNumberOfCandidates);
      let changeFound = false;
      if (candidateListLength && officeWeVoteId) {
        if (officeWeVoteId &&
          !this.localPositionListHasBeenRetrievedOnce(officeWeVoteId) &&
          !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)
        ) {
          OfficeActions.positionListForBallotItemPublic(officeWeVoteId);
          const { positionListHasBeenRetrievedOnce } = this.state;
          positionListHasBeenRetrievedOnce[officeWeVoteId] = true;
          this.setState({
            positionListHasBeenRetrievedOnce,
          });
        }
        if (officeWeVoteId &&
          !this.localPositionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId) &&
          !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId)
        ) {
          OfficeActions.positionListForBallotItemFromFriends(officeWeVoteId);
          const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
          positionListFromFriendsHasBeenRetrievedOnce[officeWeVoteId] = true;
          this.setState({
            positionListFromFriendsHasBeenRetrievedOnce,
          });
        }
        const candidateListForDisplay = [];
        let newCandidate = {};
        if (candidateList) {
          candidateList.forEach((candidate) => {
            if (candidate && candidate.we_vote_id) {
              newCandidate = CandidateStore.getCandidateByWeVoteId(candidate.we_vote_id);
              if (newCandidate && newCandidate.we_vote_id) {
                candidateListForDisplay.push(newCandidate);
              } else {
                candidateListForDisplay.push(candidate);
              }
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
            } else {
              candidateListForDisplay.push(candidate);
            }
          });
        }
        let sortedCandidateList = {};
        if (candidateListForDisplay && candidateListForDisplay.length) {
          sortedCandidateList = sortCandidateList(candidateListForDisplay);
        }
        this.setState({
          candidateListForDisplay: sortedCandidateList,
        });
      }
    }
  }

  onSupportStoreChange () {
    // Trigger re-render, so we show/hide candidates as voter support changes
    this.setState({});
  }

  getCandidateLink (candidateWeVoteId) {
    if (this.state.organizationWeVoteId) {
      // If there is an organizationWeVoteId, signal that we want to link back to voter_guide for that organization
      return `/candidate/${candidateWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organizationWeVoteId, signal that we want to link back to default ballot
      return `/candidate/${candidateWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  getOfficeLink () {
    if (this.state.organizationWeVoteId) {
      // If there is an organizationWeVoteId, signal that we want to link back to voter_guide for that organization
      return `/office/${this.props.officeWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organizationWeVoteId, signal that we want to link back to default ballot
      return `/office/${this.props.officeWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  getCandidatesToRenderCount = () => {
    // How many candidates should we render? If voter has chosen or opposed 1+ candidates, only show those
    const { candidateList, disableAutoRollUp } = this.props;
    if (!candidateList || candidateList.length === 0) {
      return 0;
    }
    let { candidatesToShowForSearchResults } = this.props;
    candidatesToShowForSearchResults = candidatesToShowForSearchResults || [];
    const { showAllCandidates } = this.state;
    const supportedCandidatesList = candidateList.filter((candidate) => candidatesToShowForSearchResults.includes(candidate.we_vote_id) || (SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id) && !candidate.withdrawn_from_election));
    const opposedCandidatesList = candidateList.filter((candidate) => candidatesToShowForSearchResults.includes(candidate.we_vote_id) || (SupportStore.getVoterOpposesByBallotItemWeVoteId(candidate.we_vote_id) && !candidate.withdrawn_from_election));
    const supportedAndOpposedCandidatesList = supportedCandidatesList.concat(opposedCandidatesList);
    // console.log('OfficeItemCompressed getCandidatesToRenderCount candidatesToRender: ', candidatesToRender);
    if (showAllCandidates) {
      return candidateList.length;
    } else if (disableAutoRollUp) {
      return NUMBER_OF_CANDIDATES_TO_DISPLAY;
    } else if (supportedAndOpposedCandidatesList && supportedAndOpposedCandidatesList.length > 0) {
      return supportedAndOpposedCandidatesList.length;
    } else {
      return NUMBER_OF_CANDIDATES_TO_DISPLAY;
    }
  }

  // eslint-disable-next-line no-unused-vars
  generateCandidates = (officeWeVoteId) => {
    const { candidateList, disableAutoRollUp, externalUniqueId, isFirstBallotItem } = this.props;
    if (!candidateList || candidateList.length === 0) {
      // console.log('OfficeItemCompressed generateCandidates candidateList is empty');
      return (
        <BallotScrollingOuterWrapper>
          No candidates found.
        </BallotScrollingOuterWrapper>
      );
    }
    let { candidatesToShowForSearchResults } = this.props;
    candidatesToShowForSearchResults = candidatesToShowForSearchResults || [];
    const { candidateListForDisplay, showAllCandidates } = this.state; // limitNumberOfCandidatesShownToThisNumber
    // If voter has chosen 1+ candidates, only show those
    const supportedCandidatesList = candidateList.filter((candidate) => candidatesToShowForSearchResults.includes(candidate.we_vote_id) || (SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id) && !candidate.withdrawn_from_election));
    const opposedCandidatesList = candidateList.filter((candidate) => candidatesToShowForSearchResults.includes(candidate.we_vote_id) || (SupportStore.getVoterOpposesByBallotItemWeVoteId(candidate.we_vote_id) && !candidate.withdrawn_from_election));
    const supportedAndOpposedCandidatesList = supportedCandidatesList.concat(opposedCandidatesList);
    // If there are supported candidates, then limit what we show to supported and opposed candidates
    let candidatesToRender;
    let limitNumberOfCandidatesShownToThisNumber;
    if (showAllCandidates) {
      candidatesToRender = candidateList;
      limitNumberOfCandidatesShownToThisNumber = candidatesToRender.length;
    } else if (disableAutoRollUp) {
      candidatesToRender = candidateListForDisplay;
      limitNumberOfCandidatesShownToThisNumber = NUMBER_OF_CANDIDATES_TO_DISPLAY;
    } else if (supportedAndOpposedCandidatesList && supportedAndOpposedCandidatesList.length > 0) {
      candidatesToRender = supportedAndOpposedCandidatesList;
      limitNumberOfCandidatesShownToThisNumber = candidatesToRender.length;
    } else {
      candidatesToRender = candidateListForDisplay;
      limitNumberOfCandidatesShownToThisNumber = NUMBER_OF_CANDIDATES_TO_DISPLAY;
    }
    let candidateCount = 0;
    const dedupedCandidates = [];
    // console.log('------- generateCandidates ------ iFirstBallotItem ', isFirstBallotItem, officeWeVoteId);

    return (
      <BallotScrollingOuterWrapper>
        { candidatesToRender.slice(0, limitNumberOfCandidatesShownToThisNumber)
          .map((oneCandidate) => {
            if (!oneCandidate || !oneCandidate.we_vote_id || dedupedCandidates.includes(oneCandidate.we_vote_id)) return null;
            dedupedCandidates.push(oneCandidate.we_vote_id);
            candidateCount += 1;
            // console.log('OfficeItemCompressed candidateCount ', candidateCount);
            // console.log('OfficeItemCompressed generateCandidates oneCandidate: ', oneCandidate);
            const uniqueKey = `candidate_preview-${oneCandidate.we_vote_id}-${window.performance.now()}`;
            return (
              <BallotScrollingContainer
                key={uniqueKey}
                oneCandidate={oneCandidate}
                isFirstBallotItem={isFirstBallotItem}
                externalUniqueId={externalUniqueId}
                candidateCount={candidateCount}
                limitNumberOfCandidatesShownToThisNumber={limitNumberOfCandidatesShownToThisNumber}
              />
            );
          })}
      </BallotScrollingOuterWrapper>
    );
  }

  showAllCandidates () {
    this.setState({
      showAllCandidates: true,
    });
  }

  showLessCandidates () {
    this.setState({
      showAllCandidates: false,
    }, () => {
      this.targetRef.scrollIntoView({
        behavior: 'smooth',
      });
    });
  }

  goToCandidateLink (candidateWeVoteId) {
    const candidateLink = this.getCandidateLink(candidateWeVoteId);
    historyPush(candidateLink);
  }

  goToOfficeLink () {
    const officeLink = this.getOfficeLink();
    historyPush(officeLink);
  }

  localPositionListHasBeenRetrievedOnce (officeWeVoteId) {
    if (officeWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[officeWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (officeWeVoteId) {
    if (officeWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[officeWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('OfficeItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('OfficeItemCompressed render');
    let { ballotItemDisplayName } = this.props;
    const { isFirstBallotItem, officeWeVoteId, primaryParty } = this.props; // classes
    const { candidateListLength, showAllCandidates, totalNumberOfCandidates } = this.state;
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName).replace('(Unexpired)', '(Remainder)');
    const candidatesToRenderCount = this.getCandidatesToRenderCount();
    const moreCandidatesToDisplay = (candidatesToRenderCount < totalNumberOfCandidates);
    // console.log('ballotItemDisplayName:', ballotItemDisplayName, ', candidatesToRenderCount:', candidatesToRenderCount, ', totalNumberOfCandidates:', totalNumberOfCandidates, ', moreCandidatesToDisplay:', moreCandidatesToDisplay);
    return (
      <OfficeItemCompressedWrapper>
        <a // eslint-disable-line
          className="anchor-under-header"
          name={officeWeVoteId}
        />
        <div
          id={`anchor-${officeWeVoteId}`}
          ref={(ref) => { this.targetRef = ref; }}
          style={isFirstBallotItem ? { position: 'absolute', top: '-325px', left: 0 } : { position: 'absolute', top: '-260px', left: 0 }}
        />
        <OfficeNameH2>
          {ballotItemDisplayName}
          {!!(primaryParty) && (
            <PrimaryPartyWrapper>
              {' '}
              (
              {primaryParty}
              {' '}
              Primary)
            </PrimaryPartyWrapper>
          )}
        </OfficeNameH2>
        {/* *************************
          Display either a) the candidates the voter supports, or b) the first few candidates running for this office
          ************************* */}
        {this.generateCandidates(officeWeVoteId)}

        {(moreCandidatesToDisplay) ? (
          <Suspense fallback={<></>}>
            <ShowMoreButtons
              showMoreId={`officeItemCompressedShowMoreFooter-${officeWeVoteId}`}
              showMoreButtonsLink={() => this.showAllCandidates()}
              showMoreCustomText={`show all ${totalNumberOfCandidates} candidates`}
            />
          </Suspense>
        ) : (
          <>
            {(showAllCandidates && candidateListLength >= totalNumberOfCandidates) && (
              <Suspense fallback={<></>}>
                <ShowMoreButtons
                  showMoreId={`officeItemCompressedShowLessFooter-${officeWeVoteId}`}
                  showMoreButtonsLink={() => this.showLessCandidates()}
                  showMoreButtonWasClicked
                  showLessCustomText="show fewer candidates"
                />
              </Suspense>
            )}
          </>
        )}
      </OfficeItemCompressedWrapper>
    );
  }
}
OfficeItemCompressed.propTypes = {
  officeWeVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string.isRequired,
  candidateList: PropTypes.array,
  candidatesToShowForSearchResults: PropTypes.array,
  // classes: PropTypes.object,
  disableAutoRollUp: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  isFirstBallotItem: PropTypes.bool,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
  primaryParty: PropTypes.string,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: 4,
    minWidth: 60,
    height: 30,
    [theme.breakpoints.down('md')]: {
      minWidth: 60,
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
});

const PrimaryPartyWrapper = styled('span')`
  font-size: 18px;
`;

export default withTheme(withStyles(styles)(OfficeItemCompressed));
