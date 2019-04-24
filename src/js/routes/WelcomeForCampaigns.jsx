import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import LocationIcon from '@material-ui/icons/LocationOn';
import { HeaderForCampaigns, Title, BlueTitle, SubTitle } from '../components/Welcome/Header';
import Section, { SectionTitle, SectionTitleBold, Step, StepNumber, StepLabel, GetStarted, ButtonContainer, DescriptionContainer, DescriptionLeftColumn, DescriptionImageColumn, Description, Image, Bold, NetworkContainer, NetworkImage } from '../components/Welcome/Section';
import WelcomeAppbar from '../components/Welcome/WelcomeAppbar';
import Footer from '../components/Welcome/Footer';
import AddressBox from '../components/Welcome/AddressBox';
import { historyPush, cordovaDot } from '../utils/cordovaUtils';
import Testimonial from '../components/Widgets/Testimonial';
import AnalyticsActions from '../actions/AnalyticsActions';
import validateEmail from '../utils/email-functions';
import VoterActions from '../actions/VoterActions';
import VoterConstants from '../constants/VoterConstants';
import VoterStore from '../stores/VoterStore';

class WelcomeForCampaigns extends PureComponent {
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
    // console.log('WelcomeForCampaigns, pathname: ', pathname);
    const { voter } = this.state;
    const isVoterSignedIn = voter.is_signed_in;

    const testimonialAuthor = 'Dale M., Oakland, California';
    const imageUrl = cordovaDot('/img/global/photos/Dale_McGrew-200x200.jpg');
    const testimonial = 'Following the values that are important to me shows me opinions on my ballot from other people who share my values.';
    return (
      <Wrapper>
        <WelcomeAppbar pathname={pathname} />
        <HeaderForCampaigns>
          <Title>
            <BlueTitle>Supercharge </BlueTitle>
            Your Supporters
          </Title>
          <SubTitle>Leverage social ballot planning tools to empower supporters to triple your reach.</SubTitle>
        </HeaderForCampaigns>
        <Section>
          <SectionTitle>
            We Vote is
            <SectionTitleBold> Free &amp; Easy</SectionTitleBold>
          </SectionTitle>
          <Step>
            <StepNumber>1</StepNumber>
            <StepLabel>Claim your Campaign Profile</StepLabel>
          </Step>
          <Step>
            <StepNumber>2</StepNumber>
            <StepLabel>Import your Endorsements</StepLabel>
          </Step>
          <Step>
            <StepNumber>3</StepNumber>
            <StepLabel>Add More Customizations for your Supporters</StepLabel>
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
                More and more money is spent on elections each year,
                <Bold> yet our ballots remain mysterious and difficult to fill out. </Bold>
                Endorsements are fragmented, and as a result many voters chose not to vote down ballot at all rather than unintentionally vote the wrong way. Until now.
              </Description>
              <Description>
                We Vote is a free, easy tool that allows voters to view ballot endorsements they trust from friends and organizations all in one place.
                {' '}
                We help users geolocate their specific ballot and then plan who to vote for using easy visual guides.
                {' '}
                Voters can now confidently fill out their whole ballot in six minutes.
              </Description>
              <Description>
                Here&apos;s where you come in:
              </Description>
              <Step>
                <StepNumber>1</StepNumber>
                <StepLabel>Sharing endorsements (free)</StepLabel>
              </Step>
              <Description>
                As an organization, you have your own landing page and endorsement page with unique URLs to bring in supporters.
                {' '}
                Make sure everyone can see your endorsements when they are voting, whether or not they got your mailer, texts or reminders.
              </Description>
              <Step>
                <StepNumber>2</StepNumber>
                <StepLabel>Supercharging your Supporters (paid, but worth it!)</StepLabel>
              </Step>
              <Description>
                We know relational organizing can increase voter turnout by 25%. But we shouldn&apos;t stop at turnout, we need to make it easier to voters to cast their ballots with the right choices. Empower your supporters to share your ballot guides with
                {' '}
                <i>their</i>
                {' '}
                most relevant social networks.
              </Description>
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

export default withStyles(styles)(WelcomeForCampaigns);
