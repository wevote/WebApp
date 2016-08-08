import React, { Component, PropTypes } from "react";
import PositionInformationOnlySnippet from "../Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../Widgets/PositionSupportOpposeSnippet";
var Icon = require("react-svg-icons");

const web_app_config = require("../../config");

export default class ItemPositionStatementActionBar extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string,
    type: PropTypes.string.isRequired,
    supportProps: PropTypes.object,
    //saveUrl: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { loading: false, transitioning: false};
  }

  componentWillReceiveProps () {
    this.setState({transitioning: false});
  }

  updateLocation (e) {
    this.setState({
      location: e.target.value
    });
  }

  saveLocation (e) {
    e.preventDefault();
    var { location } = this.state;
    console.log("Saving location", location);
    VoterActions.saveAddress(location);
    this.setState({loading: true});
  }

  render () {
    if (this.props.supportProps === undefined){
      // console.log("this.props.supportProps === undefined");
      return <div></div>;
    }

    var { is_support, is_oppose, voter_statement_text } = this.props.supportProps;

    var statement_placeholder_text;
    if (is_support) {
      if (this.props.ballot_item_display_name) {
        statement_placeholder_text = "Why do you support " + this.props.ballot_item_display_name + "?";
      } else {
        statement_placeholder_text = "Why do you support?";
      }
    } else if (is_oppose) {
      if (this.props.ballot_item_display_name) {
        statement_placeholder_text = "Why do you oppose " + this.props.ballot_item_display_name + "?";
      } else {
        statement_placeholder_text = "Why do you oppose?";
      }
    } else {
      if (this.props.ballot_item_display_name) {
        statement_placeholder_text = "Share your thoughts about " + this.props.ballot_item_display_name + "...";
      } else {
        statement_placeholder_text = "Share your thoughts...";
      }
    }

    console.log("voter_statement_text: ", voter_statement_text);
    let position_description = "";
    const is_on_candidate_page = true;
    if (is_support || is_oppose) {
      // candidate_display_name: PropTypes.string,
      // is_on_candidate_page: PropTypes.bool,
      // is_support: PropTypes.bool.isRequired,
      // is_oppose: PropTypes.bool.isRequired,
      // more_info_url: PropTypes.string,
      // speaker_display_name: PropTypes.string,
      // statement_text: PropTypes.string

      position_description = <PositionSupportOpposeSnippet candidate_display_name={this.props.ballot_item_display_name}
                                                           is_support={is_support}
                                                           is_oppose={is_oppose}
                                                           is_on_candidate_page={is_on_candidate_page}
                                                           is_looking_at_self
                                                           statement_text={voter_statement_text} />;
    } else {
      // candidate_display_name: PropTypes.string,
      // is_on_candidate_page: PropTypes.bool,
      // is_support: PropTypes.bool.isRequired,
      // is_oppose: PropTypes.bool.isRequired,
      // more_info_url: PropTypes.string,
      // speaker_display_name: PropTypes.string,
      // statement_text: PropTypes.string

      position_description = <PositionInformationOnlySnippet candidate_display_name={this.props.ballot_item_display_name}
                                                             is_on_candidate_page={is_on_candidate_page}
                                                             is_looking_at_self
                                                             statement_text={voter_statement_text} />;
    }

    var edit_mode = false;
    return <div className="item-positionstatementactionbar-outer-div">
        { // Show the edit box
          edit_mode ?
          <form onSubmit={this.saveLocation.bind(this)}>
            <div className="bs-input-group position-statement-input-div">
              <input
                type="text"
                onChange={this.updateLocation.bind(this)}
                name="address"
                value={voter_statement_text}
                className="bs-form-control position-statement-input"
                placeholder={statement_placeholder_text}
              />
            </div>
          </form> :
          // Show the comment, but in read-only mode
          <span>{position_description}</span>
        }
      </div>;
  }
}
