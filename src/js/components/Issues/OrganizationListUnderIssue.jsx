import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import IssueStore from "../../stores/IssueStore";
import VoterGuideStore from "../../stores/VoterGuideStore";

export default class OrganizationListUnderIssue extends Component {
  static propTypes = {
    issue_we_vote_id: PropTypes.string.isRequired,
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
    this.setState({
      issue_we_vote_id: this.props.issue_we_vote_id,
      organizations_for_this_issue: IssueStore.getVoterGuidesForOneIssue(this.props.issue_we_vote_id),
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      voter_guides_for_this_issue: IssueStore.getVoterGuidesForOneIssue(this.state.issue_we_vote_id),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState({
      voter_guides_for_this_issue: IssueStore.getVoterGuidesForOneIssue(this.state.issue_we_vote_id),
    });
  }

  render () {
    // console.log("OrganizationListUnderIssue render, issue_we_vote_id: ", this.state.issue_we_vote_id, ", this.state.voter_guides_for_this_issue: ", this.state.voter_guides_for_this_issue);
    if (!this.state.voter_guides_for_this_issue || !this.state.voter_guides_for_this_issue.length){
      return null;
    }

    const organizations_not_shown_display = this.state.voter_guides_for_this_issue.map( (one_voter_guide) => {
      console.log("one_voter_guide: ", one_voter_guide);
      let organization_we_vote_id = one_voter_guide.organization_we_vote_id;
      let organization_name = one_voter_guide.voter_guide_display_name;
      let organization_photo_url_tiny = one_voter_guide.voter_guide_image_url_tiny;
      let organization_twitter_handle = one_voter_guide.twitter_handle;

      // If the displayName is in the twitterDescription, remove it from twitterDescription
      let displayName = organization_name ? organization_name : "";
      var voterGuideLink = organization_twitter_handle ? "/" + organization_twitter_handle : "/voterguide/" + organization_we_vote_id;
      return <div key={organization_we_vote_id} className="card-main__media-object">
        <div className="card-main__media-object-anchor">
          <Link to={voterGuideLink} className="u-no-underline">
            <ImageHandler imageUrl={organization_photo_url_tiny}
              className=""
              sizeClassName="organization__image--tiny"/>
          </Link>
          <br/>
        </div>
        &nbsp;&nbsp;
        <div className="card-main__media-object-content">
          <Link to={voterGuideLink}>
            <h3 className="card-main__display-name">{displayName}</h3>
          </Link>
        </div>
      </div>;
    });

    return <span className="guidelist card-child__list-group">
        {organizations_not_shown_display}
      </span>;
  }
}
