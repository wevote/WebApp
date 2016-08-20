import React, { Component, PropTypes } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router";
import Textarea from 'react-textarea-autosize';
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterStore from "../../stores/VoterStore";
var Icon = require("react-svg-icons");

export default class ItemPositionStatementActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string,
    type: PropTypes.string.isRequired,
    supportProps: PropTypes.object,
    //saveUrl: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      showEditPositionStatementInput: false,
      statement_text_to_be_saved: "",
      is_public_position: false,
      transitioning: false,
      voter_photo_url: ""
    };
  }
  componentDidMount () {
    if (this.props.supportProps !== undefined) {
      this.setState({
        statement_text_to_be_saved: this.props.supportProps.voter_statement_text,
        is_public_position: this.props.supportProps.is_public_position,
      });
    }
    this.setState({
      voter_full_name: VoterStore.getFullName(),
      voter_photo_url: VoterStore.getVoterPhotoUrl()
    });
    this.supportStoreListener = SupportStore.addListener(this._onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    this.setState({transitioning: false});
    if (nextProps.supportProps !== undefined) {
      this.setState({
        statement_text_to_be_saved: nextProps.supportProps.voter_statement_text,
        is_public_position: nextProps.supportProps.is_public_position,
      });
    }
  }

  componentWillUnmount (){
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onSupportStoreChange () {
    this.setState({ supportProps: SupportStore.get(this.props.ballot_item_we_vote_id), transitioning: false });
  }

  _onVoterStoreChange () {
    this.setState({
      voter_full_name: VoterStore.getFullName(),
      voter_photo_url: VoterStore.getVoterPhotoUrl() });
  }

  updateStatementTextToBeSaved (e) {
    this.setState({
      statement_text_to_be_saved: e.target.value,
      showEditPositionStatementInput: true
    });
  }

  savePositionStatement (e) {
    e.preventDefault();
    SupportActions.voterPositionCommentSave(this.props.ballot_item_we_vote_id, this.props.type, this.state.statement_text_to_be_saved);
    this.setState({loading: true});
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
    if (this.props.supportProps === undefined){
      return <div></div>;
    }

    var { is_support, is_oppose } = this.props.supportProps;
    var { is_public_position, statement_text_to_be_saved, voter_full_name, voter_photo_url } = this.state;
    statement_text_to_be_saved = statement_text_to_be_saved.length === 0 ? null : statement_text_to_be_saved;

    var statement_placeholder_text;
    if (is_support) {
      if (this.props.ballot_item_display_name) {
        statement_placeholder_text = "Why you support " + this.props.ballot_item_display_name + "…";
      } else {
        statement_placeholder_text = "Why you support…";
      }
    } else if (is_oppose) {
      if (this.props.ballot_item_display_name) {
        statement_placeholder_text = "Why you oppose " + this.props.ballot_item_display_name + "…";
      } else {
        statement_placeholder_text = "Why you oppose…";
      }
    } else {
      if (this.props.ballot_item_display_name) {
        statement_placeholder_text = "Share your thoughts about " + this.props.ballot_item_display_name + "…";
      } else {
        statement_placeholder_text = "Share your thoughts…";
      }
    }

    // Currently this "Post" text is the same given we display the visibility setting, but we may want to change this
    //  here if the near by visibility setting text changes
    var post_button_text = <span>Post</span>;
    if (is_public_position) {
      post_button_text = <span>Post</span>;
    }

    let speaker_image_url_https = voter_photo_url;
    let speaker_display_name = voter_full_name;

    let image_placeholder = "";
    let speaker_type = "V";  // TODO DALE make this dynamic
    if (speaker_type === "O") {
        image_placeholder = <span className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    } else {
        image_placeholder = <span className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    }

    // The short version can be used to cut-off an exceedingly long comment. This applies to entries by the viewer,
    //  for viewing by him or herself. Not used currently.
    var short_version = false;

    var no_statement_text = statement_text_to_be_saved !== null && statement_text_to_be_saved.length ? false : true;
    var edit_mode = this.state.showEditPositionStatementInput || no_statement_text;
    const onSavePositionStatementClick = this.state.showEditPositionStatementInput ? this.closeEditPositionStatementInput.bind(this) : this.openEditPositionStatementInput.bind(this);
    return <div className="position-statement__container">
      { // Show the edit box
        edit_mode ?
        <form onSubmit={this.savePositionStatement.bind(this)}>
          <div className="position-statement">
            { speaker_image_url_https ?
              <img className="position-statement__avatar"
                    src={speaker_image_url_https}
                    width="34px"
              /> :
            image_placeholder }
            <span className="position-statement__input-group">
              <Textarea onChange={this.updateStatementTextToBeSaved.bind(this)}
                name="statement_text_to_be_saved"
                className="position-statement__input form-control"
                placeholder={statement_placeholder_text}
                value={statement_text_to_be_saved}
                />
              <button className="btn btn-default" type="submit">{post_button_text}</button>
            </span>
          </div>
        </form> :
        // Show the comment, but in read-only mode
        <div className={short_version ? "position-statement--truncated" : "position-statement"}>
          { speaker_image_url_https ?
            <img className="position-item__avatar"
                  src={speaker_image_url_https}
                  width="34px"
            /> :
          image_placeholder }
          <span className="position-statement__description edit-position-action"
                onClick={onSavePositionStatementClick}
                title="Edit this position">
            { speaker_display_name ?
              <span className="position-statement__speaker-name">{speaker_display_name} <br /></span> :
              null }
            {statement_text_to_be_saved}
          </span>

          { short_version ?
            <span className="position-statement__edit-position-pseudo"
                  onClick={onSavePositionStatementClick}
                  title="Edit this position"/> :
            null
          }
          { short_version ?
            <span className="position-statement__edit-position-link"
                  onClick={onSavePositionStatementClick}
                  title="Edit this position">&nbsp;Edit</span> :
            <span className="position-statement__edit-position-link-long"
                  onClick={onSavePositionStatementClick}
                  title="Edit this position">&nbsp;&nbsp;Edit</span>
          }
        </div>
      }
    </div>;
  }
}
