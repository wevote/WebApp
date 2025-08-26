import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import TagManager from 'react-gtm-module';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

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
    const currentPageDetails = getPageDetails();

    const dataLayerObject = {
      actionDetails: {
        actionType: 'openModal',
        buttonId: 'footerLinkHowItWorks',
      },
      event: 'action',
      pageDetails: currentPageDetails,
      destinationDetails: {
        destinationPageName: 'HowItWorksModal',
        destinationPageType: currentPageDetails.pageType, // Use current page's pageType for modals
        destinationPathname: currentPathname, // Use current pathname since modal doesn't navigate
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  pushDataLayer (destinationPath, buttonId = '') {
    // For internal links only - external links are handled by OpenExternalWebSite
    const destinationPage = lookupPageNameAndPageTypeDict(destinationPath);
    const destinationPageName = destinationPage.pageName || 'notSet';
    const destinationPageType = destinationPage.pageType || 'notSet';
    const destinationPathname = destinationPath;

    const dataLayerObject = {
      actionDetails: {
        actionType: 'navigate',
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      destinationDetails: {
        destinationPageName,
        destinationPageType,
        destinationPathname,
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  render () {
    const { classes } = this.props;
    const { voterContactEmailListCount } = this.state;

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
              <button
                type="button"
                style={{ border: 'none', backgroundColor: 'transparent', padding: '0' }}
                id="footerLinkHowItWorks"
                className={classes.onClickDiv}
                onClick={this.openHowItWorksModal}
              >
                How It Works
              </button>
              <RowSpacer />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                className={classes.link}
                trackingOn
                body={(<span>Help</span>)}
              />
              <RowSpacer />
              <Link
                id="footerLinkPrivacy"
                className={classes.link}
                to="/privacy"
                onClick={() => this.pushDataLayer('/privacy', 'footerLinkPrivacy')}
              >
                Privacy
              </Link>
              <RowSpacer />
              <Link
                id="footerLinkTermsOfUse"
                className={classes.link}
                to="/more/terms"
                onClick={() => this.pushDataLayer('/more/terms', 'footerLinkTermsOfUse')}
              >
                Terms
              </Link>
            </OneRow>
            <OneRow>
              {isWebApp() ? (
                <>
                  <Link
                    id="footerLinkAboutFAQ"
                    to="/more/faq"
                    className={classes.link}
                    onClick={() => this.pushDataLayer('/more/faq', 'footerLinkAboutFAQ')}
                  >
                    About &amp; FAQ
                  </Link>
                  <RowSpacer />
                  {/* Note: Team/Credits links will show 'notSet' in local dev but work correctly in production */}
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
                  <Link
                    id="footerLinkFAQ"
                    to="/more/faq"
                    className={classes.link}
                    onClick={() => this.pushDataLayer('/more/faq', 'footerLinkFAQ')}
                  >
                    Frequently Asked Questions
                  </Link>
                  <RowSpacer />
                  <Link
                    id="footerLinkAttributions"
                    to="/more/attributions"
                    className={classes.link}
                    onClick={() => this.pushDataLayer('/more/attributions', 'footerLinkAttributions')}
                  >
                    Attributions
                  </Link>
                </>
              )}
            </OneRow>
            {isWebApp() && (
              <OneRow>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkBlog"
                  url="https://blog.wevote.us/"
                  target="_blank"
                  trackingOn
                  body={(<span>Blog</span>)}
                  className={classes.link}
                />
                <RowSpacer />
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
                  onClick={() => this.pushDataLayer('/donate', 'footerMainLinkDonate')}
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
