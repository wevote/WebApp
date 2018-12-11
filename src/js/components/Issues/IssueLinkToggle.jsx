import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import IssueActions from "../../actions/IssueActions";
import IssueImageDisplay from "./IssueImageDisplay";
import { renderLog } from "../../utils/logging";

export default class IssueLinkToggle extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string.isRequired,
    is_linked: PropTypes.bool.isRequired,
    edit_mode: PropTypes.bool,
    incompatibleIssues: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_linked: false,
    };

    this.onIssueLink = this.onIssueLink.bind(this);
    this.onIssueUnlink = this.onIssueUnlink.bind(this);
  }

  componentDidMount () {
    let is_linked = false;
    if (this.props.is_linked) {
      is_linked = this.props.is_linked;
    }
    this.setState({
      is_linked,
    });
  }

  onIssueLink () {
    IssueActions.issueLinkForOrganization(this.props.organization_we_vote_id, this.props.issue.issue_we_vote_id);
  }

  onIssueUnlink () {
    IssueActions.issueUnLinkForOrganization(this.props.organization_we_vote_id, this.props.issue.issue_we_vote_id);
  }

  render () {
    renderLog(__filename);
    let supportButtonPopoverTooltip;
    if (this.props.incompatibleIssues !== undefined) {
      // Removed bsPrefix="card-popover"
      const incompatibleIssues = <span>{`You cannot link because the issue is incompatible with the following issues: ${this.props.incompatibleIssues.map(issue => issue.issue_name).join(", ")}`}</span>;
      supportButtonPopoverTooltip = (
        <Popover
          title="Incompatible Issues"
          id="supportButtonTooltip"
        >
          {incompatibleIssues}
        </Popover>
      );
    }

    return this.state.is_linked ? (
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <div className="col-3 col-sm-2 settingsIssues__image">
          <IssueImageDisplay
            issue={this.props.issue}
            issueImageSize="LARGE"
            showPlaceholderImage
            turnOffIssueFade
          />
        </div>
        <span className="col-6 col-sm-8 intro-modal__span">
          <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.issue.issue_name}</h4>
          <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm settingsIssues__description">{this.props.issue.issue_description}</p>
        </span>
        <div className="col-3 col-sm-2">
          <Button variant="warning" size="small" onClick={this.onIssueUnlink}>
            <span>Unlink</span>
          </Button>
        </div>
      </div>
    ) : (
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <div className="col-3 col-sm-2 settingsIssues__image">
          <IssueImageDisplay
            issue={this.props.issue}
            issueImageSize="LARGE"
            showPlaceholderImage
            turnOffIssueFade
          />
        </div>
        <span className="col-6 col-sm-8 intro-modal__span">
          <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.issue.issue_name}</h4>
          <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm settingsIssues__description">{this.props.issue.issue_description}</p>
        </span>
        <div className="col-3 col-sm-2">
          {this.props.incompatibleIssues === undefined ? (
            <Button variant="info" size="small" onClick={this.onIssueLink}>
              <span>Link</span>
            </Button>
          ) : (
            <OverlayTrigger
              key={this.props.issue.issue_we_vote_id}
              placement="bottom"
              trigger="click"
              overlay={supportButtonPopoverTooltip}
            >
              {/* trigger={["focus", "hover", "click"]} */}
              <div style={{ display: "inline-block" }}>
                <Button bsPrefix="card-main__button-linked" variant="info" size="small" onClick={this.onIssueLink} disabled>
                  <span className="d-none d-sm-block">Incompatible</span>
                  <span className="d-block d-sm-none">Link</span>
                </Button>
              </div>
            </OverlayTrigger>
          )}
        </div>
      </div>
    );
  }
}
