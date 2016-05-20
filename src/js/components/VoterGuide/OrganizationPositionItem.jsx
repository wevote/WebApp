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
      ballot_item_image_url_https,
      ballot_item_twitter_handle } = this.props.position;

    // TODO TwitterHandle
    // let candidateUrl = ballot_item_twitter_handle ? "/" + ballot_item_twitter_handle : "/candidate/" + ballot_item_we_vote_id;
    let candidateUrl = "/candidate/" + ballot_item_we_vote_id;

    return <li className="list-group-item">
          <StarAction we_vote_id={ballot_item_we_vote_id} type={kind_of_ballot_item} />
        <Link className="linkLight"
              to={ candidateUrl }
              onlyActiveOnIndex={false}>
          {/*<i className="icon-icon-add-friends-2-1 icon-light icon-medium" />*/}
          {
            ballot_item_image_url_https ?
              <img
                className="img-circle utils-img-contain"
                style={{display: "block", paddingTop: "10px"}}
                src={ballot_item_image_url_https}
                alt="candidate-photo"/> :
            <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>
          }
          &nbsp;<span> rates </span>
          {ballot_item_display_name} {vote_smart_rating} %
          <br />
          {/*Running for {office_display_name}
          <br />
            Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
            Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
          <br />*/}
        </Link>
        </li>;
  }
}
