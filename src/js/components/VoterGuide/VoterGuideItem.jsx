import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Image from "../../components/Image";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class VoterGuideItem extends Component {
  static propTypes = {
    voter_guide_display_name: PropTypes.string,
    voter_guide_image_url: PropTypes.string,
    google_civic_election_id: PropTypes.string,
    we_vote_id: PropTypes.string,               // voter_guide we_vote_id
    voter_guide_owner_type: PropTypes.string,
    organization_we_vote_id: PropTypes.string,
    public_figure_we_vote_id: PropTypes.string,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    last_updated: PropTypes.string,
    OrganizationFollowed: PropTypes.string,
    OrganizationIgnored: PropTypes.string
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
    var voter_guide_we_vote_id_link = "/voterguide/" + this.props.organization_we_vote_id;

    /* This was refactored into /src/js/components/VoterGuide/GuideList.jsx for "More Opinions" page.
     * Since the migration of the existing styles was not done with total fidelity, we need to leave this
     * file in place until the migration (or reintegration back into this file) can be completed.
     * TODO: Complete migration of this functionality */
      return <div className="row">
              <div className="ballot-item well well-skinny well-bg--light split-top-skinny clearfix">
                  <div className="col-xs-2 col-sm-2">
                      <Link to={voter_guide_we_vote_id_link}>
                      <Image imageUrl={this.props.voter_guide_image_url} />
                      </Link>
                  </div>
                  <div className="col-xs-10 col-sm-8">
                      <Link to={voter_guide_we_vote_id_link}>
                          <strong>{displayName}</strong>
                          <p className="position-item__short-bio">
                            { twitterDescriptionMinusName ? <span>{twitterDescriptionMinusName}</span> :
                                null }
                          </p>
                      </Link>
                  </div>
                  {twitterFollowers ?
                      <div className="hidden-xs social-box fa fa-twitter">
                          { twitterFollowers }
                      </div> :
                      <span></span>}
              </div>
        </div>;
  }
}
