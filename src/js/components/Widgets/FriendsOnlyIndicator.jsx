import PropTypes from 'prop-types';
import React, { Component } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import SvgImage from './SvgImage';


export default class FriendsOnlyIndicator extends Component {
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
    const group = cordovaDot('../../../img/global/svg-icons/group-icon.svg');
    if (isFriendsOnly) {
      labelText = 'This is only visible to We Vote friends.';
      visibilityIcon = (
        <SvgImage
          imageName={group}
          otherStyles={{ backgroundColor: '#fff',
            borderRadius: '3px',
            fill: '#555',
            width: '16px',
            height: '16px',
            display: 'flex',
            verticalAlign: 'unset' }}
          alt="Visible to Friends Only"
        />
      );
    } else {
      labelText = 'This is visible to the public.';
      visibilityIcon = (
        <SvgImage
          imageName="public-icon"
          otherStyles={{ backgroundColor: '#fff',
            borderRadius: '3px',
            fill: '#555',
            width: '16px',
            height: '16px',
            display: 'flex',
            verticalAlign: 'unset' }}
          alt="Visible to Public"
        />
      );
    }

    const tooltip = <Tooltip id="tooltip">{labelText}</Tooltip>;

    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <span className="public-friends-indicator">{visibilityIcon}</span>
      </OverlayTrigger>
    );
  }
}
FriendsOnlyIndicator.propTypes = {
  isFriendsOnly: PropTypes.bool,
};
