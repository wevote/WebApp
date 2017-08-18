import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import IssueActions from "../../actions/IssueActions";
import IssueLinkToggle from "../Issues/IssueLinkToggle";
import IssueStore from "../../stores/IssueStore";

export default class VoterGuideEditIssues extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      active_tab: "",
      issue_list: [],
    };
  }

  componentDidMount () {
    IssueActions.retrieveIssuesForOrganization(this.props.organization_we_vote_id);
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));

    let active_tab = "issues_to_link";
    // This check is necessary because, for the first time the active_tab is undefined
    // and it needs to be set to a default
    if (this.props.params.active_tab) {
      active_tab = this.props.params.active_tab;
    }
    this.setState({
      active_tab: active_tab,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      active_tab: nextProps.params.active_tab || "issues_to_link",
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      issue_list: IssueStore.toFollowListForOrganization(),
    });
  }

  render () {
    let issues_to_display;

    let active_tab = this.props.params.active_tab || this.state.active_tab;
    let issues_to_link_url = "/voterguideedit/" + this.props.organization_we_vote_id + "/issues/issues_to_link";
    let issues_linked_url = "/voterguideedit/" + this.props.organization_we_vote_id + "/issues/issues_linked";
    const is_linked_false = false;
    const is_linked_true = true;
    switch (active_tab) {
      default:
      case "issues_to_link":
        issues_to_display = this.state.issue_list.map((issue) => {
          return <IssueLinkToggle
            key={issue.issue_we_vote_id}
            issue={issue}
            organization_we_vote_id={this.props.organization_we_vote_id}
            is_linked={is_linked_false}
          />;
        });
        break;
      case "issues_linked":
        // To be completed
        issues_to_display = null;
        break;
    }

    return <div className="row">
      <div className="col-sm-12 col-md-8">
        <div className="network__network-tabs-container">
          <div className="network__network-tabs hidden-print">
            <ul className="nav network__tabs">
              <li className="tab-item">
                <Link to={issues_to_link_url} className={active_tab === "issues_to_link" ? "tab tab-active" : "tab tab-default"}>
                  <span>Find Issues</span>
                </Link>
              </li>

              <li className="tab-item">
                <Link to={issues_linked_url} className={active_tab === "issues_linked" ? "tab tab-active" : "tab tab-default"}>
                  <span>Your Issues</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {issues_to_display}
      </div>
    </div>;
  }
}
