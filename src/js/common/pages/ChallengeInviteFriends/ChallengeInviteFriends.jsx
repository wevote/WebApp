import loadable from '@loadable/component';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import ChallengeHeaderSimple from '../../components/Navigation/ChallengeHeaderSimple';
import { CampaignSupportSection, CampaignSupportSectionWrapper } from '../../components/Style/CampaignSupportStyles';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStore from '../../stores/ChallengeStore';
import { getChallengeValuesFromIdentifiers, retrieveChallengeFromIdentifiersIfNeeded } from '../../utils/challengeUtils';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import DesignTokenColors from '../../components/Style/DesignTokenColors';
import ChallengeInviteSteps from '../../components/Navigation/ChallengeInviteSteps';
import ChallengeInviteeListRoot from '../../components/ChallengeInviteeListRoot/ChallengeInviteeListRoot';
import ChallengeInviteeStore from '../../stores/ChallengeInviteeStore';
import InviteFriendsTips from '../../components/ChallengeInviteFriends/InviteFriendsTips';
import InviteFriendToChallengeInput from '../../components/ChallengeInviteFriends/InviteFriendToChallengeInput';
import YourRank from '../../components/Challenge/YourRank';

const ChallengeRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeRetrieveController' */ '../../components/Challenge/ChallengeRetrieveController'));
const FirstChallengeInviteeListController = React.lazy(() => import(/* webpackChunkName: 'ChallengeRetrieveController' */ '../../components/ChallengeInviteeListRoot/FirstChallengeInviteeListController'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class ChallengeInviteFriends extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengePhotoLargeUrl: '',
      challengeSEOFriendlyPath: '',
      challengeTitle: '',
      challengeWeVoteId: '',
      chosenWebsiteName: '',
      inviteeList: [],
    };
  }

  componentDidMount () {
    // console.log('ChallengeInviteFriends componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onChallengeInviteeStoreChange();
    this.challengeInviteeStoreListener = ChallengeInviteeStore.addListener(this.onChallengeInviteeStoreChange.bind(this));
    this.onChallengeStoreChange();
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams, challengeWeVoteId: challengeWeVoteIdFromParams } = params;
    // console.log('componentDidMount challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
    const {
      challengePhotoLargeUrl,
      challengeSEOFriendlyPath,
      // challengePoliticianList,
      challengeWeVoteId,
      // linkedPoliticianWeVoteId,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
    this.setState({
      challengePhotoLargeUrl,
      // challengePoliticianList,
      // linkedPoliticianWeVoteId,
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
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      challengeWeVoteId: prevChallengeWeVoteId,
    } = prevState;
    const {
      challengeWeVoteId,
    } = this.state;
    if (challengeWeVoteId !== prevChallengeWeVoteId) {
      this.onChallengeInviteeStoreChange();
    }
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.challengeInviteeStoreListener.remove();
    this.challengeStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    this.setState({
      chosenWebsiteName,
    });
  }

  onChallengeInviteeStoreChange () {
    const { challengeWeVoteId } = this.state;
    if (challengeWeVoteId) {
      const inviteeList = ChallengeInviteeStore.getChallengeInviteeList(challengeWeVoteId);
      this.setState({
        inviteeList,
      });
    }
  }

  onChallengeStoreChange () {
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams, challengeWeVoteId: challengeWeVoteIdFromParams } = params;
    // console.log('onChallengeStoreChange challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
    const {
      challengePhotoLargeUrl,
      challengeSEOFriendlyPath,
      challengeTitle,
      // challengePoliticianList,
      challengeWeVoteId,
      // linkedPoliticianWeVoteId,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
    this.setState({
      challengePhotoLargeUrl,
      challengeTitle,
      // challengePoliticianList,
      // linkedPoliticianWeVoteId,
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

  goToChallengeHome = () => {
    historyPush(`${this.getChallengeBasePath()}leaderboard`);
  }

  render () {
    renderLog('ChallengeInviteFriends');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      challengePhotoLargeUrl, challengeSEOFriendlyPath, challengeTitle,
      challengeWeVoteId, chosenWebsiteName, inviteeList,
    } = this.state;
    const htmlTitle = `Invite your friends - ${chosenWebsiteName}`;
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
        <ChallengeTabsWrapper>
          <ChallengeInviteSteps
            currentStep={1}
            challengeSEOFriendlyPath={challengeSEOFriendlyPath}
          />
        </ChallengeTabsWrapper>
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <InviteFriendsTips startingTipName="nameEachFriend" />
              <CampaignSupportSectionWrapper marginTopOff>
                <CampaignSupportSection marginBottomOff>
                  <InviteFriendToChallengeInput challengeWeVoteId={challengeWeVoteId} />
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        <InvitedFriendsWrapper>
          <YourRank challengeSEOFriendlyPath={challengeSEOFriendlyPath} challengeWeVoteId={challengeWeVoteId} />
          <ChallengeInviteeListRoot challengeWeVoteId={challengeWeVoteId} hideRank />
        </InvitedFriendsWrapper>
        <Suspense fallback={<span>&nbsp;</span>}>
          <ChallengeRetrieveController challengeSEOFriendlyPath={challengeSEOFriendlyPath} challengeWeVoteId={challengeWeVoteId} />
        </Suspense>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
        <Suspense fallback={<></>}>
          <FirstChallengeInviteeListController challengeWeVoteId={challengeWeVoteId} />
        </Suspense>
      </div>
    );
  }
}
ChallengeInviteFriends.propTypes = {
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


const ChallengeTabsWrapper = styled('div')`
  background-color: ${DesignTokenColors.neutralUI50};
  display: flex;
  justify-content: center;
`;

const InvitedFriendsWrapper = styled('div')`
  align-items: center;
  background-color: ${DesignTokenColors.neutralUI50};
  display: flex;
  flex-direction: column;
`;

export default withStyles(commonMuiStyles)(ChallengeInviteFriends);
