import PropTypes from 'prop-types';
import React from 'react';
import PageNotFound from '../routes/PageNotFound';
import Ready from '../routes/Ready';
import SettingsDashboard from '../routes/Settings/SettingsDashboard';
import OrganizationVoterGuideEdit from '../routes/VoterGuide/OrganizationVoterGuideEdit';
import { renderLog } from './logging';

// A function component, for cases where react-router V5 does not properly send parameters to React.Components
// This is more of a workaround, than a thoroughly understood solution.
export default function RouterV5SendMatch (props) {
  const { componentName, match } = props;

  // console.log('SettingsDashboardWithParams match:', match);
  renderLog(`RouterV5SendMatch for ${componentName}`);

  switch (componentName) {
    case 'OrganizationVoterGuideEdit':
      return (
        <OrganizationVoterGuideEdit match={match} />
      );
    case 'Ready':
      return (
        <Ready match={match} />
      );
    case 'SettingsDashboard':
      return (
        <SettingsDashboard match={match} />
      );
    default:
      console.error('RouterV5SendMatch unprepared for component: ', componentName);
      return (
        <PageNotFound />
      );
  }
}
RouterV5SendMatch.propTypes = {
  componentName: PropTypes.string,
  match: PropTypes.object,
};
