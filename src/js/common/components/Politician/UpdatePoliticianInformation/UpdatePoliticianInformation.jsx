import PropTypes from 'prop-types';
import React, { useState, Suspense } from 'react';
import styled from 'styled-components';
import { Close, EditOutlined, ExpandMoreRounded } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled as muiStyled } from '@mui/material/styles';
import DesignTokenColors from '../../Style/DesignTokenColors';
import VerifyOtherWaysModal from './VerifyOtherWaysModal';
import VerifyWithEmailModal from './VerifyWithEmailModal';
import AppObservableStore from '../../../stores/AppObservableStore';
import webAppConfig from '../../../../config';
import useVoterCanEditPolitician from '../../../../hooks/useVoterCanEditPolitician';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../Widgets/OpenExternalWebSite'));

const updateCandidateInformationLink = 'https://docs.google.com/forms/d/e/1FAIpQLSePdeW32PClaSO1pUWBJnQ75wFGPOtviNaqOABBYps7NIH3hA/viewform?usp=sf_link';
const CustomTooltip = muiStyled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#001F3F',
    color: '#fff',
    fontSize: '13px',
    padding: '10px 10px 16px 16px',
    position: 'relative',
    width: '180px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#001F3F',
  },
}));

const UpdatePoliticianInformation =  ({ politicianName, politicianWeVoteId }) => {
  const voterCanEditPoliticianProfile = useVoterCanEditPolitician();
  // console.log('updatePoliticianInformation politicianName: ', politicianName, ', voterCanEditPoliticianProfile: ', voterCanEditPoliticianProfile);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleEditProfile = () => {
    alert('Edit politician information');
  };

  const handleOpenVerifyWithEmailModal = () => {
    AppObservableStore.setShowClaimProfileWithEmailModal(true);
  };

  return (
    <UpdateInformationWrapper>
      {!!(politicianName) && (
        <>
          {nextReleaseFeaturesEnabled ? (
            <>
              {voterCanEditPoliticianProfile ? (
                <CustomTooltip
                  interactive
                  arrow
                  placement="right"
                  open={tooltipOpen}
                  onOpen={() => setTooltipOpen(true)}
                  onClose={() => setTooltipOpen(false)}
                  title={(
                    <TooltipContent>
                      <CloseButton size="small" onClick={() => setTooltipOpen(false)}>
                        <Close fontSize="small" />
                      </CloseButton>
                      Edit your candidate’s profile here
                      <GotItButton onClick={() => setTooltipOpen(false)}>
                        GOT IT
                      </GotItButton>
                    </TooltipContent>
                  )}
                >
                  <EditProfileWrapper
                    onMouseEnter={() => setTooltipOpen(true)}
                    onClick={handleEditProfile}
                  >
                    <EditOutlined fontSize="small" style={{ marginRight: 4 }} />
                    Edit profile
                  </EditProfileWrapper>
                </CustomTooltip>
              ) : (
                <CandidateStaffAccessButton
                  onClick={handleOpenVerifyWithEmailModal}
                >
                  Candidate staff access
                  <ExpandMoreRounded />
                </CandidateStaffAccessButton>
              )}
              <VerifyOtherWaysModal
                politicianName={politicianName}
                politicianWeVoteId={politicianWeVoteId}
              />
              <VerifyWithEmailModal
                politicianName={politicianName}
                politicianWeVoteId={politicianWeVoteId}
              />
            </>
          ) : (
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
                    destinationPageName="PoliticianEditForm"
                    destinationPageType="politician"
                    trackingOn
                  />
                </AddInfoLink>
              </FlexLayoutDiv>
            </Suspense>
          )}
        </>
      )}
    </UpdateInformationWrapper>
  );
};

UpdatePoliticianInformation.propTypes = {
  politicianName: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const AddInfoLink = styled('div')`
  font-size: 12px;
`;

const CandidateStaffAccessButton = styled('button')`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.primary600};
  font-size: 12px;
  margin-top: -3px;
`;

const CandidateStaffText = styled('div')`
  color:${DesignTokenColors.neutralUI100};
  font-size: 10px;
`;

const EditProfileWrapper = styled('div')`
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
  font-size: 12px;
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

const TooltipContent = styled('div')`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const GotItButton = styled(Button)`
  align-self: flex-end;
  color: #fff;
  font-size: 12px;
  text-transform: none;
  min-width: 0;
  white-space: nowrap;
`;

const CloseButton = muiStyled(IconButton)`
   align-self: flex-end;
   color: #fff;
   min-width: 0;
   padding: 0;
   z-index: 1;
 `;

export default UpdatePoliticianInformation;
