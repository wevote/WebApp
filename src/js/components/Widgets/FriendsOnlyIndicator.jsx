import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReactSVG } from 'react-svg';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

const Tooltip = React.lazy(() => import('react-bootstrap/Tooltip'));
const OverlayTrigger = React.lazy(() => import('react-bootstrap/OverlayTrigger'));
const groupIcon = '../../../img/global/svg-icons/group-icon.svg';
const publicIcon = '../../../img/global/svg-icons/public-icon.svg';

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
    if (isFriendsOnly) {
      labelText = 'This is only visible to We Vote friends.';
      visibilityIcon = (
        <ReactSVG
          src={cordovaDot(groupIcon)}
          beforeInjection={(svg) => svg.setAttribute('style', { backgroundColor: '#fff', borderRadius: '3px', fill: '#555', width: '16px', height: '16px', display: 'flex', verticalAlign: 'unset' })}
          alt="Visible to Friends Only"
        />
      );
    } else {
      labelText = 'This is visible to the public.';
      visibilityIcon = (
        <ReactSVG src={cordovaDot(publicIcon)}
                  beforeInjection={(svg) => svg.setAttribute('style',
                    { backgroundColor: '#fff', borderRadius: '3px', fill: '#555', width: '16px', height: '16px', display: 'flex', verticalAlign: 'unset' })}
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
