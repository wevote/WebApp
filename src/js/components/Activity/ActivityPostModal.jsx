import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Close } from '@material-ui/icons';
import { withStyles, withTheme } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  InputBase,
} from '@material-ui/core';
import ActivityActions from '../../actions/ActivityActions';
import ActivityStore from '../../stores/ActivityStore';
import ActivityPostPublicToggle from './ActivityPostPublicToggle';
import { renderLog } from '../../utils/logging';
import {
  hasIPhoneNotch, prepareForCordovaKeyboard,
  restoreStylesAfterCordovaKeyboard,
} from '../../utils/cordovaUtils';
import stockAvatar from '../../../img/global/icons/avatar-generic.png';
import VoterStore from '../../stores/VoterStore';

class ActivityPostModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    activityPostId: PropTypes.number,
    classes: PropTypes.object,
    externalUniqueId: PropTypes.string,
    show: PropTypes.bool,
    toggleActivityPostModal: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      visibilityIsPublic: false,
      voterPhotoUrlMedium: '',
    };
  }

  componentDidMount () {
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    const voter = VoterStore.getVoter();
    const { voter_photo_url_medium: voterPhotoUrlMedium } = voter;
    this.onActivityStoreChange();
    this.setState({
      voterPhotoUrlMedium,
    });
  }

  componentDidUpdate () {
    const { initialFocusSet } = this.state;
    if (this.positionInput) {
      // Set the initial focus at the end of any existing text
      if (!initialFocusSet) {
        const { positionInput } = this;
        const { length } = positionInput.value;
        positionInput.focus();
        positionInput.setSelectionRange(length, length);
        this.setState({
          initialFocusSet: true,
        });
      }
    }
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityPostId } = this.props;
    const activityTidbitKey = `ACTIVITY_POST-${activityPostId}`;  // activityTidbitKey generated here
    const activityPost = ActivityStore.getActivityTidbitByKey(activityTidbitKey);
    if (activityPost) {
      const {
        statement_text: statementText,
        visibility_is_public: visibilityIsPublic,
      } = activityPost;
      this.setState({
        visibilityIsPublic,
        statementText,
      });
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const { voter_photo_url_medium: voterPhotoUrlMedium } = voter;
    this.setState({
      voterPhotoUrlMedium,
    });
  }

  onBlurInput = () => {
    restoreStylesAfterCordovaKeyboard(ActivityPostModal);
  };

  onFocusInput = () => {
    prepareForCordovaKeyboard('ItemPositionStatementActionBar');
  };

  onPublicToggleChange = (visibilityIsPublic) => {
    this.setState({
      visibilityIsPublic,
    });
  }

  saveActivityPost = (e) => {
    e.preventDefault();
    const { activityPostId } = this.props;
    const { visibilityIsPublic, statementText } = this.state;
    // console.log('ActivityPostModal activityPostId:', activityPostId, 'statementText: ', statementText, 'visibilityIsPublic: ', visibilityIsPublic);
    const visibilitySetting = visibilityIsPublic ? 'SHOW_PUBLIC' : 'FRIENDS_ONLY';
    ActivityActions.activityPostSave(activityPostId, statementText, visibilitySetting);
    this.props.toggleActivityPostModal();
  }

  updateStatementTextToBeSaved = (e) => {
    this.setState({
      statementText: e.target.value,
    });
  }

  render () {
    renderLog('ActivityPostModal');  // Set LOG_RENDER_EVENTS to log all renders
    let { activityPostId } = this.props;
    activityPostId = parseInt(activityPostId, 10);
    const {
      classes, externalUniqueId,
    } = this.props;
    const {
      visibilityIsPublic,
      voterPhotoUrlMedium,
      statementText,
    } = this.state;

    // const horizontalEllipsis = '\u2026';
    const statementPlaceholderText = 'What\'s on your mind?';

    const rowsToShow = 6;

    // console.log('ActivityPostModal render, voter_address_object: ', voter_address_object);
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleActivityPostModal(); }}
      >
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          <Title>
            {activityPostId !== 0 ? 'Edit Post' : 'Create Post'}
          </Title>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.toggleActivityPostModal(); }}
            id="closeActivityPostModal"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <TextFieldWrapper>
            <form
              className={classes.formStyles}
              onSubmit={this.saveActivityPost.bind(this)}
              onFocus={this.onFocusInput}
              onBlur={this.onBlurInput}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '95%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  border: '1px solid #e8e8e8',
                  borderRadius: 3,
                  padding: 12,
                  marginBottom: 0,
                }}
              >
                <img
                  alt=""
                  src={voterPhotoUrlMedium || stockAvatar}
                  style={{ borderRadius: 6, display: 'block', marginRight: 12, width: 50 }}
                />
                <InputBase onChange={this.updateStatementTextToBeSaved}
                  id={`activityPostModalStatementText-${activityPostId}-${externalUniqueId}`}
                  name="statementText"
                  classes={{ root: classes.inputStyles, inputMultiline: classes.inputMultiline }}
                  placeholder={statementPlaceholderText}
                  defaultValue={statementText}
                  inputRef={(input) => { this.positionInput = input; }}
                  multiline
                  rows={rowsToShow}
                />
              </div>
              <ActivityPostPublicToggle
                initialVisibilityIsPublic={visibilityIsPublic}
                onToggleChange={this.onPublicToggleChange}
                preventStackedButtons
              />
              <PostSaveButton className="postsave-button">
                <Button
                  id={`ActivityPostSave-${activityPostId}-${externalUniqueId}`}
                  variant="contained"
                  color="primary"
                  classes={{ root: classes.saveButtonRoot }}
                  type="submit"
                >
                  {activityPostId !== 0 ? 'Save Changes' : 'Post'}
                </Button>
              </PostSaveButton>
            </form>
          </TextFieldWrapper>
        </DialogContent>
      </Dialog>
    );
  }
}
const styles = theme => ({
  dialogTitle: {
    padding: 16,
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    minHeight: '200px',
    maxHeight: '350px',
    height: '80%',
    width: '90%',
    maxWidth: '600px',
    top: '0px',
    transform: 'translate(0%, -20%)',
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '200px',
      maxHeight: '330px',
      height: '70%',
      margin: '0 auto',
      transform: 'translate(0%, -30%)',
    },
  },
  dialogContent: {
    padding: '0px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
  saveButtonRoot: {
    width: '100%',
  },
  formStyles: {
    width: '100%',
  },
  formControl: {
    width: '100%',
    marginTop: 16,
  },
  inputMultiline: {
    fontSize: 20,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
  },
  inputStyles: {
    flex: '1 1 0',
    fontSize: 18,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  select: {
    padding: '12px 12px',
    margin: '0px 1px',
  },
});

const PostSaveButton = styled.div`
  width: 100%;
`;

const TextFieldWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  margin-top: 2px;
  text-align: left;
`;

export default withTheme(withStyles(styles)(ActivityPostModal));
