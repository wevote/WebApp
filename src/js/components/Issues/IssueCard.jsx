import React, { Component } from "react";
import PropTypes from "prop-types";
import ImageHandler from "../ImageHandler";
import IssueFollowToggleButton from "./IssueFollowToggleButton";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import ReadMore from "../Widgets/ReadMore";

export default class IssueCard extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    followToggleOn: PropTypes.bool,
    issue: PropTypes.object.isRequired,
    issueImageSize: PropTypes.string,
    turnOffDescription: PropTypes.bool,
    turnOffIssueImage: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string, // not being used within this component, check rest of codebase for how IssueCard is being called
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: "",
      followToggleOn: false,
      issueImageSize: "SMALL", // We support SMALL, MEDIUM, LARGE
      issue_we_vote_id: "",
    };
  }

  componentDidMount () {
    // console.log("IssueCard, componentDidMount, this.props:", this.props);
    if (this.props.issue && this.props.issue.issue_we_vote_id) {
      const imageSizes = new Set(["SMALL", "MEDIUM", "LARGE"]);
      let issueImageSize = "SMALL"; // Set the default
      if (imageSizes.has(this.props.issueImageSize)) {
        ({ issueImageSize } = this.props);
      }
      this.setState({
        ballotItemWeVoteId: this.props.ballotItemWeVoteId,
        followToggleOn: this.props.followToggleOn,
        issue: this.props.issue,
        issueImageSize,
        issue_we_vote_id: this.props.issue.issue_we_vote_id,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("IssueCard, componentWillReceiveProps, nextProps:", nextProps);
    if (nextProps.issue && nextProps.issue.issue_we_vote_id) {
      const imageSizes = new Set(["SMALL", "MEDIUM", "LARGE"]);
      let issueImageSize = "SMALL"; // Set the default
      if (imageSizes.has(nextProps.issueImageSize)) {
        ({ issueImageSize } = nextProps);
      }
      this.setState({
        ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
        followToggleOn: nextProps.followToggleOn,
        issue: nextProps.issue,
        issueImageSize,
        issue_we_vote_id: nextProps.issue.issue_we_vote_id,
      });
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.issue_we_vote_id.length) {
      return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    }

    let { issue_description: issueDescription, issue_name: issueDisplayName } = this.state.issue;

    issueDisplayName = issueDisplayName || "";
    issueDescription = issueDescription || "";

    let issueImage;
    let numberOfLines;
    if (this.state.issueImageSize === "SMALL") {
      issueImage = (
        <ImageHandler
          imageUrl={this.state.issue.issue_photo_url_tiny}
          className="card-main__org-avatar"
          kind_of_image="ISSUE"
          sizeClassName="icon-small "
        />
      );
      if (this.state.followToggleOn) {
        numberOfLines = 5; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 2;
      }
    } else if (this.state.issueImageSize === "MEDIUM") {
      issueImage = (
        <ImageHandler
          imageUrl={this.state.issue.issue_photo_url_medium}
          className="card-main__org-avatar"
          kind_of_image="ISSUE"
          sizeClassName="icon-medium "
        />
      );
      if (this.state.followToggleOn) {
        numberOfLines = 6; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 3;
      }
    } else if (this.state.issueImageSize === "LARGE") {
      issueImage = (
        <ImageHandler
          imageUrl={this.state.issue.issue_photo_url_large}
          className="card-main__org-avatar"
          kind_of_image="ISSUE"
          sizeClassName="icon-lg "
        />
      );
      if (this.state.followToggleOn) {
        numberOfLines = 7; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 4;
      }
    }


    return (
      <div className="card-main__media-object u-stack--md">
        <div className="card-main__media-object-anchor">
          {this.props.turnOffIssueImage ?
            null :
            issueImage
          }
          {this.props.followToggleOn && this.state.issue_we_vote_id ? (
            <div className="">
              <IssueFollowToggleButton
                ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                classNameOverride="pull-left"
                currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                issue_name={this.state.issue.issue_name}
                issue_we_vote_id={this.state.issue_we_vote_id}
                urlWithoutHash={this.props.urlWithoutHash}
              />
            </div>
          ) : null
          }
        </div>
        <div className="card-main__media-object-content">
          <h3 className="card-main__display-name">{issueDisplayName}</h3>

          { !this.props.turnOffDescription ?
            <span className="card-main__description"><ReadMore text_to_display={issueDescription} num_of_lines={numberOfLines} /></span> :
            <span className="card-main__description" />
          }
        </div>
      </div>
    );
  }
}
