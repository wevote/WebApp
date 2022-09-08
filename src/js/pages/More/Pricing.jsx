import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { doNotDisplayIfSmallerThanDesktopThreshold } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import PricingCard from '../../components/More/PricingCard';
import { Section } from '../../components/Welcome/sectionStyles';
import PricingSwitch from '../../components/Widgets/PricingSwitch';
import AppObservableStore from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import cordovaScrollablePaneTopPadding from '../../utils/cordovaScrollablePaneTopPadding';

const WelcomeAppbar = React.lazy(() => import(/* webpackChunkName: 'WelcomeAppbar' */ '../../components/Navigation/WelcomeAppbar'));
const WelcomeFooter = React.lazy(() => import(/* webpackChunkName: 'WelcomeFooter' */ '../../components/Welcome/WelcomeFooter'));


class Pricing extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);

    this.state = {
      pricingCardLabels: ['Free', 'Pro', 'Enterprise'],
      forCampaignsPricingCards: {
        pageTitle: 'Pricing for Campaigns',
        alternateLinkPath: '/more/pricing/organizations',
        alternateLinkText: 'For Organizations?',
        Free: {
          planName: 'Free',
          pricingPlanStringIdentifier: 'free',
          price: 0,
          priceDescribe: 'For life',
          premium: false,
          description: 'Just start creating: get a free site and be on your way to empowering your supporters in less than five minutes.',
          bullets: ['Create your own endorsements', 'Add to your own website', 'See visitor metrics'],
          buttonText: 'Start with Free',
          buttonOnClickId: 'pricingStartWithFree',
          buttonOnClickFunction: this.getStartedForOrganizations,
          index: 0,
          pricingCardFeatures: [
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Enter Your Own Endorsements',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Voter Guide Creation Tools',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Add Ballot to Your Website',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Visitor Metrics',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'WeVote.US Subdomain',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Custom Full Domain Name',
            },
            // {
            //   iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
            //   featureDescription: 'Create Multi-Organization Voter Guides',
            // },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            // {
            //   iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
            //   featureDescription: 'Additional Administrators',
            // },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Analytics Integration',
            },
          ],
        },
        Professional: {
          planName: 'Professional',
          pricingPlanStringIdentifier: 'professional',
          price: 125,
          priceDescribe: 'Per month, billed annually',
          premium: true,
          description: 'Best for regional campaigns.',
          bullets: ['Custom domain name', 'Prioritize unlimited endorsements', 'Fine tune for social media sharing'],
          buttonText: 'Choose Pro',
          buttonOnClickId: 'pricingStartWithPro',
          buttonOnClickFunction: this.getStartedForOrganizations,
          index: 1,
          pricingCardFeatures: [
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Enter Your Own Endorsements',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Voter Guide Creation Tools',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Add Ballot to Your Website',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Engagement Metrics',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'WeVote.US Subdomain',
            },
            {
              iconType: 'paidCheckMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Custom Full Domain Name',
            },
            // {
            //   iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
            //   featureDescription: 'Create Multi-Organization Voter Guides',
            // },
            {
              iconType: 'notAvailable',  // 'notAvailable', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            // {
            //   iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
            //   featureDescription: 'Additional Administrators',
            // },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Analytics Integration',
            },
          ],
        },
        Enterprise: {
          planName: 'Enterprise',
          pricingPlanStringIdentifier: 'enterprise',
          price: null,
          priceDescribe: null,
          premium: true,
          description: 'Best for statewide or national campaigns.',
          bullets: ['Deeper branding control', 'Analytics integration', 'Add additional administrators'],
          buttonText: 'Choose Enterprise',
          buttonOnClickId: 'pricingStartWithEnterprise',
          buttonOnClickFunction: this.getStartedForOrganizations,
          index: 2,
          pricingCardFeatures: [
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Enter Your Own Endorsements',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Voter Guide Creation Tools',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Add Ballot to Your Website',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Engagement Metrics',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'WeVote.US Subdomain',
            },
            {
              iconType: 'paidCheckMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Custom Full Domain Name',
            },
            // {
            //   iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
            //   featureDescription: 'Create Multi-Organization Voter Guides',
            // },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            // {
            //   iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
            //   featureDescription: 'Additional Administrators',
            // },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Analytics Integration',
            },
          ],
        },
      },
      /* Need to change the data for organizations */
      forOrganizationsPricingCards: {
        pageTitle: 'Pricing for Organizations',
        alternateLinkPath: '/more/pricing/campaigns',
        alternateLinkText: 'For Campaigns?',
        Free: {
          planName: 'Free',
          pricingPlanStringIdentifier: 'free',
          price: 0,
          priceDescribe: 'For life',
          premium: false,
          description: 'Just start creating: get a free site and be on your way to empowering your members, constituents, or staff in less than five minutes.',
          bullets: ['Add your own logo', 'Add to your own website', 'See visitor metrics'],
          buttonText: 'Start with Free',
          buttonOnClickId: 'pricingStartWithFree',
          buttonOnClickFunction: this.getStartedForOrganizations,
          index: 0,
          pricingCardFeatures: [
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Add Ballot to Your Website',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Visitor Metrics',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'WeVote.US Subdomain',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Custom Full Domain Name',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            // {
            //   iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
            //   featureDescription: 'Additional Administrators',
            // },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Analytics Integration',
            },
          ],
        },
        Professional: {
          planName: 'Professional',
          pricingPlanStringIdentifier: 'professional',
          price: 125,
          priceDescribe: 'Per month, billed annually',
          premium: true,
          description: 'Best for regional or statewide organizations or companies.',
          bullets: ['Custom domain name', 'Fine tune for social media sharing', 'See engagement metrics'],
          buttonText: 'Choose Pro',
          buttonOnClickId: 'pricingStartWithPro',
          buttonOnClickFunction: this.getStartedForOrganizations,
          index: 1,
          pricingCardFeatures: [
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Add Ballot to Your Website',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Engagement Metrics',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'WeVote.US Subdomain',
            },
            {
              iconType: 'paidCheckMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Custom Full Domain Name',
            },
            {
              iconType: 'notAvailable',  // 'notAvailable', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            // {
            //   iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
            //   featureDescription: 'Additional Administrators',
            // },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Analytics Integration',
            },
          ],
        },
        Enterprise: {
          planName: 'Enterprise',
          pricingPlanStringIdentifier: 'enterprise',
          price: null,
          priceDescribe: null,
          premium: true,
          description: 'Best for statewide or national organizations or companies.',
          bullets: ['Deeper branding control', 'Analytics integration', 'Add additional administrators'],
          buttonText: 'Choose Enterprise',
          buttonOnClickId: 'pricingStartWithEnterprise',
          buttonOnClickFunction: this.getStartedForOrganizations,
          index: 2,
          pricingCardFeatures: [
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Add Ballot to Your Website',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Engagement Metrics',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'WeVote.US Subdomain',
            },
            {
              iconType: 'paidCheckMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Custom Full Domain Name',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            // {
            //   iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
            //   featureDescription: 'Additional Administrators',
            // },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Analytics Integration',
            },
          ],
        },
      },
      selectedPricingPlanIndex: 0,
    };
    this.getStartedForOrganizations = this.getStartedForOrganizations.bind(this);
  }

  componentDidMount () {
    const { match: { params } } = this.props;
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    let pricingChoice = '';
    if (this.props.initialPricingChoice === 'campaigns' || this.props.initialPricingChoice === 'organizations') {
      pricingChoice = this.props.initialPricingChoice;
    } else if (params && params.pricing_choice) {
      pricingChoice = params.pricing_choice;
    }
    const currentPricingChoice = (pricingChoice === 'campaigns') ? 'forCampaigns' : 'forOrganizations';
    // console.log('componentDidMount, pricingChoice: ', pricingChoice, 'currentPricingChoice: ', currentPricingChoice);
    let selectedPricingPlanIndex = 0;
    if (this.props.initialPricingPlan) {
      selectedPricingPlanIndex = this.convertPricingPlanToIndex(this.props.initialPricingPlan);
    }
    this.setState({
      currentPricingChoice,
      selectedPricingPlanIndex,
    });
    window.scrollTo(0, 0);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.onVoterStoreChange();
    let pricingChoice = '';
    const { match: { params: nextParams } } = nextProps;
    if (nextParams && nextParams.pricing_choice) {
      pricingChoice = nextParams.pricing_choice;
    }
    const currentPricingChoice = (pricingChoice === 'campaigns') ? 'forCampaigns' : 'forOrganizations';
    // console.log('componentWillReceiveProps, pricingChoice: ', pricingChoice, 'currentPricingChoice: ', currentPricingChoice);
    this.setState({
      currentPricingChoice,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.currentPricingChoice !== nextState.currentPricingChoice) {
      // console.log('this.state.currentPricingChoice', this.state.currentPricingChoice, ', nextState.currentPricingChoice', nextState.currentPricingChoice);
      return true;
    }
    if (this.state.selectedPricingPlanIndex !== nextState.selectedPricingPlanIndex) {
      // console.log('this.state.selectedPricingPlanIndex', this.state.selectedPricingPlanIndex, ', nextState.selectedPricingPlanIndex', nextState.selectedPricingPlanIndex);
      return true;
    }
    if (this.props.modalDisplayMode !== nextProps.modalDisplayMode) {
      // console.log('this.props.modalDisplayMode', this.props.modalDisplayMode, ', nextProps.modalDisplayMode', nextProps.modalDisplayMode);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
    });
  }

  switchToDifferentCategoryFunction = (selectedPricingPlanIndex) => {
    this.setState({ selectedPricingPlanIndex });
  };

  pricingPlanChosenFunctionLocal = (pricingPlanChosen) => {
    if (this.props.pricingPlanChosenFunction) {
      this.props.pricingPlanChosenFunction(pricingPlanChosen);
    }
  }

  getStartedForOrganizations = (pricingPlanChosen) => {
    const { modalDisplayMode } = this.props;
    const voter = VoterStore.getVoter();
    let isSignedIn = false;
    if (voter) {
      ({ is_signed_in: isSignedIn } = voter);
    }
    // console.log('Pricing getStartedForOrganizations, isSignedIn: ', isSignedIn, ', pricingPlanChosen:', pricingPlanChosen, ', this.props.modalDisplayMode:', modalDisplayMode);
    if (isSignedIn) {
      if (modalDisplayMode) {
        this.pricingPlanChosenFunctionLocal(pricingPlanChosen);
      } else {
        AppObservableStore.setShowPaidAccountUpgradeModal(pricingPlanChosen);
      }
    } else {
      AppObservableStore.setGetStartedMode('getStartedForOrganizations');
      AppObservableStore.setShowSignInModal(true);
    }
  }

  convertPricingPlanToIndex (pricingPlanStringIdentifier) {
    if (pricingPlanStringIdentifier === 'free') {
      return 0;
    } else if (pricingPlanStringIdentifier === 'professional') {
      return 1;
    } else if (pricingPlanStringIdentifier === 'enterprise') {
      return 2;
    }
    return 0;
  }

  render () {
    renderLog('Pricing');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { currentPricingChoice, forCampaignsPricingCards, forOrganizationsPricingCards, selectedPricingPlanIndex } = this.state;
    // console.log('render currentPricingChoice:', currentPricingChoice);
    const currentPricingDict = (currentPricingChoice === 'forCampaigns') ? forCampaignsPricingCards : forOrganizationsPricingCards;

    const htmlForStandaloneHeader = (
      <HeaderForPricing>
        <PricingTitle>{currentPricingDict.pageTitle}</PricingTitle>
        <PricingSubTitleDesktop>
          <Link to={currentPricingDict.alternateLinkPath} className={classes.pricingChoiceLink}>
            {currentPricingDict.alternateLinkText}
          </Link>
        </PricingSubTitleDesktop>
        <PricingSubTitleMobile className="u-show-mobile-tablet">
          <Link to={currentPricingDict.alternateLinkPath} className={classes.pricingChoiceLink}>
            {currentPricingDict.alternateLinkText}
          </Link>
          <div className={classes.pricingSwitch}>
            <PricingSwitch
              choices={this.state.pricingCardLabels}
              selectedPricingPlanIndex={selectedPricingPlanIndex}
              switchToDifferentCategoryFunction={this.switchToDifferentCategoryFunction}
            />
          </div>
        </PricingSubTitleMobile>
      </HeaderForPricing>
    );

    const chosenBackgroundColor = '#2e3c5d'; // brandBlue;
    const chosenTextColor = 'white';
    const htmlForModalHeader = (
      <HeaderForPricingModal>
        <div className="u-show-mobile-tablet">
          <PricingSwitch
            choices={this.state.pricingCardLabels}
            chosenTextColor={chosenTextColor}
            chosenBackgroundColor={chosenBackgroundColor}
            selectedPricingPlanIndex={selectedPricingPlanIndex}
            switchToDifferentCategoryFunction={this.switchToDifferentCategoryFunction}
          />
        </div>
      </HeaderForPricingModal>
    );

    return (
      <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
        <Helmet title="Pricing - We Vote" />
        {this.props.modalDisplayMode ? null : <Suspense fallback={<></>}><WelcomeAppbar pathname="/more/pricing" /></Suspense>}
        {this.props.modalDisplayMode ? htmlForModalHeader : htmlForStandaloneHeader}
        <Section
          noSideMargins={this.props.modalDisplayMode}
          noTopMargin={this.props.modalDisplayMode}
          variant="white"
        >
          <PricingDescriptionContainer>
            <div className="u-show-mobile-tablet">
              <Row className="row">
                {selectedPricingPlanIndex === 0 ? (
                  <PricingCard
                    featurePackage="FREE"
                    fullWidth
                    planName={currentPricingDict.Free.planName}
                    pricingPlanStringIdentifier={currentPricingDict.Free.pricingPlanStringIdentifier}
                    price={currentPricingDict.Free.price}
                    priceDescribe={currentPricingDict.Free.priceDescribe}
                    description={currentPricingDict.Free.description}
                    bullets={currentPricingDict.Free.bullets}
                    buttonText={currentPricingDict.Free.buttonText}
                    buttonOnClickId={currentPricingDict.Free.buttonOnClickId}
                    buttonOnClickFunction={currentPricingDict.Free.buttonOnClickFunction}
                    pricingCardFeatures={currentPricingDict.Free.pricingCardFeatures}
                  />
                ) : (
                  <>
                    {selectedPricingPlanIndex === 1 ? (
                      <PricingCard
                        featurePackage="PROFESSIONAL"
                        fullWidth
                        planName={currentPricingDict.Professional.planName}
                        pricingPlanStringIdentifier={currentPricingDict.Professional.pricingPlanStringIdentifier}
                        price={currentPricingDict.Professional.price}
                        priceDescribe={currentPricingDict.Professional.priceDescribe}
                        description={currentPricingDict.Professional.description}
                        bullets={currentPricingDict.Professional.bullets}
                        buttonText={currentPricingDict.Professional.buttonText}
                        buttonOnClickId={currentPricingDict.Professional.buttonOnClickId}
                        buttonOnClickFunction={currentPricingDict.Professional.buttonOnClickFunction}
                        pricingCardFeatures={currentPricingDict.Professional.pricingCardFeatures}
                      />
                    ) : (
                      <PricingCard
                        featurePackage="ENTERPRISE"
                        fullWidth
                        planName={currentPricingDict.Enterprise.planName}
                        pricingPlanStringIdentifier={currentPricingDict.Enterprise.pricingPlanStringIdentifier}
                        price={currentPricingDict.Enterprise.price}
                        priceDescribe={currentPricingDict.Enterprise.priceDescribe}
                        description={currentPricingDict.Enterprise.description}
                        bullets={currentPricingDict.Enterprise.bullets}
                        buttonText={currentPricingDict.Enterprise.buttonText}
                        buttonOnClickId={currentPricingDict.Enterprise.buttonOnClickId}
                        buttonOnClickFunction={currentPricingDict.Enterprise.buttonOnClickFunction}
                        pricingCardFeatures={currentPricingDict.Enterprise.pricingCardFeatures}
                      />
                    )}
                  </>
                )}
              </Row>
            </div>
            <PricingRow>
              <PricingCard
                featurePackage="FREE"
                planName={currentPricingDict.Free.planName}
                pricingPlanStringIdentifier={currentPricingDict.Free.pricingPlanStringIdentifier}
                price={currentPricingDict.Free.price}
                priceDescribe={currentPricingDict.Free.priceDescribe}
                description={currentPricingDict.Free.description}
                bullets={currentPricingDict.Free.bullets}
                buttonText={currentPricingDict.Free.buttonText}
                buttonOnClickId={currentPricingDict.Free.buttonOnClickId}
                buttonOnClickFunction={currentPricingDict.Free.buttonOnClickFunction}
                pricingCardFeatures={currentPricingDict.Free.pricingCardFeatures}
              />
              <PricingCard
                featurePackage="PROFESSIONAL"
                planName={currentPricingDict.Professional.planName}
                pricingPlanStringIdentifier={currentPricingDict.Professional.pricingPlanStringIdentifier}
                price={currentPricingDict.Professional.price}
                priceDescribe={currentPricingDict.Professional.priceDescribe}
                description={currentPricingDict.Professional.description}
                bullets={currentPricingDict.Professional.bullets}
                buttonText={currentPricingDict.Professional.buttonText}
                buttonOnClickId={currentPricingDict.Professional.buttonOnClickId}
                buttonOnClickFunction={currentPricingDict.Professional.buttonOnClickFunction}
                pricingCardFeatures={currentPricingDict.Professional.pricingCardFeatures}
              />
              <PricingCard
                featurePackage="ENTERPRISE"
                planName={currentPricingDict.Enterprise.planName}
                pricingPlanStringIdentifier={currentPricingDict.Enterprise.pricingPlanStringIdentifier}
                price={currentPricingDict.Enterprise.price}
                priceDescribe={currentPricingDict.Enterprise.priceDescribe}
                description={currentPricingDict.Enterprise.description}
                bullets={currentPricingDict.Enterprise.bullets}
                buttonText={currentPricingDict.Enterprise.buttonText}
                buttonOnClickId={currentPricingDict.Enterprise.buttonOnClickId}
                buttonOnClickFunction={currentPricingDict.Enterprise.buttonOnClickFunction}
                pricingCardFeatures={currentPricingDict.Enterprise.pricingCardFeatures}
              />
            </PricingRow>
          </PricingDescriptionContainer>
        </Section>
        {this.props.modalDisplayMode ? null : (
          <Section>
            &nbsp;
          </Section>
        )}
        {this.props.modalDisplayMode ? null : (
          <Suspense fallback={<></>}>
            <WelcomeFooter />
          </Suspense>
        )}
      </Wrapper>
    );
  }
}
Pricing.propTypes = {
  classes: PropTypes.object,
  initialPricingChoice: PropTypes.string,
  initialPricingPlan: PropTypes.string,
  modalDisplayMode: PropTypes.bool,
  match: PropTypes.object,
  pricingPlanChosenFunction: PropTypes.func,
};

