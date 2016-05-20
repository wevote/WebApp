import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import StarAction from "../Widgets/StarAction";

export default class Bookmarks extends Component {
  static propTypes = {
    bookmark: PropTypes.object.isRequired,
  };

  render () {
    const {kind_of_ballot_item, we_vote_id, ballot_item_display_name } = this.props.bookmark;
    let link;
    if (kind_of_ballot_item === "CANDIDATE"){
      link = "/candidate/" + we_vote_id;
    } else { // Measures and Offices Link to anchor tag on ballot
      link = "/ballot#" + we_vote_id;
    }
    return (<div className="list-group-item">
      <StarAction we_vote_id={we_vote_id} type={kind_of_ballot_item}/>
      <Link className="linkLight"
            to={link}
            onlyActiveOnIndex={false}>
        <div className="row">
          {ballot_item_display_name}
        </div>
      </Link>
    </div>);
  }
}
