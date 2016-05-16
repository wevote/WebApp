import StarAction from "../../components/Widgets/StarAction";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class OrganizationPositionItem extends Component {
  static propTypes = {
    position: PropTypes.object.isRequired
  };

  render (){
    let { ballot_item_display_name,
      kind_of_ballot_item,
      vote_smart_rating,
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
            <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>
          }
        </Link>
        <div className="position-item__content">
          <Link to={"/candidate/" + ballot_item_we_vote_id }
                onlyActiveOnIndex={false}>
            <span className="position-rating__candidate-name">{ballot_item_display_name}</span>
            </Link>
          {/* show explicit position, if available, otherwise show rating */}
          <div className="position-rating">
            {/* Rating Icon */}
            <div className="position-rating__text">
              <span className="position-rating__percentage" data-percentage={vote_smart_rating}>{vote_smart_rating}% </span> rating
              <span className="position-rating__timestamp">
                {/* add time stamp for rating if available */}
              </span>
              { vote_smart_rating ? <span className="position-item__position-source"> (source: VoteSmart.org)</span> : null }
            </div>
          </div>
        </div>
        {/*Running for {office_display_name}
        <br />
          Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
          Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
        <br />*/}
      </li>;
  }
}
