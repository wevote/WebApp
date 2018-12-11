import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { cordovaDot } from "../../utils/cordovaUtils";
import ImageHandler from "../ImageHandler";
import IssueActions from "../../actions/IssueActions";
import { showToastError, showToastSuccess } from "../../utils/showToast";
import { renderLog } from "../../utils/logging";

export default class IssueFollowToggleSquare extends Component {
  static propTypes = {
    edit_mode: PropTypes.bool,
    grid: PropTypes.string,
    is_following: PropTypes.bool,
    issue_we_vote_id: PropTypes.string.isRequired,
    issue_name: PropTypes.string.isRequired,
    issue_description: PropTypes.string,
    issue_image_url: PropTypes.string,
    on_issue_follow: PropTypes.func,
    on_issue_stop_following: PropTypes.func,
    read_only: PropTypes.bool,
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
    this.onIssueFollow = this.onIssueFollow.bind(this);
    this.onIssueStopFollowing = this.onIssueStopFollowing.bind(this);
  }

  onIssueFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({ is_following: true });
      IssueActions.issueFollow(this.props.issue_we_vote_id);
      if (this.props.on_issue_follow) {
        this.props.on_issue_follow(this.props.issue_we_vote_id);
      }
      showToastSuccess(`Now following ${this.props.issue_name}!`);
    }
  }

  onIssueStopFollowing () {
    this.setState({ is_following: false });
    IssueActions.issueStopFollowing(this.props.issue_we_vote_id);
    if (this.props.on_issue_stop_following) {
      this.props.on_issue_stop_following(this.props.issue_we_vote_id);
    }
    showToastError(`You've stopped following ${this.props.issue_name}.`);
  }

  render () {
    renderLog(__filename);
    if (!this.state) {
      return <div />;
    }
    let issue_image_url;
    if (this.props.issue_image_url) {
      // This is where we can turn off issue images
      issue_image_url = this.props.issue_image_url;
    } else {
      // let issue_name_base = this.props.issue_name.toLowerCase().replace(/[^a-z0-9_\']/g, "-").replace(/-+/g, "-");
      // issue_image_url = "/img/global/issues/" + issue_name_base + "-110x110.jpg";
    }

    if (this.props.read_only === true && !this.props.edit_mode) {
      return (
        <div className={`${this.props.grid} intro-modal__square`}>
          <ImageHandler
            sizeClassName="intro-modal__square-image intro-modal__square-following"
            imageUrl={issue_image_url}
            alt={this.props.issue_name}
            kind_of_image="ISSUE-PHOTO"
          />
          <ImageHandler
            className="intro-modal__square-check-mark"
            imageUrl={cordovaDot("/img/global/svg-icons/check-mark-v2-40x43.svg")}
            alt="Following"
          />
          <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.issue_name}</h4>
          { this.props.issue_description && this.props.issue_description.length ? (
            <OverlayTrigger placement="top" overlay={<Tooltip id="organizationDescriptionTooltip">{this.props.issue_description}</Tooltip>}>
              <i className="fa fa-info-circle fa-lg d-none d-sm-block intro-modal__square-details" aria-hidden="true" />
            </OverlayTrigger>
          ) : null
          }
        </div>
      );
    } else {
      return this.state.is_following ? (
        <div className={`${this.props.grid} intro-modal__square u-cursor--pointer`} onClick={this.onIssueStopFollowing}>
          <ImageHandler
            sizeClassName="intro-modal__square-image intro-modal__square-following image-issue-photo-placeholder"
            imageUrl={issue_image_url}
            alt={this.props.issue_name}
            kind_of_image="ISSUE-PHOTO"
          />
          <ImageHandler
            className="intro-modal__square-check-mark"
            imageUrl={cordovaDot("/img/global/svg-icons/check-mark-v2-40x43.svg")}
            alt="Following"
          />
          <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.issue_name}</h4>
          { this.props.issue_description && this.props.issue_description.length ? (
            <OverlayTrigger placement="top" overlay={<Tooltip id="organizationDescriptionTooltip">{this.props.issue_description}</Tooltip>}>
              <i className="fa fa-info-circle fa-lg d-none d-sm-block intro-modal__square-details" aria-hidden="true" />
            </OverlayTrigger>
          ) : null
          }
        </div>
      ) : (
        <div className={`${this.props.grid} intro-modal__square u-cursor--pointer`} onClick={this.onIssueFollow}>
          <ImageHandler
            sizeClassName="intro-modal__square-image image-issue-photo-placeholder"
            imageUrl={issue_image_url}
            alt={this.props.issue_name}
            kind_of_image="ISSUE-PHOTO"
          />
          <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.issue_name}</h4>
          { this.props.issue_description && this.props.issue_description.length ? (
            <OverlayTrigger placement="top" overlay={<Tooltip id="organizationDescriptionTooltip">{this.props.issue_description}</Tooltip>}>
              <i className="fa fa-info-circle fa-lg d-none d-sm-block intro-modal__square-details" aria-hidden="true" />
            </OverlayTrigger>
          ) : null
          }
        </div>
      );
    }
  }
}
