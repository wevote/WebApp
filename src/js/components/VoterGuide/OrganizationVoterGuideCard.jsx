import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/esm/Button';
import { Link } from 'react-router';
import { historyPush } from '../../utils/cordovaUtils';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';
import { isSpeakerTypeIndividual } from '../../utils/organization-functions';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import FollowToggle from '../Widgets/FollowToggle';
import FriendToggle from '../Friends/FriendToggle';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';
import { numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
class OrganizationVoterGuideCard extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    isVoterOwner: PropTypes.bool,
    turnOffDescription: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {};
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit () {
    historyPush(`/voterguideedit/${this.props.organization.organization_we_vote_id}`);
    return <div>{LoadingWheel}</div>;
  }

  render () {
    renderLog('OrganizationVoterGuideCard');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.props.organization) {
      return <div>{LoadingWheel}</div>;
    }
    // console.log('this.props.organization:', this.props.organization);
    const { isVoterOwner } = this.props;
    const {
      organization_name: organizationName,
      organization_photo_url_large: organizationPhotoUrlLarge,
      organization_twitter_handle: organizationTwitterHandle,
      organization_type: organizationType,
      organization_we_vote_id: organizationWeVoteId,
      organization_website: organizationWebsiteRaw,
      twitter_description: twitterDescriptionRaw,
      twitter_followers_count: twitterFollowersCount,
      linked_voter_we_vote_id: linkedVoterWeVoteId,
    } = this.props.organization;
    const organizationWebsite = organizationWebsiteRaw && organizationWebsiteRaw.slice(0, 4) !== 'http' ? `http://${organizationWebsiteRaw}` : organizationWebsiteRaw;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = organizationName || '';
    const twitterDescription = twitterDescriptionRaw || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    return (
      <CardMain>
        { organizationPhotoUrlLarge ? (
          <ProfileAvatar>
            <Link to={voterGuideLink} className="u-no-underline">
              <img src={organizationPhotoUrlLarge} height="180" alt={`${displayName}`} />
            </Link>
          </ProfileAvatar>
        ) : null
        }
        <br />
        <Link to={voterGuideLink}>
          <h3 className="card-main__display-name">{displayName}</h3>
        </Link>
        { organizationTwitterHandle && (
          <span>
            <span>
              @
              {organizationTwitterHandle}
              &nbsp;&nbsp;
            </span>
            { twitterFollowersCount && String(twitterFollowersCount) !== '0' && (
              <span className="twitter-followers__badge">
                <span className="fab fa-twitter twitter-followers__icon" />
                {numberWithCommas(twitterFollowersCount)}
              </span>
            )}
          </span>
        )}
        <br />
        { isVoterOwner && (
          <Button
            color="primary"
            id="OrganizationVoterGuideCardEditYourVoterGuideButton"
            onClick={this.onEdit}
            variant="contained"
          >
            <span>Edit Your Endorsements</span>
          </Button>
        )}
        { !isVoterOwner && (
          <>
            <FollowToggle organizationWeVoteId={organizationWeVoteId} showFollowingText />
            { isSpeakerTypeIndividual(organizationType) && (
              <FriendToggleWrapper>
                <FriendToggle displayFullWidth otherVoterWeVoteId={linkedVoterWeVoteId} showFriendsText />
              </FriendToggleWrapper>
            )}
          </>
        )}
        { twitterDescriptionMinusName && !this.props.turnOffDescription ? (
          <ParsedTwitterDescription
            twitter_description={twitterDescriptionMinusName}
          />
        ) :
          <p className="card-main__description" />
        }
        <IssuesByOrganizationDisplayList
          organizationWeVoteId={organizationWeVoteId}
          placement="bottom"
        />
        { organizationWebsite && (
          <div>
            <span className="u-wrap-links">
              <OpenExternalWebSite
                url={organizationWebsite}
                target="_blank"
                body={(
                  <span>
                    {organizationWebsite}
                    {' '}
                    <i className="fas fa-external-link-alt" />
                  </span>
                )}
              />
            </span>
          </div>
        )}
        {/* 5 of your friends follow Organization Name<br /> */}

        {/* twitter_followers_count ?
          <span className="twitter-followers__badge">
              <span className="fab fa-twitter twitter-followers__icon" />
            {numberWithCommas(twitter_followers_count)}
            </span> :
          null
        */}
      </CardMain>
    );
  }
}

const CardMain = styled.div`
  border: 1px solid #fff;
  padding: 16px 16px 8px;
  font-size: 14px;
  position: relative;
`;

const FriendToggleWrapper = styled.div`
  margin-top: 10px;
`;

const ProfileAvatar = styled.div`
  display: flex;
  justify-content: center;
  background: transparent;
  position: relative;
`;

export default OrganizationVoterGuideCard;
