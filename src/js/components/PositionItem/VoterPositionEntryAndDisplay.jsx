import { Edit as EditIcon } from '@mui/icons-material';
import { Box, Button, FormControlLabel, InputBase, Radio, RadioGroup, Skeleton, Tooltip } from '@mui/material';
import { styled as muiStyled, withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import SupportActions from '../../actions/SupportActions';
import SpeakerEndorsedOrOpposedSnippet from '../../common/components/Position/SpeakerEndorsedOrOpposedSnippet';
import VoterPositionEditTripleDot from '../../common/components/Position/VoterPositionEditTripleDot';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { CompactSecondaryText, CompactStatementText, SpeakerName, SpeakerStatement, SpeakerStatementWrapper } from '../../common/components/Style/PositionDisplayStyles';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
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
import ActivityPostPublicDropdown from '../Activity/ActivityPostPublicDropdown';
import ReviewAppModal from '../ReviewApps/ReviewAppModal';
import ModalDisplayTemplateB, { CommentContainer, InputBox, templateBStyles, TextFieldDiv, TextFieldForm, TextFieldWrapper, UserInfoText, UserName } from '../Widgets/ModalDisplayTemplateB';
import VoterPositionEditNameAndPhotoModal from './VoterPositionEditNameAndPhotoModal';

/* global $ */

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));


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
  classes, compactMode, effectiveWeVoteId, effectivePoliticianWeVoteId, externalUniqueId,
  handleEditModalOpen, isMeasure, onClick, openDeleteConfirmationModal, openEditModal,
  position, positionExists, statementText, supportOrOpposeStanceExists,
  voterFirstName, voterLastName, voterName, voterPhotoUrlMedium,
}) {
  return (
    <VoterPositionContainer>
      <VoterAvatarDisplayContainer>
        <VoterAvatarBlock
          voterPhotoUrlMedium={voterPhotoUrlMedium}
          voterFirstName={voterFirstName}
          voterLastName={voterLastName}
        />
        <EditIcon
          onClick={handleEditModalOpen}
          className={classes.styledEditIcon}
        />
      </VoterAvatarDisplayContainer>
      <CommentContainerWrapper>
        {statementText && compactMode && (
          <CompactOwnCommentWrapper onClick={onClick}>
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
              onClick={onClick}
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
                ballotItemWeVoteId={isMeasure ? effectiveWeVoteId : ''}
                commentButtonHide
                externalUniqueId={`VoterPositionEntryAndDisplay-ItemActionBar-${effectiveWeVoteId}-${externalUniqueId}`}
                politicianWeVoteId={effectivePoliticianWeVoteId}
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
            <VoterPositionEditTripleDot triggerDeleteOpinion={openDeleteConfirmationModal} triggerEditOpinion={openEditModal} />
          </SpeakerPositionLikesSourceWrapper>
        )}
      </CommentContainerWrapper>
    </VoterPositionContainer>
  );
}
VoterPositionBlockComponent.propTypes = {
  classes: PropTypes.object,
  compactMode: PropTypes.bool,
  effectiveWeVoteId: PropTypes.string,
  effectivePoliticianWeVoteId: PropTypes.string,
  externalUniqueId: PropTypes.string,
  handleEditModalOpen: PropTypes.func,
  isMeasure: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  openDeleteConfirmationModal: PropTypes.func,
  openEditModal: PropTypes.func,
  position: PropTypes.object,
  positionExists: PropTypes.bool,
  statementText: PropTypes.string,
  supportOrOpposeStanceExists: PropTypes.bool,
  voterFirstName: PropTypes.string,
  voterLastName: PropTypes.string,
  voterName: PropTypes.string,
  voterPhotoUrlMedium: PropTypes.string,
};

