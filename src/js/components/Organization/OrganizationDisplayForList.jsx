import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ImageHandler from '../ImageHandler';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import PositionRatingSnippet from '../Widgets/PositionRatingSnippet';
import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';
import ReadMore from '../Widgets/ReadMore';
import { renderLog } from '../../utils/logging';

// OrganizationDisplayForList is used to display Organizations (as opposed to Voter Guides)
export default class OrganizationDisplayForList extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string,
    organization_photo_url_medium: PropTypes.string,
    organization_name: PropTypes.string,
    children: PropTypes.array, // A list of the tags in OrganizationDisplayForList when called (from GuideList for example)
    twitter_description: PropTypes.string,
    organization_twitter_handle: PropTypes.string,
    // organization_we_vote_id: PropTypes.string,
    // voter_guide_image_url_large: PropTypes.string,
    // voter_guide_display_name: PropTypes.string,
    // candidate_name: PropTypes.string,
    // speaker_display_name: PropTypes.string,
    // twitter_description: PropTypes.string,
    // twitter_followers_count: PropTypes.number,
    // twitter_handle: PropTypes.string,
    // children: PropTypes.array,  // A list of the tags in OrganizationDisplayForList when called (from GuideList for example)
    // is_support: PropTypes.bool,
    // is_positive_rating: PropTypes.bool,
    // is_oppose: PropTypes.bool,
    // is_negative_rating: PropTypes.bool,
    // is_information_only: PropTypes.bool,
    // vote_smart_rating: PropTypes.string,
    // speaker_text: PropTypes.string,
    // more_info_url: PropTypes.string
  };

  render () {
    renderLog(__filename);
    const {
      organization_photo_url_medium: organizationPhotoUrlMedium,
      organization_twitter_handle: organizationTwitterHandle,
      organization_we_vote_id: organizationWeVoteId,
      position,
    } = this.props;

    if ((organizationWeVoteId === undefined) || (position === undefined)) {
      // console.log("OrganizationDisplayForList organizationWeVoteId === undefined");
      return null;
    }
    const numberOfLines = 2;
    const organizationName = this.props.organization_name ? this.props.organization_name : '';
    const twitterDescription = this.props.twitter_description ? this.props.twitter_description : '';
    // If the organizationName is in the twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(organizationName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    let positionDescription = '';
    const isOnBallotItemPage = true;
    if (position.vote_smart_rating) {
      positionDescription =
        <PositionRatingSnippet {...position} />;
    } else if (position.is_support || position.is_oppose) {
      positionDescription = <PositionSupportOpposeSnippet {...position} is_on_ballot_item_page={isOnBallotItemPage} />;
    } else if (position.is_information_only) {
      positionDescription = <PositionInformationOnlySnippet {...position} is_on_ballot_item_page={isOnBallotItemPage} />;
    }

    return (
      <div className="card-child card-child--not-followed">
        <div className="card-child__media-object-anchor">
          <Link to={voterGuideLink} className="u-no-underline">
            <ImageHandler className="card-child__avatar" sizeClassName="image-lg " imageUrl={organizationPhotoUrlMedium} />
          </Link>
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            <Link to={voterGuideLink}>
              <h4 className="card-child__display-name">{organizationName}</h4>
            </Link>
            { twitterDescriptionMinusName ? (
              <ReadMore
                className="card-child__organization-description"
                text_to_display={twitterDescriptionMinusName}
                num_of_lines={numberOfLines}
              />
            ) : null
            }
            { positionDescription }
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              {this.props.children}
              {/* twitterFollowersCount ?
                <span className="twitter-followers__badge">
                  <span className="fa fa-twitter twitter-followers__icon" />
                  {numberWithCommas(twitterFollowersCount)}
                </span> :
                null */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
