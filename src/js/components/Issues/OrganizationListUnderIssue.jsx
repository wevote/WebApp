import React, { Component } from "react";
import PropTypes from "prop-types";
import FollowToggle from "../Widgets/FollowToggle";
import ImageHandler from "../../components/ImageHandler";
import IssueStore from "../../stores/IssueStore";
import ReadMore from "../../components/Widgets/ReadMore";
import VoterGuideStore from "../../stores/VoterGuideStore";
import { removeTwitterNameFromDescription } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";

export default class OrganizationListUnderIssue extends Component {
  static propTypes = {
    currentBallotIdInUrl: PropTypes.string,
    issue_we_vote_id: PropTypes.string.isRequired,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      issue_we_vote_id: "",
      organizations_for_this_issue: [],
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    let voter_guides_for_this_issue = IssueStore.getVoterGuidesForOneIssue(this.props.issue_we_vote_id);
    // console.log("OrganizationListUnderIssue, componentDidMount, voter_guides_for_this_issue: ", voter_guides_for_this_issue);
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
    // console.log("OrganizationListUnderIssue, onIssueStoreChange, voter_guides_for_this_issue: ", voter_guides_for_this_issue);
    this.setState({
      voter_guides_for_this_issue: voter_guides_for_this_issue,
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    let voter_guides_for_this_issue = IssueStore.getVoterGuidesForOneIssue(this.state.issue_we_vote_id);
    // console.log("OrganizationListUnderIssue, onVoterGuideStoreChange, voter_guides_for_this_issue: ", voter_guides_for_this_issue);
    this.setState({
      voter_guides_for_this_issue: voter_guides_for_this_issue,
    });
  }

  render () {
    renderLog(__filename);
    // console.log("OrganizationListUnderIssue render, issue_we_vote_id: ", this.state.issue_we_vote_id, ", this.state.voter_guides_for_this_issue: ", this.state.voter_guides_for_this_issue);
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

    return <span className="guidelist card-child__list-group">
        {organizations_not_shown_display}
      </span>;
  }
}
