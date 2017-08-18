import React, { Component, PropTypes } from "react";
import {Button} from "react-bootstrap";
import ImageHandler from "../ImageHandler";

export default class IssueLinkToggle extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string.isRequired,
    is_linked: PropTypes.bool.isRequired,
    edit_mode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_linked: false,
    };
    console.log(this.props.issue);
    this.onIssueLink = this.onIssueLink.bind(this);
    this.onIssueUnlink = this.onIssueUnlink.bind(this);
  }

  componentDidMount () {
    let is_linked = false;
    if (this.props.is_linked) {
      is_linked = this.props.is_linked;
    }
    this.state = {
      is_linked: is_linked,
    };
  }

  componentWillUnMount () {

  }

  onIssueLink () {
    console.log("You clicked to Link issue");
  }

  onIssueUnlink () {
    console.log("You clicked to UnLink issue");
  }

  render () {
    return this.state.is_linked ?
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <div className="intro-modal__hide-sm intro-modal__margin-right">
          <ImageHandler className="intro-modal__hide-sm hidden-sm card-main__avatar-compressed o-media-object__anchor u-self-start u-push--sm"
                        sizeClassName="icon-candidate-small u-push--sm "
                        alt="issue-photo"
                        kind_of_image="ISSUE"
          />
        </div>
        <span className="intro-modal__span intro-modal__margin-right">
          <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.issue.issue_name}</h4>
          <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm">{this.props.issue.issue_description}</p>
        </span>
        <Button bsStyle="warning" bsSize="small" onClick={this.onIssueUnlink}>
          <span>Un-Link</span>
        </Button>
      </div> :
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <div className="intro-modal__hide-sm intro-modal__margin-right">
          <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-self-start u-push--sm"
                        sizeClassName="icon-candidate-small u-push--sm "
                        alt="issue-photo"
                        kind_of_image="ISSUE"
          />
        </div>
        <span className="intro-modal__span intro-modal__margin-right" onClick={this.onIssueLink}>
            <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.issue.issue_name}</h4>
            <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm">{this.props.issue.issue_description}</p>
        </span>
        <Button bsStyle="info" bsSize="small" onClick={this.onIssueLink}>
          <span>Link</span>
        </Button>
      </div>;
  }
}
