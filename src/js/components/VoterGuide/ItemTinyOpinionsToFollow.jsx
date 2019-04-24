import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { renderLog } from '../../utils/logging';
import OrganizationCard from './OrganizationCard';
import OrganizationsNotShownList from './OrganizationsNotShownList';
import OrganizationTinyDisplay from './OrganizationTinyDisplay';

export default class ItemTinyOpinionsToFollow extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsToFollow: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    maximumOrganizationDisplay: PropTypes.number,
    supportProps: PropTypes.object,
  };

  constructor (props) {
    super(props);

    this.popover_state = {};
    this.mobile = 'ontouchstart' in document.documentElement;

    this.state = {
      organizationsToFollow: this.props.organizationsToFollow,
      ballotItemWeVoteId: '',
      maximumOrganizationDisplay: this.props.maximumOrganizationDisplay,
      supportProps: this.props.supportProps,
    };
  }

  componentDidMount () {
    this.setState({
      organizationsToFollow: this.props.organizationsToFollow,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      maximumOrganizationDisplay: this.props.maximumOrganizationDisplay,
      supportProps: this.props.supportProps,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("ItemTinyOpinionsToFollow, componentWillReceiveProps, nextProps.organizationsToFollow:", nextProps.organizationsToFollow);
    // if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      organizationsToFollow: nextProps.organizationsToFollow,
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      maximumOrganizationDisplay: nextProps.maximumOrganizationDisplay,
      supportProps: nextProps.supportProps,
    });
    // }
  }

  onTriggerEnter (organizationWeVoteId) {
    if (this.refs[`to-follow-overlay-${organizationWeVoteId}`]) { // eslint-disable-line react/no-string-refs
      this.refs[`to-follow-overlay-${organizationWeVoteId}`].show(); // eslint-disable-line react/no-string-refs
    }
    if (!this.popover_state[organizationWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[organizationWeVoteId] = { show: false, timer: null };
    }

    clearTimeout(this.popover_state[organizationWeVoteId].timer);
    if (!this.popover_state[organizationWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[organizationWeVoteId] = { show: false, timer: null };
    }
    this.popover_state[organizationWeVoteId].show = true;
  }

  onTriggerLeave (organizationWeVoteId) {
    if (!this.popover_state[organizationWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[organizationWeVoteId] = { show: false, timer: null };
    }
    this.popover_state[organizationWeVoteId].show = false;
    clearTimeout(this.popover_state[organizationWeVoteId].timer);
    this.popover_state[organizationWeVoteId].timer = setTimeout(() => {
      if (!this.popover_state[organizationWeVoteId].show) {
        if (this.refs[`to-follow-overlay-${organizationWeVoteId}`]) { // eslint-disable-line react/no-string-refs
          this.refs[`to-follow-overlay-${organizationWeVoteId}`].hide(); // eslint-disable-line react/no-string-refs
        }
      }
    }, 100);
  }

  onTriggerToggle (e, organizationWeVoteId) {
    if (this.mobile) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.popover_state[organizationWeVoteId]) {
        // If it wasn't created, create it now
        this.popover_state[organizationWeVoteId] = { show: false, timer: null };
      }

      if (this.popover_state[organizationWeVoteId].show) {
        this.onTriggerLeave(organizationWeVoteId);
      } else {
        this.onTriggerEnter(organizationWeVoteId);
      }
    }
  }

  render () {
    // console.log("ItemTinyOpinionsToFollow render");
    renderLog(__filename);
    if (this.state.organizationsToFollow === undefined) {
      return null;
    }

    let noSupportOrOpposeCount;
    if (this.state.supportProps !== undefined) {
      const { support_count: supportCount, oppose_count: opposeCount } = this.state.supportProps;
      if (supportCount !== undefined && opposeCount !== undefined) {
        noSupportOrOpposeCount = supportCount === 0 && opposeCount === 0;
      }
    }

    let localCounter = 0;
    let orgsNotShownCount = 0;
    let orgsNotShownList = [];
    let oneOrganizationForOrganizationCard;
    if (this.state.organizationsToFollow &&
      this.state.organizationsToFollow.length > this.state.maximumOrganizationDisplay) {
      orgsNotShownCount = this.state.organizationsToFollow.length - this.state.maximumOrganizationDisplay;
      orgsNotShownList = this.state.organizationsToFollow.slice(this.state.maximumOrganizationDisplay);
    }
    const organizationsToDisplay = this.state.organizationsToFollow.map((oneOrganization) => {
      localCounter++;
      const organizationWeVoteId = oneOrganization.organization_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (localCounter > this.state.maximumOrganizationDisplay) {
        if (localCounter === this.state.maximumOrganizationDisplay + 1) {
          // If here, we want to show how many organizations there are to follow
          this.popover_state[orgsNotShownCount] = { show: false, timer: null };
          // Removed bsPrefix="card-popover"
          // onMouseOver={() => this.onTriggerEnter(orgsNotShownCount)}
          // onMouseOut={() => this.onTriggerLeave(orgsNotShownCount)}
          const organizationPopover = (
            <Popover id={`organization-popover-${orgsNotShownCount}`}>
              <OrganizationsNotShownList orgs_not_shown_list={orgsNotShownList} />
            </Popover>
          );

          // Removed from OverlayTrigger
          // onMouseOver={() => this.onTriggerEnter(orgsNotShownCount)}
          // onMouseOut={() => this.onTriggerLeave(orgsNotShownCount)}
          // onExiting={() => this.onTriggerLeave(orgsNotShownCount)}
          // trigger={["focus", "hover"]}
          return (
            <OverlayTrigger
              key={`trigger-${orgsNotShownCount}`}
              ref={`to-follow-overlay-${orgsNotShownCount}`}
              overlay={organizationPopover}
              placement="bottom"
              rootClose
              trigger="click"
            >
              <span className="position-rating__source with-popover">
                <Link to="/opinions">
                  {' '}
                  +
                  {orgsNotShownCount}
                </Link>
              </span>
            </OverlayTrigger>
          );
        } else {
          return '';
        }
      } else {
        // console.log("One organization ItemTinyOpinionsToFollow");
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

        this.popover_state[organizationWeVoteId] = { show: false, timer: null };

        const voterGuideLink = oneOrganization.organization_twitter_handle ?
          `/${oneOrganization.organization_twitter_handle}` :
          `/voterguide/${oneOrganization.organization_we_vote_id}`;

        // Removed bsPrefix="card-popover"
        // onMouseOver={() => this.onTriggerEnter(organizationWeVoteId)}
        // onMouseOut={() => this.onTriggerLeave(organizationWeVoteId)}
        const organizationPopover = (
          <Popover
            id={`organization-popover-${organizationWeVoteId}`}
            outOfBoundaries={undefined}
          >
            <OrganizationCard
              organization={oneOrganizationForOrganizationCard}
              ballotItemWeVoteId={this.state.ballotItemWeVoteId}
              followToggleOn
            />
          </Popover>
        );

        // Removed from OverlayTrigger:
        // onMouseOver={() => this.onTriggerEnter(organizationWeVoteId)}
        // onMouseOut={() => this.onTriggerLeave(organizationWeVoteId)}
        // onExiting={() => this.onTriggerLeave(organizationWeVoteId)}
        // trigger={["focus", "hover"]}
        return (
          <OverlayTrigger
            key={`trigger-${organizationWeVoteId}`}
            ref={`to-follow-overlay-${organizationWeVoteId}`}
            rootClose
            placement="bottom"
            trigger="click"
            overlay={organizationPopover}
          >
            <span className="position-rating__source with-popover">
              <Link
                key={`tiny-link-${organizationWeVoteId}`}
                className="u-no-underline"
                onClick={e => this.onTriggerToggle(e, organizationWeVoteId)}
                to={voterGuideLink}
              >
                <OrganizationTinyDisplay {...oneOrganization} showPlaceholderImage />
              </Link>
            </span>
          </OverlayTrigger>
        );
      }
    });

    return (
      <span className={noSupportOrOpposeCount ? 'guidelist card-child__list-group' : 'd-none d-sm-block d-print-none guidelist card-child__list-group'}>
        {organizationsToDisplay}
      </span>
    );
  }
}
