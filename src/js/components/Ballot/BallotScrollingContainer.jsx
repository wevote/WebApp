import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { BallotHorizontallyScrollingContainer, BallotScrollingInnerWrapper, LeftArrowOuterWrapper, LeftArrowInnerWrapper, RightArrowOuterWrapper, RightArrowInnerWrapper } from '../../common/components/Style/ScrollingStyles';
import HeartFavoriteToggleLoader from '../../common/components/Widgets/HeartFavoriteToggle/HeartFavoriteToggleLoader';
import { handleHorizontalScroll, leftAndRightArrowStateCalculation } from '../../common/utils/leftRightArrowCalculation';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import AppObservableStore from '../../common/stores/AppObservableStore';
import SupportStore from '../../stores/SupportStore';
import {
  Candidate,
  CandidateBottomRow,
  CandidateContainer,
  CandidateInfo,
  CandidateNameH4,
  CandidateNameAndPartyWrapper,
  CandidateParty,
  CandidateTopRow,
  CandidateWrapper,
  CandidateImageAndMatchWrapper,
} from '../Style/BallotStyles';
import { PositionRowListInnerWrapper, PositionRowListOneWrapper, PositionRowListOuterWrapper } from '../Style/PositionRowListStyles';
import BallotMatchIndicator from './BallotMatchIndicator';
import PositionRowListCompressed from './PositionRowListCompressed';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const IssuesByBallotItemDisplayList = React.lazy(() => import(/* webpackChunkName: 'IssuesByBallotItemDisplayList' */ '../Values/IssuesByBallotItemDisplayList'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));

const hideItemActionBar = false;
const hideCandidateDetails = false; // supportedCandidatesList.length;

class BallotScrollingContainer extends Component {
  constructor (props) {
    super(props);
    this.scrollElement = React.createRef();
    this.state = {
      hideLeftArrow: true,
      hideRightArrow: false,
    };
    this.onClickShowOrganizationModalWithBallotItemInfo = this.onClickShowOrganizationModalWithBallotItemInfo.bind(this);
    this.onClickShowOrganizationModalWithPositions = this.onClickShowOrganizationModalWithPositions.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfoAndPositions = this.onClickShowOrganizationModalWithBallotItemInfoAndPositions.bind(this);
  }

  componentDidMount () {
    this.setState({
      hideLeftArrow: true,
      hideRightArrow: false,
    });
  }

  checkArrowVisibility = () => {
    const el = this.scrollElement.current;
    // console.log(el.scrollWidth);
    if (el) {
      if (el.scrollWidth < 751) {
        this.setState({
          hideLeftArrow: true,
          hideRightArrow: true,
        });
      } else {
        this.setState({
          hideLeftArrow: el.scrollLeft <= 0,
          hideRightArrow: el.scrollLeft + el.clientWidth >= el.scrollWidth,
        });
      }
    }
  };

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

  onClickShowOrganizationModalWithBallotItemInfoAndPositions (candidateWeVoteId) {
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
  }

  handleScroll = () => {
    setTimeout(() => {
      this.checkArrowVisibility();
    }, 300);
  };

