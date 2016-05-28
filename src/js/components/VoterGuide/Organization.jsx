import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Image from "../../components/Image";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class Organization extends Component {
  static propTypes = {
    key: PropTypes.string,
    organization_we_vote_id: PropTypes.string,
    voter_guide_image_url: PropTypes.string,
    voter_guide_display_name: PropTypes.string,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_handle: PropTypes.string,
    children: PropTypes.array,
    is_support: PropTypes.bool,
    is_positive_rating: PropTypes.bool,
    is_oppose: PropTypes.bool,
    is_negative_rating: PropTypes.bool,
    vote_smart_rating: PropTypes.string
  };

  render () {

    const {
      twitter_followers_count,
      organization_we_vote_id,
      voter_guide_image_url,
      is_support,
      is_positive_rating,
      is_oppose,
      is_negative_rating,
      vote_smart_rating,
    } = this.props;

    let voter_guide_display_name = this.props.voter_guide_display_name ? this.props.voter_guide_display_name : "";
    let twitterDescription = this.props.twitter_description ? this.props.twitter_description : "";
    // If the voter_guide_display_name is in the twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_guide_display_name, twitterDescription);

    // TODO TwitterHandle - We aren't supporting internal organization links with Twitter handles yet
    // var voterGuideLink = this.props.twitter_handle ? "/" + this.props.twitter_handle : "/voterguide/" + organization_we_vote_id;
    var voterGuideLink = "/voterguide/" + organization_we_vote_id;

    return <div className="organization-item">
        <div className="organization-item__avatar">
          <Link to={voterGuideLink}>
            <Image imageUrl={voter_guide_image_url} />
          </Link>
        </div>
        <div className="organization-item__content">
          <div className="position-item__summary">
            <Link to={voterGuideLink}>
              <h4 className="organization-item__display-name">{voter_guide_display_name}</h4>
            </Link>
            { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> :
              null}
          </div>
          <div className="organization-item__additional">
            <div className="organization-item__follow-buttons">
              {this.props.children}
            </div>
            {twitter_followers_count ?
              <span className="twitter-followers__badge">
                <span className="fa fa-twitter twitter-followers__icon"></span>
                {numberWithCommas(twitter_followers_count)}
              </span> :
              null}
          </div>
        </div>
      </div>;
  }
}
