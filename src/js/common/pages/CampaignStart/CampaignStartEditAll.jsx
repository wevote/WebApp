import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import CampaignStartActions from '../../actions/CampaignStartActions';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { OuterWrapper, PageWrapper } from '../../components/Style/stepDisplayStyles';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AddCandidateInputField from '../../components/CampaignStart/AddPoliticianInputField';
import CampaignDescriptionInputField from '../../components/CampaignStart/CampaignDescriptionInputField';
import CampaignPhotoUpload from '../../components/CampaignStart/CampaignPhotoUpload';
import CampaignTitleInputField from '../../components/CampaignStart/CampaignTitleInputField';
import EditPoliticianList from '../../components/CampaignStart/EditPoliticianList';
import { BlockedReason } from '../../components/Style/CampaignIndicatorStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStartStore from '../../stores/CampaignStartStore';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';


const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));


class CampaignStartEditAll extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSEOFriendlyPath: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      isBlockedByWeVote: false,
      isBlockedByWeVoteReason: false,
      voterIsCampaignXOwner: true, // Start by assuming true
    };
  }

  componentDidMount () {
    // console.log('CampaignStartEditAll, componentDidMount');
    const { editExistingCampaign } = this.props;
    if (this.props.setShowHeaderFooter) {
      this.props.setShowHeaderFooter(false);
    }
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    if (editExistingCampaign) {
      const { match: { params } } = this.props;
      const {
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      } = params;
      // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
      const {
        campaignSEOFriendlyPath,
        campaignXWeVoteId,
        isBlockedByWeVote,
        isBlockedByWeVoteReason,
        voterIsCampaignXOwner,
      } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
      this.setState({
        isBlockedByWeVote,
        isBlockedByWeVoteReason,
        voterIsCampaignXOwner,
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
    } else {
      initializejQuery(() => {
        CampaignStartActions.campaignRetrieveAsOwner('');
        CampaignStartActions.campaignEditAllReset();
      });
    }
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    if (this.props.setShowHeaderFooter) {
      this.props.setShowHeaderFooter(true);
    }
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { editExistingCampaign } = this.props;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    if (editExistingCampaign) {
      const { match: { params } } = this.props;
      const {
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      } = params;
      // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
      const {
        campaignSEOFriendlyPath,
        campaignXWeVoteId,
        isBlockedByWeVote,
        isBlockedByWeVoteReason,
        voterIsCampaignXOwner,
      } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
      this.setState({
        isBlockedByWeVote,
        isBlockedByWeVoteReason,
        voterIsCampaignXOwner,
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
  }

  cancelEditAll = () => {
    const { editExistingCampaign } = this.props;
    if (editExistingCampaign) {
      CampaignStartActions.campaignEditAllReset();
      const { campaignXWeVoteId, campaignSEOFriendlyPath } = this.state;
      if (campaignSEOFriendlyPath) {
        historyPush(`/c/${campaignSEOFriendlyPath}`);
      } else {
        historyPush(`/id/${campaignXWeVoteId}`);
      }
    } else {
      historyPush('/start-a-campaign-preview');
    }
  }

  submitCampaignEditAll = () => {
    const { editExistingCampaign } = this.props;
    const { campaignXWeVoteId, voterIsCampaignXOwner } = this.state;
    const campaignDescriptionQueuedToSave = CampaignStartStore.getCampaignDescriptionQueuedToSave();
    const campaignDescriptionQueuedToSaveSet = CampaignStartStore.getCampaignDescriptionQueuedToSaveSet();
    const campaignPhotoQueuedToDelete = CampaignStartStore.getCampaignPhotoQueuedToDelete();
    const campaignPhotoQueuedToDeleteSet = CampaignStartStore.getCampaignPhotoQueuedToDeleteSet();
    const campaignPhotoQueuedToSave = CampaignStartStore.getCampaignPhotoQueuedToSave();
    const campaignPhotoQueuedToSaveSet = CampaignStartStore.getCampaignPhotoQueuedToSaveSet();
    const campaignPoliticianDeleteList = CampaignStartStore.getCampaignPoliticianDeleteList();
    const campaignPoliticianStarterListQueuedToSave = CampaignStartStore.getCampaignPoliticianStarterListQueuedToSave();
    const campaignPoliticianStarterListQueuedToSaveSet = CampaignStartStore.getCampaignPoliticianStarterListQueuedToSaveSet();
    const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    const campaignTitleQueuedToSaveSet = CampaignStartStore.getCampaignTitleQueuedToSaveSet();
    // console.log('CampaignStartEditAll campaignPoliticianStarterListQueuedToSaveSet:', campaignPoliticianStarterListQueuedToSaveSet);
    if (voterIsCampaignXOwner && (campaignDescriptionQueuedToSaveSet || campaignPhotoQueuedToDeleteSet || campaignPhotoQueuedToSaveSet || campaignPoliticianDeleteList || campaignPoliticianStarterListQueuedToSaveSet || campaignTitleQueuedToSaveSet)) {
      const campaignPoliticianDeleteListJson = JSON.stringify(campaignPoliticianDeleteList);
      const campaignPoliticianStarterListQueuedToSaveJson = JSON.stringify(campaignPoliticianStarterListQueuedToSave);
      // console.log('CampaignStartEditAll campaignPoliticianStarterListQueuedToSaveJson:', campaignPoliticianStarterListQueuedToSaveJson);
      CampaignStartActions.campaignEditAllSave(
        campaignXWeVoteId,
        campaignDescriptionQueuedToSave, campaignDescriptionQueuedToSaveSet,
        campaignPhotoQueuedToDelete, campaignPhotoQueuedToDeleteSet,
        campaignPhotoQueuedToSave, campaignPhotoQueuedToSaveSet,
        campaignPoliticianDeleteListJson,
        campaignPoliticianStarterListQueuedToSaveJson, campaignPoliticianStarterListQueuedToSaveSet,
        campaignTitleQueuedToSave, campaignTitleQueuedToSaveSet,
      );
      CampaignStartActions.campaignEditAllReset();
    }
    // We want to wait 1 second before redirecting, so the save has a chance to execute
    this.timer = setTimeout(() => {
      if (editExistingCampaign) {
        const { campaignSEOFriendlyPath } = this.state;
        if (campaignSEOFriendlyPath) {
          historyPush(`/c/${campaignSEOFriendlyPath}`);
        } else {
          historyPush(`/id/${campaignXWeVoteId}`);
        }
      } else {
        historyPush('/start-a-campaign-preview');
      }
    }, 750);
  }

  render () {
    renderLog('CampaignStartEditAll');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, editExistingCampaign } = this.props;
    const {
      campaignSEOFriendlyPath, campaignXWeVoteId, chosenWebsiteName,
      isBlockedByWeVote, isBlockedByWeVoteReason, voterIsCampaignXOwner,
    } = this.state;
    return (
      <div>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet title={`Edit Your Campaign - ${chosenWebsiteName}`} />
        <SaveCancelOuterWrapper>
          <SaveCancelInnerWrapper>
            <SaveCancelButtonsWrapper>
              <Button
                classes={{ root: classes.buttonCancel }}
                color="primary"
                id="cancelEditAll"
                onClick={this.cancelEditAll}
                variant="outlined"
              >
                Cancel
              </Button>
              {voterIsCampaignXOwner && (
                <Button
                  classes={{ root: classes.buttonSave }}
                  color="primary"
                  id="saveCampaignEditAll"
                  onClick={this.submitCampaignEditAll}
                  variant="contained"
                >
                  Save
                </Button>
              )}
            </SaveCancelButtonsWrapper>
          </SaveCancelInnerWrapper>
        </SaveCancelOuterWrapper>
        <PageWrapper>
          <OuterWrapper>
            {voterIsCampaignXOwner ? (
              <InnerWrapper>
                {isBlockedByWeVote && (
                  <CampaignStartSectionWrapper>
                    <CampaignStartSection>
                      <BlockedReason>
                        Your campaign has been blocked by moderators from We Vote. Please make any requested modifications so you are in compliance with our terms of service and
                        {' '}
                        <OpenExternalWebSite
                          linkIdAttribute="weVoteSupport"
                          url="https://help.wevote.us/hc/en-us/requests/new"
                          target="_blank"
                          body={<span>contact We Vote support for help.</span>}
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
                    </CampaignStartSection>
                  </CampaignStartSectionWrapper>
                )}
                <CampaignStartSectionWrapper>
                  <CampaignStartSection>
                    <CampaignTitleInputField
                      campaignTitlePlaceholder="Title of your campaign"
                      campaignXWeVoteId={campaignXWeVoteId}
                      editExistingCampaign={editExistingCampaign}
                    />
                    <EditPoliticianList
                      campaignXWeVoteId={campaignXWeVoteId}
                      editExistingCampaign={editExistingCampaign}
                    />
                    <AddCandidateInputField
                      campaignXWeVoteId={campaignXWeVoteId}
                      editExistingCampaign={editExistingCampaign}
                    />
                    <PhotoUploadWrapper>
                      We recommend you use a photo that is 1200 x 628 pixels or larger. We can accept one photo up to 5 megabytes in size.
                      <CampaignPhotoUpload
                        campaignXWeVoteId={campaignXWeVoteId}
                        editExistingCampaign={editExistingCampaign}
                      />
                    </PhotoUploadWrapper>
                    <CampaignDescriptionInputField
                      campaignXWeVoteId={campaignXWeVoteId}
                      editExistingCampaign={editExistingCampaign}
                    />
                  </CampaignStartSection>
                </CampaignStartSectionWrapper>
              </InnerWrapper>
            ) : (
              <InnerWrapper>
                <CampaignStartSectionWrapper>
                  <CampaignStartSection>
                    <BlockedReason>
                      You do not have permission to edit this campaign.
                    </BlockedReason>
                  </CampaignStartSection>
                </CampaignStartSectionWrapper>
              </InnerWrapper>
            )}
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}
CampaignStartEditAll.propTypes = {
  classes: PropTypes.object,
  editExistingCampaign: PropTypes.bool,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


const CampaignStartSection = styled('div')`
  margin-bottom: 60px !important;
  max-width: 620px;
  width: 100%;
`;

const CampaignStartSectionWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const SaveCancelButtonsWrapper = styled('div')`
  display: flex;
`;

const SaveCancelInnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  max-width: 960px;
  padding: 8px 0;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const SaveCancelOuterWrapper = styled('div')`
  background-color: #f6f4f6;
  border-bottom: 1px solid #ddd;
  margin-top: 0;
  position: fixed;
  width: 100%;
  z-index: 2;
`;

const InnerWrapper = styled('div')`
  margin-top: 75px;
  width: 100%;
`;

const PhotoUploadWrapper = styled('div')`
  margin-top: 32px;
`;

export default withStyles(commonMuiStyles)(CampaignStartEditAll);
