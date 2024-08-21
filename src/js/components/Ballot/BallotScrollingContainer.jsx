import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { BallotHorizontallyScrollingContainer, BallotScrollingInnerWrapper, LeftArrowOuterWrapper, LeftArrowInnerWrapper, RightArrowOuterWrapper, RightArrowInnerWrapper } from '../../common/components/Style/ScrollingStyles';
import HeartFavoriteToggleLoader from '../../common/components/Widgets/HeartFavoriteToggle/HeartFavoriteToggleLoader';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { handleHorizontalScroll, leftAndRightArrowStateCalculation } from '../../common/utils/leftRightArrowCalculation';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import SupportStore from '../../stores/SupportStore';
import { Candidate, CandidateBottomRow, CandidateContainer, CandidateInfo, CandidateNameH4, CandidateParty, CandidateTopRow, CandidateWrapper } from '../Style/BallotStyles';
import { PositionRowListEmptyWrapper, PositionRowListInnerWrapper, PositionRowListOneWrapper, PositionRowListOuterWrapper, PositionRowListScoreColumn, PositionRowListScoreHeader, PositionRowListScoreSpacer } from '../Style/PositionRowListStyles';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';
import PositionRowEmpty from './PositionRowEmpty';
import PositionRowList from './PositionRowList';

const BallotItemSupportOpposeScoreDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeScoreDisplay' */ '../Widgets/ScoreDisplay/BallotItemSupportOpposeScoreDisplay'));
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
  }

  componentDidMount () {
    this.setState({
      hideLeftArrow: true,
      hideRightArrow: false,
    });
  }

  checkArrowVisibility = () => {
    const el = this.scrollElement.current;
    console.log(el.scrollWidth);
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
    const scoreExplanationTooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id={`scoreDescription-${oneCandidate.we_vote_id}`}>
        Your personalized score
        {oneCandidate.ballot_item_display_name && (
          <>
            {' '}
            for
            {' '}
            {oneCandidate.ballot_item_display_name}
          </>
        )}
        {' '}
        is the number of people who support this candidate, from among the people you trust. Trust by clicking the plus sign.
      </Tooltip>
    );

    const positionRowListScoreColumn = (
      <PositionRowListScoreColumn>
        <PositionRowListScoreHeader>
          <OverlayTrigger
            placement="bottom"
            overlay={scoreExplanationTooltip}
          >
            <ScoreWrapper>
              <div>
                Score
              </div>
              <InfoCircleIconWrapper>
                <InfoCircleIcon />
              </InfoCircleIconWrapper>
            </ScoreWrapper>
          </OverlayTrigger>
        </PositionRowListScoreHeader>
        <PositionRowListScoreSpacer>
          <Suspense fallback={<></>}>
            <BallotItemSupportOpposeScoreDisplay
              ballotItemWeVoteId={oneCandidate.we_vote_id}
              onClickFunction={this.onClickShowOrganizationModalWithPositions}
              hideEndorsementsOverview
              hideNumbersOfAllPositions
            />
          </Suspense>
        </PositionRowListScoreSpacer>
      </PositionRowListScoreColumn>
    );

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
                    {/* Candidate Name */}
                    <div>
                      <CandidateNameH4>
                        {oneCandidate.ballot_item_display_name}
                      </CandidateNameH4>
                      <CandidateParty>
                        {candidatePartyText}
                      </CandidateParty>
                    </div>
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
                <div>
                  {/* className="u-show-mobile" */}
                  {positionRowListScoreColumn}
                </div>
                <PositionRowListOneWrapper>
                  <PositionRowList
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                    showSupport
                    firstInstance={isFirstBallotItem}
                  />
                </PositionRowListOneWrapper>
                <PositionRowListOneWrapper>
                  <PositionRowList
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                    showOppose
                    showOpposeDisplayNameIfNoSupport
                    firstInstance={isFirstBallotItem}
                  />
                </PositionRowListOneWrapper>
                <PositionRowListOneWrapper>
                  <PositionRowList
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                    showInfoOnly
                    firstInstance={isFirstBallotItem}
                  />
                </PositionRowListOneWrapper>
                <PositionRowListEmptyWrapper>
                  <PositionRowEmpty
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                  />
                </PositionRowListEmptyWrapper>
                {/*
                <div className="u-show-desktop-tablet">
                {positionRowListScoreColumn}
                </div>
                */}
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

const InfoCircleIconWrapper = styled('div')`
  margin-bottom: -4px;
  margin-left: 3px;
`;

const ItemActionBarOutsideWrapper = styled('div')`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 12px;
  width: 100%;
`;

const ScoreWrapper = styled('div')`
  display: flex;
`;

export default BallotScrollingContainer;
