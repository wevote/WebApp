import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Link } from 'react-router';
import ImageHandler from '../ImageHandler';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import OrganizationCard from '../VoterGuide/OrganizationCard';

// This component is used to display the "+X" list in the ItemTinyPositionBreakdownList
export default class PositionsNotShownList extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    positions_not_shown_list: PropTypes.array.isRequired,
  };

  onTriggerEnter (organizationWeVoteId) {
    this.refs[`not-shown-overlay-${organizationWeVoteId}`].show();
    this.show_popover = true;
    clearTimeout(this.hide_popover_timer);
  }

  onTriggerLeave (organizationWeVoteId) {
    this.show_popover = false;
    clearTimeout(this.hide_popover_timer);
    this.hide_popover_timer = setTimeout(() => {
      if (!this.show_popover && this.refs[`not-shown-overlay-${organizationWeVoteId}`]) {
        this.refs[`not-shown-overlay-${organizationWeVoteId}`].hide();
      }
    }, 100);
  }

  render () {
    renderLog(__filename);
    if (!this.props.positions_not_shown_list) {
      return <div>{LoadingWheel}</div>;
    }

    const showPosition = true;
    const nothingToDisplay = null;

    const positionsNotShownDisplay = this.props.positions_not_shown_list.map((onePosition) => {
      // console.log("PositionsNotShownList, onePosition: ", onePosition);
      const { speaker_we_vote_id: speakerWeVoteId, speaker_display_name: speakerDisplayName,
        speaker_image_url_https_tiny: speakerImageUrlHttpsTiny, speaker_twitter_handle: speakerTwitterHandle } = onePosition;
      // const speaker_we_vote_id = onePosition.speaker_we_vote_id;
      // const speaker_display_name = onePosition.speaker_display_name;
      // const speaker_image_url_https_tiny = onePosition.speaker_image_url_https_tiny;
      // const speaker_twitter_handle = onePosition.speaker_twitter_handle;

      // TwitterHandle-based link
      const speakerLink = speakerTwitterHandle ? `/${speakerTwitterHandle}` : `/voterguide/${speakerWeVoteId}`;
      const oneOrganization = {
        organization_we_vote_id: speakerWeVoteId,
        organization_name: speakerDisplayName,
        organization_photo_url_large: onePosition.speaker_image_url_https_large,
        organization_photo_url_tiny: speakerImageUrlHttpsTiny,
        organization_twitter_handle: speakerTwitterHandle,
        // organization_website: onePosition.more_info_url,
        twitter_description: '',
        twitter_followers_count: 0,
      };
      const organizationWeVoteId = oneOrganization.organization_we_vote_id;
      const organizationPopover = (
        <Popover
          id={`organization-popover-${organizationWeVoteId}`}
          onMouseOver={() => this.onTriggerEnter(organizationWeVoteId)}
          onFocus={() => this.onTriggerEnter(organizationWeVoteId)}
          onMouseOut={() => this.onTriggerLeave(organizationWeVoteId)}
          onBlur={() => this.onTriggerLeave(organizationWeVoteId)}
        >
          <section className="card">
            <div className="card__additional">
              <div>
                <ul className="card-child__list-group">
                  <OrganizationCard
                    organization={oneOrganization}
                    ballotItemWeVoteId={this.props.ballotItemWeVoteId}
                    followToggleOn
                  />
                </ul>
              </div>
            </div>
          </section>
        </Popover>
      );

      // Display the organization in a brief list
      return (
        <OverlayTrigger
          key={`trigger-${organizationWeVoteId}`}
          ref={`not-shown-overlay-${organizationWeVoteId}`}
          onFocus={() => this.onTriggerEnter(organizationWeVoteId)}
          onMouseOver={() => this.onTriggerEnter(organizationWeVoteId)}
          onBlur={() => this.onTriggerLeave(organizationWeVoteId)}
          onMouseOut={() => this.onTriggerLeave(organizationWeVoteId)}
          rootClose
          placement="bottom"
          overlay={organizationPopover}
        >
          <div key={speakerWeVoteId} className="card-main__media-object">
            {/* One Position on this Candidate */}
            <div className="card-child__media-object-anchor">
              <Link to={speakerLink} className="u-no-underline">
                <ImageHandler
                  className=""
                  sizeClassName="organization__image--tiny"
                  imageUrl={speakerImageUrlHttpsTiny}
                />
              </Link>
              <br />
              <br />
            </div>
            &nbsp;&nbsp;
            <div className="card-child__media-object-content">
              <Link to={speakerLink}>
                <h3 className="card-child__display-name">{speakerDisplayName}</h3>
              </Link>
            </div>
          </div>
        </OverlayTrigger>
      );
    });
    if (showPosition) {
      return (
        <span className="guidelist card-child__list-group">
          {positionsNotShownDisplay}
        </span>
      );
    } else {
      return (
        <span className="guidelist card-child__list-group">
          {nothingToDisplay}
        </span>
      );
    }
  }
}
