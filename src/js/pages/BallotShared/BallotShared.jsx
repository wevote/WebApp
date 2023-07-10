import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import apiCalming from '../../common/utils/apiCalming';
import { chipLabelText } from '../../common/utils/cordovaUtils';
import getBooleanValue from '../../common/utils/getBooleanValue';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import BallotSharedBallotItem from '../../components/BallotShared/BallotSharedBallotItem';
import SetUpAccountNextButton from '../../components/SetUpAccount/SetUpAccountNextButton';
import { DesktopNextButtonsInnerWrapper, DesktopStaticNextButtonsOuterWrapper } from '../../components/Style/NextButtonStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import SnackNotifier, { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import ShareStore from '../../common/stores/ShareStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
// Lint is not smart enough to know that lazyPreloadPages will not attempt to preload/reload this page
// eslint-disable-next-line import/no-cycle
import lazyPreloadPages from '../../utils/lazyPreloadPages';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

const BallotTitleHeader = React.lazy(() => import(/* webpackChunkName: 'BallotTitleHeader' */ '../../components/Ballot/BallotTitleHeader'));
const ShareButtonDesktopTablet = React.lazy(() => import(/* webpackChunkName: 'ShareButtonDesktopTablet' */ '../../components/Share/ShareButtonDesktopTablet'));

