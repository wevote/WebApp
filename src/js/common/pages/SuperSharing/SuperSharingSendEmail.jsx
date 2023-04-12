import loadable from '@loadable/component';
import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import VoterActions from '../../../actions/VoterActions';
import ShareActions from '../../actions/ShareActions';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { StepCircle, StepNumber } from '../../components/Style/stepDisplayStyles';
import ShareStore from '../../stores/ShareStore';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import numberWithCommas from '../../utils/numberWithCommas';
import SuperSharingSteps from '../../components/Navigation/SuperSharingSteps';
import { CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportImageWrapper, CampaignSupportImageWrapperText, CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';
import { onStep1ClickPath, onStep2ClickPath, onStep3ClickPath } from '../../utils/superSharingStepPaths';

const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class SuperSharingSendEmail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXNewsItemWeVoteId: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      emailRecipientList: [],
      voterContactEmailListCount: 0,
    };
  }

  componentDidMount () {
    // console.log('SuperSharingSendEmail componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
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
      // campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignXNewsItemWeVoteId,
      // campaignXPoliticianList,
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
    initializejQuery(() => {
      VoterActions.voterContactListRetrieve();
    });
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevState;
    const {
      campaignXWeVoteId,
    } = this.state;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
        if (!superShareItemId || superShareItemId === 0) {
          initializejQuery(() => {
            ShareActions.superShareItemRetrieve(campaignXWeVoteId);
          });
        }
        this.onCampaignStoreChange();
        this.onShareStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
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
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignTitle,
      // campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
      // campaignXPoliticianList,
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
  }

  onShareStoreChange () {
    const { campaignXWeVoteId } = this.state;
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    if (superShareItemId) {
      const superShareItem = ShareStore.getSuperShareItemById(superShareItemId);
      const {
        personalized_message: personalizedMessage,
        personalized_subject: personalizedSubject,
      } = superShareItem;
      const emailRecipientList = ShareStore.getEmailRecipientList(superShareItemId);
      // console.log('SuperSharingSendEmail onShareStoreChange emailRecipientList:', emailRecipientList);
      this.setState({
        personalizedMessage,
        personalizedSubject,
        emailRecipientList,
      });
    }
  }

  onVoterStoreChange () {
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = voterContactEmailList.length;
    this.setState({
      voterContactEmailListCount,
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

  onStep1Click = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    const sms = false;
    const step1ClickPath = onStep1ClickPath(this.getCampaignBasePath(), campaignXNewsItemWeVoteId, sms);
    if (step1ClickPath) {
      historyPush(step1ClickPath);
    }
  }

  onStep2Click = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    const sms = false;
    const step2ClickPath = onStep2ClickPath(this.getCampaignBasePath(), campaignXNewsItemWeVoteId, sms);
    if (step2ClickPath) {
      historyPush(step2ClickPath);
    }
  }

  onStep3Click = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    const sms = false;
    const step3ClickPath = onStep3ClickPath(this.getCampaignBasePath(), campaignXNewsItemWeVoteId, sms);
    if (step3ClickPath) {
      historyPush(step3ClickPath);
    }
  }

  returnToOtherSharingOptions = () => {
    historyPush(`${this.getCampaignBasePath()}/share-campaign`);
  }

  submitSendEmail = () => {
    const { campaignXWeVoteId } = this.state;
    if (campaignXWeVoteId) {
      const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      if (superShareItemId) {
        initializejQuery(() => {
          ShareActions.superSharingSendEmail(superShareItemId);
        });
        historyPush(`${this.getCampaignBasePath()}/recommended-campaigns`);
      }
    }
  }

  render () {
    renderLog('SuperSharingSendEmail');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId, chosenWebsiteName, emailRecipientList,
      personalizedMessage, personalizedSubject,
      voterContactEmailListCount,
    } = this.state;
    const emailRecipientListCount = emailRecipientList.length;
    const htmlTitle = `Review and send email - ${chosenWebsiteName}`;
    // let numberOfPoliticians = 0;
    // if (campaignXPoliticianList && campaignXPoliticianList.length) {
    //   numberOfPoliticians = campaignXPoliticianList.length;
    // }
    // const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    return (
      <div>
        <Helmet title={htmlTitle} />
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <SuperSharingSteps
                atStepNumber4
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
                Review and send email
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                If everything looks good, click &apos;Send email&apos; below.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <StepOuterWrapper>
                    <StepInnerLeftWrapper
                      className="u-cursor--pointer"
                      onClick={this.onStep1Click}
                    >
                      <StepRow>
                        <StepCircle style={{ marginRight: '12px', minWidth: '30px' }}>
                          <StepNumber>1</StepNumber>
                        </StepCircle>
                        <div>
                          <StepNumberTitle>
                            Import your address book
                          </StepNumberTitle>
                          <StepPreviewText>
                            Contacts Imported:
                            {' '}
                            {numberWithCommas(voterContactEmailListCount)}
                          </StepPreviewText>
                        </div>
                      </StepRow>
                    </StepInnerLeftWrapper>
                    <StepInnerRightWrapper>
                      <Button
                        classes={{ root: classes.buttonMini }}
                        color="primary"
                        id="addNewContacts"
                        onClick={this.onStep1Click}
                        variant="outlined"
                      >
                        Import
                      </Button>
                    </StepInnerRightWrapper>
                  </StepOuterWrapper>
                  <StepOuterWrapper>
                    <StepInnerLeftWrapper
                      className="u-cursor--pointer"
                      onClick={this.onStep2Click}
                    >
                      <StepRow>
                        <StepCircle>
                          <StepNumber>2</StepNumber>
                        </StepCircle>
                        <div>
                          <StepNumberTitle>
                            Choose recipients
                            {' '}
                            {emailRecipientListCount === 0 && (
                              <ActionRequiredSpan>
                                *
                              </ActionRequiredSpan>
                            )}
                          </StepNumberTitle>
                          <StepPreviewText>
                            Emails to be sent:
                            {' '}
                            {emailRecipientListCount}
                            {emailRecipientListCount === 0 && (
                              <ActionRequired>
                                * Please choose 1 or more recipient
                              </ActionRequired>
                            )}
                          </StepPreviewText>
                        </div>
                      </StepRow>
                    </StepInnerLeftWrapper>
                    <StepInnerRightWrapper>
                      <Button
                        classes={{ root: classes.buttonMini }}
                        color="primary"
                        id="addNewContacts"
                        onClick={this.onStep2Click}
                        variant="outlined"
                      >
                        Select
                      </Button>
                    </StepInnerRightWrapper>
                  </StepOuterWrapper>
                  <StepOuterWrapper>
                    <StepInnerLeftWrapper
                      className="u-cursor--pointer"
                      onClick={this.onStep3Click}
                    >
                      <StepRow>
                        <StepCircle>
                          <StepNumber>3</StepNumber>
                        </StepCircle>
                        <div>
                          <StepNumberTitle>
                            Personalize message
                            {' '}
                            {!(personalizedSubject && personalizedMessage) && (
                              <ActionRequiredSpan>
                                *
                              </ActionRequiredSpan>
                            )}
                          </StepNumberTitle>
                          <StepPreviewText>
                            {personalizedSubject ? (
                              <>
                                Subject:
                                {' '}
                                {personalizedSubject}
                              </>
                            ) : (
                              <ActionRequired>
                                * Please add email subject
                              </ActionRequired>
                            )}
                            {personalizedMessage ? (
                              <StepPreviewTextMessage>
                                {personalizedMessage}
                              </StepPreviewTextMessage>
                            ) : (
                              <ActionRequired>
                                * Please add email message
                              </ActionRequired>
                            )}
                            <br />
                          </StepPreviewText>
                        </div>
                      </StepRow>
                    </StepInnerLeftWrapper>
                    <StepInnerRightWrapper>
                      <Button
                        classes={{ root: classes.buttonMini }}
                        color="primary"
                        id="addNewContacts"
                        onClick={this.onStep3Click}
                        variant="outlined"
                      >
                        Edit
                      </Button>
                    </StepInnerRightWrapper>
                  </StepOuterWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        disabled={!personalizedMessage || !personalizedSubject || emailRecipientListCount === 0}
                        id="saveSupporterEndorsement"
                        onClick={this.submitSendEmail}
                        variant="contained"
                      >
                        Send email
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="returnToOtherSharing"
                        onClick={this.returnToOtherSharingOptions}
                      >
                        Cancel
                      </Button>
                    </SkipForNowButtonPanel>
                    <BottomOfPageSpacer />
                  </SkipForNowButtonWrapper>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        <ButtonFooterWrapper className="u-show-mobile">
          <ButtonPanel>
            <Button
              classes={{ root: classes.buttonDefault }}
              color="primary"
              disabled={!personalizedMessage || !personalizedSubject || emailRecipientListCount === 0}
              id="saveSupporterEndorsementMobile"
              onClick={this.submitSendEmail}
              variant="contained"
            >
              Send email
            </Button>
          </ButtonPanel>
        </ButtonFooterWrapper>
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
SuperSharingSendEmail.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};
const buttonMini = (theme) => ({
  buttonMini: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    minWidth: '150px',
    padding: '0 24px',
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
      height: '35px !important',
      minWidth: '70px',
      padding: '0 12px',
    },
  },
});

const combinedStyles = Object.assign(buttonMini, commonMuiStyles);

const ActionRequired = styled('div')`
  color: red;
`;

const ActionRequiredSpan = styled('span')`
  color: red;
`;

const BottomOfPageSpacer = styled('div')`
  margin-bottom: 150px;
`;

const ButtonFooterWrapper = styled('div')`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

const ButtonPanel = styled('div')`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const StepInnerLeftWrapper = styled('div')`
  padding-right: 4px;
  width: 100%;
`;

const StepInnerRightWrapper = styled('div')`
`;

const StepNumberTitle = styled('div')(({ theme }) => (`
  color: ${theme.colors.brandBlue};
  font-weight: 600;
`));

const StepOuterWrapper = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-bottom: 40px;
  width: 100%;
`;

const StepPreviewText = styled('div')`
  font-size: 14px;
  margin-top: 4px;
  padding-right: 6px;
`;

const StepPreviewTextMessage = styled('div')`
  white-space: pre-wrap;
`;

const StepRow = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

export default withStyles(combinedStyles)(SuperSharingSendEmail);
