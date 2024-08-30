import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import CampaignStartActions from '../../actions/CampaignStartActions';
import { OuterWrapper, PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import CompleteYourProfileModalController from '../../components/Settings/CompleteYourProfileModalController';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStartStore from '../../stores/CampaignStartStore';
import VoterStore from '../../../stores/VoterStore';
import initializejQuery from '../../utils/initializejQuery';


class CampaignStartPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignDescription: '',
      campaignPhotoLargeUrl: '',
      campaignPoliticianList: [],
      campaignTitle: '',
      readyToPublish: false,
      voterFirstName: '',
      voterLastName: '',
      voterSignedInWithEmail: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignStartPreview, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStartStoreChange();
    this.onVoterStoreChange();
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    initializejQuery(() => {
      CampaignStartActions.campaignRetrieveAsOwner('');
      CampaignStartActions.campaignEditAllReset();
    });
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.campaignStartStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStartStoreChange () {
    const campaignDescription = CampaignStartStore.getCampaignDescription();
    const campaignPhotoLargeUrl = CampaignStartStore.getCampaignPhotoLargeUrl();
    const campaignPoliticianList = CampaignStartStore.getCampaignPoliticianList();
    const campaignTitle = CampaignStartStore.getCampaignTitle();
    const step1Completed = CampaignStartStore.campaignTitleExists();
    const step2Completed = CampaignStartStore.campaignPoliticianListExists();
    const step3Completed = CampaignStartStore.campaignDescriptionExists();
    const readyToPublish = step1Completed && step2Completed && step3Completed;
    const voterSignedInWithEmail = CampaignStartStore.getVoterSignedInWithEmail();
    this.setState({
      campaignDescription,
      campaignPhotoLargeUrl,
      campaignPoliticianList,
      campaignTitle,
      readyToPublish,
      voterSignedInWithEmail,
    });
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    this.setState({
      voterFirstName,
      voterLastName,
      voterSignedInWithEmail,
    });
  }

  campaignEditAll = () => {
    historyPush('/start-a-campaign-edit-all');
  }

  submitPublishNowDesktop = () => {
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    if (!voterFirstName || !voterLastName || !voterSignedInWithEmail) {
      // Open complete your profile modal
      AppObservableStore.setShowCompleteYourProfileModal(true);
    } else {
      // Mark the campaign as published
      const campaignWeVoteId = '';
      CampaignStartActions.inDraftModeSave(campaignWeVoteId, false);
      historyPush('/profile/started');
    }
  }

  submitPublishNowMobile = () => {
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    // console.log('CampaignStartPreview submitPublishNowMobile');
    if (!voterFirstName || !voterLastName || !voterSignedInWithEmail) {
      // Navigate to the mobile complete your profile page
      historyPush('/start-a-campaign-complete-your-profile');
    } else {
      this.functionToUseWhenProfileComplete();
    }
  }

  functionToUseWhenProfileComplete = () => {
    // Mark the campaign as published
    const campaignWeVoteId = '';
    CampaignStartActions.inDraftModeSave(campaignWeVoteId, false);
    historyPush('/profile/started');
  }

  render () {
    renderLog('CampaignStartPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignDescription, campaignPhotoLargeUrl, campaignPoliticianList,
      campaignTitle, chosenWebsiteName, readyToPublish,
    } = this.state;
    let campaignPoliticianNumber = 0;
    let commaOrNot = '';
    return (
      <div>
        <Helmet title={`Preview Your Campaign - ${chosenWebsiteName}`} />
        <SaveCancelOuterWrapper>
          <SaveCancelInnerWrapper>
            <SaveCancelButtonsWrapper>
              <Button
                classes={{ root: classes.buttonEdit }}
                color="primary"
                id="campaignEditAll"
                onClick={this.campaignEditAll}
                variant="outlined"
              >
                Edit
              </Button>
              <div className="u-show-mobile-tablet">
                <Button
                  classes={{ root: classes.buttonSave }}
                  color="primary"
                  disabled={!readyToPublish}
                  id="saveCampaignPublishNowMobile"
                  onClick={this.submitPublishNowMobile}
                  variant="contained"
                >
                  Publish now
                </Button>
              </div>
              <div className="u-show-desktop">
                <Button
                  classes={{ root: classes.buttonSave }}
                  color="primary"
                  disabled={!readyToPublish}
                  id="saveCampaignPublishNowDesktop"
                  onClick={this.submitPublishNowDesktop}
                  variant="contained"
                >
                  Publish now
                </Button>
              </div>
            </SaveCancelButtonsWrapper>
          </SaveCancelInnerWrapper>
        </SaveCancelOuterWrapper>
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <DesktopDisplayWrapper className="u-show-desktop-tablet">
                    <CampaignTitleDesktop>{campaignTitle || <CampaignTitleMissing>Title Required</CampaignTitleMissing>}</CampaignTitleDesktop>
                  </DesktopDisplayWrapper>
                  <MobileDisplayWrapper className="u-show-mobile">
                    <CampaignTitleMobile>{campaignTitle || <CampaignTitleMissing>Title Required</CampaignTitleMissing>}</CampaignTitleMobile>
                  </MobileDisplayWrapper>
                  {(campaignPoliticianList && campaignPoliticianList.length > 0) ? (
                    <CampaignPoliticianList>
                      {campaignPoliticianList.length === 1 ? (
                        <>
                          Politician this campaign is about:
                          {' '}
                          {campaignPoliticianList[0].politician_name}
                        </>
                      ) : (
                        <>
                          Politicians this campaign is about:
                          { campaignPoliticianList.map((campaignPolitician) => {
                            campaignPoliticianNumber += 1;
                            if (campaignPoliticianNumber >= campaignPoliticianList.length) {
                              return (
                                <span key={campaignPoliticianNumber}>
                                  {' '}
                                  and
                                  {' '}
                                  {campaignPolitician.politician_name}
                                </span>
                              );
                            } else {
                              commaOrNot = (campaignPoliticianNumber === campaignPoliticianList.length - 1) ? '' : ',';
                              return (
                                <span key={campaignPoliticianNumber}>
                                  {' '}
                                  {campaignPolitician.politician_name}
                                  {commaOrNot}
                                </span>
                              );
                            }
                          })}
                        </>
                      )}
                    </CampaignPoliticianList>
                  ) : (
                    <CampaignPoliticianListMissing>Politician Missing</CampaignPoliticianListMissing>
                  )}
                  <br />
                  {campaignPhotoLargeUrl ? (
                    <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
                  ) : (
                    <CampaignImageMissingWrapper>
                      <CampaignImageMissing>
                        <DelayedLoad showLoadingText waitBeforeShow={4000}>
                          <>
                            Photo Missing
                          </>
                        </DelayedLoad>
                      </CampaignImageMissing>
                    </CampaignImageMissingWrapper>
                  )}
                  {campaignDescription ? (
                    <CampaignDescription>{campaignDescription}</CampaignDescription>
                  ) : (
                    <CampaignDescriptionMissing>Description Required</CampaignDescriptionMissing>
                  )}
                </CampaignStartSection>
              </CampaignStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <CompleteYourProfileModalController
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          startCampaign
        />
      </div>
    );
  }
}
CampaignStartPreview.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonEdit: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 30px',
    textTransform: 'none',
    width: 100,
  },
  buttonSave: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    marginLeft: 10,
    textTransform: 'none',
    width: 200,
    [theme.breakpoints.down('sm')]: {
      width: 150,
    },
  },
  buttonRoot: {
    width: 250,
  },
});

