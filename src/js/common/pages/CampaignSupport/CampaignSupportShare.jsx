import loadable from '@loadable/component';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import CampaignShareChunk from '../../components/Campaign/CampaignShareChunk';
import CampaignSupportSteps from '../../components/Navigation/CampaignSupportSteps';
import ShareByCopyLink from '../../components/CampaignShare/ShareByCopyLink';
import ShareByEmailButton from '../../components/CampaignShare/ShareByEmailButton';
import SendFacebookDirectMessageButton from '../../components/CampaignShare/ShareByFacebookDirectMessageButton';
import { CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportImageWrapper, CampaignSupportImageWrapperText, CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiers } from '../../utils/campaignUtils';

const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const RecommendedCampaignListRetrieveController = React.lazy(() => import(/* webpackChunkName: 'RecommendedCampaignListRetrieveController' */ '../../components/Campaign/RecommendedCampaignListRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class CampaignSupportShare extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      shareButtonClicked: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportShare componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
    });
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else if (campaignSEOFriendlyPathFromParams) {
      this.setState({
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      });
    }
    if (campaignXWeVoteId) {
      this.setState({
        campaignXWeVoteId,
      });
    } else if (campaignXWeVoteIdFromParams) {
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      });
    }
    // Take the "calculated" identifiers and retrieve so we have the voter's comment
    retrieveCampaignXFromIdentifiers(campaignSEOFriendlyPath, campaignXWeVoteId);
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignSupportShare componentDidUpdate');
    const {
      showShareCampaignWithOneFriend: showShareCampaignWithOneFriendPrevious,
    } = prevProps;
    const {
      showShareCampaignWithOneFriend,
    } = this.props;
    if (showShareCampaignWithOneFriend !== showShareCampaignWithOneFriendPrevious) {
      // this.setState({});
    }
  }

  componentWillUnmount () {
    CampaignSupporterActions.shareButtonClicked(false);
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    let recommendedCampaignXListCount = 0;
    let recommendedCampaignXListHasBeenRetrieved = false;
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
    });
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else if (campaignSEOFriendlyPathFromParams) {
      this.setState({
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      });
    }
    if (campaignXWeVoteId) {
      recommendedCampaignXListCount = CampaignStore.getRecommendedCampaignXListCount(campaignXWeVoteId);
      recommendedCampaignXListHasBeenRetrieved = CampaignStore.getRecommendedCampaignXListHasBeenRetrieved(campaignXWeVoteId);
      this.setState({
        campaignXWeVoteId,
        recommendedCampaignXListCount,
        recommendedCampaignXListHasBeenRetrieved,
      });
    } else if (campaignXWeVoteIdFromParams) {
      recommendedCampaignXListCount = CampaignStore.getRecommendedCampaignXListCount(campaignXWeVoteIdFromParams);
      recommendedCampaignXListHasBeenRetrieved = CampaignStore.getRecommendedCampaignXListHasBeenRetrieved(campaignXWeVoteIdFromParams);
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
        recommendedCampaignXListCount,
        recommendedCampaignXListHasBeenRetrieved,
      });
    }
  }

  onCampaignSupporterStoreChange () {
    const shareButtonClicked = CampaignSupporterStore.getShareButtonClicked();
    this.setState({
      shareButtonClicked,
    });
  }

  getCampaignBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }

    return campaignBasePath;
  }

  goToNextStep = () => {
    const { showShareCampaignWithOneFriend } = this.props;
    const { recommendedCampaignXListCount, recommendedCampaignXListHasBeenRetrieved, shareButtonClicked } = this.state;
    if (shareButtonClicked || showShareCampaignWithOneFriend) {
      // Since showing direct message choices is the final step,
      // link should take voter back to the campaign updates page or on to the  "recommended-campaigns"
      if (recommendedCampaignXListHasBeenRetrieved && recommendedCampaignXListCount > 0) {
        historyPush(`${this.getCampaignBasePath()}/recommended-campaigns`);
      } else {
        historyPush(`${this.getCampaignBasePath()}/updates`);
      }
    } else {
      historyPush(`${this.getCampaignBasePath()}/share-campaign-with-one-friend`);
    }
  }

  submitSkipForNow = () => {
    this.goToNextStep();
  }

  render () {
    renderLog('CampaignSupportShare');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, iWillShare, showShareCampaignWithOneFriend } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXWeVoteId, chosenWebsiteName,
      recommendedCampaignXListCount, recommendedCampaignXListHasBeenRetrieved,
      shareButtonClicked,
    } = this.state;
    let campaignProcessStepIntroductionText = 'Voters joined this campaign thanks to the people who shared it. Join them and help this campaign grow!';
    let campaignProcessStepTitle = 'Sharing leads to way more votes.';
    const htmlTitle = `Sharing ${campaignTitle} - ${chosenWebsiteName}`;
    let skipForNowText = 'Skip for now';
    if (iWillShare) {
      campaignProcessStepTitle = 'Thank you for sharing! Sharing leads to way more votes.';
    } else if (showShareCampaignWithOneFriend) {
      campaignProcessStepIntroductionText = 'Direct messages are more likely to convince people to support this campaign.';
      campaignProcessStepTitle = 'Before you go, can you help by recruiting a friend?';
      // Since showing direct message choices is the final step, link should take voter back to the campaign updates page
      // NOTE: When we add the "recommended-campaigns" feature, change this
      if (recommendedCampaignXListHasBeenRetrieved && recommendedCampaignXListCount > 0) {
        skipForNowText = 'Continue';
      } else {
        skipForNowText = 'See latest news about this campaign';
      }
    }
    const campaignDescriptionLimited = 'This is test from CampaignSupportShare.';
    return (
      <div>
        <Helmet>
          <title>{htmlTitle}</title>
          <meta
            name="description"
            content={campaignDescriptionLimited}
          />
        </Helmet>
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignSupportSteps
                atSharingStep
                campaignBasePath={this.getCampaignBasePath()}
                campaignXWeVoteId={campaignXWeVoteId}
              />
              <CampaignSupportImageWrapper>
                {campaignPhotoLargeUrl ? (
                  <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
                ) : (
                  <CampaignSupportImageWrapperText>
                    {campaignTitle}
                  </CampaignSupportImageWrapperText>
                )}
              </CampaignSupportImageWrapper>
              <CampaignProcessStepTitle>
                {campaignProcessStepTitle}
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                {campaignProcessStepIntroductionText}
              </CampaignProcessStepIntroductionText>
              {/* Before you go... */}
              {showShareCampaignWithOneFriend ? (
                <CampaignSupportSectionWrapper>
                  <CampaignSupportSection>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <SendFacebookDirectMessageButton campaignXWeVoteId={campaignXWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <ShareByEmailButton campaignXWeVoteId={campaignXWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <ShareByEmailButton campaignXWeVoteId={campaignXWeVoteId} darkButton mobileMode />
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <ShareByCopyLink campaignXWeVoteId={campaignXWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <ShareByCopyLink campaignXWeVoteId={campaignXWeVoteId} mobileMode />
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                  </CampaignSupportSection>
                </CampaignSupportSectionWrapper>
              ) : (
                <>
                  <CampaignShareChunk
                    campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                    campaignXWeVoteId={campaignXWeVoteId}
                  />
                </>
              )}
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      {shareButtonClicked ? (
                        <Button
                          classes={{ root: classes.buttonSimpleLink }}
                          color="primary"
                          id="Continue"
                          onClick={this.submitSkipForNow}
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button
                          classes={{ root: classes.buttonSimpleLink }}
                          color="primary"
                          id="skipPayToPromote"
                          onClick={this.submitSkipForNow}
                        >
                          {skipForNowText}
                        </Button>
                      )}
                    </SkipForNowButtonPanel>
                  </SkipForNowButtonWrapper>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Suspense fallback={<span>&nbsp;</span>}>
          <RecommendedCampaignListRetrieveController campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
CampaignSupportShare.propTypes = {
  classes: PropTypes.object,
  iWillShare: PropTypes.bool,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
  showShareCampaignWithOneFriend: PropTypes.bool,
};

export default withStyles(commonMuiStyles)(CampaignSupportShare);