class BallotShared extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemList: [],
      ballotItemListFiltered: [],
      sharedByDisplayName: '',
      sharedByFirstName: '',
      sharedByImageLarge: '',
    };
  }

  componentDidMount () {
    // console.log('BallotShared componentDidMount');
    window.scrollTo(0, 0);
    this.onAppObservableStoreChange();
    this.onBallotStoreChange();
    this.onShareStoreChange();
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.positionItemTimer = setTimeout(() => {
      // This is a performance killer, so let's delay it for a few seconds
      if (!BallotStore.ballotFound) {
        // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
        if (apiCalming('voterBallotItemsRetrieve', 3000)) {
          BallotActions.voterBallotItemsRetrieve(0, '', '');
        }
      }
    }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms

    this.analyticsTimer = setTimeout(() => {
      // AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
    }, 8000);

    this.preloadTimer = setTimeout(() => lazyPreloadPages(), 2000);
    window.scrollTo(0, 0);
  }

  componentDidUpdate () {
    if (AppObservableStore.isSnackMessagePending()) openSnackbar({});
    // if (cordovaCheckForZeroPageContentContainerPaddingTop()) {
    //   this.setState();
    // }
  }

  componentDidCatch (error, info) {
    console.log('!!!BallotShared.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.ballotStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
    clearTimeout(this.analyticsTimer);
    clearTimeout(this.modalOpenTimer);
    clearTimeout(this.positionItemTimer);
    clearTimeout(this.preloadTimer);
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('!!!Error in Ready: ', error);
    return { hasError: true };
  }

  onAppObservableStoreChange () {
    // this.setState({
    //   chosenReadyIntroductionText: AppObservableStore.getChosenReadyIntroductionText(),
    //   chosenReadyIntroductionTitle: AppObservableStore.getChosenReadyIntroductionTitle(),
    // });
  }

  onBallotStoreChange () {
    // console.log('onBallotStoreChange');
    // const { ballotItemList } = this.state;
    // const ballotItemListFiltered = this.filterBallotItemList(ballotItemList);
    // this.setState({
    //   ballotItemListFiltered,
    //   electionId: VoterStore.electionId(),
    // });
  }

  onShareStoreChange () {
    // console.log('SharedItemLanding onShareStoreChange');
    const { sharedItemCodeIncoming } = this.props;
    if (sharedItemCodeIncoming) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCodeIncoming);
      // console.log('sharedItem:', sharedItem);
      const {
        ballot_item_list: ballotItemList,
        candidate_position_list: candidatePositionList,
        shared_by_display_name: sharedByDisplayName,
        shared_by_first_name: sharedByFirstName,
        shared_by_we_vote_hosted_profile_image_url_large: sharedByImageLarge,
      } = sharedItem;
      const ballotItemListFiltered = this.filterBallotItemList(ballotItemList);
      this.setState({
        ballotItemList,
        ballotItemListFiltered,
        candidatePositionList,
        sharedByDisplayName,
        sharedByFirstName,
        sharedByImageLarge,
      });
    }
  }

  onVoterStoreChange () {
    // console.log('onVoterStoreChange voter: ', VoterStore.getVoter());
    const { ballotItemList } = this.state;
    if (ballotItemList && ballotItemList.length > 0) {
      const ballotItemListFiltered = this.filterBallotItemList(ballotItemList);
      this.setState({
        ballotItemListFiltered,
      });
    }
    this.setState({
      electionId: VoterStore.electionId(),
    });
  }

  filterBallotItemList = (incomingBallotItemList) => {
    if (!incomingBallotItemList) {
      return [];
    }
    // Remove primary ballot items when we are showing general election, and vice-versa
    const { electionId: electionIdFromVoter } = this.state;
    let electionId = electionIdFromVoter;
    if (!electionIdFromVoter) {
      // Find latest electionId referenced in ballotItems
      const arrayLength = incomingBallotItemList.length;
      let mostRecentElectionDayText = '';
      let mostRecentElectionId = 0;
      for (let i = 0; i < arrayLength; i++) {
        // console.log(incomingBallotItemList[i]);
        if (incomingBallotItemList[i].election_day_text > mostRecentElectionDayText) {
          mostRecentElectionDayText = incomingBallotItemList[i].election_day_text;
          mostRecentElectionId = incomingBallotItemList[i].google_civic_election_id;
        }
      }
      if (mostRecentElectionId > 0) {
        electionId = mostRecentElectionId;
      }
    }
    let ballotItemListFiltered = incomingBallotItemList;
    if (electionId) {
      ballotItemListFiltered = filter(ballotItemListFiltered, (ballotItem) => ballotItem.google_civic_election_id === electionId);
    }
    return ballotItemListFiltered;
  }

  candidateListForThisBallotItem = (oneBallotItem, candidatePositionList) => {
    const candidatePositionListFiltered = [];
    let candidateToOfficeLinkList;
    const arrayLength = candidatePositionList.length;
    let linkListArrayLength;
    for (let i = 0; i < arrayLength; i++) {
      // console.log(candidatePositionList[i]);
      if (candidatePositionList[i] && candidatePositionList[i].candidate_to_office_link_list) {
        candidateToOfficeLinkList = candidatePositionList[i].candidate_to_office_link_list;
        linkListArrayLength = candidateToOfficeLinkList.length;
        for (let i2 = 0; i2 < linkListArrayLength; i2++) {
          // console.log(candidateToOfficeLinkList[i2]);
          if (candidateToOfficeLinkList[i2].contest_office_we_vote_id === oneBallotItem.we_vote_id) {
            candidatePositionListFiltered.push(candidatePositionList[i]);
          }
        }
      }
    }
    return candidatePositionListFiltered;
  }

  goToBallot = () => {
    historyPush('/ballot');
  }

  getTopPadding = () => {
    if (isWebApp()) {
      return { paddingTop: '0 !important' };
    }
    cordovaSimplePageContainerTopOffset(VoterStore.getVoterIsSignedIn());
    return {};
  }

  toggleSelectBallotModal (showSelectBallotModal, showEditAddress = true) {
    AppObservableStore.setShowSelectBallotModal(!showSelectBallotModal, getBooleanValue(showEditAddress));
  }

  render () {
    renderLog('BallotShared');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemListFiltered, candidatePositionList, sharedByDisplayName, sharedByFirstName, sharedByImageLarge } = this.state;
    let htmlTitleText = 'My Voter Guide';
    if (sharedByDisplayName) {
      htmlTitleText = `${sharedByDisplayName}'s Voter Guide`;
    }
    htmlTitleText += ' - We Vote';
    let shareButtonText = 'Share this Voter Guide';
    if (sharedByFirstName) {
      shareButtonText = `Share ${sharedByFirstName}'s Voter Guide`;
    }
    let numberOfBallotItemsDisplayed = 0;
    const ballotTitleHeaderOn = false;
    const saveToBallotOn = true;
    const shareButtonOn = false;
    return (
      <>
        <PageContentContainer>
          <BallotSharedWrapper className="container-fluid" style={this.getTopPadding()}>
            <SnackNotifier />
            <Helmet title={htmlTitleText} />
            <BrowserPushMessage incomingProps={this.props} />
            <BallotTitleHeaderOuterWrapper>
              <EndorsementTitleSectionWrapper>
                {sharedByImageLarge && (
                  <SharedByPhotoImage src={sharedByImageLarge} alt="" />
                )}
                {sharedByDisplayName ? (
                  <SharedByDisplayName>
                    {sharedByDisplayName}
                    &apos;s
                    <br />
                    <span className="u-no-break">
                      Voter Guide
                    </span>
                  </SharedByDisplayName>
                ) : (
                  <SharedByDisplayName>
                    My Voter Guide
                  </SharedByDisplayName>
                )}
              </EndorsementTitleSectionWrapper>
              <div>
                {/* className="u-show-mobile" */}
                {shareButtonOn && (
                  <ShareButtonWrapper>
                    <Suspense fallback={<></>}>
                      <ShareButtonDesktopTablet shareButtonText={shareButtonText} />
                    </Suspense>
                  </ShareButtonWrapper>
                )}
                {ballotTitleHeaderOn && (
                  <Suspense fallback={<></>}>
                    <BallotTitleHeader
                      allowTextWrap
                      centerText
                      electionDateBelow
                      toggleSelectBallotModal={this.toggleSelectBallotModal}
                    />
                  </Suspense>
                )}
              </div>
              {/* <div className="u-show-desktop-tablet"> */}
              {/*  <Suspense fallback={<></>}> */}
              {/*    <BallotTitleHeader */}
              {/*      allowTextWrap */}
              {/*      electionDateBelow */}
              {/*      shareButtonText="Share this voter guide" */}
              {/*      showShareButton={shareButtonOn} */}
              {/*      toggleSelectBallotModal={this.toggleSelectBallotModal} */}
              {/*    /> */}
              {/*  </Suspense> */}
              {/* </div> */}
            </BallotTitleHeaderOuterWrapper>
            <PositionListWrapper>
              {ballotItemListFiltered.map((oneBallotItem) => {
                // console.log('oneBallotItem: ', oneBallotItem);
                numberOfBallotItemsDisplayed += 1;
                const key = oneBallotItem.we_vote_id;
                const ballotItemCandidateList = this.candidateListForThisBallotItem(oneBallotItem, candidatePositionList);
                // console.log('ballotItemCandidateList:', ballotItemCandidateList);
                return (
                  <BallotSharedBallotItem
                    ballotItemDisplayName={oneBallotItem.ballot_item_display_name}
                    candidateList={ballotItemCandidateList}
                    // candidatesToShowForSearchResults={oneBallotItem.candidatesToShowForSearchResults}
                    id={chipLabelText(oneBallotItem.ballot_item_display_name)}
                    isFirstBallotItem={numberOfBallotItemsDisplayed === 1}
                    isMeasure={oneBallotItem.kind_of_ballot_item === TYPES.MEASURE}
                    isOpposeOrNegativeRating={oneBallotItem.is_oppose_or_negative_rating}
                    isSupportOrPositiveRating={oneBallotItem.is_support_or_positive_rating}
                    statementText={oneBallotItem.statement_text}
                    weVoteId={oneBallotItem.we_vote_id}
                    key={key}
                  />
                );
              })}
            </PositionListWrapper>
          </BallotSharedWrapper>
        </PageContentContainer>
        {saveToBallotOn && (
          <DesktopStaticNextButtonsOuterWrapper breakValue={0}>
            <DesktopNextButtonsInnerWrapper>
              <SetUpAccountNextButton
                nextButtonText="Save to my ballot on We Vote"
                onClickNextButton={this.onClickNextButton}
              />
            </DesktopNextButtonsInnerWrapper>
          </DesktopStaticNextButtonsOuterWrapper>
        )}
      </>
    );
  }
}
BallotShared.propTypes = {
  sharedItemCodeIncoming: PropTypes.string,
};

const styles = (theme) => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const PositionListWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 32px;
  width: 100%;
`;

const BallotSharedWrapper = styled('div')`
  padding-bottom: 100px;
`;

const BallotTitleHeaderOuterWrapper = styled('div')`
  margin-bottom: 36px;
`;

const SharedByDisplayName = styled('div')`
  font-size: 32px;
  line-height: 1.3;
  margin-top: 24px;
  text-align: center;
`;

const ShareButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
`;

const SharedByPhotoImage = styled('img')`
  border-radius: 150px;
  max-width: 150px;
`;

const EndorsementTitleSectionWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 32px;
  width: 100%;
`;

export default withTheme(withStyles(styles)(BallotShared));
