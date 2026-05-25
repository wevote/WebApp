import { Edit as EditIcon } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PublicIcon from '@mui/icons-material/Public';
import { Box, Button, Checkbox, FormControlLabel, InputBase, Skeleton } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
import styled, { createGlobalStyle } from 'styled-components';
import SupportActions from '../../actions/SupportActions';
import SpeakerEndorsedOrOpposedSnippet from '../../common/components/Position/SpeakerEndorsedOrOpposedSnippet';
import VoterPositionEditTripleDot from '../../common/components/Position/VoterPositionEditTripleDot';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { CompactSecondaryText, CompactStatementText, SpeakerName, SpeakerStatement, SpeakerStatementWrapper } from '../../common/components/Style/PositionDisplayStyles';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import PoliticianStore from '../../common/stores/PoliticianStore';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';
import { possibleAppReview } from '../../utils/appReviewFunctions';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import ReviewAppModal from '../ReviewApps/ReviewAppModal';
import VisibilityExplainer from '../Settings/VisibilityExplainer';
import VisibilityToggleBar from '../Settings/VisibilityToggleBar';
import ModalDisplayTemplateB, { CommentContainer, InputBox, templateBStyles, TextFieldForm, TextFieldWrapper, UserInfoText, UserName } from '../Widgets/ModalDisplayTemplateB';
import VoterPositionEditNameAndPhotoModal from './VoterPositionEditNameAndPhotoModal';
import webAppConfig from '../../config';

/* global $ */

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


function VoterAvatarBlock ({ voterPhotoUrlMedium, voterFirstName, voterLastName }) {
  return (
    <VoterAvatar>
      {voterPhotoUrlMedium ? (
        <VoterImage
          alt="Voter"
          src={voterPhotoUrlMedium || avatarGeneric()}
        />
      ) : (
        <>
          <VoterFirstName>
            {voterFirstName[0]}
          </VoterFirstName>
          <VoterLastName>
            {voterLastName[0]}
          </VoterLastName>
        </>
      )}
    </VoterAvatar>
  );
}
VoterAvatarBlock.propTypes = {
  voterPhotoUrlMedium: PropTypes.string,
  voterFirstName: PropTypes.string,
  voterLastName: PropTypes.string,
};

function VoterPositionBlockComponent ({
  ballotItemWeVoteId, classes, compactMode, externalUniqueId,
  handleEditPositionModalOpen, handleEditProfileModalOpen, noBottomMargin, openDeleteConfirmationModal,
  politicianWeVoteId, position, positionExists, statementText, supportOrOpposeStanceExists,
  voterFirstName, voterLastName, voterName, voterPhotoUrlMedium,
}) {
  return (
    <VoterPositionContainer $noBottomMargin={noBottomMargin}>
      <VoterAvatarDisplayContainer>
        <VoterAvatarBlock
          voterPhotoUrlMedium={voterPhotoUrlMedium}
          voterFirstName={voterFirstName}
          voterLastName={voterLastName}
        />
        <EditIcon
          onClick={handleEditProfileModalOpen}
          className={classes.styledEditIcon}
        />
      </VoterAvatarDisplayContainer>
      <CommentContainerWrapper>
        {statementText && compactMode && (
          <CompactOwnCommentWrapper onClick={handleEditPositionModalOpen}>
            <CompactStatementText>{statementText}</CompactStatementText>
            <CompactEditHint>Click to edit</CompactEditHint>
          </CompactOwnCommentWrapper>
        )}
        {statementText && !compactMode && (
          <SpeakerInfoWrapperB>
            <SpeakerName>
              {voterName}
            </SpeakerName>
            <SpeakerStatementWrapper>
              <SpeakerStatement>
                <Suspense fallback={<></>}>
                  <ReadMore
                    textToDisplay={statementText}
                    numberOfLines={6}
                  />
                </Suspense>
              </SpeakerStatement>
            </SpeakerStatementWrapper>
          </SpeakerInfoWrapperB>
        )}
        {!statementText && (
          <CommentContainer>
            <InputBox
              type="text"
              placeholder="What's your opinion?"
              onClick={handleEditPositionModalOpen}
              readOnly
              style={{ overflow: 'hidden', width: '100%', minWidth: 0 }}
            />
          </CommentContainer>
        )}
        {!supportOrOpposeStanceExists && !compactMode && (
          <ItemActionBarContainer>
            <Suspense fallback={(
              <Box display="flex" gap={1}>
                <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
              </Box>
            )}
            >
              <ItemActionBar
                ballotItemWeVoteId={ballotItemWeVoteId}
                commentButtonHide
                externalUniqueId={`VoterPositionEntryAndDisplay-ItemActionBar-${ballotItemWeVoteId || politicianWeVoteId}-${externalUniqueId}`}
                politicianWeVoteId={politicianWeVoteId}
                positionPublicToggleWrapAllowed
                shareButtonHide
                useSupportWording
              />
            </Suspense>
          </ItemActionBarContainer>
        )}
        {positionExists && !compactMode && (
          <SpeakerPositionLikesSourceWrapper>
            <SpeakerEndorsedOrOpposedSnippet position={position} viewerIsPositionOwner />
            <VoterPositionEditTripleDot triggerDeleteOpinion={openDeleteConfirmationModal} triggerEditOpinion={handleEditPositionModalOpen} />
          </SpeakerPositionLikesSourceWrapper>
        )}
      </CommentContainerWrapper>
    </VoterPositionContainer>
  );
}
VoterPositionBlockComponent.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  compactMode: PropTypes.bool,
  politicianWeVoteId: PropTypes.string,
  externalUniqueId: PropTypes.string,
  handleEditProfileModalOpen: PropTypes.func,
  noBottomMargin: PropTypes.bool,
  openDeleteConfirmationModal: PropTypes.func,
  handleEditPositionModalOpen: PropTypes.func.isRequired,
  position: PropTypes.object,
  positionExists: PropTypes.bool,
  statementText: PropTypes.string,
  supportOrOpposeStanceExists: PropTypes.bool,
  voterFirstName: PropTypes.string,
  voterLastName: PropTypes.string,
  voterName: PropTypes.string,
  voterPhotoUrlMedium: PropTypes.string,
};

