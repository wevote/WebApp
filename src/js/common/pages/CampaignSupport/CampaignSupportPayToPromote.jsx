import loadable from '@loadable/component';
import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import CampaignSupportSteps from '../../components/Navigation/CampaignSupportSteps';
import { CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportImageWrapper, CampaignSupportImageWrapperText, CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';

const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ '../../components/CampaignSupport/CampaignSupportThermometer'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class CampaignSupportPayToPromote extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      linkedPoliticianWeVoteId: '',
      voterFirstName: '',
      weVoteHostedProfileImageUrlLarge: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportPayToPromote componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
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
      campaignXWeVoteId,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
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
    const voterFirstName = VoterStore.getVoterFirstName();
    this.setState({
      voterFirstName,
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

  goToIWillChipIn = () => {
    const pathForNextStep = `${this.getCampaignXBasePath()}/pay-to-promote-process`;
    historyPush(pathForNextStep);
  }

  goToIWillShare = () => {
    const pathForNextStep = `${this.getCampaignXBasePath()}/i-will-share-campaign`;
    historyPush(pathForNextStep);
  }

  submitSkipForNow = () => {
    const pathForNextStep = `${this.getCampaignXBasePath()}/share-campaign-with-one-friend`;
    historyPush(pathForNextStep);
  }

  render () {
    renderLog('CampaignSupportPayToPromote');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromUrl } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromUrl: ', campaignSEOFriendlyPathFromUrl);
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId,
      chosenWebsiteName, voterFirstName, weVoteHostedProfileImageUrlLarge,
    } = this.state;
    const htmlTitle = `Chip in to support ${campaignTitle} - ${chosenWebsiteName}`;
    let chipInDescriptionText1 = '';
    if (voterFirstName) {
      chipInDescriptionText1 += voterFirstName;
      chipInDescriptionText1 += ', it can take a lot of time to personally encourage your friends to vote. ';
    } else {
      chipInDescriptionText1 += 'Personally encouraging your friends to vote can take a lot of your time. ';
    }
    const chipInDescriptionText2 = (
      <>
        WeVote.US (a nonpartisan nonprofit) is here to help you reach more voters in a fraction of the time.
        {' '}
        Chipping in allows WeVote.US to:
        <ul>
          <li>
            <strong>Find like-minded people</strong>
            {' '}
            who can vote for the candidates in this campaign
          </li>
          <li>
            <strong>Distribute this campaign</strong>
            {' '}
            to people through ads and our website
          </li>
        </ul>
        This campaign can achieve its goals if everyone chips in. Can you help reach the supporter goal?
      </>
    );
    const chipInDescriptionText2TextOnly = 'WeVote.US (a nonpartisan nonprofit) is here to help you reach more voters in a fraction of the time. Chipping in allows WeVote.US to find like-minded people who can vote for the candidates in this campaign, and distribute this campaign to people through ads and our website. This campaign can achieve its goals if everyone chips in. Can you help reach the supporter goal?';
    return (
      <div>
        <Helmet>
          <title>{htmlTitle}</title>
          {campaignSEOFriendlyPathFromUrl ? (
            <link rel="canonical" href={`https://wevote.us/c/${campaignSEOFriendlyPathFromUrl}/pay-to-promote`} />
          ) : (
            <>
              {campaignSEOFriendlyPath && (
                <link rel="canonical" href={`https://wevote.us/c/${campaignSEOFriendlyPath}/pay-to-promote`} />
              )}
            </>
          )}
          <meta name="description" content={`${chipInDescriptionText1} ${chipInDescriptionText2TextOnly}`} />
        </Helmet>
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignSupportSteps
                atPayToPromoteStep
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
                Can you chip in $3 to get this campaign in front of more people?
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                {chipInDescriptionText1}
                {chipInDescriptionText2}
              </CampaignProcessStepIntroductionText>
              <CampaignThermometerWrapper>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer campaignXWeVoteId={campaignXWeVoteId} />
                </Suspense>
              </CampaignThermometerWrapper>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="submitPayToPromoteDesktop"
                        onClick={this.goToIWillChipIn}
                        variant="contained"
                      >
                        Yes, I&apos;ll chip in $3 to boost this campaign
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="submitPayToPromoteMobile"
                        onClick={this.goToIWillChipIn}
                        variant="contained"
                      >
                        Yes, I&apos;ll chip in $3
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="shareInsteadOfPayToPromoteDesktop"
                        onClick={this.goToIWillShare}
                        variant="outlined"
                      >
                        No, I&apos;ll share instead
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="shareInsteadOfPayToPromoteMobile"
                        onClick={this.goToIWillShare}
                        variant="outlined"
                      >
                        No, I&apos;ll share instead
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="skipPayToPromote"
                        onClick={this.submitSkipForNow}
                      >
                        Sorry, I can&apos;t do anything right now
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
CampaignSupportPayToPromote.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


const CampaignThermometerWrapper = styled('div')`
  margin-top: 25px;
  min-height: 75px;
`;

export default withStyles(commonMuiStyles)(CampaignSupportPayToPromote);
