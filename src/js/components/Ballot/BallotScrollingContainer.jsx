import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
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
import BallotMatchIndicator from '../BallotItem/BallotMatchIndicator';
import PositionRowListCompressed from './PositionRowListCompressed';
import BallotMatchIndicator2024 from '../BallotItem/BallotMatchIndicator2024';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import webAppConfig from '../../config';
import BallotStore from '../../stores/BallotStore';

// const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const IssuesByBallotItemDisplayList = React.lazy(() => import(/* webpackChunkName: 'IssuesByBallotItemDisplayList' */ '../Values/IssuesByBallotItemDisplayList'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));

const hideItemActionBar = false;
const hideCandidateDetails = false; // supportedCandidatesList.length;
const futureFeaturesDisabled = true;
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

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
    return (
      <BallotScrollingInnerWrapper>
        <LeftArrowOuterWrapper className="u-show-desktop-tablet">
          <LeftArrowInnerWrapper id="candidateLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, -640, this.checkArrowVisibility, 24); }}>
            {this.state.hideLeftArrow ? null : <ArrowBackIos classes={{ fontSize: 'medium' }} />}
          </LeftArrowInnerWrapper>
        </LeftArrowOuterWrapper>
        <BallotHorizontallyScrollingContainer
          ref={this.scrollElement}
          id={`ballotItemScrollingArea-${oneCandidate.we_vote_id}`}
          isChosen={this.state.isChosen}
          onScroll={this.checkArrowVisibility}
          showLeftGradient={!this.state.hideLeftArrow}
          showRightGradient={!this.state.hideRightArrow}
          hasEndorsements={this.state.hasEndorsements}
          onClick={(e) => this.handleContainerClick(e, oneCandidate.we_vote_id, `ballotItemScrollingArea-${oneCandidate.we_vote_id}`)}
          style={{ flexDirection: 'column' }}
        >
          <CandidateContainer
            data-modal-trigger
            className="u-cursor--pointer"
          >
            <CandidateWrapper>
              <CandidateInfo data-modal-trigger>
                <CandidateTopRow>
                  <Candidate data-modal-trigger>
                    {/* Candidate Image */}
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
                    {/* Candidate Name */}
                    <CandidateNameAndPartyWrapper data-modal-trigger>
                      <CandidateNameH4 data-modal-trigger showAsLink>
                        {oneCandidate.ballot_item_display_name}
                      </CandidateNameH4>
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
                </CandidateTopRow>
                <CandidateBottomRow data-modal-trigger>
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
                </CandidateBottomRow>
              </CandidateInfo>
            </CandidateWrapper>
            <PositionRowListOuterWrapper data-modal-trigger>
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
                    checkCandidateHasEndorsements={this.checkCandidateHasEndorsements}
                  />
                </PositionRowListOneWrapper>
                <PositionRowListOneWrapper>
                  <PositionRowListCompressed
                    ballotItemWeVoteId={oneCandidate.we_vote_id}
                    showOppose
                    firstInstance={isFirstBallotItem}
                    checkCandidateHasEndorsements={this.checkCandidateHasEndorsements}
                  />
                </PositionRowListOneWrapper>
              </PositionRowListInnerWrapper>
            </PositionRowListOuterWrapper>
          </CandidateContainer>

          {/* ItemActionBar, last child in the column, always below everything */}
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
        </BallotHorizontallyScrollingContainer>
        {/* {((candidateCount < candidatesToRenderLength) && (candidateCount < limitNumberOfCandidatesShownToThisNumber)) && ( */}
        {(candidateCount < limitNumberOfCandidatesShownToThisNumber) && (
          <div>
            <HrSeparator />
          </div>
        )}
        <RightArrowOuterWrapper className="u-show-desktop-tablet">
          <RightArrowInnerWrapper id="candidateRightArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, 640, this.checkArrowVisibility, 24); }}>
            {this.state.hideRightArrow ? null : <ArrowForwardIos classes={{ fontSize: 'medium' }} />}
          </RightArrowInnerWrapper>
        </RightArrowOuterWrapper>
      </BallotScrollingInnerWrapper>
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
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 12px;
  padding-left: 8px;
  padding-bottom: 12px;
  box-sizing: border-box;
`;

export default BallotScrollingContainer;
