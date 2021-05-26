import { Twitter } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import { numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';
import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
import PositionRatingSnippet from '../Widgets/PositionRatingSnippet';
import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../Widgets/ReadMore'));

// OrganizationDisplayForList is used to display Organizations (as opposed to Voter Guides)
export default class OrganizationDisplayForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organization: {},
      organizationWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('OrganizationDisplayForList componentDidMount, organizationWeVoteId: ', this.props.organizationWeVoteId);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.organizationWeVoteId),
      organizationWeVoteId: this.props.organizationWeVoteId,
    });
    this.OrganizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organizationWeVoteId),
      organizationWeVoteId: nextProps.organizationWeVoteId,
    });
  }

  componentWillUnmount () {
    this.OrganizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({ organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId) });
  }

  render () {
    renderLog('OrganizationDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.organizationWeVoteId === undefined || this.state.organizationWeVoteId === '' || this.state.organization.organization_we_vote_id === undefined) {
      // console.log("OrganizationDisplayForList organizationWeVoteId === undefined");
      return null;
    }
    const {
      position,
    } = this.props;
    const {
      organization_name: organizationName,
      organization_photo_url_medium: organizationPhotoUrlMedium,
      organization_twitter_handle: organizationTwitterHandle,
      organization_we_vote_id: organizationWeVoteId,
      twitter_description: twitterDescription,
      twitter_followers_count: twitterFollowersCount,
    } = this.state.organization;
    const numberOfLines = 2;
    // If the organizationName is in the twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(organizationName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    let positionDescription = '';
    const isOnBallotItemPage = true;
    if (position) {
      if (position.vote_smart_rating) {
        positionDescription =
          <PositionRatingSnippet {...position} />;
      } else if (position.is_support || position.is_oppose) {
        positionDescription = <PositionSupportOpposeSnippet {...position} is_on_ballot_item_page={isOnBallotItemPage} />;
      } else if (position.is_information_only) {
        positionDescription =
          <PositionInformationOnlySnippet {...position} is_on_ballot_item_page={isOnBallotItemPage} />;
      }
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
                textToDisplay={twitterDescriptionMinusName}
                numberOfLines={numberOfLines}
              />
            ) : null}
            { positionDescription }
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              {this.props.children}
              { twitterFollowersCount ?
                (
                  <span className="twitter-followers__badge">
                    <Twitter />
                    {numberWithCommas(twitterFollowersCount)}
                  </span>
                ) :
                null }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
OrganizationDisplayForList.propTypes = {
  organizationWeVoteId: PropTypes.string,
  children: PropTypes.array, // Typically the FollowToggle
  position: PropTypes.object,
};
