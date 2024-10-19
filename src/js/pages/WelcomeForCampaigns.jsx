import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import AnalyticsActions from '../actions/AnalyticsActions';
import VoterActions from '../actions/VoterActions';
import historyPush from '../common/utils/historyPush';
import { renderLog } from '../common/utils/logging';
import normalizedImagePath from '../common/utils/normalizedImagePath';
import { BlueTitle, SubTitle, Title } from '../components/Welcome/headerWelcomeStyles';
import { Description, DescriptionContainer, DescriptionImageColumn, DescriptionLeftColumn, Image, NetworkContainer, NetworkImage, Section, SectionTitle, SectionTitleBold } from '../components/Welcome/sectionStyles';
import Testimonial from '../components/Widgets/Testimonial';
import VoterConstants from '../constants/VoterConstants';
import AppObservableStore from '../common/stores/AppObservableStore';
import VoterStore from '../stores/VoterStore';
import cordovaScrollablePaneTopPadding from '../utils/cordovaScrollablePaneTopPadding';
import { validateEmail } from '../utils/regex-checks';

const WelcomeAppbar = React.lazy(() => import(/* webpackChunkName: 'WelcomeAppbar' */ '../components/Navigation/WelcomeAppbar'));
const WelcomeFooter = React.lazy(() => import(/* webpackChunkName: 'WelcomeFooter' */ '../components/Welcome/WelcomeFooter'));

const ffwdLogo = '../../img/global/logos/ffwd-logo.png';
const googleLogo = '../../img/global/logos/google-logo.svg';
const vipLogo = '../../img/global/logos/vip-logo-1000x208.png';
const voteDotOrgLogo = '../../img/global/logos/vote_dot_org_logo-530x200.png';

