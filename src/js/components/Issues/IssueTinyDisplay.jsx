import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { isCordova } from "../../utils/cordovaUtils";
import FollowToggle from "../Widgets/FollowToggle";
import ImageHandler from "../ImageHandler";
import IssueCard from "./IssueCard";
import IssueImageDisplay from "./IssueImageDisplay";
import IssueStore from "../../stores/IssueStore";
import ReadMore from "../Widgets/ReadMore";
import VoterGuideStore from "../../stores/VoterGuideStore";
import { removeTwitterNameFromDescription } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";

export default class IssueTinyDisplay extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    issue: PropTypes.object,
    issueImageSize: PropTypes.string,
    issueWeVoteId: PropTypes.string.isRequired,
    // overlayTriggerOnClickOnly: PropTypes.bool, // unused
    popoverBottom: PropTypes.bool,
    toFollow: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.popover_state = {};
    this.state = {
      issueWeVoteId: "",
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const voterGuidesForThisIssue = IssueStore.getVoterGuidesForOneIssue(this.props.issueWeVoteId);
    // console.log("IssueTinyDisplay, componentDidMount, voterGuidesForThisIssue: ", voterGuidesForThisIssue);
    this.setState({
      issueWeVoteId: this.props.issueWeVoteId,
      voterGuidesForThisIssue,
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    // console.log("IssueTinyDisplay, onIssueStoreChange, voterGuidesForThisIssue: ", voterGuidesForThisIssue);
    this.setState(prevState => ({ voterGuidesForThisIssue: IssueStore.getVoterGuidesForOneIssue(prevState.issueWeVoteId) }));
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    // console.log("IssueTinyDisplay, onVoterGuideStoreChange, voterGuidesForThisIssue: ", voterGuidesForThisIssue);
    this.setState(prevState => ({ voterGuidesForThisIssue: IssueStore.getVoterGuidesForOneIssue(prevState.issueWeVoteId) }));
  }

  onTriggerEnter (issueWeVoteId) {
    if (this.refs[`issue-overlay-${issueWeVoteId}`]) {
      this.refs[`issue-overlay-${issueWeVoteId}`].show();
    }

    if (!this.popover_state[issueWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[issueWeVoteId] = { show: false, timer: null };
    }

    clearTimeout(this.popover_state[issueWeVoteId].timer);
    if (!this.popover_state[issueWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[issueWeVoteId] = { show: false, timer: null };
    }

    this.popover_state[issueWeVoteId].show = true;
  }

  onTriggerLeave (issueWeVoteId) {
    if (!this.popover_state[issueWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[issueWeVoteId] = { show: false, timer: null };
    }

    this.popover_state[issueWeVoteId].show = false;
    clearTimeout(this.popover_state[issueWeVoteId].timer);
    this.popover_state[issueWeVoteId].timer = setTimeout(() => {
      if (!this.popover_state[issueWeVoteId].show) {
        if (this.refs[`issue-overlay-${issueWeVoteId}`]) {
          this.refs[`issue-overlay-${issueWeVoteId}`].hide();
        }
      }
    }, 100);
  }

  onTriggerToggle (e, issueWeVoteId) {
    if (this.mobile) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.popover_state[issueWeVoteId]) {
        // If it wasn't created, create it now
        this.popover_state[issueWeVoteId] = { show: false, timer: null };
      }

      if (this.popover_state[issueWeVoteId].show) {
        this.onTriggerLeave(issueWeVoteId);
      } else {
        this.onTriggerEnter(issueWeVoteId);
      }
    }
  }

  render () {
    // console.log("IssueTinyDisplay");
    renderLog(__filename);
    // console.log("IssueTinyDisplay render, issueWeVoteId: ", this.state.issueWeVoteId, ", this.state.voterGuidesForThisIssue: ", this.state.voterGuidesForThisIssue);
    if (!this.state.voterGuidesForThisIssue || !this.state.voterGuidesForThisIssue.length) {
      return null;
    }

    const organizationsNotShownDisplay = this.state.voterGuidesForThisIssue.map((oneVoterGuide) => {
      // console.log("oneVoterGuide: ", oneVoterGuide);
      const organizationWeVoteId = oneVoterGuide.organization_we_vote_id;
      const organizationName = oneVoterGuide.voter_guide_display_name;
      const organizationPhotoURLTiny = oneVoterGuide.voter_guide_image_url_tiny;

      const numOfLines = 2;
      const twitterDescription = oneVoterGuide.twitter_description ? oneVoterGuide.twitter_description : "";
      // If the organizationName is in the twitter_description, remove it
      const twitterDescriptionMinusName = removeTwitterNameFromDescription(organizationName, twitterDescription);

      // If the displayName is in the twitterDescription, remove it from twitterDescription
      const organizationDisplayName = organizationName || "";
      return (
        <div key={organizationWeVoteId} className="card-main__media-object u-stack--md">
          <div className="card-main__media-object-anchor">
            <ImageHandler
              imageUrl={organizationPhotoURLTiny}
              className=""
              sizeClassName="organization__image--tiny"
            />
          </div>
          &nbsp;&nbsp;
          <div className="card-main__media-object-content">
            <h3 className="card-main__display-name">{organizationDisplayName}</h3>
            { twitterDescriptionMinusName ? <ReadMore text_to_display={twitterDescriptionMinusName} num_of_lines={numOfLines} /> :
              null}
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              <FollowToggle
                currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                ballotItemWeVoteId={this.props.ballotItemWeVoteId}
                organizationWeVoteId={organizationWeVoteId}
                urlWithoutHash={this.props.urlWithoutHash}
              />
            </div>
          </div>
        </div>
      );
    });

    this.popover_state[this.props.issueWeVoteId] = { show: false, timer: null };

    // Removed bsPrefix="card-popover"
    const issuePopover = (
      <Popover
        id={`issue-popover-${this.props.issueWeVoteId}`}
        onFocus={() => this.onTriggerEnter(this.props.issueWeVoteId)}
        onMouseOver={() => this.onTriggerEnter(this.props.issueWeVoteId)}
        onBlur={() => this.onTriggerLeave(this.props.issueWeVoteId)}
        onMouseOut={() => this.onTriggerLeave(this.props.issueWeVoteId)}
        title={(
          <span onClick={() => this.onTriggerLeave(this.props.issueWeVoteId)}>
            &nbsp;
            <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" />
          </span>
        )}
      >
        <IssueCard
          ballotItemWeVoteId={this.props.ballotItemWeVoteId}
          currentBallotIdInUrl={this.props.currentBallotIdInUrl}
          followToggleOn={this.props.toFollow}
          issue={this.props.issue}
          issueImageSize="MEDIUM"
          urlWithoutHash={this.props.urlWithoutHash}
        />
        <span className="guidelist card-child__list-group">
          {organizationsNotShownDisplay}
        </span>
      </Popover>
    );

    // onClick={(e) => this.onTriggerToggle(e, this.props.issueWeVoteId)}

    // onMouseOver={() => this.onTriggerEnter(this.props.issueWeVoteId)}
    // onMouseOut={() => this.onTriggerLeave(this.props.issueWeVoteId)}
    // onExiting={() => this.onTriggerLeave(this.props.issueWeVoteId)}
    // trigger={this.props.overlayTriggerOnClickOnly ? "click" : ["focus", "hover", "click"]}
    return (
      <OverlayTrigger
        ref={`issue-overlay-${this.props.issueWeVoteId}`}
        rootClose
        placement={this.props.popoverBottom ? "bottom" : "top"}
        trigger="click"
        overlay={issuePopover}
      >
        <span className="">
          <IssueImageDisplay
            issue={this.props.issue}
            issueImageSize={this.props.issueImageSize}
            showPlaceholderImage
            isVoterFollowingThisIssue={IssueStore.isVoterFollowingThisIssue(this.props.issueWeVoteId)}
          />
        </span>
      </OverlayTrigger>
    );
  }
}
