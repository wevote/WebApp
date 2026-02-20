import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import ModalDisplayTemplateB from '../../../../components/Widgets/ModalDisplayTemplateB';
import { SubmitButton } from './VerifyOtherWaysModal';
import AppObservableStore from '../../../stores/AppObservableStore';
import PoliticianStore from '../../../stores/PoliticianStore';
import VoterStore from '../../../../stores/VoterStore';
import { getPageDetails } from '../../../../utils/lookupPageNameAndPageTypeDict';

function PasskeyVerifiedModal ({ closePasskeyVerifiedModal, passkeyVerified, politicianName, politicianWeVoteId, verificationEmails }) {
  const [passkeyVerifiedModalClosed, setPasskeyVerifiedModalClosed] = useState(false); // switch to toggle PasskeyVerifiedModal
  const usersEditingPermissions = ['Add profile content']; // , 'Invite supporters', 'Grow awareness'

  function sendGTMDataLayer (actionType = '', buttonId = '') {
    const dataLayerObject = {
      actionDetails: {
        actionType,
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  const handleClosePasskeyVerifiedModal = (buttonId) => {
    // console.log('PasskeyVerifiedModal handleClosePasskeyVerifiedModal clicked');
    setPasskeyVerifiedModalClosed(true);
    AppObservableStore.setShowClaimProfileWithEmailModal(false);
    AppObservableStore.setShowClaimProfileWithOtherWaysModal(false);
    sendGTMDataLayer('closeModal', buttonId);
  };

  const dialogTitleJSX = (
    <>
      <PasskeyVerifiedHeader>
        Congratulations!
      </PasskeyVerifiedHeader>
      <PasskeyVerifiedHeader>
        You can now manage and edit
        {' '}
        {politicianName}
        &#39;s account.
      </PasskeyVerifiedHeader>
    </>
  );

  const textFieldJSX = (
    <>
      <ul>
        {
          usersEditingPermissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))
        }
      </ul>
      {(verificationEmails && verificationEmails.length > 0) && (
        <>
          <OtherEditorsHeader>
            All editors
          </OtherEditorsHeader>
          <ul>
            {
              verificationEmails.map((emailThatCanEdit, index) => (
                <li key={`${emailThatCanEdit}-${index}`}>{emailThatCanEdit}</li>
              ))
            }
          </ul>
        </>
      )}
      <SubmitButtonContainer>
        <SubmitButton id="closePasskeyVerifiedModal" onClick={() => handleClosePasskeyVerifiedModal('closePasskeyVerifiedModal')}>
          Get started
        </SubmitButton>
      </SubmitButtonContainer>
    </>
  );
  return (
    <ModalDisplayTemplateB
      dialogTitleJSX={dialogTitleJSX}
      show={passkeyVerified && !passkeyVerifiedModalClosed}
      toggleModal={closePasskeyVerifiedModal}
      textFieldJSX={textFieldJSX}
    />
  );
}

PasskeyVerifiedModal.propTypes = {
  closePasskeyVerifiedModal: PropTypes.func,
  passkeyVerified: PropTypes.bool,
  politicianName: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
  verificationEmails: PropTypes.array,
};

const PasskeyVerifiedHeader = styled('h1')`
  font-size: 18px;
  margin: 0 0 0 24px;
`;

const OtherEditorsHeader = styled('h4')`
  margin: 0 0 0 24px;
`;

const SubmitButtonContainer = styled('div')`
  display: flex;
  justify-content: center;
  margin: 34px 0 0 0;
  width: 100%;
`;

export default PasskeyVerifiedModal;

