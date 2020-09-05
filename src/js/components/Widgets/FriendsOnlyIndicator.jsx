import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import groupIcon from '../../../img/global/svg-icons/group-icon.svg';
import publicIcon from '../../../img/global/svg-icons/public-icon.svg';

export default class FriendsOnlyIndicator extends Component {
  static propTypes = {
    isFriendsOnly: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('FriendsOnlyIndicator');  // Set LOG_RENDER_EVENTS to log all renders
    let { isFriendsOnly } = this.props;
    if (isFriendsOnly === undefined) {
      isFriendsOnly = true;
    }

    let labelText = '';
    let visibilityIcon = '';
    if (isFriendsOnly) {
      labelText = 'This is only visible to We Vote friends.';
      visibilityIcon = <ReactSVG src={cordovaDot(groupIcon)} svgStyle={{ backgroundColor: '#fff', borderRadius: '3px', fill: '#555', width: '16px', height: '16px', display: 'flex', verticalAlign: 'unset'  }} alt="Visible to Friends Only" />;
    } else {
      labelText = 'This is visible to the public.';
      visibilityIcon = <ReactSVG src={cordovaDot(publicIcon)} svgStyle={{ backgroundColor: '#fff', borderRadius: '3px', fill: '#555', width: '16px', height: '16px', display: 'flex', verticalAlign: 'unset' }} alt="Visible to Public" />;
    }

    const tooltip = <Tooltip id="tooltip">{labelText}</Tooltip>;

    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <span className="public-friends-indicator">{visibilityIcon}</span>
      </OverlayTrigger>
    );
  }
}
