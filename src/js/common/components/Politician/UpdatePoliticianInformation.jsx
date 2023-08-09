import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));

const updateCandidateInformationLink = 'https://docs.google.com/forms/d/e/1FAIpQLSePdeW32PClaSO1pUWBJnQ75wFGPOtviNaqOABBYps7NIH3hA/viewform?usp=sf_link';
function UpdatePoliticianInformation (props) {
  const { politicianName } = props;
  return (
    <UpdateInformationWrapper>
      {!!(politicianName) && (
        <Suspense fallback={<></>}>
          Are you&nbsp;
          {politicianName}
          ?&nbsp;
          <OpenExternalWebSite
            linkIdAttribute="updateCandidateInformation"
            url={updateCandidateInformationLink}
            target="_blank"
            className="u-link-color"
            body={(
              <div>
                Click here to update candidate information.
              </div>
            )}
          />
        </Suspense>
      )}
    </UpdateInformationWrapper>
  );
}
UpdatePoliticianInformation.propTypes = {
  politicianName: PropTypes.string,
};

const UpdateInformationWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export default UpdatePoliticianInformation;
