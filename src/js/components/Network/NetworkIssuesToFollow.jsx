import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import IssueActions from "../../actions/IssueActions";
import IssueFollowToggleSquare from "../Issues/IssueFollowToggleSquare";
import IssueStore from "../../stores/IssueStore";
import SearchBar from "../../components/Search/SearchBar";

var _ = require("lodash");

export default class NetworkIssuesToFollow extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      issues_to_follow: [],
      issues_followed: [],
      issue_we_vote_ids_followed: [],
      search_query: "",
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    IssueActions.retrieveIssuesToFollow();
    IssueActions.issuesRetrieve();
    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    this.setState({
      issues_to_follow: IssueStore.getIssuesVoterCanFollow(),
      issues_followed: IssueStore.getIssuesVoterIsFollowing(),
      issue_we_vote_ids_followed: IssueStore.getIssueWeVoteIdsVoterIsFollowing(),
    });
  }

  searchFunction (search_query) {
    this.setState({ search_query: search_query });
  }

  clearFunction () {
    this.searchFunction("");
  }

  render () {
    var issue_list = [];
    if (this.state.issues_to_follow) {
      issue_list = this.state.issues_to_follow;
    }

    if (this.state.search_query.length > 0) {
      const search_query_lowercase = this.state.search_query.toLowerCase();
      issue_list = issue_list.concat(this.state.issues_followed);
      issue_list = _.filter(issue_list,
      function (one_issue) {
        return one_issue.issue_name.toLowerCase().includes(search_query_lowercase) ||
          one_issue.issue_description.toLowerCase().includes(search_query_lowercase);
      });
    }

    let edit_mode = true;
    let is_following = false;
    const issue_list_for_display = issue_list.map((issue) => {
      return <IssueFollowToggleSquare
        key={issue.issue_we_vote_id}
        issue_we_vote_id={issue.issue_we_vote_id}
        issue_name={issue.issue_name}
        issue_description={issue.issue_description}
        issue_image_url={issue.issue_image_url}
        edit_mode={edit_mode}
        is_following={this.state.issue_we_vote_ids_followed.includes(issue.issue_we_vote_id) || is_following}
        grid="col-4 col-sm-3"
      />;
    });
    var floatRight = {
        float: "right"
    };

    return <div className="opinions-followed__container">
      <Helmet title="Issues to Follow - We Vote" />
      <section className="card">
        <div className="card-main">
          <p>
            Follow the issues you care about, so we can highlight the organizations that care about the same issues you do.
            <span style={floatRight}>
              <Link to="/issues_followed" className="u-margin-left--md u-no-break">See issues you follow</Link>
            </span>
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
                this.state.issues_to_follow && this.state.issues_to_follow.length ?
                  issue_list_for_display :
                  <h4 className="intro-modal__default-text">There are no more issues to follow!</h4>
              }
            </div>
          </div>
          <Link className="pull-left" to="/issues_followed">Issues you are following</Link>
          <br />
        </div>
      </section>
    </div>;
  }
}
