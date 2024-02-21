import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import AnalyticsActions from '../actions/AnalyticsActions';
import historyPush from '../common/utils/historyPush';
import { renderLog } from '../common/utils/logging';
import normalizedImagePath from '../common/utils/normalizedImagePath';
import { BlueTitle, PlayerContainer, SubTitle, Title, Video } from '../components/Welcome/headerWelcomeStyles';
import { Bold, Description, DescriptionContainer, DescriptionImageColumn, DescriptionLeftColumn, Image, NetworkContainer, NetworkImage, Section, SectionTitle, SectionTitleBold } from '../components/Welcome/sectionStyles';
import Testimonial from '../components/Widgets/Testimonial';
import AppObservableStore from '../common/stores/AppObservableStore';
import VoterStore from '../stores/VoterStore';
import cordovaScrollablePaneTopPadding from '../utils/cordovaScrollablePaneTopPadding';

const WelcomeAppbar = React.lazy(() => import(/* webpackChunkName: 'WelcomeAppbar' */ '../components/Navigation/WelcomeAppbar'));
const WelcomeFooter = React.lazy(() => import(/* webpackChunkName: 'WelcomeFooter' */ '../components/Welcome/WelcomeFooter'));

const ffwdLogo = '../../img/global/logos/ffwd-logo.png';
const googleLogo = '../../img/global/logos/google-logo.svg';
const vipLogo = '../../img/global/logos/vip-logo-1000x208.png';
const voteDotOrgLogo = '../../img/global/logos/vote_dot_org_logo-530x200.png';


class WelcomeForOrganizations extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voter: {},
      animateTextArray: ['Members', 'Staff', 'Constituents', 'Fans', 'Subscribers', 'Followers', 'Voters'],
      currentAnimateTextIndex: 0,
    };
  }

  componentDidMount () {
    // console.log('WelcomeForOrganizations componentDidMount');
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionWelcomeVisit(VoterStore.electionId());

    this.autoAnimateText();
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.timer) clearTimeout(this.timer);
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
    }
    if (isSignedIn) {
      historyPush('/settings/profile');
    } else {
      AppObservableStore.setGetStartedMode('getStartedForOrganizations');
      AppObservableStore.setShowSignInModal(true);
    }
  }

  autoAnimateText () {
    const currentStateAnimateTextIndex = this.state.currentAnimateTextIndex;
    const showMemberTextForThisLong = 2000;
    if (this.state.currentAnimateTextIndex < this.state.animateTextArray.length - 1) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setState({ currentAnimateTextIndex: currentStateAnimateTextIndex + 1 });
        this.autoAnimateText();
      }, showMemberTextForThisLong);
    }
  }

  render () {
    renderLog('WelcomeForOrganizations.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, pathname } = this.props;
    // console.log('WelcomeForOrganizations, pathname: ', pathname);
    const { voter, animateTextArray, currentAnimateTextIndex } = this.state;
    const voterIsSignedIn = voter.is_signed_in;

    const currentTitleTextToDisplay = animateTextArray[currentAnimateTextIndex];
    // console.log(currentTitleTextToDisplay);

    const testimonialAuthor = 'Judy J., Oakland, California';
    const testimonialImageUrl = normalizedImagePath('/img/global/photos/Judy_J-109x109.jpg');
    const testimonial = 'Let\'s be real: few people are reading those wonky ballot descriptions. I want deciding how to vote to be as easy and obvious as a solid Yelp review. Finally WeVote helps me plan the whole thing out way faster.';
    return (
      <WelcomeForOrganizationsWrapper>
        <Helmet title="Welcome Organizations - WeVote" />
        <Suspense fallback={<></>}>
          <WelcomeAppbar pathname={pathname} id="WelcomeForOrganizations_WelcomeAppbar" />
        </Suspense>
        <HeaderForOrganizations>
          <Title>
            Supercharge Your
            <BlueTitle>{` ${currentTitleTextToDisplay}`}</BlueTitle>
          </Title>
          <SubTitle>Only 6 out of 10 eligible voters are predicted to cast a ballot this year.</SubTitle>
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
              You don&apos;t have to be involved with politics to boost civic engagement.
              {' '}
              There are easy, appropriate ways for every organization or business to increase voter participation:
            </Description>
            <Description>
              <Bold>
                Help your staff, customers or members get accurate, helpful information about what&apos;s on their ballot.
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
                find their polling location, and use WeVote tools to confidently make voting decisions.
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
              <Image src={normalizedImagePath('/img/welcome/WelcomeForOrganizations-YourLogoScreenShot.png')} />
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
              <Image src={normalizedImagePath('/img/welcome/WelcomeForOrganizations-PollingLocationScreenShot.png')} />
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
            WeVote
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
              add a WeVote widget to your website, assist in messaging to launch the partnership, drive additional traffic, or provide analytics. Learn more!
            </Description>
            <Description className="u_margin-center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.goldButton}
                classes={{ root: classes.buttonMaxWidth, containedPrimary: classes.buttonContained }}
                id="welcomeForOrganizationsPricing"
                onClick={() => historyPush('/more/pricing/organizations')}
              >
                View Pricing
              </Button>
            </Description>
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
      </WelcomeForOrganizationsWrapper>
    );
  }
}
WelcomeForOrganizations.propTypes = {
  classes: PropTypes.object,
  pathname: PropTypes.string,
};

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

const WelcomeForOrganizationsWrapper = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
  padding-top: ${cordovaScrollablePaneTopPadding()};
`;

const HeaderForOrganizations = styled('div')(({ theme }) => (`
  position: relative;
  height: 590px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  ${theme.breakpoints.down('md')} {
    height: 450px;
  }
  ${theme.breakpoints.down('xs')} {
    height: 380px;
  }
`));

const SectionTitleBoldGold = styled('span')`
  color: rgb(219, 179, 86);
  font-weight: bold;
`;

export default withStyles(styles)(WelcomeForOrganizations);
