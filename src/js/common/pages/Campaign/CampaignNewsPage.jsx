import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { CampaignTitleText, CampaignTitleWrapper, CommentsListWrapper, CommentsSectionInnerWrapper, CommentsSectionOuterWrapper, SupportButtonPanel } from '../../components/Style/CampaignDetailsStyles';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import CampaignTopNavigation from '../../components/Navigation/CampaignTopNavigation';
import { BlockedReason } from '../../components/Style/CampaignIndicatorStyles';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignNewsStore from '../../stores/CampaignNewsItemStore';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers } from '../../utils/campaignUtils';

const CampaignNewsItemList = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemList' */ '../../components/Campaign/CampaignNewsItemList'));
const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const CampaignNewsItemCreateButton = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemCreateButton' */ '../../components/CampaignNewsItemPublish/CampaignNewsItemCreateButton'));

class CampaignNewsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      isBlockedByWeVote: false,
      isBlockedByWeVoteReason: '',
      linkedPoliticianWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsPage componentDidMount');
    this.onCampaignStoreChange();
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignNewsStoreListener = CampaignNewsStore.addListener(this.onCampaignNewsStoreChange.bind(this));
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else {
      this.setState({
        campaignXWeVoteId,
      });
    }
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.campaignNewsStoreListener.remove();
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
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      linkedPoliticianWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    }
    if (campaignXWeVoteId) {
      const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
      const voterCanSendUpdatesToThisCampaign = CampaignStore.getVoterCanSendUpdatesToThisCampaign(campaignXWeVoteId);
      this.setState({
        campaignXWeVoteId,
        voterCanEditThisCampaign,
        voterCanSendUpdatesToThisCampaign,
      });
    }
    this.setState({
      campaignTitle,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      linkedPoliticianWeVoteId,
    });
  }

  onCampaignNewsStoreChange () {
  }

  render () {
    renderLog('CampaignNewsPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignNewsPage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    const {
      campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId, chosenWebsiteName,
      isBlockedByWeVote, isBlockedByWeVoteReason, linkedPoliticianWeVoteId,
      voterCanEditThisCampaign, voterCanSendUpdatesToThisCampaign,
    } = this.state;
    // console.log('render campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    const htmlTitle = `Updates, ${campaignTitle} - ${chosenWebsiteName}`;
    if (isBlockedByWeVote && !voterCanEditThisCampaign) {
      return (
        <PageContentContainer>
          <PageWrapper>
            <Helmet>
              <title>{htmlTitle}</title>
            </Helmet>
            <CampaignTitleWrapper>
              <CampaignTitleText>{campaignTitle}</CampaignTitleText>
            </CampaignTitleWrapper>
            <BlockedReason>
              This campaign has been blocked by moderators from WeVote because it is currently violating our terms of service. It is only visible campaign owners. If you have any questions,
              {' '}
              <OpenExternalWebSite
                linkIdAttribute="weVoteSupport"
                url="https://help.wevote.us/hc/en-us/requests/new"
                target="_blank"
                body={<span>please contact WeVote support.</span>}
              />
              {isBlockedByWeVoteReason && (
                <>
                  <br />
                  <hr />
                  &quot;
                  {isBlockedByWeVoteReason}
                  &quot;
                </>
              )}
            </BlockedReason>
          </PageWrapper>
        </PageContentContainer>
      );
    }
    return (
      <PageContentContainer>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet title={htmlTitle} />
        <PageWrapper>
          <CampaignTitleWrapper>
            <CampaignTitleText>{campaignTitle}</CampaignTitleText>
          </CampaignTitleWrapper>
          {isBlockedByWeVote && (
            <BlockedReason>
              Your campaign has been blocked by moderators from WeVote. Please make any requested modifications so you are in compliance with our terms of service and
              {' '}
              <OpenExternalWebSite
                linkIdAttribute="weVoteSupport"
                url="https://help.wevote.us/hc/en-us/requests/new"
                target="_blank"
                body={<span>contact WeVote support for help.</span>}
              />
              {isBlockedByWeVoteReason && (
                <>
                  <br />
                  <hr />
                  &quot;
                  {isBlockedByWeVoteReason}
                  &quot;
                </>
              )}
            </BlockedReason>
          )}
          <CampaignTopNavigation
            campaignSEOFriendlyPath={campaignSEOFriendlyPath}
            campaignXWeVoteId={campaignXWeVoteId}
            politicianWeVoteId={linkedPoliticianWeVoteId}
          />
          <CommentsSectionOuterWrapper>
            <CommentsSectionInnerWrapper>
              <PageStatementWrapper>
                <PageStatement>
                  Recent Updates
                </PageStatement>
                {voterCanSendUpdatesToThisCampaign && (
                  <CampaignNewsButtonDesktopWrapper className="u-show-desktop-tablet">
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <CampaignNewsItemCreateButton
                        campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                        campaignXWeVoteId={campaignXWeVoteId}
                      />
                    </Suspense>
                  </CampaignNewsButtonDesktopWrapper>
                )}
              </PageStatementWrapper>
              <CommentsListWrapper>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignNewsItemList campaignXWeVoteId={campaignXWeVoteId} startingNumberOfNewsItemsToDisplay={3} />
                </Suspense>
              </CommentsListWrapper>
            </CommentsSectionInnerWrapper>
          </CommentsSectionOuterWrapper>
        </PageWrapper>
        {voterCanSendUpdatesToThisCampaign && (
          <CampaignNewsButtonFooterWrapper className="u-show-mobile">
            <SupportButtonPanel>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignNewsItemCreateButton
                  campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                  campaignXWeVoteId={campaignXWeVoteId}
                />
              </Suspense>
            </SupportButtonPanel>
          </CampaignNewsButtonFooterWrapper>
        )}
      </PageContentContainer>
    );
  }
}
CampaignNewsPage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

const CampaignNewsButtonDesktopWrapper = styled('div')`
`;

const CampaignNewsButtonFooterWrapper = styled('div')`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

const PageStatement = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

const PageStatementWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  @media (min-width: 576px) {
    min-width: 500px;
  }
`;

export default withStyles(styles)(CampaignNewsPage);
