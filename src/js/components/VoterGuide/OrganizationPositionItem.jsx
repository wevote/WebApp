import StarAction from "../../components/Widgets/StarAction";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";

export default class OrganizationPositionItem extends Component {
  static propTypes = {
    position: PropTypes.object.isRequired
  };

  render (){
    let { ballot_item_display_name,
      kind_of_ballot_item,
      vote_smart_rating,
      vote_smart_time_span,
      ballot_item_we_vote_id,
      ballot_item_image_url_https } = this.props.position;

    return <li className="position-item">
          <StarAction we_vote_id={ballot_item_we_vote_id} type={kind_of_ballot_item} />
        <Link to={"/candidate/" + ballot_item_we_vote_id }
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
          <Link to={"/candidate/" + ballot_item_we_vote_id }
                onlyActiveOnIndex={false}>
            <span className="position-rating__candidate-name">{ballot_item_display_name}</span>
          </Link>
          
          {/* wasn't sure how to get this to work - Jeff */}
          {/* show explicit position, if available, otherwise show rating */}
          
          {/* make into component */}
          {/* if (position.is_support || position.is_oppose) {
            org_position = <div className="explicit-position">
              { position.is_support ? <img src="/img/global/icons/thumbs-up-color-icon.svg" width="20" height="20" className="explicit-position__icon" alt="Supports" /> : "[oppose icon]" }
              <div className="explicit-position__text">
                <span className="explicit-position__position-label">
                  { position.is_support ? "Supports" : "Opposes" }
                </span>
                <span> {this.props.candidate_display_name}</span>
              </div>
            </div>);
          } else if (vote_smart_rating) { */}
          <PositionRatingSnippet rating = {vote_smart_rating} />

        </div>
        {/*Running for {office_display_name}
        <br />
          Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
          Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
        <br />*/}
      </li>;
  }
}
