import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { historyPush, isWebApp } from '../../utils/cordovaUtils';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';


class WelcomeFooter extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

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
                <Link id="footerLinkRegisterToVote" className={classes.link} to="/more/register">Register to Vote</Link> :
                <OpenExternalWebSite className={classes.link} url="https://register.vote.org/?partner=111111&campaign=free-tools" target="_blank" body={(<span>Register to Vote</span>)} />
              }
              {isWebApp() ?
                <Link id="footerLinkGetYourAbsenteeBallot" className={classes.link} to="/more/absentee">Get Your Absentee Ballot</Link> :
                <OpenExternalWebSite className={classes.link} url="https://absentee.vote.org/?partner=111111&campaign=free-tools" target="_blank" body={(<span>Get Your Absentee Ballot</span>)} />
              }
              <Link id="footerLinkSeeYourBallot" className={classes.link} to="/ballot">See Your Ballot</Link>
              <OpenExternalWebSite className={classes.link} url="https://gttp.votinginfoproject.org/" target="_blank" body={(<span>Polling Place Locator</span>)} />
              <Link id="footerLinkFreeOnlineTools" className={classes.link} to="/settings/tools">Free Online Tools</Link>
              <Link id="footerLinkPremiumOnlineTools" className={classes.link} to="/settings/tools">Premium Online Tools</Link>
            </Column>
            <Column>
              <ColumnTitle>About We Vote</ColumnTitle>
              <Link id="footerLinkAbout" className={classes.link} to="/more/about">About &amp; Team</Link>
              <Link id="footerLinkCredits" className={classes.link} to="/more/credits">Credits &amp; Thanks</Link>
              {isWebApp() && (
                <Link id="footerLinkDonate" className={classes.link} to="/more/donate">Donate</Link>
              )}
              <OpenExternalWebSite
                linkIdAttribute="footerLinkBlog"
                url="https://blog.wevote.us/"
                target="_blank"
                body={(
                  <span>Blog</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkMediaInquiries"
                url="https://help.wevote.us/hc/en-us/requests/new"
                target="_blank"
                body={(
                  <span>Media Inquiries</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkCareers"
                url="https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops"
                target="_blank"
                body={(
                  <span>Careers</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkJoinOurNewsletter"
                url="http://eepurl.com/cx_frP"
                target="_blank"
                body={(
                  <span>Join Our Newsletter</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkFacebook"
                url="https://www.facebook.com/WeVoteUSA/"
                target="_blank"
                body={(
                  <span>Facebook - WeVoteUSA</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkTwitter"
                url="https://twitter.com/WeVote"
                target="_blank"
                body={(
                  <span>Twitter - @WeVote</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column>
              <ColumnTitle>Support</ColumnTitle>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                body={(
                  <span>We Vote Help</span>
                )}
                className={classes.link}
              />
              <Link id="footerLinkPrivacy" className={classes.link} to="/more/privacy">Privacy</Link>
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/more/terms">Terms of Use</Link>
              <Link id="footerLinkAttributions" className={classes.link} to="/more/attributions">Attributions</Link>
            </Column>
          </LinksContainer>
          <OptionsContainer>
            <Button
              color="default"
              variant="outlined"
              classes={{ root: classes.buttonOutlined }}
              id="footerLinkGetStarted"
              onClick={() => historyPush('/ready')}
            >
              Get Started
            </Button>
            <Button
              color="default"
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
            <OpenExternalWebSite
              linkIdAttribute="footerLinkOpenSource"
              url="https://github.com/WeVote"
              target="_blank"
              body={(
                <span>open source</span>
              )}
              className={classes.bottomLink}
            />
            .
          </Text>
        </Bottom>
      </Wrapper>
    );
  }
}

const styles = theme => ({
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

const Wrapper = styled.div`
  color: rgb(255, 255, 255, .6) !important;
  background-image: linear-gradient(to bottom, #415a99, ${({ theme }) => theme.colors.brandBlue});
  padding: 4em 1em 0 1em;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 2em;
  }
`;

const Top = styled.div`
  width: 960px;
  max-width: 90vw;
  display: flex;
  flex-flow: row;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column-reverse;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-flow: row;
  width: 75%;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column;
    width: 100%;
  }
`;

const Column = styled.div`
  width: 150px;
  display: flex;
  flex-flow: column nowrap;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const ColumnTitle = styled.h3`
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin: .8em 0;
`;

const OptionsContainer = styled.div`
  width: 25%;
  display: flex;
  flex-flow: column;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    flex-flow: row;
    justify-content: space-between;
  }
`;

const Bottom = styled.div`
  width: 750px;
  max-width: 90vw;
  display: flex;
  flex-flow: column;
  padding: 3em 0;
  text-align: center;
`;

const Text = styled.p`
  font-size: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }
`;

export default withStyles(styles)(WelcomeFooter);
