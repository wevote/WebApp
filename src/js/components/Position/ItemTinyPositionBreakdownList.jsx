import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "react-svg-icons";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { isCordova } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import OrganizationCard from "../VoterGuide/OrganizationCard";
import OrganizationTinyDisplay from "../VoterGuide/OrganizationTinyDisplay";
import PositionsNotShownList from "../Ballot/PositionsNotShownList";
import VoterStore from "../../stores/VoterStore";

// This component can be used to show either supporters, opposers, or groups with info only that the Voter
// is already listening to
export default class ItemTinyPositionBreakdownList extends Component {

  static propTypes = {
    // ballot_item_display_name: PropTypes.string.isRequired,  // We have removed this, so we can remove it from all places that call this component
    ballotItemWeVoteId: PropTypes.string.isRequired,
    currentBallotIdInUrl: PropTypes.string,
    position_list: PropTypes.array,
    showInfoOnly: PropTypes.bool,
    showOppose: PropTypes.bool,
    showSupport: PropTypes.bool,
    supportProps: PropTypes.object,
    visibility: PropTypes.string,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      position_list: this.props.position_list,
      ballot_item_we_vote_id: "",
    };
    this.show_popover = false;
  }

  componentDidMount () {
    this.setState({
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
      position_list: this.props.position_list,
      voter: VoterStore.getVoter(), // We only set this once since the info we need isn't dynamic
      voter_support_oppose_properties: this.props.supportProps,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      position_list: nextProps.position_list,
      ballot_item_we_vote_id: nextProps.ballotItemWeVoteId,
      voter_support_oppose_properties: nextProps.supportProps,
    });
  }

  onTriggerEnter (organizationWeVoteId) {
    // console.log("onTriggerEnter")
    this.refs[`position-overlay-${organizationWeVoteId}`].show();
    this.show_popover = true;
    clearTimeout(this.hide_popover_timer);
  }

  onTriggerLeave (organizationWeVoteId) {
    // console.log("onTriggerLeave")
    this.show_popover = false;
    clearTimeout(this.hide_popover_timer);
    this.hide_popover_timer = setTimeout(() => {
      if (!this.show_popover && this.refs[`position-overlay-${organizationWeVoteId}`]) {
        this.refs[`position-overlay-${organizationWeVoteId}`].hide();
      }
    }, 100);
  }

  render () {
    // console.log("ItemTinyPositionBreakdownList render");
    renderLog(__filename);
    if (!this.state.position_list && !this.state.voter_support_oppose_properties) {
      // If neither position_list nor supportProps exist, then return null
      return null;
    }
    // console.log("ItemTinyPositionBreakdownList got past return null");

    const MAXIMUM_ORGANIZATION_DISPLAY = 50;
    let localCounter = 0;
    let orgsNotShownCount = 0;
    let positionsNotShownList = [];
    const supportPositionsList = [];
    const opposePositionsList = [];
    let oneOrganization;
    const organizationsToDisplay = [];
    let tempOrganizationsToDisplay = [];
    let voterImageUrlTiny = "";
    // Put the voter's icon first
    if (this.state.voter_support_oppose_properties && this.state.voter) {
      let showVoterPosition = false;
      if (this.state.voter_support_oppose_properties.is_support && this.props.showSupport) {
        showVoterPosition = true;
      } else if (this.state.voter_support_oppose_properties.is_oppose && this.props.showOppose) {
        showVoterPosition = true;
      }
      // console.log("ItemTinyPositionBreakdownList showVoterPosition: ", showVoterPosition);
      if (showVoterPosition) {
        // If here, we are showing an icon for the voter
        oneOrganization = {
          organization_we_vote_id: this.state.voter.we_vote_id,
          voter_guide_display_name: this.state.voter.full_name,
        };
        let voterOrganizationTinyDisplay;
        voterImageUrlTiny = this.state.voter.voter_photo_url_tiny ? this.state.voter.voter_photo_url_tiny : "";

        let showSupport = false;
        let showOppose = false;
        let supportOpposeClass = "";
        if (this.state.voter_support_oppose_properties.is_support) {
          showSupport = true;
          supportOpposeClass = "network-positions__show-support-underline ";
        } else if (this.state.voter_support_oppose_properties.is_oppose) {
          showOppose = true;
          supportOpposeClass = "network-positions__show-oppose-underline ";
        }

        if (voterImageUrlTiny && voterImageUrlTiny.length) {
          voterOrganizationTinyDisplay = (
            <OrganizationTinyDisplay
              key={oneOrganization.organization_we_vote_id}
              showPlaceholderImage
              voter_image_url_tiny={voterImageUrlTiny}
              showSupport={showSupport}
              showOppose={showOppose}
              {...oneOrganization}
            />
          );
        } else {
          voterOrganizationTinyDisplay = (
            <span key="anonIconKey" className={`${supportOpposeClass}position-rating__source with-popover`}>
              <Icon name="avatar-generic" width={24} height={24} color="#c0c0c0" />
              You
            </span>
          );
        }
        organizationsToDisplay.push(voterOrganizationTinyDisplay);
      }
    }
    // Add the icons of other organizations now
    // console.log("this.state.position_list: ", this.state.position_list); // Switching elections bug -- first candidate missing?
    if (this.state.position_list) {
      // console.log("ItemTinyPositionBreakdownList position_list found");

      // TODO: Steve remove the error suppression on the next line 12/1/18, a temporary hack
      this.state.position_list.map((onePosition) => { // eslint-disable-line array-callback-return
        // console.log("onePosition: ", onePosition);
        // Filter out the positions that we don't want to display
        if (this.props.showSupport && onePosition.is_support_or_positive_rating) {
          supportPositionsList.push(onePosition);
        } else if (this.props.showOppose && onePosition.is_oppose_or_negative_rating) {
          opposePositionsList.push(onePosition);
          // } else if (this.props.showInfoOnly && !onePosition.is_support_or_positive_rating && !onePosition.is_oppose_or_negative_rating) {
          //   // When in showInfoOnly mode, continue if it is NOT positive or negative
        }
      });

      if (supportPositionsList && supportPositionsList.length > MAXIMUM_ORGANIZATION_DISPLAY) {
        orgsNotShownCount = supportPositionsList.length - MAXIMUM_ORGANIZATION_DISPLAY;
        positionsNotShownList = supportPositionsList.slice(MAXIMUM_ORGANIZATION_DISPLAY);
      } else if (opposePositionsList && opposePositionsList.length > MAXIMUM_ORGANIZATION_DISPLAY) {
        orgsNotShownCount = opposePositionsList.length - MAXIMUM_ORGANIZATION_DISPLAY;
        positionsNotShownList = opposePositionsList.slice(MAXIMUM_ORGANIZATION_DISPLAY);
      }

      tempOrganizationsToDisplay = this.state.position_list.map((onePosition) => {
        // Filter out the positions that we don't want to display
        if (this.props.showSupport && onePosition.is_support_or_positive_rating) {
          // When in showSupport mode, continue if it is a positive position
          // Fall through
        } else if (this.props.showOppose && onePosition.is_oppose_or_negative_rating) {
          // When in showOppose mode, continue if it is a negative position
          // Fall through
        } else if (this.props.showInfoOnly && !onePosition.is_support_or_positive_rating && !onePosition.is_oppose_or_negative_rating) {
          // When in showInfoOnly mode, continue if it is NOT positive or negative
          // Fall through
        } else {
          return null;
        }

        localCounter++;
        if (localCounter > MAXIMUM_ORGANIZATION_DISPLAY) {
          // We are in a loop here, and when we arrive at the first organization after our display limit,
          //  we want to show a "drop down" with the remaining organizations.
          if (localCounter === MAXIMUM_ORGANIZATION_DISPLAY + 1) {
            // If here we want to show how many organizations there are to follow
            // Removed bsPrefix="card-popover"
            // onMouseOver={() => this.onTriggerEnter(orgsNotShownCount)}
            // onMouseOut={() => this.onTriggerLeave(orgsNotShownCount)}
            // outOfBoundaries={() => console.log("outOfBoundaries outOfBoundaries outOfBoundaries")}
            const organizationPopover = (
              <Popover
                id={`organization-popover-${orgsNotShownCount}`}
                constraints={{ to: "scrollParent", pin: true }}
                placement="auto"
                title={(
                  <span onClick={() => this.onTriggerLeave(orgsNotShownCount)}>
                    &nbsp;
                    <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" />
                  </span>
                )}
              >
                <PositionsNotShownList
                  ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                  positions_not_shown_list={positionsNotShownList}
                />
              </Popover>
            );

            // onMouseOver={() => this.onTriggerEnter(orgsNotShownCount)}
            // onMouseOut={() => this.onTriggerLeave(orgsNotShownCount)}
            // onExiting={() => this.onTriggerLeave(orgsNotShownCount)}
            // trigger={this.props.visibility === "mobile" ? "click" : ["focus", "hover", "click"]}
            return (
              <OverlayTrigger
                key={`trigger-${orgsNotShownCount}`}
                ref={`position-overlay-${orgsNotShownCount}`}
                overlay={organizationPopover}
                placement="bottom"
                rootClose
                trigger="click"
              >
                <span className="position-rating__source with-popover">
                  {" "}
                  +
                  {orgsNotShownCount}
                  {" "}
                </span>
              </OverlayTrigger>
            );
          } else {
            return null;
          }
        } else {
          // If we made it to here, then we want to display the organizations that the voter is listening to in a popover
          // console.log("ItemTinyPositionBreakdownList, onePosition:", onePosition);
          oneOrganization = {
            organization_we_vote_id: onePosition.speaker_we_vote_id,
            organization_name: onePosition.speaker_display_name,
            organization_photo_url_large: onePosition.speaker_image_url_https_large,
            organization_photo_url_tiny: onePosition.speaker_image_url_https_tiny,
            organization_twitter_handle: onePosition.speaker_twitter_handle,
            // organization_website: onePosition.more_info_url,
            twitter_description: "",
            twitter_followers_count: 0,
          };
          const organizationWeVoteId = oneOrganization.organization_we_vote_id;
          // Removed bsPrefix="card-popover"
          // onMouseOver={() => this.onTriggerEnter(organizationWeVoteId)}
          // onMouseOut={() => this.onTriggerLeave(organizationWeVoteId)}
          // WAS placement="auto"
          const organizationPopover = (
            <Popover
              id={`organization-popover-${organizationWeVoteId}`}
              placement="bottom"
              title={(
                <span onClick={() => this.onTriggerLeave(organizationWeVoteId)}>
                  &nbsp;
                  {" "}
                  <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" />
                  {" "}
                </span>
              )}
            >
              <OrganizationCard
                ballotItemWeVoteId={this.props.ballotItemWeVoteId}
                currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                followToggleOn
                organization={oneOrganization}
                urlWithoutHash={this.props.urlWithoutHash}
                we_vote_id={this.props.we_vote_id}
              />
            </Popover>
          );

          // Removed from OverlayTrigger
          // onMouseOver={() => this.onTriggerEnter(organizationWeVoteId)}
          // onMouseOut={() => this.onTriggerLeave(organizationWeVoteId)}
          // onExiting={() => this.onTriggerLeave(organizationWeVoteId)}
          // trigger={this.props.visibility === "mobile" ? "click" : ["focus", "hover", "click"]}
          return (
            <OverlayTrigger
              key={`trigger-${organizationWeVoteId}`}
              ref={`position-overlay-${organizationWeVoteId}`}
              overlay={organizationPopover}
              placement="bottom"
              rootClose
              trigger="click"
            >
              <span className="position-rating__source with-popover">
                <OrganizationTinyDisplay
                  {...oneOrganization}
                  showPlaceholderImage
                  showSupport={this.props.showSupport}
                  showOppose={this.props.showOppose}
                />
              </span>
            </OverlayTrigger>
          );
        }
      });
      organizationsToDisplay.push(tempOrganizationsToDisplay);
    }

    // Since we often have two ItemTinyPositionBreakdownList components side-by-side, this needs to be a span so
    // the second ItemTinyPositionBreakdownList doesn't get pushed onto a new line.
    return (
      <span>
        {organizationsToDisplay}
      </span>
    );
  }
}
