import { ContentCopy, ExpandMore, FileDownloadOutlined, Launch, Search, Close } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateLong (dateString) {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-');
  return `${MONTH_ABBR[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

function sortByDateAsc (a, b) {
  return (a.election_day_text || '').localeCompare(b.election_day_text || '');
}

const SORTED_STATES = Object.entries(stateCodeMap)
  .filter(([code]) => code !== 'NA')
  .sort((a, b) => a[1].localeCompare(b[1]));

function ElectionFinderHome () {
  renderLog('ElectionFinderHome');
  const [electionList, setElectionList] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState('all');
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
      setFilterTab((prev) => {
        const hasUpcoming = list.some((el) => el.election_is_upcoming);
        if (prev === 'upcoming' && !hasUpcoming && list.length > 0) return 'past';
        return prev;
      });
    });
    ElectionActions.electionsRetrieve();
    return () => {
      listener.remove();
      clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const onStateChange = useCallback((e) => {
    const stateCode = e.target.value;
    if (stateCode && stateCode !== 'all') {
      historyPush(`/election-finder/${stateCode.toLowerCase()}`);
    } else {
      setSelectedStateCode('all');
    }
  }, []);

  const onFilterTabChange = useCallback((tab) => {
    setFilterTab(tab);
    setVisibleCount(50);
  }, []);

  const onElectionSelect = useCallback((election) => {
    const stateCode = (election.state_code_list && election.state_code_list.length > 0) ?
      election.state_code_list[0].toLowerCase() :
      'na';
    historyPush(`/election-finder/${stateCode}/${election.google_civic_election_id}`);
  }, []);

  // Filter by state
  let filteredByState = electionList;
  if (selectedStateCode !== 'all') {
    filteredByState = electionList.filter(
      (el) => el.state_code_list && el.state_code_list.includes(selectedStateCode),
    );
  }

  // Apply search filter before splitting upcoming/past so counts reflect the search
  if (searchText) {
    const lowerSearch = searchText.toLowerCase();
    filteredByState = filteredByState.filter(
      (el) => (el.election_name || '').toLowerCase().includes(lowerSearch) ||
              (el.election_day_text || '').toLowerCase().includes(lowerSearch),
    );
  }

  const upcomingElections = filteredByState.filter((el) => el.election_is_upcoming).sort(sortByDateAsc);
  const pastElections = filteredByState.filter((el) => !el.election_is_upcoming);
  const upcomingCount = upcomingElections.length;
  const pastCount = pastElections.length;

  let displayElections = [];
  let sectionTitle = '';
  const stateLabel = selectedStateCode === 'all' ? 'All states' : stateCodeMap[selectedStateCode] || selectedStateCode;
  if (filterTab === 'all') {
    displayElections = [...upcomingElections, ...pastElections];
    sectionTitle = `All elections \u2013 ${stateLabel}`;
  } else if (filterTab === 'upcoming') {
    displayElections = upcomingElections;
    sectionTitle = `Upcoming elections \u2013 ${stateLabel} (${upcomingCount})`;
  } else {
    displayElections = pastElections;
    sectionTitle = `Past elections \u2013 ${stateLabel} (${pastCount})`;
  }

  const sectionDownloadLabel = filterTab === 'past' ?
    'Download data for all past elections' :
    'Download data for all upcoming elections';

  return (
    <>
      <Helmet><title>Election Finder - We Vote</title></Helmet>
      <SnackNotifier />
      <PageContentContainer>
        <ElectionFinderHeader subtitle="Find past or upcoming elections." />
        <StateSelectWrapper>
          <StateSelectLabel>{stateLabel}</StateSelectLabel>
          <StateSelectCaret><ExpandMore fontSize="inherit" /></StateSelectCaret>
          <StateSelectNative value={selectedStateCode} onChange={onStateChange}>
            <option value="all">All states</option>
            <option value="NA">National</option>
            {SORTED_STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </StateSelectNative>
        </StateSelectWrapper>

        <FilterTabsRow>
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
            const sc = (election.state_code_list && election.state_code_list.length > 0) ?
              election.state_code_list[0].toLowerCase() :
              'na';
            const electionUrl = `/election-finder/${sc}/${googleCivicElectionId}`;
            return (
              <ElectionRow
                key={googleCivicElectionId}
                onClick={() => onElectionSelect(election)}
              >
                <ElectionRowText>
                  <ElectionLink>
                    {election.state_code && election.state_code !== 'NA' ?
                      `${convertStateCodeToStateText(election.state_code)} – ${election.election_name || ''}` :
                      (election.election_name || '')}
                  </ElectionLink>
                  {election.election_day_text && (
                    <ElectionDateText>{formatDateLong(election.election_day_text)}</ElectionDateText>
                  )}
                </ElectionRowText>
                <ElectionRowActions className="u-show-desktop-tablet" onClick={(e) => e.stopPropagation()}>
                  <CopyChip defaultLabel="Copy link" getText={() => `${window.location.origin}${electionUrl}`} />
                  <ActionDivider />
                  {nextReleaseFeaturesEnabled && (
                    <DarkTooltip title="Download election data">
                      <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
                    </DarkTooltip>
                  )}
                  <DarkTooltip title="Open in new tab">
                    <IconButton size="small" onClick={() => window.open(electionUrl, '_blank')}>
                      <Launch fontSize="small" />
                    </IconButton>
                  </DarkTooltip>
                </ElectionRowActions>
                <RowKebabMenu
                  ariaLabel="More options for this election"
                  items={[
                    { key: 'copy-link', icon: ContentCopy, label: 'Copy link', onClick: () => copyAndToast(`${window.location.origin}${electionUrl}`) },
                    ...(nextReleaseFeaturesEnabled ? [{ key: 'download', icon: FileDownloadOutlined, label: 'Download election data', onClick: () => {} }] : []),
                    { key: 'open', icon: Launch, label: 'Open in new tab', onClick: () => window.open(electionUrl, '_blank') },
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

export default ElectionFinderHome;
