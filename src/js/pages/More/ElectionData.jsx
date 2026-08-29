import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import ElectionDataSourcesBody from '../../common/components/ElectionDataSourcesBody';
import { renderLog } from '../../common/utils/logging';
import { Section } from '../../components/Welcome/sectionStyles';
import webAppConfig from '../../config';


function ElectionData () {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  renderLog('ElectionData');  // Set LOG_RENDER_EVENTS to log all renders
  return (
    <PageContentContainer>
      <Helmet>
        <title>Election Data Sources - WeVote</title>
        <link rel="canonical" href={`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/election-data`} />
      </Helmet>
      <Section noTopMargin>
        <ElectionDataSourcesBody />
      </Section>
    </PageContentContainer>
  );
}

export default ElectionData;
