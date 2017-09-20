import React from "react";
import ImageHandler from "../ImageHandler";
import IssueFollowToggle from "./IssueFollowToggle";

export default class IssueFollowToggleSquare extends IssueFollowToggle {
  render () {
    if (!this.state) {
      return <div />;
    }
    let issue_image_url;
    if (this.props.issue_image_url) {
      issue_image_url = this.props.issue_image_url;
    } else {
      // let issue_name_base = this.props.issue_name.toLowerCase().replace(/[^a-z0-9_\']/g, "-").replace(/-+/g, "-");
      // issue_image_url = "/img/global/issues/" + issue_name_base + "-110x110.jpg";
    }

    if (this.props.read_only === true && !this.props.edit_mode){
      return <div className={this.props.grid + " intro-modal__square"}>
        <ImageHandler sizeClassName="intro-modal__square-image intro-modal__square-following"
                      imageUrl={ issue_image_url }
                      alt={this.props.issue_name}
                      kind_of_image="ISSUE-PHOTO" />
        <ImageHandler className="intro-modal__square-check-mark"
                      imageUrl="/img/global/svg-icons/check-mark-v2-40x43.svg"
                      alt="Following" />
        <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.issue_name}</h4>
      </div>;
    } else {
      return this.state.is_following ?
        <div className={this.props.grid + " intro-modal__square u-cursor--pointer"} onClick={this.onIssueStopFollowing}>
          <ImageHandler sizeClassName="intro-modal__square-image intro-modal__square-following"
                        imageUrl={ issue_image_url }
                        alt={this.props.issue_name}
                        kind_of_image="ISSUE-PHOTO" />
          <ImageHandler className="intro-modal__square-check-mark"
                        imageUrl="/img/global/svg-icons/check-mark-v2-40x43.svg"
                        alt="Following" />
          <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.issue_name}</h4>
        </div> :
        <div className={this.props.grid + " intro-modal__square u-cursor--pointer"} onClick={this.onIssueFollow}>
          <ImageHandler sizeClassName="intro-modal__square-image"
                        imageUrl={ issue_image_url }
                        alt={this.props.issue_name}
                        kind_of_image="ISSUE-PHOTO" />
          <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.issue_name}</h4>
        </div>
      ;
    }
  }
}
