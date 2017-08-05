import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";

// OrganizationDisplayForList is used by GuideList for viewing voter guides you can follow on the Candidate
// and Opinions (you can follow) Components
// Please see VoterGuide/OrganizationCard for the Component displayed by TwitterHandle
export default class OrganizationDisplayForListCompressed extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string,
    voter_guide_image_url_large: PropTypes.string,
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
    // console.log("OrganizationDisplayForList render");
    if (this.props.organization_we_vote_id === undefined) {
      // console.log("OrganizationDisplayForList this.props.organization_we_vote_id === undefined");
      return null;
    }

    const {
      organization_we_vote_id,
      voter_guide_image_url_large,
    } = this.props;
    let voter_guide_display_name = this.props.voter_guide_display_name ? this.props.voter_guide_display_name : "";

    // TwitterHandle-based link
    var voterGuideLink = this.props.twitter_handle ? "/" + this.props.twitter_handle : "/voterguide/" + organization_we_vote_id;

    return <div className="card-child card-child--not-followed">
      <div className="card-child__media-object-anchor">
        <Link to={voterGuideLink} className="u-no-underline">
          <ImageHandler className="card-child__avatar" sizeClassName="image-lg " imageUrl={voter_guide_image_url_large} />
        </Link>
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          <Link to={voterGuideLink}>
            <h4 className="card-child__display-name">{voter_guide_display_name}</h4>
          </Link>
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            {this.props.children}
          </div>
        </div>
      </div>
    </div>;
  }
}
