import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Title, BlueTitle, SubTitle } from '../components/Welcome/Header';
import Section, {
  SectionTitle,
  DescriptionContainer,
  DescriptionLeftColumn,
  DescriptionImageColumn,
  Description,
  Image,
  NetworkContainer,
  NetworkImage,
  SectionTitleBold,
} from '../components/Welcome/Section';
import WelcomeAppbar from '../components/Navigation/WelcomeAppbar';
import Footer from '../components/Welcome/Footer';
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

    const testimonialAuthor = 'Alissa Blackman, Org.org';
    const imageUrl = cordovaDot('/img/global/photos/Neelam_Joshi-200x200.jpg');
    const testimonial = 'This is a great tool! For our campaign, We Vote combines ' +
      'the super-efficient results we see with relational organizing through a ' +
      'smart platform that allows voters to plan their whole ballot. ' +
      'I loved the premium analytics that showed our reach, and so did my boss!';
    return (
      <Wrapper>
        <Helmet title="Welcome Campaigns - We Vote" />
        <WelcomeAppbar pathname={pathname} />
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
            <HeaderStep>
              <Button
                variant="contained"
                color="primary"
                classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
              >
                Get Started
              </Button>
            </HeaderStep>
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
                experience with their friends and family on Facebook, Twitter, email and SMS.
              </Description>
              <FeatureStep>
                <FeatureStepLabel>
                  <FeatureBlueTitle>Free: </FeatureBlueTitle>
                  Make sure everyone can see your endorsements
                </FeatureStepLabel>
              </FeatureStep>
              <Description>
                We Vote compiles endorsement data for all candidates in all states up and down
                {' '}
                the ballot, so begin adding your endorsements to get more views. Claim your free
                {' '}
                We Vote profile today and add your endorsements, values, and branding anytime.
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
              <Description>
                <Button
                  variant="contained"
                  color="primary"
                  classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                  onClick={() => historyPush('/how/for-campaigns')}
                >
                  How it Works For Campaigns
                </Button>
              </Description>
            </DescriptionLeftColumn>
            <DescriptionImageColumn>
              <Image src={cordovaDot('/img/welcome/WelcomeForCampaigns-SierraClubScreenShot-20190507.png')} />
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
              <Image src={cordovaDot('/img/welcome/WelcomeForVoters-Ballot-20190507.png')} />
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
              <Description>
                <Button
                  variant="contained"
                  color="primary"
                  classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
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
        <Section variant="dark" rounded={!isVoterSignedIn}>
          <SectionTitle>Our Network</SectionTitle>
          <NetworkContainer>
            <NetworkImage src={cordovaDot('/img/welcome/partners/google-logo.png')} alt="Google" />
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

const HeaderSection = styled.div`
  display: flex;
  flex-flow: column;
  padding: 2em 1em 3em 1em;
  text-align: center;
  align-items: center;
  color: #333;
  width: 100%;
`;

const HeaderForCampaigns = styled.div`
  position: relative;
  height: 530px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 530px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 530px;
  }
`;

const HeaderStep = styled.div`
  display: flex;
  flex-flow: row nowrap;
  font-size: 18px;
  padding: 8px;
  background: rgb(65, 81, 118);
  width: 400px;
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const HeaderStepNumber = styled.div`
  width: 24px;
  height: 24px;
  background: white;
  color: ${props => props.theme.colors.brandBlue};
  border-radius: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 24px;
    height: 24px;
    min-width: 24px;
  }
`;

const HeaderStepLabel = styled.p`
  font-weight: bold;
  color: white;
  margin: 0 .7rem;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: auto .7rem;
  }
`;

const FeatureStep = styled.div`
  display: flex;
  flex-flow: row nowrap;
  font-size: 18px;
  padding: 8px;
  background: rgb(216, 221, 232);
  width: 600px;
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const FeatureStepLabel = styled.p`
  font-weight: bold;
  margin: 0 .7rem;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: auto .7rem;
  }
`;

const FeatureBlueTitle = styled.span`
  color: rgb(6, 33, 79);
`;

export default withStyles(styles)(WelcomeForCampaigns);
