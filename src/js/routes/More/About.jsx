import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AnalyticsActions from '../../actions/AnalyticsActions';
import { renderLog } from '../../utils/logging';
import Footer from '../../components/Welcome/Footer';
import OpenExternalWebSite from '../../utils/OpenExternalWebSite';
import TeamMemberDisplayForList from '../../components/More/TeamMemberDisplayForList';
import ToolBar from './ToolBar';
import VoterStore from '../../stores/VoterStore';
import { weVoteBoard, weVoteFounders, weVoteStaff } from '../../components/More/people';
import WelcomeAppbar from '../../components/Navigation/WelcomeAppbar';
import { HeaderForCampaigns, Title } from '../../components/Welcome/Header';
import Section from '../../components/Welcome/Section';

class About extends Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    AnalyticsActions.saveActionAboutMobile(VoterStore.electionId());
  }

  render () {
    renderLog(__filename);
    return (
      <Wrapper>
        <Helmet title="About Us - We Vote" />
        <WelcomeAppbar pathname="/more/about" />
        <HeaderForCampaigns>
          <Title>About We Vote</Title>
        </HeaderForCampaigns>
        <Container>
          <ToolBar />
          <div className="u-inset--sm" />
          <div className="our-story">
            <p>
              We Vote is building the next generation of voting tech. We
              {'\''}
              re starting by creating a digital voter guide informed by issues you care about, and people you trust.
              {' '}
              Through our nonpartisan, open source platform, we
              {'\''}
              ll help you become a better voter, up and down the ballot.
            </p>

            <section>
              <h1 className="h1">Our Vision</h1>
              <p>
                Imagine what would be different if everyone voted in every election...
              </p>
              <p>
                Currently, the U.S. trails most developed nations in voter turnout.
                {' '}
                Only 6 out of 10 eligible voters is expected to cast a ballot next year.
                {' '}
                Improving overall voter participation is a responsibility shared by all of us.
                {' '}
                Even in today
                {'\''}
                s tense political climate, we all can agree that it should be much easier to decide how to vote.
              </p>
              <p>
                <strong>
                  Our vision is to build a world where no one misses a voting opportunity because they don
                  {'\''}
                  t have the info they need to make their individual choice.
                </strong>
              </p>
              <p>
                We are creating easy-to-use tools that cut through the election noise and help voters easily understand what
                {'\''}
                s on their ballot.
                {' '}
                Our open platform empowers voters to create and share voter guides that aggregate
                {' '}
                information and opinions across personal networks.
                {' '}
                So you can help your friends be better voters too.
              </p>
            </section>

            <section>
              <h1 className="h1">Our Approach</h1>
              <p>
                We Vote is made of two fully nonpartisan nonprofit organizations (501(c)(3) and 501(c)(4)) based in Oakland, California.
                {' '}
                Our software is open source, and our work is driven by over 100 volunteers who have contributed so far.
                {' '}
                Inspired by groups like
                {' '}
                <OpenExternalWebSite
                  url="http://codeforsanfrancisco.org/"
                  target="_blank"
                  body={(
                    <span>
                      Code for America&nbsp;
                      <i className="fa fa-external-link" />
                    </span>
                  )}
                />
                {' '}
                and the
                {' '}
                <OpenExternalWebSite
                  url="https://www.mozilla.org/en-US/foundation/"
                  target="_blank"
                  className="open-web-site open-web-site__no-right-padding"
                  body={(
                    <span>
                      Mozilla Foundation&nbsp;
                      <i className="fa fa-external-link" />
                    </span>
                  )}
                />
                , we use technology to make democracy stronger by increasing voter turnout.
                {' '}
                Our incredible teams of volunteers help us to compile and verify endorsement data from every election.
              </p>
              <p>
                We are purposefully nonpartisan because we know that voters and their networks are complex.
                {' '}
                Voting decisions are rarely single issue, and we make better decisions when lots of information is present.
              </p>
            </section>

            <section>
              <h1 className="h1">Our Team</h1>

              <h2 className="h2">Founders</h2>
              <div className="row">
                {
                weVoteFounders.map(teamMember => (
                  <TeamMemberDisplayForList teamMember={teamMember} />
                ))
                }
              </div>

              <h2 className="h2">Board Members &amp; Advisers</h2>
              <div className="row">
                {
                weVoteBoard.map(teamMember => (
                  <TeamMemberDisplayForList teamMember={teamMember} />
                ))
                }
              </div>

              <h2 className="h2">Staff &amp; Senior Volunteers</h2>
              <div className="row">
                {
                weVoteStaff.map(teamMember => (
                  <TeamMemberDisplayForList teamMember={teamMember} />
                ))
                }
              </div>
            </section>

            <section>
              <h2 className="h2">Our Funders &amp; Champions</h2>
              <p>
                <Link to="/more/credits">
                  We are thankful for our volunteers, our board of directors, our funders, and the organizations
                  {' '}
                  <i className="fa fa-external-link" />
                </Link>
                {' '}
                that are critical to our work.
              </p>
            </section>

            <section>
              <h2 className="h2">Our Story</h2>
              <p>
                After meeting in Oakland in the spring of 2012, We Vote co-founders Dale McGrew and Jenifer Fernandez Ancona became fast friends.
                {' '}
                Dale brings Silicon Valley experience from founding and successfully selling two high tech startups,
                {' '}
                and Jenifer brings political, advocacy and fundraising experience from years on the front-lines of national campaigns.
                {' '}
                Through frequent conversations, the idea of a nonprofit “Yelp for Politics” was born.
                {' '}
                Founded in 2014, We Vote would be a community for voters, they decided, created by people concerned about where this country is heading.
                {' '}
                Being an open source, volunteer-driven project means anyone can contribute. Kind of like democracy.
              </p>
            </section>

            <section>
              <h2 className="h2">Need Help?</h2>
              <OpenExternalWebSite
                url="https://help.wevote.us/hc/en-us/sections/115000140947-What-is-We-Vote-"
                target="_blank"
                className="open-web-site open-web-site__no-left-padding"
                body={(
                  <span>
                    Visit our help center to learn more about We Vote.&nbsp;
                    <i className="fa fa-external-link" />
                  </span>
                )}
              />
            </section>
          </div>
        </Container>
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

const Container = styled.div`
  max-width: 960px;
  display: flex;
  flex-flow: column;
  padding: 5em 1em 3em 1em;
  text-align: center;
  align-items: center;
  color: #333;
  width: 100%;
  margin: 0 auto;
  background: ${({ variant }) => (variant === 'dark' ? 'rgb(235, 236, 240)' : 'white')};
  ${({ rounded }) => (rounded ? // eslint-disable-next-line
      'border-radius: 50% 50%;\nwidth: 200%;\npadding: 3em 2em;' : '')}
  @media(min-width: 576px) {
    width: 90%;
  }
  @media(min-width: 769px) {
    width: 85%;
  }
  @media(min-width: 992px) {
    width: 80%;
  }
  @media(min-width: 1200px) {
    width: 75%;
  }
`;

export default withStyles(styles)(About);
