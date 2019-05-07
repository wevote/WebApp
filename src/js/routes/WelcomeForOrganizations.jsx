import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Header, { Title, BlueTitle, SubTitle, Video, PlayerContainer } from '../components/Welcome/Header';
import Section, { SectionTitle, SectionTitleBold, DescriptionContainer, DescriptionLeftColumn, DescriptionImageColumn, Description, Image, Bold, NetworkContainer, NetworkImage } from '../components/Welcome/Section';
import WelcomeAppbar from '../components/Navigation/WelcomeAppbar';
import Footer from '../components/Welcome/Footer';
import { historyPush, cordovaDot } from '../utils/cordovaUtils';
import Testimonial from '../components/Widgets/Testimonial';
import AnalyticsActions from '../actions/AnalyticsActions';
import validateEmail from '../utils/email-functions';
import VoterActions from '../actions/VoterActions';
import VoterConstants from '../constants/VoterConstants';
import VoterStore from '../stores/VoterStore';

class WelcomeForOrganizations extends PureComponent {
  static propTypes = {
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
    const { pathname } = this.props;
    // console.log('WelcomeForOrganizations, pathname: ', pathname);
    const { voter } = this.state;
    const isVoterSignedIn = voter.is_signed_in;

    const testimonialAuthor = 'Debra Cleaver, Vote.org';
    const imageUrl = cordovaDot('/img/global/photos/Debra_Cleaver-200x200.jpg');
    const testimonial = 'We don\'t care who you vote for, just VOTE.';
    return (
      <Wrapper>
        <Helmet title="Welcome Organizations - We Vote" />
        <WelcomeAppbar pathname={pathname} />
        <Header>
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
        </Header>
        <Section>
          <SectionTitle>
            Empower voters with
            <SectionTitleBold> neutral information</SectionTitleBold>
            .
          </SectionTitle>
          <Description>
            Regardless of how people vote, the most important thing is that they VOTE. You don
            {'’'}
            t have to be involved with politics to boost civic engagement.
            {' '}
            There are easy, appropriate ways for every organization or business to help increase voter participation:
          </Description>
          <Description>
            <Bold>Help your staff, customers or members get easy, accurate, and helpful information about voting. </Bold>
          </Description>
          <Description>
            (GET STARTED)
          </Description>
        </Section>
        <Section variant="dark" rounded>
          <SectionTitle>
            <SectionTitleBold>Unbiased</SectionTitleBold>
            {' '}
            Ballot Guide for Voters
          </SectionTitle>
          <DescriptionContainer>
            <DescriptionLeftColumn>
              <Description>
                There are many reasons why millions of people don
                {'\''}
                t vote. One of the culprits is lack of access to unbiased information
                {' '}
                to help citizens decide know who to vote for. While opinions on elections in the U.S. can be an intimidating topic to bring up,
                {' '}
                <Bold>one thing we can all agree on is how important it is to vote!</Bold>
              </Description>
            </DescriptionLeftColumn>
            <DescriptionImageColumn>
              <Image src={cordovaDot('/img/welcome/WelcomeForVoters-Ballot-20190507.png')} />
            </DescriptionImageColumn>
          </DescriptionContainer>
        </Section>
        <Section>
          <SectionTitle>
            For
            {' '}
            <SectionTitleBold>Non-Partisan Organizations</SectionTitleBold>
          </SectionTitle>
          <Description>
            As a
            {' '}
            <Bold>nonpartisan partner</Bold>
            , your organization or business can customize and share a branded landing page with unique URLs to bring in supporters.
            {' '}
            From there your supporters can view their ballot, adding private settings and endorsement compilations to make decisions.
          </Description>
          <Description>
            As a nonpartisan
            {' '}
            <Bold>turnout partner</Bold>
            , you can empower your supporters to share this resource with
            {' '}
            <i>their</i>
            {' '}
            most relevant social networks,
            {' '}
            and gather more fans and kudos for your help in increasing turnout and voter confidence.
          </Description>
          <Description>
            (HOW IT WORKS BUTTON)
          </Description>
        </Section>
        <Section variant="dark" rounded>
          <SectionTitle>
            <SectionTitleBold>Voting Should be Simple</SectionTitleBold>
          </SectionTitle>
          <DescriptionContainer>
            <DescriptionLeftColumn>
              <Description>
                We Vote is a free, easy tool that allows voters to geolocate their specific ballot, and then plan who to vote for using easy visual guides.
                {' '}
                Voters can customize their own ballot to display endorsements they trust from friends and organizations.
                {' '}
                Using We Vote, voters can now confidently plan out their whole ballot in six minutes or less.
              </Description>
              <Description>
                It has never been easier. Now, we need your help to spread the word!
                {' '}
              </Description>
              <Description>
                (GET STARTED BUTTON)
              </Description>
            </DescriptionLeftColumn>
            <DescriptionImageColumn>
              <Image src={cordovaDot('/img/welcome/organization-landing-page.png')} />
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
        </Section>
        <Section>
          <SectionTitle>
            Partnering with
            {' '}
            <SectionTitleBold>We Vote</SectionTitleBold>
          </SectionTitle>
          <Description>
            We also offer advanced (paid) partnership opportunities to customize or expand your reach.
            {' '}
            Promoting WeVote.US to your audiences is a legal, helpful, and
            {' '}
            <Bold>
              neutral way for businesses and nonpartisan organizations to assist with increasing voter turnout
            </Bold>
            {' '}
            without the risks of telling people who to vote for.
          </Description>
          <Description>
            Our team can partner with your brand to configure a customized landing page for you to share with members,
            {' '}
            add a We Vote widget to your website, assist in messaging to launch the partnership, drive additional traffic, or provide analytics.
            {' '}
            (LEARN MORE)
          </Description>
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

export default withStyles(styles)(WelcomeForOrganizations);
