import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

/* This was refactored into /src/js/components/VoterGuide/GuideList.jsx and
* /src/js/components/VoterGuide/Organization.jsx for "More Opinions" page.
* Since the migration of the existing styles was not done with total fidelity, we need to leave this
* file in place until the migration (or reintegration back into this file) can be completed.
* TODO: Complete migration of this functionality */
export default class VoterGuideItem extends Component {
  static propTypes = {
    voter_guide_display_name: PropTypes.string,
    voter_guide_image_url: PropTypes.string,
    google_civic_election_id: PropTypes.number,
    we_vote_id: PropTypes.string,               // voter_guide we_vote_id
    voter_guide_owner_type: PropTypes.string,
    organization_we_vote_id: PropTypes.string,
    public_figure_we_vote_id: PropTypes.string,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_handle: PropTypes.string,
    last_updated: PropTypes.string,
    OrganizationFollowed: PropTypes.string,
    OrganizationIgnored: PropTypes.string,
  };

  render () {
    // If the displayName is in the twitterDescription, remove it from twitterDescription
    let displayName = this.props.voter_guide_display_name ? this.props.voter_guide_display_name : "";
    let twitterDescription = this.props.twitter_description ? this.props.twitter_description : "";
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);

    let twitterFollowers;
    const twitterFollowersCount = numberWithCommas(this.props.twitter_followers_count);
    if (this.props.twitter_followers_count) {
      twitterFollowers = twitterFollowersCount;
    }
    // TwitterHandle-based link
    var voterGuideLink = this.props.twitter_handle ? "/" + this.props.twitter_handle : "/voterguide/" + this.props.organization_we_vote_id;

    return <div className="card-child">
      <div className="card-child__media-object-avatar">
        <Link to={voterGuideLink}>
          <ImageHandler className="card-child__avatar"imageUrl={this.props.voter_guide_image_url} />
        </Link>
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          <Link to={voterGuideLink}>
            <h4 className="card-child__display-name">{displayName}</h4>
          </Link>
          <div className="card-child__short-bio">
            { twitterDescriptionMinusName ? <span>{twitterDescriptionMinusName}</span> :
                null }
          </div>
        </div>
        <div className="card-child__additional">
          {twitterFollowers ?
            <span className="twitter-followers__badge">
              <span className="fa fa-twitter twitter-followers__icon"></span>
              {numberWithCommas(twitterFollowers)}
            </span> :
            null}
        </div>
      </div>
    </div>;
  }
}
