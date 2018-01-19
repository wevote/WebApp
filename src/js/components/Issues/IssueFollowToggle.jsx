import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import IssueActions from "../../actions/IssueActions";
import ImageHandler from "../ImageHandler";

export default class IssueFollowToggle extends Component {
  static propTypes = {
    issue_we_vote_id: PropTypes.string.isRequired,
    issue_name: PropTypes.string.isRequired,
    issue_description: PropTypes.string,
    issue_image_url: PropTypes.string,
    on_issue_follow: PropTypes.func,
    on_issue_stop_following: PropTypes.func,
    edit_mode: PropTypes.bool,
    is_following: PropTypes.bool,
  };

  constructor (props) {
    super(props);

    let is_following = false;
    if (this.props.is_following) {
      is_following = this.props.is_following;
    }
    this.state = {
      is_following: is_following,
    };
    this.onIssueFollow = this.onIssueFollow.bind(this);
    this.onIssueStopFollowing = this.onIssueStopFollowing.bind(this);
  }

  componentDidMount () {
  }

  onIssueFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({is_following: true});
      IssueActions.issueFollow(this.props.issue_we_vote_id);
      if (this.props.on_issue_follow) {
        this.props.on_issue_follow(this.props.issue_we_vote_id);
      }
    }
  }

  onIssueStopFollowing () {
    this.setState({ is_following: false });
    IssueActions.issueStopFollowing(this.props.issue_we_vote_id);
    if (this.props.on_issue_stop_following) {
      this.props.on_issue_stop_following(this.props.issue_we_vote_id);
    }
  }

  render () {
    if (!this.state) { return <div />; }

    return this.state.is_following ?
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <div className="intro-modal__hide-sm intro-modal__margin-right">
          <ImageHandler className="intro-modal__hide-sm hidden-sm card-main__avatar-compressed o-media-object__anchor u-self-start u-push--sm"
                        sizeClassName="icon-candidate-small u-push--sm "
                        alt="issue-photo"
                        kind_of_image="ISSUE"
                        imageUrl={this.props.issue_image_url}
          />
        </div>
        <span className="intro-modal__span intro-modal__margin-right">
          <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.issue_name}</h4>
          <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm">{this.props.issue_description}</p>
        </span>
        { this.props.edit_mode ?
          <Button bsStyle="warning" bsSize="small" onClick={this.onIssueStopFollowing}>
            <span>Listening</span>
          </Button> :
          null }
      </div> :
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <div className="intro-modal__hide-sm intro-modal__margin-right">
          <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-self-start u-push--sm"
                        sizeClassName="icon-candidate-small u-push--sm "
                        alt="issue-photo"
                        kind_of_image="ISSUE"
                        imageUrl={this.props.issue_image_url}
          />
        </div>

        { this.props.edit_mode ?
          <span className="intro-modal__span intro-modal__margin-right" onClick={this.onIssueFollow}>
            <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.issue_name}</h4>
            <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm">{this.props.issue_description}</p>
          </span> :
          <span className="intro-modal__span intro-modal__margin-right">
            <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.issue_name}</h4>
            <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm">{this.props.issue_description}</p>
          </span>
        }

        { this.props.edit_mode ?
          <Button bsStyle="info" bsSize="small" onClick={this.onIssueFollow}>
            <span>Listen</span>
          </Button> :
          null }
      </div>;
  }
}