  render () {
    const { oneCandidate, externalUniqueId, isFirstBallotItem, candidateCount, limitNumberOfCandidatesShownToThisNumber } = this.props;
    const candidatePartyText = oneCandidate.party && oneCandidate.party.length ? `${oneCandidate.party}` : '';
    const avatarCompressed = 'card-main__avatar-compressed';
    const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');

    const pigsCanFly = false;
    return (
      <BallotScrollingInnerWrapper>
        <LeftArrowOuterWrapper className="u-show-desktop-tablet">
          <LeftArrowInnerWrapper id="candidateLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, -640, this.checkArrowVisibility, 24); }}>
            { this.state.hideLeftArrow ? null : <ArrowBackIos classes={{ fontSize: 'medium' }} /> }
          </LeftArrowInnerWrapper>
        </LeftArrowOuterWrapper>
        <BallotHorizontallyScrollingContainer
          ref={this.scrollElement}
          isChosen={SupportStore.getVoterSupportsByBallotItemWeVoteId(oneCandidate.we_vote_id)}
          onScroll={this.handleScroll}
          showLeftGradient={!this.state.hideLeftArrow}
          showRightGradient={!this.state.hideRightArrow}
        >
          <CandidateContainer>
            <CandidateWrapper>
              <CandidateInfo>
                <CandidateTopRow>
                  <Candidate
                    id={`officeItemCompressedCandidateImageAndName-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                    onClick={() => this.onClickShowOrganizationModalWithBallotItemInfoAndPositions(oneCandidate.we_vote_id)}
                  >
                    {/* Candidate Image */}
                    <CandidateImageAndMatchWrapper>
                      <Suspense fallback={<></>}>
                        <ImageHandler
                          className={avatarCompressed}
                          sizeClassName="icon-candidate-small u-push--sm "
                          imageUrl={oneCandidate.candidate_photo_url_large}
                          alt=""
                          kind_of_ballot_item="CANDIDATE"
                          style={{ backgroundImage: { avatarBackgroundImage } }}
                        />
                      </Suspense>
                      {pigsCanFly && (
                        <BallotMatchIndicator
                          oneCandidate={oneCandidate}
                        />
                      )}
                    </CandidateImageAndMatchWrapper>

                    {/* Candidate Name */}
                    <CandidateNameAndPartyWrapper>
                      <CandidateNameH4>
                        {oneCandidate.ballot_item_display_name}
                      </CandidateNameH4>
                      <CandidateParty>
                        {candidatePartyText}
                      </CandidateParty>
                    </CandidateNameAndPartyWrapper>
                  </Candidate>
                </CandidateTopRow>
                <CandidateBottomRow>
                  {!hideCandidateDetails && (
                    <Suspense fallback={<></>}>
                      <DelayedLoad waitBeforeShow={500}>
                        <IssuesByBallotItemDisplayList
                        ballotItemDisplayName={oneCandidate.ballot_item_display_name}
                        ballotItemWeVoteId={oneCandidate.we_vote_id}
                        externalUniqueId={`officeItemCompressed-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                        />
                      </DelayedLoad>
                    </Suspense>
                  )}
                  {!hideItemActionBar && (
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
                          useHelpDefeatOrHelpWin
                        />
                      </Suspense>
                    </ItemActionBarOutsideWrapper>
                  )}
                </CandidateBottomRow>
              </CandidateInfo>
            </CandidateWrapper>
            <PositionRowListOuterWrapper>
              {!!(oneCandidate.linked_campaignx_we_vote_id) && (
                <HeartFavoriteToggleLocalWrapper>
                  <HeartFavoriteToggleLoader campaignXWeVoteId={oneCandidate.linked_campaignx_we_vote_id} />
                </HeartFavoriteToggleLocalWrapper>
              )}
              <PositionRowListInnerWrapper>
                <PositionRowListOneWrapper>
                  <PositionRowListCompressed
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                    showSupport
                    firstInstance={isFirstBallotItem}
                  />
                </PositionRowListOneWrapper>
              </PositionRowListInnerWrapper>
            </PositionRowListOuterWrapper>
          </CandidateContainer>
        </BallotHorizontallyScrollingContainer>
        {/* {((candidateCount < candidatesToRenderLength) && (candidateCount < limitNumberOfCandidatesShownToThisNumber)) && ( */}
        {(candidateCount < limitNumberOfCandidatesShownToThisNumber) && (
          <div>
            <HrSeparator />
          </div>
        )}
        <RightArrowOuterWrapper className="u-show-desktop-tablet">
          <RightArrowInnerWrapper id="candidateRightArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, 640, this.checkArrowVisibility, 24); }}>
            { this.state.hideRightArrow ? null : <ArrowForwardIos classes={{ fontSize: 'medium' }} /> }
          </RightArrowInnerWrapper>
        </RightArrowOuterWrapper>
      </BallotScrollingInnerWrapper>
    );
  }
}
BallotScrollingContainer.propTypes = {
  oneCandidate: PropTypes.object,
  externalUniqueId: PropTypes.string,
  isFirstBallotItem: PropTypes.bool,
  candidateCount: PropTypes.number,
  limitNumberOfCandidatesShownToThisNumber: PropTypes.number,
};

const HeartFavoriteToggleLocalWrapper = styled('div')`
  margin-bottom: 6px;
  max-width: 200px;
  width: 125px;
`;

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

export default BallotScrollingContainer;
