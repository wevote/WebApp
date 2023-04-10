import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OfficeActions from '../../actions/OfficeActions';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import toTitleCase from '../../common/utils/toTitleCase';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import SupportStore from '../../stores/SupportStore';
import { sortCandidateList } from '../../utils/positionFunctions';
import {
  BallotSharedCandidateNameH4,
  BallotSharedCandidateParty, BallotSharedCandidatesOuterWrapper,
  BallotSharedOfficeNameH2, BallotSharedOfficeItemWrapper,
  Candidate, CandidateBottomRow,
  CandidateTopRow,
  VoteAgainstCandidate, VoteForCandidate,
} from '../Style/BallotStyles';
import signInModalGlobalState from '../../common/components/Widgets/signInModalGlobalState';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const IssuesByBallotItemDisplayList = React.lazy(() => import(/* webpackChunkName: 'IssuesByBallotItemDisplayList' */ '../Values/IssuesByBallotItemDisplayList'));


class BallotSharedOfficeItem extends Component {
  targetRef = React.createRef();

  constructor (props) {
    super(props);
    this.state = {
      candidateListForDisplay: [],
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfoAndPositions = this.onClickShowOrganizationModalWithBallotItemInfoAndPositions.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.onCandidateStoreChange();
    const { candidateList, officeWeVoteId } = this.props;
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organizationWeVoteId;
    // console.log('BallotSharedOfficeItem componentDidMount, organizationWeVoteId:', organizationWeVoteId);
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
    console.error('BallotSharedOfficeItem caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.supportStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have "Oh snap" page
    console.log('BallotSharedOfficeItem error:', error);
    return { hasError: true };
  }

  onCandidateStoreChange () {
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('BallotSharedOfficeItem, onCandidateStoreChange');
      const { candidateList, officeWeVoteId } = this.props;
      let candidateListLength = 0;
      if (candidateList && candidateList.length > 0) {
        candidateListLength = candidateList.length;
      }
      // console.log('BallotSharedOfficeItem onCandidateStoreChange', officeWeVoteId);
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
              // console.log('original candidate:', candidate);
              newCandidate = CandidateStore.getCandidateByWeVoteId(candidate.we_vote_id);
              // console.log('candidate from retrieve:', newCandidate);
              if (newCandidate && newCandidate.we_vote_id) {
                // Preserve data from sharedItemBallotRetrieve
                newCandidate.candidate_to_office_link_list = candidate.candidate_to_office_link_list;
                newCandidate.is_oppose_or_negative_rating = candidate.is_oppose_or_negative_rating;
                newCandidate.is_support_or_positive_rating = candidate.is_support_or_positive_rating;
                newCandidate.statement_text = candidate.statement_text;
                candidateListForDisplay.push(newCandidate);
              } else {
                candidateListForDisplay.push(candidate);
              }
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

  onClickShowOrganizationModalWithBallotItemInfoAndPositions (candidateWeVoteId) {
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
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
    // let { candidatesToShowForSearchResults } = this.props;
    // candidatesToShowForSearchResults = candidatesToShowForSearchResults || [];
    const { candidateListForDisplay } = this.state;
    return candidateListForDisplay.length;
  }

  generateCandidates = () => {
    const { externalUniqueId } = this.props; // candidateList
    let { ballotItemDisplayName } = this.props; // candidatesToShowForSearchResults
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    // candidatesToShowForSearchResults = candidatesToShowForSearchResults || [];
    const { candidateListForDisplay } = this.state;
    // If voter has chosen or opposed 1+ candidates, only show those
    // const supportedCandidatesList = candidateList.filter((candidate) => candidatesToShowForSearchResults.includes(candidate.we_vote_id) || ((SupportStore.getVoterOpposesByBallotItemWeVoteId(candidate.we_vote_id) || SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id)) && !candidate.withdrawn_from_election));
    const candidatesToRender = candidateListForDisplay;
    // const candidatesToRenderLength = candidatesToRender.length;
    const hideCandidateDetails = false; // supportedCandidatesList.length;
    // let candidateCount = 0;
    return (
      <BallotSharedCandidatesOuterWrapper>
        { candidatesToRender.map((oneCandidate) => {
          if (!oneCandidate || !oneCandidate.we_vote_id) {
            return null;
          }
          // candidateCount += 1;
          const candidatePartyText = oneCandidate.party && oneCandidate.party.length ? `${oneCandidate.party}` : '';
          const avatarCompressed = 'card-main__avatar-compressed';
          const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');
          return (
            <CandidateOuterWrapper key={`candidate_preview-${oneCandidate.we_vote_id}-${externalUniqueId}`}>
              <CandidateOuterContainer>
                <CandidateInfoOuterContainer>
                  <CandidateInfoInnerContainer>
                    <CandidateTopRow>
                      <Candidate
                        id={`ballotSharedOfficeItemCandidateImageAndName-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                        onClick={() => this.onClickShowOrganizationModalWithBallotItemInfoAndPositions(oneCandidate.we_vote_id)}
                      >
                        {/* Candidate Image */}
                        <Suspense fallback={<></>}>
                          <ImageHandler
                            className={avatarCompressed}
                            sizeClassName="icon-candidate-small u-push--sm "
                            imageUrl={oneCandidate.candidate_photo_url_medium}
                            alt=""
                            kind_of_ballot_item="CANDIDATE"
                            style={{ backgroundImage: { avatarBackgroundImage } }}
                          />
                        </Suspense>
                        {/* Candidate Name */}
                        <div>
                          <BallotSharedCandidateNameH4>
                            {oneCandidate.is_support_or_positive_rating && (
                              <VoteForCandidate>
                                Vote for
                              </VoteForCandidate>
                            )}
                            {oneCandidate.is_oppose_or_negative_rating && (
                              <VoteAgainstCandidate>
                                Do not vote for
                              </VoteAgainstCandidate>
                            )}
                            <div>
                              {oneCandidate.ballot_item_display_name}
                            </div>
                          </BallotSharedCandidateNameH4>
                          {/* {candidatesToRenderLength === 1 && ( */}
                          <BallotSharedOfficeNameH2>
                            for
                            {' '}
                            {ballotItemDisplayName}
                          </BallotSharedOfficeNameH2>
                          {/* )} */}
                          <BallotSharedCandidateParty>
                            {candidatePartyText}
                          </BallotSharedCandidateParty>
                        </div>
                      </Candidate>
                    </CandidateTopRow>
                    <CandidateBottomRow>
                      {!hideCandidateDetails && (
                        <Suspense fallback={<></>}>
                          {/* If there is a quote about the candidate, show that. If not, show issues related to candidate */}
                          <DelayedLoad waitBeforeShow={500}>
                            <IssuesByBallotItemDisplayList
                              ballotItemDisplayName={oneCandidate.ballot_item_display_name}
                              ballotItemWeVoteId={oneCandidate.we_vote_id}
                              externalUniqueId={`ballotSharedOfficeItem-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                            />
                          </DelayedLoad>
                        </Suspense>
                      )}
                    </CandidateBottomRow>
                  </CandidateInfoInnerContainer>
                </CandidateInfoOuterContainer>
                {(oneCandidate.statement_text) && (
                  <PositionStatementText>
                    &quot;
                    {oneCandidate.statement_text}
                    &quot;
                  </PositionStatementText>
                )}
              </CandidateOuterContainer>
              {/* (candidateCount < candidatesToRenderLength) && (
                <div>
                  <HrSeparator />
                </div>
              ) */}
            </CandidateOuterWrapper>
          );
        })}
      </BallotSharedCandidatesOuterWrapper>
    );
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
    renderLog('BallotSharedOfficeItem');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('BallotSharedOfficeItem render');
    // let { ballotItemDisplayName } = this.props;
    const { isFirstBallotItem, officeWeVoteId } = this.props; // classes
    // ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    // const candidatesToRenderLength = this.getCandidatesToRenderCount();
    // console.log('ballotItemDisplayName:', ballotItemDisplayName, ', candidatesToRenderCount:', candidatesToRenderCount, ', totalNumberOfCandidates:', totalNumberOfCandidates, ', moreCandidatesToDisplay:', moreCandidatesToDisplay);
    return (
      <BallotSharedOfficeItemWrapper>
        <a // eslint-disable-line
          className="anchor-under-header"
          name={officeWeVoteId}
        />
        <div
          id={`anchor-${officeWeVoteId}`}
          ref={(ref) => { this.targetRef = ref; }}
          style={isFirstBallotItem ? { position: 'absolute', top: '-325px', left: 0 } : { position: 'absolute', top: '-260px', left: 0 }}
        />
        {/* candidatesToRenderLength > 1 && (
          <BallotSharedOfficeNameH2>
            {ballotItemDisplayName}
          </BallotSharedOfficeNameH2>
        ) */}
        {/* *************************
          Display either a) the candidates the voter supports, or b) the first several candidates running for this office
          ************************* */}
        {this.generateCandidates()}
      </BallotSharedOfficeItemWrapper>
    );
  }
}
BallotSharedOfficeItem.propTypes = {
  officeWeVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string.isRequired,
  candidateList: PropTypes.array,
  // candidatesToShowForSearchResults: PropTypes.array,
  // classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  isFirstBallotItem: PropTypes.bool,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
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

const CandidateInfoInnerContainer = styled('div')(({ theme }) => (`
  display: block;
  margin: 0 !important;
  padding: 8px !important;
  transition: all 200ms ease-in;
  ${theme.breakpoints.down('md')} {
    padding: 8px 8px 4px 8px !important;
  }
`));

const CandidateInfoOuterContainer = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CandidateOuterContainer = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const CandidateOuterWrapper = styled('div')`
`;

const PositionStatementText = styled('div')`
  text-align: center;
  width: 100%;
`;

// const HrSeparator = styled('hr')`
//   width: 95%;
// `;

export default withTheme(withStyles(styles)(BallotSharedOfficeItem));
