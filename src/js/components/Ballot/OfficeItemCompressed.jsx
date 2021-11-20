import { withStyles, withTheme } from '@material-ui/core/styles';
import { ArrowForward } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import OfficeActions from '../../actions/OfficeActions';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import SupportStore from '../../stores/SupportStore';
import { cordovaDot, historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { sortCandidateList } from '../../utils/positionFunctions';
import { toTitleCase } from '../../utils/textFormat';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';

const BallotItemSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeCountDisplay' */ '../Widgets/BallotItemSupportOpposeCountDisplay'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../Widgets/DelayedLoad'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const IssuesByBallotItemDisplayList = React.lazy(() => import(/* webpackChunkName: 'IssuesByBallotItemDisplayList' */ '../Values/IssuesByBallotItemDisplayList'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const ShowMoreFooter = React.lazy(() => import(/* webpackChunkName: 'ShowMoreFooter' */ '../Navigation/ShowMoreFooter'));
const TopCommentByBallotItem = React.lazy(() => import(/* webpackChunkName: 'TopCommentByBallotItem' */ '../Widgets/TopCommentByBallotItem'));

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 4;

// This is related to components/VoterGuide/VoterGuideOfficeItemCompressed
class OfficeItemCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      // changeFound: false,
      // componentDidMount: false,
      maximumNumberOrganizationsToDisplay: NUMBER_OF_CANDIDATES_TO_DISPLAY,
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.generateCandidates = this.generateCandidates.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.onCandidateStoreChange();
    const { candidateList, officeWeVoteId } = this.props;
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

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.state.componentDidMount !== nextState.componentDidMount) {
  //     // console.log('this.state.componentDidMount: ', this.state.componentDidMount, ', nextState.componentDidMount: ', nextState.componentDidMount);
  //     return true;
  //   }
  //   if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
  //     // console.log('this.state.organizationWeVoteId: ', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId: ', nextState.organizationWeVoteId);
  //     return true;
  //   }
  //   if (this.state.changeFound !== nextState.changeFound) {
  //     // console.log('this.state.changeFound: ', this.state.changeFound, ', nextState.changeFound: ', nextState.changeFound);
  //     return true;
  //   }
  //   if (this.props.ballotItemDisplayName !== nextProps.ballotItemDisplayName) {
  //     // console.log('this.props.ballotItemDisplayName: ', this.props.ballotItemDisplayName, ', nextProps.ballotItemDisplayName: ', nextProps.ballotItemDisplayName);
  //     return true;
  //   }
  //   return false;
  // }

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
      // console.log('OfficeItemCompressed onCandidateStoreChange', officeWeVoteId);
      let changeFound = false;
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

  goToCandidateLink (candidateWeVoteId) {
    const candidateLink = this.getCandidateLink(candidateWeVoteId);
    historyPush(candidateLink);
  }

  goToOfficeLink () {
    const officeLink = this.getOfficeLink();
    historyPush(officeLink);
  }

  generateCandidates () {
    const { externalUniqueId, theme } = this.props;
    let { candidatesToShowForSearchResults } = this.props;
    candidatesToShowForSearchResults = candidatesToShowForSearchResults || [];
    const { candidateList } = this.state;
    const candidatePreviewLimit = this.state.maximumNumberOrganizationsToDisplay;
    // If voter has chosen 1+ candidates, only show those
    const supportedCandidatesList = candidateList.filter((candidate) => candidatesToShowForSearchResults.includes(candidate.we_vote_id) || (SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id) && !candidate.withdrawn_from_election));
    const candidatesToRender = supportedCandidatesList.length ? supportedCandidatesList : candidateList;
    const hideCandidateDetails = supportedCandidatesList.length;
    return (
      <Container candidateLength={candidatesToRender.length}>
        { candidatesToRender.slice(0, candidatePreviewLimit)
          .map((oneCandidate) => {
            if (!oneCandidate || !oneCandidate.we_vote_id) {
              return null;
            }
            const candidatePartyText = oneCandidate.party && oneCandidate.party.length ? `${oneCandidate.party}` : '';
            const avatarCompressed = `card-main__avatar-compressed${isCordova() ? '-cordova' : ''}`;
            const avatarBackgroundImage = cordovaDot('../img/global/svg-icons/avatar-generic.svg');

            return (
              <Column
                candidateLength={candidatesToRender.length}
                key={`candidate_preview-${oneCandidate.we_vote_id}-${externalUniqueId}`}
              >
                <CandidateInfo
                  brandBlue={theme.palette.primary.main}
                  numberOfCandidatesInList={candidatesToRender.length}
                >
                  <CandidateTopRow>
                    <Candidate
                      id={`officeItemCompressedCandidateImageAndName-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                      onClick={() => this.goToCandidateLink(oneCandidate.we_vote_id)}
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
                    <BallotItemSupportOpposeCountDisplayWrapper>
                      <Suspense fallback={<></>}>
                        <BallotItemSupportOpposeCountDisplay
                          ballotItemWeVoteId={oneCandidate.we_vote_id}
                          goToBallotItem={this.goToCandidateLink}
                        />
                      </Suspense>
                    </BallotItemSupportOpposeCountDisplayWrapper>
                  </CandidateTopRow>
                  {!hideCandidateDetails && (
                    <CandidateBottomRow>
                      {/* If there is a quote about the candidate, show that. If not, show issues related to candidate */}
                      <Suspense fallback={<></>}>
                        <DelayedLoad showLoadingText waitBeforeShow={500}>
                          <TopCommentByBallotItem
                            ballotItemWeVoteId={oneCandidate.we_vote_id}
                            // learnMoreUrl={this.getCandidateLink(oneCandidate.we_vote_id)}
                            onClickFunction={this.goToCandidateLink}
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
                      <ItemActionBarWrapper>
                        <Suspense fallback={<></>}>
                          <ItemActionBar
                            ballotItemWeVoteId={oneCandidate.we_vote_id}
                            commentButtonHide
                            externalUniqueId={`OfficeItemCompressed-ItemActionBar-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                            hidePositionPublicToggle
                            positionPublicToggleWrapAllowed
                            shareButtonHide
                          />
                        </Suspense>
                      </ItemActionBarWrapper>
                    </CandidateBottomRow>
                  )}
                </CandidateInfo>
              </Column>
            );
          })}
      </Container>
    );
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
    const { officeWeVoteId, classes } = this.props;
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    const totalNumberOfCandidatesToDisplay = this.state.candidateList.length;
    // If voter has chosen 1+ candidates, hide the "Show more" link
    const { candidateList } = this.state;
    const supportedCandidatesList = candidateList.filter((candidate) => (SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id) && !candidate.withdrawn_from_election));
    const turnOffShowMoreFooter = (supportedCandidatesList && supportedCandidatesList.length > 0);
    return (
      <OfficeItemCompressedWrapper>
        <a // eslint-disable-line
          className="anchor-under-header"
          name={officeWeVoteId}
        />
        {/* Desktop */}
        <Link id={`officeItemCompressedTopNameLink-${officeWeVoteId}`} to={this.getOfficeLink()}>
          <Title>
            {ballotItemDisplayName}
            <ArrowForward
              classes={{ root: classes.cardHeaderIconRoot }}
            />
          </Title>
        </Link>
        {/* *************************
          Display either a) the candidates the voter supports, or b) the first several candidates running for this office
          ************************* */}
        {this.generateCandidates()}

        {!turnOffShowMoreFooter && (
          <Suspense fallback={<></>}>
            { totalNumberOfCandidatesToDisplay > this.state.maximumNumberOrganizationsToDisplay ?
              <ShowMoreFooter showMoreId={`officeItemCompressedShowMoreFooter-${officeWeVoteId}`} showMoreLink={() => this.goToOfficeLink()} showMoreText={`Show all ${totalNumberOfCandidatesToDisplay} candidates`} /> :
              <ShowMoreFooter showMoreId={`officeItemCompressedShowMoreFooter-${officeWeVoteId}`} showMoreLink={() => this.goToOfficeLink()} showMoreText="Learn more" />}
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
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
  theme: PropTypes.object,
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

const BallotItemSupportOpposeCountDisplayWrapper = styled.div`
  cursor: pointer;
  float: right;
`;

const Column = styled.div`
  padding: 10px;
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: ${({ candidateLength }) => (candidateLength > 1 ? '50%' : '100%')};
  }
`;

const CandidateInfo = styled.div`
  background-color: #f8f8f8;
  border: 1px solid ${({ theme }) => theme.colors.grayBorder};
  display: flex;
  flex-flow: column;
  height: 100%;
  margin: 0 !important;
  padding: 8px !important;
  transition: all 200ms ease-in;
  width: 100% !important;
  &:hover {
    border: 1px solid ${(props) => (props.brandBlue)};
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    position: relative;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 8px 8px 4px 8px !important;
    flex-flow: column;
    width: 100%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-flow: column;
  }
`;

const Candidate = styled.div`
  display: flex;
  flex-grow: 8;
`;

const CandidateName = styled.h4`
  color: #4371cc;
  font-weight: 400;
  font-size: 1.1rem;
  margin-bottom: 0 !important;
`;

const CandidateParty = styled.div`
  color: #555;
  font-size: .7rem;
`;

const CandidateTopRow = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const CandidateBottomRow = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  justify-content: space-between;
  margin-top: 4px;
`;

const Container = styled.div`
  display: flex;
  flex-flow: ${({ candidateLength }) => (candidateLength > 2 ? 'row wrap' : 'row')};
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: row wrap;
  }
  margin: 0px -10px;
`;

const ItemActionBarWrapper = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 4px;
  width: 100%;
`;

const OfficeItemCompressedWrapper = styled.div`
  border: 1px solid #fff;
  padding: 16px 16px 0px;
  font-size: 14px;
  position: relative;
  @include print {
    border-top: 1px solid #999;
    padding: 16px 0 0 0;
  }
`;

const Title = styled.h2`
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 6px;
  width: fit-content;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
    margin-bottom: 2px;
  }
`;

export default withTheme(withStyles(styles)(OfficeItemCompressed));
