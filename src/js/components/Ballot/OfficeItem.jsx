import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import StarAction from "../../components/Widgets/StarAction";
import { capitalizeString } from "../../utils/textFormat";

export default class OfficeItem extends Component {
  static propTypes = {
    key: PropTypes.string,
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
    let goToOfficeLink = function () { browserHistory.push(officeLink); };

    ballot_item_display_name = capitalizeString(ballot_item_display_name);
    let candidates_html = <span></span>;  // For a preview of the candidates

    return <div className="card-main office-item">
      <div className="card-main__content">
        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <Link to={officeLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
          }
        </h2>
        <StarAction we_vote_id={we_vote_id} type="OFFICE"/>

        <div className={ this.props.link_to_ballot_item_page ?
                "u-cursor--pointer" : null }
              onClick={ this.props.link_to_ballot_item_page ?
                goToOfficeLink : null }>{candidates_html}
        </div>
      </div>
    </div>;
  }
}
