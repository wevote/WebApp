import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';
import lookupPageNameAndPageTypeDict from '../../utils/lookupPageNameAndPageTypeDict';

const BallotElectionListWithFilters = React.lazy(() => import(/* webpackChunkName: 'BallotElectionListWithFilters' */ '../Ballot/BallotElectionListWithFilters'));
const DeleteAllContactsButton = React.lazy(() => import(/* webpackChunkName: 'DeleteAllContactsButton' */ '../SetUpAccount/DeleteAllContactsButton'));
const FooterCandidateList = React.lazy(() => import(/* webpackChunkName: 'FooterCandidateList' */ './FooterCandidateList'));

class FooterMainWeVote extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterContactEmailListCount: 0,
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
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    this.setState({
      voterContactEmailListCount,
    });
  }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);

    const { location: { pathname: currentPathname } } = window;
    const page = lookupPageNameAndPageTypeDict(currentPathname);
    TagManager.dataLayer({
      dataLayer: {
        event: 'click',
        pageDetails: {
          pageType: page.pageType,
          pageName: page.pageName,
          pathname: currentPathname,
        },
        destinationDetails: {
          destinationPageType: page.pageType,
          destinationPageName: 'HowItWorksModal',
          destinationPathname: currentPathname,
        },
      },
    });
  }

  pushDataLayer (destinationPath) {
    const { location: { pathname: currentPathname } } = window;
    const page = lookupPageNameAndPageTypeDict(currentPathname);
    const destinationPage = lookupPageNameAndPageTypeDict(destinationPath);

    TagManager.dataLayer({
      dataLayer: {
        event: 'click',
        pageDetails: {
          pageType: page.pageType,
          pageName: page.pageName,
          pathname: currentPathname,
        },
        destinationDetails: {
          destinationPageType: destinationPage.pageType,
          destinationPageName: destinationPage.pageName,
          destinationPathname: destinationPath,
        },
      },
    });
  }

  render () {
    const { classes } = this.props;
    const { voterContactEmailListCount } = this.state;
    // const helpDestinationPage = lookupPageNameAndPageTypeDict("https://help.wevote.us/hc/en-us");
    return (
      <Wrapper>
        {isWebApp() && (
          <SearchEngineOptimizationSection>
            <SearchEngineOptimizationRow>
              <SearchEngineOptimizationColumn>
                <Suspense fallback={<></>}>
                  <BallotElectionListWithFilters
                    ballotBaseUrl="/ballot"
                    hideUpcomingElectionTitle
                    showSimpleDisplay
                    showSimpleModeTitle
                    stateToShow="all"
                  />
                </Suspense>
              </SearchEngineOptimizationColumn>
              <SearchEngineOptimizationColumn>
                <Suspense fallback={<></>}>
                  <FooterCandidateList />
                </Suspense>
              </SearchEngineOptimizationColumn>
              <SearchEngineOptimizationColumn className="u-show-desktop-tablet">
                <Suspense fallback={<></>}>
                  <BallotElectionListWithFilters
                    ballotBaseUrl="/ballot"
                    hideUpcomingElectionTitle
                    showSimpleDisplay
                    showSimpleModeTitle
                    stateToShow="all"
                    voterGuidesMode
                  />
                </Suspense>
              </SearchEngineOptimizationColumn>
            </SearchEngineOptimizationRow>
          </SearchEngineOptimizationSection>
        )}
        <TopSectionOuterWrapper>
          <TopSectionInnerWrapper>
            <OneRow>
              <button type="button" style={{ border: 'none', backgroundColor: 'transparent', padding: '0' }} id="footerLinkHowItWorks" className={classes.onClickDiv} onClick={this.openHowItWorksModal}>How It Works</button>
              <RowSpacer />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                className={classes.link}
                // destinationPageName={helpDestinationPage.pageName}
                // destinationPageType={helpDestinationPage.pageType}
                trackingOn
                body={(<span>Help</span>)}
              />
              <RowSpacer />
              <Link id="footerLinkPrivacy" className={classes.link} to="/privacy" onClick={() => this.pushDataLayer('/privacy')}>Privacy</Link>
              <RowSpacer />
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/more/terms" onClick={() => this.pushDataLayer('/more/terms')}>Terms</Link>
            </OneRow>
            <OneRow>
              {isWebApp() ? (
                <>
                  <Link id="footerLinkAboutFAQ" to="/more/faq" className={classes.link} onClick={() => this.pushDataLayer('/more/faq')}>
                    About &amp; FAQ
                  </Link>
                  <RowSpacer />
                  <OpenExternalWebSite
                    linkIdAttribute="footerLinkTeam"
                    url={`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/about`}
                    target="_blank"
                    trackingOn
                    body={(<span>Team</span>)}
                    className={classes.link}
                  />
                  <RowSpacer />
                  <OpenExternalWebSite
                    linkIdAttribute="footerLinkCredits"
                    url={`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/credits`}
                    target="_blank"
                    trackingOn
                    body={(<span>Credits &amp; Thanks</span>)}
                    className={classes.link}
                  />
                </>
              ) : (
                <>
                  <Link to="/more/faq" className={classes.link} onClick={() => this.pushDataLayer('/more/faq')}>Frequently Asked Questions</Link>
                  <RowSpacer />
                  <Link to="/more/attributions" className={classes.link} onClick={() => this.pushDataLayer('/more/attributions')}>Attributions</Link>
                </>
              )}
            </OneRow>
            {isWebApp() && (
              <OneRow>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkVolunteer"
                  url="https://wevote.applytojob.com/apply"
                  target="_blank"
                  trackingOn
                  body={(<span>Volunteering Opportunities</span>)}
                  className={classes.link}
                />
                <RowSpacer />
                <Link
                  className={classes.link}
                  id="footerMainLinkDonate"
                  to="/donate"
                  onClick={() => this.pushDataLayer('/donate')}
                >
                  Donate
                </Link>
              </OneRow>
            )}
          </TopSectionInnerWrapper>
        </TopSectionOuterWrapper>
        <BottomSection>
          <Text id="weVoteFooterText">
            <WeVoteName>
              WeVote
            </WeVoteName>
            {' '}
            is a nonpartisan nonprofit.
            <br />
            We do not support or oppose any political party or candidate.
          </Text>
          <>
            {(voterContactEmailListCount > 0) && (
              <DeleteAllContactsWrapper>
                <Suspense fallback={<></>}>
                  <DeleteAllContactsButton textSizeSmall />
                </Suspense>
              </DeleteAllContactsWrapper>
            )}
          </>
        </BottomSection>
      </Wrapper>
    );
  }
}
FooterMainWeVote.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  link: {
    color: '#5E5E5B',
    '&:hover': {
      color: '#5E5E5B',
    },
    textDecoration: 'none',
  },
  bottomLink: {
    color: '#333',
    textDecoration: 'none',
    '&:hover': {
      color: '#5E5E5B',
    },
  },
  onClickDiv: {
    color: '#5E5E5B',
    cursor: 'pointer',
    '&:hover': {
      color: '#5E5E5B',
      textDecoration: 'underline',
    },
  },
});

const BottomSection = styled('div')`
  display: flex;
  flex-flow: column;
  padding-top: 15px;
  align-items: center;
`;

const DeleteAllContactsWrapper = styled('div')`
  margin-top: 0;
`;

const OneRow = styled('div')`
  color: #808080;
  display: flex;
  // font-size: 13px;
  justify-content: center;
  margin-bottom: 15px;
`;

const RowSpacer = styled('div')`
  margin-right: 15px;
`;

const SearchEngineOptimizationColumn = styled('div')`
  margin-right: 12px;
`;

const SearchEngineOptimizationRow = styled('div')`
  display: flex;
  justify-content: space-evenly;
`;

const SearchEngineOptimizationSection = styled('div')`
  display: flex;
  flex-flow: column;
  margin-bottom: 84px;
  align-items: center;
`;

const Text = styled('p')(({ theme }) => (`
  color: #5E5E5B;
  font-size: 14px;
  margin-right: 0.5em;
  text-align: center;
  ${theme.breakpoints.down('md')} {
    font-size: 14px;
  }
`));

const TopSectionInnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const TopSectionOuterWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const WeVoteName = styled('span')`
  font-weight: 600;
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(FooterMainWeVote);
