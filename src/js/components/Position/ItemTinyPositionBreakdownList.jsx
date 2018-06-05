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

// This component can be used to show either supporters, opposers, or groups with info only
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
    we_vote_id: PropTypes.string
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

  onTriggerEnter (organization_we_vote_id) {
    this.refs[`position-overlay-${organization_we_vote_id}`].show();
    this.show_popover = true;
    clearTimeout(this.hide_popover_timer);
  }

  onTriggerLeave (organization_we_vote_id) {
    this.show_popover = false;
    clearTimeout(this.hide_popover_timer);
    this.hide_popover_timer = setTimeout(() => {
      if (!this.show_popover && this.refs[`position-overlay-${organization_we_vote_id}`]) {
        this.refs[`position-overlay-${organization_we_vote_id}`].hide();
      }
    }, 100);
  }

  render () {
    renderLog(__filename);
    if (!this.state.position_list && !this.state.voter_support_oppose_properties) {
      // If neither position_list nor supportProps exist, then return null
      return null;
    }
    // console.log("ItemTinyPositionBreakdownList got past return null");

    const MAXIMUM_ORGANIZATION_DISPLAY = 50;
    let local_counter = 0;
    let orgs_not_shown_count = 0;
    let positions_not_shown_list = [];
    let support_positions_list = [];
    let oppose_positions_list = [];
    let one_organization;
    let organizations_to_display = [];
    let temp_organizations_to_display = [];
    let voter_image_url_tiny = "";
    // Put the voter's icon first
    if (this.state.voter_support_oppose_properties && this.state.voter) {
      let show_voter_position = false;
      if (this.state.voter_support_oppose_properties.is_support && this.props.showSupport) {
        show_voter_position = true;
      } else if (this.state.voter_support_oppose_properties.is_oppose && this.props.showOppose) {
        show_voter_position = true;
      }
      // console.log("ItemTinyPositionBreakdownList show_voter_position: ", show_voter_position);
      if (show_voter_position) {
        // If here, we are showing an icon for the voter
        one_organization = {
          organization_we_vote_id: this.state.voter.we_vote_id,
          voter_guide_display_name: this.state.voter.full_name,
        };
        let voter_organization_tiny_display;
        voter_image_url_tiny = this.state.voter.voter_photo_url_tiny ? this.state.voter.voter_photo_url_tiny : "";

        let showSupport = false;
        let showOppose = false;
        let support_oppose_class = "";
        if (this.state.voter_support_oppose_properties.is_support) {
          showSupport = true;
          support_oppose_class = "network-positions__show-support-underline ";
        } else if (this.state.voter_support_oppose_properties.is_oppose) {
          showOppose = true;
          support_oppose_class = "network-positions__show-oppose-underline ";
        }

        if (voter_image_url_tiny && voter_image_url_tiny.length) {
          voter_organization_tiny_display = <OrganizationTinyDisplay key={one_organization.organization_we_vote_id}
                                                                     showPlaceholderImage
                                                                     voter_image_url_tiny={voter_image_url_tiny}
                                                                     showSupport={showSupport}
                                                                     showOppose={showOppose}
                                                                     {...one_organization} />;
        } else {
          voter_organization_tiny_display = <span key="anonIconKey" className={support_oppose_class + "position-rating__source with-popover"}><Icon name="avatar-generic" width={24} height={24} />You</span>;
        }
        organizations_to_display.push(voter_organization_tiny_display);
      }
    }
    // Add the icons of other organizations now
    // console.log("this.state.position_list: ", this.state.position_list); // Switching elections bug -- first candidate missing?
    if (this.state.position_list) {
      // console.log("ItemTinyPositionBreakdownList position_list found");
      this.state.position_list.map((one_position) => {
        // console.log("one_position: ", one_position);
        // Filter out the positions that we don't want to display
        if (this.props.showSupport && one_position.is_support_or_positive_rating) {
          support_positions_list.push(one_position);
        } else if (this.props.showOppose && one_position.is_oppose_or_negative_rating) {
          oppose_positions_list.push(one_position);
        } else if (this.props.showInfoOnly && !one_position.is_support_or_positive_rating && !one_position.is_oppose_or_negative_rating) {
          // When in showInfoOnly mode, continue if it is NOT positive or negative
        }
      });

      if (support_positions_list && support_positions_list.length > MAXIMUM_ORGANIZATION_DISPLAY) {
        orgs_not_shown_count = support_positions_list.length - MAXIMUM_ORGANIZATION_DISPLAY;
        positions_not_shown_list = support_positions_list.slice(MAXIMUM_ORGANIZATION_DISPLAY);
      } else if (oppose_positions_list && oppose_positions_list.length > MAXIMUM_ORGANIZATION_DISPLAY) {
        orgs_not_shown_count = oppose_positions_list.length - MAXIMUM_ORGANIZATION_DISPLAY;
        positions_not_shown_list = oppose_positions_list.slice(MAXIMUM_ORGANIZATION_DISPLAY);
      }

      temp_organizations_to_display = this.state.position_list.map((one_position) => {
        // Filter out the positions that we don't want to display
        if (this.props.showSupport && one_position.is_support_or_positive_rating) {
          // When in showSupport mode, continue if it is a positive position
          // Fall through
        } else if (this.props.showOppose && one_position.is_oppose_or_negative_rating) {
          // When in showOppose mode, continue if it is a negative position
          // Fall through
        } else if (this.props.showInfoOnly && !one_position.is_support_or_positive_rating && !one_position.is_oppose_or_negative_rating) {
          // When in showInfoOnly mode, continue if it is NOT positive or negative
          // Fall through
        } else {
          return null;
        }

        local_counter++;
        if (local_counter > MAXIMUM_ORGANIZATION_DISPLAY) {
          // We are in a loop here, and when we arrive at the first organization after our display limit,
          //  we want to show a "drop down" with the remaining organizations.
          if (local_counter === MAXIMUM_ORGANIZATION_DISPLAY + 1) {
            // If here we want to show how many organizations there are to follow
            let organizationPopover = <Popover className="card-popover"
                                               id={`organization-popover-${orgs_not_shown_count}`}
                                               onMouseOver={() => this.onTriggerEnter(orgs_not_shown_count)}
                                               onMouseOut={() => this.onTriggerLeave(orgs_not_shown_count)}
                                               placement="bottom"
                                               title={<span onClick={() => this.onTriggerLeave(orgs_not_shown_count)}>&nbsp;
                                                 <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" /> </span>}
                                               >
                <PositionsNotShownList ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                                       positions_not_shown_list={positions_not_shown_list} />
              </Popover>;

            return <OverlayTrigger
                key={`trigger-${orgs_not_shown_count}`}
                ref={`position-overlay-${orgs_not_shown_count}`}
                onMouseOver={() => this.onTriggerEnter(orgs_not_shown_count)}
                onMouseOut={() => this.onTriggerLeave(orgs_not_shown_count)}
                onExiting={() => this.onTriggerLeave(orgs_not_shown_count)}
                trigger={this.props.visibility === "mobile" ? "click" : ["focus", "hover", "click"]}
                rootClose
                placement="bottom"
                overlay={organizationPopover}>
                <span className="position-rating__source with-popover"> +{orgs_not_shown_count} </span>
            </OverlayTrigger>;
          } else {
            return null;
          }
        } else {
          // If we made it to here, then we want to display the organization in a popover
          // console.log("ItemTinyPositionBreakdownList, one_position:", one_position);
          one_organization = {
            organization_we_vote_id: one_position.speaker_we_vote_id,
            organization_name: one_position.speaker_display_name,
            organization_photo_url_large: one_position.speaker_image_url_https_large,
            organization_photo_url_tiny: one_position.speaker_image_url_https_tiny,
            organization_twitter_handle: one_position.speaker_twitter_handle,
            // organization_website: one_position.more_info_url,
            twitter_description: "",
            twitter_followers_count: 0,
          };
          let organization_we_vote_id = one_organization.organization_we_vote_id;
          let organizationPopover = <Popover className="card-popover"
                                             id={`organization-popover-${organization_we_vote_id}`}
                                             onMouseOver={() => this.onTriggerEnter(organization_we_vote_id)}
                                             onMouseOut={() => this.onTriggerLeave(organization_we_vote_id)}
                                             placement="bottom"
                                             title={<span onClick={() => this.onTriggerLeave(organization_we_vote_id)}>&nbsp;
                                               <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" /> </span>}
                                             >
              <OrganizationCard ballotItemWeVoteId={this.props.ballotItemWeVoteId}
                                currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                followToggleOn
                                organization={one_organization}
                                urlWithoutHash={this.props.urlWithoutHash}
                                we_vote_id={this.props.we_vote_id} />
            </Popover>;

          return <OverlayTrigger
              key={`trigger-${organization_we_vote_id}`}
              ref={`position-overlay-${organization_we_vote_id}`}
              onMouseOver={() => this.onTriggerEnter(organization_we_vote_id)}
              onMouseOut={() => this.onTriggerLeave(organization_we_vote_id)}
              onExiting={() => this.onTriggerLeave(organization_we_vote_id)}
              trigger={this.props.visibility === "mobile" ? "click" : ["focus", "hover", "click"]}
              rootClose
              placement="bottom"
              overlay={organizationPopover}>
            <span className="position-rating__source with-popover">
              <OrganizationTinyDisplay {...one_organization}
                                       showPlaceholderImage
                                       showSupport={this.props.showSupport}
                                       showOppose={this.props.showOppose}/>

            </span>
          </OverlayTrigger>;
        }
      });
      organizations_to_display.push(temp_organizations_to_display);
    }

    // Since we often have two ItemTinyPositionBreakdownList components side-by-side, this needs to be a span so
    // the second ItemTinyPositionBreakdownList doesn't get pushed onto a new line.
    return <span>
          {organizations_to_display}
      </span>;
  }

}
