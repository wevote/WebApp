import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';

class SupportButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterFirstName: '',
      voterLastName: '',
      voterSignedInWithEmail: false,
    };
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SupportButton componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    // console.log('SupportButton componentWillUnmount');
    this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      const voterCanVoteForPoliticianInCampaign = CampaignStore.getVoterCanVoteForPoliticianInCampaign(campaignXWeVoteId);
      this.setState({
        voterCanVoteForPoliticianInCampaign,
      });
    }
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

  submitSupportButtonDesktop = () => {
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    // console.log('SupportButton submitSupportButtonDesktop');
    if (!voterFirstName || !voterLastName || !voterSignedInWithEmail) {
      // Open complete your profile modal
      AppObservableStore.setShowCompleteYourProfileModal(true);
    } else {
      // Mark that voter supports this campaign
      AppObservableStore.setBlockCampaignXRedirectOnSignIn(false);
      this.props.functionToUseWhenProfileComplete();
    }
  }

  render () {
    renderLog('SupportButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SupportButton window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const { voterCanVoteForPoliticianInCampaign } = this.state;
    const hideFooterBehindModal = false;
    const supportButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Wrapper
          className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
        >
          <ButtonPanel>
            <Button
              classes={{ root: supportButtonClasses }}
              color="primary"
              id="supportButtonDesktop"
              onClick={this.submitSupportButtonDesktop} // () =>
              variant="contained"
            >
              {voterCanVoteForPoliticianInCampaign ? (
                <span>
                  Support with my vote
                </span>
              ) : (
                <span>
                  Show your support
                </span>
              )}
            </Button>
          </ButtonPanel>
        </Wrapper>
      </div>
    );
  }
}
SupportButton.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
      padding: '0',
    },
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
});

const ButtonPanel = styled('div')`
  background-color: #fff;
  padding: 10px 0;
`;

const Wrapper = styled('div')`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(SupportButton);
