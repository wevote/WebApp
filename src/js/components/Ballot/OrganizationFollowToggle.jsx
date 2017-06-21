import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import GuideActions from "../../actions/GuideActions";
import ImageHandler from "../../components/ImageHandler";

export default class OrganizationFollowToggle extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
    organization_name: PropTypes.string.isRequired,
    on_organization_follow: PropTypes.func.isRequired,
    on_organization_stop_following: PropTypes.func.isRequired,
    organization_image_url: PropTypes.string.isRequired,
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
      GuideActions.organizationFollow(this.props.organization_we_vote_id);
      this.props.on_organization_follow(this.props.organization_we_vote_id);
    }
  }

  onOrganizationStopFollowing () {
    this.setState({is_following: false});
    GuideActions.organizationStopFollowing(this.props.organization_we_vote_id);
    this.props.on_organization_stop_following(this.props.organization_we_vote_id);
  }

  render () {
    return <div className="u-push--sm u-stack--sm">
      <div className="o-media-object--center">
          <span>
          <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-self-start u-push--sm"
                        imageUrl={this.props.organization_image_url}
                        alt="organization-photo"/>
          </span>
        { this.state.is_following ?
          <div className="o-media-object__body">
            <span>{this.props.organization_name}</span>
            <Button bsStyle="warning" bsSize="small" className="pull-right" onClick={this.onOrganizationStopFollowing}>
              <span>Following</span>
            </Button>
          </div> :
          <div className="o-media-object__body">
            <span onClick={this.onOrganizationFollow}>{this.props.organization_name}</span>
            <Button bsStyle="info" bsSize="small" className="pull-right" onClick={this.onOrganizationFollow}>
              <span>Follow</span>
            </Button>
          </div>
        }
      </div>
    </div>;
  }
}
