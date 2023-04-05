import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import VoterStore from '../../../stores/VoterStore';
import webAppConfig from '../../../config';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class SupportButtonBeforeCompletionScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSupported: false,
      voterFirstName: '',
      voterIsSignedInWithEmail: false,
      voterLastName: '',
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('SupportButtonBeforeCompletionScreen componentDidMount');
    this.onCampaignSupporterStoreChange();
    this.onVoterStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SupportButtonBeforeCompletionScreen componentDidUpdate');
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathPrevious,
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignOrCampaignSupporterChange(campaignXWeVoteId);
      }
    } else if (campaignSEOFriendlyPath) {
      if (campaignSEOFriendlyPath !== campaignSEOFriendlyPathPrevious) {
        const campaignXWeVoteIdCalculated = CampaignStore.getCampaignXWeVoteIdFromCampaignSEOFriendlyPath(campaignSEOFriendlyPath);
        // console.log('campaignXWeVoteIdCalculated:', campaignXWeVoteIdCalculated);
        this.onCampaignOrCampaignSupporterChange(campaignXWeVoteIdCalculated);
      }
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('SupportButtonBeforeCompletionScreen caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('SupportButtonBeforeCompletionScreen componentWillUnmount');
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in SupportButtonBeforeCompletionScreen: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCampaignStoreChange () {
    this.onCampaignSupporterStoreChange();
  }

  onCampaignSupporterStoreChange () {
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = this.props;
    // console.log('SupportButtonBeforeCompletionScreen onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (campaignXWeVoteId) {
      this.onCampaignOrCampaignSupporterChange(campaignXWeVoteId);
    } else if (campaignSEOFriendlyPath) {
      const campaignXWeVoteIdCalculated = CampaignStore.getCampaignXWeVoteIdFromCampaignSEOFriendlyPath(campaignSEOFriendlyPath);
      this.onCampaignOrCampaignSupporterChange(campaignXWeVoteIdCalculated);
    }
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      voterFirstName,
      voterLastName,
      voterIsSignedInWithEmail,
    });
    this.setState({
      voterWeVoteId,
    });
  }

  onCampaignOrCampaignSupporterChange = (campaignXWeVoteId) => {
    // console.log('onCampaignOrCampaignSupporterChange campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('onCampaignSupporterStoreChange campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      const {
        campaign_supported: campaignSupported,
        campaignx_we_vote_id: campaignXWeVoteIdFromCampaignXSupporter,
      } = campaignXSupporterVoterEntry;
      // console.log('onCampaignSupporterStoreChange campaignSupported: ', campaignSupported);
      if (campaignXWeVoteIdFromCampaignXSupporter) {
        this.setState({
          campaignSupported,
        });
      } else {
        this.setState({
          campaignSupported: false,
        });
      }
      const voterCanVoteForPoliticianInCampaign = CampaignStore.getVoterCanVoteForPoliticianInCampaign(campaignXWeVoteId);
      this.setState({
        voterCanVoteForPoliticianInCampaign,
      });
    } else {
      this.setState({
        campaignSupported: false,
        voterCanVoteForPoliticianInCampaign: false,
      });
    }
  }

  submitSupportButtonMobile = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    console.log('SupportButtonBeforeCompletionScreen submitSupportButtonMobile');
    const { voterFirstName, voterLastName, voterIsSignedInWithEmail } = this.state;
    if (!voterFirstName || !voterLastName || !voterIsSignedInWithEmail) {
      // Navigate to the mobile complete your profile page
      if (campaignSEOFriendlyPath) {
        historyPush(`/c/${campaignSEOFriendlyPath}/complete-your-support-for-this-campaign`);
      } else {
        historyPush(`/id/${campaignXWeVoteId}/complete-your-support-for-this-campaign`);
      }
    } else {
      // Mark that voter supports this campaign
      AppObservableStore.setBlockCampaignXRedirectOnSignIn(false);
      this.props.functionToUseWhenProfileComplete();
    }
  }

  onKeyDown = (event) => {
    event.preventDefault();
  };

  render () {
    renderLog('SupportButtonBeforeCompletionScreen');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignSEOFriendlyPath, campaignXWeVoteId, classes, inButtonFullWidthMode, inCompressedMode } = this.props;
    const hideFooterBehindModal = false;
    let supportButtonClasses;
    const inWebApp = true; // isWebApp();
    if (inWebApp) {
      if (inButtonFullWidthMode) {
        supportButtonClasses = classes.buttonDefaultCordova;
      } else if (inCompressedMode) {
        supportButtonClasses = classes.buttonCompressedMode;
      } else {
        supportButtonClasses = classes.buttonDefault;
      }
    } else {
      supportButtonClasses = classes.buttonDefaultCordova;
    }
    // console.log('SupportButtonBeforeCompletionScreen render campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (!campaignSEOFriendlyPath && !campaignXWeVoteId && !nextReleaseFeaturesEnabled) {
      // console.log('SupportButtonBeforeCompletionScreen render voter NOT found');
      return <div className="undefined-campaign-state" />;
    }

    const {
      campaignSupported, voterCanVoteForPoliticianInCampaign, voterWeVoteId,
    } = this.state;
    // console.log('voterCanVoteForPoliticianInCampaign: ', voterCanVoteForPoliticianInCampaign);
    if (!voterWeVoteId) {
      // console.log('SupportButtonBeforeCompletionScreen render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('SupportButtonBeforeCompletionScreen render voter found');
    return (
      <Wrapper
        className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
      >
        <ButtonPanel>
          {campaignSupported ? (
            <Button
              classes={{ root: supportButtonClasses }}
              color="primary"
              id="keepHelpingButtonFooter"
              onClick={() => this.props.functionToUseToKeepHelping()}
              variant={inButtonFullWidthMode || !inCompressedMode ? 'contained' : 'outline'}
            >
              I&apos;d like to keep helping!
            </Button>
          ) : (
            <Button
              classes={{ root: supportButtonClasses }}
              color="primary"
              id="supportButtonFooter"
              onClick={this.submitSupportButtonMobile}
              variant={inButtonFullWidthMode || !inCompressedMode ? 'contained' : 'outline'}
            >
              {voterCanVoteForPoliticianInCampaign ? (
                <span>
                  {/* Support with my vote */}
                  Help them win
                </span>
              ) : (
                <span>
                  {/* I support this campaign */}
                  Help them win
                </span>
              )}
            </Button>
          )}
        </ButtonPanel>
      </Wrapper>
    );
  }
}
SupportButtonBeforeCompletionScreen.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  campaignSEOFriendlyPath: PropTypes.string,
  classes: PropTypes.object,
  functionToUseToKeepHelping: PropTypes.func.isRequired,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired,
  inButtonFullWidthMode: PropTypes.bool,
  inCompressedMode: PropTypes.bool,
  politicianWeVoteId: PropTypes.string,
  politicianSEOFriendlyPath: PropTypes.string,
};

const styles = () => ({
  buttonCompressedMode: {
    boxShadow: 'none !important',
    fontSize: 14,
    // height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: 20,
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    fontSize: 20,
    height: '35px !important',
    // padding: '0 12px',
    textTransform: 'none',
    width: '280px',
  },
});

const ButtonPanel = styled('div')`
`;

const Wrapper = styled('div')`
`;

export default withTheme(withStyles(styles)(SupportButtonBeforeCompletionScreen));
