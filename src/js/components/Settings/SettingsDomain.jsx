import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, FormControl, FormControlLabel, Radio, RadioGroup, InputBase } from '@material-ui/core';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import { cordovaOpenSafariView, isWebApp } from '../../utils/cordovaUtils';
import LoadingWheel from '../LoadingWheel';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import PremiumableButton from '../Widgets/PremiumableButton';
import { renderLog } from '../../utils/logging';
import SettingsAccount from './SettingsAccount';
import SettingsAccountLevelChip from './SettingsAccountLevelChip';
import VoterStore from '../../stores/VoterStore';
import { voterFeaturePackageExceedsOrEqualsRequired } from '../../utils/pricingFunctions';
import DelayedLoad from '../Widgets/DelayedLoad';


class SettingsDomain extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenFeaturePackage: 'FREE',
      organization: {},
      organizationWeVoteId: '',
      organizationChosenDomainName: '',
      organizationChosenDomainNameAlreadyTaken: false,
      organizationChosenDomainNameNotValid: false,
      organizationChosenDomainNameSavedValue: '',
      organizationChosenDomainNameChangedLocally: false,
      organizationChosenSubdomain: '',
      organizationChosenSubdomainAlreadyTaken: false,
      organizationChosenSubdomainNotValid: false,
      organizationChosenSubdomainSavedValue: '',
      organizationChosenSubdomainChangedLocally: false,
      voter: {},
      voterIsSignedIn: false,
      voterFeaturePackageExceedsOrEqualsProfessional: false,
      radioGroupValue: 'domainNameRadioButtonSelected',
    };
  }

  componentDidMount () {
    // console.log('SettingsDomain componentDidMount');
    this.onVoterStoreChange();
    // this.onOrganizationStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
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
    if (this.state.organizationChosenDomainName !== nextState.organizationChosenDomainName) {
      // console.log('this.state.organizationChosenDomainName', this.state.organizationChosenDomainName, ', nextState.organizationChosenDomainName', nextState.organizationChosenDomainName);
      return true;
    }
    if (this.state.organizationChosenDomainNameAlreadyTaken !== nextState.organizationChosenDomainNameAlreadyTaken) {
      // console.log('this.state.organizationChosenDomainNameAlreadyTaken', this.state.organizationChosenDomainNameAlreadyTaken, ', nextState.organizationChosenDomainNameAlreadyTaken', nextState.organizationChosenDomainNameAlreadyTaken);
      return true;
    }
    if (this.state.organizationChosenDomainNameChangedLocally !== nextState.organizationChosenDomainNameChangedLocally) {
      // console.log('this.state.organizationChosenDomainNameChangedLocally', this.state.organizationChosenDomainNameChangedLocally, ', nextState.organizationChosenDomainNameChangedLocally', nextState.organizationChosenDomainNameChangedLocally);
      return true;
    }
    if (this.state.organizationChosenDomainNameNotValid !== nextState.organizationChosenDomainNameNotValid) {
      // console.log('this.state.organizationChosenDomainNameNotValid', this.state.organizationChosenDomainNameNotValid, ', nextState.organizationChosenDomainNameNotValid', nextState.organizationChosenDomainNameNotValid);
      return true;
    }
    if (this.state.organizationChosenDomainNameSavedValue !== nextState.organizationChosenDomainNameSavedValue) {
      // console.log('this.state.organizationChosenDomainNameSavedValue', this.state.organizationChosenDomainNameSavedValue, ', nextState.organizationChosenDomainNameSavedValue', nextState.organizationChosenDomainNameSavedValue);
      return true;
    }
    if (this.state.organizationChosenSubdomain !== nextState.organizationChosenSubdomain) {
      // console.log('this.state.organizationChosenSubdomain', this.state.organizationChosenSubdomain, ', nextState.organizationChosenSubdomain', nextState.organizationChosenSubdomain);
      return true;
    }
    if (this.state.organizationChosenSubdomainAlreadyTaken !== nextState.organizationChosenSubdomainAlreadyTaken) {
      // console.log('this.state.organizationChosenSubdomainAlreadyTaken', this.state.organizationChosenSubdomainAlreadyTaken, ', nextState.organizationChosenSubdomainAlreadyTaken', nextState.organizationChosenSubdomainAlreadyTaken);
      return true;
    }
    if (this.state.organizationChosenSubdomainChangedLocally !== nextState.organizationChosenSubdomainChangedLocally) {
      // console.log('this.state.organizationChosenSubdomainChangedLocally', this.state.organizationChosenSubdomainChangedLocally, ', nextState.organizationChosenSubdomainChangedLocally', nextState.organizationChosenSubdomainChangedLocally);
      return true;
    }
    if (this.state.organizationChosenSubdomainNotValid !== nextState.organizationChosenSubdomainNotValid) {
      // console.log('this.state.organizationChosenSubdomainNotValid', this.state.organizationChosenSubdomainNotValid, ', nextState.organizationChosenSubdomainNotValid', nextState.organizationChosenSubdomainNotValid);
      return true;
    }
    if (this.state.organizationChosenSubdomainSavedValue !== nextState.organizationChosenSubdomainSavedValue) {
      // console.log('this.state.organizationChosenSubdomainSavedValue', this.state.organizationChosenSubdomainSavedValue, ', nextState.organizationChosenSubdomainSavedValue', nextState.organizationChosenSubdomainSavedValue);
      return true;
    }
    if (this.state.voterFeaturePackageExceedsOrEqualsProfessional !== nextState.voterFeaturePackageExceedsOrEqualsProfessional) {
      // console.log('this.state.voterFeaturePackageExceedsOrEqualsProfessional', this.state.voterFeaturePackageExceedsOrEqualsProfessional, ', nextState.voterFeaturePackageExceedsOrEqualsProfessional', nextState.voterFeaturePackageExceedsOrEqualsProfessional);
      return true;
    }
    if (this.state.radioGroupValue !== nextState.radioGroupValue) {
      return true;
    }

    const priorOrganization = this.state.organization;
    const nextOrganization = nextState.organization;

    const priorWeVoteChosenDomainNameString = priorOrganization.chosen_domain_string || '';
    const nextWeVoteChosenDomainNameString = nextOrganization.chosen_domain_string || '';
    const priorWeVoteChosenSubdomainString = priorOrganization.chosen_subdomain_string || '';
    const nextWeVoteChosenSubdomainString = nextOrganization.chosen_subdomain_string || '';

    if (priorWeVoteChosenDomainNameString !== nextWeVoteChosenDomainNameString) {
      // console.log('priorWeVoteChosenDomainNameString', priorWeVoteChosenDomainNameString, ', nextWeVoteChosenDomainNameString', nextWeVoteChosenDomainNameString);
      return true;
    }
    if (priorWeVoteChosenSubdomainString !== nextWeVoteChosenSubdomainString) {
      // console.log('priorWeVoteChosenSubdomainString', priorWeVoteChosenSubdomainString, ', nextWeVoteChosenSubdomainString', nextWeVoteChosenSubdomainString);
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationChosenDomainNameChangedLocally, organizationChosenSubdomainChangedLocally, organizationWeVoteId } = this.state;
    let {
      organizationChosenDomainNameAlreadyTaken, organizationChosenSubdomainAlreadyTaken,
      organizationChosenDomainNameNotValid, organizationChosenSubdomainNotValid,
    } = this.state;
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    if (!organizationChosenSubdomainAlreadyTaken) {
      organizationChosenSubdomainAlreadyTaken = organization.subdomain_string_already_taken || false;
    }
    if (!organizationChosenDomainNameAlreadyTaken) {
      organizationChosenDomainNameAlreadyTaken = organization.full_domain_string_already_taken || false;
    }
    if (!organizationChosenSubdomainNotValid) {
      organizationChosenSubdomainNotValid = organization.subdomain_string_not_valid || false;
    }
    if (!organizationChosenDomainNameNotValid) {
      organizationChosenDomainNameNotValid = organization.full_domain_string_not_valid || false;
    }
    const organizationChosenDomainNameSavedValue = organization.chosen_domain_string || '';
    const organizationChosenSubdomainSavedValue = organization.chosen_subdomain_string || '';
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    const voterFeaturePackageExceedsOrEqualsProfessional = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'PROFESSIONAL');
    // console.log('onOrganizationStoreChange organization: ', organization);
    // console.log('onOrganizationStoreChange organizationChosenDomainNameChangedLocally: ', organizationChosenDomainNameChangedLocally);
    // console.log('onOrganizationStoreChange organizationChosenSubdomainChangedLocally: ', organizationChosenSubdomainChangedLocally);
    this.setState({
      chosenFeaturePackage,
      organization,
      organizationChosenDomainNameAlreadyTaken,
      organizationChosenDomainNameNotValid,
      organizationChosenDomainNameSavedValue,
      organizationChosenSubdomainAlreadyTaken,
      organizationChosenSubdomainNotValid,
      organizationChosenSubdomainSavedValue,
      voterFeaturePackageExceedsOrEqualsProfessional,
    });
    // If it hasn't been changed locally, then use the one saved in the API server
    if (!organizationChosenDomainNameChangedLocally) {
      this.setState({
        organizationChosenDomainName: organizationChosenDomainNameSavedValue || '',
      });
    }
    // If it hasn't been changed locally, then use the one saved in the API server
    if (!organizationChosenSubdomainChangedLocally) {
      this.setState({
        organizationChosenSubdomain: organizationChosenSubdomainSavedValue || '',
      });
    }
    if (!organizationChosenDomainNameChangedLocally && !organizationChosenSubdomainChangedLocally) {
      // If neither name has been changed, switch to the Domain Name input box
      if (organizationChosenDomainNameSavedValue && organizationChosenDomainNameSavedValue !== '') {
        this.setState({
          radioGroupValue: 'domainNameRadioButtonSelected',
        });
      } else {
        this.setState({
          radioGroupValue: 'subdomainRadioButtonSelected',
        });
      }
    }
  }

  onVoterStoreChange () {
    const { organizationChosenDomainNameChangedLocally, organizationChosenSubdomainChangedLocally } = this.state;
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    const organizationChosenSubdomainSavedValue = organization.chosen_subdomain_string || '';
    const organizationChosenDomainNameSavedValue = organization.chosen_domain_string || '';
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    const voterFeaturePackageExceedsOrEqualsProfessional = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'PROFESSIONAL');
    // console.log('onVoterStoreChange voter: ', voter);
    this.setState({
      chosenFeaturePackage,
      organization,
      organizationChosenDomainNameSavedValue,
      organizationChosenSubdomainSavedValue,
      organizationWeVoteId,
      voter,
      voterIsSignedIn,
      voterFeaturePackageExceedsOrEqualsProfessional,
    });
    // If it hasn't been changed locally, then use the one saved in the API server
    if (!organizationChosenDomainNameChangedLocally) {
      this.setState({
        organizationChosenDomainName: organizationChosenDomainNameSavedValue || '',
      });
    }
    // If it hasn't been changed locally, then use the one saved in the API server
    if (!organizationChosenSubdomainChangedLocally) {
      this.setState({
        organizationChosenSubdomain: organizationChosenSubdomainSavedValue || '',
      });
    }
  }

  handleOrganizationChosenSubdomainChange = (event) => {
    const { organizationChosenSubdomain } = this.state;
    // console.log('handleOrganizationChosenSubdomainChange, organizationChosenSubdomain: ', organizationChosenSubdomain);
    // console.log('handleOrganizationChosenSubdomainChange, event.target.value: ', event.target.value);
    if (event.target.value !== organizationChosenSubdomain) {
      this.setState({
        organizationChosenSubdomain: event.target.value || '',
        organizationChosenSubdomainAlreadyTaken: false,
        organizationChosenSubdomainChangedLocally: true,
        organizationChosenSubdomainNotValid: false,
      });
    }
  }

  handleOrganizationChosenDomainNameChange = (event) => {
    const { organizationChosenDomainName } = this.state;
    // console.log('handleOrganizationChosenDomainNameChange, organizationChosenDomainName: ', organizationChosenDomainName);
    // console.log('handleOrganizationChosenDomainNameChange, event.target.value: ', event.target.value);
    if (event.target.value !== organizationChosenDomainName) {
      this.setState({
        organizationChosenDomainName: event.target.value || '',
        organizationChosenDomainNameAlreadyTaken: false,
        organizationChosenDomainNameChangedLocally: true,
        organizationChosenDomainNameNotValid: false,
      });
    }
  }

  handleRadioGroupChange = (event) => {
    // console.log('handleRadioGroupChange');
    const { radioGroupValue } = this.state;
    if (radioGroupValue !== event.target.value) {
      this.setState({
        radioGroupValue: event.target.value || '',
      });
    }
  }

  handleRadioGroupChoiceSubdomain = () => {
    // console.log('handleRadioGroupChoiceSubdomain');
    const { radioGroupValue } = this.state;
    if (radioGroupValue !== 'subdomainRadioButtonSelected') {
      this.setState({
        radioGroupValue: 'subdomainRadioButtonSelected',
      });
    }
  }

  handleRadioGroupChoiceDomainName = () => {
    // console.log('handleRadioGroupChoiceDomainName');
    const { radioGroupValue } = this.state;
    if (radioGroupValue !== 'domainNameRadioButtonSelected') {
      this.setState({
        radioGroupValue: 'domainNameRadioButtonSelected',
      });
    }
  }

  onCancelDomainNameButton = () => {
    // console.log('onCancelDomainNameButton');
    const { organizationChosenDomainNameSavedValue } = this.state;
    this.setState({
      organizationChosenDomainName: organizationChosenDomainNameSavedValue || '',
      organizationChosenDomainNameChangedLocally: false,
    });
  }

  onCancelSubdomainButton = () => {
    // console.log('onCancelSubdomainButton');
    const { organizationChosenSubdomainSavedValue } = this.state;
    this.setState({
      organizationChosenSubdomain: organizationChosenSubdomainSavedValue || '',
      organizationChosenSubdomainChangedLocally: false,
    });
  }

  onSaveDomainNameButton = (event) => {
    // console.log('onSaveDomainNameButton');
    const { organizationChosenDomainName, organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenDomainNameSave(organizationWeVoteId, organizationChosenDomainName);
    this.setState({
      organizationChosenDomainNameChangedLocally: false,
      chosenDomainNameBeforeErrorCheck: organizationChosenDomainName,
    });
    event.preventDefault();
  }

  onSaveSubdomainButton = (event) => {
    // console.log('onSaveSubdomainButton');
    const { organizationChosenSubdomain, organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenSubdomainSave(organizationWeVoteId, organizationChosenSubdomain);
    this.setState({
      organizationChosenSubdomainChangedLocally: false,
      chosenSubdomainBeforeErrorCheck: organizationChosenSubdomain,
    });
    event.preventDefault();
  }

  openPaidAccountUpgradeModal (paidAccountUpgradeMode) {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    if (isWebApp()) {
      AppActions.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
    } else {
      cordovaOpenSafariView('https://wevote.us/more/pricing', null, 50);
    }
  }

  render () {
    renderLog('SettingsDomain');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      chosenFeaturePackage,
      organizationChosenDomainName, organizationChosenDomainNameAlreadyTaken,
      organizationChosenDomainNameChangedLocally, organizationChosenDomainNameSavedValue,
      organizationChosenDomainNameNotValid,
      organizationChosenSubdomain, organizationChosenSubdomainAlreadyTaken,
      organizationChosenSubdomainChangedLocally, organizationChosenSubdomainSavedValue,
      organizationChosenSubdomainNotValid,
      organizationWeVoteId, voter, voterFeaturePackageExceedsOrEqualsProfessional, voterIsSignedIn,
      radioGroupValue, chosenDomainNameBeforeErrorCheck, chosenSubdomainBeforeErrorCheck,
    } = this.state;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    } else if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return (
        <DelayedLoad waitBeforeShow={1000}>
          <SettingsAccount />
        </DelayedLoad>
      );
    }

    const { classes, externalUniqueId } = this.props;

    return (
      <div>
        <Helmet title="Domain Settings" />
        <div className="card">
          <div className="card-main">
            <h1 className="h2">Domain</h1>
            <Introduction>
              {chosenFeaturePackage === 'FREE' && (
                <>
                  Want to create a configured version of We Vote you can send out to your followers?
                  {' '}
                  {!(organizationChosenSubdomainSavedValue || organizationChosenDomainNameSavedValue) && (
                    <>
                      Start by entering your own Subdomain or Custom Domain below.
                      {' '}
                    </>
                  )}
                  <OpenExternalWebSite
                    linkIdAttribute="learnMoreSettingsDomain"
                    url="https://help.wevote.us/hc/en-us/articles/360037725754-Customizing-Your-Voter-Guide"
                    target="_blank"
                    body={(<span>Learn more here.</span>)}
                  />
                </>
              )}
            </Introduction>
            {!!(organizationChosenSubdomainSavedValue || organizationChosenDomainNameSavedValue) && (
              <LinkToDomainRow>
                <Separator />
                To see the changes you make on this page, please visit:
                {' '}
                {organizationChosenSubdomainSavedValue && (
                  <OpenExternalWebSite
                    linkIdAttribute="organizationChosenSubdomainSavedValue"
                    url={`https://${organizationChosenSubdomainSavedValue}.WeVote.US`}
                    target="_blank"
                    body={(<span>{`https://${organizationChosenSubdomainSavedValue}.WeVote.US`}</span>)}
                  />
                )}
                {' '}
                {organizationChosenDomainNameSavedValue && (
                  <OpenExternalWebSite
                    linkIdAttribute="organizationChosenDomainNameSavedValue"
                    url={`https://${organizationChosenDomainNameSavedValue}`}
                    target="_blank"
                    body={(<span>{`https://${organizationChosenDomainNameSavedValue}`}</span>)}
                  />
                )}
                <Separator />
              </LinkToDomainRow>
            )}
            <FormControl classes={{ root: classes.formControl }}>
              <RadioGroup
                name="domainInput"
                value={radioGroupValue}
                onChange={this.handleRadioGroupChange}
              >
                <InputBoxLabel error={organizationChosenSubdomainAlreadyTaken}>
                  We Vote Subdomain
                </InputBoxLabel>
                <FormControlLabel
                  classes={!organizationChosenSubdomainAlreadyTaken ? { root: classes.formControlLabel, label: classes.label } : { root: classes.formControlLabelError, label: classes.label }}
                  value="subdomainRadioButtonSelected"
                  control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                  label={(
                    <IconInputContainer error={organizationChosenSubdomainAlreadyTaken}>
                      <i className="fas fa-globe-americas" />
                      <InputBase
                        classes={{ root: classes.inputBase, input: classes.inputItem }}
                        onChange={this.handleOrganizationChosenSubdomainChange}
                        id={`subdomainInputBox-${externalUniqueId}`}
                        placeholder="Subdomain..."
                        value={organizationChosenSubdomainAlreadyTaken ? chosenSubdomainBeforeErrorCheck : organizationChosenSubdomain || ''}
                      />
                      <SubdomainExtensionText error={organizationChosenSubdomainAlreadyTaken}>
                        .WeVote.US
                      </SubdomainExtensionText>
                    </IconInputContainer>
                  )}
                  onClick={this.handleRadioGroupChoiceSubdomain}
                  checked={radioGroupValue === 'subdomainRadioButtonSelected'}
                />
                {organizationChosenSubdomainAlreadyTaken ? (
                  <InputBoxHelperLabel error>
                    &quot;
                    https://
                    {chosenSubdomainBeforeErrorCheck}
                    .WeVote.US
                    &quot;
                    {' '}
                    domain is already taken
                  </InputBoxHelperLabel>
                ) : null}
                {organizationChosenSubdomainNotValid ? (
                  <InputBoxHelperLabel error>
                    &quot;https://
                    {chosenSubdomainBeforeErrorCheck}
                    .WeVote.US&quot;
                    {' '}
                    is not a valid domain name
                  </InputBoxHelperLabel>
                ) : null}
                {radioGroupValue === 'subdomainRadioButtonSelected' && (
                  <div>
                    {!organizationChosenSubdomainAlreadyTaken && (
                      <InputBoxDescriptionUnder>
                        After saving a new subdomain, please allow 10 minutes for your domain to be ready
                        {organizationChosenSubdomain ? (
                          <OpenExternalWebSite
                            linkIdAttribute="organizationChosenSubdomain"
                            url={`https://${organizationChosenSubdomain}.WeVote.US`}
                            target="_blank"
                            body={(<span>{`: https://${organizationChosenSubdomain}.WeVote.US`}</span>)}
                          />
                        ) : '.'}
                      </InputBoxDescriptionUnder>
                    )}
                    <ButtonsContainer>
                      <Button
                        id={`cancelSubdomainButton-${externalUniqueId}`}
                        classes={{ root: classes.button }}
                        color="primary"
                        disabled={!organizationChosenSubdomainChangedLocally}
                        onClick={this.onCancelSubdomainButton}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                      <Button
                        id={`saveSubdomainButton-${externalUniqueId}`}
                        color="primary"
                        disabled={!organizationChosenSubdomainChangedLocally}
                        onClick={this.onSaveSubdomainButton}
                        variant="contained"
                      >
                        Save
                      </Button>
                    </ButtonsContainer>
                  </div>
                )}
                <Separator />
              </RadioGroup>
            </FormControl>
            <FormControl classes={{ root: classes.formControl }}>
              <RadioGroup
                name="domainInput"
                value={radioGroupValue}
                onChange={this.handleRadioGroupChange}
              >
                <InputBoxLabel error={organizationChosenDomainNameAlreadyTaken}>
                  <span>Custom Domain</span>
                  <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="PROFESSIONAL" />
                </InputBoxLabel>
                <InputBoxHelperLabel>
                  If you already own a domain that you want to use, enter it here. You will need to direct this domain name to the We Vote hosted server network, using a CNAME record.
                  {' '}
                  You can not include folder paths, but you can use a subdomain of your primary domain.
                  {' '}
                  (Valid examples include: &quot;vote.sierraclub.org&quot; and &quot;MyVotingSite.org&quot;)
                </InputBoxHelperLabel>
                <FormControlLabel
                  classes={!organizationChosenDomainNameAlreadyTaken ? { root: classes.formControlLabel, label: classes.label } : { root: classes.formControlLabelError, label: classes.label }}
                  value="domainNameRadioButtonSelected"
                  control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                  label={(
                    <IconInputContainer error={organizationChosenDomainNameAlreadyTaken}>
                      <i className="fas fa-globe-americas" />
                      <InputBase
                        classes={{ root: classes.inputBase, input: classes.inputItem }}
                        onChange={this.handleOrganizationChosenDomainNameChange}
                        placeholder="Type Full Domain..."
                        id={`customDomainInputBox-${externalUniqueId}`}
                        value={organizationChosenDomainNameAlreadyTaken ? chosenDomainNameBeforeErrorCheck : organizationChosenDomainName || ''}
                      />
                    </IconInputContainer>
                  )}
                  checked={radioGroupValue === 'domainNameRadioButtonSelected'}
                  onClick={this.handleRadioGroupChoiceDomainName}
                />
                {organizationChosenDomainNameAlreadyTaken ? (
                  <InputBoxHelperLabel error>
                    &quot;
                    https://
                    {chosenDomainNameBeforeErrorCheck}
                    &quot;
                    {' '}
                    domain is already taken
                  </InputBoxHelperLabel>
                ) : null}
                {organizationChosenDomainNameNotValid ? (
                  <InputBoxHelperLabel error>
                    &quot;https://
                    {chosenDomainNameBeforeErrorCheck}
                    &quot;
                    {' '}
                    is not a valid domain name
                  </InputBoxHelperLabel>
                ) : null}
                {radioGroupValue === 'domainNameRadioButtonSelected' && (
                  <div>
                    {!organizationChosenSubdomainAlreadyTaken && (
                      <InputBoxDescriptionUnder>
                        After saving a new domain, please
                        <OpenExternalWebSite
                          linkIdAttribute="weVoteSupportSettingsDomain"
                          url="https://help.wevote.us/hc/en-us/requests/new"
                          target="_blank"
                          body={<span>contact support to complete the installation</span>}
                        />
                        .
                      </InputBoxDescriptionUnder>
                    )}
                    <ButtonsContainer>
                      <Button
                        id={`cancelOrganizationDomainButton-${externalUniqueId}`}
                        classes={{ root: classes.button }}
                        color="primary"
                        disabled={!organizationChosenDomainNameChangedLocally}
                        onClick={this.onCancelDomainNameButton}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                      <PremiumableButton
                        id={`saveOrganizationDomainPremiumButton-${externalUniqueId}`}

                        premium={voterFeaturePackageExceedsOrEqualsProfessional ? 1 : 0}
                        onClick={voterFeaturePackageExceedsOrEqualsProfessional ? this.onSaveDomainNameButton : () => this.openPaidAccountUpgradeModal('professional')}
                      >
                        {voterFeaturePackageExceedsOrEqualsProfessional ? 'Save' : (
                          <span>
                            <span className="u-show-desktop-tablet">
                              Upgrade to Professional
                            </span>
                            <span className="u-show-mobile">
                              Upgrade to Pro
                            </span>
                          </span>
                        )}
                      </PremiumableButton>
                    </ButtonsContainer>
                  </div>
                )}
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>
    );
  }
}
SettingsDomain.propTypes = {
  externalUniqueId: PropTypes.string,
  classes: PropTypes.object,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  formControlLabel: {
    border: '1.1px solid rgba(0, 0, 0, 0.45)',
    width: '100%',
    borderRadius: '3px',
    margin: 0,
    height: 55.4,
  },
  formControlLabelError: {
    width: '100%',
    border: '1.6px solid rgb(255, 73, 34)',
    borderRadius: '3px',
    margin: 0,
    height: 55.4,
  },
  label: {
    width: '100%',
  },
  inputBase: {
    border: 'none',
    background: 'none',
    width: '100%',
    height: '55.4px',
    marginLeft: 12,
    fontSize: 14,
    flex: '1 0 0',
  },
  inputItem: {
    height: '55.4px',
    width: '100%',
  },
  radioButton: {
    width: 55.4,
    height: 55.4,
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

const Introduction = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
`;

const IconInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-left: ${(props) => (props.error ? '1.6px solid rgb(255, 73, 34)' : '1px solid rgba(0, 0, 0, 0.45)')} ;
  padding-left: 12px;
  color: rgba(0, 0, 0, 0.54);
  height: 100%;
  width: 100%;
`;

const InputBoxLabel = styled.h4`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.error ? 'rgb(255, 73, 34)' : 'black')}
`;

const InputBoxHelperLabel = styled.p`
  margin: 0;
  font-size: 14px;
  margin-bottom:  ${(props) => (props.error ? '6px' : '4px')};
  margin-top:  ${(props) => (props.error ? '6px' : '-4px')};
  color: ${(props) => (props.error ? 'rgb(255, 73, 34)' : 'black')};
`;

const InputBoxDescriptionUnder = styled.div`
  color: rgba(0, 0, 0, 0.54);
  font-size: 14px;
  margin-bottom:  4px;
  margin-top:  4px;
`;

const SubdomainExtensionText = styled.h5`
  margin: 0;
  height: ${(props) => (props.error ? '52.4px' : '53.4px')};
  border-left: ${(props) => (props.error ? '1.6px solid rgb(255, 73, 34)' : '1px solid rgba(0, 0, 0, 0.45)')};
  background-color: #eee;
  color: rgba(0, 0, 0, 0.45);
  width: fit-content;
  padding: 16px 8px 0;
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
  pointer: none;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;
  width: 100%;
  margin-top: 12px;
`;

const LinkToDomainRow = styled.div`
  margin: 0;
  padding: 0;
`;

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background: #eee;
  margin: 16px 0;
`;

export default withStyles(styles)(SettingsDomain);
