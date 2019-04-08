import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import LocationIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import EmailIcon from '@material-ui/icons/Email';
import Navigation, { LogoContainer, Divider, NavLink, MobileNavigationMenu, MobileNavDivider, NavRow } from '../components/Welcome/Navigation';
import Header, { Title, BlueTitle, SubTitle, Video, PlayerContainer } from '../components/Welcome/Header';
import Section, { SectionTitle, SectionTitleBold, Step, StepNumber, StepLabel, GetStarted, ButtonContainer, DescriptionContainer, DescriptionLeftColumn, DescriptionImageColumn, Description, Image, Bold, NetworkContainer, NetworkImage, SignUpContainer, SignUpMessage } from '../components/Welcome/Section';
import Footer from '../components/Welcome/Footer';
import TextBox from '../components/Welcome/TextBox';
import AddressBox from '../components/Welcome/AddressBox';
import HeaderBarLogo from '../components/Navigation/HeaderBarLogo';
import { historyPush, cordovaDot } from '../utils/cordovaUtils';
import Testimonial from '../components/Widgets/Testimonial';
import AnalyticsActions from '../actions/AnalyticsActions';
import validateEmail from '../utils/email-functions';
import VoterActions from '../actions/VoterActions';
import VoterConstants from '../constants/VoterConstants';
import VoterStore from '../stores/VoterStore';