function VoterPositionEntryAndDisplay ({ ballotItemWeVoteId, classes, compactMode, externalUniqueId, noBottomMargin, onModalClose, openEditModalOnLoad, politicianWeVoteId }) {
  const isMeasure = stringContains('meas', ballotItemWeVoteId);
  const effectiveWeVoteId = ballotItemWeVoteId || politicianWeVoteId;
  const kindOfBallotItem = isMeasure ? 'MEASURE' : 'CANDIDATE';

  const effectiveWeVoteIdRef = useRef(effectiveWeVoteId);

  const [ballotItemName, setBallotItemName] = useState('');
  const [draftStatementText, setDraftStatementText] = useState('');
  const [draftSelectedStance, setDraftSelectedStance] = useState('SUPPORT');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [position, setPosition] = useState({});
  const [positionExists, setPositionExists] = useState(false);
  const [selectedStance, setSelectedStance] = useState('SUPPORT');
  const [setAsDefaultVisibility, setSetAsDefaultVisibility] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showEditPositionModal, setShowEditPositionModal] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showNegativeModal, setShowNegativeModal] = useState(false);
  const [statementText, setStatementText] = useState('');
  const [supportOrOpposeStanceExists, setSupportOrOpposeStanceExists] = useState(false);
  const [visibilityOnly, setVisibilityOnly] = useState(false);
  const [visibilitySetting, setVisibilitySetting] = useState('FRIENDS_ONLY'); // 'SHOW_PUBLIC', 'FRIENDS_ONLY', 'ME_ONLY'
  const [voterFirstName, setVoterFirstName] = useState('');
  const [voterLastName, setVoterLastName] = useState('');
  const [voterName, setVoterName] = useState('');
  const [voterPhotoUrlMedium, setVoterPhotoUrlMedium] = useState('');

  const handleEditProfileModalOpen = () => {
    if (VoterStore.getVoterIsSignedIn()) {
      setIsEditProfileModalOpen(true);
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
  };

  const handleEditProfileModalClose = () => {
    setIsEditProfileModalOpen(false);
  };

  const setVisibilitySettingGate = (visibilitySettingTemp) => {
    if (visibilitySettingTemp === 'SHOW_PUBLIC') {
      if (VoterStore.getVoterIsSignedIn()) {
        setVisibilitySetting(visibilitySettingTemp);
      } else {
        AppObservableStore.setShowMakePublicGateModal(true);
      }
    } else {
      setVisibilitySetting(visibilitySettingTemp);
    }
  };

  const toggleDeleteConfirmationModalLocal = () => {
    setShowDeleteConfirmationModal((prev) => !prev); // Toggle the modal
    if (showDeleteConfirmationModal) {
      restoreStylesAfterCordovaKeyboard('VoterPositionEntryAndDisplay');
    }
  };

  const toggleEditModalLocal = (isClosedWithoutSubmitting = true) => {
    // console.log('VoterPositionEntryAndDisplay.toggleEditModalLocal: ballotItemWeVoteId:', ballotItemWeVoteId, ', effectiveWeVoteId: ', effectiveWeVoteId, 'kindOfBallotItem:', kindOfBallotItem, 'politicianWeVoteId:', politicianWeVoteId, 'draftStatementText:', draftStatementText, ', visibilitySetting:', visibilitySetting);
    // Track modal close event only when user closes without submitting (e.g., clicking X button)
    // When closing after successful submission, pass false to avoid duplicate tracking
    if (showEditPositionModal && isClosedWithoutSubmitting) {
      const closeButtonId = `closeModalDisplayTemplateBeditPosition-${effectiveWeVoteId}-${externalUniqueId}`;
      const dataLayerObject = {
        event: 'action',
        pageDetails: getPageDetails(),
        userDetails: VoterStore.getAnalyticsUserDetails(),
        actionDetails: {
          actionType: 'close',
          componentName: 'VoterPositionEntryAndDisplay',
          buttonId: closeButtonId,
        },
      };
      if (politicianWeVoteId) {
        dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
      }
      TagManager.dataLayer({ dataLayer: dataLayerObject });
    }

    setShowEditPositionModal((prev) => !prev);

    if (showEditPositionModal) {
      // Modal is closing — revert unsaved changes by re-reading from the store
      if (isClosedWithoutSubmitting) {
        // eslint-disable-next-line no-use-before-define
        onSupportStoreChange();
      }
      restoreStylesAfterCordovaKeyboard('VoterPositionEntryAndDisplay');
      if (onModalClose) onModalClose();
    }
  };

  const openDeleteConfirmationModal = () => {
    toggleDeleteConfirmationModalLocal();
    // After further reflection, we don't need to be signed in to delete your own position
    // if (VoterStore.getVoterIsSignedIn()) {
    //   toggleDeleteConfirmationModalLocal();
    // } else {
    //   AppObservableStore.setShowSignInModal(true);
    // }
  };

  const onAppObservableStoreChange = useCallback((token) => {
    const tokenText = token ? token.text : '';
    // console.log('onAppObservableStoreChange, tokenText:', tokenText);
    const showNegativeModalFromMessage = tokenText.includes('showNegativeFeedbackModal') && tokenText.includes('POSITION');
    const showingNegativeFeedbackModal = AppObservableStore.getShowingNegativeFeedbackModal();
    if (!showingNegativeFeedbackModal && showNegativeModalFromMessage) {
      setShowNegativeModal(true);
    }
    // Listen for "Make public" from ItemActionBar opening this modal
    if (tokenText.includes('showEditPositionModal')) {
      const modalWeVoteId = AppObservableStore.getEditPositionModalPoliticianWeVoteId();
      if (AppObservableStore.getShowEditPositionModal() && modalWeVoteId === effectiveWeVoteId) {
        if (AppObservableStore.getEditPositionModalSetPublic()) {
          if (VoterStore.getVoterIsSignedIn()) {
            setTimeout(() => setVisibilitySetting('SHOW_PUBLIC'), 300);
          }
          AppObservableStore.setEditPositionModalSetPublic(false);
        }
        setVisibilityOnly(AppObservableStore.getEditPositionModalVisibilityOnly());
        setShowEditPositionModal(true);
        AppObservableStore.setShowEditPositionModal(false);
      }
    }
  }, [effectiveWeVoteId]);

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  // useRef to reference the post input
  const activityPostInputRef = useRef(null);

  const onSupportStoreChange = useCallback(() => {
    const currentEffectiveWeVoteId = effectiveWeVoteIdRef.current;
    // console.log('VoterPositionEntryAndDisplay.onSupportStoreChange:  ballotItemWeVoteId:', ballotItemWeVoteId, ', effectiveWeVoteId:', effectiveWeVoteId, 'kindOfBallotItem:', kindOfBallotItem, 'politicianWeVoteId:', politicianWeVoteId, 'draftStatementText:', draftStatementText, ', visibilitySetting:', visibilitySetting);
    // console.log('VoterPositionEntryAndDisplay onSupportStoreChange, isMeasure:', isMeasure, ', currentEffectiveWeVoteId:', currentEffectiveWeVoteId);
    if (currentEffectiveWeVoteId) {
      let voterPositionIsPublic = false;
      let voterTextStatement = '';
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(isMeasure ? currentEffectiveWeVoteId : '', isMeasure ? '' : currentEffectiveWeVoteId);
      // console.log('VoterPositionEntryAndDisplay ballotItemStatSheet:', ballotItemStatSheet);
      if (ballotItemStatSheet) {
        ({ voterPositionIsPublic, voterTextStatement } = ballotItemStatSheet);
        const {
          voterOpposesBallotItem,
          voterSupportsBallotItem,
        } = ballotItemStatSheet;
        let stanceTemp = 'INFO_ONLY';
        if (voterSupportsBallotItem) {
          stanceTemp = 'SUPPORT';
        } else if (voterOpposesBallotItem) {
          stanceTemp = 'OPPOSE';
        }
        // console.log('VoterPositionEntryAndDisplay stanceTemp:', stanceTemp, 'voterSupportsBallotItem:', voterSupportsBallotItem, 'voterOpposesBallotItem:', voterOpposesBallotItem);
        const positionTemp = SupportStore.getPositionFromBallotItemWeVoteId(currentEffectiveWeVoteId);
        // console.log('onSupportStoreChange currentEffectiveWeVoteId: ', currentEffectiveWeVoteId, ', positionTemp: ', positionTemp);
        setPositionExists(!!(voterOpposesBallotItem || voterPositionIsPublic || voterSupportsBallotItem || voterTextStatement));
        setSupportOrOpposeStanceExists(voterOpposesBallotItem || voterSupportsBallotItem);
        setPosition({ ...positionTemp }); // Ensure a new object reference so the component re-renders
        setSelectedStance(stanceTemp);
        setStatementText(voterTextStatement);
        setVisibilitySetting(voterPositionIsPublic ? 'SHOW_PUBLIC' : 'FRIENDS_ONLY');
      }
    }
  }, [isMeasure]);

  const onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    setVoterPhotoUrlMedium(voter.voter_photo_url_medium);
    setVoterFirstName(voter.first_name || 'Anonymous');
    setVoterLastName(voter.last_name || 'Anonymous');
    setVoterName(voter.full_name || 'Anonymous');
  };

  const refreshBallotItemName = useCallback(() => {
    if (!ballotItemWeVoteId) return;
    if (isMeasure) {
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      if (measure && measure.ballot_item_display_name) {
        setBallotItemName(measure.ballot_item_display_name);
      }
    } else {
      const candidate = CandidateStore.getCandidateByWeVoteId(ballotItemWeVoteId);
      if (candidate && candidate.ballot_item_display_name) {
        setBallotItemName(candidate.ballot_item_display_name);
      }
    }
  }, [ballotItemWeVoteId]);

  useEffect(() => {
    refreshBallotItemName();
    const measureStoreListener = MeasureStore.addListener(refreshBallotItemName);
    const candidateStoreListener = CandidateStore.addListener(refreshBallotItemName);
    return () => {
      measureStoreListener.remove();
      candidateStoreListener.remove();
    };
  }, [refreshBallotItemName]);

  useEffect(() => {
    effectiveWeVoteIdRef.current = effectiveWeVoteId;
    // console.log('VoterPositionEntryAndDisplay useEffect-effectiveWeVoteId: effectiveWeVoteId:', effectiveWeVoteId, 'kindOfBallotItem:', kindOfBallotItem, 'politicianWeVoteId:', politicianWeVoteId, 'draftStatementText:', draftStatementText, ', visibilitySetting:', visibilitySetting);
  }, [effectiveWeVoteId]);

  useEffect(() => {
    if (effectiveWeVoteId) {
      onSupportStoreChange();
    }
  }, [effectiveWeVoteId, onSupportStoreChange]);

  useEffect(() => {
    if (!showEditPositionModal) return undefined;
    const focusInput = () => {
      const input = activityPostInputRef.current;
      if (input) {
        input.focus();
        const { length } = input.value;
        input.setSelectionRange(length, length);
      }
    };
    const raf = requestAnimationFrame(focusInput);
    // eslint-disable-next-line consistent-return
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [showEditPositionModal]);

  useEffect(() => {
    const supportStoreListener = SupportStore.addListener(onSupportStoreChange);
    onSupportStoreChange();
    return () => {
      supportStoreListener.remove();
    };
  }, [onSupportStoreChange]);

  useEffect(() => {
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();
    return () => {
      voterStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    if (openEditModalOnLoad) {
      setVisibilityOnly(false);
      setShowEditPositionModal(true);
    }
  }, [openEditModalOnLoad]);

  // Sync draft state when modal opens
  useEffect(() => {
    if (showEditPositionModal) {
      setDraftStatementText(statementText);
      setDraftSelectedStance(selectedStance);
      setShowLearnMore(false);
      // If opened via "Make public", auto-set visibility to SHOW_PUBLIC
      if (AppObservableStore.getEditPositionModalSetPublic()) {
        setVisibilitySetting('SHOW_PUBLIC');
        AppObservableStore.setEditPositionModalSetPublic(false);
      }
    }
  }, [showEditPositionModal]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFocusInput = () => {
    prepareForCordovaKeyboard('VoterPositionEntryAndDisplay');
    if (isMobileScreenSize()) {
      $("div[class^='DialogContentInnerWrapper']").css('margin-top', '0');
    }
  };

  const deletePosition = (e) => {
    e.preventDefault();
    const deleteVisibility = 'FRIENDS_ONLY';
    const selectedStanceTemp = 'INFO_ONLY';
    const statementTextTemp = '';
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, kindOfBallotItem, politicianWeVoteId, statementTextTemp, selectedStanceTemp, deleteVisibility);
    toggleDeleteConfirmationModalLocal();
  };

  const getVisibilitySettingForApi = () => {
    if (visibilitySetting === 'SHOW_PUBLIC') return 'SHOW_PUBLIC';
    return 'FRIENDS_ONLY';
  };

  const savePosition = (e) => {
    e.preventDefault();
    const saveVisibility = getVisibilitySettingForApi();

    let stanceLabel = 'Not sure yet';
    if (draftSelectedStance === 'SUPPORT') {
      stanceLabel = isMeasure ? 'Voting Yes' : 'Supporting';
    } else if (draftSelectedStance === 'OPPOSE') {
      stanceLabel = isMeasure ? 'Voting No' : 'Opposing';
    }

    const dataLayerObject = {
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
      actionDetails: {
        actionType: 'save',
        buttonId: 'positionEntrySave',
        componentName: 'VoterPositionEntryAndDisplay',
      },
      positionDetails: {
        positionStance: stanceLabel,
        hasPositionStatement: draftStatementText.trim() !== '',
        isPublic: visibilitySetting === 'SHOW_PUBLIC',
        positionWeVoteId: position.position_we_vote_id || null,
      },
    };
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    // console.log('VoterPositionEntryAndDisplay.voterPositionCommentSave:  ballotItemWeVoteId:', ballotItemWeVoteId, ', effectiveWeVoteId:', effectiveWeVoteId, 'kindOfBallotItem:', kindOfBallotItem, 'politicianWeVoteId:', politicianWeVoteId, 'draftStatementText:', draftStatementText, ', visibilitySetting:', visibilitySetting);
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, kindOfBallotItem, politicianWeVoteId, draftStatementText, draftSelectedStance, saveVisibility);
    possibleAppReview('POSITION');
    toggleEditModalLocal(false);
  };

  const updateStatementTextToBeSaved = (e) => {
    setDraftStatementText(e.target.value);
  };

  renderLog('VoterPositionEntryAndDisplay'); // Set LOG_RENDER_EVENTS to log all renders

  let editPositionModalTitleText;
  let saveButtonText;
  if (visibilityOnly) {
    editPositionModalTitleText = `Update visibility${ballotItemName && ` for ${ballotItemName}`}`;
    saveButtonText = 'Update visibility';
  } else if (positionExists) {
    editPositionModalTitleText = `Edit opinion${ballotItemName && ` about ${ballotItemName}`}`;
    saveButtonText = 'Save opinion';
  } else {
    editPositionModalTitleText = `Create opinion${ballotItemName && ` about ${ballotItemName}`}`;
    saveButtonText = 'Add opinion';
  }
  const deleteConfirmationModalTitleText = ballotItemName ? `Delete opinion about ${ballotItemName}?` : 'Delete opinion?';
  const statementPlaceholderText = 'What\'s on your mind?';
  const rowsToShow = isAndroid() ? 3 : 4;

  const editPositionModalJSX = (
    <TextFieldWrapper>
      <TextFieldForm
        className={classes.formStyles}
        onFocus={onFocusInput}
        onSubmit={savePosition}
      >
        {/* Avatar and name row */}
        <VoterAvatarDisplayContainer>
          <VoterAvatarBlock voterPhotoUrlMedium={voterPhotoUrlMedium} voterFirstName={voterFirstName} voterLastName={voterLastName} />
          <EditIcon
            onClick={handleEditProfileModalOpen}
            className={classes.styledEditIcon}
          />
          <UserInfoText>
            <UserName>
              {voterName}
            </UserName>
          </UserInfoText>
        </VoterAvatarDisplayContainer>

        {!visibilityOnly && (
          <>
            {/* Your opinion text area */}
            <OpinionSectionLabel>Your opinion:</OpinionSectionLabel>
            <OpinionTextFieldDiv>
              <InputBase
                classes={{ root: classes.inputStyles, inputMultiline: classes.inputMultiline }}
                id={`activityPostModalStatementText-${effectiveWeVoteId}-${externalUniqueId}`}
                inputRef={activityPostInputRef}
                multiline
                name="statementText"
                onChange={updateStatementTextToBeSaved}
                placeholder={statementPlaceholderText}
                rows={rowsToShow}
                value={draftStatementText || ''}
              />
            </OpinionTextFieldDiv>

            {/* Choose / Oppose / Undecided toggle buttons */}
            <OpinionSectionLabel>
              {isMeasure ? 'What is your position?' : 'Will you choose this candidate?'}
            </OpinionSectionLabel>
            <StanceToggleRow>
              <StanceToggleButton
                type="button"
                selected={draftSelectedStance === 'SUPPORT'}
                stanceType="support"
                onClick={() => setDraftSelectedStance('SUPPORT')}
              >
                <CheckIcon style={{ fontSize: 18, marginRight: 4, color: DesignTokenColors.confirmation500 }} />
                {isMeasure ? 'Vote Yes' : 'Choose'}
              </StanceToggleButton>
              <StanceToggleButton
                type="button"
                selected={draftSelectedStance === 'OPPOSE'}
                stanceType="oppose"
                onClick={() => setDraftSelectedStance('OPPOSE')}
              >
                <BlockIcon style={{ fontSize: 18, marginRight: 4, color: DesignTokenColors.alert800 }} />
                {isMeasure ? 'Vote No' : 'Oppose'}
              </StanceToggleButton>
              <StanceToggleButton
                type="button"
                selected={draftSelectedStance === 'INFO_ONLY'}
                stanceType="undecided"
                onClick={() => setDraftSelectedStance('INFO_ONLY')}
              >
                Undecided
              </StanceToggleButton>
            </StanceToggleRow>
          </>
        )}

        {/* Visibility toggle: Public / WeVote friends / Private */}
        <OpinionSectionLabel>
          Visibility of opinion &amp; choice for this
          {isMeasure ? ' measure' : ' candidate'}
          :
        </OpinionSectionLabel>
        <VisibilityToggleBar
          value={visibilitySetting}
          onChange={setVisibilitySettingGate}
        />

        {/* "Make SHOW_PUBLIC" prompt OR "Set as default" — cross-fade between them */}
        <VisibilityHintWrapper>
          <VisibilityHintFade visible={visibilitySetting !== 'SHOW_PUBLIC'}>
            <MakePublicRow>
              <PublicIcon />
              <MakePublicLink
                type="button"
                onClick={() => setVisibilitySettingGate('SHOW_PUBLIC')}
              >
                Make public
              </MakePublicLink>
              {' '}
              to influence more people.
            </MakePublicRow>
          </VisibilityHintFade>
          {nextReleaseFeaturesEnabled && (
            <VisibilityHintFade visible={visibilitySetting === 'SHOW_PUBLIC'}>
              <SetDefaultVisibilityRow>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={setAsDefaultVisibility}
                      onChange={(e) => setSetAsDefaultVisibility(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  )}
                  label={(
                    <SetDefaultLabel>
                      Set &lsquo;Public&rsquo; as the default visibility for future opinions &amp; choices.
                      <SetDefaultSubtext>
                        (Default can be changed in your
                        {' '}
                        <a href="/settings/profile">WeVote account page</a>
                        )
                      </SetDefaultSubtext>
                    </SetDefaultLabel>
                  )}
                />
              </SetDefaultVisibilityRow>
            </VisibilityHintFade>
          )}
        </VisibilityHintWrapper>

        {/* Learn more about visibility (expandable) */}
        <LearnMoreToggle
          type="button"
          onClick={() => setShowLearnMore((prev) => !prev)}
        >
          {showLearnMore ? <ExpandLessIcon style={{ fontSize: 20, marginRight: 4 }} /> : <ExpandMoreIcon style={{ fontSize: 20, marginRight: 4 }} />}
          Learn more about visibility
        </LearnMoreToggle>
        <LearnMoreCollapsible expanded={showLearnMore}>
          <VisibilityExplainer fontSize={13} />
        </LearnMoreCollapsible>

        {/* Action buttons */}
        <ModalButtonRow>
          {(positionExists || visibilityOnly) && (
            <CancelButton
              type="button"
              onClick={() => toggleEditModalLocal()}
            >
              Cancel
            </CancelButton>
          )}
          <Button
            id={`positionEntrySave-${effectiveWeVoteId}-${externalUniqueId}`}
            variant="contained"
            color="primary"
            classes={{ root: classes.saveButtonRoot }}
            type="submit"
          >
            {saveButtonText}
          </Button>
        </ModalButtonRow>
      </TextFieldForm>
    </TextFieldWrapper>
  );

  const deleteConfirmationModalJSX = (
    <TextFieldWrapper>
      <TextFieldForm
        className={classes.formStyles}
        onSubmit={deletePosition}
      >
        <div>
          Are you sure you want to delete your opinion
          {ballotItemName && (
            <>
              {' '}
              about
              {' '}
              {ballotItemName}
            </>
          )}
          ?
        </div>
        <Button
          id={`positionDelete-${effectiveWeVoteId}-${externalUniqueId}`}
          variant="contained"
          color="primary"
          classes={{ root: classes.saveButtonRoot }}
          type="submit"
        >
          Confirm delete
        </Button>
      </TextFieldForm>
    </TextFieldWrapper>
  );

  const initialEmail = VoterStore.getVoterEmail();
  const showingNegativeFeedbackModal = AppObservableStore.getShowingNegativeFeedbackModal();
  return (
    <>
      {showNegativeModal && !showingNegativeFeedbackModal && (
        <ReviewAppModal initialEmail={initialEmail} />
      )}
      {showEditPositionModal && <EditOpinionModalOverrides />}
      <ModalDisplayTemplateB
        dialogTitleJSX={<>{editPositionModalTitleText}</>}
        show={showEditPositionModal}
        textFieldJSX={editPositionModalJSX}
        toggleModal={toggleEditModalLocal}
        externalUniqueId={`editPosition-${effectiveWeVoteId}-${externalUniqueId}`}
      />
      <ModalDisplayTemplateB
        dialogTitleJSX={<>{deleteConfirmationModalTitleText}</>}
        show={showDeleteConfirmationModal}
        textFieldJSX={deleteConfirmationModalJSX}
        toggleModal={toggleDeleteConfirmationModalLocal}
      />
      {isEditProfileModalOpen && (
        <VoterPositionEditNameAndPhotoModal
          show={isEditProfileModalOpen}
          toggleModal={handleEditProfileModalClose}
        />
      )}
      {(!openEditModalOnLoad || compactMode) && (
        <VoterPositionBlockComponent
          ballotItemWeVoteId={ballotItemWeVoteId}
          classes={classes}
          compactMode={compactMode}
          politicianWeVoteId={politicianWeVoteId}
          externalUniqueId={externalUniqueId}
          handleEditProfileModalOpen={handleEditProfileModalOpen}
          noBottomMargin={noBottomMargin}
          onClick={toggleEditModalLocal}
          openDeleteConfirmationModal={openDeleteConfirmationModal}
          handleEditPositionModalOpen={toggleEditModalLocal}
          position={position}
          positionExists={positionExists}
          statementText={statementText}
          supportOrOpposeStanceExists={supportOrOpposeStanceExists}
          voterFirstName={voterFirstName}
          voterLastName={voterLastName}
          voterName={voterName}
          voterPhotoUrlMedium={voterPhotoUrlMedium}
        />
      )}
    </>
  );
}
VoterPositionEntryAndDisplay.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  compactMode: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  noBottomMargin: PropTypes.bool,
  onModalClose: PropTypes.func,
  openEditModalOnLoad: PropTypes.bool,
  politicianWeVoteId: PropTypes.string,
};

