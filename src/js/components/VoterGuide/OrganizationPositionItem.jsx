import StarAction from "../../components/Widgets/StarAction";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";

export default class OrganizationPositionItem extends Component {
  static propTypes = {
    position: PropTypes.object.isRequired
  };

  render (){
    var position = this.props.position;
    let { ballot_item_display_name,
      kind_of_ballot_item,
      vote_smart_rating,
      vote_smart_time_span,
      ballot_item_we_vote_id,
      ballot_item_image_url_https,
      ballot_item_twitter_handle } = this.props.position;

    // TODO TwitterHandle
    let candidateLink = ballot_item_twitter_handle ? "/" + ballot_item_twitter_handle : "/candidate/" + ballot_item_we_vote_id;
    // let candidateLink = "/candidate/" + ballot_item_we_vote_id;

    return <li className="position-item">
          <StarAction we_vote_id={ballot_item_we_vote_id} type={kind_of_ballot_item} />
        <Link to={ candidateLink }
              onlyActiveOnIndex={false}>
          {/*<i className="icon-icon-add-friends-2-1 icon-light icon-medium" />*/}
          { ballot_item_image_url_https ?
            <img
              className="position-item__avatar"
              src={ballot_item_image_url_https}
              alt="candidate-photo"/> :
            <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light position-item__avatar"/>
          }
        </Link>
        <div className="position-item__content">
          <Link to={ candidateLink }
                onlyActiveOnIndex={false}>
            <span className="position-rating__candidate-name">{ballot_item_display_name}</span>
          </Link>
          {/* show explicit position, if available, otherwise show rating */}
          { vote_smart_rating ?
          <PositionRatingSnippet {...position} /> :
              <PositionSupportOpposeSnippet {...position} /> }

        </div>
        {/*Running for {office_display_name}
        <br />
          Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
          Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
        <br />*/}
      </ li>;
  }
}
