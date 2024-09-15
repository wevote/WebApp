import { Launch } from '@mui/icons-material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import removeTwitterNameFromDescription from '../../common/utils/removeTwitterNameFromDescription';
import OrganizationStore from '../../stores/OrganizationStore';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';
import PositionInformationOnlySnippet from '../PositionItem/PositionInformationOnlySnippet';
import PositionRatingSnippet from '../PositionItem/PositionRatingSnippet';
import PositionSupportOpposeSnippet from '../PositionItem/PositionSupportOpposeSnippet';
import RatingPopover from '../Widgets/RatingPopover';
import TwitterAccountStats from '../Widgets/TwitterAccountStats';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
export default class OrganizationCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: '',
      organizationPosition: {},
      organizationPositionsRequested: false,
      organizationWeVoteId: '',
      showRatingDescription: false,
    };

    this.toggleRatingDescription = this.toggleRatingDescription.bind(this);
  }

  componentDidMount () {
    // console.log('OrganizationCard, componentDidMount, this.props:', this.props);
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organizationWeVoteId: this.props.organization.organization_we_vote_id,
      });
    }
    this.setState({
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
    });
    // console.log('this.props.organization (componentDidMount): ', this.props.organization);
    if (this.props.organization && this.props.organization.organization_we_vote_id && this.props.ballotItemWeVoteId) {
      const organizationPosition = OrganizationStore.getOrganizationPositionByWeVoteId(this.props.organization.organization_we_vote_id, this.props.ballotItemWeVoteId);
      // console.log('organizationPosition (componentDidMount): ', organizationPosition);
      if (organizationPosition && organizationPosition.ballot_item_we_vote_id) {
        this.setState({
          organizationPosition,
        });
      } else {
        // OrganizationCard is used in lists, and this puts strain on the browser
        // OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, true);
        // this.setState({
        //   organizationPositionsRequested: true,
        // });
      }
    }
    // If no position, we need to call positionListForOpinionMaker here
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { organizationPositionsRequested } = this.state;
    // console.log('OrganizationCard, componentWillReceiveProps, nextProps:', nextProps);
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
        organizationWeVoteId: nextProps.organization.organization_we_vote_id,
      });
    }
    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
    });
    if (nextProps.organization && nextProps.organization.organization_we_vote_id && nextProps.ballotItemWeVoteId) {
      const organizationPosition = OrganizationStore.getOrganizationPositionByWeVoteId(nextProps.organization.organization_we_vote_id, nextProps.ballotItemWeVoteId);
      // console.log('organizationPosition (componentWillReceiveProps): ', organizationPosition);
      if (organizationPosition && organizationPosition.ballot_item_we_vote_id) {
        this.setState({
          organizationPosition,
        });
      } else if (!organizationPositionsRequested) {
        OrganizationActions.positionListForOpinionMaker(nextProps.organization.organization_we_vote_id, true);
        this.setState({
          organizationPositionsRequested: true,
        });
      }
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { ballotItemWeVoteId, organizationWeVoteId } = this.state;
    this.setState({ organizationPosition: OrganizationStore.getOrganizationPositionByWeVoteId(organizationWeVoteId, ballotItemWeVoteId) });
  }

  toggleRatingDescription () {
    const { showRatingDescription } = this.state;
    this.setState({
      showRatingDescription: !showRatingDescription,
    });
  }

  render () {
    renderLog('OrganizationCard');  // Set LOG_RENDER_EVENTS to log all renders

    const {
      currentBallotIdInUrl, followToggleOn, turnOffDescription, turnOffLogo, turnOffTwitterHandle,
      urlWithoutHash, useReadMoreForTwitterDescription,
    } = this.props;
    const {
      organization_twitter_handle: organizationTwitterHandle, twitter_description: twitterDescriptionRaw,
      twitter_followers_count: twitterFollowersCount,
      organization_photo_url_large: organizationPhotoUrlLarge, organization_website: organizationWebsiteRaw,
      organization_name: organizationName,
    } = this.props.organization;
    const {
      organizationPosition, organizationWeVoteId, showRatingDescription,
    } = this.state;
    if (!organizationWeVoteId.length) {
      return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    }
    const organizationWebsite = organizationWebsiteRaw && organizationWebsiteRaw.slice(0, 4) !== 'http' ? `http://${organizationWebsiteRaw}` : organizationWebsiteRaw;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = organizationName || '';
    const twitterDescription = twitterDescriptionRaw || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    let positionDescription = '';
    if (organizationPosition) {
      const isOnBallotItemPage = true; // From "actor's" perspective: actorSupportsBallotItemLabel
      // console.log("organizationPosition: ", organizationPosition);
      if (organizationPosition.vote_smart_rating) {
        positionDescription = (
          <PositionRatingSnippet
            ballotItemDisplayName={organizationPosition.ballot_item_display_name}
            showRatingDescription={organizationPosition.show_rating_description}
            voteSmartRating={organizationPosition.vote_smart_rating}
            voteSmartTimeSpan={organizationPosition.vote_smart_time_span}
          />
        );
      } else if (organizationPosition.is_support || organizationPosition.is_oppose) {
        positionDescription =
        (
          <PositionSupportOpposeSnippet
            ballotItemDisplayName={organizationPosition.ballot_item_display_name}
            commentTextOff={organizationPosition.comment_text_off}
            isLookingAtSelf={organizationPosition.is_looking_at_self}
            isOnBallotItemPage={organizationPosition.is_on_ballot_item_page}
            isOppose={organizationPosition.is_oppose}
            isSupport={organizationPosition.is_support}
            moreInfoUrl={organizationPosition.more_info_url}
            speakerDisplayName={organizationPosition.speaker_display_name}
            stanceDisplayOff={organizationPosition.stance_display_off}
            statementText={organizationPosition.statement_text}
          />
        );
      } else if (organizationPosition.is_information_only) {
        positionDescription =
        (
          <PositionInformationOnlySnippet
            ballotItemDisplayName={organizationPosition.ballot_item_display_name}
            commentTextOff={organizationPosition.comment_text_off}
            isLookingAtSelf={organizationPosition.is_looking_at_self}
            isOnBallotItemPage={isOnBallotItemPage}
            moreInfoUrl={organizationPosition.more_info_url}
            speakerDisplayName={organizationPosition.speaker_display_name}
            stanceDisplayOff={organizationPosition.stance_display_off}
            statementText={organizationPosition.statement_text}
          />
        );
      }
    }

    return (
      <div>
        <OrganizationCardWrapper>
          <ImageColumnWrapper>
            {turnOffLogo ?
              null : (
                <Link to={voterGuideLink} className="u-no-underline">
                  <Suspense fallback={<></>}>
                    <ImageHandler
                      alt=""
                      imageUrl={organizationPhotoUrlLarge}
                      className="card-main__org-avatar"
                      hidePlaceholder
                      sizeClassName="icon-lg "
                    />
                  </Suspense>
                </Link>
              )}
            {followToggleOn ? (
              <div className="u-margin-top--md">
                <Suspense fallback={<></>}>
                  <FollowToggle
                    currentBallotIdInUrl={currentBallotIdInUrl}
                    ballotItemWeVoteId={this.props.weVoteId}
                    urlWithoutHash={urlWithoutHash}
                    organizationWeVoteId={organizationWeVoteId}
                  />
                </Suspense>
              </div>
            ) : null}
          </ImageColumnWrapper>
          <DescriptionColumnWrapper>
            <Link to={voterGuideLink}>
              <h3 className="card-main__display-name">{displayName}</h3>
            </Link>
            {/* Organization supports ballot item */}
            {positionDescription}

            { twitterDescriptionMinusName && !turnOffDescription ? (
              <div>
                {stringContains('https://t.co/', twitterDescriptionMinusName) ? (
                  <ParsedTwitterDescription
                    twitterDescription={twitterDescriptionMinusName}
                  />
                ) : (
                  <>
                    {useReadMoreForTwitterDescription ? (
                      <Suspense fallback={<></>}>
                        <ReadMore
                          textToDisplay={twitterDescriptionMinusName}
                          numberOfLines={6}
                        />
                      </Suspense>
                    ) : (
                      <>
                        {twitterDescriptionMinusName}
                      </>
                    )}
                  </>
                )}
              </div>
            ) :
              <p className="card-main__description" />}
            { !turnOffDescription ? (
              <OrganizationLinksWrapper>
                { organizationTwitterHandle && !turnOffTwitterHandle && (
                  <TwitterOuterWrapper>
                    <TwitterAccountStats
                      includeLinkToTwitter
                      twitterFollowersCount={twitterFollowersCount}
                      twitterHandle={organizationTwitterHandle}
                    />
                  </TwitterOuterWrapper>
                )}
                { organizationWebsite && (
                  <WebsiteWrapper>
                    <Suspense fallback={<></>}>
                      <OpenExternalWebSite
                        linkIdAttribute="organizationWebsite"
                        url={organizationWebsite}
                        target="_blank"
                        body={(
                          <span className="u-no-break">
                            Website
                            {' '}
                            <Launch
                              style={{
                                height: 14,
                                marginLeft: 2,
                                marginTop: '-3px',
                                width: 14,
                              }}
                            />
                          </span>
                        )}
                      />
                    </Suspense>
                  </WebsiteWrapper>
                )}
              </OrganizationLinksWrapper>
            ) : null}
            { organizationPosition.vote_smart_rating ? (
              <RatingPopover
                showDescription={showRatingDescription}
                toggleDescription={this.toggleRatingDescription}
              />
            ) : null}
          </DescriptionColumnWrapper>
        </OrganizationCardWrapper>
        <IssuesByOrganizationDisplayList
          organizationWeVoteId={organizationWeVoteId}
          placement="bottom"
        />
      </div>
    );
  }
}
OrganizationCard.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  currentBallotIdInUrl: PropTypes.string,
  followToggleOn: PropTypes.bool,
  organization: PropTypes.object.isRequired,
  turnOffDescription: PropTypes.bool,
  turnOffLogo: PropTypes.bool,
  turnOffTwitterHandle: PropTypes.bool,
  urlWithoutHash: PropTypes.string,
  useReadMoreForTwitterDescription: PropTypes.bool,
  weVoteId: PropTypes.string,
};

const DescriptionColumnWrapper = styled('div')`
`;
// flex: 1;
// @media all and (min-width: 480px) {
//   .card-main__media-object-content {
//     padding: 4px 32px;
//     margin-bottom: 32px;
//     font-size: 16px;
//   }
// }

const ImageColumnWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const OrganizationCardWrapper = styled('div')`
  display: flex;
  align-items: flex-start;
  position: relative;
`;

const OrganizationLinksWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 6px;
`;

const TwitterOuterWrapper = styled('div')`
  margin-left: -3px;
  margin-right: 12px;
`;

const WebsiteWrapper = styled('div')`
  height: 24px;
  margin-left: 0;
`;
