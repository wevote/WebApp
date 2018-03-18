import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import OrganizationActions from "../../actions/OrganizationActions";
import ImageHandler from "../ImageHandler";
import {cordovaDot} from "../../utils/cordovaUtils";

export default class OrganizationFollowToggle extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
    organization_name: PropTypes.string.isRequired,
    organization_description: PropTypes.string,
    organization_image_url: PropTypes.string,
    on_organization_follow: PropTypes.func.isRequired,
    on_organization_stop_following: PropTypes.func.isRequired,
    grid: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_following: false,
    };
  }

  componentDidMount () {
    this.onOrganizationFollow = this.onOrganizationFollow.bind(this);
    this.onOrganizationStopFollowing = this.onOrganizationStopFollowing.bind(this);
  }

  onOrganizationFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({is_following: true});
      let organization_follow_based_on_issue = true;
      OrganizationActions.organizationFollow(this.props.organization_we_vote_id, organization_follow_based_on_issue);
      this.props.on_organization_follow(this.props.organization_we_vote_id);
    }
  }

  onOrganizationStopFollowing () {
    this.setState({is_following: false});
    OrganizationActions.organizationStopFollowing(this.props.organization_we_vote_id);
    this.props.on_organization_stop_following(this.props.organization_we_vote_id);
  }

  render () {
    if (!this.state) { return <div />; }
    let { is_following } = this.state;

    return (
      <div className={this.props.grid + " intro-modal__square u-cursor--pointer"} onClick={ is_following ? this.onOrganizationStopFollowing : this.onOrganizationFollow }>
        <ImageHandler sizeClassName={ is_following ? "intro-modal__square-image intro-modal__square-following" : "intro-modal__square-image" }
                      imageUrl={this.props.organization_image_url}
                      kind_of_image="ORGANIZATION"
                      alt="organization-photo" />
        { is_following && <ImageHandler className="intro-modal__square-check-mark"
                      imageUrl={cordovaDot("/img/global/svg-icons/check-mark-v2-40x43.svg")}
                      alt="Following" /> }
        <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.organization_name}</h4>
        { this.props.organization_description && this.props.organization_description.length ?
          <OverlayTrigger placement="top" overlay={<Tooltip id="organizationDescriptionTooltip">{this.props.organization_description}</Tooltip>}>
            <i className="fa fa-info-circle fa-lg hidden-xs intro-modal__square-details" aria-hidden="true" />
          </OverlayTrigger> :
          null
        }
      </div>
    );
  }
}
