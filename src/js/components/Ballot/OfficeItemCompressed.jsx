import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OfficeActions from '../../actions/OfficeActions';
import historyPush from '../../common/utils/historyPush';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import toTitleCase from '../../common/utils/toTitleCase';
import AppObservableStore from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import SupportStore from '../../stores/SupportStore';
import { sortCandidateList } from '../../utils/positionFunctions';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import PositionRowEmpty from './PositionRowEmpty';
import PositionRowList from './PositionRowList';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';

const BallotItemSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeCountDisplay' */ '../Widgets/BallotItemSupportOpposeCountDisplay'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const IssuesByBallotItemDisplayList = React.lazy(() => import(/* webpackChunkName: 'IssuesByBallotItemDisplayList' */ '../Values/IssuesByBallotItemDisplayList'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const ShowMoreFooter = React.lazy(() => import(/* webpackChunkName: 'ShowMoreFooter' */ '../Navigation/ShowMoreFooter'));
const TopCommentByBallotItem = React.lazy(() => import(/* webpackChunkName: 'TopCommentByBallotItem' */ '../Widgets/TopCommentByBallotItem'));

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 3;

// This is related to components/VoterGuide/VoterGuideOfficeItemCompressed
class OfficeItemCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      limitNumberOfCandidatesShownToThisNumber: NUMBER_OF_CANDIDATES_TO_DISPLAY,
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.onClickShowOrganizationModalWithAllInfo = this.onClickShowOrganizationModalWithAllInfo.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfo = this.onClickShowOrganizationModalWithBallotItemInfo.bind(this);
    this.onClickShowOrganizationModalWithPositions = this.onClickShowOrganizationModalWithPositions.bind(this);
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
    this.setState({
      candidateListLength,
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
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
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
      this.setState({
        candidateListLength,
      });
      // console.log('OfficeItemCompressed onCandidateStoreChange', officeWeVoteId);
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
        const newCandidateList = [];
        let newCandidate = {};
        if (candidateList) {
          candidateList.forEach((candidate) => {
            if (candidate && candidate.we_vote_id) {
              newCandidate = CandidateStore.getCandidate(candidate.we_vote_id);
              if (newCandidate && newCandidate.we_vote_id) {
                newCandidateList.push(newCandidate);
              } else {
                newCandidateList.push(candidate);
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
              newCandidateList.push(candidate);
            }
          });
        }
        let sortedCandidateList = {};
        if (newCandidateList && newCandidateList.length) {
          sortedCandidateList = sortCandidateList(newCandidateList);
          const { totalNumberOfBallotItems } = this.props;
          const limitCandidatesShownBecauseMoreThanFourBallotItems = (totalNumberOfBallotItems && totalNumberOfBallotItems > 4);
          if (!limitCandidatesShownBecauseMoreThanFourBallotItems) {
            // If the ballot is only show 5 ballot items, then don't limit the number of candidates we show
            this.setState({
              limitNumberOfCandidatesShownToThisNumber: newCandidateList.length,
            });
          }
        }
        this.setState({
          candidateList: sortedCandidateList,
          // changeFound,
        });
      }
    }
  }

  onSupportStoreChange () {
    // Trigger a re-render so we show/hide candidates as voter support changes
    this.setState({});
  }

  onClickShowOrganizationModalWithAllInfo (candidateWeVoteId) {
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
  }

  onClickShowOrganizationModalWithBallotItemInfo (candidateWeVoteId) {
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalPositions(true);
  }

  onClickShowOrganizationModalWithPositions (candidateWeVoteId) {
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
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

  generateCandidates = () => {
    const { externalUniqueId } = this.props;
    let { candidatesToShowForSearchResults } = this.props;
    candidatesToShowForSearchResults = candidatesToShowForSearchResults || [];
    const { candidateList, limitNumberOfCandidatesShownToThisNumber } = this.state;
    // If voter has chosen 1+ candidates, only show those
    const supportedCandidatesList = candidateList.filter((candidate) => candidatesToShowForSearchResults.includes(candidate.we_vote_id) || (SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id) && !candidate.withdrawn_from_election));
    const candidatesToRender = supportedCandidatesList.length ? supportedCandidatesList : candidateList;
    const candidatesToRenderLength = candidatesToRender.length;
    const hideCandidateDetails = supportedCandidatesList.length;
    let candidateCount = 0;
    return (
      <CandidatesContainer>
        { candidatesToRender.slice(0, limitNumberOfCandidatesShownToThisNumber)
          .map((oneCandidate) => {
            if (!oneCandidate || !oneCandidate.we_vote_id) {
              return null;
            }
            candidateCount += 1;
            const candidatePartyText = oneCandidate.party && oneCandidate.party.length ? `${oneCandidate.party}` : '';
            const avatarCompressed = `card-main__avatar-compressed${isCordova() ? '-cordova' : ''}`;
            const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');

            return (
              <div key={`candidate_preview-${oneCandidate.we_vote_id}-${externalUniqueId}`}>
                <CandidateContainer>
                  <CandidateWrapper>
                    <CandidateInfo>
                      <CandidateTopRow>
                        <Candidate
                          id={`officeItemCompressedCandidateImageAndName-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                          onClick={() => (isMobileScreenSize() ? this.onClickShowOrganizationModalWithAllInfo(oneCandidate.we_vote_id) : this.onClickShowOrganizationModalWithBallotItemInfo(oneCandidate.we_vote_id))}
                        >
                          {/* Candidate Image */}
                          <Suspense fallback={<></>}>
                            <ImageHandler
                              className={avatarCompressed}
                              sizeClassName="icon-candidate-small u-push--sm "
                              imageUrl={oneCandidate.candidate_photo_url_medium}
                              alt="candidate-photo"
                              kind_of_ballot_item="CANDIDATE"
                              style={{ backgroundImage: { avatarBackgroundImage } }}
                            />
                          </Suspense>
                          {/* Candidate Name */}
                          <div>
                            <CandidateName>
                              {oneCandidate.ballot_item_display_name}
                            </CandidateName>
                            <CandidateParty>
                              {candidatePartyText}
                            </CandidateParty>
                          </div>
                        </Candidate>
                        {/*  /!* Show check mark or score *!/ */}
                        <BallotItemSupportOpposeCountDisplayWrapper className="u-show-mobile">
                          <Suspense fallback={<></>}>
                            <BallotItemSupportOpposeCountDisplay
                              ballotItemWeVoteId={oneCandidate.we_vote_id}
                              goToBallotItem={this.onClickShowOrganizationModalWithPositions}
                            />
                          </Suspense>
                        </BallotItemSupportOpposeCountDisplayWrapper>
                      </CandidateTopRow>
                      <CandidateBottomRow>
                        {!hideCandidateDetails && (
                          <Suspense fallback={<></>}>
                            {/* If there is a quote about the candidate, show that. If not, show issues related to candidate */}
                            <DelayedLoad showLoadingText waitBeforeShow={500}>
                              <TopCommentByBallotItem
                                ballotItemWeVoteId={oneCandidate.we_vote_id}
                                // learnMoreUrl={this.getCandidateLink(oneCandidate.we_vote_id)}
                                // onClickFunction={this.onClickShowOrganizationModal}
                              >
                                <span>
                                  <Suspense fallback={<></>}>
                                    <IssuesByBallotItemDisplayList
                                      ballotItemDisplayName={oneCandidate.ballot_item_display_name}
                                      ballotItemWeVoteId={oneCandidate.we_vote_id}
                                      disableMoreWrapper
                                      externalUniqueId={`officeItemCompressed-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                                    />
                                  </Suspense>
                                </span>
                              </TopCommentByBallotItem>
                            </DelayedLoad>
                          </Suspense>
                        )}
                        {!hideCandidateDetails && (
                          <ItemActionBarOutsideWrapper>
                            <Suspense fallback={<></>}>
                              <ItemActionBar
                                ballotItemWeVoteId={oneCandidate.we_vote_id}
                                ballotItemDisplayName={oneCandidate.ballot_item_display_name}
                                commentButtonHide
                                externalUniqueId={`OfficeItemCompressed-ItemActionBar-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                                hidePositionPublicToggle
                                positionPublicToggleWrapAllowed
                                shareButtonHide
                              />
                            </Suspense>
                          </ItemActionBarOutsideWrapper>
                        )}
                      </CandidateBottomRow>
                    </CandidateInfo>
                  </CandidateWrapper>
                  <PositionRowListOuterWrapper className="u-show-desktop-tablet">
                    <OverflowContainer>
                      <PositionRowListInnerWrapper>
                        <PositionRowListScoreColumn>
                          <PositionRowListScoreHeader>
                            Score
                          </PositionRowListScoreHeader>
                          <PositionRowListScoreSpacer>
                            <Suspense fallback={<></>}>
                              <BallotItemSupportOpposeCountDisplay
                                ballotItemWeVoteId={oneCandidate.we_vote_id}
                                goToBallotItem={this.onClickShowOrganizationModalWithPositions}
                                hideEndorsementsOverview
                                hideNumbersOfAllPositions
                              />
                            </Suspense>
                          </PositionRowListScoreSpacer>
                        </PositionRowListScoreColumn>
                        <PositionRowListOneWrapper>
                          <PositionRowList
                            ballotItemWeVoteId={oneCandidate.we_vote_id}
                            showSupport
                          />
                        </PositionRowListOneWrapper>
                        <PositionRowListOneWrapper>
                          <PositionRowList
                            ballotItemWeVoteId={oneCandidate.we_vote_id}
                            showOppose
                          />
                        </PositionRowListOneWrapper>
                        <PositionRowListOneWrapper>
                          <PositionRowList
                            ballotItemWeVoteId={oneCandidate.we_vote_id}
                            showInfoOnly
                          />
                        </PositionRowListOneWrapper>
                        <PositionRowListEmptyWrapper>
                          <PositionRowEmpty
                            ballotItemWeVoteId={oneCandidate.we_vote_id}
                          />
                        </PositionRowListEmptyWrapper>
                      </PositionRowListInnerWrapper>
                    </OverflowContainer>
                  </PositionRowListOuterWrapper>
                </CandidateContainer>
                {((candidateCount < candidatesToRenderLength) && (candidateCount < limitNumberOfCandidatesShownToThisNumber)) && (
                  <div>
                    <HrSeparator />
                  </div>
                )}
              </div>
            );
          })}
      </CandidatesContainer>
    );
  }

  showAllCandidates () {
    this.setState({
      limitNumberOfCandidatesShownToThisNumber: 99,
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
    const { officeWeVoteId } = this.props; // classes
    const { limitNumberOfCandidatesShownToThisNumber } = this.state;
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    // If voter has chosen 1+ candidates, hide the "Show more" link
    const { candidateList, candidateListLength } = this.state;
    const supportedCandidatesList = candidateList.filter((candidate) => (SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id) && !candidate.withdrawn_from_election));
    const thereIsAtLeastOneSupportedCandidate = supportedCandidatesList.length > 0;
    const moreCandidatesToDisplay = limitNumberOfCandidatesShownToThisNumber < candidateListLength;
    return (
      <OfficeItemCompressedWrapper>
        <a // eslint-disable-line
          className="anchor-under-header"
          name={officeWeVoteId}
        />
        <Title>
          {ballotItemDisplayName}
        </Title>
        {/* *************************
          Display either a) the candidates the voter supports, or b) the first several candidates running for this office
          ************************* */}
        {this.generateCandidates()}

        {(moreCandidatesToDisplay && !thereIsAtLeastOneSupportedCandidate) && (
          <Suspense fallback={<></>}>
            <ShowMoreFooter
              hideArrow
              showMoreId={`officeItemCompressedShowMoreFooter-${officeWeVoteId}`}
              showMoreLink={() => this.showAllCandidates()}
              showMoreText={`Show all ${candidateListLength} candidates`}
              textAlign="left"
            />
          </Suspense>
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
  externalUniqueId: PropTypes.string,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
  totalNumberOfBallotItems: PropTypes.number,
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

const BallotItemSupportOpposeCountDisplayWrapper = styled('div')`
  cursor: pointer;
  float: right;
`;

const Candidate = styled('div')`
  display: flex;
  flex-grow: 8;
`;

const CandidateBottomRow = styled('div')`
  margin-top: 4px;
`;

const CandidateContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  padding: 10px;
`;

const CandidateInfo = styled('div')(({ theme }) => (`
  border: 1px solid #fff;
  display: block;
  height: 100%;
  margin: 0 !important;
  padding: 8px !important;
  transition: all 200ms ease-in;
  ${theme.breakpoints.down('md')} {
    padding: 8px 8px 4px 8px !important;
  }
`));

const CandidateName = styled('h4')`
  color: #4371cc;
  font-weight: 400;
  font-size: 20px;
  margin-bottom: 0 !important;
  min-width: 124px;
  &:hover {
    text-decoration: underline;
  }
`;

const CandidateParty = styled('div')`
  color: #555;
`;

const CandidatesContainer = styled('div')`
  height: 100%;
  margin: 0px -10px;
  min-width: 0;
  width: 100%;
`;

const CandidateTopRow = styled('div')`
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const CandidateWrapper = styled('div')(({ theme }) => (`
  width: 320px;
  ${theme.breakpoints.down('sm')} {
    width: 100%;
  }
  ${theme.breakpoints.up('sm')} {
    min-width: 320px;
  }
`));

const HrSeparator = styled('hr')`
  width: 95%;
`;

const ItemActionBarOutsideWrapper = styled('div')`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 12px;
  width: 100%;
`;

const OfficeItemCompressedWrapper = styled('div')`
  display: flex;
  border: 1px solid #fff;
  flex-direction: column;
  height: 100%;
  position: relative;
  @include print {
    border-top: 1px solid #999;
    padding: 16px 0 0 0;
  }
`;

const OverflowContainer = styled('div')`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
`;

const PositionRowListInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const PositionRowListEmptyWrapper = styled('div')`
`;

const PositionRowListOneWrapper = styled('div')`
`;

const PositionRowListOuterWrapper = styled('div')`
  margin-left: 48px;
  margin-top: 10px;
`;

const PositionRowListScoreColumn = styled('div')`
  padding-right: 0;
`;

const PositionRowListScoreHeader = styled('div')`
  border-bottom: 1px solid #dcdcdc;
  color: #ccc;
  line-height: 20px;
  margin-top: 0;
`;

const PositionRowListScoreSpacer = styled('div')`
  cursor: pointer;
  margin-top: 85px;
  margin-right: 7px;
`;

const Title = styled('h2')(({ theme }) => (`
  font-size: 32px;
  margin-bottom: 6px;
  width: fit-content;
  ${theme.breakpoints.down('lg')} {
    font-size: 24px;
    margin-bottom: 2px;
  }
`));

export default withTheme(withStyles(styles)(OfficeItemCompressed));
