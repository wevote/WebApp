import { Launch } from '@mui/icons-material';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { isWebApp } from '../utils/isCordovaOrWebApp';
import { renderLog } from '../utils/logging';
import { officialWebsites } from '../constants/electionDataSources';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './Widgets/OpenExternalWebSite'));


function ElectionDataSourcesBody () {
  renderLog('ElectionDataSourcesBody');  // Set LOG_RENDER_EVENTS to log all renders
  return (
    <Wrapper>
      <ElectionDataSourcesDescriptionContainer>
        <SectionTitle>Government Information, Source Links</SectionTitle>
        We Vote is a 501(c)(3) nonprofit organization (FEIN 47-2691544) that collects, organizes and displays nationwide ballot information from the official government sources listed below.
        <br />
        <br />
        <ul>
          {officialWebsites.map((item) => (
            <div key={item}>
              <li>
                <Suspense fallback={<></>}>
                  <OpenExternalWebSite
                    url={item}
                    target="_blank"
                    body={item}
                  />
                </Suspense>
              </li>
            </div>
          ))}
        </ul>
      </ElectionDataSourcesDescriptionContainer>
      <ElectionDataSourcesDescriptionContainer>
        Want to help? Please join us by
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="wevoteJoinUs"
            url="https://wevote.applytojob.com/apply"
            target="_blank"
            className="open-web-site open-web-site__no-right-padding"
            body={(
              <span>
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
            <Link className="u-link-color" to="/donate">
              donating now
            </Link>
          </span>
        )}
        .
        <br />
        <br />
      </ElectionDataSourcesDescriptionContainer>
    </Wrapper>
  );
}

const ElectionDataSourcesDescriptionContainer = styled('div')(({ theme }) => (`
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

export default ElectionDataSourcesBody;
