import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { historyPush } from '../../utils/cordovaUtils';
import OpenExternalWebSite from '../../utils/OpenExternalWebSite';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging'; // numberWithCommas,
import FollowToggle from '../Widgets/FollowToggle';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
export default class OrganizationVoterGuideCard extends Component {
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
      organization_photo_url_large: organizationPhotoUrlLarge, organization_website: organizationWebsiteRaw,
      organization_name: organizationName, organization_we_vote_id: organizationWeVoteId,
    } = this.props.organization; // , twitter_followers_count
    const organizationWebsite = organizationWebsiteRaw && organizationWebsiteRaw.slice(0, 4) !== 'http' ? `http://${organizationWebsiteRaw}` : organizationWebsiteRaw;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = organizationName || '';
    const twitterDescription = twitterDescriptionRaw || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    return (
      <div className="card-main">
        { organizationPhotoUrlLarge ? (
          <Link to={voterGuideLink} className="u-no-underline">
            <img src={organizationPhotoUrlLarge} height="180" />
          </Link>
        ) : null
        }
        <br />
        <Link to={voterGuideLink}>
          <h3 className="card-main__display-name">{displayName}</h3>
        </Link>
        { organizationTwitterHandle ? (
          <span>
            @
            {organizationTwitterHandle}
            &nbsp;&nbsp;
          </span>
        ) :
          null
        }
        <br />
        { this.props.is_voter_owner ? (
          <Button variant="warning" size="small" bsPrefix="pull-right" onClick={this.onEdit}>
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

        { organizationWebsite ? (
          <span className="u-wrap-links">
            <OpenExternalWebSite
              url={organizationWebsite}
              target="_blank"
              body={(
                <span>
                  {organizationWebsite}
                  {' '}
                  <i className="fa fa-external-link" />
                </span>
              )}
            />
          </span>
        ) : null
        }
        {/* 5 of your friends follow Organization Name<br /> */}

        {/* twitter_followers_count ?
          <span className="twitter-followers__badge">
              <span className="fa fa-twitter twitter-followers__icon" />
            {numberWithCommas(twitter_followers_count)}
            </span> :
          null
        */}
      </div>
    );
  }
}
