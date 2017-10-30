import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationCard from "../VoterGuide/OrganizationCard";

// This component is used to display the "+X" list in the ItemTinyPositionBreakdownList
export default class PositionsNotShownList extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    positions_not_shown_list: PropTypes.array.isRequired
  };

  constructor (props) {
    super(props);
  }

  onTriggerEnter (organization_we_vote_id) {
    this.refs[`overlay-${organization_we_vote_id}`].show();
    this.show_popover = true;
    clearTimeout(this.hide_popover_timer);
  }

  onTriggerLeave (organization_we_vote_id) {
    this.show_popover = false;
    clearTimeout(this.hide_popover_timer);
    this.hide_popover_timer = setTimeout(() => {
      if (!this.show_popover && this.refs[`overlay-${organization_we_vote_id}`]) {
        this.refs[`overlay-${organization_we_vote_id}`].hide();
      }
    }, 100);
  }

  render () {
    if (!this.props.positions_not_shown_list) {
      return <div>{LoadingWheel}</div>;
    }

    var show_position = true;
    var nothing_to_display = null;

    const positions_not_shown_display = this.props.positions_not_shown_list.map( (one_position) => {
      // console.log("PositionsNotShownList, one_position: ", one_position);
      let speaker_we_vote_id = one_position.speaker_we_vote_id;
      let speaker_display_name = one_position.speaker_display_name;
      let speaker_image_url_https_tiny = one_position.speaker_image_url_https_tiny;
      let speaker_twitter_handle = one_position.speaker_twitter_handle;

      // TwitterHandle-based link
      var speakerLink = speaker_twitter_handle ? "/" + speaker_twitter_handle : "/voterguide/" + speaker_we_vote_id;
      let one_organization = {
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
      let organizationPopover = <Popover
          id={`organization-popover-${organization_we_vote_id}`}
          onMouseOver={() => this.onTriggerEnter(organization_we_vote_id)}
          onMouseOut={() => this.onTriggerLeave(organization_we_vote_id)}>
          <section className="card">
            <div className="card__additional">
              <div>
                <ul className="card-child__list-group">
                  <OrganizationCard organization={one_organization}
                                    ballotItemWeVoteId={this.props.ballotItemWeVoteId}
                                    followToggleOn />
                </ul>
              </div>
          </div>
          </section>
        </Popover>;

      // Display the organization in a brief list
      return <OverlayTrigger
              key={`trigger-${organization_we_vote_id}`}
              ref={`overlay-${organization_we_vote_id}`}
              onMouseOver={() => this.onTriggerEnter(organization_we_vote_id)}
              onMouseOut={() => this.onTriggerLeave(organization_we_vote_id)}
              rootClose
              placement="bottom"
              overlay={organizationPopover}>
          <div key={speaker_we_vote_id} className="card-main__media-object">
          {/* One Position on this Candidate */}
            <div className="card-child__media-object-anchor">
              <Link to={speakerLink} className="u-no-underline">
                <ImageHandler className=""
                              sizeClassName="organization-image-tiny"
                              imageUrl={speaker_image_url_https_tiny}/>
              </Link>
              <br />
              <br />
            </div>
            &nbsp;&nbsp;
            <div className="card-child__media-object-content">
              <Link to={speakerLink}>
                <h3 className="card-child__display-name">{speaker_display_name}</h3>
              </Link>
            </div>
          </div>
        </OverlayTrigger>;
    });
    if (show_position) {
      return <span className="guidelist card-child__list-group">
        {positions_not_shown_display}
      </span>;
    } else {
      return <span className="guidelist card-child__list-group">
        {nothing_to_display}
      </span>;
    }
  }
}
