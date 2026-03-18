import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
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
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../../../utils/lookupPageNameAndPageTypeDict';

function VerifyWithEmailModal ({ closeVerifyWithEmailModal, politicianName, politicianWeVoteId }) {
  const campaignXWeVoteIdRef = useRef('');
  const [emailDisplayed, setEmailDisplayed] = useState('');
  const [emailOptionSelectedValue, setEmailOptionSelectedValue] = useState(null);
  const [passkey, setPasskey] = useState('');
  const [passkeyReceivedButNotAccepted, setPasskeyReceivedButNotAccepted] = useState(false);
  const [passkeyVerified, setPasskeyVerified] = useState(false); // switch to toggle PasskeyVerifiedModal
  const politicianWeVoteIdRef = useRef(politicianWeVoteId);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationEmails, setVerificationEmails] = useState([]);
  const [verificationEmailsDictionary, setVerificationEmailsDictionary] = useState([]);

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
    };
    if (destinationPageName) {
      dataLayerObject.destinationDetails = {
        destinationPageName: destinationPageName || 'notSet',
        destinationPageType: destinationPage.pageType || 'notSet',
        destinationPathname: currentPathname,
      };
    }
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  const handleCloseVerifyWithEmailModal = (buttonId) => {
    AppObservableStore.setShowClaimProfileWithEmailModal(false);
    sendGTMDataLayer('closeModal', buttonId);
  };

  const handleEmailOptionClick = (value, displayEmail) => {
    setEmailDisplayed(displayEmail);
    setEmailOptionSelectedValue((prev) => (prev === value ? null : value));
  };

  const handlePasskeyChange = (e) => {
    setPasskey(e.target.value);
    setPasskeyReceivedButNotAccepted(false);
  };

  const handleOpenVerifyOtherWaysModal = (buttonId) => {
    AppObservableStore.setShowClaimProfileWithEmailModal(false);
    AppObservableStore.setShowClaimProfileWithOtherWaysModal(true);
    sendGTMDataLayer('openModal', buttonId, 'VerifyOtherWaysModal');
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
    const emailValuesArray = newPublicEmailsDictionary.map((obj) => Object.values(obj)[0]);
    setVerificationEmailsDictionary(newPublicEmailsDictionary);
    setVerificationEmails(emailValuesArray);
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
    const passkeyVerifiedTemp = VoterStore.getPasskeyVerified();
    const passkeyReceivedButNotAcceptedTemp = VoterStore.getPasskeyReceivedButNotAccepted();
    // console.log('onVoterStoreChange, passkeyReceivedButNotAccepted:', passkeyReceivedButNotAccepted);
    if (passkeyReceivedButNotAcceptedTemp) {
      setPasskeyReceivedButNotAccepted(true);
      // Set a timer to change the value back to false after 5 seconds
      setTimeout(() => {
        setPasskeyReceivedButNotAccepted(false);
      }, 5000); // 5000 milliseconds = 5 seconds
    } else if (passkeyVerifiedTemp) {
      if (VoterStore.getVoterIsSignedIn()) {
        // console.log('--------- onVoterStoreChange in VerifyWithEmailModal, Voter is signed in and passkeyVerified -----------');
        setPasskeyVerified(true);
      } else {
        // console.log('--------- onVoterStoreChange in VerifyWithEmailModal, passkeyVerified sign in needed -----------');
        AppObservableStore.setShowSignInModal(true);
      }
    } else if (emailAddressStatus.sign_in_code_email_sent) {
      setShowVerifyModal(true);
    }
  }, []);

  const onChangeRadio = () => {
    //
  };

  const submitEmailForVerification = (buttonId) => {
    // if setShowVerifyModal is an email address, send it
    if (emailOptionSelectedValue.includes('@')) { // Is valid email address
      VoterActions.sendSignInCodeEmail(emailOptionSelectedValue);
    } else if (emailOptionSelectedValue.includes('email')) { // Is EmailWeVoteId
      VoterActions.sendSignInCodeEmail('', emailOptionSelectedValue);
    }
    // verificationKey is an emailWeVoteId, make different call
    setShowVerifyModal(true);
    sendGTMDataLayer('navigate', buttonId, 'SettingsVerifySecretCode');
  };

  const submitPasskeyForVerification = (buttonId) => {
    VoterActions.verifyPoliticianPasskey(passkey, politicianWeVoteId);
    sendGTMDataLayer('save', buttonId, 'PasskeyVerification');
  };

  const closeFromPasskeyVerifiedModal = (buttonId) => {
    if (closeVerifyWithEmailModal) {
      closeVerifyWithEmailModal(true);
    }
    setPasskeyVerified(false);
    AppObservableStore.setShowClaimProfileWithEmailModal(false);
    sendGTMDataLayer('closeModal', buttonId);
  };

  const closeSignInModalFromVerifySecretCode = () => {
    // console.log('VoterEmailAddressEntry closeSignInModalFromVerifySecretCode');
    setTimeout(() => {
      VoterActions.clearSecretCodeVerificationStatusAndEmail();
    }, 1000);
    setShowVerifyModal(false);
  };

  const closeVerifyModalFromVerifySecretCode = () => {
    // console.log('VoterEmailAddressEntry closeVerifyModalFromVerifySecretCode');
    setTimeout(() => {
      // A timer hack to prevent a "React state update on an unmounted component"
      VoterActions.clearSecretCodeVerificationStatusAndEmail();
      AppObservableStore.setShowClaimProfileWithEmailModal(false);
    }, 1000);
    setShowVerifyModal(false);
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
      {(verificationEmailsDictionary && verificationEmailsDictionary.length > 0) && (
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
          {verificationEmailsDictionary.map((emailDict) => {
            // console.log('verificationEmailsDictionary.map emailDict: ', emailDict);
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
            id="sendVerificationCode"
            onClick={() => submitEmailForVerification('sendVerificationCode')}
          >
            Send verification code
          </VerificationButton>
          <OrDivider>
            <OrDividerLine />
            <OrDividerText>or</OrDividerText>
            <OrDividerLine />
          </OrDivider>
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
      <VerificationButton
        disabled={!passkey}
        id="submitPasskey"
        onClick={() => submitPasskeyForVerification('submitPasskey')}
      >
        Verify with passkey
      </VerificationButton>
      {passkeyReceivedButNotAccepted && (
        <PasskeyReceivedButNotAcceptedMessage>
          Passkey was not accepted. Please double-check the passkey and try again. If it still doesn&apos;t work, please email us at support@wevote.us.
        </PasskeyReceivedButNotAcceptedMessage>
      )}
      <SectionDivider />
      <OtherWaysVerifyButtonFull
        onClick={() => handleOpenVerifyOtherWaysModal('openVerifyOtherWaysModal')}
      >
        See other ways to verify
      </OtherWaysVerifyButtonFull>
      <PasskeyVerifiedModal
        closePasskeyVerifiedModal={closeFromPasskeyVerifiedModal}
        passkeyVerified={passkeyVerified}
        politicianName={politicianName}
        politicianWeVoteId={politicianWeVoteId}
        verificationEmails={verificationEmails}
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
      toggleModal={() => handleCloseVerifyWithEmailModal('cancelVerifyWithEmailModal')}
      show={AppObservableStore.getShowClaimProfileWithEmailModal()}
      textFieldJSX={textFieldJsx}
      tallMode
    />
  );
}

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

const OrDivider = styled('div')`
  align-items: center;
  display: flex;
  margin: 16px 0;
  width: 100%;
`;

const OrDividerLine = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutralUI100};
  flex: 1;
`;

const OrDividerText = styled('span')`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 14px;
  padding: 0 12px;
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

const PasskeyReceivedButNotAcceptedMessage = styled('div')`
  color: ${DesignTokenColors.alert900};
  font-size: 14px;
  font-weight: 600;
  margin: 8px 0 0 0;
  text-align: center;
`;

const OtherWaysVerifyButtonFull = styled(OtherWaysVerifyButtonAnchor)`
  font-weight: 700;
  width: 100%;
`;

export default VerifyWithEmailModal;