const styles = (theme) => ({
  buttonContained: {
    borderRadius: 32,
    height: 50,
    [theme.breakpoints.down('md')]: {
      height: 36,
    },
  },
  buttonMaxWidth: {
    width: '100%',
  },
  iconButton: {
    color: 'white',
  },
  pricingChoiceLink: {
    color: 'white',
    fontSize: 12,
    '&:hover': {
      color: 'white',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
    },
  },
  pricingSwitch: {
    marginTop: 18,
  },
});

const Wrapper = styled('div', {
  shouldForwardProp: (prop) => !['padTop'].includes(prop),
})(({ padTop }) => (`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
  padding-top: ${padTop};
`));

const HeaderForPricing = styled('div')(({ theme }) => (`
  position: relative;
  height: 210px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  text-align: center;
  ${theme.breakpoints.down('lg')} {
    height: 280px;
  }
  ${theme.breakpoints.down('xs')} {
    height: 240px;
  }
`));

const HeaderForPricingModal = styled('div')`
  position: relative;
  width: 110%;
  padding: 0 0 10px 0;
  text-align: center;
`;

const PricingRow = styled('div')`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  ${() => doNotDisplayIfSmallerThanDesktopThreshold()};
`;

const PricingTitle = styled('h1')(({ theme }) => (`
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-top: 3em;
  margin-bottom: 0;
  padding-bottom: 0;
  ${theme.breakpoints.down('md')} {
    font-size: 28px;
    margin-top: 3em;
  }
  ${theme.breakpoints.down('xs')} {
    font-size: 18px;
    margin-top: 5em;
  }
`));

const PricingSubTitleDesktop = styled('div')`
  ${() => doNotDisplayIfSmallerThanDesktopThreshold()};
`;

const PricingSubTitleMobile = styled('div')`
`;

const PricingDescriptionContainer = styled('div')`
  margin: 1em auto;
  width: 100%;
  min-width: 100%;
  text-align: left;
  @media (max-width: 569px) {
    margin-top: -1em;
  }
  @media (min-width: 960px) and (max-width: 991px) {
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    margin: 0 auto;
  }
`;

const Row = styled('div')`
  margin: 0 auto !important;
`;

export default withStyles(styles)(Pricing);