// Shared styled components (used by VoterAvatarBlock and VoterPositionBlockComponent above)

const CommentContainerWrapper = styled('div')`
  flex: 1;
  min-width: 0;
`;

const CompactEditHint = CompactSecondaryText;

const CompactOwnCommentWrapper = styled('div')`
  cursor: pointer;
`;

const ItemActionBarContainer = styled('div')`
  display: inline-block;
  margin-top: 6px;
  &:empty {
    display: none;
  }
`;

const SpeakerInfoWrapperB = styled('div')`
  display: flex;
  flex-direction: column;
`;

const SpeakerPositionLikesSourceWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const VoterAvatar = styled('div')`
  align-items: center;
  background-color: ${DesignTokenColors.info600};
  border-radius: 50%;
  display: flex;
  height: 43px;
  justify-content: center;
  overflow: hidden;
  width: 43px;
`;

export const VoterAvatarDisplayContainer = styled('div')`
  align-items: center;
  display: flex;
`;

const VoterFirstName = styled('p')`
  color: ${DesignTokenColors.whiteUI};
  font-size: 16px;
  margin: 0;
  padding: 0;
`;

const VoterImage = styled('img')`
  height: 100%;
  object-fit: cover;
  width: 100%;
`;

const VoterLastName = styled('p')`
  color: ${DesignTokenColors.whiteUI};
  font-size: 11px;
  margin-bottom: -4px;
  padding: 0;
`;

