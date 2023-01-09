import { Button, FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { voterFeaturePackageExceedsOrEqualsRequired } from '../../utils/pricingFunctions';
import CreateConfiguredVersion from './CreateConfiguredVersion';
import SeeTheseSettingsInAction from './SeeTheseSettingsInAction';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../common/components/SignIn/SignInOptionsPanel'));
const SettingsAccountLevelChip = React.lazy(() => import(/* webpackChunkName: 'SettingsAccountLeveLChip' */ './SettingsAccountLevelChip'));


class SettingsAnalytics extends Component {
  constructor (props) {
    super(props);
    this.state = {
      analyticsButtonsActive: '',
      chosenFeaturePackage: 'FREE',
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
    // console.log('SettingsAnalytics componentDidMount');
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
      const organizationChosenGoogleAnalyticsTrackerSavedValue = organization.chosen_google_analytics_account_number || '';
      const organizationChosenHtmlVerificationSavedValue = organization.chosen_html_verification_string || '';
      const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
      const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
      this.setState({
        chosenFeaturePackage,
        organization,
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
      const organizationChosenGoogleAnalyticsTrackerSavedValue = organization.chosen_google_analytics_account_number || '';
      const organizationChosenHtmlVerificationSavedValue = organization.chosen_html_verification_string || '';
      const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
      const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
      this.setState({
        chosenFeaturePackage,
        organization,
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
    AppObservableStore.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  }

  render () {
    renderLog('SettingsAnalytics');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      chosenFeaturePackage,
      organizationWeVoteId, voter, voterIsSignedIn, analyticsButtonsActive,
      organizationChosenGoogleAnalyticsTracker, organizationChosenGoogleAnalyticsTrackerChangedLocally,
      organizationChosenHtmlVerification, organizationChosenHtmlVerificationChangedLocally,
      voterFeaturePackageExceedsOrEqualsEnterprise,
    } = this.state;
    const { classes, externalUniqueId } = this.props;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    } else if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return (
        <Suspense fallback={<></>}>
          <DelayedLoad waitBeforeShow={1000}>
            <SignInOptionsPanel />
          </DelayedLoad>
        </Suspense>
      );
    }

    return (
      <div>
        <Helmet title="Domain Settings" />
        <div className="card">
          <div className="card-main">
            <h1 className="h2">Analytics</h1>
            {chosenFeaturePackage === 'FREE' && (
              <>
                <CreateConfiguredVersion />
                <Separator />
              </>
            )}
            <SeeTheseSettingsInAction />
            <Separator />
            <FormControl classes={{ root: classes.formControl }}>
              <InputLabel>
                Google Analytics Tracker
                <Suspense fallback={<></>}>
                  <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="ENTERPRISE" />
                </Suspense>
              </InputLabel>
              <InputLabelHelperText>Add your tracking code (e.g., UA-XXXXXXX-X) so you can see which parts of your site voters like the best.</InputLabelHelperText>
              <TextField
                id={`googleAnalyticsTrackerInput-${externalUniqueId}`}
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
                  id={`googleAnalyticsTrackerInputCancel-${externalUniqueId}`}
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
                    id={`googleAnalyticsTrackerInputSave-${externalUniqueId}`}
                    color="primary"
                    disabled={!organizationChosenGoogleAnalyticsTrackerChangedLocally}
                    onClick={this.onSaveGoogleAnalyticsTrackerButton}
                    variant="contained"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    id={`googleAnalyticsTrackerInputSave-${externalUniqueId}`}
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
                )}
              </ButtonsContainer>
            )}
            <Separator />
            <FormControl classes={{ root: classes.formControl }}>
              <InputLabel>Verify Webmaster Tool</InputLabel>
              <InputLabelHelperText>
                Add your entire HTML verification meta tag (e.g., &lt;meta name=&quot;google-site-verification&quot; content=&quot;your verification string&quot;&gt;) to prove that you control this website.
              </InputLabelHelperText>
              <TextField
                id={`verifyWebmasterToolInput-${externalUniqueId}`}
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
                  id={`verifyWebmasterToolCancelButton-${externalUniqueId}`}
                  classes={{ root: classes.button }}
                  color="primary"
                  disabled={!organizationChosenHtmlVerificationChangedLocally}
                  onClick={this.onCancelHtmlVerificationButton}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  id={`verifyWebmasterToolSaveButton-${externalUniqueId}`}
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
SettingsAnalytics.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

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

const InputLabel = styled('h4')`
  font-size: 14px;
  font-weight: bold;
`;

const InputLabelHelperText = styled('p')`
  font-size: 14px;
  font-weight: normal;
`;

const ButtonsContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: 12px;
`;

const Separator = styled('div')`
  width: 100%;
  height: 2px;
  background: #eee;
  margin: 16px 0;
`;

export default withStyles(styles)(SettingsAnalytics);
