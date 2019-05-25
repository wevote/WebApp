import React, { Component } from 'react';
import { Link } from 'react-router';
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
            <span>We are thankful to these organizations which are critical to our work! We really appreciate you.</span>
            <CompanyWrapper>
              { organizationalDonors.map(item => (
                <div className="credits-company" key={item.alt}>
                  <div>
                    <div className="credits-company__logo-container">
                      {
                        item.logo && (
                          <img className="credits-company__logo"
                            src={item.logo}
                            alt={`${item.alt} logo`}
                          />
                        )
                      }
                    </div>
                    <div className="credits-company__info">
                      {item.name && <strong>{item.name}</strong>}
                      {item.title && (
                        <p className="credits-company__title">
                          {item.title}
                        </p>
                      )
                      }
                    </div>
                  </div>
                </div>
              )) }
            </CompanyWrapper>
          </CreditsDescriptionContainer>
          <CreditsDescriptionContainer>
            <SectionTitle>Volunteers, Interns &amp; Donors</SectionTitle>
            We couldn
            {'\''}
            t do what we do without volunteers, interns and donors.
            {' '}
            This is a list of volunteers who have contributed 10+ hours, in rough order of hours donated.
            {' '}
            (Please contact Dale McGrew if should be on this list and aren
            {'\''}
            t.)
            {' '}
            Please join us by
            <OpenExternalWebSite
              url="https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops"
              target="_blank"
              className="open-web-site open-web-site__no-right-padding"
              body={(
                <span>
                  finding a role that excites you on our volunteer on our page at Idealist.org&nbsp;
                  <i className="fas fa-external-link-alt" />
                </span>
              )}
            />
            , or
            {' '}
            <Link to="/more/donate">
              donating now
            </Link>
            . (Individual donors only listed with express permission.)
            <br />
            <br />
            <ul>
              { teamOfVolunteers.map(item => (
                <div key={item.name}>
                  <li>
                    <strong>{item.name}</strong>
                    {item.title && (
                      <span>
                        {' '}
                        -
                        {' '}
                        {item.title}
                      </span>
                    )}
                  </li>
                </div>
              ))
              }
            </ul>
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

const SectionTitle = styled.h1`
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
    margin-bottom: 9px;
  }
`;

export default withStyles(styles)(Credits);
