import React, { Component } from 'react';
import TagManager from 'react-gtm-module';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import FAQBody from '../../common/components/FAQBody';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

export default class FAQ extends Component {
  constructor (props) {
    super(props);
    this.state = {
      dataLayerFired: false,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.checkAndFireDataLayer();
  }

  checkAndFireDataLayer = () => {
    const { dataLayerFired } = this.state;
    const voter = VoterStore.getVoter();
    if (!dataLayerFired && voter && voter.we_vote_id) {
      TagManager.dataLayer({
        dataLayer: {
          event: 'landing',
          pageDetails: getPageDetails(),
          userDetails: VoterStore.getAnalyticsUserDetails(),
        },
      });

      this.setState({ dataLayerFired: true });
    }
  }

  render () {
    renderLog('FAQ');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet>
          <title>FAQ - WeVote</title>
          <link rel="canonical" href="https://wevote.us/more/faq" />
        </Helmet>
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

const ContainerFluidWrapper = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('sm')} {
    margin: 0 0 8px 0;
  }
`));
