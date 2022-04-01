import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import ReadyIntroduction from '../../components/Ready/ReadyIntroduction';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';


export default class HowWeVoteHelps extends Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  render () {
    renderLog('HowWeVoteHelps');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="How We Vote Helps - We Vote" />
        <PageContentContainer>
          <ContainerFluidWrapper className="container-fluid card">
            <div className="card-main">
              <ReadyIntroduction
                contentUnfurledOnLoad
                titleCentered
                titleLarge
              />
              <br />
              <br />
              <CenteredWrapper>
                <Link to="/ready" className="u-cursor--pointer u-link-color">Let&apos;s get started!</Link>
              </CenteredWrapper>
              <br />
              <br />
              <br />
            </div>
          </ContainerFluidWrapper>
        </PageContentContainer>
      </div>
    );
  }
}

const CenteredWrapper = styled('div')`
  display: flex;
  font-size: 1.1rem;
  justify-content: center;
  width: 100%;
`;

const ContainerFluidWrapper = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('sm')} {
    margin: 0 0 8px 0;
  }
`));

