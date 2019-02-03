import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "react-router";
import BrowserPushMessage from "../Widgets/BrowserPushMessage";
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
  [COMMON_SENSE_GUN_REFORM]: [SECOND_AMENDMENT],
};


export default class SettingsIssueLinks extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    organizationWeVoteId: PropTypes.string,
  };

  constructor (props) {
    super(props);

    this.state = {
      activeTab: "",
      issuesToLinkTo: [],
      issuesLinkedTo: [],
      organizationWeVoteId: "",
      currentIncompatibleIssues: {},
    };
  }

  componentDidMount () {
    const newState = {};
    this.issueStoreListener = IssueStore.addListener(
      this.onIssueStoreChange.bind(this),
    );
    if (this.props.organizationWeVoteId) {
      IssueActions.retrieveIssuesToLinkForOrganization(
        this.props.organizationWeVoteId,
      );
      IssueActions.retrieveIssuesLinkedForOrganization(
        this.props.organizationWeVoteId,
      );
      newState.organizationWeVoteId = this.props.organizationWeVoteId;
    }

    const defaultActiveTab = this.getDefaultActiveIssueTab();
    const activeTab = this.props.params.active_tab || defaultActiveTab;
    newState.activeTab = activeTab;

    this.setState(newState);
  }

  componentWillReceiveProps (nextProps) {
    const newState = {};
    if (nextProps.organizationWeVoteId !== this.state.organizationWeVoteId) {
      IssueActions.retrieveIssuesToLinkForOrganization(
        nextProps.organizationWeVoteId,
      );
      IssueActions.retrieveIssuesLinkedForOrganization(
        nextProps.organizationWeVoteId,
      );
      newState.organizationWeVoteId = this.props.organizationWeVoteId;
    }
    const defaultActiveTab = this.getDefaultActiveIssueTab();
    const activeTab = nextProps.params.active_tab || defaultActiveTab;
    newState.activeTab = activeTab;
    // console.log("SettingsIssueLinks, nextProps.organizationWeVoteId: ", nextProps.organizationWeVoteId);
    // console.log("SettingsIssueLinks, activeTab: ", activeTab, "defaultActiveTab: ", defaultActiveTab);
    this.setState(newState);
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const issuesLinkedTo = IssueStore.getIssuesLinkedToByOrganization(this.props.organizationWeVoteId);
    const currentIncompatibleIssues = {}; // issue -> issue that it is causing the incompatibility

    // TODO: Steve remove the error suppression on the next line 12/1/18, a temporary hack
    issuesLinkedTo.map((linkedIssue) => { // eslint-disable-line array-callback-return
      if (INCOMPATIBLE_ISSUES[linkedIssue.issue_we_vote_id]) { // We only want the issues that been linked.
        // Iterate over incompatible issues caused by the linkedIssue.
        INCOMPATIBLE_ISSUES[linkedIssue.issue_we_vote_id].map((incompatibleIssue) => { // eslint-disable-line array-callback-return
          currentIncompatibleIssues[incompatibleIssue] = [linkedIssue];
        });
      }
    });

    // console.log("onIssueStoreChange, this.props.organizationWeVoteId: ", this.props.organizationWeVoteId);
    // console.log("getIssuesToLinkToByOrganization: ", IssueStore.getIssuesToLinkToByOrganization(this.props.organizationWeVoteId));
    // console.log("getIssuesLinkedToByOrganization: ", IssueStore.getIssuesLinkedToByOrganization(this.props.organizationWeVoteId));
    this.setState({
      issuesToLinkTo: IssueStore.getIssuesToLinkToByOrganization(
        this.props.organizationWeVoteId,
      ),
      issuesLinkedTo,
      currentIncompatibleIssues,
    });
  }

  getDefaultActiveIssueTab () {
    // If the organization is linked to fewer than 3 issues, default to the "Find Issues" tab
    // After that, default to the "Linked Issues" tab
    const issuesLinkedCount = IssueStore.getIssuesLinkedToByOrganizationCount(
      this.props.organizationWeVoteId,
    );
    const showFindIssuesUntilThisManyLinkedTo = 3;
    let defaultActiveTab;
    if (issuesLinkedCount < showFindIssuesUntilThisManyLinkedTo) {
      defaultActiveTab = "issues_to_link";
    } else {
      defaultActiveTab = "issues_linked";
    }
    return defaultActiveTab;
  }

  render () {
    renderLog(__filename);
    let issuesToDisplay = [];

    const activeTab = this.props.params.active_tab || this.state.activeTab;
    const issuesToLinkUrl = "/settings/issues/issues_to_link";
    const issuesLinkedUrl = "/settings/issues/issues_linked";

    const isLinkedFalse = false;
    const isLinkedTrue = true;
    // console.log('this.state.activeTab ', this.state.activeTab);
    // console.log('this.props.params.active_tab ', this.props.params.active_tab );
    // console.log('-----------------------------------------------------')
    switch (activeTab) {
      case "issues_to_link":
        issuesToDisplay = this.state.issuesToLinkTo.map(issue => (
          <IssueLinkToggle
            key={issue.issue_we_vote_id}
            issue={issue}
            organizationWeVoteId={this.props.organizationWeVoteId}
            isLinked={isLinkedFalse}
            incompatibleIssues={this.state.currentIncompatibleIssues[issue.issue_we_vote_id]}
          />
        ));
        break;
      default:
      case "issues_linked":
        issuesToDisplay = this.state.issuesLinkedTo.map(issue => (
          <IssueLinkToggle
            key={issue.issue_we_vote_id}
            issue={issue}
            organizationWeVoteId={this.props.organizationWeVoteId}
            isLinked={isLinkedTrue}
          />
        ));
        break;
    }

    return (
      <div className="">
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
                    <Link to={issuesLinkedUrl} className={activeTab === "issues_linked" ? "tab tab-active" : "tab tab-default"}>
                      <span>Linked Issues</span>
                    </Link>
                  </li>
                  <li className="tab-item">
                    <Link to={issuesToLinkUrl} className={activeTab === "issues_to_link" ? "tab tab-active" : "tab tab-default"}>
                      <span>Find Issues</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <br />
            {issuesToDisplay.length > 0 ? issuesToDisplay : null}
          </div>
        </div>
      </div>
    );
  }
}
