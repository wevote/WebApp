// This file is flooded with non-camel case, so don't flag for now, in order to find more important issues
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';

class ItemPositionStatementActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    ballotItemDisplayName: PropTypes.string,
    type: PropTypes.string.isRequired,
    comment_edit_mode_on: PropTypes.bool,
    supportProps: PropTypes.object,
    shown_in_list: PropTypes.bool,
    shouldFocus: PropTypes.bool,
    classes: PropTypes.object,
    mobile: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      isPublicPosition: undefined,
      showEditPositionStatementInput: undefined,
      supportProps: undefined,
      statementTextToBeSaved: undefined,
      // disabled: undefined,
      commentActive: false,
    };
    this.updateStatementTextToBeSaved = this.updateStatementTextToBeSaved.bind(this);
    this.onFocusInput = this.onFocusInput.bind(this);
    this.onBlurInput = this.onBlurInput.bind(this);
  }

  componentDidMount () {
    if (this.props.supportProps) {
      this.setState({
        isPublicPosition: this.props.supportProps.is_public_position,
        statementTextToBeSaved: this.props.supportProps.voter_statement_text,
        supportProps: this.props.supportProps,
      });
    }
    if (this.props.shouldFocus && this.textarea) {
      this.textarea.focus();
    }

    this.setState({
      showEditPositionStatementInput: this.props.comment_edit_mode_on,
      // disabled: !this.props.comment_edit_mode_on,
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.supportProps !== undefined) {
      this.setState({
        isPublicPosition: nextProps.supportProps.is_public_position,
      });
    }
    if (this.state.showEditPositionStatementInput) {
      // we don't want to do anything
    } else if (nextProps.supportProps && nextProps.supportProps.voter_statement_text) {
      this.setState({
        statementTextToBeSaved: nextProps.supportProps.voter_statement_text,
        showEditPositionStatementInput: false,
        // disabled: true,
      });
    } else {
      const voterStatementText = (nextProps.supportProps && nextProps.supportProps.voter_statement_text) || '';
      this.setState({
        statementTextToBeSaved: voterStatementText,
        showEditPositionStatementInput: nextProps.comment_edit_mode_on,
        // disabled: !nextProps.comment_edit_mode_on,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.commentActive !== nextState.commentActive) {
      return true;
    }
    if (this.state.isPublicPosition !== nextState.isPublicPosition) {
      return true;
    }
    if (this.state.statementTextToBeSaved !== nextState.statementTextToBeSaved) {
      return true;
    }
    if (this.state.showEditPositionStatementInput !== nextState.showEditPositionStatementInput) {
      return true;
    }
    let currentIsSupport = null;
    if (this.state.supportProps) {
      currentIsSupport = this.state.supportProps.is_support;
    }
    let currentIsOppose = null;
    if (this.state.supportProps) {
      currentIsOppose = this.state.supportProps.is_oppose;
    }
    let nextIsSupport = null;
    if (nextState.supportProps) {
      nextIsSupport = nextState.supportProps.is_support;
    }
    let nextIsOppose = null;
    if (nextState.supportProps) {
      nextIsOppose = nextState.supportProps.is_oppose;
    }
    if (currentIsSupport !== nextIsSupport) {
      return true;
    }
    if (currentIsOppose !== nextIsOppose) {
      return true;
    }
    return false;
  }

  componentDidUpdate (prevProps) {
    // Note: adding a focus on the textarea in componentDidUpdate can lead to an infinite loop.
    // We protect against this with shouldComponentUpdate
    if (this.textarea && prevProps.supportProps && this.state.supportProps) {
      if (prevProps.supportProps.is_oppose === true && this.state.supportProps.is_support === true) { // oppose to support
        this.textarea.focus();
      } else if (prevProps.supportProps.is_support === true && this.state.supportProps.is_oppose === true) { // support to oppose
        this.textarea.focus();
      } else if (prevProps.supportProps.is_oppose === false && prevProps.supportProps.is_support === false && this.state.supportProps.is_support === true) { // comment to support
        this.textarea.focus();
      } else if (prevProps.supportProps.is_oppose === false && prevProps.supportProps.is_support === false && this.state.supportProps.is_oppose === true) { // comment to oppose
        this.textarea.focus();
      }
    }
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onSupportStoreChange () {
    const supportProps = SupportStore.get(this.props.ballot_item_we_vote_id);
    let statementTextToBeSaved = '';
    let isPublicPosition = '';

    if (this.state.showEditPositionStatementInput) {
      if (supportProps) {
        isPublicPosition = supportProps.is_public_position;
      }
      this.setState({
        supportProps,
        isPublicPosition,
      });
    } else {
      if (supportProps) {
        statementTextToBeSaved = supportProps.voter_statement_text;
        isPublicPosition = supportProps.is_public_position;
      }
      this.setState({
        statementTextToBeSaved,
        supportProps,
        isPublicPosition,
      });
    }
  }

  onVoterStoreChange () {
    this.setState({
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
  }

  closeEditPositionStatementInput = () => {
    this.setState({ showEditPositionStatementInput: false, commentActive: false/* ,  disabled: true */ });
  }

  openEditPositionStatementInput = () => {
    this.setState({ showEditPositionStatementInput: true, commentActive: true /* , disabled: false */ });
  }

  onBlurInput = () => {
    // if (e.target && e.target.className && !e.target.className.contains('postsave-button')) {
    this.setState({ commentActive: false });
    // }
    // console.log('ItemPositionStatementActionBar, onBlurInput:', e.target);

    restoreStylesAfterCordovaKeyboard(__filename);
  };

  onFocusInput = () => {
    // console.log('Setting commentActive to true');
    // if (e.target && e.target.className && !e.target.className.contains('postsave-button')) {
    this.setState({ commentActive: true });
    // }

    prepareForCordovaKeyboard(__filename);
  };

  savePositionStatement (e) {
    // console.log('ItemPositionStatementActionBar this.props.ballot_item_we_vote_id:', this.props.ballot_item_we_vote_id, 'this.props.type: ', this.props.type, 'this.state.statementTextToBeSaved: ', this.state.statementTextToBeSaved);
    e.preventDefault();
    SupportActions.voterPositionCommentSave(this.props.ballot_item_we_vote_id, this.props.type, this.state.statementTextToBeSaved);
    if (this.state.statementTextToBeSaved.length) {
      this.closeEditPositionStatementInput();
    }
  }

  updateStatementTextToBeSaved (e) {
    this.setState({
      statementTextToBeSaved: e.target.value,
      showEditPositionStatementInput: true,
      // disabled: false,
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ItemPositionStatementActionBar caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog(__filename);
    if (this.state.supportProps === undefined) {
      return <div />;
    }

    const { classes } = this.props;

    let rows = 1;

    if (this.state.commentActive && this.props.mobile) {
      rows = 4;
    } else if (this.state.commentActive && !this.props.mobile) {
      rows = 5;
    } else if (!this.state.commentActive && !this.props.mobile) {
      rows = 3;
    }

    let { statementTextToBeSaved } = this.state;
    statementTextToBeSaved = statementTextToBeSaved.length === 0 ? null : statementTextToBeSaved;
    const horizontalEllipsis = '\u2026';
    let statementPlaceholderText = `Your thoughts${horizontalEllipsis}`;

    if (this.state.supportProps.is_support) {
      if (this.props.ballotItemDisplayName) {
        statementPlaceholderText = `Why you chose ${this.props.ballotItemDisplayName}${horizontalEllipsis}`;
      } else {
        statementPlaceholderText = `Why you support${horizontalEllipsis}`;
      }
    } else if (this.state.supportProps.is_oppose) {
      if (this.props.ballotItemDisplayName) {
        statementPlaceholderText = `Why you oppose ${this.props.ballotItemDisplayName}${horizontalEllipsis}`;
      } else {
        statementPlaceholderText = `Why you oppose${horizontalEllipsis}`;
      }
    } else if (this.props.ballotItemDisplayName) {
      statementPlaceholderText = `Your thoughts about ${this.props.ballotItemDisplayName}${horizontalEllipsis}`;
    } else {
      statementPlaceholderText = `Your thoughts${horizontalEllipsis}`;
    }

    // Currently this "Post" text is the same given we display the visibility setting, but we may want to change this
    //  here if the near by visibility setting text changes
    let postButtonText = 'Save';
    if (this.state.voterIsSignedIn) {
      if (this.state.isPublicPosition) {
        postButtonText = 'Post';
      }
    }

    const noStatementText = !(statementTextToBeSaved !== null && statementTextToBeSaved.length);
    const editMode = this.state.showEditPositionStatementInput || noStatementText;

    // console.log('ItemPositionStatementActionBar: this.state.showEditPositionStatementInput: ', this.state.showEditPositionStatementInput);
    const onSavePositionStatementClick = this.state.showEditPositionStatementInput ? this.closeEditPositionStatementInput : this.openEditPositionStatementInput;
    const onKeyDown = (e) => {
      const enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onSavePositionStatementClick();
      }
    };

    // let videoUrl = '';
    // let statementTextNoUrl = null;
    // let youTubeUrl;
    // let vimeoUrl;
    //
    // if (statementTextToBeSaved) {
    //   youTubeUrl = statementTextToBeSaved.match(youTubeRegX);
    //   vimeoUrl = statementTextToBeSaved.match(vimeoRegX);
    // }
    //
    // if (youTubeUrl) {
    //   [videoUrl] = youTubeUrl;
    //   statementTextNoUrl = statementTextToBeSaved.replace(videoUrl, '');
    // }
    //
    // if (vimeoUrl) {
    //   [videoUrl] = vimeoUrl;
    //   statementTextNoUrl = statementTextToBeSaved.replace(videoUrl, '');
    // }

    // console.log('ItemPositionStatementActionBar, editMode: ', editMode);
    // minRows={1}
    return (
      <div className={this.props.shown_in_list ? 'position-statement__container__in-list' : 'position-statement__container'}>
        { // Show the edit box (Viewing self)
          editMode ? (
            <Paper
              className={classes.root}
            >
              <form className={classes.flex} onSubmit={this.savePositionStatement.bind(this)} onFocus={this.onFocusInput} onBlur={this.onBlurInput}>
                <InputBase onChange={this.updateStatementTextToBeSaved}
                  name="statementTextToBeSaved"
                  classes={{ root: classes.input }}
                  placeholder={statementPlaceholderText}
                  defaultValue={statementTextToBeSaved}
                  inputRef={(tag) => { this.textarea = tag; }}
                  multiline
                  rows={rows}
                />
                <PostSaveButton className="postsave-button">
                  <Button className="postsave-button"
                  variant="outlined"
                  color="primary"
                  classes={{ outlinedPrimary: classes.buttonOutlinedPrimary }}
                  type="submit"
                  size="small"
                  >
                    {postButtonText}
                  </Button>
                </PostSaveButton>
              </form>
            </Paper>
          ) : (
            <Paper
              className={`${classes.disabled} ${classes.flex} ${classes.root}`}
            >
              <InputBase
                onKeyDown={onKeyDown}
                name="statementTextToBeSaved"
                classes={{ root: classes.input, disabled: classes.disabledInput }}
                placeholder={statementPlaceholderText}
                defaultValue={statementTextToBeSaved}
                onFocus={() => prepareForCordovaKeyboard(__filename)}
                onBlur={() => restoreStylesAfterCordovaKeyboard(__filename)}
                inputRef={(tag) => { this.textarea = tag; }}
                multiline
                disabled
                rows={rows}
              />
              <PostSaveButton className="postsave-button">
                <Button
                  variant="outlined"
                  color="primary"
                  className="postsave-button"
                  classes={{ outlinedPrimary: classes.buttonOutlinedPrimary }}
                  onClick={onSavePositionStatementClick}
                  size="small"
                >
                  Edit
                </Button>
              </PostSaveButton>
            </Paper>
          )
       }
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    boxShadow: 'none',
    border: '1px solid #333',
    padding: '8px',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
  },
  flex: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
    },
  },
  input: {
    flex: '1 1 0',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
  },
  disabled: {
    background: '#dcdcdc',
    border: 'none',

  },
  disabledInput: {
    color: '#313131',
  },
  buttonOutlinedPrimary: {
    padding: '4px 8px',
    fontWeight: 600,
    background: 'white',
    color: '#313131',
    [theme.breakpoints.down('md')]: {
      padding: '2px 4px',
      fontWeight: 600,
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      fontWeight: 600,
    },
  },
});

const PostSaveButton = styled.div`
  width: auto;
  margin-left: auto;
  margin-top: auto;
  @media(max-width: 576px) {
    height: 28px;
    display: flex;
    align-items: center;
    margin-bottom: auto;
  }
`;

export default withTheme()(withStyles(styles)(ItemPositionStatementActionBar));
