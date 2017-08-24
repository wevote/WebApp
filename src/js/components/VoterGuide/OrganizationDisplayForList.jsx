import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionInformationOnlySnippet from "../../components/Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";
import ReadMore from "../../components/Widgets/ReadMore";

// OrganizationDisplayForList is used by GuideList for viewing voter guides you can follow on the Candidate
// and Opinions (you can follow) Components
// Please see VoterGuide/OrganizationCard for the Component displayed by TwitterHandle
export default class OrganizationDisplayForList extends Component {
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
    // We package up the above variables to mimic a position
    var position = this.props;

    const {
      twitter_followers_count,
      organization_we_vote_id,
      voter_guide_image_url_large,
    } = this.props;
    let num_of_lines = 2;
    let voter_guide_display_name = this.props.voter_guide_display_name ? this.props.voter_guide_display_name : "";
    let twitterDescription = this.props.twitter_description ? this.props.twitter_description : "";
    // If the voter_guide_display_name is in the twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_guide_display_name, twitterDescription);

    // TwitterHandle-based link
    var voterGuideLink = this.props.twitter_handle ? "/" + this.props.twitter_handle : "/voterguide/" + organization_we_vote_id;

    let position_description = "";
    const is_on_ballot_item_page = true;
    if (position.vote_smart_rating) {
        position_description =
          <PositionRatingSnippet {...position} />;
    } else if (position.is_support || position.is_oppose) {
      position_description = <PositionSupportOpposeSnippet {...position} is_on_ballot_item_page={is_on_ballot_item_page} />;
    } else if (position.is_information_only) {
      position_description = <PositionInformationOnlySnippet {...position} is_on_ballot_item_page={is_on_ballot_item_page} />;
    }

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
          { twitterDescriptionMinusName ? <ReadMore text_to_display={twitterDescriptionMinusName} num_of_lines={num_of_lines} /> :
            null}
          { position_description }
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            {this.props.children}
          {/* twitter_followers_count ?
            <span className="twitter-followers__badge">
              <span className="fa fa-twitter twitter-followers__icon" />
              {numberWithCommas(twitter_followers_count)}
            </span> :
            null */}
          </div>
        </div>
      </div>
    </div>;
  }
}
