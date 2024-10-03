import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import { OuterWrapper, PageWrapper, StepNumberBordered, StepNumberPlaceholder } from '../../components/Style/stepDisplayStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import { publicFigureQuotes } from '../../constants/whyVoteQuotes';
import WhyVoteQuote from '../../../components/Remind/WhyVoteQuote';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../components/Widgets/ReadMore'));


class ChallengeStartIntro extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenDomainTypeIsChallenge: false,
      chosenWebsiteName: '',
      inPrivateLabelMode: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('ChallengeSupportSteps, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenDomainTypeIsChallenge = AppObservableStore.getChosenDomainTypeIsChallenge();
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      chosenDomainTypeIsChallenge,
      chosenWebsiteName,
      inPrivateLabelMode,
      siteConfigurationHasBeenRetrieved,
    });
  }

  nextStep = () => {
    historyPush('/start-a-challenge-add-title');
  }

  render () {
    renderLog('ChallengeStartIntro');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenDomainTypeIsChallenge, chosenWebsiteName, inPrivateLabelMode, siteConfigurationHasBeenRetrieved } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    const step1Text = 'We get it—life is busy, and your calendar is packed. But you care about our Democracy. It is what allows your voice, creativity, and opinions to be heard. You, your friends, your community - these are all voices that matter, that should be counted. Join us in making our Democracy stronger for everyone.';
    const step2Text = 'Help your friends and followers! We’re not just choosing our next President, but selecting leaders who will empower hopes, dreams, and values up and down the entire ballot! WeVote has taken the guesswork out of Democracy - giving everyone the tools to make informed choices. Through social posts, texts, DMs, and emails - you can connect your friends and followers directly to their individual ballot box. And we’ve made it fun. Earn points on the leaderboard, and when your followers engage, you get extra credit!';
    const step3Text = 'By reminding your friends and followers about the upcoming election, people who share your concerns for our country, you have the power to shape our future. The more people you reach, the bigger impact you’ll have on the outcome. It’s simple—every reminder counts, and your voice can help shape the future!';
    return (
      <div>
        <PageContentContainer>
          <Helmet title={`Start a Challenge - ${chosenWebsiteName}`} />
          <PageWrapper>
            <OuterWrapper>
              {siteConfigurationHasBeenRetrieved && (
                <InnerWrapper>
                  <ContentTitle>
                    Influence Your Democracy
                  </ContentTitle>
                  <ChallengeStartSectionWrapper>
                    <ChallengeStartSection>
                      <TitleRow>
                        <Dot><StepNumberBordered>1</StepNumberBordered></Dot>
                        <StepTitle>Why you?</StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          <Suspense fallback={<></>}>
                            <ReadMore numberOfLines={4} textToDisplay={step1Text} />
                          </Suspense>
                        </StepText>
                      </ContentRow>

                      <TitleRow>
                        <Dot><StepNumberBordered>2</StepNumberBordered></Dot>
                        <StepTitle>Connecting your community </StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          <Suspense fallback={<></>}>
                            <ReadMore numberOfLines={4} textToDisplay={step2Text} />
                          </Suspense>
                        </StepText>
                      </ContentRow>

                      <TitleRow>
                        <Dot><StepNumberBordered>3</StepNumberBordered></Dot>
                        <StepTitle>You can make the difference</StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          <Suspense fallback={<></>}>
                            <ReadMore numberOfLines={4} textToDisplay={step3Text} />
                          </Suspense>
                        </StepText>
                      </ContentRow>

                      {inPrivateLabelMode && (
                        <>
                          <TitleRow>
                            <Dot><StepNumberBordered>4</StepNumberBordered></Dot>
                            <StepTitle>Our Approval Process</StepTitle>
                          </TitleRow>
                          <ContentRow>
                            <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                            <StepText>
                              Your challenge will appear on
                              {' '}
                              {chosenWebsiteName}
                              {' '}
                              as soon as it has been reviewed and approved. In the meantime, you will be able to see your challenge on Challenges.WeVote.US.
                            </StepText>
                          </ContentRow>
                        </>
                      )}

                      <DesktopButtonWrapper className="u-show-desktop-tablet">
                        <DesktopButtonPanel>
                          <Button
                            classes={{ root: classes.buttonDesktop }}
                            color="primary"
                            id="challengeStartButton"
                            onClick={this.nextStep}
                            variant="contained"
                          >
                            Got it! I&apos;m ready to create my challenge
                          </Button>
                        </DesktopButtonPanel>
                      </DesktopButtonWrapper>
                    </ChallengeStartSection>
                  </ChallengeStartSectionWrapper>
                  <WhyVoteQuoteBlockOuterWrapper>
                    <WhyVoteQuoteBlock>
                      {publicFigureQuotes.map((oneQuote) => (
                        <WhyVoteQuote
                          key={`whyVoteQuote-${oneQuote.testimonialAuthor}`}
                          imageUrl={oneQuote.imageUrl}
                          testimonial={oneQuote.testimonial}
                          testimonialAuthor={oneQuote.testimonialAuthor}
                        />
                      ))}
                    </WhyVoteQuoteBlock>
                  </WhyVoteQuoteBlockOuterWrapper>
                </InnerWrapper>
              )}
            </OuterWrapper>
          </PageWrapper>
        </PageContentContainer>
        <MobileButtonWrapper isChallengeSite={chosenDomainTypeIsChallenge} className="u-show-mobile">
          <MobileButtonPanel>
            <Button
              classes={{ root: mobileButtonClasses }}
              color="primary"
              id="challengeStartButtonFooter"
              onClick={this.nextStep}
              variant="contained"
            >
              Got it! I&apos;m ready to create
            </Button>
          </MobileButtonPanel>
        </MobileButtonWrapper>
      </div>
    );
  }
}
ChallengeStartIntro.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '14px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      fontSize: '15px',
    },
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    fontSize: '14px',
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDesktop: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonRoot: {
    width: 250,
  },
});

