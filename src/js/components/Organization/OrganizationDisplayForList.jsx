import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import removeTwitterNameFromDescription from '../../common/utils/removeTwitterNameFromDescription';
import OrganizationStore from '../../stores/OrganizationStore';
import { NameAndTwitter, OrganizationDescriptionText, OrganizationDetailsWrapper, OrganizationImage, OrganizationFollowWrapper, OrganizationName, OrganizationLogoWrapper, TwitterOuterWrapper } from '../Style/DisplayForList';
import PositionInformationOnlySnippet from '../PositionItem/PositionInformationOnlySnippet';
import PositionRatingSnippet from '../PositionItem/PositionRatingSnippet';
import PositionSupportOpposeSnippet from '../PositionItem/PositionSupportOpposeSnippet';
import TwitterAccountStats from '../Widgets/TwitterAccountStats';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));

// OrganizationDisplayForList is used to display Organizations (as opposed to Voter Guides)
class OrganizationDisplayForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationName: '',
      organizationPhotoUrlMedium: '',
      twitterDescription: '',
      twitterHandle: '',
      twitterFollowersCount: 0,
    };
  }

  componentDidMount () {
    // For speed, we support passing in organization values from props, which can then be replaced by values pulled from OrganizationStore
    const { organizationWeVoteId } = this.props;
    let { organizationName, organizationPhotoUrlMedium, twitterHandle, twitterDescription, twitterFollowersCount } = this.props;
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    if (organization && organization.we_vote_id) {
      ({
        organization_name: organizationName,
        organization_photo_url_medium: organizationPhotoUrlMedium,
        organization_twitter_handle: twitterHandle,
        twitter_description: twitterDescription,
        twitter_followers_count: twitterFollowersCount,
      } = organization);
    }
    this.setState({
      organizationName,
      organizationPhotoUrlMedium,
      twitterHandle,
      twitterDescription,
      twitterFollowersCount,
    });
    this.OrganizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  componentDidUpdate (prevProps) {
    const { organizationName: newOrganizationName, organizationWeVoteId: newOrganizationWeVoteId } = this.props;
    if ((newOrganizationName !== prevProps.organizationName) || (newOrganizationWeVoteId !== prevProps.organizationWeVoteId)) {
      let { organizationName, organizationPhotoUrlMedium, twitterHandle, twitterDescription, twitterFollowersCount } = this.props;
      const organization = OrganizationStore.getOrganizationByWeVoteId(newOrganizationWeVoteId);
      // console.log('OrganizationDisplayForList componentDidMount, organizationWeVoteId: ', organizationWeVoteId);
      if (organization && organization.we_vote_id) {
        ({
          organization_name: organizationName,
          organization_photo_url_medium: organizationPhotoUrlMedium,
          organization_twitter_handle: twitterHandle,
          twitter_description: twitterDescription,
          twitter_followers_count: twitterFollowersCount,
        } = organization);
      }
      this.setState({
        organizationName,
        organizationPhotoUrlMedium,
        twitterHandle,
        twitterDescription,
        twitterFollowersCount,
      });
    }
  }

  componentWillUnmount () {
    this.OrganizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.props;
    let { organizationName, organizationPhotoUrlMedium, twitterHandle, twitterDescription, twitterFollowersCount } = this.props;
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    // console.log('OrganizationDisplayForList componentDidMount, organizationWeVoteId: ', organizationWeVoteId);
    if (organization && organization.we_vote_id) {
      ({
        organization_name: organizationName,
        organization_photo_url_medium: organizationPhotoUrlMedium,
        organization_twitter_handle: twitterHandle,
        twitter_description: twitterDescription,
        twitter_followers_count: twitterFollowersCount,
      } = organization);
    }
    this.setState({
      organizationName,
      organizationPhotoUrlMedium,
      twitterHandle,
      twitterDescription,
      twitterFollowersCount,
    });
  }

  render () {
    renderLog('OrganizationDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('OrganizationDisplayForList render');
    const { organizationWeVoteId, position } = this.props;
    const {
      organizationName,
      organizationPhotoUrlMedium,
      twitterHandle,
      twitterDescription,
      twitterFollowersCount,
    } = this.state;
    if (organizationWeVoteId === undefined || organizationWeVoteId === '') {
      // console.log('organizationWeVoteId missing');
      return null;
    }
    // If the organizationName is in the twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(organizationName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = twitterHandle ? `/${twitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    // From 'actor's' perspective: actorSupportsBallotItemLabel
    let positionDescription = '';
    const isOnBallotItemPage = true;
    if (!position) {
      positionDescription = <></>;
    } else if (position.vote_smart_rating) {
      positionDescription = (
        <PositionRatingSnippet
          // {...position}
          ballotItemDisplayName={position.ballot_item_display_name}
          showRatingDescription={position.show_rating_description}
          voteSmartRating={position.vote_smart_rating}
          voteSmartTimeSpan={position.vote_smart_time_span}
        />
      );
    } else if (position.is_support || position.is_oppose) {
      positionDescription = (
        <PositionSupportOpposeSnippet
          // {...position}
          ballotItemDisplayName={position.ballot_item_display_name}
          commentTextOff={position.comment_text_off}
          isLookingAtSelf={position.is_looking_at_self}
          isOnBallotItemPage={isOnBallotItemPage}
          isOppose={position.is_oppose}
          isSupport={position.is_support}
          moreInfoUrl={position.more_info_url}
          speakerDisplayName={position.speaker_display_name}
          stanceDisplayOff={position.stance_display_off}
          statementText={position.statement_text}
        />
      );
    } else if (position.is_information_only) {
      positionDescription = (
        <PositionInformationOnlySnippet
          // ...position
          ballotItemDisplayName={position.ballot_item_display_name}
          commentTextOff={position.comment_text_off}
          isLookingAtSelf={position.is_looking_at_self}
          isOnBallotItemPage={isOnBallotItemPage}
          moreInfoUrl={position.more_info_url}
          speakerDisplayName={position.speaker_display_name}
          stanceDisplayOff={position.stance_display_off}
          statementText={position.statement_text}
        />
      );
    }

    let organizationLogo = <></>;
    if (organizationPhotoUrlMedium) {
      organizationLogo = (
        <OrganizationImage
          alt=""
          key={`OrganizationImage-${organizationWeVoteId}`}
          src={organizationPhotoUrlMedium}
          title={organizationName}
        />
      );
    }
    return (
      <OrganizationDisplayForListWrapper>
        <OrganizationDetailsWrapper>
          <OrganizationLogoWrapper>
            <Link to={voterGuideLink} className="u-no-underline">
              {organizationLogo}
            </Link>
          </OrganizationLogoWrapper>
          <div>
            <NameAndTwitter>
              <Link to={voterGuideLink}>
                <OrganizationName>{organizationName}</OrganizationName>
              </Link>
              {twitterHandle && (
                <TwitterOuterWrapper>
                  <TwitterAccountStats
                    twitterFollowersCount={twitterFollowersCount}
                    twitterHandle={twitterHandle}
                  />
                </TwitterOuterWrapper>
              )}
            </NameAndTwitter>

            { twitterDescriptionMinusName ? (
              <OrganizationDescriptionText>
                {twitterDescriptionMinusName}
              </OrganizationDescriptionText>
            ) : null}
            { positionDescription }
          </div>
        </OrganizationDetailsWrapper>
        <OrganizationFollowWrapper>
          <Suspense fallback={<></>}>
            <FollowToggle
              anchorLeft
              hideDropdownButtonUntilFollowing
              lightModeOn
              organizationWeVoteId={organizationWeVoteId}
              platformType="desktop"
            />
          </Suspense>
        </OrganizationFollowWrapper>
      </OrganizationDisplayForListWrapper>
    );
  }
}
OrganizationDisplayForList.propTypes = {
  organizationName: PropTypes.string,
  organizationPhotoUrlMedium: PropTypes.string,
  organizationWeVoteId: PropTypes.string,
  position: PropTypes.object,
  twitterDescription: PropTypes.string,
  twitterFollowersCount: PropTypes.number,
  twitterHandle: PropTypes.string,
};

const OrganizationDisplayForListWrapper = styled('div')`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;
export default OrganizationDisplayForList;
