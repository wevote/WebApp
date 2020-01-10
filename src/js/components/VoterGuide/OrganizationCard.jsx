import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import FollowToggle from '../Widgets/FollowToggle';
import ImageHandler from '../ImageHandler';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';
import PositionRatingSnippet from '../Widgets/PositionRatingSnippet';
import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';
import RatingPopover from '../Widgets/RatingPopover';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import ReadMore from '../Widgets/ReadMore';
import {
  numberWithCommas,
  removeTwitterNameFromDescription,
  stringContains,
} from '../../utils/textFormat';

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
export default class OrganizationCard extends Component {
  static propTypes = {
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

  componentWillReceiveProps (nextProps) {
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
      <div className="card-main__media-object">
        <div className="card-main__media-object-anchor">
          {turnOffLogo ?
            null : (
              <Link to={voterGuideLink} className="u-no-underline">
                <ImageHandler
                  imageUrl={organizationPhotoUrlLarge}
                  className="card-main__org-avatar"
                  hidePlaceholder
                  sizeClassName="icon-lg "
                />
              </Link>
            )}
          {followToggleOn ? (
            <div className="u-margin-top--md">
              <FollowToggle
                currentBallotIdInUrl={currentBallotIdInUrl}
                ballotItemWeVoteId={this.props.we_vote_id}
                urlWithoutHash={urlWithoutHash}
                organizationWeVoteId={this.state.organizationWeVoteId}
              />
            </div>
          ) : null
          }
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
                    <ReadMore
                      textToDisplay={twitterDescriptionMinusName}
                      numberOfLines={3}
                    />
                  ) : (
                    <>
                      {twitterDescriptionMinusName}
                    </>
                  )}
                </>
              )}
            </>
          ) :
            <p className="card-main__description" />
          }
          { !turnOffDescription ? (
            <div>
              { organizationTwitterHandle && !turnOffTwitterHandle && (
                <span>
                  @
                  {organizationTwitterHandle}
                  &nbsp;&nbsp;
                </span>
              )}
              {(twitterFollowersCount && numberWithCommas(twitterFollowersCount) !== '0' && !turnOffTwitterHandle) && (
                <span className="twitter-followers__badge">
                  <TwitterFollowersIcon className="fab fa-twitter" />
                  {numberWithCommas(twitterFollowersCount)}
                </span>
              )}
              { organizationWebsite && (
                <WebsiteWrapper>
                  <OpenExternalWebSite
                    url={organizationWebsite}
                    target="_blank"
                    body={(
                      <span>
                        Website
                        {' '}
                        <i className="fas fa-external-link-alt" />
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
            </div>
          ) : null
          }
          { this.state.organizationPosition.vote_smart_rating ? (
            <RatingPopover
              showDescription={this.state.showRatingDescription}
              toggleDescription={this.toggleRatingDescription}
            />
          ) : null
          }
        </div>
      </div>
    );
  }
}

const TwitterFollowersIcon = styled.span`
  font-size: 1.25rem;
  color: #ccc;
  margin-right: 2px;
  vertical-align: bottom;
`;

const WebsiteWrapper = styled.span`
  margin-left: 4px;
`;
