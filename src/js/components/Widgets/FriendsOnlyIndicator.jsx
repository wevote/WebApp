import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { ReactSVG } from 'react-svg';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

const groupIcon = '../../../img/global/svg-icons/group-icon.svg';
const publicIcon = '../../../img/global/svg-icons/public-icon.svg';


export default function FriendsOnlyIndicator({ isFriendsOnly }){
  renderLog('FriendsOnlyIndicator');  // Set LOG_RENDER_EVENTS to log all renders
  
  let labelText = '';
  let visibilityIcon = '';

  if (isFriendsOnly === undefined) {
    isFriendsOnly = true;
  }

  if (isFriendsOnly) {
    labelText = 'This is only visible to We Vote friends.';
    visibilityIcon = (
      <ReactSVG
        src={normalizedImagePath(groupIcon)}
        // beforeInjection={(svg) => svg.setAttribute('style',
        //   { backgroundColor: '#fff', borderRadius: '3px', fill: '#555', width: '16px', height: '16px', display: 'flex', verticalAlign: 'unset' })}
        beforeInjection={(svg) => {
          // Background color not working and needs to be fixed
          // svg.setAttribute('backgroundColor', '#fff');
          // svg.setAttribute('borderRadius', '3px');
          svg.setAttribute('fill', '#555');
        }}
        alt="Visible to Friends Only"
      />
    );
  } else {
    labelText = 'This is visible to the public.';
    visibilityIcon = (
      <ReactSVG
        src={normalizedImagePath(publicIcon)}
        // beforeInjection={(svg) => svg.setAttribute('style',
        //   { backgroundColor: '#fff', borderRadius: '3px', fill: '#555', width: '16px', height: '16px', display: 'flex', verticalAlign: 'unset' })}
        beforeInjection={(svg) => {
          // Background color not working and needs to be fixed
          // svg.setAttribute('backgroundColor', '#fff');
          // svg.setAttribute('borderRadius', '3px');
          svg.setAttribute('fill', '#555');
        }}
        alt="Visible to Public"
      />
    );
  }

  const tooltip = isMobileScreenSize() ? (<span />) : (
    <Tooltip id="tooltip">{labelText}</Tooltip>
  );

  const FriendsOnlyOverlayTrigger = React.forwardRef((props, ref) => (
    <OverlayTrigger ref={ref} placement="top" overlay={tooltip}>
      {props.children}
    </OverlayTrigger>
  ));

  return (
    <FriendsOnlyOverlayTrigger>
      <PublicFriendsIndicator>{visibilityIcon}</PublicFriendsIndicator>
    </FriendsOnlyOverlayTrigger>
  );

};

FriendsOnlyIndicator.propTypes = {
  isFriendsOnly: PropTypes.bool,
};

const PublicFriendsIndicator = styled('span')`
  color: #999;
  display: inline-block;
  margin-top: -5px;
  height: 18px;
`;