import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));

const updateCandidateInformationLink = 'https://docs.google.com/forms/d/e/1FAIpQLSePdeW32PClaSO1pUWBJnQ75wFGPOtviNaqOABBYps7NIH3hA/viewform?usp=sf_link';

function UpdatePoliticianInformation (props) {
  const { politicianName } = props;
  return (
    <UpdateInformationWrapper>
      {!!(politicianName) && (
        <Suspense fallback={<></>}>
          <FlexLayoutDiv>
            <CandidateStaffText>
              For candidate staff:&nbsp;
            </CandidateStaffText>
            <AddInfoLink>
              <OpenExternalWebSite
                linkIdAttribute="updateCandidateInformation"
                url={updateCandidateInformationLink}
                target="_blank"
                className="u-link-color"
                body={(
                  <div>
                    Add info
                  </div>
                )}
              />
            </AddInfoLink>
          </FlexLayoutDiv>
        </Suspense>
      )}
    </UpdateInformationWrapper>
  );
}
UpdatePoliticianInformation.propTypes = {
  politicianName: PropTypes.string,
};

const AddInfoLink = styled('div')`
  font-size: 12px;
`;

const CandidateStaffText = styled('div')`
  color: 1px solid ${DesignTokenColors.neutralUI100};
  font-size: 10px;
`;

const FlexLayoutDiv = styled('div')`
  display: flex;
  align-items: flex-end;
`;

const UpdateInformationWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export default UpdatePoliticianInformation;