export const VoterPositionContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== '$noBottomMargin',
})`
  align-items: flex-start;
  background-color: ${DesignTokenColors.caution50};
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  margin: ${({ $noBottomMargin }) => ($noBottomMargin ? '0' : '0 0 12px 0')};
  padding: 8px;
  width: 100%;
`;

// Edit opinion modal styled components

const CancelButton = styled('button')`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.neutral900};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 400;
  height: 40px;
  margin-top: 16px;
  padding: 0 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const EditOpinionModalOverrides = createGlobalStyle`
  /* Reduce gap between header and content for edit opinion modal */
  .MuiDialog-paper:has([id^="closeModalDisplayTemplateBeditP"]) .MuiDialogContent-root > div {
    margin-top: 8px !important;
  }
  /* Center the edit opinion modal vertically — override JSS-injected dialogPaper styles */
  .MuiDialog-paper.MuiDialog-paper.MuiDialog-paperScrollPaper[role="dialog"]:has([id^="closeModalDisplayTemplateBeditP"]) {
    margin: 32px auto !important;
    top: 0 !important;
    transform: none !important;
  }
`;

const LearnMoreCollapsible = styled('div')`
  max-height: ${(props) => (props.expanded ? '200px' : '0')};
  opacity: ${(props) => (props.expanded ? '1' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.25s ease;
`;

const LearnMoreToggle = styled('button')`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.neutral900};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  margin: 4px 0;
  padding: 0;
`;

const MakePublicLink = styled('button')`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const MakePublicRow = styled('div')`
  color: ${DesignTokenColors.neutral900};
  font-size: 14px;
  line-height: 1.5;
  padding-bottom: 4px;
  padding-top: 6px;

  svg {
    color: ${DesignTokenColors.primary500};
    font-size: 18px;
    margin-right: 6px;
    vertical-align: middle;
  }
`;

const ModalButtonRow = styled('div')`
  align-items: center;
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const OpinionSectionLabel = styled('div')`
  color: ${DesignTokenColors.neutral900};
  font-size: 14px;
  font-weight: 600;
  margin: 8px 0 6px 0;
`;

const OpinionTextFieldDiv = styled('div')`
  align-items: flex-start;
  border: 1px solid ${DesignTokenColors.primary600};
  border-radius: 16px;
  display: flex;
  margin-bottom: 8px;
  padding: 12px;
`;

const SetDefaultLabel = styled('span')`
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 13px;
`;

const SetDefaultSubtext = styled('div')`
  color: ${DesignTokenColors.neutralUI500};
  font-size: 12px;
  margin-top: 4px;

  a {
    color: ${DesignTokenColors.primary500};
    font-weight: 600;
  }
`;

const SetDefaultVisibilityRow = styled('div')`
  padding: 4px 0 8px 0;

  .MuiFormControlLabel-label {
    line-height: 1;
  }
`;

const StanceToggleButton = styled('button')`
  align-items: center;
  background-color: ${DesignTokenColors.whiteUI};
  border: 2px solid ${(props) => (props.selected ? DesignTokenColors.info800 : DesignTokenColors.neutralUI300)};
  border-radius: 20px;
  color: ${(props) => {
    if (!props.selected) return DesignTokenColors.neutral900;
    if (props.stanceType === 'support') return DesignTokenColors.confirmation800;
    if (props.stanceType === 'oppose') return DesignTokenColors.alert800;
    return DesignTokenColors.info800;
  }};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: ${(props) => (props.selected ? '600' : '400')};
  margin-right: 8px;
  padding: 4px 16px;

  &:hover {
    border-color: ${DesignTokenColors.info800};
  }
`;

const StanceToggleRow = styled('div')`
  display: flex;
  margin-bottom: 6px;
`;

const VisibilityHintFade = styled('div')`
  align-self: center;
  grid-area: 1 / 1;
  opacity: ${(props) => (props.visible ? '1' : '0')};
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;

const VisibilityHintWrapper = styled('div')`
  display: grid;
`;

export default withStyles(templateBStyles)(VoterPositionEntryAndDisplay);
