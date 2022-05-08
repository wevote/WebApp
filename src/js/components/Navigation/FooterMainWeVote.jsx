import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import AppObservableStore from '../../stores/AppObservableStore';

class FooterMainWeVote extends Component {
  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  }

  render () {
    const { classes } = this.props;

    return (
      <Wrapper>
        <TopSectionOuterWrapper>
          <TopSectionInnerWrapper>
            <OneRow>
              <div id="footerLinkHowItWorks" className={classes.onClickDiv} onClick={this.openHowItWorksModal}>How It Works</div>
              <RowSpacer />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                body={(
                  <span>Help</span>
                )}
                className={classes.link}
              />
              <RowSpacer />
              <Link id="footerLinkPrivacy" className={classes.link} to="/more/privacy">Privacy</Link>
              <RowSpacer />
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/more/terms">Terms</Link>
            </OneRow>
            <OneRow>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkAbout"
                url="https://wevote.us/more/about"
                target="_blank"
                body={(
                  <span>About</span>
                )}
                className={classes.link}
              />
              <RowSpacer />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkTeam"
                url="https://wevote.us/more/about"
                target="_blank"
                body={(
                  <span>Team</span>
                )}
                className={classes.link}
              />
              <RowSpacer />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkTeam"
                url="https://wevote.us/more/credits"
                target="_blank"
                body={(
                  <span>Credits &amp; Thanks</span>
                )}
                className={classes.link}
              />
              <RowSpacer />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkCareers"
                url="https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops"
                target="_blank"
                body={(
                  <span>Jobs</span>
                )}
                className={classes.link}
              />
            </OneRow>
          </TopSectionInnerWrapper>
        </TopSectionOuterWrapper>
        <BottomSection>
          <Text>
            <WeVoteName>
              WeVote.US
            </WeVoteName>
            {' '}
            is brought to you by two registered nonprofit organizations, one 501(c)(3) and one 501(c)(4).
            <br />
            We do not support or oppose any political candidate or party.
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

const styles = () => ({
  link: {
    color: '#808080',
    '&:hover': {
      color: '#4371cc',
    },
    textDecoration: 'none',
  },
  bottomLink: {
    color: '#333',
    textDecoration: 'none',
    '&:hover': {
      color: '#4371cc',
    },
  },
  onClickDiv: {
    color: '#808080',
    cursor: 'pointer',
    '&:hover': {
      color: '#4371cc',
    },
    textDecoration: 'none',
  },
});

const BottomSection = styled('div')`
  display: flex;
  flex-flow: column;
  padding-top: 15px;
  align-items: center;
`;

const OneRow = styled('div')`
  color: #808080;
  display: flex;
  font-size: 13px;
  justify-content: center;
  margin-bottom: 15px;
`;

const RowSpacer = styled('div')`
  margin-right: 15px;
`;

const Text = styled('p')(({ theme }) => (`
  color: #808080;
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
