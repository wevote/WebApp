import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import InputBase from '@material-ui/core/InputBase';
import styled from 'styled-components';
import FacebookStore from '../../stores/FacebookStore';
import LoadingWheel from '../LoadingWheel';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

class SettingsDomain extends Component {
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
      subDomainValue: '',
      customValue: '',
      value: '',
      buttonsActive: '',
      voterIsPremium: false, /* This is hard-coded for testing purposes, this will be later set based on API calls that aren't set up */
    };
  }

  componentDidMount () {
    // console.log('SettingsDomain componentDidMount');
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
    if (this.state.value !== nextState.value) {
      return true;
    }
    if (this.state.buttonsActive !== nextState.buttonsActive) {
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

  handleChange = (event) => {
    this.setState({ value: event.target.value });

    if (event.target.value === 'custom') {
      this.handleRadioSwitchCustom(event);
    }

    if (event.target.value === 'subdomain') {
      this.handleRadioSwitchSubdomain(event);
    }
  }

  handleRadioSwitchCustom = (event) => {
    const input = event.target.parentElement.parentElement.nextElementSibling.firstElementChild.children[1].firstElementChild;

    if (input.value !== '') {
      this.setState({ customValue: input.value });

      if (this.state.voterIsPremium) {
        /* Call API and set the url here */
      }
    }
  }

  handleRadioSwitchSubdomain = (event) => {
    const input = event.target.parentElement.parentElement.nextElementSibling.firstElementChild.children[1].firstElementChild;

    if (input.value !== '') {
      this.setState({ subDomainValue: input.value });

      /* Call API and set the url here */
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

  onCustomInputChange = (e) => {
    if (e.target.value === '') {
      this.setState({ buttonsActive: '' });
    } else {
      this.setState({ buttonsActive: 'custom' });
    }
  }

  onSubdomainInputChange = (e) => {
    if (e.target.value === '') {
      this.setState({ buttonsActive: '' });
    } else {
      this.setState({ buttonsActive: 'subdomain' });
    }
  }

  render () {
    renderLog(__filename);
    const { organization, organizationWeVoteId, voter, voterIsSignedIn, buttonsActive, value } = this.state;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }

    if (voterIsSignedIn) {
      // console.log('SettingsDomain, Signed In.');
    }
    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsDomain, Custom Domain: ', organization.we_vote_custom_domain);
    }

    const { classes } = this.props;

    return (
      <Wrapper>
        <Helmet title="Domain Settings" />
        <Card className="card">
          <CardMain className="card-main">
            <h1 className="h2">Domain</h1>
            <FormControl classes={{ root: classes.formControl }}>
              <RadioGroup
                name="domainInput"
                value={value}
                onChange={this.handleChange}
              >
                <InputBoxLabel>
                  We Vote Subdomain
                </InputBoxLabel>
                <FormControlLabel
                  classes={value === 'subdomain' ? { root: classes.formControlLabel, label: classes.label } : { root: classes.formControlLabelDisabled, label: classes.label }}
                  value="subdomain"
                  control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                  label={(
                    <IconInputContainer>
                      <i className="fas fa-globe-americas" />
                      <InputBase
                        onChange={this.onSubdomainInputChange}
                        classes={{ root: classes.inputBase, input: classes.inputItem }}
                        placeholder="Type Domain..."
                      />
                      <SubdomainExtensionText>
                        .WeVote.us
                      </SubdomainExtensionText>
                    </IconInputContainer>
                  )}
                  checked={value === 'subdomain'}
                />
                {buttonsActive === 'subdomain' ? (
                  <ButtonsContainer>
                    <Button classes={{ root: classes.button }} onClick={this.onCancelButton} color="primary" variant="outlined">
                      Cancel
                    </Button>
                    <Button color="primary" variant="contained" onClick={this.onSaveButton}>
                      Save
                    </Button>
                  </ButtonsContainer>
                ) : null}
                <Seperator />
                <InputBoxLabel>
                  Custom Domain
                </InputBoxLabel>
                <InputBoxHelperLabel>
                  If you already own a domain, enter it here. Empty it to disconnect.
                </InputBoxHelperLabel>
                <FormControlLabel
                  classes={value === 'custom' ? { root: classes.formControlLabel, label: classes.label } : { root: classes.formControlLabelDisabled, label: classes.label }}
                  value="custom"
                  control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                  label={(
                    <IconInputContainer>
                      <i className="fas fa-globe-americas" />
                      <InputBase
                        onChange={this.onSubdomainInputChange}
                        classes={{ root: classes.inputBase, input: classes.inputItem }}
                        placeholder="Type Domain..."
                      />
                    </IconInputContainer>
                  )}
                  checked={value === 'custom'}
                />
                {buttonsActive === 'custom' ? (
                  <ButtonsContainer>
                    <Button classes={{ root: classes.button }} onClick={this.onCancelButton} color="primary" variant="outlined">
                      Cancel
                    </Button>
                    <Button onClick={this.state.voterIsPremium ? this.onSaveButton : this.openPremiumPage} variant="contained" classes={{ root: classes.goldButton }}>
                      {this.state.voterIsPremium ? 'Save' : 'Upgrade to Professional'}
                    </Button>
                  </ButtonsContainer>
                ) : null}
              </RadioGroup>
            </FormControl>
          </CardMain>
        </Card>
      </Wrapper>
    );
  }
}

const styles = () => ({
  formControl: {
    width: '100%',
  },
  formControlLabel: {
    border: '1.1px solid rgba(0, 0, 0, 0.45)',
    width: '100%',
    borderRadius: '3px',
    margin: 0,
    height: 45,
  },
  formControlLabelDisabled: {
    width: '100%',
    border: '1.1px solid rgba(0, 0, 0, 0.45)',
    borderRadius: '3px',
    margin: 0,
    height: 45,
    pointerEvents: 'none',
  },
  label: {
    width: '100%',
  },
  inputBase: {
    border: 'none',
    background: 'none',
    width: '100%',
    height: '45px',
    marginLeft: 12,
    fontSize: 14,
    flex: '1 0 0',
  },
  inputItem: {
    height: '45px',
    width: '100%',
  },
  radioButton: {
    width: 45,
    height: 45,
    padding: 12,
    pointerEvents: 'auto',
  },
  button: {
    marginRight: 8,
  },
  goldButton: {
    background: 'linear-gradient(70deg, rgba(219,179,86,1) 14%, rgba(162,124,33,1) 94%)',
    color: 'white',
  },
});

const Wrapper = styled.div`
`;

const Card = styled.div`
`;

const CardMain = styled.div`
`;

const IconInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-left: 1px solid rgba(0, 0, 0, 0.45);
  padding-left: 12px;
  color: rgba(0, 0, 0, 0.54);
  height: 100%;
  width: 100%;
`;

const InputBoxLabel = styled.h4`
  font-weight: bold;
  font-size: 13px; 
`;

const InputBoxHelperLabel = styled.p`
  margin: 0;
  font-size: 11px;
  margin-bottom: 4px;
  margin-top: -4px;
`;

const SubdomainExtensionText = styled.h5`
  margin: 0;
  height: 43px;
  border-left: 1px solid rgba(0, 0, 0, 0.45);
  background-color: #eee;
  color: rgba(0, 0, 0, 0.45);
  width: fit-content;
  padding: 10px 8px 0;
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
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
  background: #f7f7f7;
  margin: 14px 0 16px;
`;

export default withStyles(styles)(SettingsDomain);
