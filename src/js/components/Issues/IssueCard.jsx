import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";
import IssueFollowToggleButton from "../../components/Issues/IssueFollowToggleButton";
import IssueStore from "../../stores/IssueStore";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationStore from "../../stores/OrganizationStore";
import ReadMore from "../../components/Widgets/ReadMore";

export default class IssueCard extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    followToggleOn: PropTypes.bool,
    issue: PropTypes.object.isRequired,
    issueImageSize: PropTypes.string,
    turnOffDescription: PropTypes.bool,
    turnOffIssueImage: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: "",
      followToggleOn: false,
      organization_position: {},
      organization_positions_requested: false,
      issueImageSize: "SMALL", // We support SMALL, MEDIUM, LARGE
      issue_we_vote_id: "",
    };
  }

  componentDidMount () {
    // console.log("IssueCard, componentDidMount, this.props:", this.props);
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    if (this.props.issue && this.props.issue.issue_we_vote_id) {
      const imageSizes = new Set(["SMALL", "MEDIUM", "LARGE"]);
      let issueImageSize = "SMALL"; // Set the default
      if (imageSizes.has(this.props.issueImageSize)) {
        issueImageSize = this.props.issueImageSize;
      }
      this.setState({
        ballotItemWeVoteId: this.props.ballotItemWeVoteId,
        followToggleOn: this.props.followToggleOn,
        issue: this.props.issue,
        issueImageSize: issueImageSize,
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
        issueImageSize = nextProps.issueImageSize;
      }
      this.setState({
        ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
        followToggleOn: nextProps.followToggleOn,
        issue: nextProps.issue,
        issueImageSize: issueImageSize,
        issue_we_vote_id: nextProps.issue.issue_we_vote_id,
      });
    }
  }

  onIssueStoreChange (){
  }

  onOrganizationStoreChange (){
  }

  componentWillUnmount (){
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  render () {
    // console.log("IssueCard, issue:", this.state.issue);
    if (!this.state.issue_we_vote_id.length){
      return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    }

    const {issue_description, issue_name} = this.state.issue;

    let issueDisplayName = issue_name ? issue_name : "";
    let issueDescription = issue_description ? issue_description : "";

    let issueImage;
    let numberOfLines;
    if (this.state.issueImageSize === "SMALL") {
      issueImage = <ImageHandler imageUrl={this.state.issue.issue_photo_url_tiny}
                                 className="card-main__org-avatar"
                                 kind_of_image="ISSUE"
                                 sizeClassName="icon-small "/>;
      if (this.state.followToggleOn) {
        numberOfLines = 5; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 2;
      }
    } else if (this.state.issueImageSize === "MEDIUM") {
      issueImage = <ImageHandler imageUrl={this.state.issue.issue_photo_url_medium}
                                 className="card-main__org-avatar"
                                 kind_of_image="ISSUE"
                                 sizeClassName="icon-medium "/>;
      if (this.state.followToggleOn) {
        numberOfLines = 6; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 3;
      }
    } else if (this.state.issueImageSize === "LARGE") {
      issueImage = <ImageHandler imageUrl={this.state.issue.issue_photo_url_large}
                                 className="card-main__org-avatar"
                                 kind_of_image="ISSUE"
                                 sizeClassName="icon-lg "/>;
      if (this.state.followToggleOn) {
        numberOfLines = 7; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 4;
      }
    }


    return <div className="card-main__media-object u-stack--md">
      <div className="card-main__media-object-anchor">
        {this.props.turnOffIssueImage ?
          null :
          issueImage
        }
        {this.props.followToggleOn && this.state.issue_we_vote_id ?
          <div className="">
            <IssueFollowToggleButton ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                     issue_name={this.state.issue.issue_name}
                                     issue_we_vote_id={this.state.issue_we_vote_id}
                                     classNameOverride="pull-left"
                                     />
          </div> :
          null}
      </div>
      <div className="card-main__media-object-content">
        <h3 className="card-main__display-name">{issueDisplayName}</h3>

        { !this.props.turnOffDescription ?
          <span className="card-main__description"><ReadMore text_to_display={issueDescription} num_of_lines={numberOfLines} /></span> :
          <span className="card-main__description" />
        }
      </div>
    </div>;
  }
}
