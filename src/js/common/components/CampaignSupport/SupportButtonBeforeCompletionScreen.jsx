import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import SupportActions from '../../../actions/SupportActions';
import AppObservableStore from '../../stores/AppObservableStore';
import CandidateStore from '../../../stores/CandidateStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import RepresentativeStore from '../../../stores/RepresentativeStore';
import SupportStore from '../../../stores/SupportStore';
import VoterStore from '../../../stores/VoterStore';
import webAppConfig from '../../../config';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class SupportButtonBeforeCompletionScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemType: '',
      ballotItemWeVoteId: '',
      campaignSupported: false,
      voterFirstName: '',
      voterIsSignedInWithEmail: false,
      voterLastName: '',
      voterOpposesBallotItem: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('SupportButtonBeforeCompletionScreen componentDidMount');
    this.onCampaignSupporterStoreChange();
    this.onVoterStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SupportButtonBeforeCompletionScreen componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignOrCampaignSupporterChange(campaignXWeVoteId);
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
    this.supportStoreListener.remove();
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
    const { campaignXWeVoteId } = this.props;
    // console.log('SupportButtonBeforeCompletionScreen onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      this.onCampaignOrCampaignSupporterChange(campaignXWeVoteId);
    }
  }

  onSupportStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('SupportButtonBeforeCompletionScreen onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      this.onCampaignOrCampaignSupporterChange(campaignXWeVoteId);
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
      let { ballotItemType, ballotItemWeVoteId, voterOpposesBallotItem } = this.state;
      if (!ballotItemWeVoteId) {
        const candidate = CandidateStore.getCandidateByLinkedCampaignXWeVoteId(campaignXWeVoteId);
        const representative = RepresentativeStore.getRepresentativeByLinkedCampaignXWeVoteId(campaignXWeVoteId);
        if (candidate && candidate.we_vote_id) {
          ballotItemType = 'CANDIDATE';
          ballotItemWeVoteId = candidate.we_vote_id;
          // console.log('onCampaignSupporterStoreChange from candidate voterOpposesBallotItem:', voterOpposesBallotItem);
        } else if (representative && representative.politician_we_vote_id) {
          ballotItemType = 'POLITICIAN';
          ballotItemWeVoteId = representative.politician_we_vote_id;
          // console.log('onCampaignSupporterStoreChange from representative voterOpposesBallotItem:', voterOpposesBallotItem);
        }
      }
      if (ballotItemWeVoteId) {
        voterOpposesBallotItem = SupportStore.getVoterOpposesByBallotItemWeVoteId(ballotItemWeVoteId);
        // console.log('onCampaignSupporterStoreChange from candidate voterOpposesBallotItem:', voterOpposesBallotItem);
      }
      // const voterSupportsBallotItem = SupportStore.getVoterSupportsByBallotItemWeVoteId(ballotItemWeVoteId);
      this.setState({
        ballotItemType,
        ballotItemWeVoteId,
        voterCanVoteForPoliticianInCampaign,
        voterOpposesBallotItem,
        // voterSupportsBallotItem,
      });
    } else {
      this.setState({
        campaignSupported: false,
        voterCanVoteForPoliticianInCampaign: false,
      });
    }
  }

  submitSupportButtonMobile = () => {
    const { campaignXWeVoteId } = this.props;
    const { ballotItemType, ballotItemWeVoteId } = this.state;
    console.log('SupportButtonBeforeCompletionScreen submitSupportButtonMobile');
    SupportActions.voterSupportingSave(ballotItemWeVoteId, ballotItemType);
    const { voterFirstName, voterLastName, voterIsSignedInWithEmail } = this.state;
    if (!voterFirstName || !voterLastName || !voterIsSignedInWithEmail) {
      // Navigate to the mobile complete your profile page
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      const { seo_friendly_path: campaignSEOFriendlyPath } = campaignX;
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
    const { campaignXWeVoteId, classes, inButtonFullWidthMode, inCompressedMode } = this.props;
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
    // console.log('SupportButtonBeforeCompletionScreen render campaignXWeVoteId:', campaignXWeVoteId);
    if (!campaignXWeVoteId) {
      // console.log('SupportButtonBeforeCompletionScreen render voter NOT found');
      return <div className="undefined-campaign-state" />;
    }

    const {
      campaignSupported, voterCanVoteForPoliticianInCampaign, voterOpposesBallotItem, voterWeVoteId,
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
            <>
              {voterOpposesBallotItem ? (
                <>
                  <Button
                    classes={{ root: supportButtonClasses }}
                    color="primary"
                    disabled
                    id="helpDefeatThemButton"
                    // onClick={this.submitSupportButtonMobile}
                    variant={inButtonFullWidthMode || !inCompressedMode ? 'contained' : 'outline'}
                  >
                    <span>
                      {nextReleaseFeaturesEnabled && (
                        <span>
                          Help defeat them
                        </span>
                      )}
                    </span>
                  </Button>
                </>
              ) : (
                <Button
                  classes={{ root: supportButtonClasses }}
                  color="primary"
                  id="helpThemWinButton"
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
            </>
          )}
        </ButtonPanel>
      </Wrapper>
    );
  }
}
SupportButtonBeforeCompletionScreen.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  functionToUseToKeepHelping: PropTypes.func.isRequired,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired,
  inButtonFullWidthMode: PropTypes.bool,
  inCompressedMode: PropTypes.bool,
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
