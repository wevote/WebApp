import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { CampaignTitleText, CampaignTitleWrapper, CommentsSectionInnerWrapper, CommentsSectionOuterWrapper } from '../../components/Style/CampaignDetailsStyles';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import CampaignTopNavigation from '../../components/Navigation/CampaignTopNavigation';
import { BlockedReason } from '../../components/Style/CampaignIndicatorStyles';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import { getCampaignXValuesFromIdentifiers } from '../../utils/campaignUtils';

const CampaignCommentsList = React.lazy(() => import(/* webpackChunkName: 'CampaignCommentsList' */ '../../components/Campaign/CampaignCommentsList'));
const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));


class CampaignCommentsPage extends Component {
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
    // console.log('CampaignCommentsPage componentDidMount');
    this.onCampaignStoreChange();
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
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
      this.setState({
        campaignXWeVoteId,
        voterCanEditThisCampaign,
      });
    }
    this.setState({
      campaignTitle,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      linkedPoliticianWeVoteId,
    });
  }

  onCampaignSupporterStoreChange () {
  }

  render () {
    renderLog('CampaignCommentsPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignCommentsPage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    const {
      campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId, chosenWebsiteName,
      isBlockedByWeVote, isBlockedByWeVoteReason, linkedPoliticianWeVoteId, voterCanEditThisCampaign,
    } = this.state;
    // console.log('render campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    const htmlTitle = `Supporter Comments, ${campaignTitle} - ${chosenWebsiteName}`;
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
              <PageStatement>
                Reasons for supporting
              </PageStatement>
              <PageSubStatement>
                See why others support this campaign and why it is important to them.
              </PageSubStatement>
              <CommentsListWrapper>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignCommentsList campaignXWeVoteId={campaignXWeVoteId} />
                </Suspense>
              </CommentsListWrapper>
            </CommentsSectionInnerWrapper>
          </CommentsSectionOuterWrapper>
        </PageWrapper>
      </PageContentContainer>
    );
  }
}
CampaignCommentsPage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

// const BlockedReason = styled.div`
//   background-color: #efc2c2;
//   border-radius: 4px;
//   color: #2e3c5d;
//   font-size: 18px;
//   margin: 10px;
//   padding: 5px 12px;
// `;


const CommentsListWrapper = styled('div')`
  margin: 0 0 25px 0;
`;

const PageSubStatement = styled('div')`
  margin-top: 10px;
`;

const PageStatement = styled('h2')`
  font-size: 22px;
  margin-top: 30px;
  text-align: left;
`;

export default withStyles(styles)(CampaignCommentsPage);
