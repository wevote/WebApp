import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppActions from '../../actions/AppActions';
import { cordovaScrollablePaneTopPadding } from '../../utils/cordovaOffsets';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import Footer from '../../components/Welcome/Footer';
import Section from '../../components/Welcome/Section';
import PricingCard from '../../components/More/PricingCard';
import PricingSwitch from '../../components/Widgets/PricingSwitch';
import VoterStore from '../../stores/VoterStore';
import WelcomeAppbar from '../../components/Navigation/WelcomeAppbar';


class Pricing extends Component {
  static getProps () {
    return {};
  }

  static propTypes = {
    classes: PropTypes.object,
    initialPricingPlan: PropTypes.string,
    modalDisplayMode: PropTypes.bool,
    params: PropTypes.object,
    pricingPlanChosenFunction: PropTypes.func,
  };

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
              featureDescription: 'Enter Your Own Positions',
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
              featureDescription: 'WeVote.US Subdomain',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Create Multi-Organization Voter Guides',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Additional Administrators',
            },
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
          buttonText: 'Start with Pro',
          buttonOnClickId: 'pricingStartWithPro',
          buttonOnClickFunction: this.getStartedForOrganizations,
          index: 1,
          pricingCardFeatures: [
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Enter Your Own Positions',
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
              featureDescription: 'Custom Domain Name',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Create Multi-Organization Voter Guides',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Additional Administrators',
            },
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
          buttonText: 'Start with Enterprise',
          buttonOnClickId: 'pricingStartWithEnterprise',
          buttonOnClickFunction: this.getStartedForOrganizations,
          index: 2,
          pricingCardFeatures: [
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Enter Your Own Positions',
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
              featureDescription: 'Custom Domain Name',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Create Multi-Organization Voter Guides',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Additional Administrators',
            },
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
              featureDescription: 'WeVote.US Subdomain',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Additional Administrators',
            },
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
          buttonText: 'Start with Pro',
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
              featureDescription: 'Custom Domain Name',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            {
              iconType: 'notAvailable',  // 'paidCheckMark', 'checkMark'
              featureDescription: 'Additional Administrators',
            },
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
          buttonText: 'Start with Enterprise',
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
              featureDescription: 'Custom Domain Name',
            },
            {
              iconType: 'checkMark',  // 'paidCheckMark', 'notAvailable'
              featureDescription: 'Upload Your Logo',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Edit Social Media Sharing Links',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Additional Administrators',
            },
            {
              iconType: 'paidCheckMark',  // 'notAvailable', 'checkMark'
              featureDescription: 'Analytics Integration',
            },
          ],
        },
      },
      selectedPricingPlanIndex: 0,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    let pricingChoice = '';
    if (this.props.params && this.props.params.pricing_choice) {
      pricingChoice = this.props.params.pricing_choice;
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
  }

  componentWillReceiveProps (nextProps) {
    this.onVoterStoreChange();
    let pricingChoice = '';
    if (nextProps.params && nextProps.params.pricing_choice) {
      pricingChoice = nextProps.params.pricing_choice;
    }
    const currentPricingChoice = (pricingChoice === 'campaigns') ? 'forCampaigns' : 'forOrganizations';
    // console.log('componentWillReceiveProps, pricingChoice: ', pricingChoice, 'currentPricingChoice: ', currentPricingChoice);
    this.setState({
      currentPricingChoice,
    });
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
    const voter = VoterStore.getVoter();
    let isSignedIn = false;
    if (voter) {
      ({ is_signed_in: isSignedIn } = voter);
    }
    // console.log('Pricing getStartedForOrganizations, isSignedIn: ', isSignedIn);
    if (isSignedIn) {
      if (this.props.modalDisplayMode) {
        this.pricingPlanChosenFunctionLocal(pricingPlanChosen);
      } else {
        historyPush('/settings/profile');
      }
    } else {
      AppActions.setGetStartedMode('getStartedForOrganizations');
      AppActions.setShowSignInModal(true);
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
    const { classes } = this.props;
    const { currentPricingChoice, forCampaignsPricingCards, forOrganizationsPricingCards, selectedPricingPlanIndex } = this.state;
    // console.log('render currentPricingChoice:', currentPricingChoice);
    const currentPricingDict = (currentPricingChoice === 'forCampaigns') ? forCampaignsPricingCards : forOrganizationsPricingCards;

    const htmlForStandaloneHeader = (
      <HeaderForPricing>
        <PricingTitle>{currentPricingDict.pageTitle}</PricingTitle>
        <PricingSubTitleDesktop className="u-show-desktop">
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

    renderLog(__filename);
    return (
      <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
        <Helmet title="Pricing - We Vote" />
        {this.props.modalDisplayMode ? null : <WelcomeAppbar pathname="/more/pricing" />}
        {this.props.modalDisplayMode ? htmlForModalHeader : htmlForStandaloneHeader}
        <Section
          noSideMargins={this.props.modalDisplayMode}
          noTopMargin={this.props.modalDisplayMode}
          variant="white"
        >
          <PricingDescriptionContainer className="container">
            <div className="u-show-mobile-tablet">
              <Row className="row">
                {selectedPricingPlanIndex === 0 ? (
                  <PricingCard
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
                  <React.Fragment>
                    {selectedPricingPlanIndex === 1 ? (
                      <PricingCard
                        fullWidth
                        planName={currentPricingDict.Professional.planName}
                        pricingPlanStringIdentifier={currentPricingDict.Professional.pricingPlanStringIdentifier}
                        price={currentPricingDict.Professional.price}
                        priceDescribe={currentPricingDict.Professional.priceDescribe}
                        premium
                        description={currentPricingDict.Professional.description}
                        bullets={currentPricingDict.Professional.bullets}
                        buttonText={currentPricingDict.Professional.buttonText}
                        buttonOnClickId={currentPricingDict.Professional.buttonOnClickId}
                        buttonOnClickFunction={currentPricingDict.Professional.buttonOnClickFunction}
                        pricingCardFeatures={currentPricingDict.Professional.pricingCardFeatures}
                      />
                    ) : (
                      <PricingCard
                        fullWidth
                        planName={currentPricingDict.Enterprise.planName}
                        pricingPlanStringIdentifier={currentPricingDict.Enterprise.pricingPlanStringIdentifier}
                        price={currentPricingDict.Enterprise.price}
                        priceDescribe={currentPricingDict.Enterprise.priceDescribe}
                        premium
                        description={currentPricingDict.Enterprise.description}
                        bullets={currentPricingDict.Enterprise.bullets}
                        buttonText={currentPricingDict.Enterprise.buttonText}
                        buttonOnClickId={currentPricingDict.Enterprise.buttonOnClickId}
                        buttonOnClickFunction={currentPricingDict.Enterprise.buttonOnClickFunction}
                        pricingCardFeatures={currentPricingDict.Enterprise.pricingCardFeatures}
                      />
                    )}
                  </React.Fragment>
                )}
              </Row>
            </div>
            <div className="row u-show-desktop">
              <PricingCard
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
                planName={currentPricingDict.Professional.planName}
                pricingPlanStringIdentifier={currentPricingDict.Professional.pricingPlanStringIdentifier}
                price={currentPricingDict.Professional.price}
                priceDescribe={currentPricingDict.Professional.priceDescribe}
                premium
                description={currentPricingDict.Professional.description}
                bullets={currentPricingDict.Professional.bullets}
                buttonText={currentPricingDict.Professional.buttonText}
                buttonOnClickId={currentPricingDict.Professional.buttonOnClickId}
                buttonOnClickFunction={currentPricingDict.Professional.buttonOnClickFunction}
                pricingCardFeatures={currentPricingDict.Professional.pricingCardFeatures}
              />
              <PricingCard
                planName={currentPricingDict.Enterprise.planName}
                pricingPlanStringIdentifier={currentPricingDict.Enterprise.pricingPlanStringIdentifier}
                price={currentPricingDict.Enterprise.price}
                priceDescribe={currentPricingDict.Enterprise.priceDescribe}
                premium
                description={currentPricingDict.Enterprise.description}
                bullets={currentPricingDict.Enterprise.bullets}
                buttonText={currentPricingDict.Enterprise.buttonText}
                buttonOnClickId={currentPricingDict.Enterprise.buttonOnClickId}
                buttonOnClickFunction={currentPricingDict.Enterprise.buttonOnClickFunction}
                pricingCardFeatures={currentPricingDict.Enterprise.pricingCardFeatures}
              />
            </div>
          </PricingDescriptionContainer>
        </Section>
        {this.props.modalDisplayMode ? null : (
          <Section>
            &nbsp;
          </Section>
        )}
        {this.props.modalDisplayMode ? null : (
          <Footer />
        )}
      </Wrapper>
    );
  }
}

const styles = theme => ({
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

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
  padding-top: ${({ padTop }) => padTop};
`;

const HeaderForPricing = styled.div`
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
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 280px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 240px;
  }
`;

const HeaderForPricingModal = styled.div`
  position: relative;
  width: 110%;
  padding: 0 0 10px 0;
  text-align: center;
`;

const PricingTitle = styled.h1`
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-top: 3em;
  margin-bottom: 0;
  padding-bottom: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
    margin-top: 3em;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 18px;
    margin-top: 5em;
  }
`;

const PricingSubTitleDesktop = styled.div`
`;

const PricingSubTitleMobile = styled.div`
`;

const PricingDescriptionContainer = styled.div`
  margin: 1em auto;
  width: 960px;
  max-width: 90vw;
  text-align: left;
  @media (max-width: 569px) {
    margin-top: -2em;
  }
  @media (min-width: 960px) and (max-width: 991px) {
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    margin: 0 auto;
  }
`;

const Row = styled.div`
  margin: 0 auto !important;
`;

export default withStyles(styles)(Pricing);
