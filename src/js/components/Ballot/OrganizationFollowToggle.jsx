import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import GuideActions from "../../actions/GuideActions";
import ImageHandler from "../ImageHandler";

export default class OrganizationFollowToggle extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
    organization_name: PropTypes.string.isRequired,
    organization_description: PropTypes.string,
    organization_image_url: PropTypes.string,
    on_organization_follow: PropTypes.func.isRequired,
    on_organization_stop_following: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_following: false,
    };
  }

  componentDidMount () {
    this.onOrganizationFollow = this.onOrganizationFollow.bind(this);
    this.onOrganizationStopFollowing = this.onOrganizationStopFollowing.bind(this);
  }

  onOrganizationFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({is_following: true});
      let organization_follow_based_on_issue = true;
      GuideActions.organizationFollow(this.props.organization_we_vote_id, organization_follow_based_on_issue);
      this.props.on_organization_follow(this.props.organization_we_vote_id);
    }
  }

  onOrganizationStopFollowing () {
    this.setState({is_following: false});
    GuideActions.organizationStopFollowing(this.props.organization_we_vote_id);
    this.props.on_organization_stop_following(this.props.organization_we_vote_id);
  }

  render () {
    if (!this.state) { return <div />; }

    return this.state.is_following ?
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <div className="intro-modal__hide-sm intro-modal__margin-right">
          <ImageHandler className="intro-modal__hide-sm hidden-sm card-main__avatar-compressed o-media-object__anchor u-self-start u-push--sm"
                        sizeClassName="icon-org-small u-push--sm "
                        alt="organization-photo"
                        kind_of_image="ORGANIZATION"
          />
        </div>
        <span className="intro-modal__span intro-modal__margin-right">
          <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.organization_name}</h4>
          <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm">{this.props.organization_description}</p>
        </span>
        <Button bsStyle="warning" bsSize="small" onClick={this.onOrganizationStopFollowing.bind(this)}>
          <span>Following</span>
        </Button>
      </div> :
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <div className="intro-modal__hide-sm intro-modal__margin-right">
          <ImageHandler className="intro-modal__hide-sm hidden-sm card-main__avatar-compressed o-media-object__anchor u-self-start u-push--sm"
                        sizeClassName="icon-org-small u-push--sm "
                        alt="organization-photo"
                        kind_of_image="ORGANIZATION"
          />
        </div>
        <span className="intro-modal__span intro-modal__margin-right" onClick={this.onOrganizationFollow.bind(this)}>
          <h4 className="card-main__candidate-name intro-modal__white-space">{this.props.organization_name}</h4>
          <p className="intro-modal__small intro-modal__ellipsis intro-modal__hide-sm">{this.props.organization_description}</p>
        </span>
        <Button bsStyle="info" bsSize="small" onClick={this.onOrganizationFollow.bind(this)}>
          <span>Follow</span>
        </Button>
      </div>;
  }
}
