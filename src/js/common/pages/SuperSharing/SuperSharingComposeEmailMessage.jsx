import loadable from '@loadable/component';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import VoterActions from '../../../actions/VoterActions';
import ShareActions from '../../actions/ShareActions';
import VoterPhotoUpload from '../../components/Settings/VoterPhotoUpload';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../components/Style/adviceBoxStyles';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import ShareStore from '../../stores/ShareStore';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import SuperSharingSteps from '../../components/Navigation/SuperSharingSteps';
import { CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportImageWrapper, CampaignSupportImageWrapperText, CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import SuperShareItemComposeInputField from '../../components/SuperSharing/SuperShareItemComposeInputField';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignNewsItemStore from '../../stores/CampaignNewsItemStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';
import superSharingSuggestedEmailText from '../../utils/superSharingSuggestedEmailText';

const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class SuperSharingComposeEmailMessage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXNewsItemWeVoteId: '',
      campaignXPoliticianList: [],
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      emailRecipientList: [],
      suggestedMessage: '',
      suggestedSubject: '',
      voterPhotoUrlLarge: '',
    };
  }

  componentDidMount () {
    // console.log('SuperSharingComposeEmailMessage componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.campaignNewsItemStoreListener = CampaignNewsItemStore.addListener(this.onCampaignNewsItemStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onShareStoreChange();
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params } } = this.props;
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId: campaignXWeVoteIdFromParams,
    } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignXNewsItemWeVoteId,
      campaignXPoliticianList,
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
    // Take the "calculated" identifiers and retrieve if missing
    retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    const delayBeforeCreatingSuggestedEmailText = 200;
    this.suggestedEmailTextTimer = setTimeout(() => {
      this.createSuggestedEmailText();
    }, delayBeforeCreatingSuggestedEmailText);
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      campaignXWeVoteId,
    } = this.state;
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevState;
    // console.log('SuperSharingComposeEmailMessage componentDidUpdate, campaignXWeVoteId:', campaignXWeVoteId, ', campaignXWeVoteIdPrevious:', campaignXWeVoteIdPrevious);
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
        if (!superShareItemId || superShareItemId === 0) {
          initializejQuery(() => {
            ShareActions.superShareItemRetrieve(campaignXWeVoteId);
          });
        }
        this.setState({});
      }
    }
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignNewsItemStoreListener.remove();
    this.campaignStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.suggestedEmailTextTimer) {
      clearTimeout(this.suggestedEmailTextTimer);
    }
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId: campaignXWeVoteIdFromParams,
    } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
      campaignXNewsItemWeVoteId,
      campaignXPoliticianList,
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
    const delayBeforeCreatingSuggestedEmailText = 200;
    this.suggestedEmailTextTimer = setTimeout(() => {
      this.createSuggestedEmailText();
    }, delayBeforeCreatingSuggestedEmailText);
  }

  onCampaignNewsItemStoreChange () {
    const { campaignXNewsItemWeVoteId } = this.state;
    const mostRecentlySavedCampaignXNewsItemWeVoteId = CampaignNewsItemStore.getMostRecentlySavedCampaignXNewsItemWeVoteId();
    if (mostRecentlySavedCampaignXNewsItemWeVoteId && mostRecentlySavedCampaignXNewsItemWeVoteId !== campaignXNewsItemWeVoteId) {
      historyPush(`${this.getCampaignBasePath()}/u-preview/${mostRecentlySavedCampaignXNewsItemWeVoteId}`);
    }
  }

  onShareStoreChange () {
    // console.log('SuperSharingComposeEmailMessage onShareStoreChange');
    const { campaignXWeVoteId } = this.state;
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    const emailRecipientList = ShareStore.getEmailRecipientList(superShareItemId);
    this.setState({
      emailRecipientList,
    });
  }

  onVoterStoreChange () {
    const voterPhotoUrlLarge = VoterStore.getVoterPhotoUrlLarge();
    this.setState({
      voterPhotoUrlLarge,
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

  createSuggestedEmailText = () => {
    const { campaignTitle, campaignXPoliticianList } = this.state;
    const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    const {
      suggestedMessage,
      suggestedSubject,
    } = superSharingSuggestedEmailText(campaignTitle, politicianListSentenceString);
    this.setState({
      suggestedMessage,
      suggestedSubject,
    });
  }

  goToNextStep = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    if (campaignXNewsItemWeVoteId) {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-send-email/${campaignXNewsItemWeVoteId}`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-send-email`);
    }
  }

  returnToOtherSharingOptions = () => {
    historyPush(`${this.getCampaignBasePath()}/share-campaign`);
  }

  submitSkipForNow = () => {
    this.goToNextStep();
  }

  submitSuperSharingComposeEmailMessage = () => {
    const { campaignXNewsItemWeVoteId, campaignXWeVoteId } = this.state;
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    if (superShareItemId) {
      const personalizedMessageQueuedToSave = ShareStore.getPersonalizedMessageQueuedToSave(superShareItemId);
      const personalizedMessageQueuedToSaveSet = ShareStore.getPersonalizedMessageQueuedToSaveSet(superShareItemId);
      const personalizedSubjectQueuedToSave = ShareStore.getPersonalizedSubjectQueuedToSave(superShareItemId);
      const personalizedSubjectQueuedToSaveSet = ShareStore.getPersonalizedSubjectQueuedToSaveSet(superShareItemId);
      // console.log('SuperSharingComposeEmailMessage, personalizedMessageQueuedToSave:', personalizedMessageQueuedToSave);
      initializejQuery(() => {
        ShareActions.superShareItemSave(campaignXWeVoteId, campaignXNewsItemWeVoteId, personalizedSubjectQueuedToSave, personalizedSubjectQueuedToSaveSet, personalizedMessageQueuedToSave, personalizedMessageQueuedToSaveSet);
        ShareActions.personalizedSubjectQueuedToSave(undefined);
      });
      const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
      const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
      if (voterPhotoQueuedToSaveSet) {
        initializejQuery(() => {
          VoterActions.voterPhotoSave(voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
          VoterActions.voterPhotoQueuedToSave(undefined);
        });
      }
      // Moved here to create time separation with personalizedSubjectQueuedToSave
      initializejQuery(() => {
        ShareActions.personalizedMessageQueuedToSave(undefined);
      });
    }
    historyPush(`${this.getCampaignBasePath()}/super-sharing-send-email`);
  }

  render () {
    renderLog('SuperSharingComposeEmailMessage');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId, campaignXPoliticianList, campaignXWeVoteId, chosenWebsiteName,
      emailRecipientList, suggestedMessage, suggestedSubject, voterPhotoUrlLarge,
    } = this.state;
    const emailRecipientListCount = emailRecipientList.length;
    const htmlTitle = `Send personalized message regarding ${campaignTitle}? - ${chosenWebsiteName}`;
    // let numberOfPoliticians = 0;
    // if (campaignXPoliticianList && campaignXPoliticianList.length) {
    //   numberOfPoliticians = campaignXPoliticianList.length;
    // }
    const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    return (
      <div>
        <Helmet title={htmlTitle} />
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <SuperSharingSteps
                atStepNumber3
                campaignBasePath={this.getCampaignBasePath()}
                campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId}
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
                Personalize message
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                {emailRecipientListCount > 0 && (
                  <>
                    You have chosen to email
                    {' '}
                    {emailRecipientListCount}
                    {' '}
                    {emailRecipientListCount === 1 ? 'friend' : 'friends'}
                    .
                    {' '}
                  </>
                )}
                Feel free to make edits to the default subject and message text.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <SuperShareItemComposeInputField
                    campaignXWeVoteId={campaignXWeVoteId}
                    campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId}
                  />
                  { !voterPhotoUrlLarge && <VoterPhotoUpload /> }
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveSuperShareItemMessage"
                        onClick={this.submitSuperSharingComposeEmailMessage}
                        variant="contained"
                      >
                        Save and review
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="saveSuperShareItemMessageMobile"
                        onClick={this.submitSuperSharingComposeEmailMessage}
                        variant="contained"
                      >
                        Save and review
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Everyone will see the same text
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        The text you edit or add will be seen by everyone on your delivery list.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Don&apos;t ask for donations
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Many people are turned away from politics by what they consider to be excessive requests for donations. Support
                        {' '}
                        {politicianListSentenceString}
                        {' '}
                        here with votes, and use other venues for fundraising.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Make it personal
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Make it clear why you care.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Respect others
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Don’t bully, use hate speech, threaten violence or make things up.
                      </AdviceBoxText>
                      {(suggestedMessage && suggestedSubject) && (
                        <>
                          <AdviceBoxText>
                            &nbsp;
                          </AdviceBoxText>
                          <AdviceBoxTitle>
                            Suggested email subject and message
                          </AdviceBoxTitle>
                          <AdviceBoxText>
                            {suggestedSubject}
                            <br />
                            {suggestedMessage}
                          </AdviceBoxText>
                        </>
                      )}
                    </AdviceBox>
                  </AdviceBoxWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="skipSuperSharingChooseRecipients"
                        onClick={this.submitSkipForNow}
                      >
                        Don&apos;t save &mdash; Skip for now
                      </Button>
                    </SkipForNowButtonPanel>
                  </SkipForNowButtonWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="returnToOtherSharing"
                        onClick={this.returnToOtherSharingOptions}
                      >
                        Return to other sharing options
                      </Button>
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
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
SuperSharingComposeEmailMessage.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};

export default withStyles(commonMuiStyles)(SuperSharingComposeEmailMessage);
