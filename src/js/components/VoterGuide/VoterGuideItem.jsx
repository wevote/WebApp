import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FollowOrIgnore from "../../components/FollowOrIgnore";

function numberWithCommas (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export default class VoterGuideItem extends Component {
  static propTypes = {
    voter_guide_display_name: PropTypes.string,
    voter_guide_image_url: PropTypes.string,
    google_civic_election_id: PropTypes.string,
    we_vote_id: PropTypes.string,               // voter_guide we_vote_id
    voter_guide_owner_type: PropTypes.string,
    organization_we_vote_id: PropTypes.string,
    public_figure_we_vote_id: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    last_updated: PropTypes.string,
    OrganizationFollowed: PropTypes.string,
    OrganizationIgnored: PropTypes.string
  };

  render () {
    let twitterFollowers;
    const twitterFollowersCount = numberWithCommas(this.props.twitter_followers_count);
    if (this.props.twitter_followers_count) {
      twitterFollowers = <span className="fa fa-twitter">{twitterFollowersCount}</span>;
    }
    var voter_guide_we_vote_id_link = "/voterguide/" + this.props.organization_we_vote_id;

    /* This was refactored into /src/js/components/VoterGuide/GuideList.jsx for "More Opinions" page.
     * Since the migration of the existing styles was not done with total fidelity, we need to leave this
     * file in place until the migration (or reintegration back into this file) can be completed.
     * TODO: Complete migration of this functionality */
    return (
      <div className="ballot-item well well-skinny well-bg--light split-top-skinny clearfix">

      <Link to={voter_guide_we_vote_id_link}>
        <div className="hidden-xs col-sm-2">
          <img className="img-square"
                src={this.props.voter_guide_image_url}
                width="75px"
          />
        </div>
        <div className="col-xs-6 col-sm-6 display-name">
          { this.props.voter_guide_display_name }
        </div>
      </Link>
        <div className="col-xs-6 col-sm-4 utils-paddingright0">
          <FollowOrIgnore organization_we_vote_id={this.props.organization_we_vote_id} />
        </div>
        <div className="hidden-xs social-box">
          {twitterFollowers}
        </div>
      </div>
    );
  }
}
