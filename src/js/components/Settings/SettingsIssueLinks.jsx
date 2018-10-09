import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "react-router";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import IssueActions from "../../actions/IssueActions";
import IssueLinkToggle from "../Issues/IssueLinkToggle";
import IssueStore from "../../stores/IssueStore";
import { renderLog } from "../../utils/logging";

const PROCHOICE = "wv02issue63";
const PROLIFE = "wv02issue64";
const DEMOCRATIC_CLUBS = "wv02issue25";
const REPUBLIC_CLUBS = "wv02issue68";
const GREEN_CLUBS = "wv02issue35";
const LIBERTARIAN_CLUBS = "wv02issue53";
const SECOND_AMENDMENT = "wv02issue36";
const COMMON_SENSE_GUN_REFORM = "wv02issue37";

const INCOMPATIBLE_ISSUES = {
  [PROCHOICE]: [PROLIFE],
  [PROLIFE]: [PROCHOICE],
  [DEMOCRATIC_CLUBS]: [REPUBLIC_CLUBS, GREEN_CLUBS, LIBERTARIAN_CLUBS],
  [REPUBLIC_CLUBS]: [DEMOCRATIC_CLUBS, GREEN_CLUBS, LIBERTARIAN_CLUBS],
  [GREEN_CLUBS]: [DEMOCRATIC_CLUBS, REPUBLIC_CLUBS, LIBERTARIAN_CLUBS],
  [LIBERTARIAN_CLUBS]: [DEMOCRATIC_CLUBS, REPUBLIC_CLUBS, GREEN_CLUBS],
  [SECOND_AMENDMENT]: [COMMON_SENSE_GUN_REFORM],
  [COMMON_SENSE_GUN_REFORM]: [SECOND_AMENDMENT]
};


export default class SettingsIssueLinks extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string,
    organization_we_vote_id_support_list_for_each_ballot_item: PropTypes.object
  };

  constructor (props) {
    super(props);

    this.state = {
      active_tab: "",
      issues_to_link_to: [],
      issues_linked_to: [],
      organization_we_vote_id: "",
      currentIncompatibleIssues: {}
    };
  }

  componentDidMount () {
    let newState = {};
    this.issueStoreListener = IssueStore.addListener(
      this.onIssueStoreChange.bind(this)
    );
    if (this.props.organization_we_vote_id){
      IssueActions.retrieveIssuesToLinkForOrganization(
        this.props.organization_we_vote_id
      );
      IssueActions.retrieveIssuesLinkedForOrganization(
        this.props.organization_we_vote_id
      );
      newState.organization_we_vote_id = this.props.organization_we_vote_id;
    }

    let default_active_tab = this.getDefaultActiveIssueTab();
    let active_tab = this.props.params.active_tab || default_active_tab;
    newState.active_tab = active_tab;

    this.setState(newState);
  }

  componentWillReceiveProps (nextProps) {
    let newState = {};
    if (nextProps.organization_we_vote_id !== this.state.organization_we_vote_id){
      IssueActions.retrieveIssuesToLinkForOrganization(
        nextProps.organization_we_vote_id
      );
      IssueActions.retrieveIssuesLinkedForOrganization(
        nextProps.organization_we_vote_id
      );
      newState.organization_we_vote_id = this.props.organization_we_vote_id;
    }
    let default_active_tab = this.getDefaultActiveIssueTab();
    let active_tab = nextProps.params.active_tab || default_active_tab;
    newState.active_tab = active_tab;
    // console.log("SettingsIssueLinks, nextProps.organization_we_vote_id: ", nextProps.organization_we_vote_id);
    // console.log("SettingsIssueLinks, active_tab: ", active_tab, "default_active_tab: ", default_active_tab);
    this.setState(newState);
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const issues_linked_to = IssueStore.getIssuesLinkedToByOrganization( this.props.organization_we_vote_id );
      let currentIncompatibleIssues = {}; // issue -> issue that it is causing the incompatibility

      issues_linked_to.map(linkedIssue => {
        if (INCOMPATIBLE_ISSUES[linkedIssue.issue_we_vote_id]){ //We only want the issues that been linked.

          //Iterate over incompatible issues caused by the linkedIssue.
          INCOMPATIBLE_ISSUES[linkedIssue.issue_we_vote_id].map(incompatibleIssue => {
            currentIncompatibleIssues[incompatibleIssue] = [linkedIssue];
          });
        }
      });

    // console.log("onIssueStoreChange, this.props.organization_we_vote_id: ", this.props.organization_we_vote_id);
    // console.log("getIssuesToLinkToByOrganization: ", IssueStore.getIssuesToLinkToByOrganization(this.props.organization_we_vote_id));
    // console.log("getIssuesLinkedToByOrganization: ", IssueStore.getIssuesLinkedToByOrganization(this.props.organization_we_vote_id));
    this.setState({
      issues_to_link_to: IssueStore.getIssuesToLinkToByOrganization(
        this.props.organization_we_vote_id
      ),
      issues_linked_to,
      currentIncompatibleIssues
    });
  }

  getDefaultActiveIssueTab () {
    // If the organization is linked to fewer than 3 issues, default to the "Find Issues" tab
    // After that, default to the "Linked Issues" tab
    let issues_linked_count = IssueStore.getIssuesLinkedToByOrganizationCount(
      this.props.organization_we_vote_id
    );
    let show_find_issues_until_this_many_linked_to = 3;
    let default_active_tab;
    if (issues_linked_count < show_find_issues_until_this_many_linked_to) {
      default_active_tab = "issues_to_link";
    } else {
      default_active_tab = "issues_linked";
    }
    return default_active_tab;
  }

  render () {
    renderLog(__filename);
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
            incompatibleIssues={this.state.currentIncompatibleIssues[issue.issue_we_vote_id]}
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
        <Helmet title="Issues - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />

      <div className="card">
        <div className="card-main">
          <h1 className="h2 d-none d-sm-block">Issues Related to Your Voter Guide</h1>
          <h1 className="h4 hidden-sm hidden-md hidden-lg">Issues Related to Your Voter Guide</h1>
          <p>Help voters find your voter guide. Specify the issues on which you take positions.</p>
          <div className="tabs__tabs-container-wrap">
            <div className="tabs__tabs-container d-print-none">
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
            {issues_to_display.length > 0 ? issues_to_display : null}
          </div>
        </div>
      </div>;
  }
}
