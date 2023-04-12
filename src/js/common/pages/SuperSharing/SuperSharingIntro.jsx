import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import VoterActions from '../../../actions/VoterActions';
import ShareActions from '../../actions/ShareActions';
import { OuterWrapper, PageWrapper, StepNumberBordered, StepNumberPlaceholder } from '../../components/Style/stepDisplayStyles';
import ShareStore from '../../stores/ShareStore';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import { CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';


class SuperSharingIntro extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportSteps, componentDidMount');
    const { setShowHeaderFooter } = this.props;
    // const { becomeMember, createNewsItem, startCampaign, supportCampaign } = this.props;
    setShowHeaderFooter(false);
    initializejQuery(() => {
      VoterActions.voterContactListRetrieve();
    });
    // We don't need superShareItemId in this step, but we want to make sure it is stored and retrieved so it is ready for the next step
    const { match: { params } } = this.props;
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      // campaignXNewsItemWeVoteId,
      campaignXWeVoteId: campaignXWeVoteIdFromParams,
    } = params;
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    let superShareItemId;
    if (campaignXWeVoteId) {
      superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      if (!superShareItemId || superShareItemId === 0) {
        initializejQuery(() => {
          ShareActions.superShareItemRetrieve(campaignXWeVoteId);
        });
      }
    } else if (campaignXWeVoteIdFromParams) {
      superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteIdFromParams);
      if (!superShareItemId || superShareItemId === 0) {
        initializejQuery(() => {
          ShareActions.superShareItemRetrieve(campaignXWeVoteIdFromParams);
        });
      }
    }
    // Take the "calculated" identifiers and retrieve if missing
    retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    window.scrollTo(0, 0);
  }

  getCampaignBasePath = () => {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  returnToOtherSharingOptions = () => {
    historyPush(`${this.getCampaignBasePath()}/share-campaign`);
  }

  startSuperSharing = () => {
    const { sms } = this.props;
    if (sms) {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-add-sms-contacts`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-add-email-contacts`);
    }
  }

  render () {
    renderLog('SuperSharingIntro');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title="Supercharged Sharing" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                Here&apos;s how supercharged sharing works:
              </ContentTitle>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <TitleRow>
                    <Dot><StepNumberBordered>1</StepNumberBordered></Dot>
                    <StepTitle>Your friendships are precious</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      WeVote.US is a nonpartisan nonprofit and will always protect and keep private your friends&apos; contact information. We will never share or sell their contact information.
                    </StepText>
                  </ContentRow>

                  <TitleRow>
                    <Dot><StepNumberBordered>2</StepNumberBordered></Dot>
                    <StepTitle>You are in control</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      You are the only one who will be able to initiate messages to your friends, until they opt-in.
                    </StepText>
                  </ContentRow>

                  <TitleRow>
                    <Dot><StepNumberBordered>3</StepNumberBordered></Dot>
                    <StepTitle>Delete your friends&apos; info at any time</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      Wipe clean any information you import, any time you would like. We keep the contact info you import in a quarantined data vault, private to you.
                    </StepText>
                  </ContentRow>
                  <DesktopButtonWrapper className="u-show-desktop-tablet">
                    <DesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="startSuperSharingDesktop"
                        onClick={this.startSuperSharing}
                        variant="contained"
                      >
                        Got it! I&apos;m ready to start sharing
                      </Button>
                    </DesktopButtonPanel>
                  </DesktopButtonWrapper>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
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
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <MobileButtonWrapper className="u-show-mobile">
          <MobileButtonPanel>
            <Button
              classes={{ root: mobileButtonClasses }}
              color="primary"
              id="startSuperSharingMobile"
              onClick={this.startSuperSharing}
              variant="contained"
            >
              Got it! I&apos;m ready to start sharing
            </Button>
          </MobileButtonPanel>
        </MobileButtonWrapper>
      </div>
    );
  }
}
SuperSharingIntro.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
  sms: PropTypes.bool,
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
  buttonSimpleLink: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textDecoration: 'underline',
    textTransform: 'none',
    minWidth: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

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
  padding-top: 2px;
  text-align: center;
  align-self: center;
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

const MobileButtonWrapper = styled('div')`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

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

export default withStyles(styles)(SuperSharingIntro);
