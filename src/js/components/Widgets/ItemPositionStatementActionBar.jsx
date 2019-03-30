// This file is flooded with non-camel case, so don't flag for now, in order to find more important issues
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import Textarea from 'react-textarea-autosize';
import { cordovaDot, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import ReadMore from './ReadMore';
// import PositionPublicToggle from './PositionPublicToggle';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { vimeoRegX, youTubeRegX, stringContains } from '../../utils/textFormat';
import avatarGeneric from '../../../img/global/svg-icons/avatar-generic.svg';

export default class ItemPositionStatementActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    ballotItemDisplayName: PropTypes.string,
    type: PropTypes.string.isRequired,
    comment_edit_mode_on: PropTypes.bool,
    supportProps: PropTypes.object,
    shown_in_list: PropTypes.bool,
    shouldFocus: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      isPublicPosition: undefined,
      showEditPositionStatementInput: undefined,
      supportProps: undefined,
      statementTextToBeSaved: undefined,
      voterPhotoUrlMedium: '',
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
      });
    } else {
      const voterStatementText = (nextProps.supportProps && nextProps.supportProps.voter_statement_text) || '';
      this.setState({
        statementTextToBeSaved: voterStatementText,
        showEditPositionStatementInput: nextProps.comment_edit_mode_on,
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
    this.setState({ showEditPositionStatementInput: false });
  }

  openEditPositionStatementInput () {
    this.setState({ showEditPositionStatementInput: true });
  }

  render () {
    renderLog(__filename);
    if (this.state.supportProps === undefined) {
      return <div />;
    }

    let { statementTextToBeSaved } = this.state;
    const { voterFullName, voterPhotoUrlMedium } = this.state;
    statementTextToBeSaved = statementTextToBeSaved.length === 0 ? null : statementTextToBeSaved;

    let statementPlaceholderText;
    const horizontalEllipsis = '\u2026';
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

    const speakerImageUrlHttps = voterPhotoUrlMedium;
    const speakerDisplayName = stringContains('Voter-', voterFullName) ? '' : voterFullName;
    const imagePlaceholder = <span className="position-statement__avatar"><img src={cordovaDot(avatarGeneric)} width="34" height="34" color="#c0c0c0" alt="generic voter" /></span>;

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
            <form onSubmit={this.savePositionStatement.bind(this)}>
              <div className="position-statement d-print-block">
                { speakerImageUrlHttps ? (
                  <img className="position-statement__avatar"
                       src={speakerImageUrlHttps}
                       width="34px"
                  />
                ) :
                  imagePlaceholder
                }
                <span className="position-statement__input-group u-flex u-items-start">
                  <Textarea onChange={this.updateStatementTextToBeSaved}
                    name="statementTextToBeSaved"
                    className="position-statement__input u-push--sm form-control"
                    minRows={2}
                    placeholder={statementPlaceholderText}
                    defaultValue={statementTextToBeSaved}
                    onFocus={() => prepareForCordovaKeyboard(__filename)}
                    onBlur={() => restoreStylesAfterCordovaKeyboard(__filename)}
                    inputRef={(tag) => { this.textarea = tag; }}
                  />
                  <div className="u-flex u-flex-column u-justify-between u-items-end">
                    <Button variant="outline-secondary" size="sm" type="submit">{postButtonText}</Button>
                  </div>
                </span>
              </div>
            </form>
          ) : (
          // Show the comment, but in read-only mode
            <div className={shortVersion ? 'position-statement--truncated' : 'position-statement'}>
              { speakerImageUrlHttps ? (
                <img className="position-statement__avatar"
                       src={speakerImageUrlHttps}
                       width="34px"
                       alt="avatar"
                />
              ) :
                imagePlaceholder
                }
              <div className="position-statement__description u-flex u-items-start">
                <div className="u-flex u-flex-column u-justify-between">
                  { speakerDisplayName ? (
                    <span className="u-bold">
                      {speakerDisplayName}
                      <br />
                    </span>
                  ) : null
                    }
                  { statementTextNoUrl ?
                    <ReadMore text_to_display={statementTextNoUrl} /> :
                    <ReadMore text_to_display={statementTextToBeSaved} />
                    }
                  { videoUrl ?
                    <ReactPlayer url={`${videoUrl}`} width="300px" height="231px" /> :
                    null
                    }
                  { shortVersion ? (
                    <span onKeyDown={onKeyDown}
                            className="position-statement__edit-position-pseudo"
                            onClick={onSavePositionStatementClick}
                            title="Edit this position"
                    />
                  ) : null
                    }
                  <div onKeyDown={onKeyDown}
                         className="position-statement__edit-position-link"
                         onClick={onSavePositionStatementClick}
                         title="Edit this position"
                  >
                      Edit
                  </div>
                </div>
                {
                /*
                <div className="u-flex u-flex-column u-justify-between u-items-end">
                  <PositionPublicToggle
                    ballotItemWeVoteId={this.props.ballot_item_we_vote_id}
                    type={this.props.type}
                    supportProps={this.props.supportProps}
                    className="u-flex-auto u-tr d-print-block"
                  />
                </div>
                */
                }
              </div>
            </div>
          )
       }
      </div>
    );
  }
}
