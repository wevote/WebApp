import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import IssueActions from "../actions/IssueActions";
import IssueFollowToggleSquare from "../components/Issues/IssueFollowToggleSquare";
import IssueStore from "../stores/IssueStore";
import SearchBar from "../components/Search/SearchBar";

var _ = require("lodash");


export default class IssuesFollowed extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      edit_mode: false,
      issues_followed: [],
      search_query: "",
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    IssueActions.issuesRetrieve();
    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    this.setState({
      issues_followed: IssueStore.getIssuesVoterIsFollowing(),
    });
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

  searchFunction (search_query) {
    this.setState({ search_query: search_query });
  }

  clearFunction () {
    this.searchFunction("");
  }

  render () {
    var issue_list = [];
    if (this.state.issues_followed) {
      issue_list = this.state.issues_followed;
    }

    if (this.state.search_query.length > 0) {
      const search_query_lowercase = this.state.search_query.toLowerCase();
      issue_list = _.filter(issue_list,
        function (one_issue) {
          return one_issue.issue_name.toLowerCase().includes(search_query_lowercase) ||
            one_issue.issue_description.toLowerCase().includes(search_query_lowercase);
        });
    }

    let is_following = true;
    const issue_list_for_display = issue_list.map((issue) => {
      return <IssueFollowToggleSquare
        key={issue.issue_we_vote_id}
        issue_we_vote_id={issue.issue_we_vote_id}
        issue_name={issue.issue_name}
        issue_description={issue.issue_description}
        issue_image_url={issue.issue_image_url}
        edit_mode={this.state.edit_mode}
        is_following={is_following}
        grid="col-4 col-sm-2"
        read_only
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
          <SearchBar clearButton
                     searchButton
                     placeholder="Search by name or Description"
                     searchFunction={this.searchFunction}
                     clearFunction={this.clearFunction}
                     searchUpdateDelayTime={0} />
          <br />
          <div className="network-issues-list voter-guide-list card">
            <div className="card-child__list-group">
              {
                issue_list.length ?
                  issue_list_for_display :
                  <h4 className="intro-modal__default-text">You are not following any issues yet.</h4>
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
