import React, { useState, useEffect, useRef } from 'react';
import { Button, InputBase, Radio, FormControlLabel, RadioGroup } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { Edit as EditIcon } from '@mui/icons-material';
import ActivityActions from '../../actions/ActivityActions';
import { prepareForCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import ActivityStore from '../../stores/ActivityStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';
import ModalDisplayTemplateB, {
  templateBStyles, TextFieldDiv,
  TextFieldForm, TextFieldWrapper, VoterAvatarImg,
  UserInfoWrapper, UserInfoText, UserName, OptionBlockWrapper, CommentContainer, InputBox,
} from '../Widgets/ModalDisplayTemplateB';
// import ActivityPostPublicToggle from '../Activity/ActivityPostPublicToggle';
import ActivityPostPublicDropdown from '../Activity/ActivityPostPublicDropdown';
import VoterPositionEditNameAndPhotoModal from './VoterPositionEditNameAndPhotoModal';

const VoterPositionEntryAndDisplay = (props) => {
  const { activityTidbitWeVoteId, classes, externalUniqueId, toggleModal, politicianName } = props;

  // useState used for state variables
  const [visibilityIsPublic, setVisibilityIsPublic] = useState(false);
  const [voterPhotoUrlMedium, setVoterPhotoUrlMedium] = useState('');
  const [statementText, setStatementText] = useState('');
  const [initialFocusSet, setInitialFocusSet] = useState(false);
  const [voterName, setVoterName] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true); // Open the modal
  };
  const handleEditModalClose = () => {
    setIsEditModalOpen(false); // Close the modal
  };

  // useRef to reference the post input
  const activityPostInputRef = useRef(null);

  const onActivityStoreChange = () => {
    const activityPost = ActivityStore.getActivityTidbitByWeVoteId(activityTidbitWeVoteId);
    if (activityPost) {
      const { statement_text: newStatementText, visibility_is_public: newVisibilityIsPublic } = activityPost;
      setVisibilityIsPublic(newVisibilityIsPublic);
      setStatementText(newStatementText);
    }
  };

  const onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    setVoterPhotoUrlMedium(voter.voter_photo_url_medium);
    setVoterName(voter.full_name || 'Anonymous');
  };
  const [selectedOpinion, setSelectedOpinion] = useState('');

  const handleOpinionChange = (event) => {
    setSelectedOpinion(event.target.value);
  };


  // useEffect replaces componentDidMount and componentWillUnmount
  useEffect(() => {
    const activityStoreListener = ActivityStore.addListener(onActivityStoreChange);
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onActivityStoreChange();
    onVoterStoreChange();

    return () => {
      activityStoreListener.remove();
      voterStoreListener.remove();
    };
  }, []);

  // useEffect handles setting inital focus replacing componentDidUpdate
  useEffect(() => {
    if (activityPostInputRef.current && !initialFocusSet) {
      const input = activityPostInputRef.current;
      const { length } = input.value;
      input.focus();
      input.setSelectionRange(length, length);
      setInitialFocusSet(true);
    }
  }, [initialFocusSet]);

  const onFocusInput = () => {
    prepareForCordovaKeyboard('VoterPositionEntryAndDisplay');
  };

  const saveActivityPost = (e) => {
    e.preventDefault();
    const visibilitySetting = visibilityIsPublic ? 'SHOW_PUBLIC' : 'FRIENDS_ONLY';
    ActivityActions.activityPostSave(activityTidbitWeVoteId, statementText, visibilitySetting);
    toggleModal();
  };

  const updateStatementTextToBeSaved = (e) => {
    setStatementText(e.target.value);
  };
 
  const activityTidbitIdCheck = activityTidbitWeVoteId === '' || activityTidbitWeVoteId === undefined;

  renderLog('VoterPositionEntryAndDisplay'); // Set LOG_RENDER_EVENTS to log all renders

  const dialogTitleText = politicianName ? `Create opinion about ${politicianName}`  : `Edit opinion about:  ${politicianName}`;
  const statementPlaceholderText = 'What\'s on your mind?';
  const rowsToShow = isAndroid() ? 4 : 6;
  const [showModal, setShowModal] = useState(false);

  const toggleLocalModal = () => {
    setShowModal((prev) => !prev); // Toggle the modal
  };
  const OpinionBlock = ({ onClick }) => (
    <OptionBlockWrapper>
      <UserInfoWrapper>
        <VoterAvatarImg
          alt=""
          src={voterPhotoUrlMedium || avatarGeneric()}
        />
        <EditIcon
          onClick={handleEditModalOpen}
          className={classes.styledEditIcon}
        />
      </UserInfoWrapper>
      <CommentContainer>
        {/* Open modal when input is clicked */}
        <InputBox
          type="text"
          placeholder="What's your opinion?"
          onClick={onClick}
          readOnly
        />
      </CommentContainer>
    </OptionBlockWrapper>
  );

  OpinionBlock.propTypes = {
    onClick: PropTypes.func.isRequired,
  };
  const textFieldJSX = (
    <TextFieldWrapper>
      <TextFieldForm
        className={classes.formStyles}
        // onBlur={onBlurInput}
        onFocus={onFocusInput}
        onSubmit={saveActivityPost}
      >
        <UserInfoWrapper>
          <VoterAvatarImg
            alt=""
            src={voterPhotoUrlMedium || avatarGeneric()}
          />
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
            <ActivityPostPublicDropdown
              visibilityIsPublic={visibilityIsPublic}
              onVisibilityChange={(newVisibility) => setVisibilityIsPublic(newVisibility)}
            />
          </UserInfoText>
        </UserInfoWrapper>
        <RadioGroup
          row
          value={selectedOpinion}
          onChange={handleOpinionChange}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value="Endorsing"
            control={<Radio color="primary" />}
            label="Endorsing"
            classes={{ root: classes.radioLabel }}
          />
          <FormControlLabel
            value="Opposing"
            control={<Radio color="primary" />}
            label="Opposing"
            classes={{ root: classes.radioLabel }}
          />
          <FormControlLabel
            value="Neutral"
            control={<Radio color="primary" />}
            label="Neutral"
            classes={{ root: classes.radioLabel }}
          />
        </RadioGroup>
        <TextFieldDiv>
          <InputBase
            classes={{ root: classes.inputStyles, inputMultiline: classes.inputMultiline }}
            id={`activityPostModalStatementText-${activityTidbitWeVoteId}-${externalUniqueId}`}
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
          id={`ActivityPostSave-${activityTidbitWeVoteId}-${externalUniqueId}`}
          variant="contained"
          color="primary"
          classes={{ root: classes.saveButtonRoot }}
          type="submit"
          // disabled={!statementText} // Commented out to allow saving without statement
          disabled={selectedOpinion === 'Neutral' && (!statementText || statementText.trim() === '')} // Disable if Neutral and no text
        >
          {activityTidbitIdCheck ? 'Add opinion' : 'Save Changes'}
        </Button>
      </TextFieldForm>
    </TextFieldWrapper>
  );

  return (
    <>
      <ModalDisplayTemplateB
        dialogTitleJSX={<>{dialogTitleText}</>}
        show={showModal}
        textFieldJSX={textFieldJSX}
        toggleModal={toggleLocalModal}
      />
      {isEditModalOpen && (
        <VoterPositionEditNameAndPhotoModal
          show={isEditModalOpen}
          toggleModal={handleEditModalClose}
        />
      )}
      <OpinionBlock
        onClick={toggleLocalModal}
        voterPhotoUrlMedium={voterPhotoUrlMedium}
        voterName={voterName}
      />
    </>
  );
};

VoterPositionEntryAndDisplay.propTypes = {
  activityTidbitWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
  politicianName: PropTypes.string,
};

export default withStyles(templateBStyles)(VoterPositionEntryAndDisplay);
