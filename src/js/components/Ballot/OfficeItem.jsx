import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import { capitalizeString } from "../../utils/textFormat";
import { historyPush } from "../../utils/cordovaUtils";

export default class OfficeItem extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool
  };
  constructor (props) {
    super(props);
    this.state = {transitioning: false};
  }

  render () {
    let { ballot_item_display_name, we_vote_id } = this.props;
    let officeLink = "/office/" + we_vote_id;
    let goToOfficeLink = function () { historyPush(officeLink); };

    ballot_item_display_name = capitalizeString(ballot_item_display_name);
    let candidates_html = <span />;  // For a preview of the candidates

    return <div className="card-main office-item">
      <div className="card-main__content">
        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <Link to={officeLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
          }
        </h2>
        <BookmarkToggle we_vote_id={we_vote_id} type="OFFICE"/>

        <div className={ this.props.link_to_ballot_item_page ?
                "u-cursor--pointer" : null }
              onClick={ this.props.link_to_ballot_item_page ?
                goToOfficeLink : null }>{candidates_html}
        </div>
      </div>
    </div>;
  }
}
