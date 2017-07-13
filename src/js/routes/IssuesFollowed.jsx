import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import IssueActions from "../actions/IssueActions";
import IssueFollowToggle from "../components/Ballot/IssueFollowToggle";
import IssueStore from "../stores/IssueStore";


export default class IssuesFollowed extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      edit_mode: false,
      issues_to_follow: []
    };
  }

  componentDidMount () {
    IssueActions.retrieveIssuesForVoter();
    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    let issue_list = IssueStore.followingList();
    if (issue_list.length > 0) {
      this.setState({
        issues_to_follow: IssueStore.followingList(),
      });
    }
  }

  getCurrentRoute () {
    var current_route = "/issues_followed";
    return current_route;
  }

  toggleEditMode () {
    this.setState({edit_mode: !this.state.edit_mode});
  }

  onKeyDownEditMode (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({edit_mode: !this.state.edit_mode});
    }
  }

  render () {
    var issue_list = [];
    if (this.state.issues_to_follow) {
      issue_list = this.state.issues_to_follow;
    }

    const issue_list_for_display = issue_list.map((issue) => {
      return <IssueFollowToggle
        key={issue.issue_we_vote_id}
        issue_we_vote_id={issue.issue_we_vote_id}
        issue_name={issue.issue_name}
        issue_description={issue.issue_description}
        issue_image_url={issue.issue_photo_url_medium}
        edit_mode={this.state.edit_mode}
      />;
    });

    return <div className="opinions-followed__container">
      <Helmet title="Issues You Follow - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h1">Issues You Are Following</h1>
          <a className="fa-pull-right"
             tabIndex="0"
             onKeyDown={this.onKeyDownEditMode.bind(this)}
             onClick={this.toggleEditMode.bind(this)}>{this.state.edit_mode ? "Done Editing" : "Edit"}</a>
            <p>
              These are the issues you currently follow. We recommend organizations that you might want to learn from 
              based on these issues.
            </p>
          <div className="voter-guide-list card">
            <div className="card-child__list-group">
              {
                this.state.issues_to_follow && this.state.issues_to_follow.length ?
                  issue_list_for_display :
                  null
              }
            </div>
          </div>
          <Link className="pull-left" to="/issues_to_follow">Find Issues to follow</Link>
          <br />
        </div>
      </section>
    </div>;
  }
}
