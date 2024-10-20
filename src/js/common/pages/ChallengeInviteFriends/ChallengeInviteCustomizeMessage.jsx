import loadable from '@loadable/component';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import ChallengeHeaderSimple from '../../components/Navigation/ChallengeHeaderSimple';
import {
  SupportButtonFooterWrapper, SupportButtonPanel,
} from '../../components/Style/CampaignDetailsStyles';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStore from '../../stores/ChallengeStore';
import VoterStore from '../../../stores/VoterStore';
import { getChallengeValuesFromIdentifiers, retrieveChallengeFromIdentifiersIfNeeded } from '../../utils/challengeUtils';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import ChallengeInviteSteps from '../../components/Navigation/ChallengeInviteSteps';
import DesignTokenColors from '../../components/Style/DesignTokenColors';
import ThanksForJoiningChallenge from '../../components/ChallengeInviteFriends/ThanksForJoiningChallenge';
import { CampaignSupportSection, CampaignSupportSectionWrapper } from '../../components/Style/CampaignSupportStyles';
import CustomizeInviteTextForFriendsInput from '../../components/ChallengeInviteFriends/CustomizeInviteTextForFriendsInput';
import { CampaignProcessStepIntroductionText } from '../../components/Style/CampaignProcessStyles';

const ChallengeRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeRetrieveController' */ '../../components/Challenge/ChallengeRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class ChallengeInviteCustomizeMessage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengePhotoLargeUrl: '',
      challengeSEOFriendlyPath: '',
      challengeTitle: '',
      challengeWeVoteId: '',
      chosenWebsiteName: '',
      showChallengeThanksForJoining: false,
    };
  }

  componentDidMount () {
    // console.log('ChallengeInviteCustomizeMessage componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onChallengeStoreChange();
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams, challengeWeVoteId: challengeWeVoteIdFromParams } = params;
    // console.log('componentDidMount challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
    const {
      challengePhotoLargeUrl,
      challengeSEOFriendlyPath,
      challengeWeVoteId,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
    this.setState({
      challengePhotoLargeUrl,
    });
    if (challengeSEOFriendlyPath) {
      this.setState({
        challengeSEOFriendlyPath,
      });
    } else if (challengeSEOFriendlyPathFromParams) {
      this.setState({
        challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams,
      });
    }
    if (challengeWeVoteId) {
      this.setState({
        challengeWeVoteId,
      });
    } else if (challengeWeVoteIdFromParams) {
      this.setState({
        challengeWeVoteId: challengeWeVoteIdFromParams,
      });
    }
    // Take the "calculated" identifiers and retrieve if missing
    retrieveChallengeFromIdentifiersIfNeeded(challengeSEOFriendlyPath, challengeWeVoteId);
    window.scrollTo(0, 0);
    // When testing the ThanksForJoiningChallenge component, turn this on
    // AppObservableStore.setShowChallengeThanksForJoining(true);
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.challengeStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const showChallengeThanksForJoining = AppObservableStore.showChallengeThanksForJoining();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    this.setState({
      chosenWebsiteName,
      showChallengeThanksForJoining,
    });
  }

  onChallengeStoreChange () {
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams, challengeWeVoteId: challengeWeVoteIdFromParams } = params;
    // console.log('onChallengeStoreChange challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
    const {
      challengePhotoLargeUrl,
      challengeSEOFriendlyPath,
      challengeTitle,
      challengeWeVoteId,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
    this.setState({
      challengePhotoLargeUrl,
      challengeTitle,
    });
    if (challengeSEOFriendlyPath) {
      this.setState({
        challengeSEOFriendlyPath,
      });
    } else if (challengeSEOFriendlyPathFromParams) {
      this.setState({
        challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams,
      });
    }
    if (challengeWeVoteId) {
      this.setState({
        challengeWeVoteId,
      });
    } else if (challengeWeVoteIdFromParams) {
      this.setState({
        challengeWeVoteId: challengeWeVoteIdFromParams,
      });
    }
  }

  getChallengeBasePath = () => {
    const { challengeSEOFriendlyPath, challengeWeVoteId } = this.state;
    let challengeBasePath;
    if (challengeSEOFriendlyPath) {
      challengeBasePath = `/${challengeSEOFriendlyPath}/+/`;
    } else {
      challengeBasePath = `/+/${challengeWeVoteId}/`;
    }
    return challengeBasePath;
  }

  goToNextStep = () => {
    historyPush(`${this.getChallengeBasePath()}invite-friends`);
  }

  goToChallengeHome = () => {
    historyPush(`${this.getChallengeBasePath()}leaderboard`);
  }

  saveInviteTextForFriendsAndGoToNextStep = () => {
    const { challengeWeVoteId } = this.state;
    if (challengeWeVoteId) {
      // We may want to do this save here in the future
      // ChallengeParticipantActions.challengeParticipantSave(challengeWeVoteId, inviteTextForFriends, inviteTextForFriendsChanged);
      this.goToNextStep();
    }
  }

  render () {
    renderLog('ChallengeInviteCustomizeMessage');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      challengePhotoLargeUrl, challengeSEOFriendlyPath, challengeTitle,
      challengeWeVoteId, chosenWebsiteName, showChallengeThanksForJoining,
    } = this.state;
    const htmlTitle = `Customize the message to your friends for ${challengeTitle}? - ${chosenWebsiteName}`;
    const footerNextButtonOn = false;
    const voterFirstName = VoterStore.getFirstName();
    return (
      <div>
        <Helmet>
          <title>{htmlTitle}</title>
          <meta name="robots" content="noindex" data-react-helmet="true" />
        </Helmet>
        <ChallengeHeaderSimple
          challengeBasePath={this.getChallengeBasePath()}
          challengePhotoLargeUrl={challengePhotoLargeUrl}
          challengeTitle={challengeTitle}
          challengeWeVoteId={challengeWeVoteId}
          goToChallengeHome={this.goToChallengeHome}
        />
        {showChallengeThanksForJoining && (
          <ThanksForJoiningChallenge
            voterFirstName={VoterStore.getFirstName()}
            challengeTitle={challengeTitle}
            onClose={() => AppObservableStore.setShowChallengeThanksForJoining(false)}
          />
        )}
        <ChallengeTabsWrapper>
          <ChallengeInviteSteps
            currentStep={1}
            challengeSEOFriendlyPath={challengeSEOFriendlyPath}
          />
        </ChallengeTabsWrapper>
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignProcessStepIntroductionText>
                Hi [your friend&apos;s name]
                {voterFirstName && (
                  <>
                    , it&apos;s
                    {' '}
                    {voterFirstName}
                  </>
                )}
                .
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper marginTopOff>
                <CampaignSupportSection marginBottomOff>
                  <CustomizeInviteTextForFriendsInput
                    challengeWeVoteId={challengeWeVoteId}
                    goToNextStep={this.goToNextStep}
                  />
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        {footerNextButtonOn && (
          <SupportButtonFooterWrapper>
            <SupportButtonPanel>
              <CenteredDiv>
                <StackedDiv>
                  <Button
                    // classes={{ root: classes.buttonDefault }}
                    color="primary"
                    id="joinChallengeNowMobile"
                    onClick={this.saveInviteTextForFriendsAndGoToNextStep}
                    variant="contained"
                  >
                    Next
                  </Button>
                </StackedDiv>
              </CenteredDiv>
            </SupportButtonPanel>
          </SupportButtonFooterWrapper>
        )}
        <Suspense fallback={<span>&nbsp;</span>}>
          <ChallengeRetrieveController challengeSEOFriendlyPath={challengeSEOFriendlyPath} challengeWeVoteId={challengeWeVoteId} />
        </Suspense>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
ChallengeInviteCustomizeMessage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


const CenteredDiv = styled('div')`
  display: flex;
  justify-content: center;
`;

const ChallengeTabsWrapper = styled('div')`
  background-color: ${DesignTokenColors.neutralUI50};
  display: flex;
  justify-content: center;
`;

const StackedDiv = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 620px;
  min-width: 300px;
`;

export default withStyles(commonMuiStyles)(ChallengeInviteCustomizeMessage);
