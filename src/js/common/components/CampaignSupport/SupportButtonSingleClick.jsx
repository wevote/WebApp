import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import initializejQuery from '../../utils/initializejQuery';

class SupportButtonSingleClick extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SupportButtonSingleClick componentDidUpdate');
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
    // console.log('SupportButtonSingleClick componentWillUnmount');
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      // Note 2021-05-08 We may want to indicate that this is a campaign with politician you can vote for
      const voterCanVoteForPoliticianInCampaign = CampaignStore.getVoterCanVoteForPoliticianInCampaign(campaignXWeVoteId);
      this.setState({
        voterCanVoteForPoliticianInCampaign,
      });
    }
  }

  functionToUseWhenActionCompleteLocal = () => {
    const { campaignXWeVoteId } = this.props;
    // console.log('functionToUseWhenActionCompleteLocal campaignXWeVoteId: ', campaignXWeVoteId);
    if (this.props.functionToUseWhenActionComplete) {
      this.props.functionToUseWhenActionComplete(campaignXWeVoteId);
    }
  }

  submitSupportButtonSingleClick = () => {
    const { campaignXWeVoteId } = this.props;
    const campaignSupported = true;
    const campaignSupportedChanged = true;
    // Use the same choice that was made for the primary campaign's 'visibleToPublic'
    const visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
    // console.log('submitSupportButtonSingleClick, visibleToPublic:', visibleToPublic);
    const saveVisibleToPublic = true;
    initializejQuery(() => {
      CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic);
    }, this.functionToUseWhenActionCompleteLocal());
  }

  render () {
    renderLog('SupportButtonSingleClick');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SupportButtonSingleClick window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const { voterCanVoteForPoliticianInCampaign } = this.state;
    const hideFooterBehindModal = false;
    const supportButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        {/* Add indication that voter can vote for candidates? */}
        {voterCanVoteForPoliticianInCampaign && <span />}
        <Wrapper
          className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
        >
          <ButtonPanel>
            <Button
              classes={{ root: supportButtonClasses }}
              color="primary"
              id="supportButtonDesktop"
              onClick={this.submitSupportButtonSingleClick}
              variant="contained"
            >
              1-Click Support
            </Button>
          </ButtonPanel>
        </Wrapper>
      </div>
    );
  }
}
SupportButtonSingleClick.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  functionToUseWhenActionComplete: PropTypes.func.isRequired,
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
  padding: 0;
`;

const Wrapper = styled('div')`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(SupportButtonSingleClick);
