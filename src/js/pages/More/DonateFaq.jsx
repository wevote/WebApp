import React from 'react';
import { Helmet } from 'react-helmet-async';
import DonateFaqBody from '../../components/More/DonateFaqBody';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';

// The FAQ body lives in DonateFaqBody so it can also be shown in DonateFaqModal
function DonateFaq () {
  return (
    <PageContentContainer>
      <Helmet>
        <title>WeVote Donation FAQ</title>
      </Helmet>
      <DonateFaqBody />
    </PageContentContainer>
  );
}

export default DonateFaq;
