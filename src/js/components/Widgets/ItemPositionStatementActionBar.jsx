import React, { Component, PropTypes } from "react";
import { Form } from 'react-bootstrap';
import { Link } from "react-router";
import PositionInformationOnlySnippet from "../Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../Widgets/PositionSupportOpposeSnippet";
import SupportActions from "../../actions/SupportActions";
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
      transitioning: false
    };
  }
  componentDidMount () {
    if (this.props.supportProps !== undefined) {
      this.setState({ statement_text_to_be_saved: this.props.supportProps.voter_statement_text });
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({transitioning: false});
    if (nextProps.supportProps !== undefined) {
      this.setState({ statement_text_to_be_saved: nextProps.supportProps.voter_statement_text });
    }
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
    var { statement_text_to_be_saved } = this.state;

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

    let speaker_image_url_https = "";
    let speaker_display_name = "Jeff";

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

    var no_statement_text = statement_text_to_be_saved.length ? false : true;
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
              <input
                type="text"
                onChange={this.updateStatementTextToBeSaved.bind(this)}
                name="statement_text_to_be_saved"
                value={statement_text_to_be_saved}
                className="position-statement__input bs-form-control"
                placeholder={statement_placeholder_text}
              />
              <button className="bs-btn bs-btn-default" type="submit">Post</button>
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
            <span className="position-statement__speaker-name">{speaker_display_name} </span>
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
