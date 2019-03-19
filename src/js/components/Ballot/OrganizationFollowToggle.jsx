import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { cordovaDot } from '../../utils/cordovaUtils';
import ImageHandler from '../ImageHandler';
import OrganizationActions from '../../actions/OrganizationActions';
import { showToastError, showToastSuccess } from '../../utils/showToast';
import { renderLog } from '../../utils/logging';
import checkMarkIcon from '../../../img/global/svg-icons/check-mark-v2-40x43.svg';

export default class OrganizationFollowToggle extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
    organization_name: PropTypes.string.isRequired,
    organization_description: PropTypes.string,
    organization_image_url: PropTypes.string,
    on_organization_follow: PropTypes.func.isRequired,
    on_organization_stop_following: PropTypes.func.isRequired,
    grid: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      isFollowing: false,
    };
    this.onOrganizationFollow = this.onOrganizationFollow.bind(this);
    this.onOrganizationStopFollowing = this.onOrganizationStopFollowing.bind(this);
  }

  componentDidMount () {
  }

  onOrganizationFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.isFollowing) {
      this.setState({ isFollowing: true });
      const organizationFollowBasedOnIssue = true;
      OrganizationActions.organizationFollow(this.props.organization_we_vote_id, organizationFollowBasedOnIssue);
      if (this.props.on_organization_follow) {
        this.props.on_organization_follow(this.props.organization_we_vote_id);
      }
      showToastSuccess(`Now following ${this.props.organization_name}!`);
    }
  }

  onOrganizationStopFollowing () {
    this.setState({ isFollowing: false });
    OrganizationActions.organizationStopFollowing(this.props.organization_we_vote_id);
    if (this.props.on_organization_stop_following) {
      this.props.on_organization_stop_following(this.props.organization_we_vote_id);
    }
    showToastError(`You've stopped following ${this.props.organization_name}.`);
  }

  render () {
    renderLog(__filename);
    if (!this.state) { return <div />; }
    const { isFollowing } = this.state;

    return (
      <div className={`${this.props.grid} intro-modal__square u-cursor--pointer`} onClick={isFollowing ? this.onOrganizationStopFollowing : this.onOrganizationFollow}>
        <ImageHandler
          sizeClassName={isFollowing ? 'intro-modal__square-image intro-modal__square-following' : 'intro-modal__square-image'}
          imageUrl={this.props.organization_image_url}
          kind_of_image="ORGANIZATION"
          alt="organization-photo"
        />
        { isFollowing && (
        <ImageHandler
          className="intro-modal__square-check-mark"
          imageUrl={cordovaDot(checkMarkIcon)}
          alt="Following"
        />
        ) }
        <h4 className="intro-modal__white-space intro-modal__square-name">{this.props.organization_name}</h4>
        { this.props.organization_description && this.props.organization_description.length ? (
          <Tooltip id="organizationDescriptionTooltip" title={this.props.organization_description}>
            <i className="fa fa-info-circle fa-lg d-none d-sm-block intro-modal__square-details" aria-hidden="true" />
          </Tooltip>
        ) :
          null
        }
      </div>
    );
  }
}
