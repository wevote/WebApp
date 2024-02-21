import { Launch } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { organizationalDonors, teamOfVolunteers } from '../constants/people';
import { isWebApp } from '../utils/isCordovaOrWebApp';
import { renderLog } from '../utils/logging';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './Widgets/OpenExternalWebSite'));


class Credits extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('CreditsBody');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <Wrapper>
        <CreditsDescriptionContainer>
          <span>
            We are thankful to these organizations which are critical to our work.
            {' '}
            The companies on this list give us free or heavily discounted services (since we are a nonprofit), and
            {' '}
            the nonprofits overcome so many challenges to provide the data or other services we rely on.
            {' '}
            Please also see the
            {' '}
            <Link to="/more/attributions" id="attributions" class="u-link-color">
              summary of open source software
            </Link>
            {' '}
            WeVote uses.
          </span>
          <CompanyWrapper>
            { organizationalDonors.map((item) => {
              const oneCompany = (
                <div>
                  <CreditsCompanyLogoContainer>
                    {
                      item.logo && (
                        <CreditsCompanyLogo
                          src={item.logo}
                          alt={`${item.alt} logo`}
                        />
                      )
                    }
                  </CreditsCompanyLogoContainer>
                  <div>
                    {item.name && <strong>{item.name}</strong>}
                    {item.title && (
                      <CreditsCompanyTitle>
                        {item.title}
                      </CreditsCompanyTitle>
                    )}
                  </div>
                </div>
              );
              return (
                <CreditsCompany key={item.alt}>
                  { item.link ? (
                    <OpenExternalWebSite
                      url={item.link}
                      target="_blank"
                      body={oneCompany}
                    />
                  ) : (
                    oneCompany
                  )}
                </CreditsCompany>
              );
            })}
          </CompanyWrapper>
        </CreditsDescriptionContainer>
        <CreditsDescriptionContainer>
          <SectionTitle>Volunteers, Interns &amp; Donors</SectionTitle>
          We couldn&apos;t do what we do without your help.
          {' '}
          Please join us by
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute="wevoteJoinUs"
              url="https://wevote.applytojob.com/apply"
              target="_blank"
              className="open-web-site open-web-site__no-right-padding"
              body={(
                <span>
                  {' '}
                  finding a volunteer role that excites you
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
          {isWebApp() && (
            <span>
              , or by
              {' '}
              <Link class="u-link-color" to="/donate">
                donating now
              </Link>
            </span>
          )}
          .
          <br />
          <br />
          <ul>
            {teamOfVolunteers.map((item) => (
              <div key={item.name}>
                <li>
                  {item.linkedin ? (
                    <a href={item.linkedin} target="_blank">{item.name}</a>
                  ) : (
                    <span>{item.name}</span>
                  )}
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
            ))}
          </ul>
          <br />
          <br />
          This list is in rough order of number of volunteer hours spent (10+ hours) or monetary donation level. Individual monetary donors only listed with express permission.
          {' '}
          (Our apologies if you should be on this list and are missing. Please contact
          <a href="https://wevote.us/more/faq">support</a>
          with corrections.)
        </CreditsDescriptionContainer>
      </Wrapper>
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
});

const CreditsCompany = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0 1em 0;
  max-width: 220px;
  @media (max-width: 767px) {
    max-width: 45%;
    width: 45%;
  }
`;

const CreditsCompanyLogo = styled('img')`
  width: 300px;
  max-height: 120px;
  max-width: 100%;
`;

const CreditsCompanyLogoContainer = styled('div')`
  margin-bottom: 10px;
`;

const CreditsCompanyTitle = styled('p')`
  color: #555;
`;

const CreditsDescriptionContainer = styled('div')(({ theme }) => (`
  margin: 1em auto;
  width: 960px;
  max-width: 90vw;
  text-align: left;

  > * {
    width: 100%;
    margin: 0 auto;
  }

  a {
    text-decoration: underline;
  }

  ${[theme.breakpoints.between('lg', 'xl')]}: {
    > * {
      width: 90%;
      margin: 0 auto;
    }
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    margin: 0 auto;
  }
`));


const CompanyWrapper = styled('div')`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  text-align: center;
`;

const SectionTitle = styled('h1')(({ theme }) => (`
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 10px;
  ${theme.breakpoints.down('md')} {
    font-size: 24px;
    margin-bottom: 9px;
  }
`));

const Wrapper = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
`;

export default withStyles(styles)(Credits);
