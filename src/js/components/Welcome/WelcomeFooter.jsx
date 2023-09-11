import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const appStoreIcon = '../../../img/global/logos/download_on_the_app_store_badge_us-uk_blk.svg';
const googlePlayIcon = '../../../img/global/logos/google-play-badge-cropped.png';


class WelcomeFooter extends Component {
  render () {
    const { classes } = this.props;
    return (
      <Wrapper>
        <Top>
          <LinksContainer>
            <Column>
              <ColumnTitle>How it Works</ColumnTitle>
              <Link id="footerLinkForVoters" className={classes.link} to="/how/for-voters">For Voters</Link>
              <Link id="footerLinkForOrganizations" className={classes.link} to="/how/for-organizations">For Organizations</Link>
              <Link id="footerLinkForCampaigns" className={classes.link} to="/how/for-campaigns">For Campaigns</Link>
              <Link id="footerLinkForPricing" className={classes.link} to="/more/pricing">Pricing</Link>
            </Column>
            <Column>
              <ColumnTitle>Elections</ColumnTitle>
              <Link id="footerLinkSupportedElections" className={classes.link} to="/more/elections">Supported Elections</Link>
              {isWebApp() ?
                <Link id="footerLinkRegisterToVote" className={classes.link} to="/more/register">Register to Vote</Link> : (
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite linkIdAttribute="registerToVoter" className={classes.link} url="https://register.vote.org/?partner=111111&campaign=free-tools" target="_blank" body={(<span>Register to Vote</span>)} />
                  </Suspense>
                )}
              {isWebApp() ?
                <Link id="footerLinkGetYourAbsenteeBallot" className={classes.link} to="/more/absentee">Get Your Absentee Ballot</Link> : (
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite linkIdAttribute="getYourAbsenteeBallot" className={classes.link} url="https://absentee.vote.org/?partner=111111&campaign=free-tools" target="_blank" body={(<span>Get Your Absentee Ballot</span>)} />
                  </Suspense>
                )}
              <Link id="footerLinkSeeYourBallot" className={classes.link} to="/ballot">See Your Ballot</Link>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite linkIdAttribute="pollingPlaceLocator" className={classes.link} url="https://gttp.votinginfoproject.org/" target="_blank" body={(<span>Polling Place Locator</span>)} />
              </Suspense>
              <Link id="footerLinkFreeOnlineTools" className={classes.link} to="/settings/tools">Free Online Tools</Link>
              <Link id="footerLinkPremiumOnlineTools" className={classes.link} to="/settings/tools">Premium Online Tools</Link>
            </Column>
            <Column>
              <ColumnTitle>About We Vote</ColumnTitle>
              <Link id="footerLinkAbout" className={classes.link} to="/about">About &amp; Team</Link>
              <Link id="footerLinkCredits" className={classes.link} to="/more/credits">Credits &amp; Thanks</Link>
              {isWebApp() && (
                <Link id="footerLinkDonate" className={classes.link} to="/donate">Donate</Link>
              )}
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkBlog"
                  url="https://blog.wevote.us/"
                  target="_blank"
                  body={(
                    <span>Blog</span>
                  )}
                  className={classes.link}
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkMediaInquiries"
                  url="https://help.wevote.us/hc/en-us/requests/new"
                  target="_blank"
                  body={(
                    <span>Media Inquiries</span>
                  )}
                  className={classes.link}
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkCareers"
                  url="https://wevote.applytojob.com/apply"
                  target="_blank"
                  body={(
                    <span>Volunteer</span>
                  )}
                  className={classes.link}
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkJoinOurNewsletter"
                  url="https://eepurl.com/cx_frP"
                  target="_blank"
                  body={(
                    <span>Join Our Newsletter</span>
                  )}
                  className={classes.link}
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkFacebook"
                  url="https://www.facebook.com/WeVoteUSA/"
                  target="_blank"
                  body={(
                    <span>Facebook - WeVoteUSA</span>
                  )}
                  className={classes.link}
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkTwitter"
                  url="https://twitter.com/WeVote"
                  target="_blank"
                  body={(
                    <span>Twitter - @WeVote</span>
                  )}
                  className={classes.link}
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkInstagram"
                  url="https://instagram.com/WeVote"
                  target="_blank"
                  body={(
                    <span>Instagram - @WeVote</span>
                  )}
                  className={classes.link}
                />
              </Suspense>
            </Column>
            <Column>
              <ColumnTitle>Support</ColumnTitle>
              <Link id="footerLinkFAQ" className={classes.link} to="/more/faq">Frequent Questions</Link>
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkWeVoteHelp"
                  url="https://help.wevote.us/hc/en-us"
                  target="_blank"
                  body={(
                    <span>We Vote Help</span>
                  )}
                  className={classes.link}
                />
              </Suspense>
              <Link id="footerLinkPrivacy" className={classes.link} to="/more/privacy">Privacy Policy</Link>
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/more/terms">Terms of Service</Link>
              <Link id="footerLinkAttributions" className={classes.link} to="/more/attributions">Attributions</Link>
            </Column>
          </LinksContainer>
          <OptionsContainer>
            <Button
              variant="outlined"
              classes={{ root: classes.buttonOutlined }}
              id="footerLinkGetStarted"
              onClick={() => historyPush('/ready')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              classes={{ root: classes.buttonOutlined }}
              onClick={() => window.open('https://help.wevote.us/hc/en-us/requests/new', '_blank')}
            >
              Contact Sales
            </Button>
          </OptionsContainer>
        </Top>
        <Bottom>
          <Text>WeVote.US is brought to you by a partnership between two registered nonprofit organizations, one 501(c)(3) and one 501(c)(4). We do not support or oppose any political candidate or party.</Text>
          <Text>
            The software that powers We Vote is
            {' '}
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkOpenSource"
                url="https://github.com/WeVote"
                target="_blank"
                body={(
                  <span>open source</span>
                )}
                className={classes.bottomLink}
              />
            </Suspense>
            .
          </Text>
          <BadgeContainer>
            <span
              role="presentation"
            >
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="googleBadge"
                  className={classes.link}
                  url="https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US"
                  target="_blank"
                  body={(
                    <img
                      alt="Google Play Store badge"
                      src={normalizedImagePath(googlePlayIcon)}
                      className={classes.badgeIcon}
                    />
                  )}
                />
              </Suspense>
            </span>
            <span
              role="presentation"
            >
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="appleBadge"
                  className={classes.link}
                  url="https://apps.apple.com/us/app/we-vote-voter-guide/id1347335726"
                  target="_blank"
                  body={(
                    <img
                      alt="Apple App Store badge"
                      src={normalizedImagePath(appStoreIcon)}
                      className={classes.appleBadgeIcon}
                    />
                  )}
                />
              </Suspense>
            </span>
          </BadgeContainer>
        </Bottom>
      </Wrapper>
    );
  }
}
WelcomeFooter.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonOutlined: {
    height: 50,
    borderRadius: 32,
    color: 'white',
    border: '3px solid white',
    marginBottom: '1em',
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      padding: '8px 0',
      border: '1.5px solid white',
      height: 40,
    },
    [theme.breakpoints.down('sm')]: {
      width: '47%',
      fontSize: 12,
      border: '1px solid white',
    },
  },
  badgeIcon: {
    width: 200,
    height: 60,
    marginRight: '.5em',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: 175,
      height: 53,
    },
    [theme.breakpoints.down('xs')]: {
      width: 150,
      height: 45,
      marginRight: '.2em',
    },
  },
  appleBadgeIcon: {
    width: 179,
    marginLeft: '.5em',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: 160,
    },
    [theme.breakpoints.down('xs')]: {
      width: 135,
      marginLeft: '.2em',
    },
  },
  link: {
    color: 'rgb(255, 255, 255, .6)',
    fontSize: 13,
    marginBottom: '1em',
    '&:hover': {
      color: 'white',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
  },
  bottomLink: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    '&:hover': {
      color: 'white',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
  },
});

