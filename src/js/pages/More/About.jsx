import { Launch } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import ToolBar from '../../common/components/Widgets/ToolBar';
import { weVoteBoard, weVoteFounders, weVoteStaff } from '../../common/constants/people';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import TeamMemberDisplayForList from '../../components/More/TeamMemberDisplayForList';
import ShowMoreButtons from '../../components/Widgets/ShowMoreButtons';
import { Title } from '../../components/Welcome/headerWelcomeStyles';
import { Bold, DescriptionContainer, MemberListContainer, Section, SectionTitle } from '../../components/Welcome/sectionStyles';
import VoterStore from '../../stores/VoterStore';
import cordovaScrollablePaneTopPadding from '../../utils/cordovaScrollablePaneTopPadding';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const WelcomeAppbar = React.lazy(() => import(/* webpackChunkName: 'WelcomeAppbar' */ '../../components/Navigation/WelcomeAppbar'));
const WelcomeFooter = React.lazy(() => import(/* webpackChunkName: 'WelcomeFooter' */ '../../components/Welcome/WelcomeFooter'));

class About extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);
    this.state = {
      showAllFounders: false,
      showAllBoard: false,
      showAllStaff: false,
      showMoreButtonWasClickedFounders: false,
      showMoreButtonWasClickedBoard: false,
      showMoreButtonWasClickedStaff: false,
    };
  }

  componentDidMount () {
    AnalyticsActions.saveActionAboutMobile(VoterStore.electionId());
    window.scrollTo(0, 0);
  }

  showMoreButtonsLinkFounders = () => {
    const { showMoreButtonWasClickedFounders, showAllFounders } = this.state;
    this.setState({
      showMoreButtonWasClickedFounders: !showMoreButtonWasClickedFounders,
      showAllFounders: !showAllFounders,
    });
  }

  showMoreButtonsLinkBoard = () => {
    const { showMoreButtonWasClickedBoard, showAllBoard } = this.state;
    this.setState({
      showMoreButtonWasClickedBoard: !showMoreButtonWasClickedBoard,
      showAllBoard: !showAllBoard,
    });
  }

  showMoreButtonsLinkStaff = () => {
    const { showMoreButtonWasClickedStaff, showAllStaff } = this.state;
    this.setState({
      showMoreButtonWasClickedStaff: !showMoreButtonWasClickedStaff,
      showAllStaff: !showAllStaff,
    });
  }


  render () {
    renderLog('About');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      showMoreButtonWasClickedBoard, showMoreButtonWasClickedStaff,
      showAllBoard, showAllStaff,
    } = this.state;
    let showShowMoreButtonBoard = true;
    let showShowMoreButtonStaff = true;
    if (weVoteBoard.length <= 3) { showShowMoreButtonBoard = false; }
    if (weVoteStaff.length <= 3) { showShowMoreButtonStaff = false; }
    let weVoteBoardCount = 0;
    let weVoteStaffCount = 0;

    return (
      <AboutWrapper>
        <Helmet>
          <title>About WeVote</title>
          <link rel="canonical" href="https://wevote.us/about" />
        </Helmet>
        <Suspense fallback={<></>}>
          <WelcomeAppbar pathname="/more/about" />
        </Suspense>
        <HeaderForAbout>
          <Title>About WeVote</Title>
          <ToolBar />
        </HeaderForAbout>
        <Section noTopMargin>
          <DescriptionContainer>
            <DescriptionLeftColumn>
              WeVote is a nonprofit technology startup, building the next generation of voting tech. We
              {'\''}
              re starting by creating a digital voter guide informed by issues you care about, and people you trust.
              {' '}
              Through our nonpartisan, open source platform, we
              {'\''}
              ll help you become a better voter, up and down the ballot.
            </DescriptionLeftColumn>
            <DescriptionImageColumn>
              <figure>
                <Image
                  alt="WeVote at iOS Dev camp, where we won 'Best App for Good'."
                  title="WeVote at iOS Dev camp, where we won 'Best App for Good'."
                  src={normalizedImagePath('/img/global/photos/iOSDevCamp2016.png')}
                />
                <AboutFigCaption>WeVote at iOS Dev camp.</AboutFigCaption>
              </figure>
            </DescriptionImageColumn>
          </DescriptionContainer>
        </Section>
        <Section noTopMargin>
          <SectionTitle>
            Our Vision
          </SectionTitle>
          <AboutDescriptionContainer>
            Imagine what would be different if everyone voted in every election...
          </AboutDescriptionContainer>
          <AboutDescriptionContainer>
            Currently, the U.S. trails most developed nations in voter turnout.
            {' '}
            Only 6 out of 10 eligible voters is expected to cast a ballot this year.
            {' '}
            Improving overall voter participation is a responsibility shared by all of us.
            {' '}
            Even in today
            {'\''}
            s tense political climate, we all can agree that it should be much easier to decide how to vote.
          </AboutDescriptionContainer>
          <AboutDescriptionContainer>
            Our vision is to build a world where
            &nbsp;
            <Bold>no one misses a voting opportunity</Bold>
            &nbsp;
            because they don
            {'\''}
            t have the info they need to make their individual choice.
          </AboutDescriptionContainer>
          <AboutDescriptionContainer>
            We are creating easy-to-use tools that cut through the election noise and help voters easily understand what
            {'\''}
            s on their ballot.
            {' '}
            Our open platform empowers voters to create and share voter guides that aggregate
            {' '}
            information and opinions across personal networks.
            {' '}
            So you can help your friends be better voters too.
          </AboutDescriptionContainer>
        </Section>
        <Section variant="dark" rounded>
          <SectionTitle>
            Our Approach
          </SectionTitle>
          <AboutDescriptionContainer>
            WeVote is made of two fully nonpartisan nonprofit organizations (501(c)(3) and 501(c)(4)) based in Oakland, California. Our software is open source, and our work is driven by over 100 volunteers who have contributed so far. Inspired by groups like
            {' '}
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="codeForSF"
                url="https://codeforsanfrancisco.org/"
                target="_blank"
                body={(
                  <span>
                    Code for America&nbsp;
                    <Launch
                      style={{
                        height: 14,
                        marginLeft: 2,
                        marginTop: '-3px',
                        width: 14,
                      }}
                    />
                  </span>
                )}
              />
            </Suspense>
            and the
            {' '}
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="mozilla"
                url="https://www.mozilla.org/en-US/foundation/"
                target="_blank"
                className="open-web-site open-web-site__no-right-padding"
                body={(
                  <span>
                    Mozilla Foundation&nbsp;
                    <Launch
                      style={{
                        height: 14,
                        marginLeft: 2,
                        marginTop: '-3px',
                        width: 14,
                      }}
                    />
                  </span>
                )}
              />
            </Suspense>
            , we use technology to make democracy stronger by increasing voter turnout. Our incredible teams of volunteers help us to compile and verify endorsement data from every election.
          </AboutDescriptionContainer>
          <AboutDescriptionContainer>
            We are purposefully nonpartisan because we know that voters and their networks are complex. Voting decisions are rarely single issue, and we make better decisions when lots of information is present.
          </AboutDescriptionContainer>
        </Section>
        <Section>
          <SectionTitle>
            Our Team
          </SectionTitle>
          <AboutDescriptionContainer>
            <h2 className="h2">Founders</h2>
          </AboutDescriptionContainer>
          <MemberListContainer>
            <div className="row position-relative">
              {weVoteFounders.map((teamMember) => (
                <TeamMemberDisplayForList key={`teamDisplay-${teamMember.name}-${teamMember.title[0]}`} teamMember={teamMember} />
              ))}
            </div>
          </MemberListContainer>
          <AboutDescriptionContainer>
            <h2 className="h2">
              Board Members &amp; Advisers (
              {weVoteBoard.length}
              )
            </h2>
          </AboutDescriptionContainer>
          <AboutDescriptionContainer>
            <div className="row position-relative">
              {weVoteBoard.map((teamMember) => {
                weVoteBoardCount++;
                if (!showAllBoard) {
                  if (weVoteBoardCount > 3) return null;
                }
                return (
                  <TeamMemberDisplayForList
                    key={`teamDisplay-${teamMember.name}-${teamMember.title[0]}`}
                    teamMember={teamMember}
                  />
                );
              })}
            </div>
            <div>
              {showShowMoreButtonBoard && (
                <ShowMoreButtons
                  showMoreId="showMoreBallotButtons"
                  showMoreButtonWasClicked={showMoreButtonWasClickedBoard}
                  showMoreButtonsLink={this.showMoreButtonsLinkBoard}
                />
              )}
            </div>
          </AboutDescriptionContainer>
          <AboutDescriptionContainer>
            <h2 className="h2">
              Staff &amp; Senior Volunteers (
              {weVoteStaff.length}
              )
            </h2>
          </AboutDescriptionContainer>
          <AboutDescriptionContainer>
            <div className="row position-relative">
              {weVoteStaff.map((teamMember) => {
                weVoteStaffCount++;
                if (!showAllStaff) {
                  if (weVoteStaffCount > 3) return null;
                }
                return (
                  <TeamMemberDisplayForList
                    key={`teamDisplay-${teamMember.name}-${teamMember.title[0]}`}
                    teamMember={teamMember}
                  />
                );
              })}
            </div>
            <div>
              {showShowMoreButtonStaff && (
                <ShowMoreButtons
                  showMoreId="showMoreBallotButtons"
                  showMoreButtonWasClicked={showMoreButtonWasClickedStaff}
                  showMoreButtonsLink={this.showMoreButtonsLinkStaff}
                />
              )}
            </div>
          </AboutDescriptionContainer>
        </Section>
        <Section variant="dark" rounded>
          <SectionTitle>
            Our Funders &amp; Champions
          </SectionTitle>
          <AboutDescriptionContainer>
            We are thankful for
            {' '}
            <Link to="/more/credits">
              our volunteers, our board of directors, our funders, and the organizations
              &nbsp;
              <Launch
                style={{
                  height: 14,
                  marginLeft: 2,
                  marginTop: '-3px',
                  width: 14,
                }}
              />
            </Link>
            {' '}
            that are critical to our work.
          </AboutDescriptionContainer>
        </Section>
        <Section>
          <SectionTitle>
            Our Story
          </SectionTitle>
          <AboutDescriptionContainer>
            Founded in 2014, the idea of a nonprofit “Yelp for Politics” was born. WeVote would be a community for voters, created by people concerned about where this country is heading.
            {' '}
            Being an open source, volunteer-driven project means anyone can contribute. Kind of like democracy.
          </AboutDescriptionContainer>
        </Section>
        <Section>
          &nbsp;
        </Section>
        <Suspense fallback={<></>}>
          <WelcomeFooter />
        </Suspense>
      </AboutWrapper>
    );
  }
}

