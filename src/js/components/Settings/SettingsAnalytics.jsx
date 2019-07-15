import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import FacebookStore from '../../stores/FacebookStore';
import LoadingWheel from '../LoadingWheel';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

class SettingsAnalytics extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization: {},
      organizationWeVoteId: '',
      voter: {},
      voterIsSignedIn: false,
      buttonsActive: '',
      webmasterValue: '',
      trackerValue: '',
      voterIsPremium: false,
    };
  }

  componentDidMount () {
    // console.log("SettingsAnalytics componentDidMount");
    this.onVoterStoreChange();
    this.organizationStoreListener = FacebookStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.voterIsSignedIn !== nextState.voterIsSignedIn) {
      // console.log('this.state.voterIsSignedIn', this.state.voterIsSignedIn, ', nextState.voterIsSignedIn', nextState.voterIsSignedIn);
      return true;
    }

    const priorOrganization = this.state.organization;
    const nextOrganization = nextState.organization;

    const priorWeVoteCustomDomain = priorOrganization.we_vote_custom_domain || '';
    const nextWeVoteCustomDomain = nextOrganization.we_vote_custom_domain || '';

    if (priorWeVoteCustomDomain !== nextWeVoteCustomDomain) {
      // console.log('priorWeVoteCustomDomain', priorWeVoteCustomDomain, ', nextWeVoteCustomDomain', nextWeVoteCustomDomain);
      return true;
    }
    if (this.state.buttonsActive !== nextState.buttonsActive) {
      return true;
    }
    if (this.state.trackerValue !== nextState.trackerValue) {
      return true;
    }
    if (this.state.webmasterValue !== nextState.webmasterValue) {
      return true;
    }
    if (this.state.voterIsPremium !== nextState.voterIsPremium) {
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange = () => {
    const { organizationWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
      organizationWeVoteId,
      voter,
      voterIsSignedIn,
    });
  }

  onTrackerInputChange = (e) => {
    if (e.target.value === '') {
      this.setState({ buttonsActive: '', trackerValue: '' });
    } else {
      this.setState({ buttonsActive: 'tracker', trackerValue: e.target.value });
    }
  }

  onWebmasterInputChange = (e) => {
    if (e.target.value === '') {
      this.setState({ buttonsActive: '', webmasterValue: '' });
    } else {
      this.setState({ buttonsActive: 'webmaster', webmasterValue: e.target.value });
    }
  }

  onCancelButton = () => {
    this.setState({ buttonsActive: '' });
  }

  onSaveButton = () => {
    this.setState({ buttonsActive: '' });
  }

  openPremiumPage = () => {
    // Open premium page for payment
  }

  render () {
    renderLog(__filename);
    const { organization, organizationWeVoteId, voter, voterIsSignedIn, buttonsActive, trackerValue, webMasterValue } = this.state;
    const { classes } = this.props;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }

    if (voterIsSignedIn) {
      // console.log('SettingsAnalytics, Signed In.');
    }
    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsAnalytics, Custom Domain: ', organization.we_vote_custom_domain);
    }
    return (
      <div>
        <Helmet title="Domain Settings" />
        <div className="card">
          <div className="card-main">
            <h1 className="h2">Analytics</h1>
            <Seperator />
            <FormControl classes={{ root: classes.formControl }}>
              <InputLabel>Google Analytics Tracker</InputLabel>
              <InputLabelHelperText>e.g., UA-XXXXXXX-X</InputLabelHelperText>
              <TextField
                onChange={this.onTrackerInputChange}
                label="Paste Here..."
                variant="outlined"
                value={trackerValue}
              />
            </FormControl>
            {buttonsActive === 'tracker' ? (
              <ButtonsContainer>
                <Button classes={{ root: classes.button }} onClick={this.onCancelButton} color="primary" variant="outlined">
                  Cancel
                </Button>
                <Button onClick={this.state.voterIsPremium ? this.onSaveButton : this.openPremiumPage} variant="contained" classes={{ root: classes.goldButton }}>
                  {this.state.voterIsPremium ? 'Save' : 'Upgrade to Professional'}
                </Button>
              </ButtonsContainer>
            ) : null}
            <Seperator />
            <FormControl classes={{ root: classes.formControl }}>
              <InputLabel>Verify Google Webmaster Tool</InputLabel>
              <InputLabelHelperText>Paste the meta tag from Google Webmaster Tool</InputLabelHelperText>
              <TextField
                onChange={this.onWebmasterInputChange}
                label="Paste Here..."
                variant="outlined"
                value={webMasterValue}
              />
            </FormControl>
            {buttonsActive === 'webmaster' ? (
              <ButtonsContainer>
                <Button classes={{ root: classes.button }} onClick={this.onCancelButton} color="primary" variant="outlined">
                  Cancel
                </Button>
                <Button color="primary" variant="contained" onClick={this.onSaveButton}>
                  Save
                </Button>
              </ButtonsContainer>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const styles = () => ({
  formControl: {
    width: '100%',
  },
  textField: {
    height: 45,
  },
  button: {
    marginRight: 8,
  },
  goldButton: {
    background: 'linear-gradient(70deg, rgba(219,179,86,1) 14%, rgba(162,124,33,1) 94%)',
    color: 'white',
  },
});

const InputLabel = styled.h4`
  font-weight: bold;
  font-size: 13px;
`;

const InputLabelHelperText = styled.p`
  font-size: 11px;
  font-weight: normal;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;
  width: 100%;
  margin-top: 12px;
`;

const Seperator = styled.div`
  width: 100%;
  height: 2px;
  background: #eee;
  margin: 16px 0;
`;

export default withStyles(styles)(SettingsAnalytics);
