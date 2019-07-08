import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
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
      value: null,
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
    const newValue = event.target.value;
    this.setState({ value: newValue });
  }

  render () {
    renderLog(__filename);
    const { organization, organizationWeVoteId, voter, voterIsSignedIn } = this.state;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }

    if (voterIsSignedIn) {
      // console.log('SettingsDomain, Signed In.');
    }
    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsDomain, Custom Domain: ', organization.we_vote_custom_domain);
    }

    const { value } = this.state;
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
                  classes={{ root: classes.formControlLabel }}
                  value="subdomain"
                  control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                  label={(
                    <IconInputContainer onClick={null}>
                      <i className="fas fa-globe-americas" />
                      <InputBase classes={{ root: classes.inputBase, input: classes.inputItem }} placeholder="Type Domain..." />
                    </IconInputContainer>
                  )}
                  checked={value === 'subdomain'}
                />
                <InputBoxLabel>
                  Custom Domain
                </InputBoxLabel>
                <FormControlLabel
                  classes={{ root: classes.formControlLabel }}
                  value="custom"
                  control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                  label={(
                    <IconInputContainer onClick={null}>
                      <i className="fas fa-globe-americas" />
                      <InputBase classes={{ root: classes.inputBase, input: classes.inputItem }} placeholder="Type Domain..." />
                    </IconInputContainer>
                  )}
                  checked={value === 'custom'}
                />
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
    borderRadius: '3px',
    margin: 0,
    marginBottom: 12,
    height: 45,
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
`;

const InputBoxLabel = styled.h4`
  font-weight: bold;
  font-size: 13px; 
`;

export default withStyles(styles)(SettingsDomain);
