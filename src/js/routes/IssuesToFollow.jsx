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
      issues_to_follow: []
    };
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
        issues_to_follow: IssueStore.toFollowList(),
    });
  }

  render () {
    var issue_list = [];
    if (this.state.issues_to_follow) {
      issue_list = this.state.issues_to_follow;
    }
    let edit_mode = true;
    let is_following = false;
    const issue_list_for_display = issue_list.map((issue) => {
      return <IssueFollowToggle
        key={issue.issue_we_vote_id}
        issue_we_vote_id={issue.issue_we_vote_id}
        issue_name={issue.issue_name}
        issue_description={issue.issue_description}
        issue_image_url={issue.issue_photo_url_medium}
        edit_mode={edit_mode}
        is_following={is_following}
      />;
    });

    return <div className="opinions-followed__container">
      <Helmet title="Issues You Follow - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h1">Issues You Can Follow</h1>
          <p>
            Follow all of the issues that you care about, so we can recommend organizations that you might want
            to learn from. Most organizations focus on certain issues, and by choosing the issues that matter most to
            you, we are able to highlight the organizations that care about the same issues that you do.
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
          <Link className="pull-left" to="/issues_followed">Issues you are following</Link>
          <br />
        </div>
      </section>
    </div>;
  }
}
