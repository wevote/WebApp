import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import GuideActions from "../../actions/GuideActions";
import ImageHandler from "../../components/ImageHandler";

export default class OrganizationFollowToggle extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
    organization_name: PropTypes.string.isRequired,
    on_start_follow: PropTypes.func.isRequired,
    on_stop_follow: PropTypes.func.isRequired,
    organization_image_url: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_following: false,
    };
  }

  componentDidMount() {
    this.onStartFollowing = this.onStartFollowing.bind(this);
    this.onStopFollowing = this.onStopFollowing.bind(this);
  }

  onStartFollowing () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({is_following: true});
      GuideActions.organizationFollow(this.props.organization_we_vote_id);
      this.props.on_start_follow(this.props.organization_we_vote_id);
    }
  }

  onStopFollowing () {
    this.setState({is_following: false});
    GuideActions.organizationStopFollowing(this.props.organization_we_vote_id);
    this.props.on_start_follow(this.props.organization_we_vote_id);
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
            <Button bsStyle="warning" bsSize="small" className="pull-right" onClick={this.onStopFollowing}>
              <span>Following</span>
            </Button>
          </div> :
          <div className="o-media-object__body">
            <span onClick={this.onStartFollowing}>{this.props.organization_name}</span>
            <Button bsStyle="info" bsSize="small" className="pull-right" onClick={this.onStartFollowing}>
              <span>Follow</span>
            </Button>
          </div>
        }
      </div>
    </div>;
  }
}
