import { ExpandMore, FileDownloadOutlined, Launch, Search, Close } from '@mui/icons-material';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ElectionActions from '../../actions/ElectionActions';
import { renderLog } from '../../common/utils/logging';
import { stateCodeMap } from '../../common/utils/addressFunctions';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import historyPush from '../../common/utils/historyPush';
import ElectionStore from '../../stores/ElectionStore';
import ElectionFinderHeader from './ElectionFinderHeader';
import {
  ElectionLink, ElectionList, ElectionRow, ElectionRowActions,
  FilterTab, FilterTabsRow, InlineSearchField, NoResults,
  SearchIconButton, SectionTitle, SectionTitleRow, ShowMoreButton,
  StateSelectWrapper, StateSelectNative, StateSelectLabel, StateSelectCaret,
} from './electionFinderStyles';

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

  const upcomingElections = filteredByState.filter((el) => el.election_is_upcoming);
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
      <PageContentContainer>
        <ElectionFinderHeader subtitle="Find past or upcoming elections." />
        <StateSelectWrapper>
          <StateSelectLabel>{stateLabel}</StateSelectLabel>
          <StateSelectCaret><ExpandMore fontSize="inherit" /></StateSelectCaret>
          <StateSelectNative value={selectedStateCode} onChange={onStateChange}>
            <option value="all">All states</option>
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
              placeholder="Search elections..."
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
          <Tooltip title={sectionDownloadLabel}>
            <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
          </Tooltip>
        </SectionTitleRow>

        <ElectionList>
          {(searchText ? displayElections : displayElections.slice(0, visibleCount)).map((election) => {
            const googleCivicElectionId = election.google_civic_election_id;
            const electionLabel = `${election.election_name || ''} \u2013 ${election.election_day_text || ''}`;
            return (
              <ElectionRow
                key={googleCivicElectionId}
                onClick={() => onElectionSelect(election)}
              >
                <ElectionLink>
                  {electionLabel}
                </ElectionLink>
                <ElectionRowActions className="u-show-desktop-tablet" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Download election data">
                    <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Open in new tab">
                    <IconButton
                      size="small"
                      onClick={() => {
                        const sc = (election.state_code_list && election.state_code_list.length > 0) ?
                          election.state_code_list[0].toLowerCase() :
                          'na';
                        window.open(`/election-finder/${sc}/${googleCivicElectionId}`, '_blank');
                      }}
                    >
                      <Launch fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ElectionRowActions>
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
