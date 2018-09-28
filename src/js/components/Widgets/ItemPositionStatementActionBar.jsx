// This file is flooded with non-camel case, so don't flag for now, in order to find more important issues
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import Icon from "react-svg-icons";
import { renderLog } from "../../utils/logging";
import ReadMore from "../../components/Widgets/ReadMore";
import Textarea from "react-textarea-autosize";
import { isSpeakerTypeOrganization } from "../../utils/organization-functions";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterStore from "../../stores/VoterStore";
import { vimeo_reg, youtube_reg } from "../../utils/textFormat";
import { stringContains } from "../../utils/textFormat";


export default class ItemPositionStatementActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string,
    type: PropTypes.string.isRequired,
    comment_edit_mode_on: PropTypes.bool,
    supportProps: PropTypes.object,
    shown_in_list: PropTypes.bool,
    stance_display_off: PropTypes.bool,
    shouldFocus: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_public_position: undefined,
      loading: false,
      showEditPositionStatementInput: undefined,
      supportProps: undefined,
      statement_text_to_be_saved: undefined,
      transitioning: false,
      voter_photo_url_medium: "",
    };
  }

  componentDidMount () {
    if (this.props.supportProps) {
      this.setState({
        is_public_position: this.props.supportProps.is_public_position,
        statement_text_to_be_saved: this.props.supportProps.voter_statement_text,
        supportProps: this.props.supportProps,
      });
    }
    if (this.props.shouldFocus && this.textarea){
      this.textarea.focus();
    }

    this.setState({
      showEditPositionStatementInput: this.props.comment_edit_mode_on,
      voter_full_name: VoterStore.getFullName(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      voter_photo_url_medium: VoterStore.getVoterPhotoUrlMedium(),
    });
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.supportProps !== undefined) {
      this.setState({
        is_public_position: nextProps.supportProps.is_public_position,
      });
    }
    if (this.state.showEditPositionStatementInput) {
      //we don't want to do anything
    } else if (nextProps.supportProps && nextProps.supportProps.voter_statement_text) {
      this.setState({
        statement_text_to_be_saved: nextProps.supportProps.voter_statement_text,
        showEditPositionStatementInput: false,
        transitioning: false,
      });
    } else {
      let voter_statement_text = nextProps.supportProps && nextProps.supportProps.voter_statement_text || "";
      this.setState({
        statement_text_to_be_saved: voter_statement_text,
        showEditPositionStatementInput: nextProps.comment_edit_mode_on,
        transitioning: false,
      });
    }
  }

  componentDidUpdate (prevProps) {
    if (this.textarea && prevProps.supportProps && this.state.supportProps) {
      if (prevProps.supportProps.is_oppose === true && this.state.supportProps.is_support === true){  //oppose to support
        this.textarea.focus();
      } else if (prevProps.supportProps.is_support === true && this.state.supportProps.is_oppose === true){ //support to oppose
        this.textarea.focus();
      } else if (prevProps.supportProps.is_oppose === false && prevProps.supportProps.is_support === false && this.state.supportProps.is_support === true){ //comment to support
        this.textarea.focus();
      } else if (prevProps.supportProps.is_oppose === false && prevProps.supportProps.is_support === false && this.state.supportProps.is_oppose === true){ //comment to oppose
        this.textarea.focus();
      }
    }
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onSupportStoreChange () {
    let supportProps = SupportStore.get(this.props.ballot_item_we_vote_id);
    let statement_text_to_be_saved = "";
    let is_public_position = "";

    if (this.state.showEditPositionStatementInput) {
      if (supportProps) {
        is_public_position = supportProps.is_public_position;
      }
      this.setState({
        supportProps: supportProps,
        is_public_position: is_public_position,
        transitioning: false,
      });
    } else {
      if (supportProps) {
        statement_text_to_be_saved = supportProps.voter_statement_text;
        is_public_position = supportProps.is_public_position;
      }
      this.setState({
        statement_text_to_be_saved: statement_text_to_be_saved,
        supportProps: supportProps,
        is_public_position: is_public_position,
        transitioning: false,
      });
    }
  }

  _onVoterStoreChange () {
    this.setState({
      voter_full_name: VoterStore.getFullName(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      voter_photo_url_medium: VoterStore.getVoterPhotoUrlMedium(),
    });
  }

  updateStatementTextToBeSaved (e) {
    this.setState({
      statement_text_to_be_saved: e.target.value,
      showEditPositionStatementInput: true,
    });
  }

  savePositionStatement (e) {
    e.preventDefault();
    SupportActions.voterPositionCommentSave(this.props.ballot_item_we_vote_id, this.props.type, this.state.statement_text_to_be_saved);
    this.setState({ loading: true });
    if (this.state.statement_text_to_be_saved.length) {
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

    let { statement_text_to_be_saved, voter_full_name, voter_photo_url_medium } = this.state;
    statement_text_to_be_saved = statement_text_to_be_saved.length === 0 ? null : statement_text_to_be_saved;

    let statementPlaceholderText;
    if (this.state.supportProps.is_support) {
      if (this.props.ballot_item_display_name) {
        statementPlaceholderText = "Why you support " + this.props.ballot_item_display_name + "\u2026";
      } else {
        statementPlaceholderText = "Why you support\u2026";
      }
    } else if (this.state.supportProps.is_oppose) {
      if (this.props.ballot_item_display_name) {
        statementPlaceholderText = "Why you oppose " + this.props.ballot_item_display_name + "\u2026";
      } else {
        statementPlaceholderText = "Why you oppose\u2026";
      }
    } else if (this.props.ballot_item_display_name) {
      statementPlaceholderText = "Your thoughts about " + this.props.ballot_item_display_name + "\u2026";
    } else {
      statementPlaceholderText = "Your thoughts\u2026";
    }

    // Currently this "Post" text is the same given we display the visibility setting, but we may want to change this
    //  here if the near by visibility setting text changes
    let post_button_text = "Save";
    if (this.state.voterIsSignedIn) {
      post_button_text = "Post";
    }

    // if (is_public_position) {
    //   post_button_text = <span>Post</span>;
    // }

    let speaker_image_url_https = voter_photo_url_medium;
    let speaker_display_name = stringContains("Voter-", voter_full_name) ? "" : voter_full_name;

    let image_placeholder = "";
    let speaker_type = "V";  // TODO DALE make this dynamic
    if (isSpeakerTypeOrganization(speaker_type)) {
      image_placeholder = <span className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    } else {
      image_placeholder = <span className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    }

    // The short version can be used to cut-off an exceedingly long comment. This applies to entries by the viewer,
    //  for viewing by him or herself. Not used currently.
    let short_version = false;

    let no_statement_text = !(statement_text_to_be_saved !== null && statement_text_to_be_saved.length);
    let edit_mode = this.state.showEditPositionStatementInput || no_statement_text;
    const onSavePositionStatementClick = this.state.showEditPositionStatementInput ? this.closeEditPositionStatementInput.bind(this) : this.openEditPositionStatementInput.bind(this);
    let onKeyDown = function (e) {
      let enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onSavePositionStatementClick();
      }
    };

    let video_url = "";
    let statement_text_no_url = null;
    let youtube_url;
    let vimeo_url;

    if (statement_text_to_be_saved) {
      youtube_url = statement_text_to_be_saved.match(youtube_reg);
      vimeo_url = statement_text_to_be_saved.match(vimeo_reg);
    }

    if (youtube_url) {
      video_url = youtube_url[0];
      statement_text_no_url = statement_text_to_be_saved.replace(video_url, "");
    }

    if (vimeo_url) {
      video_url = vimeo_url[0];
      statement_text_no_url = statement_text_to_be_saved.replace(video_url, "");
    }

    return <div className={ this.props.shown_in_list ? "position-statement__container__in-list" : "position-statement__container"}>
      { // Show the edit box (Viewing self)
        edit_mode ?
          <form onSubmit={this.savePositionStatement.bind(this)}>
            <div className="position-statement hidden-print">
              { speaker_image_url_https ?
                <img className="position-statement__avatar"
                     src={speaker_image_url_https}
                     width="34px" /> :
                image_placeholder
              }
              <span className="position-statement__input-group u-flex u-items-start">
                <Textarea onChange={this.updateStatementTextToBeSaved.bind(this)}
                  name="statement_text_to_be_saved"
                  className="position-statement__input u-push--sm form-control"
                  minRows={2}
                  placeholder={statementPlaceholderText}
                  defaultValue={statement_text_to_be_saved}
                  inputRef={tag => {this.textarea = tag;}} />
                <div className="u-flex u-flex-column u-justify-between u-items-end">
                  <PositionPublicToggle ballot_item_we_vote_id={this.props.ballot_item_we_vote_id}
                                        type={this.props.type}
                                        supportProps={this.props.supportProps}
                                        className="u-flex-auto u-tr hidden-print" />
                  <button className="position-statement__post-button btn btn-default btn-sm" type="submit">{post_button_text}</button>
                </div>
              </span>
            </div>
          </form> :

        // Show the comment, but in read-only mode
        <div className={short_version ? "position-statement--truncated" : "position-statement"}>
          { speaker_image_url_https ?
            <img className="position-statement__avatar"
                  src={speaker_image_url_https}
                  width="34px"
            /> :
          image_placeholder }
          <div className="position-statement__description u-flex u-items-start">
            <div className="u-flex u-flex-column u-justify-between">
            { speaker_display_name ?
              <span className="u-bold">{speaker_display_name} <br /></span> :
              null }
              { statement_text_no_url ?
                <ReadMore text_to_display={statement_text_no_url} /> :
                <ReadMore text_to_display={statement_text_to_be_saved} />
              }
              { video_url ?
                <ReactPlayer url={`${video_url}`} width="300px" height="231px"/> :
                null }
              { short_version ?
                <span tabIndex="0" onKeyDown={onKeyDown}
                      className="position-statement__edit-position-pseudo"
                      onClick={onSavePositionStatementClick}
                      title="Edit this position"/> :
                null
              }
              <div tabIndex="0" onKeyDown={onKeyDown}
                   className="position-statement__edit-position-link"
                   onClick={onSavePositionStatementClick}
                   title="Edit this position">Edit</div>
            </div>
            <div className="u-flex u-flex-column u-justify-between u-items-end">
              <PositionPublicToggle ballot_item_we_vote_id={this.props.ballot_item_we_vote_id}
                                    type={this.props.type}
                                    supportProps={this.props.supportProps}
                                    className="u-flex-auto u-tr hidden-print" />
            </div>
          </div>
        </div>
      }
    </div>;
  }
}
