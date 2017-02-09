import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

// OrganizationTinyDisplay is used by ItemTinyOpinionsToFollow for viewing the logos/icons for voter guides
//  you can follow on the Ballot page
export default class OrganizationTinyDisplay extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string,
    voter_guide_image_url: PropTypes.string,
    voter_guide_display_name: PropTypes.string,
    candidate_name: PropTypes.string,
    speaker_display_name: PropTypes.string,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_handle: PropTypes.string,
    children: PropTypes.array,  // A list of the tags in OrganizationDisplayForList when called (from GuideList for example)
    is_support: PropTypes.bool,
    is_positive_rating: PropTypes.bool,
    is_oppose: PropTypes.bool,
    is_negative_rating: PropTypes.bool,
    is_information_only: PropTypes.bool,
    vote_smart_rating: PropTypes.string,
    speaker_text: PropTypes.string,
    more_info_url: PropTypes.string
  };

  render () {
    // We package up the above variables to mimic a position
    var position = this.props;

    const {
      twitter_followers_count,
      organization_we_vote_id,
      voter_guide_image_url,
    } = this.props;
    let num_of_lines = 2;
    let voter_guide_display_name = this.props.voter_guide_display_name ? this.props.voter_guide_display_name : "";
    let twitterDescription = this.props.twitter_description ? this.props.twitter_description : "";
    // If the voter_guide_display_name is in the twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_guide_display_name, twitterDescription);

    // TwitterHandle-based link
    var voterGuideLink = this.props.twitter_handle ? "/" + this.props.twitter_handle : "/voterguide/" + organization_we_vote_id;

    return <div className="card-child card-child--not-followed">
      <div className="card-child__media-object-anchor">
        <Link to={voterGuideLink} className="u-no-underline">
          <ImageHandler className="card-child__avatar" sizeClassName="icon-lg" imageUrl={voter_guide_image_url} />
        </Link>
      </div>
    </div>;
  }
}
