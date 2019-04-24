// This is used for organizations to Follow (not currently followed by the voter)
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { isCordova } from '../../utils/cordovaUtils';
import OrganizationCard from '../VoterGuide/OrganizationCard';
import OrganizationTinyDisplay from '../VoterGuide/OrganizationTinyDisplay';

export default class OrganizationsToDisplay extends Component {
  static propTypes = {
    organizationsToFollow: PropTypes.array,
    maximumOrganizationDisplay: PropTypes.number,
    ballotItemWeVoteId: PropTypes.string,
    visibleTag: PropTypes.string,
    supportsThisBallotItem: PropTypes.bool,
    opposesThisBallotItem: PropTypes.bool,
    currentBallotIdInUrl: PropTypes.string,
    urlWithoutHash: PropTypes.string,
    weVoteId: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.popover_state = {};
  }


  onTriggerEnter (orgWeVoteId, visibleTag) {
    if (this.refs[`cheetah-overlay-${orgWeVoteId}-${visibleTag}`]) { // eslint-disable-line react/no-string-refs
      this.refs[`cheetah-overlay-${orgWeVoteId}-${visibleTag}`].show(); // eslint-disable-line react/no-string-refs
    }
    if (!this.popover_state[orgWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[orgWeVoteId] = { show: false, timer: null };
    }
    clearTimeout(this.popover_state[orgWeVoteId].timer);
    this.popover_state[orgWeVoteId].show = true;
  }

  onTriggerLeave (orgWeVoteId, visibleTag) {
    if (!this.popover_state[orgWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[orgWeVoteId] = { show: false, timer: null };
    }
    this.popover_state[orgWeVoteId].show = false;
    clearTimeout(this.popover_state[orgWeVoteId].timer);
    this.popover_state[orgWeVoteId].timer = setTimeout(() => {
      if (!this.popover_state[orgWeVoteId].show) {
        if (this.refs[`cheetah-overlay-${orgWeVoteId}-${visibleTag}`]) { // eslint-disable-line react/no-string-refs
          this.refs[`cheetah-overlay-${orgWeVoteId}-${visibleTag}`].hide(); // eslint-disable-line react/no-string-refs
        }
      }
    }, 100);
  }

  organizationPopover (ballotItemWeVoteId, orgWeVoteId, weVoteId, currentBallotIdInUrl, visibleTag, oneOrganizationForOrganizationCard, urlWithoutHash) {
    if (oneOrganizationForOrganizationCard) {
      return (
        <Popover
          id={`organization-popover-${orgWeVoteId}-${ballotItemWeVoteId}`}
          title={(
            <span onClick={() => this.onTriggerLeave(orgWeVoteId, visibleTag)}>
              &nbsp;
              <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && 'u-mobile-x'} `}
                    aria-hidden="true"
              />
            </span>
          )}
        >
          <OrganizationCard
            ballotItemWeVoteId={ballotItemWeVoteId}
            currentBallotIdInUrl={currentBallotIdInUrl}
            followToggleOn
            organization={oneOrganizationForOrganizationCard}
            urlWithoutHash={urlWithoutHash}
            we_vote_id={weVoteId}
          />
        </Popover>
      );
    } else {
      return null;
    }
  }


  render () {
    const { organizationsToFollow, maximumOrganizationDisplay, ballotItemWeVoteId,
      visibleTag, supportsThisBallotItem, opposesThisBallotItem,
      currentBallotIdInUrl, urlWithoutHash, weVoteId } = this.props;

    if ((!organizationsToFollow) || (organizationsToFollow.length === 0)) {
      return null;
    }

    if (!maximumOrganizationDisplay || maximumOrganizationDisplay === 0) {
      return null;
    }

    let localCounter = 0;
    let oneOrganizationForOrganizationCard;
    let orgWeVoteId;

    return (
      <span>
        { organizationsToFollow.map((oneOrganization) => {
          localCounter++;
          orgWeVoteId = oneOrganization.organization_we_vote_id;

          // Once we have more organizations than we want to show, put them into a drop-down
          if (localCounter <= maximumOrganizationDisplay) {
            oneOrganizationForOrganizationCard = {
              organization_we_vote_id: oneOrganization.organization_we_vote_id,
              organization_name: oneOrganization.voter_guide_display_name,
              organization_photo_url_large: oneOrganization.voter_guide_image_url_large,
              organization_photo_url_tiny: oneOrganization.voter_guide_image_url_tiny,
              organization_twitter_handle: oneOrganization.twitter_handle,
              // organization_website: oneOrganization.organization_website,
              twitter_description: oneOrganization.twitter_description,
              twitter_followers_count: oneOrganization.twitter_followers_count,
            };
            // this.state.popoverState[orgWeVoteId] = { show: false, timer: null };  // Dec 2018:  Could this even work in the render phase?

            return (
              <OverlayTrigger
                key={`trigger-${orgWeVoteId}-${visibleTag}`}
                ref={`cheetah-overlay-${orgWeVoteId}-${visibleTag}`}
                rootClose
                placement="bottom"
                trigger="click"
                overlay={this.organizationPopover(ballotItemWeVoteId, orgWeVoteId, weVoteId, currentBallotIdInUrl, visibleTag, oneOrganizationForOrganizationCard, urlWithoutHash)}
              >
                <span className="position-rating__source with-popover">
                  <OrganizationTinyDisplay
                    {...oneOrganization}
                    currentBallotIdInUrl={currentBallotIdInUrl}
                    showPlaceholderImage
                    showSupport={supportsThisBallotItem}
                    showOppose={opposesThisBallotItem}
                    toFollow
                    urlWithoutHash={urlWithoutHash}
                    we_vote_id={weVoteId}
                  />
                </span>
              </OverlayTrigger>
            );
          } else {
            return null;
          }
        })
        }
      </span>
    );
  }
}