const CampaignDescription = styled('div')`
  font-size: 15px;
  margin: 10px 0;
  white-space: pre-wrap;
`;

const CampaignDescriptionMissing = styled('div')`
  color: red;
  font-size: 18px;
  margin: 10px 0;
`;

const CampaignImage = styled('img')`
  width: 100%;
`;

const CampaignImageMissing = styled('div')`
  color: red;
  font-size: 18px;
  font-weight: 600;
`;

const CampaignImageMissingWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const CampaignPoliticianList = styled('div')`
  font-size: 17px;
  margin: 10px 0;
`;

const CampaignPoliticianListMissing = styled('div')`
  color: red;
  font-size: 18px;
  margin: 10px 0;
`;

const CampaignStartSection = styled('div')`
  margin-bottom: 60px !important;
  max-width: 620px;
  width: 100%;
`;

const CampaignStartSectionWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const CampaignTitleDesktop = styled('h1')(({ theme }) => (`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 40px 20px;
  ${theme.breakpoints.down('md')} {
    font-size: 24px;
  }
`));

const CampaignTitleMissing = styled('div')`
  color: red;
`;

const CampaignTitleMobile = styled('h1')`
  font-size: 18px;
  text-align: left;
  margin: 0;
`;

const DesktopDisplayWrapper = styled('div')`
`;

const InnerWrapper = styled('div')`
  width: 100%;
`;

const MobileDisplayWrapper = styled('div')`
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
  // margin: 10px 0;
  width: 100%;
`;

export default withStyles(styles)(CampaignStartPreview);
