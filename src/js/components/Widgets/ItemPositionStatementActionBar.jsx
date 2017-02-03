import React, { Component, PropTypes } from "react";
import ReadMore from "../../components/Widgets/ReadMore";
import Textarea from "react-textarea-autosize";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterStore from "../../stores/VoterStore";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";
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
    if (this.props.supportProps === undefined) {
      return <div />;
    }

    var {is_support, is_oppose} = this.props.supportProps;
    var {statement_text_to_be_saved, voter_full_name, voter_photo_url} = this.state;
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
    } else if (this.props.ballot_item_display_name) {
      statement_placeholder_text = "Your thoughts about " + this.props.ballot_item_display_name + "…";
    } else {
      statement_placeholder_text = "Your thoughts…";
    }

    var user_position_text;
    var user_position_icon;
    var user_position_subject_name = this.props.ballot_item_display_name ?
      " " + this.props.ballot_item_display_name :
      null;
    if (is_support) {
      user_position_icon = "thumbs-up-color-icon";
      user_position_text = <span><strong>You support</strong>{user_position_subject_name}</span>;
    } else if (is_oppose) {
      user_position_icon = "thumbs-down-color-icon";
      user_position_text = <span><strong>You oppose</strong>{user_position_subject_name}</span>;
    } else {
      user_position_icon = "no-position-icon";
      if (this.props.ballot_item_display_name) {
        user_position_text = <em className="u-gray-mid">No position on {user_position_subject_name}</em>;
      } else {
        user_position_text = <em className="u-gray-mid">No position</em>;
      }
    }

    // Currently this "Post" text is the same given we display the visibility setting, but we may want to change this
    //  here if the near by visibility setting text changes
    var post_button_text = "Post";
    // if (is_public_position) {
    //   post_button_text = <span>Post</span>;
    // }

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
    var onKeyDown = function (e) {
      let enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onSavePositionStatementClick();
      }
    };

    return <div className="position-statement__container">

      <div className="position-statement__overview u-flex items-center mb2">
      { is_support || is_oppose ? <Icon className="mr1" name={user_position_icon} width={24} height={24} /> : null }
      { user_position_text }
        <PositionPublicToggle ballot_item_we_vote_id={this.props.ballot_item_we_vote_id}
                              type={this.props.type}
                              supportProps={this.props.supportProps}
                              className="candidate-card-position-public-toggle" />
      </div>

      { // Show the edit box (Viewing self)
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
                  defaultValue={statement_text_to_be_saved}
                  />
                <button className="btn btn-default btn-sm" type="submit">{post_button_text}</button>
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
          <div className="position-statement__description">
            { speaker_display_name ?
              <span className="position-statement__speaker-name">{speaker_display_name} <br /></span> :
              null }
            <ReadMore text_to_display={statement_text_to_be_saved} />


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
        </div>
      }
    </div>;
  }
}
