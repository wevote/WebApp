import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';


class CampaignNewsItemCreateButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterFirstName: '',
      voterIsSignedInWithEmail: false,
      voterLastName: '',
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsItemCreateButton componentDidMount');
    this.onVoterStoreChange();
    // this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CampaignNewsItemCreateButton caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('CampaignNewsItemCreateButton componentWillUnmount');
    // this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in CampaignNewsItemCreateButton: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
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

  clickCampaignNewsItemCreateButton = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    // console.log('CampaignNewsItemCreateButton clickCampaignNewsItemCreateButton');
    const { voterFirstName, voterLastName, voterIsSignedInWithEmail } = this.state;
    if (!voterFirstName || !voterLastName || !voterIsSignedInWithEmail) {
      // Navigate to the complete your profile page
      if (campaignSEOFriendlyPath) {
        historyPush(`/c/${campaignSEOFriendlyPath}/complete-your-profile-for-news-item`);
      } else {
        historyPush(`/id/${campaignXWeVoteId}/complete-your-profile-for-news-item`);
      }
    } else if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/add-update`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}/add-update`);
    }
  }

  onKeyDown = (event) => {
    event.preventDefault();
  };

  render () {
    renderLog('CampaignNewsItemCreateButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignSEOFriendlyPath, campaignXWeVoteId, classes } = this.props;
    const hideFooterBehindModal = false;
    let campaignNewsItemButtonClasses;
    const inWebApp = true; // isWebApp();
    if (inWebApp) {
      campaignNewsItemButtonClasses = classes.buttonDefault;
    } else {
      campaignNewsItemButtonClasses = classes.buttonDefaultCordova;
    }
    // console.log('CampaignNewsItemCreateButton render campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (!campaignSEOFriendlyPath && !campaignXWeVoteId) {
      // console.log('CampaignNewsItemCreateButton render voter NOT found');
      return <div className="undefined-campaign-state" />;
    }

    const {
      voterWeVoteId,
    } = this.state;
    if (!voterWeVoteId) {
      // console.log('CampaignNewsItemCreateButton render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('CampaignNewsItemCreateButton render voter found');
    return (
      <Wrapper
        className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
      >
        <ButtonPanel>
          <Button
            classes={{ root: campaignNewsItemButtonClasses }}
            color="primary"
            id="supportButtonFooter"
            onClick={this.clickCampaignNewsItemCreateButton}
            variant="contained"
          >
            Update Supporters
          </Button>
        </ButtonPanel>
      </Wrapper>
    );
  }
}
CampaignNewsItemCreateButton.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  campaignSEOFriendlyPath: PropTypes.string,
  classes: PropTypes.object,
};

const styles = () => ({
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
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
});

const ButtonPanel = styled('div')`
`;

const Wrapper = styled('div')`
`;

export default withTheme(withStyles(styles)(CampaignNewsItemCreateButton));