class WelcomeForCampaigns extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      submitEnabled: false,
      voter: {},
      voterEmail: '',
      voterFullName: '',
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionWelcomeVisit(VoterStore.electionId());
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  getStartedForCampaigns = () => {
    const { voter } = this.state;
    let isSignedIn = false;
    if (voter) {
      ({ is_signed_in: isSignedIn } = voter);
      isSignedIn = (isSignedIn === undefined) || (isSignedIn === null) ? false : isSignedIn;
    }
    if (isSignedIn) {
      historyPush('/settings/profile');
    } else {
      AppObservableStore.setGetStartedMode('getStartedForCampaigns');
      AppObservableStore.setShowSignInModal(true);
    }
  };

  updateVoterFullName = (event) => {
    this.setState({
      voterFullName: event.target.value,
    });
  };

  // updateVoterEmailAddress = (event) => {
  //   const isEmailValid = validateEmail(event.target.value);
  //   let submitEnabled = false;
  //   if (isEmailValid) {
  //     submitEnabled = true;
  //   }

  //   this.setState({
  //     voterEmail: event.target.value,
  //     submitEnabled,
  //   });
  // };

  voterEmailAddressSignUpSave = (event) => {
    // Only proceed after we have a valid email address, which will enable the submit
    if (this.state.submitEnabled) {
      event.preventDefault();
      const sendLinkToSignIn = true;
      VoterActions.voterEmailAddressSave(this.state.voterEmail, sendLinkToSignIn);
      VoterActions.voterFullNameSoftSave('', '', this.state.voterFullName);
      VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
    }
  };

  handleToPageFromMobileNav = (destination) => {
    this.handleShowMobileNavigation(false);
    historyPush(destination);
  };

  render () {
    renderLog('WelcomeForCampaigns');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;
    // console.log('WelcomeForCampaigns, pathname: ', pathname);
    const { voter } = this.state;
    const voterIsSignedIn = voter.is_signed_in;

    const testimonialAuthor = 'Neelam J., Columbus, Ohio';
    const imageUrl = normalizedImagePath('/img/global/photos/Neelam_Joshi-200x200.jpg');
    const testimonial = 'I don\'t have time to attend rallies and listen to campaign speeches, and I don\'t trust much of what I see on Facebook. WeVote helps me cut through the chatter and use endorsements from people I trust.';
    return (
      <WelcomeForCampaignsWrapper id="WelcomeForCampaignsWrapper">
        <Helmet title="Welcome Campaigns - WeVote" />
        <Suspense fallback={<></>}>
          <WelcomeAppbar pathname={pathname} id="WelcomeForCampaigns_WelcomeAppbar" />
        </Suspense>
        <HeaderForCampaigns>
          <Title>
            <BlueTitle>Supercharge </BlueTitle>
            Your Supporters
          </Title>
          <SubTitle>Leverage social ballot planning tools to triple your reach.</SubTitle>
          <HeaderSection>
            <HeaderStep>
              <HeaderStepNumber>1</HeaderStepNumber>
              <HeaderStepLabel>Create your campaign profile</HeaderStepLabel>
            </HeaderStep>
            <HeaderStep>
              <HeaderStepNumber>2</HeaderStepNumber>
              <HeaderStepLabel>Import your endorsements</HeaderStepLabel>
            </HeaderStep>
            <HeaderStep>
              <HeaderStepNumber>3</HeaderStepNumber>
              <HeaderStepLabel>Spark social lift</HeaderStepLabel>
            </HeaderStep>
            <HeaderStepButton>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                classes={{ root: classes.buttonMaxWidth, containedSecondary: classes.buttonContained }}
                onClick={() => this.getStartedForCampaigns()}
                id="welcomeForCampaignsGetStarted"
              >
                Get Started
              </Button>
            </HeaderStepButton>
          </HeaderSection>
        </HeaderForCampaigns>
        <Section>
          <SectionTitle>
            <SectionTitleBold>Triple your Endorsement Reach</SectionTitleBold>
          </SectionTitle>
          <DescriptionContainer>
            <DescriptionLeftColumn>
              <Description>
                Empower your supporters to share your localized, responsive endorsement
                {' '}
                experience with their friends and family on Facebook, X, email and SMS.
              </Description>
              <FeatureStep>
                <FeatureStepLabel>
                  <FeatureBlueTitle>Free: </FeatureBlueTitle>
                  Make sure everyone can see your endorsements
                </FeatureStepLabel>
              </FeatureStep>
              <Description>
                WeVote compiles endorsement data for all candidates in all states up and down
                {' '}
                the ballot, so begin adding your endorsements to get more views. Claim your free
                {' '}
                WeVote profile today and add your endorsements, values, and branding anytime.
              </Description>
              <FeatureStep>
                <FeatureStepLabel>
                  <FeatureBlueTitle>Premium: </FeatureBlueTitle>
                  Promoting your endorsements
                </FeatureStepLabel>
              </FeatureStep>
              <Description>
                Further empower your supporters, and measure your reach using premium
                {' '}
                features to customize promotion content, expand branding and
                {' '}
                access + analyze social sharing data.
              </Description>
              <Description className="u_margin-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                  id="welcomeForCampaignsHowItWorksForCampaigns"
                  onClick={() => historyPush('/how/for-campaigns')}
                >
                  How it Works For Campaigns
                </Button>
              </Description>
            </DescriptionLeftColumn>
            <DescriptionImageColumn>
              <Image src={normalizedImagePath('/img/welcome/WelcomeForCampaigns-SierraClubScreenShot-20190507.png')} />
            </DescriptionImageColumn>
          </DescriptionContainer>
        </Section>
        <Section variant="dark" rounded>
          <SectionTitle>
            Voting Should be
            <SectionTitleBold> Simple</SectionTitleBold>
          </SectionTitle>
          <DescriptionContainer>
            <DescriptionImageColumn>
              <Image src={normalizedImagePath('/img/welcome/WelcomeForVoters-Ballot-20190507.png')} />
            </DescriptionImageColumn>
            <DescriptionLeftColumn>
              <Description>
                WeVote is a free, easy tool that allows voters to geolocate their specific
                {' '}
                ballot and then plan who to vote for using easy visual guides. Voters can
                {' '}
                customize their own ballot to display endorsements they trust, from
                {' '}
                friends and organizations.
              </Description>
              <Description>
                Using WeVote, voters can now confidently plan out their whole ballot.
              </Description>
              <Description className="u_margin-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                  id="welcomeForCampaignsHowItWorksForVoters"
                  onClick={() => historyPush('/how/for-voters')}
                >
                  How it Works For Voters
                </Button>
              </Description>
            </DescriptionLeftColumn>
          </DescriptionContainer>
        </Section>
        <Section>
          <SectionTitle>Testimonials</SectionTitle>
          <DescriptionContainer>
            <Testimonial
              imageUrl={imageUrl}
              testimonialAuthor={testimonialAuthor}
              testimonial={testimonial}
            />
            {/*
            <Testimonial
              imageUrl={imageUrl}
              testimonialAuthor={testimonialAuthor}
              testimonial={testimonial}
            />
            */}
          </DescriptionContainer>
        </Section>
        <Section variant="dark" rounded={!voterIsSignedIn}>
          <SectionTitle>Our Network</SectionTitle>
          <NetworkContainer>
            <NetworkImage src={normalizedImagePath(ffwdLogo)} alt="Fast Forward" />
            <NetworkImage src={normalizedImagePath(googleLogo)} alt="Google" />
            {/* <NetworkImage src={normalizedImagePath('/img/global/logos/ctcl_logo-200x200.png')} alt="Center for Technology and Civic Life" /> */}
            <NetworkImage src={normalizedImagePath(voteDotOrgLogo)} alt="Vote.org" />
            <NetworkImage src={normalizedImagePath(vipLogo)} alt="Voting Information Project" />
          </NetworkContainer>
        </Section>
        <Suspense fallback={<></>}>
          <WelcomeFooter />
        </Suspense>
      </WelcomeForCampaignsWrapper>
    );
  }
}
WelcomeForCampaigns.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonContained: {
    borderRadius: 32,
    fontWeight: 500,
  },
  buttonMaxWidth: {
    width: '100%',
  },
  iconButton: {
    color: 'white',
  },
});

