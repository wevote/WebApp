import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Title, BlueTitle, SubTitle, Video, PlayerContainer } from '../components/Welcome/Header';
import Section, { SectionTitle, SectionTitleBold, DescriptionContainer, DescriptionLeftColumn, DescriptionImageColumn, Description, Image, Bold, NetworkContainer, NetworkImage } from '../components/Welcome/Section';
import WelcomeAppbar from '../components/Navigation/WelcomeAppbar';
import Footer from '../components/Welcome/Footer';
import { historyPush, cordovaDot } from '../utils/cordovaUtils';
import Testimonial from '../components/Widgets/Testimonial';
import AnalyticsActions from '../actions/AnalyticsActions';
import AppActions from '../actions/AppActions';
import validateEmail from '../utils/email-functions';
import VoterActions from '../actions/VoterActions';
import VoterConstants from '../constants/VoterConstants';
import VoterStore from '../stores/VoterStore';

class WelcomeForOrganizations extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
  };

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
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  getStartedForOrganizations () {
    const { voter } = this.state;
    let isSignedIn = false;
    if (voter) {
      ({ is_signed_in: isSignedIn } = voter);
      isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;
    }
    if (isSignedIn) {
      historyPush('/settings/profile');
    } else {
      AppActions.setGetStartedMode('getStartedForOrganizations');
      AppActions.setShowSignInModal(true);
    }
  }

  updateVoterFullName = (event) => {
    this.setState({
      voterFullName: event.target.value,
    });
  }

  updateVoterEmailAddress = (event) => {
    const isEmailValid = validateEmail(event.target.value);
    let submitEnabled = false;
    if (isEmailValid) {
      submitEnabled = true;
    }

    this.setState({
      voterEmail: event.target.value,
      submitEnabled,
    });
  }

  voterEmailAddressSignUpSave = (event) => {
    // Only proceed after we have a valid email address, which will enable the submit
    if (this.state.submitEnabled) {
      event.preventDefault();
      const sendLinkToSignIn = true;
      VoterActions.voterEmailAddressSave(this.state.voterEmail, sendLinkToSignIn);
      VoterActions.voterFullNameSoftSave('', '', this.state.voterFullName);
      VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
    }
  }

  handleToPageFromMobileNav = (destination) => {
    this.handleShowMobileNavigation(false);
    historyPush(destination);
  }

  render () {
    const { classes, pathname } = this.props;
    // console.log('WelcomeForOrganizations, pathname: ', pathname);
    const { voter } = this.state;
    const isVoterSignedIn = voter.is_signed_in;

    const testimonialAuthor = 'Judy J., Oakland, California';
    const testimonialImageUrl = cordovaDot('/img/global/photos/Judy_J-109x109.jpg');
    const testimonial = 'Let\'s be real: few people are reading those wonky ballot descriptions. I want deciding how to vote to be as easy and obvious as a solid Yelp review. Finally We Vote helps me plan the whole thing out way faster.';
    return (
      <Wrapper>
        <Helmet title="Welcome Organizations - We Vote" />
        <WelcomeAppbar pathname={pathname} />
        <HeaderForOrganizations>
          <Title>
            <BlueTitle>Supercharge </BlueTitle>
            Your Members
          </Title>
          <SubTitle>Only 6 out of 10 eligible voters are predicted to cast a ballot next year.</SubTitle>
          <PlayerContainer>
            <Video
              src="https://player.vimeo.com/video/329164243"
              frameBorder="0"
              allow="fullscreen"
            />
            <script src="https://player.vimeo.com/api/player.js" />
          </PlayerContainer>
        </HeaderForOrganizations>
        <Section>
          <SectionTitle>
            Empower voters with
            <SectionTitleBold> neutral information</SectionTitleBold>
            .
          </SectionTitle>
          <DescriptionContainer>
            <Description>
              You don
              {'’'}
              t have to be involved with politics to boost civic engagement.
              {' '}
              There are easy, appropriate ways for every organization or business to increase voter participation:
            </Description>
            <Description>
              <Bold>
                Help your staff, customers or members get accurate, helpful information about what
                {'’'}
                s on their ballot.
              </Bold>
            </Description>
            <Description className="u_margin-center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                id="welcomeForOrganizationsHowItWorksForOrganizations"
                onClick={() => historyPush('/how/for-organizations')}
              >
                How it Works for Organizations
              </Button>
            </Description>
          </DescriptionContainer>
        </Section>
        <Section variant="dark" rounded>
          <SectionTitle>
            For
            {' '}
            <SectionTitleBold>Non-Partisan Organizations</SectionTitleBold>
          </SectionTitle>
          <DescriptionContainer>
            <DescriptionLeftColumn>
              <Description>
                Boost your social impact brand as a responsible supporter of civic engagement.
              </Description>
              <Description>
                As a
                {' '}
                <Bold>nonpartisan partner</Bold>
                , your organization or business can customize and share a branded landing page with your list.
                {' '}
                You will be empowering individuals to register to vote, review their ballot,
                {' '}
                find their polling location, and use We Vote tools to confidently make voting decisions.
              </Description>
              <Description className="u_margin-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                  id="welcomeForOrganizationsGetStarted"
                  onClick={() => this.getStartedForOrganizations()}
                >
                  Get Started
                </Button>
              </Description>
            </DescriptionLeftColumn>
            <DescriptionImageColumn>
              <Image src={cordovaDot('/img/welcome/WelcomeForOrganizations-YourLogoScreenShot.png')} />
            </DescriptionImageColumn>
          </DescriptionContainer>
        </Section>
        <Section>
          <SectionTitle>
            Voting Should be
            <SectionTitleBold> Simple</SectionTitleBold>
          </SectionTitle>
          <DescriptionContainer>
            <DescriptionImageColumn>
              <Image src={cordovaDot('/img/welcome/WelcomeForOrganizations-PollingLocationScreenShot.png')} />
            </DescriptionImageColumn>
            <DescriptionLeftColumn>
              <Description>
                We Vote is a free, easy tool that allows voters to geolocate their specific
                {' '}
                ballot and then plan who to vote for using easy visual guides. Voters can
                {' '}
                customize their own ballot to display endorsements they trust, from
                {' '}
                friends and organizations.
              </Description>
              <Description>
                Using We Vote, voters can now confidently plan out their whole ballot in
                {' '}
                six minutes or less.
              </Description>
              <Description className="u_margin-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                  id="welcomeForOrganizationsHowItWorksForVoters"
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
              imageUrl={testimonialImageUrl}
              testimonialAuthor={testimonialAuthor}
              testimonial={testimonial}
            />
          </DescriptionContainer>
        </Section>
        <Section>
          <SectionTitle>
            We Vote
            {' '}
            <SectionTitleBoldGold>Premium</SectionTitleBoldGold>
          </SectionTitle>
          <DescriptionContainer>
            <Description>
              In addition to our free toolsets, we also offer advanced partnership opportunities to customize or expand your reach.
            </Description>
            <Description>
              Our team can partner with your brand to configure a customized landing page for you to share with members,
              {' '}
              add a We Vote widget to your website, assist in messaging to launch the partnership, drive additional traffic, or provide analytics. Learn more!
            </Description>
            <Description className="u_margin-center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.goldButton}
                classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                id="welcomeForOrganizationsPricing"
                onClick={() => historyPush('/more/pricing')}
              >
                View Pricing
              </Button>
            </Description>
          </DescriptionContainer>
        </Section>
        <Section variant="dark" rounded={!isVoterSignedIn}>
          <SectionTitle>Our Network</SectionTitle>
          <NetworkContainer>
            <NetworkImage src={cordovaDot('/img/global/logos/ffwd-logo.png')} alt="Fast Forward" />
            <NetworkImage src={cordovaDot('/img/global/logos/google-logo.svg')} alt="Google" />
            {/* <NetworkImage src={cordovaDot('/img/global/logos/ctcl_logo-200x200.png')} alt="Center for Technology and Civic Life" /> */}
            <NetworkImage src={cordovaDot('/img/global/logos/vote_dot_org_logo-530x200.png')} alt="Vote.org" />
            <NetworkImage src={cordovaDot('/img/global/logos/vip-logo-1000x208.png')} alt="Voting Information Project" />
          </NetworkContainer>
        </Section>
        <Footer />
      </Wrapper>
    );
  }
}

const styles = () => ({
  buttonContained: {
    borderRadius: 32,
  },
  buttonMaxWidth: {
    width: '100%',
    margin: '0 auto',
  },
  iconButton: {
    color: 'white',
  },
  goldButton: {
    background: 'linear-gradient(70deg, rgba(219,179,86,1) 14%, rgba(162,124,33,1) 94%)',
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
`;

const HeaderForOrganizations = styled.div`
  position: relative;
  height: 590px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 450px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 380px;
  }
`;

const SectionTitleBoldGold = styled.span`
  color: rgb(219, 179, 86);
  font-weight: bold;
`;

export default withStyles(styles)(WelcomeForOrganizations);
