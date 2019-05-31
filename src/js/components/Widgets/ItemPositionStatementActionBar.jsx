// This file is flooded with non-camel case, so don't flag for now, in order to find more important issues
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// import ReactPlayer from 'react-player';
// import Textarea from 'react-textarea-autosize';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { cordovaDot, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
// import ReadMore from './ReadMore';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { vimeoRegX, youTubeRegX, stringContains } from '../../utils/textFormat';


class ItemPositionStatementActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    // ballotItemDisplayName: PropTypes.string,
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
      voterPhotoUrlMedium: '',
      // disabled: undefined,
    };
    this.updateStatementTextToBeSaved = this.updateStatementTextToBeSaved.bind(this);
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
      voterFullName: VoterStore.getFullName(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      voterPhotoUrlMedium: VoterStore.getVoterPhotoUrlMedium(),
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

  componentDidUpdate (prevProps) {
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
      voterFullName: VoterStore.getFullName(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      voterPhotoUrlMedium: VoterStore.getVoterPhotoUrlMedium(),
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ItemPositionStatementActionBar caught error: ', `${error} with info: `, info);
  }

  updateStatementTextToBeSaved (e) {
    this.setState({
      statementTextToBeSaved: e.target.value,
      showEditPositionStatementInput: true,
      // disabled: false,
    });
  }

  savePositionStatement (e) {
    e.preventDefault();
    SupportActions.voterPositionCommentSave(this.props.ballot_item_we_vote_id, this.props.type, this.state.statementTextToBeSaved);
    if (this.state.statementTextToBeSaved.length) {
      this.closeEditPositionStatementInput();
    }
  }

  closeEditPositionStatementInput () {
    this.setState({ showEditPositionStatementInput: false/*,  disabled: true */ });
  }

  openEditPositionStatementInput () {
    this.setState({ showEditPositionStatementInput: true /*, disabled: false */ });
  }

  render () {
    renderLog(__filename);
    if (this.state.supportProps === undefined) {
      return <div />;
    }

    const { classes } = this.props;

    let { statementTextToBeSaved } = this.state;
    const { voterFullName, voterPhotoUrlMedium } = this.state;
    statementTextToBeSaved = statementTextToBeSaved.length === 0 ? null : statementTextToBeSaved;
    const horizontalEllipsis = '\u2026';
    const statementPlaceholderText = `Your thoughts${horizontalEllipsis}`;

    /*
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
    */

    // Currently this "Post" text is the same given we display the visibility setting, but we may want to change this
    //  here if the near by visibility setting text changes
    let postButtonText = 'Save';
    if (this.state.voterIsSignedIn) {
      if (this.state.isPublicPosition) {
        postButtonText = 'Post';
      }
    }

    const speakerImageUrlHttps = voterPhotoUrlMedium;
    const speakerDisplayName = stringContains('Voter-', voterFullName) ? '' : voterFullName;
    const imagePlaceholder = <span className="position-statement__avatar"><img src={cordovaDot('/img/global/svg-icons/avatar-generic.svg')} width="34" height="34" color="#c0c0c0" alt="generic voter" /></span>;

    // The short version can be used to cut-off an exceedingly long comment. This applies to entries by the viewer,
    //  for viewing by him or herself. Not used currently.
    const shortVersion = false;

    const noStatementText = !(statementTextToBeSaved !== null && statementTextToBeSaved.length);
    const editMode = this.state.showEditPositionStatementInput || noStatementText;

    const onSavePositionStatementClick = this.state.showEditPositionStatementInput ? this.closeEditPositionStatementInput.bind(this) : this.openEditPositionStatementInput.bind(this);
    const onKeyDown = (e) => {
      const enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onSavePositionStatementClick();
      }
    };

    let videoUrl = '';
    let statementTextNoUrl = null;
    let youTubeUrl;
    let vimeoUrl;

    if (statementTextToBeSaved) {
      youTubeUrl = statementTextToBeSaved.match(youTubeRegX);
      vimeoUrl = statementTextToBeSaved.match(vimeoRegX);
    }

    if (youTubeUrl) {
      [videoUrl] = youTubeUrl;
      statementTextNoUrl = statementTextToBeSaved.replace(videoUrl, '');
    }

    if (vimeoUrl) {
      [videoUrl] = vimeoUrl;
      statementTextNoUrl = statementTextToBeSaved.replace(videoUrl, '');
    }

    return (
      <div className={this.props.shown_in_list ? 'position-statement__container__in-list' : 'position-statement__container'}>
        { // Show the edit box (Viewing self)
          editMode ? (
            <Paper
              className={classes.root}
            >
              <form className={classes.flex} onSubmit={this.savePositionStatement.bind(this)}>
                <InputBase onChange={this.updateStatementTextToBeSaved}
                  name="statementTextToBeSaved"
                  className={classes.input}
                  minRows={1}
                  placeholder={statementPlaceholderText}
                  defaultValue={statementTextToBeSaved}
                  onFocus={() => prepareForCordovaKeyboard(__filename)}
                  onBlur={() => restoreStylesAfterCordovaKeyboard(__filename)}
                  inputRef={(tag) => { this.textarea = tag; }}
                  multiline
                  rows={this.props.mobile ? 1 : 3}
                />
                <PostSaveButton>
                  <Button variant="outlined" color="primary" classes={{ outlinedPrimary: classes.buttonOutlinedPrimary }} type="submit" size="small">
                    {postButtonText}
                  </Button>
                </PostSaveButton>
              </form>
            </Paper>
          ) : (
            <Paper
              className={[classes.disabled, classes.flex, classes.root]}
            >
              <InputBase
                onKeyDown={onKeyDown}
                name="statementTextToBeSaved"
                classes={{ root: classes.input, disabled: classes.disabledInput }}
                minRows={1}
                placeholder={statementPlaceholderText}
                defaultValue={statementTextToBeSaved}
                onFocus={() => prepareForCordovaKeyboard(__filename)}
                onBlur={() => restoreStylesAfterCordovaKeyboard(__filename)}
                inputRef={(tag) => { this.textarea = tag; }}
                multiline
                disabled
                rows={this.props.mobile ? 1 : 3}
              />
              <PostSaveButton>
                <Button variant="outlined" color="primary" classes={{ outlinedPrimary: classes.buttonOutlinedPrimary }} onClick={onSavePositionStatementClick} size="small">
                  Edit
                </Button>
              </PostSaveButton>
            </Paper>
          // // Show the comment, but in read-only mode
          //   <div className={shortVersion ? 'position-statement--truncated' : 'position-statement'}>
          //     { speakerImageUrlHttps ? (
          //       <img className="position-statement__avatar"
          //              src={speakerImageUrlHttps}
          //              width="34px"
          //              alt="avatar"
          //       />
          //     ) :
          //       imagePlaceholder
          //       }
          //     <div className="position-statement__description u-flex u-items-start">
          //       <div className="u-flex u-flex-column u-justify-between">
          //         { speakerDisplayName ? (
          //           <span className="u-bold">
          //             {speakerDisplayName}
          //             <br />
          //           </span>
          //         ) : null
          //           }
          //         { statementTextNoUrl ?
          //           <ReadMore text_to_display={statementTextNoUrl} /> :
          //           <ReadMore text_to_display={statementTextToBeSaved} />
          //           }
          //         { videoUrl ?
          //           <ReactPlayer url={`${videoUrl}`} width="300px" height="231px" /> :
          //           null
          //           }
          //         { shortVersion ? (
          //           <span onKeyDown={onKeyDown}
          //                   className="position-statement__edit-position-pseudo"
          //                   onClick={onSavePositionStatementClick}
          //                   title="Edit this position"
          //           />
          //         ) : null
          //           }
          //         <div onKeyDown={onKeyDown}
          //                className="position-statement__edit-position-link"
          //                onClick={onSavePositionStatementClick}
          //                title="Edit this position"
          //         >
          //             Edit
          //         </div>
          //       </div>
          //       {
          //       /*
          //       <div className="u-flex u-flex-column u-justify-between u-items-end">
          //         <PositionPublicToggle
          //           ballotItemWeVoteId={this.props.ballot_item_we_vote_id}
          //           type={this.props.type}
          //           supportProps={this.props.supportProps}
          //           className="u-flex-auto u-tr d-print-block"
          //         />
          //       </div>
          //       */
          //       }
          //     </div>
          //   </div>
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
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      padding: '4px 8px',
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
  },
  disabled: {
    background: '#f5f5f5',
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
      fontWeight: 500,
    },
  },
});

const PostSaveButton = styled.div`
  width: auto;
  margin-left: auto;
  margin-top: auto;
`;

export default withTheme()(withStyles(styles)(ItemPositionStatementActionBar));