const WelcomeForCampaignsWrapper = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
  padding-top: ${cordovaScrollablePaneTopPadding()};
`;

const HeaderSection = styled('div')`
  display: flex;
  flex-flow: column;
  padding: 1em 1em 3em 1em;
  text-align: center;
  align-items: center;
  color: #333;
  width: 100%;
`;

const HeaderForCampaigns = styled('div')(({ theme }) => (`
  position: relative;
  height: 530px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  ${theme.breakpoints.down('md')} {
    height: 530px;
  }
  ${theme.breakpoints.down('xs')} {
    height: 560px;
  }
`));

const HeaderStep = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: row nowrap;
  font-size: 18px;
  padding: 8px;
  background: rgb(65, 81, 118);
  width: 400px;
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
  ${theme.breakpoints.down('md')} {
    width: 100%;
  }
`));

const HeaderStepNumber = styled('div')(({ theme }) => (`
  width: 24px;
  height: 24px;
  background: white;
  color: ${theme.colors.brandBlue};
  border-radius: 4px;
  ${theme.breakpoints.down('md')} {
    width: 24px;
    height: 24px;
    min-width: 24px;
  }
`));

const HeaderStepLabel = styled('p')(({ theme }) => (`
  font-weight: bold;
  color: white;
  margin: 0 .7rem;
  text-align: left;
  ${theme.breakpoints.down('md')} {
    margin: auto .7rem;
  }
`));

const HeaderStepButton = styled('p')`
  margin: 30px auto;
`;

const FeatureStep = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: row nowrap;
  font-size: 18px;
  padding: 8px;
  background: rgb(216, 221, 232);
  width: 600px;
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
  ${theme.breakpoints.down('md')} {
    width: 100%;
  }
`));

const FeatureStepLabel = styled('p')(({ theme }) => (`
  font-weight: bold;
  margin: 0 .7rem;
  text-align: left;
  ${theme.breakpoints.down('md')} {
    margin: auto .7rem;
  }
`));

const FeatureBlueTitle = styled('span')`
  color: rgb(6, 33, 79);
`;

export default withStyles(styles)(WelcomeForCampaigns);
