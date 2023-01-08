import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import { OuterWrapper, PageWrapper, StepNumberBordered, StepNumberPlaceholder } from '../../components/Style/stepDisplayStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import { cordovaOpenSafariView } from '../../utils/cordovaUtils';
import historyPush from '../../utils/historyPush';
import { isWebApp } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';


class CampaignStartIntro extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenDomainTypeIsCampaign: false,
      chosenWebsiteName: '',
      inPrivateLabelMode: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportSteps, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenDomainTypeIsCampaign = AppObservableStore.getChosenDomainTypeIsCampaign();
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      chosenDomainTypeIsCampaign,
      chosenWebsiteName,
      inPrivateLabelMode,
      siteConfigurationHasBeenRetrieved,
    });
  }

  nextStep = () => {
    const { chosenDomainTypeIsCampaign } = this.state;
    if (isWebApp()) {
      if (chosenDomainTypeIsCampaign) {
        historyPush('/start-a-campaign-add-title');
      } else {
        window.open('https://campaigns.wevote.us/start-a-campaign-add-title');
      }
    } else {
      // If here, then we know we are the WebApp ballot guide on Cordova
      cordovaOpenSafariView('https://campaigns.wevote.us/start-a-campaign-add-title', null, 50);
    }
  }

  render () {
    renderLog('CampaignStartIntro');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenDomainTypeIsCampaign, chosenWebsiteName, inPrivateLabelMode, siteConfigurationHasBeenRetrieved } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <PageContentContainer>
          <Helmet title={`Start a Campaign - ${chosenWebsiteName}`} />
          <PageWrapper>
            <OuterWrapper>
              {siteConfigurationHasBeenRetrieved && (
                <InnerWrapper>
                  <ContentTitle>
                    Get the most out of
                    {' '}
                    {chosenWebsiteName}
                    :
                  </ContentTitle>
                  <CampaignStartSectionWrapper>
                    <CampaignStartSection>
                      <TitleRow>
                        <Dot><StepNumberBordered>1</StepNumberBordered></Dot>
                        <StepTitle>Create your campaign</StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          Your voice is important, and will convince others to vote for the candidate(s) you like, or against the ones you oppose. If your first edits aren&apos;t perfect, don&apos;t worry; you can edit your campaign later.
                        </StepText>
                      </ContentRow>

                      <TitleRow>
                        <Dot><StepNumberBordered>2</StepNumberBordered></Dot>
                        <StepTitle>Community support can lead to victory</StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          {chosenWebsiteName}
                          {' '}
                          has tools to help you share your campaign directly with friends via text and email, more broadly via social media, or with other
                          {' '}
                          {chosenWebsiteName}
                          {' '}
                          voters.
                        </StepText>
                      </ContentRow>

                      <TitleRow>
                        <Dot><StepNumberBordered>3</StepNumberBordered></Dot>
                        <StepTitle>Person-to-person persuasion is effective</StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          You can make a difference by telling your friends why you want a candidate to win. The more of your friends who vote, the more impact you will have on the outcome of the election.
                        </StepText>
                      </ContentRow>

                      {inPrivateLabelMode && (
                        <>
                          <TitleRow>
                            <Dot><StepNumberBordered>4</StepNumberBordered></Dot>
                            <StepTitle>Our Approval Process</StepTitle>
                          </TitleRow>
                          <ContentRow>
                            <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                            <StepText>
                              Your campaign will appear on
                              {' '}
                              {chosenWebsiteName}
                              {' '}
                              as soon as it has been reviewed and approved. In the meantime, you will be able to see your campaign on Campaigns.WeVote.US.
                            </StepText>
                          </ContentRow>
                        </>
                      )}

                      <DesktopButtonWrapper className="u-show-desktop-tablet">
                        <DesktopButtonPanel>
                          <Button
                            classes={{ root: classes.buttonDesktop }}
                            color="primary"
                            id="campaignStartButton"
                            onClick={this.nextStep}
                            variant="contained"
                          >
                            Got it! I&apos;m ready to create my campaign
                          </Button>
                        </DesktopButtonPanel>
                      </DesktopButtonWrapper>
                    </CampaignStartSection>
                  </CampaignStartSectionWrapper>
                </InnerWrapper>
              )}
            </OuterWrapper>
          </PageWrapper>
        </PageContentContainer>
        <MobileButtonWrapper isCampaignSite={chosenDomainTypeIsCampaign} className="u-show-mobile">
          <MobileButtonPanel>
            <Button
              classes={{ root: mobileButtonClasses }}
              color="primary"
              id="campaignStartButtonFooter"
              onClick={this.nextStep}
              variant="contained"
            >
              Got it! I&apos;m ready to create
            </Button>
          </MobileButtonPanel>
        </MobileButtonWrapper>
      </div>
    );
  }
}
CampaignStartIntro.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '14px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      fontSize: '15px',
    },
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    fontSize: '14px',
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDesktop: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonRoot: {
    width: 250,
  },
});

const CampaignStartSection = styled('div')`
  margin-bottom: 60px !important;
  max-width: 450px;
`;

const CampaignStartSectionWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const ContentRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

const DesktopButtonPanel = styled('div')`
  background-color: #fff;
  padding: 10px 0;
`;

const DesktopButtonWrapper = styled('div')`
  width: 100%;
  display: block;
  margin: 30px 0;
`;

const Dot = styled('div')(({ theme }) => (`
  align-self: center;
  display: block;
  padding-top: 2px;
  text-align: center;
  ${theme.breakpoints.down('md')} {
    padding-top: 3px;
  }
`));

const InnerWrapper = styled('div')`
`;

const MobileButtonPanel = styled('div')`
  background-color: #fff;
  border-top: 1px solid #ddd;
  margin: 0;
  padding: 10px;
`;

export const MobileButtonWrapper = styled('div', {
  shouldForwardProp: (prop) => !['isCampaignSite'].includes(prop),
})(({ isCampaignSite }) => (`
  ${isCampaignSite ? 'bottom: 0;' : 'bottom: 57px;'}
  display: block;
  position: fixed;
  width: 100%;
  z-index: 9001 !important;
`));

const StepText = styled('div')(({ theme }) => (`
  color: #555;
  font-size: 16px;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  ${theme.breakpoints.down('sm')} {
    font-size: 16px;
    padding: 0 12px;
  }
`));

const StepTitle = styled('div')(({ theme }) => (`
  font-size: 20px;
  font-weight: 600;
  padding: 0 8px;
  text-align: left;
  ${theme.breakpoints.down('sm')} {
    font-size: 17px;
  }
`));

const TitleRow = styled('div')`
  align-content: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-top: 14px;
`;

export default withStyles(styles)(CampaignStartIntro);
