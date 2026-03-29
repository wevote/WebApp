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
    <VerifyWithEmailHeaderContainer>
      <VerifyWithEmailModalHeader>
        <span className="u-show-mobile">
          Verify as candidate
        </span>
        <span className="u-show-desktop-tablet">
          To edit this profile, verify as a candidate
        </span>
      </VerifyWithEmailModalHeader>
      <VerifyWithEmailModalBody>
        Verify with the email you have access to
        <br />
        <VerifyWithEmailModalStrong>OR</VerifyWithEmailModalStrong>
        {' '}
        enter the passkey you received
      </VerifyWithEmailModalBody>
      <OtherWaysVerifyButtonFull
          onClick={() => handleOpenVerifyOtherWaysModal('openVerifyOtherWaysModal')}
      >
        See other ways to verify
      </OtherWaysVerifyButtonFull>
    </VerifyWithEmailHeaderContainer>
  );

  const textFieldJsx = (
    <VerifyWithEmailModalContainer>
      {(verificationEmailsDictionary && verificationEmailsDictionary.length > 0) && (
        <BubbleSection>
          <VerifyWithEmailSubheader>
            Verify with email
          </VerifyWithEmailSubheader>
          {verificationEmailsDictionary
            .filter((emailDict, index, self) => {
              const [submitValue] = Object.entries(emailDict)[0];
              return index === self.findIndex((dict) => {
                const [value] = Object.entries(dict)[0];
                return value === submitValue;
              });
            })
            .map((emailDict) => {
              // console.log('verificationEmailsDictionary.map emailDict: ', emailDict);
              const [submitValue, displayEmail] = Object.entries(emailDict)[0];
              const foundPublicly = !displayEmail.includes('*');
              return (
                <EmailSelection
                  htmlFor={`public-email-option-${submitValue}`}
                  key={`selectEmail-${submitValue}`}
                  onChange={onChangeRadio}
                  onClick={() => handleEmailOptionClick(submitValue, displayEmail)}
                >
                  <EmailSelectionInnerWrapper>
                    <EmailRadioInput
                      id={`public-email-option-${submitValue}`}
                      type="radio"
                      checked={emailOptionSelectedValue === submitValue}
                      onChange={onChangeRadio}
                      value={submitValue}
                    />
                    <EmailSelectionRightBlock>
                      <div>
                        {displayEmail}
                      </div>
                      {foundPublicly ? (
                        <EmailVisibility>
                          <span className="u-show-mobile">
                            Publicly available
                          </span>
                          <span className="u-show-desktop-tablet">
                            Found in publicly available materials
                          </span>
                        </EmailVisibility>
                      ) : (
                        <EmailVisibility>
                          <span className="u-show-mobile">
                            Not visible to the public
                          </span>
                          <span className="u-show-desktop-tablet">
                            Not public but linked to this account
                          </span>
                        </EmailVisibility>
                      )}
                    </EmailSelectionRightBlock>
                  </EmailSelectionInnerWrapper>
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
        </BubbleSection>
      )}
      <OrDivider>
        <OrDividerLine />
        <OrDividerText>OR</OrDividerText>
        <OrDividerLine />
      </OrDivider>
      <BubbleSection>
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
      </BubbleSection>
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

const EmailVisibility = styled('div')`
  color: ${DesignTokenColors.neutral300};
  font-style: italic;
`;

const VerifyWithEmailModalHeader = styled('h1')`
  font-size: 18px;
  margin: 0;
  padding: 0;
`;

const VerifyWithEmailModalBody = styled('div')`
  font-size: 14px;
  font-weight: 400;
  padding: 0 0 0 0;
  color: ${DesignTokenColors.neutralUI600};
  text-align: center;
  margin-top: 32px;
`;

const VerifyWithEmailModalStrong = styled('strong')`
  font-weight: 700;
  color: black;
`;

const VerifyWithEmailHeaderContainer = styled('div')`
  margin-bottom: 8px;
  width: 100%;
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
  margin: 8px 0 0 0;
  padding: 0;
`;

const VerifyWithEmailSubheader = styled('h2')`
  font-size: 14px;
  font-weight: 700;
  margin-top: 18px;
  text-align: center;
  margin-bottom: 18px;
`;

const EmailSelection = styled('div')`
  align-items: center;
  background-color: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 8px;
  box-shadow: ${standardBoxShadow()};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  height: 70px;
  justify-content: start;
  margin: 4px 0 8px 0;
  padding: 8px 10px 0 10px;

  &:hover {
    background-color: ${DesignTokenColors.neutral50};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Shadow effect on hover */
  }
`;

const EmailSelectionInnerWrapper = styled('div')`
  align-items: start;
  justify-content: start;
  display: flex;
`;

const EmailSelectionRightBlock = styled('label')`
  justify-content: center;
  display: flex;
  flex-direction: column;
  font-size: 14px;

  & > div {
    word-break: break-all;
    overflow-wrap: break-word;
  }
`;

const EmailRadioInput = styled('input')`
  margin-right: 6px;
  margin-top: 3px;
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
    color: ${DesignTokenColors.neutralUI700};
    background-color: ${DesignTokenColors.neutralUI200};
    border: 1px solid ${DesignTokenColors.neutralUI300};
  }
`;

const OrDivider = styled('div')`
  align-items: center;
  display: flex;
  margin: 16px 0;
  width: 100%;
`;

const OrDividerLine = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutralUI300};
  flex: 1;
`;

const OrDividerText = styled('span')`
  color: black;
  font-size: 14px;
  padding: 0 12px;
  font-weight: 700;
`;

const PasskeyVerificationInput = styled('input')`
  border: 1px solid ${DesignTokenColors.neutralUI200};
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
  font-weight: 400;
  width: 100%;
`;

const BubbleSection = styled('div')`
  background-color: ${DesignTokenColors.neutral100};
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 8px;
`;

export default VerifyWithEmailModal;