const styles = (theme) => ({
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

const AboutWrapper = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
  padding-top: ${cordovaScrollablePaneTopPadding()};
`;

const HeaderForAbout = styled('div')(({ theme }) => (`
  position: relative;
  height: 230px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  ${theme.breakpoints.down('md')} {
    height: 230px;
  }
  ${theme.breakpoints.down('xs')} {
    height: 215px;
  }
`));

const AboutDescriptionContainer = styled('div')(({ theme }) => (`
  margin: 1em auto;
  width: 960px;
  max-width: 90vw;
  text-align: left;
  ${theme.breakpoints.down('md')} {
    text-align: center;
  }
`));

const DescriptionLeftColumn = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: column;
  padding: 0 20px 0 0;
  width: 65%;
  justify-content: center;
  text-align: left;
  ${theme.breakpoints.down('md')} {
    width: 100%;
    text-align: center;
  }
`));

const DescriptionImageColumn = styled('div')(({ theme }) => (`
  width: 35%;
  text-align: right;
  ${theme.breakpoints.down('md')} {
    margin: 1em 0 0 0;
    text-align: center;
    width: 100%;
  }
`));

const Image = styled('img')`
  width: 100%;
`;

const AboutFigCaption = styled('figcaption')`
  color: #555;
  font-size: .8rem;
  text-align: center;
`;

export default withStyles(styles)(About);
