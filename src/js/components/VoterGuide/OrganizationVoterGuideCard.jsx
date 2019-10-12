import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router';
import { historyPush } from '../../utils/cordovaUtils';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging'; // numberWithCommas,
import FollowToggle from '../Widgets/FollowToggle';
import { numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
class OrganizationVoterGuideCard extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    is_voter_owner: PropTypes.bool,
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
    // console.log("OrganizationVoterGuideCard render");
    renderLog(__filename);
    if (!this.props.organization) {
      return <div>{LoadingWheel}</div>;
    }

    const {
      organization_twitter_handle: organizationTwitterHandle, twitter_description: twitterDescriptionRaw,
      twitter_followers_count: twitterFollowersCount,
      organization_photo_url_large: organizationPhotoUrlLarge, organization_website: organizationWebsiteRaw,
      organization_name: organizationName, organization_we_vote_id: organizationWeVoteId,
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
              <img src={organizationPhotoUrlLarge} height="180" />
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
        { this.props.is_voter_owner ? (
          <Button
            color="primary"
            id="OrganizationVoterGuideCardEditYourVoterGuideButton"
            onClick={this.onEdit}
            variant="contained"
          >
            <span>Edit Your Voter Guide</span>
          </Button>
        ) :
          <FollowToggle organizationWeVoteId={organizationWeVoteId} showFollowingText />
        }
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
        { organizationWebsite ? (
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
        ) : null
        }
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

const ProfileAvatar = styled.div`
  display: flex;
  justify-content: center;
  background: transparent;
  position: relative;
`;

const CardMain = styled.div`
  border: 1px solid #fff;
  padding: 16px 16px 8px;
  font-size: 14px;
  position: relative;
`;

export default OrganizationVoterGuideCard;
