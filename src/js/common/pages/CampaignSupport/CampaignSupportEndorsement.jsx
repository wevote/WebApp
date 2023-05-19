import loadable from '@loadable/component';
import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import VoterActions from '../../../actions/VoterActions';
import VoterPhotoUpload from '../../components/Settings/VoterPhotoUpload';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../components/Style/adviceBoxStyles';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import CampaignEndorsementInputField from '../../components/CampaignSupport/CampaignEndorsementInputField';
import CampaignSupportSteps from '../../components/Navigation/CampaignSupportSteps';
import { CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportImageWrapper, CampaignSupportImageWrapperText, CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import VoterStore from '../../../stores/VoterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';

const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const VisibleToPublicCheckbox = React.lazy(() => import(/* webpackChunkName: 'VisibleToPublicCheckbox' */ '../../components/CampaignSupport/VisibleToPublicCheckbox'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class CampaignSupportEndorsement extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      linkedPoliticianWeVoteId: '',
      payToPromoteStepTurnedOn: true,
      weVoteHostedProfileImageUrlLarge: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportEndorsement componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignXPoliticianList,
      campaignXWeVoteId,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignXPoliticianList,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
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
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode;
    this.setState({
      chosenWebsiteName,
      payToPromoteStepTurnedOn,
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
      campaignXPoliticianList,
      campaignXWeVoteId,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
      campaignXPoliticianList,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
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

  onVoterStoreChange () {
    const voterPhotoUrlLarge = VoterStore.getVoterPhotoUrlLarge();
    this.setState({
      voterPhotoUrlLarge,
    });
  }

  getCampaignXBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  getPoliticianBasePath = () => {
    const { politicianSEOFriendlyPath, linkedPoliticianWeVoteId } = this.state;
    let politicianBasePath;
    if (politicianSEOFriendlyPath) {
      politicianBasePath = `/${politicianSEOFriendlyPath}/-`;
    } else if (linkedPoliticianWeVoteId) {
      politicianBasePath = `/${linkedPoliticianWeVoteId}/p`;
    } else {
      // console.log('CampaignRecommendedCampaigns getPoliticianBasePath, failed to get politicianBasePath');
      politicianBasePath = this.getCampaignXBasePath();
    }
    return politicianBasePath;
  }

  goToNextStep = () => {
    const { payToPromoteStepTurnedOn } = this.state;
    if (payToPromoteStepTurnedOn) {
      historyPush(`${this.getCampaignXBasePath()}/pay-to-promote`);
    } else {
      historyPush(`${this.getCampaignXBasePath()}/share-campaign`);
    }
  }

  submitSkipForNow = () => {
    initializejQuery(() => {
      CampaignSupporterActions.supporterEndorsementQueuedToSave(undefined);
    });
    this.goToNextStep();
  }

  submitSupporterEndorsement = () => {
    const { campaignXWeVoteId } = this.state;
    if (campaignXWeVoteId) {
      const supporterEndorsementQueuedToSave = CampaignSupporterStore.getSupporterEndorsementQueuedToSave();
      const supporterEndorsementQueuedToSaveSet = CampaignSupporterStore.getSupporterEndorsementQueuedToSaveSet();
      let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
      const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
      if (visibleToPublicChanged) {
        // If it has changed, use new value
        visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
      }
      if (supporterEndorsementQueuedToSaveSet || visibleToPublicChanged) {
        // console.log('CampaignSupportEndorsement, supporterEndorsementQueuedToSave:', supporterEndorsementQueuedToSave);
        const saveVisibleToPublic = true;
        initializejQuery(() => {
          CampaignSupporterActions.supporterEndorsementSave(campaignXWeVoteId, supporterEndorsementQueuedToSave, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
          CampaignSupporterActions.supporterEndorsementQueuedToSave(undefined);
        });
      }
      const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
      const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
      if (voterPhotoQueuedToSaveSet) {
        initializejQuery(() => {
          VoterActions.voterPhotoSave(voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
          VoterActions.voterPhotoQueuedToSave(undefined);
        });
      }
      this.goToNextStep();
    }
  }

  render () {
    renderLog('CampaignSupportEndorsement');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXPoliticianList, campaignXWeVoteId, chosenWebsiteName,
      voterPhotoUrlLarge, weVoteHostedProfileImageUrlLarge,
    } = this.state;
    const htmlTitle = `Why do you support ${campaignTitle}? - ${chosenWebsiteName}`;
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    return (
      <div>
        <Helmet title={htmlTitle} />
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignSupportSteps
                atStepNumber2
                campaignBasePath={this.getCampaignXBasePath()}
                campaignXWeVoteId={campaignXWeVoteId}
                politicianBasePath={this.getPoliticianBasePath()}
              />
              <CampaignSupportImageWrapper>
                {(campaignPhotoLargeUrl || weVoteHostedProfileImageUrlLarge) ? (
                  <>
                    {campaignPhotoLargeUrl ? (
                      <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
                    ) : (
                      <CampaignImage src={weVoteHostedProfileImageUrlLarge} alt="Campaign" />
                    )}
                  </>
                ) : (
                  <CampaignSupportImageWrapperText>
                    {campaignTitle}
                  </CampaignSupportImageWrapperText>
                )}
              </CampaignSupportImageWrapper>
              <CampaignProcessStepTitle>
                Why do you support
                {' '}
                {numberOfPoliticians > 1 ? (
                  <>these candidates?</>
                ) : (
                  <>this candidate?</>
                )}
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                People are more likely to support this campaign if it’s clear why you care. Explain how
                {' '}
                {politicianListSentenceString}
                {' '}
                winning will impact you, your family, or your community.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <CampaignEndorsementInputField campaignXWeVoteId={campaignXWeVoteId} />
                  { !voterPhotoUrlLarge && <VoterPhotoUpload /> }
                  <VisibleToPublicCheckboxWrapper>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <VisibleToPublicCheckbox campaignXWeVoteId={campaignXWeVoteId} />
                    </Suspense>
                  </VisibleToPublicCheckboxWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveSupporterEndorsement"
                        onClick={this.submitSupporterEndorsement}
                        variant="contained"
                      >
                        Save and continue
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="saveSupporterEndorsementMobile"
                        onClick={this.submitSupporterEndorsement}
                        variant="contained"
                      >
                        Save and continue
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Describe the people who will be affected if this candidate loses
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        People are most likely to vote when they understand the consequences of this candidate not being elected, described in terms of the people impacted.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Describe the benefits of this candidate winning
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Explain why this candidate or candidates winning will bring positive change.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Make it personal
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Voters are more likely to sign and support this campaign if it’s clear why you care.
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
                    </AdviceBox>
                  </AdviceBoxWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="skipSupporterEndorsementMobile"
                        onClick={this.submitSkipForNow}
                      >
                        Skip for now
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
CampaignSupportEndorsement.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


const VisibleToPublicCheckboxWrapper = styled('div')`
  min-height: 25px;
`;

export default withStyles(commonMuiStyles)(CampaignSupportEndorsement);
