import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../Style/DesignTokenColors';
import ModalDisplayTemplateA from '../../../../components/Widgets/ModalDisplayTemplateA';
import standardBoxShadow from '../../Style/standardBoxShadow';
import PasskeyVerifiedModal from './PasskeyVerifiedModal';
import AppObservableStore from '../../../stores/AppObservableStore';
import PoliticianStore from '../../../stores/PoliticianStore';
import CampaignStore from '../../../stores/CampaignStore';
import VoterActions from '../../../../actions/VoterActions';
import VoterStore from '../../../../stores/VoterStore';
import SettingsVerifySecretCode from '../../Settings/SettingsVerifySecretCode';

const VerifyWithEmailModal = ({ politicianName, politicianWeVoteId }) => {
  const campaignXWeVoteIdRef = useRef('');
  const [emailDisplayed, setEmailDisplayed] = useState('');
  const [emailOptionSelectedValue, setEmailOptionSelectedValue] = useState(null);
  const [passkey, setPasskey] = useState('');
  const [passkeyVerified, setPasskeyVerified] = useState(false); // switch to toggle PasskeyVerifiedModal
  const politicianWeVoteIdRef = useRef(politicianWeVoteId);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationEmails, setVerificationEmails] = useState([]);

  const handleCloseVerifyWithEmailModal = () => {
    AppObservableStore.setShowClaimProfileWithEmailModal(false);
  };

  const handleEmailOptionClick = (value, displayEmail) => {
    setEmailDisplayed(displayEmail);
    setEmailOptionSelectedValue((prev) => (prev === value ? null : value));
  };

  const handlePasskeyChange = (e) => {
    setPasskey(e.target.value);
  };

  const handleOpenVerifyOtherWaysModal = () => {
    AppObservableStore.setShowClaimProfileWithEmailModal(false);
    AppObservableStore.setShowClaimProfileWithOtherWaysModal(true);
  };

  const extractEmailsForVerification = () => {
    // Pull from the politician's direct emails
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    const publicEmailsFromPolitician = PoliticianStore.getPoliticianAllEmails(currentPoliticianWeVoteId);
    const publicEmailDicts = publicEmailsFromPolitician.map((email) => ({ [email]: email }));
    // console.log('extractEmailsForVerification, publicEmailDicts: ', publicEmailDicts);
    // Pull from the staff who have been given campaign ownership rights
    const currentCampaignXWeVoteId = campaignXWeVoteIdRef.current;
    const staffEmailsFromCampaign = CampaignStore.getAllStaffEmailDicts(currentCampaignXWeVoteId);
    // console.log('extractEmailsForVerification, staffEmailsFromCampaign: ', staffEmailsFromCampaign);
    // We protect hidden emails on the API server now instead of here in WebApp
    // const staffEmailsFromCampaignForDisplay = protectEmailsInList(staffEmailsFromCampaign);
    const newPublicEmailsDictionary = [...new Set([...publicEmailDicts, ...staffEmailsFromCampaign])];
    // console.log('extractEmailsForVerification, newPublicEmailsDictionary: ', newPublicEmailsDictionary);
    setVerificationEmails(newPublicEmailsDictionary);
  };

  const onCampaignStoreChange = useCallback(() => {
    const currentCampaignXWeVoteId = campaignXWeVoteIdRef.current;
    if (currentCampaignXWeVoteId) {
      extractEmailsForVerification();
    }
  }, []);

  const onPoliticianStoreChange = useCallback(() => {
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    if (currentPoliticianWeVoteId) {
      const politician = PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId);
      if (politician.linked_campaignx_we_vote_id) {
        campaignXWeVoteIdRef.current = politician.linked_campaignx_we_vote_id;
        // console.log('onPoliticianStoreChange, politician linked_campaignx_we_vote_id: ', politician.linked_campaignx_we_vote_id);
      }
      extractEmailsForVerification();
    }
  }, []);

  const onVoterStoreChange = useCallback(() => {
    const emailAddressStatus = VoterStore.getEmailAddressStatus();
    if (emailAddressStatus.sign_in_code_email_sent) {
      // Object.assign(newState, {
      //   displayEmailVerificationButton: false,
      //   emailAddressStatus: {
      //     sign_in_code_email_sent: false,
      //   },
      //   showVerifyModal: true,
      // });
      setShowVerifyModal(true);
    }
  }, []);

  const onChangeRadio = () => {
    //
  };

  const submitEmailForVerification = () => {
    // if setShowVerifyModal is an email address, send it
    if (emailOptionSelectedValue.includes('@')) { // Is valid email address
      VoterActions.sendSignInCodeEmail(emailOptionSelectedValue);
    } else if (emailOptionSelectedValue.includes('email')) { // Is EmailWeVoteId
      VoterActions.sendSignInCodeEmail('', emailOptionSelectedValue);
    }
    // verificationKey is an emailWeVoteId, make different call
    setShowVerifyModal(true);
  };

  const closeSignInModalLocal = () => {
    // console.log('VoterEmailAddressEntry closeSignInModalLocal');
    // if (this.props.closeSignInModal) {
    //   this.props.closeSignInModal();
    // }
    setShowVerifyModal(false);
  };

  const closeSignInModalFromVerifySecretCode = () => {
    // console.log('VoterEmailAddressEntry closeSignInModalFromVerifySecretCode');
    setTimeout(() => {
      VoterActions.clearSecretCodeVerificationStatusAndEmail();
    }, 1000);
    closeSignInModalLocal();
  };

  const closeVerifyModalFromVerifySecretCode = () => {
    // console.log('VoterEmailAddressEntry closeVerifyModalFromVerifySecretCode');
    // this.setState({
    //   displayEmailVerificationButton: false,
    //   emailAddressStatus: {
    //     sign_in_code_email_sent: false,
    //   },
    //   showVerifyModal: false,
    //   signInCodeEmailSentAndWaitingForResponse: false,
    // });
    setTimeout(() => {
      // A timer hack to prevent a "React state update on an unmounted component"
      VoterActions.clearSecretCodeVerificationStatusAndEmail();
      AppObservableStore.setShowClaimProfileWithEmailModal(false);
    }, 1000);
    // if (this.props.closeVerifyModal) {
    //   this.props.closeVerifyModal();
    // }
    closeSignInModalLocal();
  };

  useEffect(() => {
    // console.log('VoterPositionEntryAndDisplay useEffect, politicianWeVoteId: ', politicianWeVoteId);
    politicianWeVoteIdRef.current = politicianWeVoteId;
    if (politicianWeVoteId) {
      onPoliticianStoreChange();
    }
  }, [onPoliticianStoreChange, politicianWeVoteId]);

  useEffect(() => {
    const campaignStoreListener = CampaignStore.addListener(onCampaignStoreChange);
    onCampaignStoreChange();
    return () => {
      campaignStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    const politicianStoreListener = PoliticianStore.addListener(onPoliticianStoreChange);
    onPoliticianStoreChange();
    return () => {
      politicianStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();
    return () => {
      voterStoreListener.remove();
    };
  }, []);

  const dialogTitleJsx = (
    <VerifyWithEmailModalHeader>
      To edit this profile, verify as a candidate
    </VerifyWithEmailModalHeader>
  );

  const textFieldJsx = (
    <VerifyWithEmailModalContainer>
      {verificationEmails.length > 0 && (
        <>
          <VerifyWithEmailSubheader>
            Verify with email
          </VerifyWithEmailSubheader>
          <VerifyWithEmailModalSubtitle>
            We found these emails associated with
            {' '}
            {politicianName}
            . Select one where you can receive a verification email.
            {' '}
            Some emails partially hidden for your safety.
          </VerifyWithEmailModalSubtitle>
          {verificationEmails.map((emailDict) => {
            // console.log('verificationEmails.map emailDict: ', emailDict);
            const [submitValue, displayEmail] = Object.entries(emailDict)[0];
            return (
              <EmailSelection
                htmlFor={`public-email-option-${submitValue}`}
                key={submitValue}
                onChange={onChangeRadio}
                onClick={() => handleEmailOptionClick(submitValue, displayEmail)}
              >
                <EmailRadioInput
                  id={`public-email-option-${submitValue}`}
                  type="radio"
                  checked={emailOptionSelectedValue === submitValue}
                  onChange={onChangeRadio}
                  value={submitValue}
                />
                {displayEmail}
              </EmailSelection>
            );
          })}
          <VerificationButton
            disabled={emailOptionSelectedValue === null}
            onClick={submitEmailForVerification}
          >
            Send verification code
          </VerificationButton>
          <SectionDivider />
        </>
      )}
      <VerifyWithEmailSubheader>
        Verify with passkey received through candidate contact form or social media
      </VerifyWithEmailSubheader>
      <PasskeyVerificationInput
        type="text"
        placeholder="Passkey"
        value={passkey}
        onChange={handlePasskeyChange}
      />
      <SectionDivider />
      <OtherWaysVerifyButtonFull
        onClick={handleOpenVerifyOtherWaysModal}
      >
        See other ways to verify
      </OtherWaysVerifyButtonFull>
      <PasskeyVerifiedModal
        passkeyVerified={passkeyVerified}
        setPasskeyVerified={setPasskeyVerified}
        politicianName={politicianName}
      />
      {showVerifyModal && (
        <SettingsVerifySecretCode
          show={showVerifyModal}
          closeSignInModal={closeSignInModalFromVerifySecretCode}
          closeVerifyModal={closeVerifyModalFromVerifySecretCode}
          voterEmailAddress={emailDisplayed}
        />
      )}
    </VerifyWithEmailModalContainer>
  );

  return (
    <ModalDisplayTemplateA
      dialogTitleJSX={dialogTitleJsx}
      toggleModal={handleCloseVerifyWithEmailModal}
      show={AppObservableStore.getShowClaimProfileWithEmailModal()}
      textFieldJSX={textFieldJsx}
      tallMode
    />
  );
};

VerifyWithEmailModal.propTypes = {
  closeVerifyWithEmailModal: PropTypes.func,
  politicianName: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const VerifyWithEmailModalHeader = styled('h1')`
  font-size: 18px;
  margin: 0;
  padding: 0;
`;

const VerifyWithEmailModalContainer = styled('div')`
  margin: 8px 0 24px 0;
`;

const VerifyWithEmailModalSubtitle = styled('p')`
  font-size: 14px;
  margin: 0;
  padding: 0;
`;

const OtherWaysVerifyButtonAnchor = styled('button')`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.primary600};
  font-size: 14px;
  margin: 0;
  padding: 0;
`;

const VerifyWithEmailSubheader = styled('h2')`
  font-size: 14px;
  font-weight: 700;
  margin-top: 18px;
`;

const EmailSelection = styled('label')`
  align-items: center;
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 8px;
  box-shadow: ${standardBoxShadow()};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  height: 60px;
  margin: 4px 0 8px 0;
  padding: 0 16px;

  &:hover {
    background-color: ${DesignTokenColors.neutral50};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Shadow effect on hover */
  }
`;

const EmailRadioInput = styled('input')`
  margin-right: 6px;
`;

const VerificationButton = styled('button')`
  border: none;
  border-radius: 20px;
  color: white;
  background-color: ${DesignTokenColors.primary600};
  font-size: 12px;
  height: 40px;
  margin: 8px 0 2px 0;
  width: 100%;

  &:disabled {
    color: ${DesignTokenColors.neutralUI600};
    background-color: ${DesignTokenColors.neutralUI100};
  }
`;

const SectionDivider = styled('hr')`
  border-top: 1px solid ${DesignTokenColors.neutralUI100};
  width: 100%;
`;

const PasskeyVerificationInput = styled('input')`
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 4px;
  font-size: 14px;
  height: 40px;
  margin: 8px 0 2px 0;
  padding: 0 8px;
  width: 100%;
`;

const OtherWaysVerifyButtonFull = styled(OtherWaysVerifyButtonAnchor)`
  font-weight: 700;
  width: 100%;
`;

export default VerifyWithEmailModal;
