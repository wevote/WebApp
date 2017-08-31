import React from "react";
import ImageHandler from "../ImageHandler";
import IssueFollowToggle from "./IssueFollowToggle";

export default class IssueFollowToggleSquare extends IssueFollowToggle {
  render () {
    if (!this.state) { return <div />; }

    let issue_name_base = this.props.issue_name.toLowerCase().replace(/ /g, "-");

    return (
      <div className="col-4 col-sm-3 intro-modal__issue-square" onClick={ this.state.is_following ? this.onIssueStopFollowing : this.onIssueFollow }>
        <ImageHandler sizeClassName="intro-modal__issue-square-image u-cursor--pointer"
                      imageUrl={ "/img/global/issues/" + issue_name_base + "-110x110.jpg" }
                      alt={this.props.issue_name}
                      kind_of_image="ISSUE-PHOTO" />
        { this.state.is_following ?
          <ImageHandler className="intro-modal__issue-square-following"
                        imageUrl="/img/global/svg-icons/check-mark-v2-40x43.svg"
                        alt="Following" /> :
          null
        }
        <h4 className="intro-modal__white-space intro-modal__issue-square-name">{this.props.issue_name}</h4>
      </div>
    );
  }
}
