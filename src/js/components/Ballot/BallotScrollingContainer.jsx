import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { BallotHorizontallyScrollingContainer, BallotScrollingInnerWrapper, LeftArrowInnerWrapper, LeftArrowOuterWrapper, RightArrowInnerWrapper, RightArrowOuterWrapper } from '../../common/components/Style/ScrollingStyles';
import HeartFavoriteToggleLoader from '../../common/components/Widgets/HeartFavoriteToggle/HeartFavoriteToggleLoader';
import { handleHorizontalScroll } from '../../common/utils/leftRightArrowCalculation';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import AppObservableStore from '../../common/stores/AppObservableStore';
import CandidateStore from '../../stores/CandidateStore';
import PoliticianStore from '../../common/stores/PoliticianStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import {
  Candidate,
  CandidateNameH4,
  CandidateNameAndPartyWrapper,
  CandidateParty,
  CandidateImageAndMatchWrapper,
} from '../Style/BallotStyles';

import BallotMatchIndicator from '../BallotItem/BallotMatchIndicator';
import PositionRowListCompressed from './PositionRowListCompressed';
import BallotMatchIndicator2024 from '../BallotItem/BallotMatchIndicator2024';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import webAppConfig from '../../config';
import BallotStore from '../../stores/BallotStore';

// const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const CandidateOpinionsColumn = React.lazy(() => import(/* webpackChunkName: 'CandidateOpinionsColumn' */ './CandidateOpinionsColumn'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const IssuesByBallotItemDisplayList = React.lazy(() => import(/* webpackChunkName: 'IssuesByBallotItemDisplayList' */ '../Values/IssuesByBallotItemDisplayList'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));

const hideItemActionBar = false;
const hideCandidateDetails = false; // supportedCandidatesList.length;
const futureFeaturesDisabled = true;
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

// Column width constants for the 4-column candidate layout (matching measures total ~895px)
const ISSUES_WIDTH = 240;
const OPINIONS_WIDTH = 327;
const ENDORSEMENT_SINGLE = 328;
const ENDORSEMENT_BOTH = 200;

class BallotScrollingContainer extends Component {
  constructor (props) {
    super(props);
    this.scrollElement = React.createRef();
    this.resizeObserver = null;
    this.state = {
      hideLeftArrow: true,
      hideRightArrow: true,
      hasEndorsements: false,
      isChosen: SupportStore.getVoterSupportsByBallotItemWeVoteId(props.oneCandidate.we_vote_id),
    };

    this.onClickShowOrganizationModalWithBallotItemInfo = this.onClickShowOrganizationModalWithBallotItemInfo.bind(this);
    this.onClickShowOrganizationModalWithPositions = this.onClickShowOrganizationModalWithPositions.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfoAndPositions = this.onClickShowOrganizationModalWithBallotItemInfoAndPositions.bind(this);
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange);
    //  calls function when horizontal scrolling container size changes
    this.resizeObserver = new ResizeObserver(() => {
      this.checkArrowVisibility();
    });

