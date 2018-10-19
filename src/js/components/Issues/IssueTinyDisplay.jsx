import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { isCordova } from "../../utils/cordovaUtils";
import FollowToggle from "../Widgets/FollowToggle";
import ImageHandler from "../../components/ImageHandler";
import IssueCard from "./IssueCard";
import IssueImageDisplay from "./IssueImageDisplay";
import IssueStore from "../../stores/IssueStore";
import ReadMore from "../../components/Widgets/ReadMore";
import VoterGuideStore from "../../stores/VoterGuideStore";
import { removeTwitterNameFromDescription } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";

export default class IssueTinyDisplay extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    issue: PropTypes.object,
    issueImageSize: PropTypes.string,
    issue_we_vote_id: PropTypes.string.isRequired,
    overlayTriggerOnClickOnly: PropTypes.bool,
    popoverBottom: PropTypes.bool,
    toFollow: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.popover_state = {};
    this.state = {
      issue_we_vote_id: "",
      organizations_for_this_issue: [],
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    let voter_guides_for_this_issue = IssueStore.getVoterGuidesForOneIssue(this.props.issue_we_vote_id);
    // console.log("IssueTinyDisplay, componentDidMount, voter_guides_for_this_issue: ", voter_guides_for_this_issue);
    this.setState({
      issue_we_vote_id: this.props.issue_we_vote_id,
      voter_guides_for_this_issue: voter_guides_for_this_issue,
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    let voter_guides_for_this_issue = IssueStore.getVoterGuidesForOneIssue(this.state.issue_we_vote_id);
    // console.log("IssueTinyDisplay, onIssueStoreChange, voter_guides_for_this_issue: ", voter_guides_for_this_issue);
    this.setState({
      voter_guides_for_this_issue: voter_guides_for_this_issue,
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    let voter_guides_for_this_issue = IssueStore.getVoterGuidesForOneIssue(this.state.issue_we_vote_id);
    // console.log("IssueTinyDisplay, onVoterGuideStoreChange, voter_guides_for_this_issue: ", voter_guides_for_this_issue);
    this.setState({
      voter_guides_for_this_issue: voter_guides_for_this_issue,
    });
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
    // console.log("IssueTinyDisplay render, issue_we_vote_id: ", this.state.issue_we_vote_id, ", this.state.voter_guides_for_this_issue: ", this.state.voter_guides_for_this_issue);
    if (!this.state.voter_guides_for_this_issue || !this.state.voter_guides_for_this_issue.length){
      return null;
    }

    const organizations_not_shown_display = this.state.voter_guides_for_this_issue.map( (one_voter_guide) => {
      // console.log("one_voter_guide: ", one_voter_guide);
      let organization_we_vote_id = one_voter_guide.organization_we_vote_id;
      let organization_name = one_voter_guide.voter_guide_display_name;
      let organization_photo_url_tiny = one_voter_guide.voter_guide_image_url_tiny;

      let num_of_lines = 2;
      let twitterDescription = one_voter_guide.twitter_description ? one_voter_guide.twitter_description : "";
      // If the organization_name is in the twitter_description, remove it
      let twitterDescriptionMinusName = removeTwitterNameFromDescription(organization_name, twitterDescription);

      // If the displayName is in the twitterDescription, remove it from twitterDescription
      let organizationDisplayName = organization_name ? organization_name : "";
      return <div key={organization_we_vote_id} className="card-main__media-object u-stack--md">
        <div className="card-main__media-object-anchor">
          <ImageHandler imageUrl={organization_photo_url_tiny}
                        className=""
                        sizeClassName="organization__image--tiny"/>
        </div>
        &nbsp;&nbsp;
        <div className="card-main__media-object-content">
          <h3 className="card-main__display-name">{organizationDisplayName}</h3>
          { twitterDescriptionMinusName ? <ReadMore text_to_display={twitterDescriptionMinusName} num_of_lines={num_of_lines} /> :
            null}
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            <FollowToggle currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                          office_we_vote_id={this.props.we_vote_id}
                          we_vote_id={organization_we_vote_id}
                          urlWithoutHash={this.props.urlWithoutHash}
             />
          </div>
        </div>
      </div>;
    });

    this.popover_state[this.props.issue_we_vote_id] = { show: false, timer: null };

    // Removed bsPrefix="card-popover"
    let issuePopover = <Popover id={`issue-popover-${this.props.issue_we_vote_id}`}
                                onMouseOver={() => this.onTriggerEnter(this.props.issue_we_vote_id)}
                                onMouseOut={() => this.onTriggerLeave(this.props.issue_we_vote_id)}
                                title={<span onClick={() => this.onTriggerLeave(this.props.issue_we_vote_id)}> &nbsp;
                                  <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" /> </span>}
                                >
        <IssueCard ballotItemWeVoteId={this.props.ballotItemWeVoteId}
                   currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                   followToggleOn={this.props.toFollow}
                   issue={this.props.issue}
                   issueImageSize={"MEDIUM"}
                   urlWithoutHash={this.props.urlWithoutHash}
                   we_vote_id={this.props.we_vote_id}
        />
        <span className="guidelist card-child__list-group">
          {organizations_not_shown_display}
        </span>
      </Popover>;

    // onClick={(e) => this.onTriggerToggle(e, this.props.issue_we_vote_id)}

    // onMouseOver={() => this.onTriggerEnter(this.props.issue_we_vote_id)}
    // onMouseOut={() => this.onTriggerLeave(this.props.issue_we_vote_id)}
    // onExiting={() => this.onTriggerLeave(this.props.issue_we_vote_id)}
    // trigger={this.props.overlayTriggerOnClickOnly ? "click" : ["focus", "hover", "click"]}
    return <OverlayTrigger ref={`issue-overlay-${this.props.issue_we_vote_id}`}
                           rootClose
                           placement={this.props.popoverBottom ? "bottom" : "top"}
                           trigger="click"
                           overlay={issuePopover}
            >
      <span className="">
        <IssueImageDisplay issue={this.props.issue}
                           issueImageSize={this.props.issueImageSize}
                           showPlaceholderImage
                           isVoterFollowingThisIssue={IssueStore.isVoterFollowingThisIssue(this.props.issue_we_vote_id)} />
      </span>
    </OverlayTrigger>;
  }
}
