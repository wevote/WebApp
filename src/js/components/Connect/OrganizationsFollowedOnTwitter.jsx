import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import FollowToggle from '../Widgets/FollowToggle';
import { renderLog } from '../../utils/logging';
import OrganizationCard from '../VoterGuide/OrganizationCard';
import OrganizationTinyDisplay from '../VoterGuide/OrganizationTinyDisplay';

export default class OrganizationsFollowedOnTwitter extends Component {
  static propTypes = {
    organizationsFollowedOnTwitter: PropTypes.array,
    maximumOrganizationDisplay: PropTypes.number,
  };

  constructor (props) {
    super(props);

    this.show_popover = false;

    this.state = {
      organizationsFollowedOnTwitter: this.props.organizationsFollowedOnTwitter,
      maximumOrganizationDisplay: this.props.maximumOrganizationDisplay,
    };
  }

  componentDidMount () {
    console.log('OrganizationsFollowedOnTwitter componentDidMount');
    this.setState({
      organizationsFollowedOnTwitter: this.props.organizationsFollowedOnTwitter,
      maximumOrganizationDisplay: this.props.maximumOrganizationDisplay,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("OrganizationsFollowedOnTwitter, componentWillReceiveProps, nextProps.organizationsFollowedOnTwitter:", nextProps.organizationsFollowedOnTwitter);
    // if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      organizationsFollowedOnTwitter: nextProps.organizationsFollowedOnTwitter,
      maximumOrganizationDisplay: nextProps.maximumOrganizationDisplay,
    });
    // }
  }

  onTriggerEnter (organizationWeVoteId) {
    this.refs[`overlay-${organizationWeVoteId}`].show();
    this.show_popover = true;
    clearTimeout(this.hide_popover_timer);
  }

  onTriggerLeave (organizationWeVoteId) {
    this.show_popover = false;
    clearTimeout(this.hide_popover_timer);
    this.hide_popover_timer = setTimeout(() => {
      if (!this.show_popover) {
        this.refs[`overlay-${organizationWeVoteId}`].hide();
      }
    }, 100);
  }

  render () {
    // console.log("OrganizationsFollowedOnTwitter render")
    renderLog(__filename);
    if (this.state.organizationsFollowedOnTwitter === undefined) {
      return null;
    }

    let localCounter = 0;
    let organizationsNotShownCount = 0;
    let oneOrganizationForOrganizationCard;
    if (this.state.organizationsFollowedOnTwitter &&
      this.state.organizationsFollowedOnTwitter.length > this.state.maximumOrganizationDisplay) {
      organizationsNotShownCount = this.state.organizationsFollowedOnTwitter.length - this.state.maximumOrganizationDisplay;
    }
    const organizationsToDisplay = this.state.organizationsFollowedOnTwitter.map((oneOrganization) => {
      localCounter++;
      const organizationWeVoteId = oneOrganization.organization_we_vote_id;
      if (localCounter > this.state.maximumOrganizationDisplay) {
        if (localCounter === this.state.maximumOrganizationDisplay + 1) {
          // If here we want to show how many organizations there are to follow
          return (
            <span key={oneOrganization.organization_we_vote_id}>
              <Link to="/opinions_followed">
                {' '}
                +
                {organizationsNotShownCount}
              </Link>
            </span>
          );
        } else {
          return '';
        }
      } else {
        oneOrganizationForOrganizationCard = {
          organization_name: oneOrganization.organization_name,
          organization_photo_url_large: oneOrganization.organization_photo_url_large,
          organization_photo_url_tiny: oneOrganization.organization_photo_url_tiny,
          organization_twitter_handle: oneOrganization.organization_twitter_handle,
          organization_website: oneOrganization.organization_website,
          twitter_description: oneOrganization.twitter_description,
          twitter_followers_count: oneOrganization.twitter_followers_count,
        };

        // Removed bsPrefix="card-popover"
        // onMouseOver={() => this.onTriggerEnter(organizationWeVoteId)}
        // onMouseOut={() => this.onTriggerLeave(organizationWeVoteId)}
        const organizationPopover = (
          <Popover id={`organization-popover-${organizationWeVoteId}`}>
            <div className="card">
              <div className="card-main">
                <FollowToggle organizationWeVoteId={oneOrganization.organization_we_vote_id} />
                <OrganizationCard organization={oneOrganizationForOrganizationCard} />
              </div>
            </div>
          </Popover>
        );
        const voterGuideLink = oneOrganization.organization_twitter_handle ?
          `/${oneOrganization.organization_twitter_handle}` :
          `/voterguide/${oneOrganization.organization_we_vote_id}`;
        const placement = 'bottom';
        // onMouseOver={() => this.onTriggerEnter(organizationWeVoteId)}
        // onMouseOut={() => this.onTriggerLeave(organizationWeVoteId)}
        return (
          <OverlayTrigger
            key={`trigger-${organizationWeVoteId}`}
            ref={`overlay-${organizationWeVoteId}`}
            rootClose
            placement={placement}
            overlay={organizationPopover}
          >
            <span className="position-rating__source with-popover">
              <Link to={voterGuideLink}>
                <OrganizationTinyDisplay
                  {...oneOrganization}
                  showPlaceholderImage
                />
              </Link>
            </span>
          </OverlayTrigger>
        );
      }
    });

    return (
      <span className="guidelist card-child__list-group">
        {organizationsToDisplay}
      </span>
    );
  }
}
