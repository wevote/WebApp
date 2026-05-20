import { ContentCopy, ExpandMore, FileDownloadOutlined, Launch, Search, Close } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import ElectionActions from '../../actions/ElectionActions';
import { renderLog } from '../../common/utils/logging';
import { stateCodeMap, convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import historyPush from '../../common/utils/historyPush';
import SnackNotifier from '../../common/components/Widgets/SnackNotifier';
import ElectionStore from '../../stores/ElectionStore';
import CopyChip from './CopyChip';
import copyAndToast from './copyAndToast';
import formatDateLong from './dateHelpers';
import ElectionFinderHeader from './ElectionFinderHeader';
import RowKebabMenu from './RowKebabMenu';
import {
  ActionDivider, DarkTooltip,
  ElectionDateText, ElectionLink, ElectionList, ElectionRow, ElectionRowActions, ElectionRowText,
  FilterTab, FilterTabsRow, InlineSearchField, NoResults,
  SearchIconButton, SectionTitle, SectionTitleRow, ShowMoreButton,
  StateSelectWrapper, StateSelectNative, StateSelectLabel, StateSelectCaret,
} from './electionFinderStyles';
import webAppConfig from '../../config';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

const SORTED_STATES = Object.entries(stateCodeMap)
  .filter(([code]) => code !== 'NA')
  .sort((a, b) => a[1].localeCompare(b[1]));

function sortByDateAsc (a, b) {
  return (a.election_day_text || '').localeCompare(b.election_day_text || '');
}

// 'NA' must be matched explicitly: an empty state_code_list does not imply national,
// since some state-level elections come back without state_code_list populated.
function matchesStateCode (election, stateCode) {
  if (stateCode === 'NA') {
    return election.state_code === 'NA' || (election.state_code_list && election.state_code_list.includes('NA'));
  }
  return election.state_code_list && election.state_code_list.includes(stateCode);
}

function getBreadcrumbTabLabel (filterTab) {
  if (filterTab === 'all') return 'All';
  if (filterTab === 'past') return 'Past';
  return 'Upcoming';
}

function getBreadcrumbTabCount (filterTab, upcomingCount, pastCount) {
  if (filterTab === 'all') return upcomingCount + pastCount;
  if (filterTab === 'past') return pastCount;
  return upcomingCount;
}

function ElectionFinderForState () {
  renderLog('ElectionFinderForState');
  const params = useParams();
  const selectedStateCode = (params.stateCode || '').toUpperCase();
  const stateName = convertStateCodeToStateText(selectedStateCode);

  const [electionList, setElectionList] = useState([]);
  const [filterTab, setFilterTab] = useState('upcoming');
  const [visibleCount, setVisibleCount] = useState(50);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const listener = ElectionStore.addListener(() => {
      const list = ElectionStore.getElectionList();
      setElectionList(list);
    });
    ElectionActions.electionsRetrieve();
    return () => {
      listener.remove();
      clearTimeout(searchDebounceRef.current);
    };
  }, []);

  // Auto-switch from "upcoming" to "all" when there are no upcoming elections for this state
  useEffect(() => {
    if (electionList.length > 0 && filterTab === 'upcoming') {
      const stateElections = electionList.filter((el) => matchesStateCode(el, selectedStateCode));
      const hasUpcoming = stateElections.some((el) => el.election_is_upcoming);
      if (!hasUpcoming && stateElections.length > 0) {
        setFilterTab('all');
      }
    }
  }, [electionList, selectedStateCode, filterTab]);

  const onStateChange = useCallback((e) => {
    const stateCode = e.target.value;
    if (stateCode) {
      historyPush(`/election-finder/${stateCode.toLowerCase()}`);
    } else {
      historyPush('/election-finder');
    }
  }, []);

  const onFilterTabChange = useCallback((tab) => {
    setFilterTab(tab);
    setVisibleCount(50);
  }, []);

  const onElectionSelect = useCallback((googleCivicElectionId) => {
    historyPush(`/election-finder/${selectedStateCode.toLowerCase()}/${googleCivicElectionId}`);
  }, [selectedStateCode]);

  let stateElections = electionList.filter((el) => matchesStateCode(el, selectedStateCode));

  // Apply search filter before splitting upcoming/past so counts reflect the search
  if (searchText) {
    const lowerSearch = searchText.toLowerCase();
    stateElections = stateElections.filter(
      (el) => (el.election_name || '').toLowerCase().includes(lowerSearch) ||
              (el.election_day_text || '').toLowerCase().includes(lowerSearch),
    );
  }

  const upcomingElections = stateElections.filter((el) => el.election_is_upcoming).sort(sortByDateAsc);
  const pastElections = stateElections.filter((el) => !el.election_is_upcoming);
  const upcomingCount = upcomingElections.length;
  const pastCount = pastElections.length;

  let displayElections = [];
  let sectionTitle = '';
  if (filterTab === 'all') {
    displayElections = [...upcomingElections, ...pastElections];
    sectionTitle = `${stateName} \u2013 All Elections`;
  } else if (filterTab === 'upcoming') {
    displayElections = upcomingElections;
    sectionTitle = `${stateName} \u2013 Upcoming Elections`;
  } else {
    displayElections = pastElections;
    sectionTitle = `${stateName} \u2013 Past Elections`;
  }

  let sectionDownloadLabel;
  if (filterTab === 'all') {
    sectionDownloadLabel = `Download data for all ${stateName} elections`;
  } else if (filterTab === 'past') {
    sectionDownloadLabel = 'Download data for all past elections';
  } else {
    sectionDownloadLabel = 'Download data for all upcoming elections';
  }

  return (
    <>
      <Helmet><title>{`${stateName} Elections - Election Finder - We Vote`}</title></Helmet>
      <SnackNotifier />
      <PageContentContainer>
        <ElectionFinderHeader
          breadcrumbs={[
            { label: '\u2190 Election Finder Home', href: '/election-finder' },
            { label: `${stateName} ${getBreadcrumbTabLabel(filterTab)} Elections (${getBreadcrumbTabCount(filterTab, upcomingCount, pastCount)})` },
          ]}
        />
        <StateSelectWrapper>
          <StateSelectLabel>{stateName || 'Select state'}</StateSelectLabel>
          <StateSelectCaret><ExpandMore fontSize="inherit" /></StateSelectCaret>
          <StateSelectNative value={selectedStateCode || ''} onChange={onStateChange}>
            <option value="">Select state</option>
            <option value="NA">National</option>
            {SORTED_STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </StateSelectNative>
        </StateSelectWrapper>

        <FilterTabsRow>
          <FilterTab active={filterTab === 'all'} onClick={() => onFilterTabChange('all')}>
            All
          </FilterTab>
          <FilterTab active={filterTab === 'upcoming'} onClick={() => onFilterTabChange('upcoming')}>
            {`Upcoming (${upcomingCount})`}
          </FilterTab>
          <FilterTab active={filterTab === 'past'} onClick={() => onFilterTabChange('past')}>
            {`Past (${pastCount})`}
          </FilterTab>
          {searchOpen ? (
            <InlineSearchField
              variant="outlined"
              size="small"
              placeholder={isMobileScreenSize() ? 'Search...' : 'Search elections...'}
              inputRef={searchInputRef}
              defaultValue=""
              onChange={(e) => {
                clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = setTimeout(() => setSearchText(e.target.value), 300);
              }}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (searchInputRef.current) searchInputRef.current.value = '';
                        setSearchOpen(false);
                        setSearchText('');
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <SearchIconButton onClick={() => setSearchOpen(true)}>
              <Search fontSize="small" />
            </SearchIconButton>
          )}
        </FilterTabsRow>

        <SectionTitleRow>
          <SectionTitle>{sectionTitle}</SectionTitle>
          {nextReleaseFeaturesEnabled && (
            <DarkTooltip title={sectionDownloadLabel}>
              <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
            </DarkTooltip>
          )}
        </SectionTitleRow>

        <ElectionList>
          {(searchText ? displayElections : displayElections.slice(0, visibleCount)).map((election) => {
            const googleCivicElectionId = election.google_civic_election_id;
            return (
              <ElectionRow
                key={googleCivicElectionId}
                onClick={() => onElectionSelect(googleCivicElectionId)}
              >
                <ElectionRowText>
                  <ElectionLink>{election.election_name || ''}</ElectionLink>
                  {election.election_day_text && (
                    <ElectionDateText>{formatDateLong(election.election_day_text)}</ElectionDateText>
                  )}
                </ElectionRowText>
                <ElectionRowActions className="u-show-desktop-tablet" onClick={(e) => e.stopPropagation()}>
                  <CopyChip
                    defaultLabel="Copy link"
                    getText={() => `${window.location.origin}/election-finder/${selectedStateCode.toLowerCase()}/${googleCivicElectionId}`}
                  />
                  <ActionDivider />
                  {nextReleaseFeaturesEnabled && (
                    <DarkTooltip title="Download election data">
                      <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
                    </DarkTooltip>
                  )}
                  <DarkTooltip title="Open in new tab">
                    <IconButton size="small" onClick={() => window.open(`/election-finder/${selectedStateCode.toLowerCase()}/${googleCivicElectionId}`, '_blank')}>
                      <Launch fontSize="small" />
                    </IconButton>
                  </DarkTooltip>
                </ElectionRowActions>
                <RowKebabMenu
                  ariaLabel="More options for this election"
                  items={[
                    { key: 'copy-link', icon: ContentCopy, label: 'Copy link', onClick: () => copyAndToast(`${window.location.origin}/election-finder/${selectedStateCode.toLowerCase()}/${googleCivicElectionId}`) },
                    ...(nextReleaseFeaturesEnabled ? [{ key: 'download', icon: FileDownloadOutlined, label: 'Download election data', onClick: () => {} }] : []),
                    { key: 'open', icon: Launch, label: 'Open in new tab', onClick: () => window.open(`/election-finder/${selectedStateCode.toLowerCase()}/${googleCivicElectionId}`, '_blank') },
                  ]}
                />
              </ElectionRow>
            );
          })}
          {!searchText && displayElections.length > visibleCount && (
            <ShowMoreButton onClick={() => setVisibleCount((prev) => prev + 50)}>
              {`Show more (${displayElections.length - visibleCount} remaining)`}
            </ShowMoreButton>
          )}
          {displayElections.length === 0 && (
            <NoResults>{electionList.length === 0 ? 'Loading...' : 'No elections found.'}</NoResults>
          )}
        </ElectionList>
      </PageContentContainer>
    </>
  );
}

export default ElectionFinderForState;
