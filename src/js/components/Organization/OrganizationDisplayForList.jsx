import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
import PositionRatingSnippet from '../Widgets/PositionRatingSnippet';
import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';
import TwitterAccountStats from '../Widgets/TwitterAccountStats';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));

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
  componentDidUpdate (prevProps) {
    const { organizationWeVoteId: newOrganizationWeVoteId } = this.props;
    if (newOrganizationWeVoteId !== prevProps.organizationWeVoteId) {
      this.setState({
        organization: OrganizationStore.getOrganizationByWeVoteId(newOrganizationWeVoteId),
        organizationWeVoteId: newOrganizationWeVoteId,
      });
    }
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
    const { position } = this.props;
    const { organization } = this.state;
    const {
      organization_name: organizationName,
      organization_photo_url_medium: organizationPhotoUrlMedium,
      organization_twitter_handle: organizationTwitterHandle,
      organization_we_vote_id: organizationWeVoteId,
      twitter_description: twitterDescription,
      twitter_followers_count: twitterFollowersCount,
    } = organization;
    // If the organizationName is in the twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(organizationName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    let positionDescription = '';
    const isOnBallotItemPage = true;
    if (position) {
      if (position.vote_smart_rating) {
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
            ballotItemDisplayName={position.ballotItemDisplayName}
            commentTextOff={position.commentTextOff}
            isLookingAtSelf={position.isLookingAtSelf}
            isOnBallotItemPage={isOnBallotItemPage}
            moreInfoUrl={position.moreInfoUrl}
            speakerDisplayName={position.speakerDisplayName}
            stanceDisplayOff={position.stanceDisplayOff}
            statementText={position.statementText}
          />
        );
      }
    }

    let organizationLogo = <></>;
    if (organization.organization_photo_url_medium) {
      organizationLogo = (
        <OrganizationImage
          alt=""
          key={`OrganizationImage-${organization.organization_we_vote_id}`}
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
              <TwitterOuterWrapper>
                <TwitterAccountStats
                  twitterFollowersCount={twitterFollowersCount}
                  twitterHandle={organizationTwitterHandle}
                />
              </TwitterOuterWrapper>
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
              organizationWeVoteId={organization.organization_we_vote_id}
              platformType="desktop"
            />
          </Suspense>
        </OrganizationFollowWrapper>
      </OrganizationDisplayForListWrapper>
    );
  }
}
OrganizationDisplayForList.propTypes = {
  organizationWeVoteId: PropTypes.string,
  position: PropTypes.object,
};

const NameAndTwitter = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  ${theme.breakpoints.down('md')} {
    flex-flow: column;
  }
`));

const OrganizationDescriptionText = styled('div')`
  color: #808080;
`;

const OrganizationDetailsWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
`;

const OrganizationDisplayForListWrapper = styled('div')`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const OrganizationImage = styled('img')`
  border: 1px solid #ccc;
  border-radius: 48px;
  height: 48px;
  max-width: 48px;
  width: 48px;
`;

const OrganizationFollowWrapper = styled('div')`
  margin-left: 8px;
  margin-right: 6px;
`;

const OrganizationName = styled('h4')`
  font-size: 16px;
  margin-bottom: 2px;
`;

const OrganizationLogoWrapper = styled('div')`
  margin-right: 8px;
`;

const TwitterOuterWrapper = styled('div')(({ theme }) => (`
  margin-left: 8px;
  margin-top: -7px;
  ${theme.breakpoints.down('md')} {
    margin-left: 0;
  }
`));