const Wrapper = styled('div')(({ theme }) => (`
  color: rgb(255, 255, 255, .6) !important;
  background-image: linear-gradient(to bottom, #415a99, ${theme.colors.brandBlue});
  padding: 4em 1em 0 1em;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  ${theme.breakpoints.down('md')} {
    padding-top: 2em;
  }
`));

const Top = styled('div')(({ theme }) => (`
  width: 960px;
  max-width: 90vw;
  display: flex;
  flex-flow: row;
  ${theme.breakpoints.down('md')} {
    flex-flow: column-reverse;
  }
`));

const LinksContainer = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: row;
  width: 75%;
  justify-content: space-between;
  ${theme.breakpoints.down('md')} {
    flex-flow: column;
    width: 100%;
  }
`));

const Column = styled('div')(({ theme }) => (`
  width: 150px;
  display: flex;
  flex-flow: column nowrap;
  ${theme.breakpoints.down('md')} {
    width: 100%;
  }
`));

const ColumnTitle = styled('h3')`
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin: .8em 0;
`;

const OptionsContainer = styled('div')(({ theme }) => (`
  width: 25%;
  display: flex;
  flex-flow: column;
  ${theme.breakpoints.down('md')} {
    width: 100%;
    flex-flow: row;
    justify-content: space-between;
  }
`));

const BadgeContainer = styled('div')`
  width: 100%;
  margin-top: 4em;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
`;


const Bottom = styled('div')`
  width: 750px;
  max-width: 90vw;
  display: flex;
  flex-flow: column;
  padding: 3em 0;
  text-align: center;
`;

const Text = styled('p')(({ theme }) => (`
  font-size: 12px;
  ${theme.breakpoints.down('md')} {
    font-size: 16px;
  }
`));

export default withStyles(styles)(WelcomeFooter);