const ChallengeStartSection = styled('div')`
  margin-bottom: 40px !important;
  max-width: 450px;
`;

const ChallengeStartSectionWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const ContentRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

const DesktopButtonPanel = styled('div')`
  background-color: #fff;
  padding: 10px 0;
`;

const DesktopButtonWrapper = styled('div')`
  width: 100%;
  display: block;
  margin: 30px 0;
`;

const Dot = styled('div')(({ theme }) => (`
  align-self: center;
  display: block;
  padding-top: 2px;
  text-align: center;
  ${theme.breakpoints.down('md')} {
    padding-top: 3px;
  }
`));

const InnerWrapper = styled('div')`
`;

const MobileButtonPanel = styled('div')`
  background-color: #fff;
  border-top: 1px solid #ddd;
  margin: 0;
  padding: 10px;
`;

export const MobileButtonWrapper = styled('div', {
  shouldForwardProp: (prop) => !['isChallengeSite'].includes(prop),
})(({ isChallengeSite }) => (`
  ${isChallengeSite ? 'bottom: 0;' : 'bottom: 57px;'}
  display: block;
  position: fixed;
  width: 100%;
  z-index: 9001 !important;
`));

const StepText = styled('div')(({ theme }) => (`
  color: #555;
  font-size: 16px;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  ${theme.breakpoints.down('sm')} {
    font-size: 16px;
    padding: 0 12px;
  }
`));

const StepTitle = styled('div')(({ theme }) => (`
  font-size: 20px;
  font-weight: 500;
  padding: 0 8px;
  text-align: left;
  ${theme.breakpoints.down('sm')} {
    font-size: 17px;
  }
`));

const TitleRow = styled('div')`
  align-content: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-top: 14px;
`;

const WhyVoteQuoteBlock = styled('div')`
  max-width: 450px;
`;

const WhyVoteQuoteBlockOuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 68px;
  width: 100%;
`;

export default withStyles(styles)(ChallengeStartIntro);
