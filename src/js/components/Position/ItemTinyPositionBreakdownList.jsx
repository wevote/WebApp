import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import OrganizationTinyDisplay from "../VoterGuide/OrganizationTinyDisplay";
import PositionItem from "../Ballot/PositionItem";
import VoterStore from "../../stores/VoterStore";

// This component can be used to show either supporters, opposers, or groups with info only
export default class ItemTinyPositionBreakdownList extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    position_list: PropTypes.array,
    showInfoOnly: PropTypes.bool,
    showOppose: PropTypes.bool,
    showSupport: PropTypes.bool,
    supportProps: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      position_list: this.props.position_list,
      ballot_item_we_vote_id: ""
    };
    this.closePopover = this.closePopover.bind(this);
  }

  componentDidMount () {
    this.setState({
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
      position_list: this.props.position_list,
      voter: VoterStore.getVoter() // We only set this once since the info we need isn't dynamic
    });
  }

  componentWillReceiveProps (nextProps){
    this.setState({
      position_list: nextProps.position_list,
      ballot_item_we_vote_id: nextProps.ballotItemWeVoteId
    });
  }

  closePopover () {
    // TODO We may need to make the "overlay" refs name dynamic...
    this.refs.overlay.hide();
  }

  render () {
    if (!this.state.position_list && !this.props.supportProps) {
      // If neither position_list nor supportProps exist, then return null
      return null;
    }

    const MAXIMUM_ORGANIZATION_DISPLAY = 4;
    let local_counter = 0;
    let orgs_not_shown_count = 0;
    let one_organization;
    if (this.state.position_list && this.state.position_list.length > MAXIMUM_ORGANIZATION_DISPLAY) {
      orgs_not_shown_count = this.state.position_list.length - MAXIMUM_ORGANIZATION_DISPLAY;
    }
    let organizations_to_display;
    if (this.state.position_list) {
      organizations_to_display = this.state.position_list.map((one_position) => {
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
          if (local_counter === MAXIMUM_ORGANIZATION_DISPLAY + 1) {
            // If here we want to show how many organizations there are to follow
            return <span key={one_position.speaker_we_vote_id}> +{orgs_not_shown_count}</span>;
          } else {
            return null;
          }
        } else {
          // If we made it to here, then we want to display the organization in a popover
          one_organization = {
            organization_we_vote_id: one_position.speaker_we_vote_id,
            voter_guide_image_url: one_position.speaker_image_url_https,
            voter_guide_display_name: one_position.speaker_display_name
          };
          let organizationPopover = <Popover id="popover-trigger-hover-focus"
                                             onClick={this.closePopover} >
              <section className="card">
                <div className="card__additional">
                  <div>
                    <ul className="card-child__list-group">
                      <PositionItem key={one_position.speaker_we_vote_id}
                                    ballot_item_display_name={one_position.speaker_display_name}
                                    position={one_position}
                      />
                    </ul>
                  </div>
              </div>
              </section>
            </Popover>;

          let placement = "bottom";
          return <OverlayTrigger
              key={one_organization.organization_we_vote_id}
              trigger={["hover", "focus"]}
              ref="overlay"
              onExit={this.closePopover}
              rootClose
              placement={placement}
              overlay={organizationPopover}>
            <span className="position-rating__source with-popover">
              <OrganizationTinyDisplay {...one_organization}
                                     showPlaceholderImage />
            </span>
          </OverlayTrigger>;
        }
      });
    }
    // Now weave in the voter's position
    if (this.props.supportProps && this.state.voter) {
      let show_voter_position = false;
      if (this.props.supportProps.is_support && this.props.showSupport) {
        show_voter_position = true;
      } else if (this.props.supportProps.is_oppose && this.props.showOppose) {
        show_voter_position = true;
      }
      if (show_voter_position) {
        one_organization = {
          organization_we_vote_id: this.state.voter.we_vote_id,
          voter_guide_image_url: this.state.voter.voter_photo_url,
          voter_guide_display_name: this.state.voter.full_name
        };
        let voter_organization_tiny_display = <OrganizationTinyDisplay key={one_organization.organization_we_vote_id}
                                                                       showPlaceholderImage
                                                                       {...one_organization} />;
        organizations_to_display.push(voter_organization_tiny_display);
      }
    }

    return <span className="guidelist card-child__list-group">
          {organizations_to_display}
      </span>;
  }

}
