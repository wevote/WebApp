import React, { useCallback, useState, useEffect, useRef, Suspense } from 'react';
import { Button, InputBase, Radio, FormControlLabel, RadioGroup, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Edit as EditIcon } from '@mui/icons-material';
import SupportActions from '../../actions/SupportActions';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import PoliticianStore from '../../common/stores/PoliticianStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';
import ModalDisplayTemplateB, {
  templateBStyles, TextFieldDiv,
  TextFieldForm, TextFieldWrapper,
  UserInfoText, UserName, CommentContainer, InputBox,
} from '../Widgets/ModalDisplayTemplateB';
import ActivityPostPublicDropdown from '../Activity/ActivityPostPublicDropdown';
import VoterPositionEditNameAndPhotoModal from './VoterPositionEditNameAndPhotoModal';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { SpeakerName, SpeakerStatement, SpeakerStatementWrapper } from '../../common/components/Style/PositionDisplayStyles';
import SpeakerEndorsedOrOpposedSnippet from '../../common/components/Position/SpeakerEndorsedOrOpposedSnippet';
import VoterPositionEditTripleDot from '../../common/components/Position/VoterPositionEditTripleDot';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));

const VoterPositionEntryAndDisplay = ({ classes, externalUniqueId, politicianWeVoteId }) => {
  const politicianWeVoteIdRef = useRef(politicianWeVoteId);
  // console.log('VoterPositionEntryAndDisplay, politicianWeVoteId:', politicianWeVoteId, ', politicianWeVoteIdRef.current:', politicianWeVoteIdRef.current);
  const { allCachedPoliticians } = PoliticianStore.getState();

  const [initialFocusSet, setInitialFocusSet] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [politicianName, setPoliticianName] = useState('');
  const [position, setPosition] = useState({});
  const [positionExists, setPositionExists] = useState(false);
  const [selectedStance, setSelectedStance] = useState('SUPPORT');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statementText, setStatementText] = useState('');
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
    setIsEditModalOpen(false); // Close the modal
  };

  const toggleDeleteConfirmationModalLocal = () => {
    setShowDeleteConfirmationModal((prev) => !prev); // Toggle the modal
    if (showDeleteConfirmationModal) {
      restoreStylesAfterCordovaKeyboard('VoterPositionEntryAndDisplay');
    }
  };

  const toggleEditModalLocal = () => {
    setShowEditModal((prev) => !prev); // Toggle the modal
    if (showEditModal) {
      restoreStylesAfterCordovaKeyboard('VoterPositionEntryAndDisplay');
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
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    // console.log('VoterPositionEntryAndDisplay onSupportStoreChange, currentPoliticianWeVoteId:', currentPoliticianWeVoteId);
    // console.log('VoterPositionEntryAndDisplay onSupportStoreChange, politicianWeVoteId:', politicianWeVoteId);
    if (currentPoliticianWeVoteId) {
      let voterPositionIsPublic = false;
      let voterTextStatement = '';
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet('', currentPoliticianWeVoteId);
      // console.log('VoterPositionEntryAndDisplay onSupportStoreChange, currentPoliticianWeVoteId: ', currentPoliticianWeVoteId, ', ballotItemStatSheet: ', ballotItemStatSheet);
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
        // console.log('onSupportStoreChange stanceTemp: ', stanceTemp);
        const positionTemp = SupportStore.getPositionFromBallotItemWeVoteId(currentPoliticianWeVoteId);
        // console.log('onSupportStoreChange currentPoliticianWeVoteId: ', currentPoliticianWeVoteId, ', positionTemp: ', positionTemp);
        setPositionExists(voterOpposesBallotItem || voterPositionIsPublic || voterSupportsBallotItem || voterTextStatement);
        setSupportOrOpposeStanceExists(voterOpposesBallotItem || voterSupportsBallotItem);
        setPosition({ ...positionTemp }); // Ensure a new object reference so the component re-renders
        setSelectedStance(stanceTemp);
        setStatementText(voterTextStatement);
        setVisibilityIsPublic(voterPositionIsPublic);
      }
    }
  }, []);

  const onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    setVoterPhotoUrlMedium(voter.voter_photo_url_medium);
    setVoterFirstName(voter.first_name || 'Anonymous');
    setVoterLastName(voter.last_name || 'Anonymous');
    setVoterName(voter.full_name || 'Anonymous');
  };

  const handleOpinionChange = (event) => {
    // console.log('VoterPositionEntryAndDisplay handleOpinionChange event.target.value: ', event.target.value);
    setSelectedStance(event.target.value);
  };

  useEffect(() => {
    if (politicianWeVoteId && allCachedPoliticians && allCachedPoliticians[politicianWeVoteId]) {
      const { politician_name: politicianNameNew } = allCachedPoliticians[politicianWeVoteId];
      setPoliticianName(politicianNameNew);
      // console.log('VoterPositionEntryAndDisplay useEffect politicianName: ', politicianNameNew);
    }
  }, [politicianWeVoteId, allCachedPoliticians]);

  useEffect(() => {
    politicianWeVoteIdRef.current = politicianWeVoteId;
  }, [politicianWeVoteId]);

  useEffect(() => {
    // console.log('VoterPositionEntryAndDisplay useEffect, politicianWeVoteId: ', politicianWeVoteId);
    if (politicianWeVoteId) {
      onSupportStoreChange();
    }
  }, [politicianWeVoteId]);

  useEffect(() => {
    if (activityPostInputRef.current && !initialFocusSet) {
      const input = activityPostInputRef.current;
      const { length } = input.value;
      input.focus();
      input.setSelectionRange(length, length);
      setInitialFocusSet(true);
    }
  }, [initialFocusSet]);

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

  const onFocusInput = () => {
    prepareForCordovaKeyboard('VoterPositionEntryAndDisplay');
  };

  const deletePosition = (e) => {
    e.preventDefault();
    const ballotItemWeVoteId = '';
    const visibilitySetting = 'FRIENDS_ONLY';
    const kindOfBallotItem = 'CANDIDATE';
    const selectedStanceTemp = 'INFO_ONLY';
    const statementTextTemp = '';
    // console.log('deletePosition, selectedStance: ', selectedStance, ', visibilitySetting: ', visibilitySetting);
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, kindOfBallotItem, politicianWeVoteId, statementTextTemp, selectedStanceTemp, visibilitySetting);
    toggleDeleteConfirmationModalLocal();
  };

  const savePosition = (e) => {
    e.preventDefault();
    const ballotItemWeVoteId = '';
    const visibilitySetting = visibilityIsPublic ? 'SHOW_PUBLIC' : 'FRIENDS_ONLY';
    const kindOfBallotItem = 'CANDIDATE';
    // console.log('savePosition, selectedStance: ', selectedStance, ', visibilitySetting: ', visibilitySetting);
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, kindOfBallotItem, politicianWeVoteId, statementText, selectedStance, visibilitySetting);
    toggleEditModalLocal();
  };

  const updateStatementTextToBeSaved = (e) => {
    setStatementText(e.target.value);
  };

  renderLog('VoterPositionEntryAndDisplay'); // Set LOG_RENDER_EVENTS to log all renders

  const editPositionModalTitleText = positionExists ? `Edit opinion${politicianName && ` about ${politicianName}`}` : `Create opinion${politicianName && ` about ${politicianName}`}`;
  const deleteConfirmationModalTitleText = politicianName ? `Delete opinion about ${politicianName}?` : 'Delete opinion?';
  const statementPlaceholderText = 'What\'s on your mind?';
  const rowsToShow = isAndroid() ? 4 : 6;

  const VoterAvatarBlock = () => (
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

  const VoterPositionBlock = ({ onClick }) => (
    <VoterPositionContainer>
      <VoterAvatarDisplayContainer>
        <VoterAvatarBlock />
        <EditIcon
          onClick={handleEditModalOpen}
          className={classes.styledEditIcon}
        />
      </VoterAvatarDisplayContainer>
      <CommentContainerWrapper>
        {statementText ? (
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
        ) : (
          <CommentContainer>
            {/* Open modal when input is clicked */}
            <InputBox
              type="text"
              placeholder="What's your opinion?"
              onClick={onClick}
              readOnly
            />
          </CommentContainer>
        )}
        {!supportOrOpposeStanceExists && (
          <ItemActionBarContainer>
            <Suspense fallback={<></>}>
              <ItemActionBar
                ballotItemWeVoteId=""
                // ballotItemDisplayName={oneCandidate.ballot_item_display_name}
                commentButtonHide
                // commentButtonHide={!futureFeaturesDisabled && nextReleaseFeaturesEnabled}
                externalUniqueId={`VoterPositionEntryAndDisplay-ItemActionBar-${politicianWeVoteId}-${externalUniqueId}`}
                // hidePositionPublicToggle
                // hidePositionPublicToggle={!futureFeaturesDisabled && nextReleaseFeaturesEnabled}
                politicianWeVoteId={politicianWeVoteId}
                positionPublicToggleWrapAllowed
                shareButtonHide
                // useHelpDefeatOrHelpWin // Turning this off now since we shift to different display before the Help Modal could be filled out.
                useSupportWording
              />
            </Suspense>
          </ItemActionBarContainer>
        )}
        {positionExists && (
          <SpeakerPositionLikesSourceWrapper>
            <SpeakerEndorsedOrOpposedSnippet position={position} viewerIsPositionOwner />
            <VoterPositionEditTripleDot triggerDeleteOpinion={openDeleteConfirmationModal} triggerEditOpinion={openEditModal} />
          </SpeakerPositionLikesSourceWrapper>
        )}
      </CommentContainerWrapper>
    </VoterPositionContainer>
  );
  VoterPositionBlock.propTypes = {
    onClick: PropTypes.func.isRequired,
  };

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
          <VoterAvatarBlock />
          <EditIcon
            onClick={handleEditModalOpen}
            className={classes.styledEditIcon}
          />
          <UserInfoText>
            <UserName>
              {' '}
              {voterName}
              {/* Display the fetched name */}
            </UserName>
            <Tooltip
              arrow
              title={defaultOpinionVisibilityText}
              placement="top"
              classes={{ tooltip: classes.tooltipPaper, arrow: classes.tooltipArrow }}
            >
              <div>
                <ActivityPostPublicDropdown
                  visibilityIsPublic={visibilityIsPublic}
                  onVisibilityChange={(newVisibility) => setVisibilityIsPublic(newVisibility)}
                />
              </div>
            </Tooltip>
          </UserInfoText>
        </VoterAvatarDisplayContainer>
        <RadioGroup
          row
          value={selectedStance}
          onChange={handleOpinionChange}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value="SUPPORT"
            control={<Radio color="primary" />}
            label="Supporting"
            classes={{ root: classes.radioLabel }}
          />
          <FormControlLabel
            value="OPPOSE"
            control={<Radio color="primary" />}
            label="Opposing"
            classes={{ root: classes.radioLabel }}
          />
          <FormControlLabel
            value="INFO_ONLY"
            control={<Radio color="primary" />}
            label="Info only"
            classes={{ root: classes.radioLabel }}
          />
        </RadioGroup>
        <TextFieldDiv>
          <InputBase
            classes={{ root: classes.inputStyles, inputMultiline: classes.inputMultiline }}
            id={`activityPostModalStatementText-${politicianWeVoteId}-${externalUniqueId}`}
            inputRef={activityPostInputRef}
            multiline
            name="statementText"
            onChange={updateStatementTextToBeSaved}
            placeholder={statementPlaceholderText}
            rows={rowsToShow}
            value={statementText || ''}
          />
        </TextFieldDiv>
        <Button
          id={`positionEntrySave-${politicianWeVoteId}-${externalUniqueId}`}
          variant="contained"
          color="primary"
          classes={{ root: classes.saveButtonRoot }}
          type="submit"
          // disabled={!statementText} // Commented out to allow saving without statement
          disabled={selectedStance === 'INFO_ONLY' && (!statementText || statementText.trim() === '')} // Disable if Neutral and no text
        >
          {positionExists ? 'Save Changes' : 'Add opinion' }
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
          {politicianName && (
            <>
              {' '}
              about
              {' '}
              {politicianName}
            </>
          )}
          ?
        </div>
        <Button
          id={`positionDelete-${politicianWeVoteId}-${externalUniqueId}`}
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

  return (
    <>
      <ModalDisplayTemplateB
        dialogTitleJSX={<>{editPositionModalTitleText}</>}
        show={showEditModal}
        textFieldJSX={editPositionModalJSX}
        toggleModal={toggleEditModalLocal}
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
      <VoterPositionBlock
        onClick={openEditModal}
        politicianWeVoteId={politicianWeVoteId}
        voterPhotoUrlMedium={voterPhotoUrlMedium}
        voterName={voterName}
      />
    </>
  );
};
VoterPositionEntryAndDisplay.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const CommentContainerWrapper = styled('div')`
  width: 100%;
`;

const ItemActionBarContainer = styled('div')`
  display: inline-block;
  margin-top: 6px;
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
  display: flex;
  gap: 10px;
  margin: 12px 0 26px 0;
  padding: 6px;
`;

export default withStyles(templateBStyles)(VoterPositionEntryAndDisplay);
