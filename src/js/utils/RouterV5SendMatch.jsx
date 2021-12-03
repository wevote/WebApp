import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { renderLog } from '../common/utils/logging';

const OrganizationVoterGuideEdit = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideEdit' */ '../routes/VoterGuide/OrganizationVoterGuideEdit'));
const PageNotFound = React.lazy(() => import(/* webpackChunkName: 'PageNotFound' */ '../routes/PageNotFound'));
const Ready = React.lazy(() => import(/* webpackChunkName: 'Ready' */ '../routes/Ready'));
const SettingsDashboard = React.lazy(() => import(/* webpackChunkName: 'SettingsDashboard' */ '../routes/Settings/SettingsDashboard'));

// A function component, for cases where react-router V5 does not properly send parameters to React.Components
// This is more of a workaround, than a thoroughly understood solution.
export default function RouterV5SendMatch (props) {
  const { componentName, match } = props;

  // console.log('SettingsDashboardWithParams match:', match);
  renderLog(`RouterV5SendMatch for ${componentName}`);

  switch (componentName) {
    case 'OrganizationVoterGuideEdit':
      return (
        <Suspense fallback={<></>}>
          <OrganizationVoterGuideEdit match={match} />
        </Suspense>
      );
    case 'Ready':
      return (
        <Suspense fallback={<></>}>
          <Ready match={match} />
        </Suspense>
      );
    case 'SettingsDashboard':
      return (
        <Suspense fallback={<></>}>
          <SettingsDashboard match={match} />
        </Suspense>
      );
    default:
      console.error('RouterV5SendMatch unprepared for component: ', componentName);
      return (
        <Suspense fallback={<></>}>
          <PageNotFound />
        </Suspense>
      );
  }
}
RouterV5SendMatch.propTypes = {
  componentName: PropTypes.string,
  match: PropTypes.object,
};
