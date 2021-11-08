import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';


class FooterMainWeVote extends Component {
  componentDidMount () {
    window.scrollTo(0, 0);
  }

  render () {
    const { classes } = this.props;

    return (
      <Wrapper>
        <TopSectionOuterWrapper>
          <TopSectionInnerWrapper>
            <Column>
              <ColumnTitle>About We Vote</ColumnTitle>
              <Link id="footerLinkHowWeVoteHelps" className={classes.link} to="/more/howwevotehelps">How We Vote Helps</Link>
              <Link id="footerLinkAbout" className={classes.link} to="/more/about">About &amp; Team</Link>
              <Link id="footerLinkCredits" className={classes.link} to="/credits">Credits &amp; Thanks</Link>
              {/* <Link id="footerLinkImpact" className={classes.link} to="/impact">Impact</Link> */}
              <OpenExternalWebSite
                linkIdAttribute="footerLinkCareers"
                url="https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops"
                target="_blank"
                body={(
                  <span>Careers</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column style={{ display: `${isMobileScreenSize() ? 'none' : ''}` }}>
              <ColumnTitle>Community</ColumnTitle>
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
              <Link id="footerLinkAttributions" className={classes.link} to="/more/attributions">Attributions</Link>
            </Column>
            <Column>
              <ColumnTitle>Support</ColumnTitle>
              <Link id="footerLinkFaq" className={classes.link} to="/more/faq">Frequent Questions</Link>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                body={(
                  <span>Help</span>
                )}
                className={classes.link}
              />
              <Link id="footerLinkPrivacy" className={classes.link} to="/more/privacy">Privacy Policy</Link>
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/more/terms">Terms of Service</Link>
            </Column>
            <Column style={{ display: `${isMobileScreenSize() ? 'none' : ''}` }}>
              <ColumnTitle>Connect</ColumnTitle>
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
                  <span>Facebook&nbsp;-&nbsp;WeVoteUSA</span>
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
              <OpenExternalWebSite
                linkIdAttribute="footerLinkInstagram"
                url="https://instagram.com/WeVote"
                target="_blank"
                body={(
                  <span>Instagram - @WeVote</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column>
              <ColumnTitle>Products</ColumnTitle>
              {/* <Link id="footerLinkFreeOnlineTools" className={classes.link} to="/settings/tools">Free Tools</Link> */}
              {/* <Link id="footerLinkForPricing" className={classes.link} to="/pricing">Pricing</Link> */}
              <OpenExternalWebSite
                linkIdAttribute="footerLinkCampaigns"
                url="https://campaigns.WeVote.US/"
                target="_blank"
                body={(
                  <span>Campaigns</span>
                )}
                className={classes.link}
              />
              <Link id="footerLinkSupportedElections" className={classes.link} to="/more/elections">Elections</Link>
            </Column>
          </TopSectionInnerWrapper>
        </TopSectionOuterWrapper>
        <BottomSection>
          <Text>
            <WeVoteName>
              WeVote.US
            </WeVoteName>
            {' '}
            is brought to you by a partnership between two registered nonprofit organizations, one 501(c)(3) and one 501(c)(4). We do not support or oppose any political candidate or party.
          </Text>
          <Text>
            The software that powers We Vote is
            {' '}
            <OpenExternalWebSite
              linkIdAttribute="footerLinkOpenSource"
              url="https://github.com/WeVote"
              target="_blank"
              body={(
                <span>open source.</span>
              )}
              className={classes.bottomLink}
            />
          </Text>
        </BottomSection>
      </Wrapper>
    );
  }
}
FooterMainWeVote.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  link: {
    color: '#333',
    fontSize: 14,
    marginBottom: '1em',
    '&:hover': {
      color: '#4371cc',
    },
    textDecoration: 'none',
    [theme.breakpoints.down('md')]: {
      fontSize: 14,
    },
  },
  bottomLink: {
    color: '#333',
    textDecoration: 'none',
    '&:hover': {
      color: '#4371cc',
    },
  },
});

const BottomSection = styled.div`
  border-top: 1px solid lightgray;
  display: flex;
  flex-flow: column;
  padding-top: 15px;
  text-align: left;
`;

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 150px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 50%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 100%;
  }
`;

const ColumnTitle = styled.div`
  color: #808080;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 15px;
  margin-top: 15px;
  text-transform: uppercase;
`;

const Text = styled.p`
  color: #808080;
  font-size: 14px;
  margin-right: 0.5em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`;

const TopSectionInnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const TopSectionOuterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const WeVoteName = styled.span`
  font-weight: 600;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(FooterMainWeVote);
