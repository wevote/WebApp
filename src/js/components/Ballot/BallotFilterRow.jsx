import React, { Suspense } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Badge } from '@mui/material';
import BallotConstants from '../../constants/BallotConstants';
import {
  BallotFilterTabs,
  BallotFilterChips,
  BallotFilterChip,
  OneBallotFilterWrapper,
} from '../Style/pageLayoutStyles';
import { isAndroidSizeWide } from '../../common/utils/cordovaUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';

const FilterBaseSearch = React.lazy(() => import(/* webpackChunkName: 'FilterBaseSearch' */ '../Filter/FilterBaseSearch'));

function BallotFilterRow ({
  ballotWithAllItems,
  ballotWithItemsFromCompletionFilterType,
  classes,
  chipLabelText,
  handleToggleSearchBallot,
  isSearching,
  onFilterBaseSearch,
  raceLevelFilterType,
  setBallotItemFilterType,
  showFilterTabs,
}) {
  let widthOverride = {};
  if (isAndroidSizeWide()) {
    widthOverride = { width: '96px' };
  }
  if (isSearching && isCordova()) {
    widthOverride = { width: 'unset' };
  }
  // console.log('BallotConstants.BALLOT_ITEM_FILTER_TYPES:', BallotConstants.BALLOT_ITEM_FILTER_TYPES);
  const ballotItemFilterTypes = BallotConstants.BALLOT_ITEM_FILTER_TYPES || [];

  return (
    <BallotFilterRowWrapper id="BallotFilterRow">
      <BallotFilterTabs>
        {ballotWithItemsFromCompletionFilterType.length ? (
          <>
            <Suspense fallback={<></>}>
              <FilterBaseSearch
                alwaysOpen={!showFilterTabs}
                isSearching={isSearching}
                allItems={ballotWithAllItems}
                onFilterBaseSearch={onFilterBaseSearch}
                onToggleSearch={handleToggleSearchBallot}
              />
            </Suspense>
            {showFilterTabs && (
              <BallotFilterChips key="filterTypeAll">
                <BallotFilterChip
                  variant="outlined"
                  color={(raceLevelFilterType === 'All' && !isSearching) ? 'primary' : 'default'}
                  classes={{
                    root: classes.chipRootAll,
                    label: classes.chipLabel,
                    outlinedPrimary: (raceLevelFilterType === 'All' && !isSearching) ? classes.chipOutlined : null,
                  }}
                  id="ballotBadgeMobileAndDesktop-All"
                  label="All"
                  style={widthOverride}
                  onClick={() => setBallotItemFilterType('All', ballotWithItemsFromCompletionFilterType.length)}
                />
              </BallotFilterChips>
            )}
            {showFilterTabs && (
              ballotItemFilterTypes.map((oneTypeOfBallotItem) => {
                const allBallotItemsByFilterType = ballotWithAllItems.filter((item) => {
                  if (oneTypeOfBallotItem === 'Measure') {
                    return item.kind_of_ballot_item === 'MEASURE';
                  } else {
                    return oneTypeOfBallotItem === item.race_office_level;
                  }
                });
                if (allBallotItemsByFilterType.length) {
                  const ballotItemsByFilterType = ballotWithItemsFromCompletionFilterType.filter((item) => {
                    if (oneTypeOfBallotItem === 'Measure') {
                      return item.kind_of_ballot_item === 'MEASURE';
                    } else {
                      return oneTypeOfBallotItem === item.race_office_level;
                    }
                  });
                  const ballotChip = (
                    <BallotFilterChip
                      variant="outlined"
                      color={(oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? 'primary' : 'default'}
                      classes={{
                        root: classes.chipRoot,
                        label: classes.chipLabel,
                        outlinedPrimary: (oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? classes.chipOutlined : null,
                      }}
                      id={chipLabelText(oneTypeOfBallotItem)}
                      label={chipLabelText(oneTypeOfBallotItem)}
                      style={widthOverride}
                      key={chipLabelText(oneTypeOfBallotItem)}
                      onClick={() => setBallotItemFilterType(oneTypeOfBallotItem, ballotItemsByFilterType.length)}
                    />
                  );
                  return (
                    <OneBallotFilterWrapper
                      id={`BallotButtonOuterWrapper-${window.performance.now()}`}
                      key={oneTypeOfBallotItem + window.performance.now()}
                    >
                      <div className="u-show-mobile">
                        <BallotFilterChips
                          id={`ballotBadgeMobile-${oneTypeOfBallotItem}`}
                        >
                          {ballotChip}
                        </BallotFilterChips>
                      </div>
                      <div className="u-show-desktop-tablet">
                        <BallotFilterChips>
                          <Badge
                            badgeContent={ballotItemsByFilterType.length}
                            classes={{
                              badge: classes.badge,
                              colorPrimary: classes.badgeColorPrimary,
                              root: classes.badgeRoot,
                            }}
                            color={(oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? 'primary' : 'default'}
                            id={`ballotBadgeDesktop-${oneTypeOfBallotItem}`}
                            invisible={ballotItemsByFilterType.length === 0}
                            onFocus={(e) => {
                              e.currentTarget.classList.add(classes.badgeFocused);
                            }}
                            onBlur={(e) => {
                              e.currentTarget.classList.remove(classes.badgeFocused);
                            }}
                          >
                            {ballotChip}
                          </Badge>
                        </BallotFilterChips>
                      </div>
                    </OneBallotFilterWrapper>
                  );
                } else {
                  return null;
                }
              })
            )}
          </>
        ) : null}
      </BallotFilterTabs>
    </BallotFilterRowWrapper>
  );
}

BallotFilterRow.propTypes = {
  ballotWithAllItems: PropTypes.array.isRequired,
  ballotWithItemsFromCompletionFilterType: PropTypes.array.isRequired,
  chipLabelText: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  handleToggleSearchBallot: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired,
  onFilterBaseSearch: PropTypes.func.isRequired,
  raceLevelFilterType: PropTypes.string.isRequired,
  setBallotItemFilterType: PropTypes.func.isRequired,
  showFilterTabs: PropTypes.bool.isRequired,
};

// If we want to turn off filter tabs navigation bar:  {({ showFilterTabs }) => !showFilterTabs && 'height: 0;'}
const BallotFilterRowWrapper = styled('div')`
  // TODO: 10/4/21 Steve, this is temporary and needs to be more responsive
  // margin-left: {() => (isWebApp() && !isMobileScreenSize() ? 'calc((100vw - 975px)/2)' : '')};
`;

export default BallotFilterRow;
