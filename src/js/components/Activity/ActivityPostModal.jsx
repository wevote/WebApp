import React, { useState, useEffect, useRef } from 'react';
import { Button, InputBase } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import ActivityActions from '../../actions/ActivityActions';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import ActivityStore from '../../stores/ActivityStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';
import ModalDisplayTemplateA, {
  PostSaveButton, templateAStyles, TextFieldDiv,
  TextFieldForm, TextFieldWrapper, VoterAvatarImg,
} from '../Widgets/ModalDisplayTemplateA';
import ActivityPostPublicToggle from './ActivityPostPublicToggle';

const ActivityPostModal = (props) => {
  const { activityTidbitWeVoteId, classes, externalUniqueId, show, toggleModal } = props;

  // useState used for state variables
  const [visibilityIsPublic, setVisibilityIsPublic] = useState(false);
  const [voterPhotoUrlMedium, setVoterPhotoUrlMedium] = useState('');
  const [statementText, setStatementText] = useState('');
  const [initialFocusSet, setInitialFocusSet] = useState(false);

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

  const onBlurInput = () => {
    restoreStylesAfterCordovaKeyboard('ActivityPostModal');
  };


  const onFocusInput = () => {
    prepareForCordovaKeyboard('ActivityPostModal');
  };

  const onPublicToggleChange = (newVisibilityIsPublic) => {
    setVisibilityIsPublic(newVisibilityIsPublic);
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

  renderLog('ActivityPostModal'); // Set LOG_RENDER_EVENTS to log all renders

  const dialogTitleText = activityTidbitIdCheck ? 'Create Post' : 'Edit Post';
  const statementPlaceholderText = 'What\'s on your mind?';
  const rowsToShow = isAndroid() ? 4 : 6;

  const textFieldJSX = (
    <TextFieldWrapper>
      <TextFieldForm
        className={classes.formStyles}
        // onBlur={onBlurInput}
        onFocus={onFocusInput}
        onSubmit={saveActivityPost}
      >
        <TextFieldDiv>
          <VoterAvatarImg
            alt=""
            src={voterPhotoUrlMedium || avatarGeneric()}
          />
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
        <ActivityPostPublicToggle
          initialVisibilityIsPublic={visibilityIsPublic}
          onToggleChange={onPublicToggleChange}
          preventStackedButtons
        />
        <PostSaveButton className="postsave-button">
          <Button
            id={`ActivityPostSave-${activityTidbitWeVoteId}-${externalUniqueId}`}
            variant="contained"
            color="primary"
            classes={{ root: classes.saveButtonRoot }}
            type="submit"
            disabled={!statementText}
          >
            {activityTidbitIdCheck ? 'Post' : 'Save Changes'}
          </Button>
        </PostSaveButton>
      </TextFieldForm>
    </TextFieldWrapper>
  );

  return (
    <ModalDisplayTemplateA
      dialogTitleJSX={<>{dialogTitleText}</>}
      show={show}
      textFieldJSX={textFieldJSX}
      toggleModal={toggleModal}
    />
  );
};

ActivityPostModal.propTypes = {
  activityTidbitWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  show: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
};

export default withStyles(templateAStyles)(ActivityPostModal);
