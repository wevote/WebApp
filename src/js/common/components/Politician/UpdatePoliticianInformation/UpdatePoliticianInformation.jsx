import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import { Close, EditOutlined, ExpandMoreRounded } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled as muiStyled } from '@mui/material/styles';
import DesignTokenColors from '../../Style/DesignTokenColors';
import AppObservableStore from '../../../stores/AppObservableStore';
import useVoterCanEditPolitician from '../../../../hooks/useVoterCanEditPolitician';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../../../utils/lookupPageNameAndPageTypeDict';
import VoterStore from '../../../../stores/VoterStore';
import PoliticianStore from '../../../stores/PoliticianStore';

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

function UpdatePoliticianInformation ({ politicianName, politicianWeVoteId }) {
  const voterCanEditPoliticianProfile = useVoterCanEditPolitician();
  // console.log('updatePoliticianInformation politicianName: ', politicianName, ', voterCanEditPoliticianProfile: ', voterCanEditPoliticianProfile);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  function sendGTMDataLayer (actionType = 'openModal', buttonId = '', destinationPageName = '') {
    const { location: { pathname: currentPathname } } = window;
    const destinationPage = lookupPageNameAndPageTypeDict(currentPathname);
    const dataLayerObject = {
      actionDetails: {
        actionType,
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
      destinationDetails: {
        destinationPageName: destinationPageName || 'notSet',
        destinationPageType: destinationPage.pageType || 'notSet',
        destinationPathname: currentPathname,
      },
    };
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  const handleOpenClaimProfileModal = (buttonId) => {
    AppObservableStore.setShowClaimProfileWithEmailModal(true);
    sendGTMDataLayer('openModal', buttonId, 'ClaimProfileWithEmailModal');
  };

  const handleOpenEditProfileDrawer = (buttonId) => {
    if (VoterStore.getVoterIsSignedIn()) {
      AppObservableStore.setDrawerOpen('politicianSelfEditDrawerOpen', true);
      AppObservableStore.setPoliticianWeVoteIdBeingViewed(politicianWeVoteId);
      sendGTMDataLayer('openModal', buttonId, 'PoliticianSelfEditDrawer');
    } else {
      AppObservableStore.setShowSignInModal(true);
      sendGTMDataLayer('openModal', buttonId, 'PoliticianSelfEditDrawer');
    }
  };

  return (
    <UpdateInformationWrapper>
      {!!(politicianName) && (
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
                id="editThisProfile"
                onMouseEnter={() => setTooltipOpen(true)}
                onClick={() => handleOpenEditProfileDrawer('editThisProfile')}
              >
                <EditOutlined fontSize="small" style={{ marginRight: 4 }} />
                Edit profile
              </EditProfileWrapper>
            </CustomTooltip>
          ) : (
            <CandidateStaffAccessButton
              id="claimThisProfile"
              onClick={() => handleOpenClaimProfileModal('claimThisProfile')}
            >
              Candidate staff access
              <ExpandMoreRounded />
            </CandidateStaffAccessButton>
          )}
        </>
      )}
    </UpdateInformationWrapper>
  );
}

UpdatePoliticianInformation.propTypes = {
  politicianName: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const CandidateStaffAccessButton = styled('button')`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.primary600};
  font-size: 12px;
  margin-top: -3px;
`;

const EditProfileWrapper = styled('div')`
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
  font-size: 12px;
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
