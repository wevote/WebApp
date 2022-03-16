import { Twitter } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from '@mui/material/styles/styled';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../common/utils/logging';
import { numberWithCommas, removeTwitterNameFromDescription, stringContains } from '../../utils/textFormat';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';
import ExternalLinkIcon from '../../common/components/Widgets/ExternalLinkIcon';
import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
import PositionRatingSnippet from '../Widgets/PositionRatingSnippet';
import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';
import RatingPopover from '../Widgets/RatingPopover';

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
        OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, true);
        this.setState({
          organizationPositionsRequested: true,
        });
      }
    }
    // If no position, we need to call positionListForOpinionMaker here
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
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
      } else if (!this.state.organizationPositionsRequested) {
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
    if (!this.state.organizationWeVoteId.length) {
      return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    }

    const { currentBallotIdInUrl, followToggleOn, turnOffDescription, turnOffLogo, turnOffTwitterHandle, urlWithoutHash, useReadMoreForTwitterDescription } = this.props;
    const {
      organization_twitter_handle: organizationTwitterHandle, twitter_description: twitterDescriptionRaw,
      twitter_followers_count: twitterFollowersCount,
      organization_photo_url_large: organizationPhotoUrlLarge, organization_website: organizationWebsiteRaw,
      organization_name: organizationName,
    } = this.props.organization;
    const organizationWebsite = organizationWebsiteRaw && organizationWebsiteRaw.slice(0, 4) !== 'http' ? `http://${organizationWebsiteRaw}` : organizationWebsiteRaw;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = organizationName || '';
    const twitterDescription = twitterDescriptionRaw || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${this.state.organizationWeVoteId}`;

    let positionDescription = '';
    if (this.state.organizationPosition) {
      const isOnBallotItemPage = true; // From "actor's" perspective: actorSupportsBallotItemLabel
      // console.log("this.state.organizationPosition: ", this.state.organizationPosition);
      if (this.state.organizationPosition.vote_smart_rating) {
        positionDescription = (
          <PositionRatingSnippet
            {...this.state.organizationPosition}
            show_rating_description={this.toggleRatingDescription}
          />
        );
      } else if (this.state.organizationPosition.is_support || this.state.organizationPosition.is_oppose) {
        positionDescription =
          <PositionSupportOpposeSnippet {...this.state.organizationPosition} is_on_ballot_item_page={isOnBallotItemPage} />;
      } else if (this.state.organizationPosition.is_information_only) {
        positionDescription =
          <PositionInformationOnlySnippet {...this.state.organizationPosition} is_on_ballot_item_page={isOnBallotItemPage} />;
      }
    }

    return (
      <OrganizationCardWrapper className="card-main__media-object">
        <div className="card-main__media-object-anchor">
          {turnOffLogo ?
            null : (
              <Link to={voterGuideLink} className="u-no-underline">
                <Suspense fallback={<></>}>
                  <ImageHandler
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
                  ballotItemWeVoteId={this.props.we_vote_id}
                  urlWithoutHash={urlWithoutHash}
                  organizationWeVoteId={this.state.organizationWeVoteId}
                />
              </Suspense>
            </div>
          ) : null}
        </div>
        <div className="card-main__media-object-content">
          <Link to={voterGuideLink}>
            <h3 className="card-main__display-name">{displayName}</h3>
          </Link>
          {/* Organization supports ballot item */}
          {positionDescription}

          { twitterDescriptionMinusName && !turnOffDescription ? (
            <>
              {stringContains('https://t.co/', twitterDescriptionMinusName) ? (
                <ParsedTwitterDescription
                  twitter_description={twitterDescriptionMinusName}
                />
              ) : (
                <>
                  {useReadMoreForTwitterDescription ? (
                    <Suspense fallback={<></>}>
                      <ReadMore
                        textToDisplay={twitterDescriptionMinusName}
                        numberOfLines={3}
                      />
                    </Suspense>
                  ) : (
                    <>
                      {twitterDescriptionMinusName}
                    </>
                  )}
                </>
              )}
            </>
          ) :
            <p className="card-main__description" />}
          { !turnOffDescription ? (
            <Suspense fallback={<></>}>
              { organizationTwitterHandle && !turnOffTwitterHandle && (
                <OpenExternalWebSite
                  linkIdAttribute="organizationTwitterHandle"
                  url={`https://twitter.com/${organizationTwitterHandle}`}
                  target="_blank"
                  body={(
                    <span>
                      <TwitterHandleWrapper>
                        @
                        {organizationTwitterHandle}
                      </TwitterHandleWrapper>
                      {(twitterFollowersCount && String(twitterFollowersCount) !== '0' && numberWithCommas(twitterFollowersCount) !== '0') && (
                        <span className="twitter-followers__badge">
                          {/* <TwitterFollowersIcon className="fab fa-twitter" /> */}
                          <Twitter />
                          {numberWithCommas(twitterFollowersCount)}
                        </span>
                      )}
                    </span>
                  )}
                />
              )}
              { organizationWebsite && (
                <WebsiteWrapper>
                  <OpenExternalWebSite
                    linkIdAttribute="organizationWebsite"
                    url={organizationWebsite}
                    target="_blank"
                    body={(
                      <span className="u-no-break">
                        Website
                        {' '}
                        <ExternalLinkIcon />
                      </span>
                    )}
                  />
                </WebsiteWrapper>
              )}
              <IssuesByOrganizationDisplayList
                organizationWeVoteId={this.state.organizationWeVoteId}
                placement="bottom"
              />
              {/* 5 of your friends follow Organization Name<br /> */}
            </Suspense>
          ) : null}
          { this.state.organizationPosition.vote_smart_rating ? (
            <RatingPopover
              showDescription={this.state.showRatingDescription}
              toggleDescription={this.toggleRatingDescription}
            />
          ) : null}
        </div>
      </OrganizationCardWrapper>
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
  useReadMoreForTwitterDescription: PropTypes.bool,
  urlWithoutHash: PropTypes.string,
  we_vote_id: PropTypes.string,
};

const OrganizationCardWrapper = styled('div')`
`;

// const TwitterFollowersIcon = styled.span`
//   font-size: 1.25rem;
//   color: #ccc;
//   margin-right: 2px;
//   vertical-align: bottom;
// `;

const TwitterHandleWrapper = styled('span')`
  margin-right: 10px;
`;

const WebsiteWrapper = styled('div')`
  margin-left: 4px;
`;