class Welcome extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      submitEnabled: false,
      newsletterOptInTrue: false,
      voter: {},
      voterEmail: '',
      voterFullName: '',
      showMobileNavigationMenu: false,
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
      newsletterOptInTrue: VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN),
      voter: VoterStore.getVoter(),
    });
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

  handleShowMobileNavigation = (show) => {
    this.setState({ showMobileNavigationMenu: show });
    if (show) {
      document.querySelector('body').style.overflow = 'hidden';
      return;
    }
    document.querySelector('body').style.overflow = '';
  }

  handleToPageFromMobileNav = (destination) => {
    this.handleShowMobileNavigation(false);
    historyPush(destination);
  }

  render () {
    const { classes } = this.props;
    const { showMobileNavigationMenu, voter, newsletterOptInTrue } = this.state;
    const isVoterSignedIn = voter.is_signed_in;

    const testimonialAuthor = 'Dale M., Oakland, California';
    const imageUrl = cordovaDot('/img/global/photos/Dale_McGrew-200x200.jpg');
    const testimonial = 'Following the values that are important to me shows me opinions on my ballot from other people who share my values.';
    return (
      <Wrapper>
        <Appbar position="relative" classes={{ root: classes.appBarRoot }}>
          <Toolbar classes={{ root: classes.toolbar }} disableGutters>
            <LogoContainer>
              <HeaderBarLogo light />
            </LogoContainer>
            <Navigation>
              <NavLink>For Campaigns</NavLink>
              <DesktopView>
                <Divider />
                <NavLink>How It Works</NavLink>
                <Divider />
                <NavLink href="/ballot">Get Started</NavLink>
                <Divider />
                <NavLink href="/settings/account">Sign In</NavLink>
              </DesktopView>
              <MobileTabletView>
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() => this.handleShowMobileNavigation(true)}
                >
                  <MenuIcon />
                </IconButton>
                {
                  showMobileNavigationMenu && (
                    <MobileNavigationMenu>
                      <NavRow>
                        <CloseIcon
                          classes={{ root: classes.navClose }}
                          onClick={() => this.handleShowMobileNavigation(false)}
                        />
                      </NavRow>
                      <MobileNavDivider />
                      <NavRow>
                        <NavLink>For Campaigns</NavLink>
                      </NavRow>
                      <MobileNavDivider />
                      <NavRow>
                        <NavLink>How It Works</NavLink>
                      </NavRow>
                      <MobileNavDivider />
                      <NavRow>
                        <Button
                          variant="outlined"
                          classes={{ root: classes.navButtonOutlined }}
                          onClick={() => this.handleToPageFromMobileNav('/ballot')}
                        >
                          Get Started
                        </Button>
                        <Button
                          variant="outlined"
                          classes={{ root: classes.navButtonOutlined }}
                          onClick={() => this.handleToPageFromMobileNav('/settings/account')}
                        >
                          Sign In
                        </Button>
                      </NavRow>
                    </MobileNavigationMenu>
                  )
                }
              </MobileTabletView>
            </Navigation>
          </Toolbar>
        </Appbar>
        <Header>
          <Title>
            Plan Your Entire Ballot
            <BlueTitle> in 6 Minutes</BlueTitle>
          </Title>
          <SubTitle>Finally, a simple way to fill out your ballot.</SubTitle>
          <PlayerContainer>
            <Video
              src="https://player.vimeo.com/video/329164243"
              frameBorder="0"
              allow="fullscreen"
            />
            <script src="https://player.vimeo.com/api/player.js" />
          </PlayerContainer>
        </Header>
        <Section>
          <SectionTitle>
            We Vote is
            <SectionTitleBold> Free &amp; Easy</SectionTitleBold>
          </SectionTitle>
          <Step>
            <StepNumber>1</StepNumber>
            <StepLabel>Choose your interests</StepLabel>
          </Step>
          <Step>
            <StepNumber>2</StepNumber>
            <StepLabel>Follow organizations and people you trust</StepLabel>
          </Step>
          <Step>
            <StepNumber>3</StepNumber>
            <StepLabel>See who endorsed each choice on your ballot</StepLabel>
          </Step>
          <Step>
            <StepNumber>4</StepNumber>
            <StepLabel>Fill out the whole thing in under 6 minutes</StepLabel>
          </Step>
          <GetStarted>
            <AddressBox icon={<LocationIcon />} />
            <ButtonContainer>
              <Button
                variant="contained"
                color="primary"
                classes={{ containedPrimary: classes.buttonContained }}
                onClick={() => historyPush('/ballot')}
              >
                Get Started
              </Button>
            </ButtonContainer>
          </GetStarted>
        </Section>
        <Section variant="dark" rounded>
          <DescriptionContainer>
            <DescriptionLeftColumn>
              <Description>
                <Bold>We&apos;ve all been there. </Bold>
                Election day is almost here, but besides the President and a few other choices we&apos;ve made, we don&apos;t know how we are going to vote! Between the nonstop misleading TV ads, texts, calls and oveflowing mailboxes, who has time to make sense of the madness? There has to be a better way.
              </Description>
              <Description>Now, there is!</Description>
              <Description>We&apos;ll help you confidently fill out your specific ballot with views of endorsements from organizaitons and friends you trust, all in one place.</Description>
            </DescriptionLeftColumn>
            <DescriptionImageColumn>
              <Image src={cordovaDot('/img/welcome/screenshot.png')} />
            </DescriptionImageColumn>
          </DescriptionContainer>
        </Section>
        <Section>
          <SectionTitle>Testimonials</SectionTitle>
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
        </Section>
        <Section variant="dark" rounded={!isVoterSignedIn}>
          <SectionTitle>Our Network</SectionTitle>
          <NetworkContainer>
            <NetworkImage src={cordovaDot('/img/welcome/partners/google-logo.svg')} alt="Google" />
            <NetworkImage src={cordovaDot('/img/welcome/partners/center-for-technology.png')} alt="Center for Technology and Civic Life" />
            <NetworkImage src={cordovaDot('/img/welcome/partners/vote-org.png')} alt="Vote.org" />
            <NetworkImage src={cordovaDot('/img/welcome/partners/voting-information-project.png')} alt="Voting Information Project" />
          </NetworkContainer>
        </Section>
        {
          !isVoterSignedIn && (
            <Section>
              <SectionTitle>Sign up to get updates about We Vote</SectionTitle>
              <SignUpContainer>
                <TextBox
                  icon={<PersonIcon />}
                  placeholder="Full Name"
                  value={this.state.voterFullName}
                  inputProps={{ onChange: this.updateVoterFullName }}
                />
                <TextBox
                  icon={<EmailIcon />}
                  placeholder="Email"
                  value={this.state.voterEmail}
                  inputProps={{ type: 'email', onChange: this.updateVoterEmailAddress }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                  onClick={this.voterEmailAddressSignUpSave}
                >
                  Sign Up
                </Button>
                {newsletterOptInTrue === 1 && <SignUpMessage>Please check your email for a verification link</SignUpMessage>}
              </SignUpContainer>
            </Section>
          )
        }
        <Footer />
      </Wrapper>
    );
  }
}

const styles = theme => ({
  appBarRoot: {
    background: 'transparent',
    alignItems: 'center',
    boxShadow: 'none',
  },
  toolbar: {
    width: 960,
    maxWidth: '95%',
    justifyContent: 'space-between',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  },
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
  navButtonOutlined: {
    height: 32,
    borderRadius: 32,
    color: 'white',
    border: '1px solid white',
    marginBottom: '1em',
    fontWeight: '300',
    width: '47%',
    fontSize: 12,
    padding: '5px 0',
    marginTop: 8,
  },
  navClose: {
    position: 'fixed',
    right: 16,
    cursor: 'pointer',
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
`;

const DesktopView = styled.div`
  display: inherit;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileTabletView = styled.div`
  display: inherit;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export default withStyles(styles)(Welcome);
