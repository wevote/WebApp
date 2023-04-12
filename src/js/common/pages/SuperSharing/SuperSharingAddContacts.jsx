import loadable from '@loadable/component';
import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import VoterActions from '../../../actions/VoterActions';
import ShareActions from '../../actions/ShareActions';
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
import AddContactsFromGoogle from '../../components/SuperSharing/AddContactsFromGoogle';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';
import numberWithCommas from '../../utils/numberWithCommas';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';

const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class SuperSharingAddContacts extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXNewsItemWeVoteId: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
    };
  }

  componentDidMount () {
    // console.log('SuperSharingAddContacts componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
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
    initializejQuery(() => {
      VoterActions.voterContactListRetrieve();
    });
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      campaignXWeVoteId,
    } = this.state;
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevState;
    // console.log('componentDidUpdate, campaignXWeVoteId:', campaignXWeVoteId, ', campaignXWeVoteIdPrevious:', campaignXWeVoteIdPrevious);
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
        // console.log('superShareItemId:', superShareItemId);
        if (!superShareItemId || superShareItemId === 0) {
          initializejQuery(() => {
            ShareActions.superShareItemRetrieve(campaignXWeVoteId);
          });
        }
      }
    }
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
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
      campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
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
  }

  onVoterStoreChange () {
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = voterContactEmailList.length;
    const voterContactEmailGoogleCount = VoterStore.getVoterContactEmailGoogleCount();
    this.setState({
      voterContactEmailGoogleCount,
      voterContactEmailListCount,
    });
  }

  onClickDeleteGoogleContacts () {
    const deleteAllVoterContactEmails = true;
    initializejQuery(() => {
      VoterActions.voterContactListDelete(deleteAllVoterContactEmails);
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
    const { campaignXNewsItemWeVoteId } = this.state;
    if (campaignXNewsItemWeVoteId) {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-choose-email-recipients/${campaignXNewsItemWeVoteId}`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-choose-email-recipients`);
    }
  }

  returnToOtherSharingOptions = () => {
    historyPush(`${this.getCampaignBasePath()}/share-campaign`);
  }

  submitSkipForNow = () => {
    this.goToNextStep();
  }

  render () {
    renderLog('SuperSharingAddContacts');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId,
      campaignXPoliticianList, campaignXWeVoteId, chosenWebsiteName,
      voterContactEmailListCount, voterContactEmailGoogleCount,
    } = this.state;
    const htmlTitle = `Import your address book - ${chosenWebsiteName}`;
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
                atStepNumber1
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
              {(voterContactEmailListCount > 0) ? (
                <CampaignProcessStepTitle>
                  You have imported
                  {' '}
                  {numberWithCommas(voterContactEmailListCount)}
                  {' '}
                  contacts
                </CampaignProcessStepTitle>
              ) : (
                <CampaignProcessStepTitle>
                  Import your address book
                </CampaignProcessStepTitle>
              )}
              <CampaignProcessStepIntroductionText>
                Help
                {' '}
                {politicianListSentenceString}
                {' '}
                win by reaching out to your friends and community.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <AddContactsFromGoogle darkButton={voterContactEmailListCount === 0} voterContactEmailGoogleCount={voterContactEmailGoogleCount} />
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <AddContactsFromGoogle darkButton={voterContactEmailListCount === 0} mobileMode voterContactEmailGoogleCount={voterContactEmailGoogleCount} />
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  {(voterContactEmailListCount > 0) && (
                    <ContinueButtonDesktopWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDesktop }}
                          color="primary"
                          id="goToNextStepDesktop"
                          onClick={this.goToNextStep}
                          variant="contained"
                        >
                          Continue to recipients
                        </Button>
                      </CampaignSupportDesktopButtonPanel>
                    </ContinueButtonDesktopWrapper>
                  )}
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        We keep your friends&apos; emails and phone numbers secure and confidential
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        WeVote.US is a nonpartisan nonprofit and will always protect and keep private your friends&apos; contact information. We will never share or sell their contact information.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        You are in control
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        You are the only one who will be able to initiate messages to your friends, until your friends opt-in.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Delete your friends&apos; info at any time
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        You can wipe clean any information you import, any time you would like. We keep the contact info you import in a quarantined data vault, private to you.
                        {(voterContactEmailGoogleCount > 0) && (
                          <DeleteLink
                            className="u-cursor--pointer u-link-color"
                            onClick={this.onClickDeleteGoogleContacts}
                          >
                            Click to delete
                            {' '}
                            {voterContactEmailGoogleCount}
                            {' '}
                            contacts imported from Google
                          </DeleteLink>
                        )}
                      </AdviceBoxText>
                    </AdviceBox>
                  </AdviceBoxWrapper>
                  {(voterContactEmailListCount === 0) && (
                    <SkipForNowButtonWrapper>
                      <SkipForNowButtonPanel show>
                        <Button
                          classes={{ root: classes.buttonSimpleLink }}
                          color="primary"
                          id="skipForNow"
                          onClick={this.submitSkipForNow}
                        >
                          Skip for now
                        </Button>
                      </SkipForNowButtonPanel>
                    </SkipForNowButtonWrapper>
                  )}
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
                  <BottomOfPageSpacer />
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        {(voterContactEmailListCount > 0) && (
          <ButtonFooterWrapper className="u-show-mobile">
            <ButtonPanel>
              <Button
                classes={{ root: classes.buttonDefault }}
                color="primary"
                id="goToNextStep"
                onClick={this.goToNextStep}
                variant="contained"
              >
                Continue to recipients
              </Button>
            </ButtonPanel>
          </ButtonFooterWrapper>
        )}
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
SuperSharingAddContacts.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};

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

const ContinueButtonDesktopWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  width: 100%;
`;

const DeleteLink = styled('div')`
  margin-top: 8px;
`;

export default withStyles(commonMuiStyles)(SuperSharingAddContacts);
