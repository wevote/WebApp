import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { _ } from "lodash";
import Helmet from "react-helmet";
import IssueActions from "../actions/IssueActions";
import IssueFollowToggleSquare from "../components/Issues/IssueFollowToggleSquare";
import IssueStore from "../stores/IssueStore";
import { renderLog } from "../utils/logging";
import SearchBar from "../components/Search/SearchBar";

export default class IssuesToFollow extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      issues_to_follow: [],
      search_query: "",
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    IssueActions.retrieveIssuesToFollow();
    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    this.setState({
      issues_to_follow: IssueStore.getIssuesVoterCanFollow(),
    });
  }

  searchFunction (search_query) {
    this.setState({ search_query });
  }

  clearFunction () {
    this.searchFunction("");
  }

  render () {
    renderLog(__filename);
    let issue_list = [];
    if (this.state.issues_to_follow) {
      issue_list = this.state.issues_to_follow;
    }

    if (this.state.search_query.length > 0) {
      const search_query_lowercase = this.state.search_query.toLowerCase();
      issue_list = _.filter(issue_list,
        one_issue => one_issue.issue_name.toLowerCase().includes(search_query_lowercase) ||
            one_issue.issue_description.toLowerCase().includes(search_query_lowercase));
    }

    const edit_mode = true;
    const is_following = false;
    const issue_list_for_display = issue_list.map(issue => (
      <IssueFollowToggleSquare
        key={issue.issue_we_vote_id}
        issue_we_vote_id={issue.issue_we_vote_id}
        issue_name={issue.issue_name}
        issue_description={issue.issue_description}
        issue_image_url={issue.issue_image_url}
        edit_mode={edit_mode}
        is_following={is_following}
        grid="col-4 col-sm-2"
      />
    ));

    return (
      <div className="opinions-followed__container">
        <Helmet title="Issues You Follow - We Vote" />
        <section className="card">
          <div className="card-main">
            <h1 className="h1">Issues You Can Follow</h1>
            <p>
              Follow the issues you care about, so we can highlight the organizations that care about the same issues you do.
            </p>
            <SearchBar
              clearButton
              searchButton
              placeholder="Search by name or Description"
              searchFunction={this.searchFunction}
              clearFunction={this.clearFunction}
              searchUpdateDelayTime={0}
            />
            <br />
            <div className="network-issues-list voter-guide-list card">
              { this.state.issues_to_follow && this.state.issues_to_follow.length ?
                issue_list_for_display :
                null
              }
            </div>
            <Link className="pull-left" to="/issues_followed">Issues you are following</Link>
            <br />
          </div>
        </section>
      </div>
    );
  }
}
