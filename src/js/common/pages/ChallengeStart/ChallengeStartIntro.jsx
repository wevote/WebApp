import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import { OuterWrapper, PageWrapper, StepNumberBordered, StepNumberPlaceholder } from '../../components/Style/stepDisplayStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import { publicFigureQuotes } from '../../constants/whyVoteQuotes';
import WhyVoteQuote from '../../../components/Remind/WhyVoteQuote';


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
    return (
      <div>
        <PageContentContainer>
          <Helmet title={`Start a Challenge - ${chosenWebsiteName}`} />
          <PageWrapper>
            <OuterWrapper>
              {siteConfigurationHasBeenRetrieved && (
                <InnerWrapper>
                  <ContentTitle>
                    Help energize elections!
                  </ContentTitle>
                  <ChallengeStartSectionWrapper>
                    <ChallengeStartSection>
                      <TitleRow>
                        <Dot><StepNumberBordered>1</StepNumberBordered></Dot>
                        <StepTitle>Your why?</StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          We recognize you have a tremendously busy schedule. As you consider embracing our mission:
                          Democracy is fundamental to your freedom to express yourself, your creativity, and your opinion. Protecting these rights are important.
                          Powerful people spend millions to deceive your friends and followers to stay home, or worse, make misinformed decisions against their own interests.
                        </StepText>
                      </ContentRow>

                      <TitleRow>
                        <Dot><StepNumberBordered>2</StepNumberBordered></Dot>
                        <StepTitle>You can increase participation</StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          Help your friends and followers make choices that align with their hopes, dreams, and values across the entire ballot.
                          WeVote.US has tools to help engage directly with friends via text and email, more broadly via social media, or with other WeVote.US voters.
                        </StepText>
                      </ContentRow>

                      <TitleRow>
                        <Dot><StepNumberBordered>3</StepNumberBordered></Dot>
                        <StepTitle>Person-to-person persuasion is effective</StepTitle>
                      </TitleRow>
                      <ContentRow>
                        <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                        <StepText>
                          You can make a difference by reminding your friends and followers about the upcoming election. The more of your friends who vote, the more impact you will have on the outcome of the election.
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
  margin-bottom: 60px !important;
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
