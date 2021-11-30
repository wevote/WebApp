import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FAQBody from '../../common/components/FAQBody';
import { isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { PageContentContainer } from '../../utils/pageLayoutStyles';

export default class FAQ extends Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  render () {
    renderLog('FAQ');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="FAQ - We Vote" />
        <PageContentContainer>
          <ContainerFluidWrapper className="container-fluid card">
            <div className="card-main" style={{ paddingTop: `${isCordova() ? '0px' : '16px'}` }}>
              <FAQBody />
            </div>
          </ContainerFluidWrapper>
        </PageContentContainer>
      </div>
    );
  }
}

const ContainerFluidWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 0 8px 0;
  }
`;

