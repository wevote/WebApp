import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import { removeTwitterNameFromDescription } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionInformationOnlySnippet from "../../components/Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";
import ReadMore from "../../components/Widgets/ReadMore";

// VoterGuideDisplayForList is used by GuideList for viewing voter guides you can follow on the Candidate
// and Opinions (you can follow) Components
// Please see VoterGuide/OrganizationCard for the Component displayed by TwitterHandle
export default class VoterGuideDisplayForList extends Component {
  static propTypes = {
    children: PropTypes.array,  // A list of the tags in OrganizationDisplayForList when called (from GuideList for example)
    organization_we_vote_id: PropTypes.string,
    voter_guide_image_url_large: PropTypes.string,
    voter_guide_display_name: PropTypes.string,
    candidate_name: PropTypes.string,
    speaker_display_name: PropTypes.string,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_handle: PropTypes.string,
    is_support: PropTypes.bool,
    is_positive_rating: PropTypes.bool,
    is_oppose: PropTypes.bool,
    is_negative_rating: PropTypes.bool,
    is_information_only: PropTypes.bool,
    vote_smart_rating: PropTypes.string,
    speaker_text: PropTypes.string,
    more_info_url: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    if (this.props.organization_we_vote_id === undefined) {
      // console.log("VoterGuideDisplayForList this.props.organization_we_vote_id === undefined");
      return null;
    }

    // We package up the above variables to mimic a position
    let position = this.props;

    const {
      organization_we_vote_id: organizationWeVoteId,
      voter_guide_image_url_large: voterGuideImageUrlLarge,
    } = this.props; // twitter_followers_count,
    let numOfLines = 2;
    let voterGuideDisplayName = this.props.voter_guide_display_name ? this.props.voter_guide_display_name : "";
    let twitterDescription = this.props.twitter_description ? this.props.twitter_description : "";
    // console.log("VoterGuideDisplayForList twitterDescription: ", twitterDescription);

    // If the voter_guide_display_name is in the twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voterGuideDisplayName, twitterDescription);

    // TwitterHandle-based link
    var voterGuideLink = this.props.twitter_handle ? "/" + this.props.twitter_handle : "/voterguide/" + organizationWeVoteId;

    let positionDescription = "";
    const isOnBallotItemPage = true; // From "actor's" perspective: actorSupportsBallotItemLabel
    if (position.vote_smart_rating) {
      positionDescription = <PositionRatingSnippet {...position} />;
    } else if (position.is_support || position.is_oppose) {
      positionDescription = <PositionSupportOpposeSnippet {...position} isOnBallotItemPage={isOnBallotItemPage} />;
    } else if (position.is_information_only) {
      positionDescription = <PositionInformationOnlySnippet {...position} is_on_ballot_item_page={isOnBallotItemPage} />;
    }

    return <div className="card-child card-child--not-followed">
      <div className="card-child__media-object-anchor">
        <Link to={voterGuideLink} className="u-no-underline">
          <ImageHandler className="card-child__avatar" sizeClassName="image-lg " imageUrl={voterGuideImageUrlLarge} />
        </Link>
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          <Link to={voterGuideLink}>
            <h4 className="card-child__display-name">{voterGuideDisplayName}</h4>
          </Link>
          { twitterDescriptionMinusName ?
            <ReadMore className={"card-child__organization-description"}
                      text_to_display={twitterDescriptionMinusName}
                      num_of_lines={numOfLines} /> :
            null}
          { positionDescription }
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
