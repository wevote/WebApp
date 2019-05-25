import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Helmet from 'react-helmet';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import { organizationalDonors, teamOfVolunteers } from '../../components/More/people';
import WelcomeAppbar from '../../components/Navigation/WelcomeAppbar';
import Section from '../../components/Welcome/Section';
import Footer from '../../components/Welcome/Footer';

class Credits extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog(__filename);
    return (
      <Wrapper>
        <Helmet title="Credits - We Vote" />
        <WelcomeAppbar pathname="/more/pricing" />
        <HeaderForCredits>
          <CreditsTitle>Credits &amp; Thanks</CreditsTitle>
        </HeaderForCredits>
        <Section noTopMargin>
          <CreditsDescriptionContainer>
            <h3 className="h4">We are thankful to these organizations which are critical to our work! We really appreciate you.</h3>
            <CompanyWrapper>
              { organizationalDonors.map(item => (
                <div className="credits-company" key={item.name}>
                  <div className="credits-company__logo_container">
                    {
                      item.logo && (
                        <img className="credits-company__logo"
                          src={item.logo}
                          alt={`${item.name} logo`}
                        />
                      )
                    }
                  </div>
                  <div className="credits-company__info">
                    <strong>{item.name}</strong>
                    <p className="credits-company__title">
                      {item.title}
                    </p>
                  </div>
                </div>
              )) }
            </CompanyWrapper>
          </CreditsDescriptionContainer>
          <CreditsDescriptionContainer>
            <h3 className="h4">Special thanks to our team of volunteers. You are the best!</h3>
            <p>
              (This is a list of volunteers who have contributed 10 or more hours, in rough order of hours contributed.)
              <br />
            </p>
            <ul>
              { teamOfVolunteers.map(item => (
                <div key={item.name}>
                  <li>
                    <strong>{item.name}</strong>
                    {' '}
                    -
                    {' '}
                    {item.title}
                  </li>
                </div>
              ))
              }
            </ul>
          </CreditsDescriptionContainer>
          <CreditsDescriptionContainer>
            <h3>Join Us!</h3>
            We couldn’t do what we do without volunteers, interns and donors. Please sign up at
            <OpenExternalWebSite
              url="http://WeVoteTeam.org/volunteer"
              target="_blank"
              className="open-web-site open-web-site__no-right-padding"
              body={(
                <span>
                  http://WeVoteTeam.org&nbsp;
                  <i className="fas fa-external-link-alt" />
                </span>
              )}
            />
            .
          </CreditsDescriptionContainer>
        </Section>
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
  pricingChoiceLink: {
    color: 'white',
    fontSize: 12,
    '&:hover': {
      color: 'white',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
    },
  },
  pricingSwitch: {
    marginTop: 18,
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
`;

const HeaderForCredits = styled.div`
  position: relative;
  height: 190px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 190px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 150px;
  }
`;

const CreditsTitle = styled.h1`
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-top: 3em;
  margin-bottom: 0;
  padding-bottom: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
    margin-top: 3em;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 18px;
    margin-top: 5em;
  }
`;

// }
const CreditsDescriptionContainer = styled.div`
  margin: 1em auto;
  width: 960px;
  max-width: 90vw;
  text-align: left;
  @media (min-width: 960px) and (max-width: 991px) {
    > * {
      width: 90%;
      margin: 0 auto;   
    }
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    margin: 0 auto;
  }
`;

const CompanyWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  text-align: center;
`;

export default withStyles(styles)(Credits);
