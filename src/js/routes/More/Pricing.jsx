import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppActions from '../../actions/AppActions';
import { renderLog } from '../../utils/logging';
import Footer from '../../components/Welcome/Footer';
import Section from '../../components/Welcome/Section';
import PricingCard from '../../components/More/PricingCard';
import PricingSwitch from '../../components/Widgets/PricingSwitch';
import VoterStore from '../../stores/VoterStore';
import WelcomeAppbar from '../../components/Navigation/WelcomeAppbar';
import { Title } from '../../components/Welcome/Header';
import { historyPush } from '../../utils/cordovaUtils';

class Pricing extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);

    this.state = {
      pricingCardLabels: ['Free', 'Professional', 'Enterprise'],
      forCampaignsPricingCards: {
        Free: {
          planName: 'Free',
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
          price: 125,
          priceDescribe: 'Per month, billed annually',
          premium: true,
          description: 'Best for regional campaigns',
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
          price: null,
          priceDescribe: null,
          premium: true,
          description: 'Best for statewide or national organizations or companies',
          bullets: ['Branding Control', 'Analytics Integration', 'Additional Administrators'],
          buttonText: 'Contact Sales',
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
        Free: {
          planName: 'Free',
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
          price: 125,
          priceDescribe: 'Per month, billed annually',
          premium: true,
          description: 'Best for regional campaigns',
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
          price: null,
          priceDescribe: null,
          premium: true,
          description: 'Best for statewide or national organizations or companies',
          bullets: ['Branding Control', 'Analytics Integration', 'Additional Administrators'],
          buttonText: 'Contact Sales',
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
      selectedCategoryIndex: 0,
      voter: {},
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  switchToDifferentCategoryFunction = (selectedCategoryIndex) => {
    this.setState({ selectedCategoryIndex });
  }

  getStartedForOrganizations = () => {
    const { voter } = this.state;
    let isSignedIn = false;
    if (voter) {
      ({ is_signed_in: isSignedIn } = voter);
      isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;
    }
    // console.log('Pricing getStartedForOrganizations, isSignedIn: ', isSignedIn);
    if (isSignedIn) {
      historyPush('/settings/profile');
    } else {
      AppActions.setGetStartedMode('getStartedForOrganizations');
      AppActions.setShowSignInModal(true);
    }
  }

  render () {
    const { selectedCategoryIndex } = this.state;

    renderLog(__filename);
    return (
      <Wrapper>
        <Helmet title="Pricing - We Vote" />
        <WelcomeAppbar pathname="/more/pricing" />
        <HeaderForAbout>
          <Title>Pricing</Title>
          <div className="u-show-mobile-tablet">
            <PricingSwitch
              color="white"
              choices={this.state.pricingCardLabels}
              selectedCategoryIndex={selectedCategoryIndex}
              switchToDifferentCategoryFunction={this.switchToDifferentCategoryFunction}
            />
          </div>
        </HeaderForAbout>
        <Section>
          <AboutDescriptionContainer>
            <div className="container">
              <div className="u-show-mobile-tablet">
                <div className="row">
                  {selectedCategoryIndex === 0 ? (
                    <PricingCard
                      fullWidth
                      planName={this.state.forCampaignsPricingCards.Free.planName}
                      price={this.state.forCampaignsPricingCards.Free.price}
                      priceDescribe={this.state.forCampaignsPricingCards.Free.priceDescribe}
                      description={this.state.forCampaignsPricingCards.Free.description}
                      bullets={this.state.forCampaignsPricingCards.Free.bullets}
                      buttonText={this.state.forCampaignsPricingCards.Free.buttonText}
                      buttonOnClickId={this.state.forCampaignsPricingCards.Free.buttonOnClickId}
                      buttonOnClickFunction={this.state.forCampaignsPricingCards.Free.buttonOnClickFunction}
                      pricingCardFeatures={this.state.forCampaignsPricingCards.Free.pricingCardFeatures}
                    />
                  ) : (
                    <React.Fragment>
                      {selectedCategoryIndex === 1 ? (
                        <PricingCard
                          fullWidth
                          planName={this.state.forCampaignsPricingCards.Professional.planName}
                          price={this.state.forCampaignsPricingCards.Professional.price}
                          priceDescribe={this.state.forCampaignsPricingCards.Professional.priceDescribe}
                          description={this.state.forCampaignsPricingCards.Professional.description}
                          bullets={this.state.forCampaignsPricingCards.Professional.bullets}
                          buttonText={this.state.forCampaignsPricingCards.Professional.buttonText}
                          buttonOnClickId={this.state.forCampaignsPricingCards.Professional.buttonOnClickId}
                          buttonOnClickFunction={this.state.forCampaignsPricingCards.Professional.buttonOnClickFunction}
                          pricingCardFeatures={this.state.forCampaignsPricingCards.Professional.pricingCardFeatures}
                        />
                      ) : (
                        <PricingCard
                          fullWidth
                          planName={this.state.forCampaignsPricingCards.Enterprise.planName}
                          price={this.state.forCampaignsPricingCards.Enterprise.price}
                          priceDescribe={this.state.forCampaignsPricingCards.Enterprise.priceDescribe}
                          description={this.state.forCampaignsPricingCards.Enterprise.description}
                          bullets={this.state.forCampaignsPricingCards.Enterprise.bullets}
                          buttonText={this.state.forCampaignsPricingCards.Enterprise.buttonText}
                          buttonOnClickId={this.state.forCampaignsPricingCards.Enterprise.buttonOnClickId}
                          buttonOnClickFunction={this.state.forCampaignsPricingCards.Enterprise.buttonOnClickFunction}
                          pricingCardFeatures={this.state.forCampaignsPricingCards.Enterprise.pricingCardFeatures}
                        />
                      )}
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="row u-show-desktop">
                <PricingCard
                  planName={this.state.forCampaignsPricingCards.Free.planName}
                  price={this.state.forCampaignsPricingCards.Free.price}
                  priceDescribe={this.state.forCampaignsPricingCards.Free.priceDescribe}
                  description={this.state.forCampaignsPricingCards.Free.description}
                  bullets={this.state.forCampaignsPricingCards.Free.bullets}
                  buttonText={this.state.forCampaignsPricingCards.Free.buttonText}
                  buttonOnClickId={this.state.forCampaignsPricingCards.Free.buttonOnClickId}
                  buttonOnClickFunction={this.state.forCampaignsPricingCards.Free.buttonOnClickFunction}
                  pricingCardFeatures={this.state.forCampaignsPricingCards.Free.pricingCardFeatures}
                />
                <PricingCard
                  planName={this.state.forCampaignsPricingCards.Professional.planName}
                  price={this.state.forCampaignsPricingCards.Professional.price}
                  priceDescribe={this.state.forCampaignsPricingCards.Professional.priceDescribe}
                  description={this.state.forCampaignsPricingCards.Professional.description}
                  bullets={this.state.forCampaignsPricingCards.Professional.bullets}
                  buttonText={this.state.forCampaignsPricingCards.Professional.buttonText}
                  buttonOnClickId={this.state.forCampaignsPricingCards.Professional.buttonOnClickId}
                  buttonOnClickFunction={this.state.forCampaignsPricingCards.Professional.buttonOnClickFunction}
                  pricingCardFeatures={this.state.forCampaignsPricingCards.Professional.pricingCardFeatures}
                />
                <PricingCard
                  planName={this.state.forCampaignsPricingCards.Enterprise.planName}
                  price={this.state.forCampaignsPricingCards.Enterprise.price}
                  priceDescribe={this.state.forCampaignsPricingCards.Enterprise.priceDescribe}
                  description={this.state.forCampaignsPricingCards.Enterprise.description}
                  bullets={this.state.forCampaignsPricingCards.Enterprise.bullets}
                  buttonText={this.state.forCampaignsPricingCards.Enterprise.buttonText}
                  buttonOnClickId={this.state.forCampaignsPricingCards.Enterprise.buttonOnClickId}
                  buttonOnClickFunction={this.state.forCampaignsPricingCards.Enterprise.buttonOnClickFunction}
                  pricingCardFeatures={this.state.forCampaignsPricingCards.Enterprise.pricingCardFeatures}
                />
              </div>
            </div>
          </AboutDescriptionContainer>
        </Section>
        <Section>
          &nbsp;
        </Section>
        <Footer />
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
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
`;

const HeaderForAbout = styled.div`
  position: relative;
  height: 240px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  // @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  //   height: 240px;
  // }
  // @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
  //   height: 240px;
  // }
`;

const AboutDescriptionContainer = styled.div`
  margin: 1em auto;
  width: 960px;
  max-width: 90vw;
  text-align: left;
  @media (max-width: 569px) {
    margin-top: -2em;
  }
`;

// const SwitchContainer = styled.div`
//   background: #2e3c5d;
//   border-radius: 50px;
//   width: calc(100% - 30px);
//   margin: 0 auto;
//   padding: 4px;
//   margin-bottom: 32px;
// `;

export default withStyles(styles)(Pricing);
