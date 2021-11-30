import { Button, InputBase, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import { shortenText } from '../../utils/textFormat';

class ItemPositionStatementActionBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterPositionIsPublic: undefined,
      showEditPositionStatementInput: undefined,
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
      voterTextStatement: '',
      commentActive: false,
    };
    this.updateStatementTextToBeSaved = this.updateStatementTextToBeSaved.bind(this);
    this.onFocusInput = this.onFocusInput.bind(this);
    this.onBlurInput = this.onBlurInput.bind(this);
  }

  componentDidMount () {
    const { ballotItemWeVoteId, commentEditModeOn } = this.props;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      const { voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet;
      this.setState({
        voterOpposesBallotItem,
        voterPositionIsPublic,
        voterSupportsBallotItem,
        voterTextStatement,
      });
    }

    this.setState({
      showEditPositionStatementInput: commentEditModeOn,
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { ballotItemWeVoteId } = this.props;
    const { showEditPositionStatementInput } = this.state;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    let voterTextStatement = '';
    if (ballotItemStatSheet) {
      const { voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem } = ballotItemStatSheet;
      ({ voterTextStatement } = ballotItemStatSheet);
      this.setState({
        voterOpposesBallotItem,
        voterPositionIsPublic,
        voterSupportsBallotItem,
      });
    }
    if (showEditPositionStatementInput) {
      // we don't want to do anything
    } else if (voterTextStatement) {
      this.setState({
        voterTextStatement,
        showEditPositionStatementInput: false,
      });
    } else {
      this.setState({
        voterTextStatement: '',
        showEditPositionStatementInput: nextProps.commentEditModeOn,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.commentActive !== nextState.commentActive) return true;
    // if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) return true;
    if (this.state.voterPositionIsPublic !== nextState.voterPositionIsPublic) return true;
    if (this.state.voterTextStatement !== nextState.voterTextStatement) return true;
    if (this.state.showEditPositionStatementInput !== nextState.showEditPositionStatementInput) return true;
    if (this.state.voterSupportsBallotItem !== nextState.voterSupportsBallotItem) return true;
    if (this.state.voterOpposesBallotItem !== nextState.voterOpposesBallotItem) return true;
    return false;
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ItemPositionStatementActionBar caught error: ', `${error} with info: `, info);
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
    const { ballotItemWeVoteId } = this.props;
    const { showEditPositionStatementInput } = this.state;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    let voterOpposesBallotItem = '';
    let voterSupportsBallotItem = '';
    let voterTextStatement = '';
    let voterPositionIsPublic = '';
    if (ballotItemStatSheet) {
      ({ voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet);
    }
    this.setState({
      voterOpposesBallotItem,
      voterSupportsBallotItem,
    });

    if (showEditPositionStatementInput) {
      if (ballotItemStatSheet) {
        ({ voterPositionIsPublic } = ballotItemStatSheet);
      }
      this.setState({
        voterPositionIsPublic,
      });
    } else {
      if (ballotItemStatSheet) {
        ({ voterPositionIsPublic, voterTextStatement } = ballotItemStatSheet);
      }
      this.setState({
        voterTextStatement,
        voterPositionIsPublic,
      });
    }
  }

  onVoterStoreChange () {
    this.setState({
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
  }

  closeEditPositionStatementInput = () => {
    this.setState({ showEditPositionStatementInput: false, commentActive: false });
  };

  openEditPositionStatementInput = () => {
    this.setState({ showEditPositionStatementInput: true, commentActive: true });
  };

  onBlurInput = () => {
    // if (e.target && e.target.className && !e.target.className.includes('postsave-button')) {
    this.setState({ commentActive: false });
    // }
    // console.log('ItemPositionStatementActionBar, onBlurInput:', e.target);

    restoreStylesAfterCordovaKeyboard('ItemPositionStatementActionBar');
  };

  onFocusInput = () => {
    // console.log('Setting commentActive to true');
    // if (e.target && e.target.className && !e.target.className.includes('postsave-button')) {
    this.setState({ commentActive: true });
    // }

    prepareForCordovaKeyboard('ItemPositionStatementActionBar');
  };

  savePositionStatement (e) {
    e.preventDefault();
    const { ballotItemWeVoteId, ballotItemType } = this.props;
    const { voterTextStatement } = this.state;
    // console.log('ItemPositionStatementActionBar ballotItemWeVoteId:', ballotItemWeVoteId, 'ballotItemType: ', ballotItemType, 'voterTextStatement: ', voterTextStatement);
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, ballotItemType, voterTextStatement);
    if (voterTextStatement.length) {
      this.closeEditPositionStatementInput();
    }
  }

  updateStatementTextToBeSaved (e) {
    this.setState({
      voterTextStatement: e.target.value,
      showEditPositionStatementInput: true,
    });
  }

  render () {
    renderLog('ItemPositionStatementActionBar');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, ballotItemDisplayName, ballotItemWeVoteId, externalUniqueId, mobile/* , inModal, showPositionStatementActionBar */ } = this.props;
    const { commentActive, showEditPositionStatementInput, voterIsSignedIn, voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = this.state;

    // console.log('inModal: ', inModal);

    let rows;

    if (mobile) {
      if (commentActive) {
        // If voter has clicked in comment box, mobile
        rows = 4;
      } else {
        // Size of comment box prior to comment, mobile
        rows = 2;
      }
    } else if (commentActive) {
      // If voter has clicked in comment box, desktop
      rows = 5;
    } else {
      // Size of comment box prior to comment, desktop
      rows = 1;
    }

    const horizontalEllipsis = '\u2026';
    let statementPlaceholderText = `Your thoughts${horizontalEllipsis}`;

    if (voterSupportsBallotItem) {
      if (ballotItemDisplayName) {
        statementPlaceholderText = `Why you chose ${ballotItemDisplayName}${horizontalEllipsis}`;
      } else {
        statementPlaceholderText = `Why you support${horizontalEllipsis}`;
      }
    } else if (voterOpposesBallotItem) {
      if (ballotItemDisplayName) {
        statementPlaceholderText = `Why you oppose ${ballotItemDisplayName}${horizontalEllipsis}`;
      } else {
        statementPlaceholderText = `Why you oppose${horizontalEllipsis}`;
      }
    } else if (ballotItemDisplayName) {
      statementPlaceholderText = `Your thoughts about ${ballotItemDisplayName}${horizontalEllipsis}`;
    } else {
      statementPlaceholderText = `Your thoughts${horizontalEllipsis}`;
    }

    // Currently this "Post" text is the same given we display the visibility setting, but we may want to change this
    //  here if the near by visibility setting text changes
    let postButtonText = 'Save';
    if (voterIsSignedIn) {
      if (voterPositionIsPublic) {
        postButtonText = 'Post';
      }
    }

    const noStatementText = !(voterTextStatement.length);
    const editMode = showEditPositionStatementInput || noStatementText;

    // console.log('ItemPositionStatementActionBar: showEditPositionStatementInput: ', showEditPositionStatementInput);
    const onSavePositionStatementClick = showEditPositionStatementInput ? this.closeEditPositionStatementInput : this.openEditPositionStatementInput;
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
    // if (voterTextStatement) {
    //   youTubeUrl = voterTextStatement.match(youTubeRegX);
    //   vimeoUrl = voterTextStatement.match(vimeoRegX);
    // }
    //
    // if (youTubeUrl) {
    //   [videoUrl] = youTubeUrl;
    //   statementTextNoUrl = voterTextStatement.replace(videoUrl, '');
    // }
    //
    // if (vimeoUrl) {
    //   [videoUrl] = vimeoUrl;
    //   statementTextNoUrl = voterTextStatement.replace(videoUrl, '');
    // }

    // console.log('ItemPositionStatementActionBar, editMode: ', editMode);
    // minRows={1}
    // console.log('editMode:', editMode);
    return (
      <Wrapper shownInList={this.props.shownInList}>
        { // Show the edit box (Viewing self)
          editMode ? (
            <Paper
              elevation={2}
              className={window.innerWidth >= 769 ? classes.rootWhite : classes.root}
            >
              <form className={classes.flex} onSubmit={this.savePositionStatement.bind(this)} onFocus={this.onFocusInput} onBlur={this.onBlurInput}>
                <InputBase onChange={this.updateStatementTextToBeSaved}
                  id={`itemPositionStatementActionBarTextArea-${ballotItemWeVoteId}-${externalUniqueId}`}
                  name="voterTextStatement"
                  classes={{ root: classes.input }}
                  placeholder={statementPlaceholderText}
                  defaultValue={voterTextStatement}
                  inputRef={(tag) => { this.textarea = tag; }}
                  multiline
                  rows={rows}
                />
                <PostSaveButton className="postsave-button">
                  <Button
                    id={`itemPositionStatementActionBarSave-${ballotItemWeVoteId}-${externalUniqueId}`}
                    className="postsave-button"
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
              elevation={2}
              className={`${window.innerWidth >= 769 ? classes.disabledWhite : classes.disabled} ${classes.flex} ${classes.root}`}
            >
              <InputBase
                onKeyDown={onKeyDown}
                name="voterTextStatement"
                classes={{ root: classes.input, disabled: classes.disabledInput }}
                placeholder={statementPlaceholderText}
                defaultValue={isMobileScreenSize() ? shortenText(voterTextStatement, 60) : shortenText(voterTextStatement, 100)}
                onFocus={() => prepareForCordovaKeyboard('ItemPositionStatementActionBar')}
                onBlur={() => restoreStylesAfterCordovaKeyboard('ItemPositionStatementActionBar')}
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
                  id={`itemPositionStatementActionBarEdit-${ballotItemWeVoteId}-${externalUniqueId}`}
                  onClick={onSavePositionStatementClick}
                  size="small"
                >
                  Edit
                </Button>
              </PostSaveButton>
            </Paper>
          )
       }
      </Wrapper>
    );
  }
}
ItemPositionStatementActionBar.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string,
  ballotItemType: PropTypes.string.isRequired,
  commentEditModeOn: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  shownInList: PropTypes.bool,
  classes: PropTypes.object,
  mobile: PropTypes.bool,
  // inModal: PropTypes.bool,
};

const styles = (theme) => ({
  root: {
    boxShadow: 'none',
    border: '1px solid #333',
    padding: '8px',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
  },
  rootWhite: {
    boxShadow: 'none',
    border: 'none',
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
    background: '#eee',
    border: 'none',
  },
  disabledWhite: {
    background: '#fff',
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
      fontWeight: 500,
      height: '100%',
      fontSize: 12,
    },
    [theme.breakpoints.down('sm')]: {
      padding: '2px 4px',
      fontWeight: 600,
      height: '100%',
      fontSize: 10,
    },
  },
});

const Wrapper = styled.div`
  ${({ shownInList }) => (shownInList ? '' : (
    'background-color: #f8f8f8;' +
    'padding: 8px 16px;' +
    'margin: 0 -16px 8px 0;'
  )
  )}
`;

const PostSaveButton = styled.div`
  width: auto;
  margin-left: auto;
  margin-top: auto;
  @media(max-width: 576px) {
    height: 28px;
    display: flex;
    align-items: flex-end;
  }
`;

export default withTheme(withStyles(styles)(ItemPositionStatementActionBar));