function VoterPositionEntryAndDisplay ({ ballotItemWeVoteId: ballotItemWeVoteIdProp, classes, compactMode, externalUniqueId, onModalClose, openEditModalOnLoad, politicianWeVoteId }) {
  const isMeasure = stringContains('meas', ballotItemWeVoteIdProp);
  const effectiveWeVoteId = isMeasure ? ballotItemWeVoteIdProp : politicianWeVoteId;
  const effectiveKindOfBallotItem = isMeasure ? 'MEASURE' : 'CANDIDATE';
  const effectivePoliticianWeVoteId = isMeasure ? '' : politicianWeVoteId;

  const effectiveWeVoteIdRef = useRef(effectiveWeVoteId);
  const { allCachedPoliticians } = PoliticianStore.getState();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ballotItemName, setBallotItemName] = useState('');
  const [position, setPosition] = useState({});
  const [positionExists, setPositionExists] = useState(false);
  const [selectedStance, setSelectedStance] = useState('SUPPORT');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNegativeModal, setShowNegativeModal] = useState(false);
  const [statementText, setStatementText] = useState('');
  const [draftStatementText, setDraftStatementText] = useState('');
  const [draftSelectedStance, setDraftSelectedStance] = useState('SUPPORT');
  const [draftVisibilityIsPublic, setDraftVisibilityIsPublic] = useState(false);
  const [supportOrOpposeStanceExists, setSupportOrOpposeStanceExists] = useState(false);
  const [visibilityIsPublic, setVisibilityIsPublic] = useState(false);
  const [voterFirstName, setVoterFirstName] = useState('');
  const [voterLastName, setVoterLastName] = useState('');
  const [voterName, setVoterName] = useState('');
  const [voterPhotoUrlMedium, setVoterPhotoUrlMedium] = useState('');

  const handleEditModalOpen = () => {
    if (VoterStore.getVoterIsSignedIn()) {
      setIsEditModalOpen(true);
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const toggleDeleteConfirmationModalLocal = () => {
    setShowDeleteConfirmationModal((prev) => !prev); // Toggle the modal
    if (showDeleteConfirmationModal) {
      restoreStylesAfterCordovaKeyboard('VoterPositionEntryAndDisplay');
    }
  };

  const toggleEditModalLocal = (isClosedWithoutSubmitting = true) => {
    // Track modal close event only when user closes without submitting (e.g., clicking X button)
    // When closing after successful submission, pass false to avoid duplicate tracking
    if (showEditModal && isClosedWithoutSubmitting) {
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
      if (effectivePoliticianWeVoteId) {
        dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(effectivePoliticianWeVoteId);
      }
      TagManager.dataLayer({ dataLayer: dataLayerObject });
    }

    setShowEditModal((prev) => !prev);

    if (showEditModal) {
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
    const showNegativeModalFromMessage = tokenText.includes('showNegativeFeedbackModal') && tokenText.includes('POSITION');
    const showingNegativeFeedbackModal = AppObservableStore.getShowingNegativeFeedbackModal();
    if (!showNegativeModal && !showingNegativeFeedbackModal && showNegativeModalFromMessage) {
      setShowNegativeModal(true);
    }
  }, [showNegativeModal]);

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  const openEditModal = () => {
    if (VoterStore.getVoterIsSignedIn()) {
      toggleEditModalLocal();
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
  };

  // useRef to reference the post input
  const activityPostInputRef = useRef(null);

  const onSupportStoreChange = useCallback(() => {
    const currentEffectiveWeVoteId = effectiveWeVoteIdRef.current;
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
        setPositionExists(voterOpposesBallotItem || voterPositionIsPublic || voterSupportsBallotItem || voterTextStatement);
        setSupportOrOpposeStanceExists(voterOpposesBallotItem || voterSupportsBallotItem);
        setPosition({ ...positionTemp }); // Ensure a new object reference so the component re-renders
        setSelectedStance(stanceTemp);
        setStatementText(voterTextStatement);
        setVisibilityIsPublic(voterPositionIsPublic);
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

  const handleOpinionChange = (event) => {
    const newStance = event.target.value;
    setDraftSelectedStance(newStance);
  };

  useEffect(() => {
    if (isMeasure && effectiveWeVoteId) {
      const measure = MeasureStore.getMeasure(effectiveWeVoteId);
      if (measure && measure.ballot_item_display_name) {
        setBallotItemName(measure.ballot_item_display_name);
      }
    } else if (politicianWeVoteId && allCachedPoliticians && allCachedPoliticians[politicianWeVoteId]) {
      const { politician_name: ballotItemNameNew } = allCachedPoliticians[politicianWeVoteId];
      setBallotItemName(ballotItemNameNew);
    }
  }, [isMeasure, effectiveWeVoteId, politicianWeVoteId, allCachedPoliticians]);

  useEffect(() => {
    effectiveWeVoteIdRef.current = effectiveWeVoteId;
  }, [effectiveWeVoteId]);

  useEffect(() => {
    if (effectiveWeVoteId) {
      onSupportStoreChange();
    }
  }, [effectiveWeVoteId, onSupportStoreChange]);

  useEffect(() => {
    if (!showEditModal) return undefined;
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
  }, [showEditModal]);

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
      setShowEditModal(true);
    }
  }, [openEditModalOnLoad]);

  // Sync draft state when modal opens
  useEffect(() => {
    if (showEditModal) {
      setDraftStatementText(statementText);
      setDraftSelectedStance(selectedStance);
      setDraftVisibilityIsPublic(visibilityIsPublic);
    }
  }, [showEditModal]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFocusInput = () => {
    prepareForCordovaKeyboard('VoterPositionEntryAndDisplay');
    if (isMobileScreenSize()) {
      $("div[class^='DialogContentInnerWrapper']").css('margin-top', '0');
    }
  };

  const deletePosition = (e) => {
    e.preventDefault();
    const ballotItemWeVoteId = isMeasure ? effectiveWeVoteId : '';
    const visibilitySetting = 'FRIENDS_ONLY';
    const selectedStanceTemp = 'INFO_ONLY';
    const statementTextTemp = '';
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, effectiveKindOfBallotItem, effectivePoliticianWeVoteId, statementTextTemp, selectedStanceTemp, visibilitySetting);
    toggleDeleteConfirmationModalLocal();
  };

  const savePosition = (e) => {
    e.preventDefault();
    const ballotItemWeVoteId = isMeasure ? effectiveWeVoteId : '';
    const visibilitySetting = draftVisibilityIsPublic ? 'SHOW_PUBLIC' : 'FRIENDS_ONLY';

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
        isPublic: draftVisibilityIsPublic,
        positionWeVoteId: position.position_we_vote_id || null,
      },
    };
    if (effectivePoliticianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(effectivePoliticianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, effectiveKindOfBallotItem, effectivePoliticianWeVoteId, draftStatementText, draftSelectedStance, visibilitySetting);
    possibleAppReview('POSITION');
    toggleEditModalLocal(false);
  };

  const updateStatementTextToBeSaved = (e) => {
    setDraftStatementText(e.target.value);
  };

  renderLog('VoterPositionEntryAndDisplay'); // Set LOG_RENDER_EVENTS to log all renders

  const editPositionModalTitleText = positionExists ? `Edit opinion${ballotItemName && ` about ${ballotItemName}`}` : `Create opinion${ballotItemName && ` about ${ballotItemName}`}`;
  const deleteConfirmationModalTitleText = ballotItemName ? `Delete opinion about ${ballotItemName}?` : 'Delete opinion?';
  const statementPlaceholderText = 'What\'s on your mind?';
  const rowsToShow = isAndroid() ? 4 : 6;

  const defaultOpinionVisibilityText = (
    <p>
      Change your default visibility
      {' '}
      <a
        href="/settings/profile"
        className={classes.tooltipLink}
      >
        in your profile
      </a>
      .
    </p>
  );

  const editPositionModalJSX = (
    <TextFieldWrapper>
      <TextFieldForm
        className={classes.formStyles}
        // onBlur={onBlurInput}
        onFocus={onFocusInput}
        onSubmit={savePosition}
      >
        <VoterAvatarDisplayContainer>
          <VoterAvatarBlock voterPhotoUrlMedium={voterPhotoUrlMedium} voterFirstName={voterFirstName} voterLastName={voterLastName} />
          <EditIcon
            onClick={handleEditModalOpen}
            className={classes.styledEditIcon}
          />
          <UserInfoText>
            <UserName>
              {' '}
              {voterName}
            </UserName>
            <Tooltip
              arrow
              title={defaultOpinionVisibilityText}
              placement="top"
              classes={{ tooltip: classes.tooltipPaper, arrow: classes.tooltipArrow }}
            >
              <div>
                <ActivityPostPublicDropdown
                  visibilityIsPublic={draftVisibilityIsPublic}
                  onVisibilityChange={(newVisibility) => setDraftVisibilityIsPublic(newVisibility)}
                />
              </div>
            </Tooltip>
          </UserInfoText>
        </VoterAvatarDisplayContainer>
        <RadioGroup
          row
          value={draftSelectedStance}
          onChange={handleOpinionChange}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value="SUPPORT"
            control={<RadioStyled color="primary" />}
            label={isMeasure ? 'Voting Yes' : 'Supporting'}
            classes={{ root: classes.radioLabel }}
          />
          <FormControlLabel
            value="OPPOSE"
            control={<RadioStyled color="primary" />}
            label={isMeasure ? 'Voting No' : 'Opposing'}
            classes={{ root: classes.radioLabel }}
          />
          <FormControlLabel
            value="INFO_ONLY"
            control={<RadioStyled color="primary" />}
            label="Not sure yet"
            classes={{ root: classes.radioLabel }}
          />
        </RadioGroup>
        <TextFieldDiv>
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
        </TextFieldDiv>
        <Button
          id={`positionEntrySave-${effectiveWeVoteId}-${externalUniqueId}`}
          variant="contained"
          color="primary"
          classes={{ root: classes.saveButtonRoot }}
          type="submit"
          disabled={draftSelectedStance === 'INFO_ONLY' && (!draftStatementText || draftStatementText.trim() === '')}
        >
          {positionExists ? 'Save Changes' : 'Add opinion'}
        </Button>
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
      <ModalDisplayTemplateB
        dialogTitleJSX={<>{editPositionModalTitleText}</>}
        show={showEditModal}
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
      {isEditModalOpen && (
        <VoterPositionEditNameAndPhotoModal
          show={isEditModalOpen}
          toggleModal={handleEditModalClose}
        />
      )}
      {(!openEditModalOnLoad || compactMode) && (
        <VoterPositionBlockComponent
          classes={classes}
          compactMode={compactMode}
          effectiveWeVoteId={effectiveWeVoteId}
          effectivePoliticianWeVoteId={effectivePoliticianWeVoteId}
          externalUniqueId={externalUniqueId}
          handleEditModalOpen={handleEditModalOpen}
          isMeasure={isMeasure}
          onClick={openEditModal}
          openDeleteConfirmationModal={openDeleteConfirmationModal}
          openEditModal={openEditModal}
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
  onModalClose: PropTypes.func,
  openEditModalOnLoad: PropTypes.bool,
  politicianWeVoteId: PropTypes.string,
};

const CompactEditHint = CompactSecondaryText;

const CompactOwnCommentWrapper = styled('div')`
  cursor: pointer;
`;

const CommentContainerWrapper = styled('div')`
  flex: 1;
  min-width: 0;
`;

const ItemActionBarContainer = styled('div')`
  display: inline-block;
  margin-top: 6px;
  &:empty {
    display: none;
  }
`;

const SpeakerPositionLikesSourceWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const SpeakerInfoWrapperB = styled('div')`
  display: flex;
  flex-direction: column;
`;

const VoterAvatar = styled('div')`
  height: 43px;
  width: 43px;
  border-radius: 50%;
  background-color: ${DesignTokenColors.info600};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const VoterFirstName = styled('p')`
  color: ${DesignTokenColors.whiteUI};
  margin: 0;
  padding: 0;
  font-size: 16px;
`;

const VoterLastName = styled('p')`
  color: ${DesignTokenColors.whiteUI};
  margin-bottom: -4px;
  padding: 0;
  font-size: 11px;
`;

const VoterImage = styled('img')`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

export const VoterAvatarDisplayContainer = styled('div')`
  display: flex;
`;

export const VoterPositionContainer = styled('div')`
  align-items: flex-start;
  background-color: ${DesignTokenColors.caution50};
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  margin: 0 0 12px 0;
  padding: 8px;
  width: 100%;
`;

const RadioStyled = muiStyled(Radio)(isMobileScreenSize() ? { padding: '2px' } : {});

export default withStyles(templateBStyles)(VoterPositionEntryAndDisplay);