    if (this.scrollElement.current) {
      this.resizeObserver.observe(this.scrollElement.current);
    }
  }

  componentWillUnmount () {
    if (this.supportStoreListener) {
      this.supportStoreListener.remove();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onSupportStoreChange = () => {
    const { oneCandidate } = this.props;
    this.setState({
      isChosen: SupportStore.getVoterSupportsByBallotItemWeVoteId(oneCandidate.we_vote_id),
    });
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

  onClickShowOrganizationModalWithBallotItemInfoAndPositions (candidateWeVoteId, buttonId) {
    const { location: { pathname: currentPathname } } = window;
    const currentPageDetails = lookupPageNameAndPageTypeDict(currentPathname);
    const { oneCandidate } = this.props;
    const politicianWeVoteId = oneCandidate ? oneCandidate.politician_we_vote_id : null;
    const dataLayerObject = {
      actionDetails: { actionType: 'openModal', buttonId },
      event: 'action',
      pageDetails: getPageDetails(),
      destinationDetails: {
        pageName: 'CandidateModal',
        pageType: currentPageDetails.pageType,
        pathname: currentPathname,
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    if (candidateWeVoteId) {
      dataLayerObject.candidateDetails = CandidateStore.getAnalyticsCandidateDetails(candidateWeVoteId);
    }
    const electionDetails = BallotStore.getAnalyticsElectionDetails();
    if (electionDetails && electionDetails.electionDate) {
      dataLayerObject.electionDetails = electionDetails;
    }
    if (politicianWeVoteId) {
      const politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
      // Only include fields that have valid values
      const filteredPoliticianDetails = {};
      Object.entries(politicianDetails).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          filteredPoliticianDetails[key] = value;
        }
      });
      if (Object.keys(filteredPoliticianDetails).length > 0) {
        dataLayerObject.politicianDetails = filteredPoliticianDetails;
      }
    }
    // console.log('Pushing to dataLayer:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
  }

  checkArrowVisibility = () => {
    const el = this.scrollElement.current;
    if (el) {
      if (el.scrollWidth > el.clientWidth) {
        this.setState({
          hideLeftArrow: el.scrollLeft <= 0,
          hideRightArrow: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
        });
      } else {
        this.setState({
          hideLeftArrow: true,
          hideRightArrow: true,
        });
      }
    }
  };

  // Add data-modal-trigger attribute to elements that should be triggered
  handleContainerClick = (e, weVoteId, buttonId) => {
    const { target } = e;
    if (target.hasAttribute('data-modal-trigger')) {
      this.onClickShowOrganizationModalWithBallotItemInfoAndPositions(weVoteId, buttonId);
    }
  };

  checkCandidateHasEndorsements = (value) => {
    this.setState({ hasEndorsements: value });
  };

  render () {
    const {
      candidateCount, externalUniqueId, isFirstBallotItem,
      limitNumberOfCandidatesShownToThisNumber, oneCandidate, useHelpDefeatOrHelpWin,
    } = this.props;
    const {
      hasEndorsements, hideLeftArrow, hideRightArrow, isChosen,
    } = this.state;
    const candidatePartyText = oneCandidate.party && oneCandidate.party.length ? `${oneCandidate.party}` : '';
    const avatarCompressed = 'card-main__avatar-compressed';
    const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');
    // Placeholder for dynamic match level
    const matchLevel = 'Good Match';

    // Convert matchLevel string to boolean props
    const isBestMatch = matchLevel === 'Best Match';
    const isGoodMatch = matchLevel === 'Good Match';
    const isFairMatch = matchLevel === 'Fair Match';
    const isPoorMatch = matchLevel === 'Poor Match';
    const isItAMatch = matchLevel === 'Is it a Match?';
    const noData = matchLevel === 'No Data';
    const pigsCanFly = false;

    const positionCounts = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(oneCandidate.we_vote_id);
    const hasSupport = positionCounts.numberOfAllSupportPositions > 0;
    const hasOppose = positionCounts.numberOfAllOpposePositions > 0;
    const endorsementColWidth = (hasSupport && hasOppose) ? ENDORSEMENT_BOTH : ENDORSEMENT_SINGLE;

    return (
      <CandidateCardWrapper $isChosen={isChosen}>
        <BallotScrollingInnerWrapper>
          <LeftArrowOuterWrapper className="u-show-desktop-tablet">
            <LeftArrowInnerWrapper id="candidateLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, -640, this.checkArrowVisibility, 24); }}>
              {hideLeftArrow ? null : <ArrowBackIos classes={{ fontSize: 'medium' }} />}
            </LeftArrowInnerWrapper>
          </LeftArrowOuterWrapper>
          <BallotHorizontallyScrollingContainer
            ref={this.scrollElement}
            id={`ballotItemScrollingArea-${oneCandidate.we_vote_id}`}
            isChosen={false}
            onScroll={this.checkArrowVisibility}
            showLeftGradient={!hideLeftArrow}
            showRightGradient={!hideRightArrow}
            hasEndorsements={hasEndorsements}
            onClick={(e) => this.handleContainerClick(e, oneCandidate.we_vote_id, `ballotItemScrollingArea-${oneCandidate.we_vote_id}`)}
            style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'normal', borderBottom: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
          >
            {/* Top row: Candidate identity - inside scrollable area */}
            <CandidateTopSection
              data-modal-trigger
              className="u-cursor--pointer"
            >
              <CandidateNameRow>
                <Candidate data-modal-trigger>
                  <CandidateImageAndMatchWrapper data-modal-trigger>
                    <Suspense fallback={<></>}>
                      <ImageHandler
                        className={avatarCompressed}
                        ballotItemWeVoteId={oneCandidate.we_vote_id}
                        sizeClassName="icon-candidate-small u-push--sm "
                        imageUrl={oneCandidate.candidate_photo_url_large}
                        alt=""
                        kind_of_ballot_item="CANDIDATE"
                        style={{ backgroundImage: { avatarBackgroundImage } }}
                      />
                    </Suspense>
                    {pigsCanFly && (
                      <BallotMatchIndicator oneCandidate={oneCandidate} />
                    )}
                  </CandidateImageAndMatchWrapper>
                  <CandidateNameAndPartyWrapper data-modal-trigger>
                    <CandidateNameWithHeart>
                      <CandidateNameH4
                        data-modal-trigger
                        showAsLink
                      >
                        {oneCandidate.ballot_item_display_name}
                      </CandidateNameH4>
                      {!!(oneCandidate.linked_campaignx_we_vote_id) && (
                        <HeartFavoriteToggleLocalWrapper>
                          <HeartFavoriteToggleLoader campaignXWeVoteId={oneCandidate.linked_campaignx_we_vote_id} />
                        </HeartFavoriteToggleLocalWrapper>
                      )}
                    </CandidateNameWithHeart>
                    <CandidateParty data-modal-trigger>
                      {candidatePartyText}
                    </CandidateParty>
                    {pigsCanFly && (
                      <BallotMatchIndicator2024
                        isBestMatch={isBestMatch}
                        isGoodMatch={isGoodMatch}
                        isFairMatch={isFairMatch}
                        isPoorMatch={isPoorMatch}
                        isItAMatch={isItAMatch}
                        noData={noData}
                      />
                    )}
                  </CandidateNameAndPartyWrapper>
                </Candidate>
              </CandidateNameRow>
            </CandidateTopSection>

            {/* Columns row: issues | support | oppose | opinions */}
            <ColumnsRow>

              {/* Left column: Issues */}
              <IssuesColumn style={{ flex: `0 0 ${ISSUES_WIDTH}px`, maxWidth: ISSUES_WIDTH }}>
                {!hideCandidateDetails && (
                <Suspense fallback={<></>}>
                  <IssuesByBallotItemDisplayList
                    ballotItemDisplayName={oneCandidate.ballot_item_display_name}
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                    externalUniqueId={`officeItemCompressed-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                    handleContainerClick={(e) => this.handleContainerClick(e, oneCandidate.we_vote_id, `officeItemCompressed-${oneCandidate.we_vote_id}-${externalUniqueId}`)}
                  />
                </Suspense>
                )}
              </IssuesColumn>

              {/* Support column */}
              {hasSupport && (
              <FlexColumn data-modal-trigger style={{ flex: `0 0 ${endorsementColWidth}px`, maxWidth: endorsementColWidth }}>
                <PositionRowListCompressed
                  ballotItemWeVoteId={oneCandidate.we_vote_id}
                  showSupport
                  firstInstance={isFirstBallotItem}
                  checkCandidateHasEndorsements={this.checkCandidateHasEndorsements}
                />
              </FlexColumn>
              )}

              {/* Oppose column */}
              {hasOppose && (
              <FlexColumn data-modal-trigger style={{ flex: `0 0 ${endorsementColWidth}px`, maxWidth: endorsementColWidth }}>
                <PositionRowListCompressed
                  ballotItemWeVoteId={oneCandidate.we_vote_id}
                  showOppose
                  firstInstance={isFirstBallotItem}
                  checkCandidateHasEndorsements={this.checkCandidateHasEndorsements}
                />
              </FlexColumn>
              )}

              {/* Right column: Opinions */}
              <CandidateOpinionsColumnWrapper style={{ flex: `0 0 ${OPINIONS_WIDTH}px`, maxWidth: OPINIONS_WIDTH }}>
                <Suspense fallback={<></>}>
                  <CandidateOpinionsColumn
                    candidateWeVoteId={oneCandidate.we_vote_id}
                    politicianWeVoteId={oneCandidate.politician_we_vote_id}
                  />
                </Suspense>
              </CandidateOpinionsColumnWrapper>
            </ColumnsRow>
          </BallotHorizontallyScrollingContainer>
          {(candidateCount < limitNumberOfCandidatesShownToThisNumber) && (
          <div>
            <HrSeparator />
          </div>
          )}
          <RightArrowOuterWrapper className="u-show-desktop-tablet">
            <RightArrowInnerWrapper id="candidateRightArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, 640, this.checkArrowVisibility, 24); }}>
              {hideRightArrow ? null : <ArrowForwardIos classes={{ fontSize: 'medium' }} />}
            </RightArrowInnerWrapper>
          </RightArrowOuterWrapper>
        </BallotScrollingInnerWrapper>
        {/* ItemActionBar below the scrolling area, full width */}
        {!hideItemActionBar && (
          <ItemActionBarOutsideWrapper>
            <Suspense fallback={<></>}>
              <ItemActionBar
                ballotItemWeVoteId={oneCandidate.we_vote_id}
                ballotItemDisplayName={oneCandidate.ballot_item_display_name}
                commentButtonHide
                externalUniqueId={`OfficeItemCompressed-ItemActionBar-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                hidePositionPublicToggle={!futureFeaturesDisabled && nextReleaseFeaturesEnabled}
                politicianWeVoteId={oneCandidate.politician_we_vote_id}
                positionPublicToggleWrapAllowed
                shareButtonHide
                showCandidateStaffAndChat
                useHelpDefeatOrHelpWin={useHelpDefeatOrHelpWin}
              />
            </Suspense>
          </ItemActionBarOutsideWrapper>
        )}
      </CandidateCardWrapper>
    );
  }
}

BallotScrollingContainer.propTypes = {
  externalUniqueId: PropTypes.string,
  isFirstBallotItem: PropTypes.bool,
  candidateCount: PropTypes.number,
  limitNumberOfCandidatesShownToThisNumber: PropTypes.number,
  oneCandidate: PropTypes.object,
  useHelpDefeatOrHelpWin: PropTypes.bool,
};

// Styles

const CandidateCardWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isChosen',
})(({ $isChosen }) => `
  display: flex;
  flex-direction: column;
  background-color: ${$isChosen ? DesignTokenColors.confirmation50 : ''};
  box-shadow: ${$isChosen ? '0 2px 4px rgba(0, 0, 0, 0.12)' : 'none'};
  transition: box-shadow 0.2s ease, background-color 0.3s ease;
  border-bottom: 1px solid #ddd;
  margin-bottom: 12px;
  &:hover {
    background-color: ${$isChosen ? DesignTokenColors.confirmation50 : DesignTokenColors.neutral50};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  }
  ${LeftArrowOuterWrapper},
  ${RightArrowOuterWrapper} {
    background: transparent;
  }
`);

const CandidateNameRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 4px;
`;

const CandidateNameWithHeart = styled('div')`
  display: flex;
  align-items: center;
  gap: 4px;
  & button {
    white-space: nowrap;
  }
`;

// CandidateOpinionsColumnWrapper depends on IssuesColumn and FlexColumn
// CandidateTopSection has no dependencies

const CandidateTopSection = styled('div')`
  padding: 0 8px;
`;

const ColumnsRow = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: stretch;
`;

// IssuesColumn must be before FlexColumn (FlexColumn references it)
const IssuesColumn = styled('div')`
  padding: 0 16px 8px 8px;
  &:not(:has(span, img, a, button)) {
    display: none !important;
    // Related to ticket WV-4269
    //flex: 0 0 85px;
    //max-width: 85px;
`;

// FlexColumn must be before CandidateOpinionsColumnWrapper (it references FlexColumn)
const FlexColumn = styled('div')`
  border-left: 1px solid #ddd;
  padding-left: 16px;
  &:first-child {
    border-left: none;
    padding-left: 0;
  }
  ${IssuesColumn}:not(:has(span, img, a, button)) + & {
    border-left: none;
    padding-left: 0;
  }
`;

const CandidateOpinionsColumnWrapper = styled('div')`
  overflow: hidden;
  ${IssuesColumn}:has(span, img, a, button) ~ &,
  ${FlexColumn} ~ & {
    border-left: 1px solid #ddd;
    padding-left: 16px;
  }
`;

const HeartFavoriteToggleLocalWrapper = styled('div')`
  margin-left: 18px;
  max-width: 200px;
  width: 125px;
`;

const HrSeparator = styled('hr')`
  width: 95%;
`;

const ItemActionBarOutsideWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 12px;
  padding-left: 8px;
  padding-bottom: 12px;
  box-sizing: border-box;
`;

export default BallotScrollingContainer;
