import React from 'react';
import PropTypes from 'prop-types';
import { ElectionNameH1 } from '../../components/Style/BallotTitleHeaderStyles';
import { Breadcrumb, BreadcrumbAnchor, ElectionFinderStateLabel } from './electionFinderStyles';

function ElectionFinderHeader ({ breadcrumbs, stateLabel, subtitle }) {
  return (
    <>
      <ElectionNameH1>Election Finder</ElectionNameH1>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {idx > 0 && ' / '}
                {isLast || !crumb.href ? (
                  <span>{crumb.label}</span>
                ) : (
                  <BreadcrumbAnchor to={crumb.href}>
                    {crumb.label}
                  </BreadcrumbAnchor>
                )}
              </React.Fragment>
            );
          })}
        </Breadcrumb>
      )}
      {subtitle && <Breadcrumb>{subtitle}</Breadcrumb>}
      {stateLabel && <ElectionFinderStateLabel>{stateLabel}</ElectionFinderStateLabel>}
    </>
  );
}

ElectionFinderHeader.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
  })),
  stateLabel: PropTypes.string,
  subtitle: PropTypes.string,
};

export default ElectionFinderHeader;
