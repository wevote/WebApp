import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import { historyPush } from "../../utils/cordovaUtils";
import IssueActions from "../../actions/IssueActions";
import IssueLinkToggle from "../Issues/IssueLinkToggle";
import IssueStore from "../../stores/IssueStore";
import { renderLog } from "../../utils/logging";

export default class SettingsIssueLinks extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      active_tab: "",
      issues_to_link_to: [],
      issues_linked_to: [],
    };

    this.onDoneButton = this.onDoneButton.bind(this);
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    IssueActions.retrieveIssuesToLinkForOrganization(this.props.organization_we_vote_id);
    IssueActions.retrieveIssuesLinkedForOrganization(this.props.organization_we_vote_id);

    let default_active_tab = this.getDefaultActiveIssueTab();
    let active_tab = this.props.params.active_tab || default_active_tab;
    this.setState({
      active_tab: active_tab,
    });
  }

  componentWillReceiveProps (nextProps) {
    let default_active_tab = this.getDefaultActiveIssueTab();
    let active_tab = nextProps.params.active_tab || default_active_tab;
    // console.log("SettingsIssueLinks, nextProps.organization_we_vote_id: ", nextProps.organization_we_vote_id);
    // console.log("SettingsIssueLinks, active_tab: ", active_tab, "default_active_tab: ", default_active_tab);
    this.setState({
      active_tab: active_tab,
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    // console.log("onIssueStoreChange, this.props.organization_we_vote_id: ", this.props.organization_we_vote_id);
    // console.log("getIssuesToLinkToByOrganization: ", IssueStore.getIssuesToLinkToByOrganization(this.props.organization_we_vote_id));
    // console.log("getIssuesLinkedToByOrganization: ", IssueStore.getIssuesLinkedToByOrganization(this.props.organization_we_vote_id));
    this.setState({
      issues_to_link_to: IssueStore.getIssuesToLinkToByOrganization(this.props.organization_we_vote_id),
      issues_linked_to: IssueStore.getIssuesLinkedToByOrganization(this.props.organization_we_vote_id),
    });
  }

  getDefaultActiveIssueTab () {
    // If the organization is linked to fewer than 3 issues, default to the "Find Issues" tab
    // After that, default to the "Linked Issues" tab
    let issues_linked_count = IssueStore.getIssuesLinkedToByOrganizationCount(this.props.organization_we_vote_id);
    let show_find_issues_until_this_many_linked_to = 3;
    let default_active_tab;
    if (issues_linked_count < show_find_issues_until_this_many_linked_to) {
      default_active_tab = "issues_to_link";
    } else {
      default_active_tab = "issues_linked";
    }
    return default_active_tab;
  }

  onDoneButton () {
    historyPush("/voterguideedit/" + this.props.organization_we_vote_id);
  }

  render () {
    renderLog(__filename);
    console.log('>!>!>this.props<!<!<', this.props)
    let issues_to_display = [];

    let active_tab = this.props.params.active_tab || this.state.active_tab;
    let issues_to_link_url = "/settings/issues/issues_to_link";
    let issues_linked_url = "/settings/issues/issues_linked";

    const is_linked_false = false;
    const is_linked_true = true;

    // console.log('this.state.active_tab ', this.state.active_tab);
    // console.log('this.props.params.active_tab ', this.props.params.active_tab );
    // console.log('-----------------------------------------------------')
    switch (active_tab) {
      case "issues_to_link":
        issues_to_display = this.state.issues_to_link_to.map((issue) => {
          return <IssueLinkToggle
            key={issue.issue_we_vote_id}
            issue={issue}
            organization_we_vote_id={this.props.organization_we_vote_id}
            is_linked={is_linked_false}
          />;
        });
        break;
      default:
      case "issues_linked":
        issues_to_display = this.state.issues_linked_to.map((issue) => {
          return <IssueLinkToggle
            key={issue.issue_we_vote_id}
            issue={issue}
            organization_we_vote_id={this.props.organization_we_vote_id}
            is_linked={is_linked_true}
          />;
        });
        break;
    }

    return <div className="">
      <div className="card">
        <div className="card-main">
          <h1 className="h2 hidden-xs">Issues Related to Your Voter Guide</h1>
          <h1 className="h4 hidden-sm hidden-md hidden-lg">Issues Related to Your Voter Guide</h1>
          <p>Help voters find your voter guide. Specify the issues on which you take positions.</p>
          <div className="tabs__tabs-container-wrap">
            <div className="tabs__tabs-container hidden-print">
              <span className="pull-right">
                <Button bsStyle="success" bsSize="xsmall" onClick={this.onDoneButton} >
                  <span>Done</span>
                </Button>
              </span>
              <ul className="nav tabs__tabs">
                <li className="tab-item">
                  <Link to={issues_linked_url} className={active_tab === "issues_linked" ? "tab tab-active" : "tab tab-default"}>
                    <span>Linked Issues</span>
                  </Link>
                </li>
                <li className="tab-item">
                  <Link to={issues_to_link_url} className={active_tab === "issues_to_link" ? "tab tab-active" : "tab tab-default"}>
                    <span>Find Issues</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <br />
          {issues_to_display}
        </div>
      </div>
    </div>;
  }
}
