import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import AppActions from '../../actions/AppActions';
import LoadingWheel from '../LoadingWheel';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import SettingsAccountLevelChip from './SettingsAccountLevelChip';
import { voterFeaturePackageExceedsOrEqualsRequired } from '../../utils/pricingFunctions';
import VoterStore from '../../stores/VoterStore';

class SettingsAnalytics extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      chosenFeaturePackage: 'FREE',
      analyticsButtonsActive: '',
      organization: {},
      organizationWeVoteId: '',
      organizationChosenGoogleAnalyticsTracker: '',
      organizationChosenGoogleAnalyticsTrackerSavedValue: '',
      organizationChosenGoogleAnalyticsTrackerChangedLocally: false,
      organizationChosenHtmlVerification: '',
      organizationChosenHtmlVerificationSavedValue: '',
      organizationChosenHtmlVerificationChangedLocally: false,
      voter: {},
      voterFeaturePackageExceedsOrEqualsEnterprise: false,
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    // console.log("SettingsAnalytics componentDidMount");
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
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
    if (this.state.analyticsButtonsActive !== nextState.analyticsButtonsActive) {
      // console.log('this.state.analyticsButtonsActive', this.state.analyticsButtonsActive, ', nextState.analyticsButtonsActive', nextState.analyticsButtonsActive);
      return true;
    }
    if (this.state.organizationChosenGoogleAnalyticsTracker !== nextState.organizationChosenGoogleAnalyticsTracker) {
      // console.log('this.state.organizationChosenGoogleAnalyticsTracker', this.state.organizationChosenGoogleAnalyticsTracker, ', nextState.organizationChosenGoogleAnalyticsTracker', nextState.organizationChosenGoogleAnalyticsTracker);
      return true;
    }
    if (this.state.organizationChosenGoogleAnalyticsTrackerChangedLocally !== nextState.organizationChosenGoogleAnalyticsTrackerChangedLocally) {
      // console.log('this.state.organizationChosenGoogleAnalyticsTrackerChangedLocally', this.state.organizationChosenGoogleAnalyticsTrackerChangedLocally, ', nextState.organizationChosenGoogleAnalyticsTrackerChangedLocally', nextState.organizationChosenGoogleAnalyticsTrackerChangedLocally);
      return true;
    }
    if (this.state.organizationChosenGoogleAnalyticsTrackerSavedValue !== nextState.organizationChosenGoogleAnalyticsTrackerSavedValue) {
      // console.log('this.state.organizationChosenGoogleAnalyticsTrackerSavedValue', this.state.organizationChosenGoogleAnalyticsTrackerSavedValue, ', nextState.organizationChosenGoogleAnalyticsTrackerSavedValue', nextState.organizationChosenGoogleAnalyticsTrackerSavedValue);
      return true;
    }
    if (this.state.organizationChosenHtmlVerification !== nextState.organizationChosenHtmlVerification) {
      // console.log('this.state.organizationChosenHtmlVerification', this.state.organizationChosenHtmlVerification, ', nextState.organizationChosenHtmlVerification', nextState.organizationChosenHtmlVerification);
      return true;
    }
    if (this.state.organizationChosenHtmlVerificationChangedLocally !== nextState.organizationChosenHtmlVerificationChangedLocally) {
      // console.log('this.state.organizationChosenHtmlVerificationChangedLocally', this.state.organizationChosenHtmlVerificationChangedLocally, ', nextState.organizationChosenHtmlVerificationChangedLocally', nextState.organizationChosenHtmlVerificationChangedLocally);
      return true;
    }
    if (this.state.organizationChosenHtmlVerificationSavedValue !== nextState.organizationChosenHtmlVerificationSavedValue) {
      // console.log('this.state.organizationChosenHtmlVerificationSavedValue', this.state.organizationChosenHtmlVerificationSavedValue, ', nextState.organizationChosenHtmlVerificationSavedValue', nextState.organizationChosenHtmlVerificationSavedValue);
      return true;
    }
    if (this.state.voterFeaturePackageExceedsOrEqualsEnterprise !== nextState.voterFeaturePackageExceedsOrEqualsEnterprise) {
      // console.log('this.state.voterFeaturePackageExceedsOrEqualsEnterprise', this.state.voterFeaturePackageExceedsOrEqualsEnterprise, ', nextState.voterFeaturePackageExceedsOrEqualsEnterprise', nextState.voterFeaturePackageExceedsOrEqualsEnterprise);
      return true;
    }
    const priorOrganization = this.state.organization;
    const nextOrganization = nextState.organization;

    const priorChosenGoogleAnalyticsTracker = priorOrganization.chosen_google_analytics_account_number || '';
    const nextChosenGoogleAnalyticsTracker = nextOrganization.chosen_google_analytics_account_number || '';
    const priorChosenHtmlVerification = priorOrganization.chosen_html_verification_string || '';
    const nextChosenHtmlVerification = nextOrganization.chosen_html_verification_string || '';

    if (priorChosenGoogleAnalyticsTracker !== nextChosenGoogleAnalyticsTracker) {
      // console.log('priorChosenGoogleAnalyticsTracker', priorChosenGoogleAnalyticsTracker, ', nextChosenGoogleAnalyticsTracker', nextChosenGoogleAnalyticsTracker);
      return true;
    }
    if (priorChosenHtmlVerification !== nextChosenHtmlVerification) {
      // console.log('priorChosenHtmlVerification', priorChosenHtmlVerification, ', nextChosenHtmlVerification', nextChosenHtmlVerification);
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
    const { organizationChosenGoogleAnalyticsTrackerChangedLocally, organizationChosenHtmlVerificationChangedLocally, organizationWeVoteId } = this.state;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationChosenSubdomain = organization.chosen_subdomain_string || '';
      const organizationChosenDomainName = organization.chosen_domain_string || '';
      const organizationChosenGoogleAnalyticsTrackerSavedValue = organization.chosen_google_analytics_account_number || '';
      const organizationChosenHtmlVerificationSavedValue = organization.chosen_html_verification_string || '';
      const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
      const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
      this.setState({
        chosenFeaturePackage,
        organization,
        organizationChosenSubdomain,
        organizationChosenDomainName,
        organizationChosenGoogleAnalyticsTrackerSavedValue,
        organizationChosenHtmlVerificationSavedValue,
        voterFeaturePackageExceedsOrEqualsEnterprise,
      });
      // If it hasn't been changed locally, then use the one saved in the API server
      if (!organizationChosenGoogleAnalyticsTrackerChangedLocally) {
        this.setState({
          organizationChosenGoogleAnalyticsTracker: organizationChosenGoogleAnalyticsTrackerSavedValue || '',
        });
      }
      // If it hasn't been changed locally, then use the one saved in the API server
      if (!organizationChosenHtmlVerificationChangedLocally) {
        this.setState({
          organizationChosenHtmlVerification: organizationChosenHtmlVerificationSavedValue || '',
        });
      }
    }
  };

  onVoterStoreChange = () => {
    const { organizationChosenGoogleAnalyticsTrackerChangedLocally, organizationChosenHtmlVerificationChangedLocally } = this.state;
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterIsSignedIn,
    });
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationChosenSubdomain = organization.chosen_subdomain_string || '';
      const organizationChosenDomainName = organization.chosen_domain_string || '';
      const organizationChosenGoogleAnalyticsTrackerSavedValue = organization.chosen_google_analytics_account_number || '';
      const organizationChosenHtmlVerificationSavedValue = organization.chosen_html_verification_string || '';
      const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
      const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
      this.setState({
        chosenFeaturePackage,
        organization,
        organizationChosenSubdomain,
        organizationChosenDomainName,
        organizationChosenGoogleAnalyticsTrackerSavedValue,
        organizationChosenHtmlVerificationSavedValue,
        organizationWeVoteId,
        voterFeaturePackageExceedsOrEqualsEnterprise,
      });
      // If it hasn't been changed locally, then use the one saved in the API server
      if (!organizationChosenGoogleAnalyticsTrackerChangedLocally) {
        this.setState({
          organizationChosenGoogleAnalyticsTracker: organizationChosenGoogleAnalyticsTrackerSavedValue || '',
        });
      }
      // If it hasn't been changed locally, then use the one saved in the API server
      if (!organizationChosenHtmlVerificationChangedLocally) {
        this.setState({
          organizationChosenHtmlVerification: organizationChosenHtmlVerificationSavedValue || '',
        });
      }
    }
  };

  handleOrganizationChosenHtmlVerificationChange = (event) => {
    const { organizationChosenHtmlVerification } = this.state;
    // console.log('handleOrganizationChosenHtmlVerificationChange, organizationChosenHtmlVerification: ', organizationChosenHtmlVerification);
    // console.log('handleOrganizationChosenHtmlVerificationChange, event.target.value: ', event.target.value);
    if (event.target.value !== organizationChosenHtmlVerification) {
      this.setState({
        analyticsButtonsActive: 'organizationChosenHtmlVerificationButtonsActive',
        organizationChosenHtmlVerification: event.target.value || '',
        organizationChosenHtmlVerificationChangedLocally: true,
      });
    }
  };

  handleOrganizationChosenGoogleAnalyticsTrackerChange = (event) => {
    const { organizationChosenGoogleAnalyticsTracker } = this.state;
    // console.log('handleOrganizationChosenGoogleAnalyticsTrackerChange, organizationChosenGoogleAnalyticsTracker: ', organizationChosenGoogleAnalyticsTracker);
    // console.log('handleOrganizationChosenGoogleAnalyticsTrackerChange, event.target.value: ', event.target.value);
    if (event.target.value !== organizationChosenGoogleAnalyticsTracker) {
      this.setState({
        analyticsButtonsActive: 'organizationChosenGoogleAnalyticsTrackerButtonsActive',
        organizationChosenGoogleAnalyticsTracker: event.target.value || '',
        organizationChosenGoogleAnalyticsTrackerChangedLocally: true,
      });
    }
  };

  showChosenGoogleAnalyticsTrackerButtons = () => {
    const { analyticsButtonsActive } = this.state;
    if (analyticsButtonsActive !== 'organizationChosenGoogleAnalyticsTrackerButtonsActive') {
      this.setState({
        analyticsButtonsActive: 'organizationChosenGoogleAnalyticsTrackerButtonsActive',
      });
    }
  };

  onCancelGoogleAnalyticsTrackerButton = () => {
    // console.log('onCancelGoogleAnalyticsTrackerButton');
    const { organizationChosenGoogleAnalyticsTrackerSavedValue } = this.state;
    this.setState({
      organizationChosenGoogleAnalyticsTracker: organizationChosenGoogleAnalyticsTrackerSavedValue || '',
      organizationChosenGoogleAnalyticsTrackerChangedLocally: false,
    });
  };

  showHtmlVerificationButtons = () => {
    const { analyticsButtonsActive } = this.state;
    if (analyticsButtonsActive !== 'organizationChosenHtmlVerificationButtonsActive') {
      this.setState({
        analyticsButtonsActive: 'organizationChosenHtmlVerificationButtonsActive',
      });
    }
  };

  onCancelHtmlVerificationButton = () => {
    // console.log('onCancelHtmlVerificationButton');
    const { organizationChosenHtmlVerificationSavedValue } = this.state;
    this.setState({
      organizationChosenHtmlVerification: organizationChosenHtmlVerificationSavedValue || '',
      organizationChosenHtmlVerificationChangedLocally: false,
    });
  };

  onSaveGoogleAnalyticsTrackerButton = (event) => {
    // console.log('onSaveGoogleAnalyticsTrackerButton');
    const { organizationChosenGoogleAnalyticsTracker, organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenGoogleAnalyticsTrackerSave(organizationWeVoteId, organizationChosenGoogleAnalyticsTracker);
    this.setState({
      organizationChosenGoogleAnalyticsTrackerChangedLocally: false,
    });
    event.preventDefault();
  };

  onSaveHtmlVerificationButton = (event) => {
    // console.log('onSaveHtmlVerificationButton');
    const { organizationChosenHtmlVerification, organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenHtmlVerificationSave(organizationWeVoteId, organizationChosenHtmlVerification);
    this.setState({
      organizationChosenHtmlVerificationChangedLocally: false,
    });
    event.preventDefault();
  };

  openPaidAccountUpgradeModal (paidAccountUpgradeMode) {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    AppActions.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  }

  render () {
    renderLog('SettingsAnalytics');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      chosenFeaturePackage,
      organization, organizationWeVoteId, voter, voterIsSignedIn, analyticsButtonsActive,
      organizationChosenDomainName, organizationChosenSubdomain,
      organizationChosenGoogleAnalyticsTracker, organizationChosenGoogleAnalyticsTrackerChangedLocally,
      organizationChosenHtmlVerification, organizationChosenHtmlVerificationChangedLocally,
      voterFeaturePackageExceedsOrEqualsEnterprise,
    } = this.state;
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
            <Introduction>
              {chosenFeaturePackage === 'FREE' && (
                <>
                  Want to create a configured version of We Vote you can send out to your followers?
                  {' '}
                  <OpenExternalWebSite
                    url="https://help.wevote.us/hc/en-us/articles/360037725754-Customizing-Your-Voter-Guide"
                    target="_blank"
                    body={(<span>Learn more here.</span>)}
                  />
                </>
              )}
            </Introduction>
            <Separator />
            {organizationChosenSubdomain || organizationChosenDomainName ? (
              <LinkToDomainRow>
                To see the changes you make on this page, please visit:
                {' '}
                {organizationChosenSubdomain && (
                  <OpenExternalWebSite
                    url={`https://${organizationChosenSubdomain}.WeVote.US`}
                    target="_blank"
                    body={(<span>{`https://${organizationChosenSubdomain}.WeVote.US`}</span>)}
                  />
                )}
                {' '}
                {organizationChosenDomainName && (
                  <OpenExternalWebSite
                    url={`https://${organizationChosenDomainName}`}
                    target="_blank"
                    body={(<span>{`https://${organizationChosenDomainName}`}</span>)}
                  />
                )}
              </LinkToDomainRow>
            ) : (
              <LinkToDomainRow>
                To see these settings in action, enter a subdomain or domain name on the
                {' '}
                <Link to="/settings/domain">
                  <strong>
                    Your Settings &gt; Domain
                  </strong>
                </Link>
                {' '}
                page.
              </LinkToDomainRow>
            )}
            <Separator />
            <FormControl classes={{ root: classes.formControl }}>
              <InputLabel>
                Google Analytics Tracker
                <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="ENTERPRISE" />
              </InputLabel>
              <InputLabelHelperText>Add your tracking code (e.g., UA-XXXXXXX-X) so you can watch voter activity.</InputLabelHelperText>
              <TextField
                onChange={this.handleOrganizationChosenGoogleAnalyticsTrackerChange}
                onClick={this.showChosenGoogleAnalyticsTrackerButtons}
                label="Paste Google Analytics ID Here..."
                variant="outlined"
                value={organizationChosenGoogleAnalyticsTracker}
              />
            </FormControl>
            {analyticsButtonsActive === 'organizationChosenGoogleAnalyticsTrackerButtonsActive' && (
              <ButtonsContainer>
                <Button
                  classes={{ root: classes.button }}
                  color="primary"
                  disabled={!organizationChosenGoogleAnalyticsTrackerChangedLocally}
                  onClick={this.onCancelGoogleAnalyticsTrackerButton}
                  variant="outlined"
                >
                  Cancel
                </Button>
                {voterFeaturePackageExceedsOrEqualsEnterprise ? (
                  <Button
                    color="primary"
                    disabled={!organizationChosenGoogleAnalyticsTrackerChangedLocally}
                    onClick={this.onSaveGoogleAnalyticsTrackerButton}
                    variant="contained"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.openPaidAccountUpgradeModal('enterprise')}
                    variant="contained"
                    classes={{ root: classes.goldButton }}
                  >
                    <span>
                      <span className="u-show-desktop-tablet">
                        Upgrade to Enterprise
                      </span>
                      <span className="u-show-mobile">
                        Upgrade
                      </span>
                    </span>
                  </Button>
                )
                }
              </ButtonsContainer>
            )}
            <Separator />
            <FormControl classes={{ root: classes.formControl }}>
              <InputLabel>Verify Webmaster Tool</InputLabel>
              <InputLabelHelperText>
                Add your entire HTML verification meta tag (e.g., &lt;meta name=&quot;google-site-verification&quot; content=&quot;your verification string&quot;&gt;) to prove that you control this website.
              </InputLabelHelperText>
              <TextField
                onChange={this.handleOrganizationChosenHtmlVerificationChange}
                onClick={this.showHtmlVerificationButtons}
                label="Paste the HTML Meta Tag Here..."
                variant="outlined"
                value={organizationChosenHtmlVerification}
              />
            </FormControl>
            {analyticsButtonsActive === 'organizationChosenHtmlVerificationButtonsActive' ? (
              <ButtonsContainer>
                <Button
                  classes={{ root: classes.button }}
                  color="primary"
                  disabled={!organizationChosenHtmlVerificationChangedLocally}
                  onClick={this.onCancelHtmlVerificationButton}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={!organizationChosenHtmlVerificationChangedLocally}
                  onClick={this.onSaveHtmlVerificationButton}
                  variant="contained"
                >
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
  font-size: 14px;
  font-weight: bold;
`;

const InputLabelHelperText = styled.p`
  font-size: 14px;
  font-weight: normal;
`;

const Introduction = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
`;

const LinkToDomainRow = styled.div`
  padding: 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;
  width: 100%;
  margin-top: 12px;
`;

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background: #eee;
  margin: 16px 0;
`;

export default withStyles(styles)(SettingsAnalytics);
