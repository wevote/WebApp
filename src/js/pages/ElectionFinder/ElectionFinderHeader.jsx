import React from 'react';
import PropTypes from 'prop-types';
import { ElectionNameH1, ElectionStateLabel } from '../../components/Style/BallotTitleHeaderStyles';
import { Breadcrumb, BreadcrumbAnchor } from './electionFinderStyles';

function ElectionFinderHeader ({ breadcrumbs, stateLabel, subtitle }) {
  return (
    <>
      {stateLabel && <ElectionStateLabel>{stateLabel}</ElectionStateLabel>}
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
                  <BreadcrumbAnchor href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbAnchor>
                )}
              </React.Fragment>
            );
          })}
        </Breadcrumb>
      )}
      {subtitle && <Breadcrumb>{subtitle}</Breadcrumb>}
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
