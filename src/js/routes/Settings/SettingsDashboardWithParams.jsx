import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../utils/logging';
import SettingsDashboard from './SettingsDashboard';

export default function SettingsDashboardWithParams (props) {
  const { match } = props;

  // console.log('SettingsDashboardWithParams match:', match);
  renderLog('SettingsDashboardWithParams');
  return (
    <SettingsDashboard match={match} />
  );
}
SettingsDashboardWithParams.propTypes = {
  match: PropTypes.object,
};
