import React, { Component } from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import { cordovaDot } from "../../utils/cordovaUtils";
import ImageHandler from "../ImageHandler";
import OrganizationActions from "../../actions/OrganizationActions";
import { showToastError, showToastSuccess } from "../../utils/showToast";
import { renderLog } from "../../utils/logging";

export default class OrganizationFollowToggle extends Component {
  static propTypes = {
    is_following: PropTypes.bool,
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

    let is_following = false;
    if (this.props.is_following) {
      is_following = this.props.is_following;
    }
    this.state = {
      is_following,
    };
    this.onOrganizationFollow = this.onOrganizationFollow.bind(this);
    this.onOrganizationStopFollowing = this.onOrganizationStopFollowing.bind(this);
  }

  componentDidMount () {
  }

  onOrganizationFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({ is_following: true });
      const organization_follow_based_on_issue = true;
      OrganizationActions.organizationFollow(this.props.organization_we_vote_id, organization_follow_based_on_issue);
      if (this.props.on_organization_follow) {
        this.props.on_organization_follow(this.props.organization_we_vote_id);
      }
      showToastSuccess(`Now following ${this.props.organization_name}!`);
    }
  }

  onOrganizationStopFollowing () {
    this.setState({ is_following: false });
    OrganizationActions.organizationStopFollowing(this.props.organization_we_vote_id);
    if (this.props.on_organization_stop_following) {
      this.props.on_organization_stop_following(this.props.organization_we_vote_id);
    }
    showToastError(`You've stopped following ${this.props.organization_name}.`);
  }

  render () {
    renderLog(__filename);
    if (!this.state) { return <div />; }
    const { is_following } = this.state;

    return (
      <div className={`${this.props.grid} intro-modal__square u-cursor--pointer`} onClick={is_following ? this.onOrganizationStopFollowing : this.onOrganizationFollow}>
        <ImageHandler
          sizeClassName={is_following ? "intro-modal__square-image intro-modal__square-following" : "intro-modal__square-image"}
          imageUrl={this.props.organization_image_url}
          kind_of_image="ORGANIZATION"
          alt="organization-photo"
        />
        { is_following && (
        <ImageHandler
          className="intro-modal__square-check-mark"
          imageUrl={cordovaDot("/img/global/svg-icons/check-mark-v2-40x43.svg")}
          alt="Following"
        />
        ) }
        <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.organization_name}</h4>
        { this.props.organization_description && this.props.organization_description.length ? (
          <Tooltip id="organizationDescriptionTooltip" title={this.props.organization_description}>
            <i className="fa fa-info-circle fa-lg d-none d-sm-block intro-modal__square-details" aria-hidden="true" />
          </Tooltip>
        ) :
          null
        }
      </div>
    );
  }
}
