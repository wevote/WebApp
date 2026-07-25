import { ContentCopy, ExpandMore, FileDownloadOutlined, Launch, Search, Close } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CandidateActions from '../../actions/CandidateActions';
import ElectionActions from '../../actions/ElectionActions';
import { renderLog } from '../../common/utils/logging';
import { stateCodeMap, convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import historyPush from '../../common/utils/historyPush';
import SnackNotifier from '../../common/components/Widgets/SnackNotifier';
import CandidateStore from '../../stores/CandidateStore';
import ElectionStore from '../../stores/ElectionStore';
import buildCandidateSearchResults from './buildCandidateSearchResults';
import CopyChip from './CopyChip';
import copyAndToast from './copyAndToast';
import formatDateLong from './dateHelpers';
import ElectionFinderHeader from './ElectionFinderHeader';
import highlightMatch from './highlightMatch';
import RowKebabMenu from './RowKebabMenu';
import {
  ActionDivider, CandidateInfo, CandidateList, CandidateName, CandidateParty, CandidateRow, DarkTooltip,
  ElectionCountForLink, ElectionCountForLinkNoData,
  ElectionDateText, ElectionLink, ElectionList, ElectionRow, ElectionRowActions, ElectionRowText,
  FilterTab, FilterTabsRow, InlineSearchField, NoResults,
  OfficeName, OfficeSection,
  SearchIconButton, SectionTitle, SectionTitleRow, ShowMoreButton,
  StateSelectWrapper, StateSelectNative, StateSelectLabel, StateSelectCaret,
} from './electionFinderStyles';
import webAppConfig from '../../config';
import AppObservableStore from '../../common/stores/AppObservableStore';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

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
  const [candidateList, setCandidateList] = useState([]);
  const [candidateSearchLoading, setCandidateSearchLoading] = useState(false);
  const searchInputRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const pendingCandidateSearchRef = useRef('');

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
    const candidateListener = CandidateStore.addListener(() => {
      setCandidateList(CandidateStore.getCandidateList());
    });
    ElectionActions.electionsRetrieve();
    return () => {
      listener.remove();
      candidateListener.remove();
      clearTimeout(searchDebounceRef.current);
      pendingCandidateSearchRef.current = null;
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

  const getElectionUrl = useCallback((election) => {
    const stateCode = (election.state_code) ?
      election.state_code.toLowerCase() :
      'na';
    return `/election-finder/${stateCode}/${election.google_civic_election_id}`;
  }, []);

  // Filter by state
  let filteredByState = electionList;
  if (selectedStateCode !== 'all') {
    filteredByState = electionList.filter(
      (el) => el.state_code_list && el.state_code_list.includes(selectedStateCode),
    );
  }

  // When searching, union election-name matches with candidate-name matches
  // (grouped Election -> Office -> Candidate) before splitting upcoming/past, so
  // the tab counts reflect the search.
  const workingList = searchText ?
    buildCandidateSearchResults(filteredByState, candidateList, searchText, '') :
    filteredByState;

  const upcomingElections = workingList.filter((el) => el.election_is_upcoming).sort(sortByDateAsc);
  const pastElections = workingList.filter((el) => !el.election_is_upcoming);
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

  const reverseDateSort = (filterTab !== 'all' && filterTab !== 'upcoming'); // Reverse when looking at past elections
  displayElections = [...displayElections].sort((a, b) => {
    const dateCompare = (a.election_day_text || '').localeCompare(b.election_day_text || '');
    if (dateCompare !== 0) return reverseDateSort ? -dateCompare : dateCompare;
    return (a.state_code || '').localeCompare(b.state_code || '');
  });

  const sectionDownloadLabel = filterTab === 'past' ?
    'Download data for all past elections' :
    'Download data for all upcoming elections';

  const emptyListMessage = (() => {
    if (electionList.length === 0) return 'Loading...';
    if (searchText.length) {
      if (candidateSearchLoading) return 'Fetching data...';
      return 'Your search did not return any results. Try another search.';
    }
    return 'No elections found.';
  })();

  const runCandidateSearch = useCallback((value) => {
    setSearchText(value);
    if (!value) {
      pendingCandidateSearchRef.current = '';
      setCandidateSearchLoading(false);
      return;
    }
    pendingCandidateSearchRef.current = value;
    setCandidateSearchLoading(true);
    const request = CandidateActions.candidatesQuery('', [], '', value, 100);
    const finishSearch = () => {
      if (pendingCandidateSearchRef.current === value) {
        setCandidateSearchLoading(false);
      }
    };
    if (request && typeof request.always === 'function') {
      request.always(finishSearch);
    } else {
      finishSearch();
    }
  }, []);

  return (
    <>
      <Helmet><title>Election Finder - WeVote</title></Helmet>
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
                const { value } = e.target;
                clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = setTimeout(() => {
                  runCandidateSearch(value);
                }, 300);
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
                        pendingCandidateSearchRef.current = '';
                        setCandidateSearchLoading(false);
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
          {(searchText.length ? displayElections : displayElections.slice(0, visibleCount)).map((election) => {
            const googleCivicElectionId = election.google_civic_election_id;
            const sc = (election.state_code_list && election.state_code_list.length > 0) ?
              election.state_code_list[0].toLowerCase() :
              'na';
            const electionUrl = `/election-finder/${sc}/${googleCivicElectionId}`;
            return (
              <React.Fragment key={googleCivicElectionId}>
                <ElectionRow>
                  <ElectionRowText to={getElectionUrl(election)}>
                    <ElectionLink>
                      {election.state_code && election.state_code !== 'NA' ?
                        `${convertStateCodeToStateText(election.state_code)} – ${election.election_name || ''}` :
                        (election.election_name || '')}
                      {election.office_count ? (
                        <ElectionCountForLink>{` (${election.office_count.toLocaleString()} ${election.office_count === 1 ? 'office' : 'offices'})`}</ElectionCountForLink>
                      ) : (
                        <ElectionCountForLinkNoData> (no data)</ElectionCountForLinkNoData>
                      )}
                    </ElectionLink>
                    {election.election_day_text && (
                      <ElectionDateText>{formatDateLong(election.election_day_text)}</ElectionDateText>
                    )}
                  </ElectionRowText>
                  <ElectionRowActions className="u-show-desktop-tablet" onClick={(e) => e.stopPropagation()}>
                    <CopyChip defaultLabel="Copy link" getText={() => `${AppObservableStore.getWeVoteRootURL()}${electionUrl}`} />
                    <ActionDivider />
                    {nextReleaseFeaturesEnabled && (
                      <DarkTooltip title="Download election data">
                        <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
                      </DarkTooltip>
                    )}
                    <DarkTooltip title="Open in new tab">
                      <Suspense fallback={<></>}>
                        <OpenExternalWebSite
                          linkIdAttribute={`electionFinderNewTab-${election.google_civic_election_id}`}
                          url={`${AppObservableStore.getWeVoteRootURL()}${electionUrl}`}
                          target="_blank"
                          body={(
                            <IconButton size="small">
                              <Launch fontSize="small" />
                            </IconButton>
                          )}
                          trackingOn
                        />
                      </Suspense>
                    </DarkTooltip>
                  </ElectionRowActions>
                  <RowKebabMenu
                    ariaLabel="More options for this election"
                    items={[
                      { key: 'copy-link', icon: ContentCopy, label: 'Copy link', onClick: () => copyAndToast(`${AppObservableStore.getWeVoteRootURL()}${electionUrl}`) },
                      ...(nextReleaseFeaturesEnabled ? [{ key: 'download', icon: FileDownloadOutlined, label: 'Download election data', onClick: () => {} }] : []),
                      { key: 'open', icon: Launch, label: 'Open in new tab', externalUrl: `${AppObservableStore.getWeVoteRootURL()}${electionUrl}` },
                    ]}
                  />
                </ElectionRow>
                {searchText.length > 0 && election.matchedOffices && election.matchedOffices.map((office) => (
                  <OfficeSection key={office.officeWeVoteId || office.officeName}>
                    <OfficeName style={{ display: 'block', padding: '7px 16px 7px 32px' }}>
                      {highlightMatch(office.officeName, searchText)}
                      {` (${office.candidates.length})`}
                    </OfficeName>
                    <CandidateList>
                      {office.candidates.map((candidate) => (
                        <CandidateRow
                          key={candidate.we_vote_id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => onElectionSelect(election)}
                        >
                          <CandidateInfo>
                            <CandidateName>
                              {highlightMatch(candidate.ballot_item_display_name || candidate.candidate_name || '', searchText)}
                            </CandidateName>
                            <CandidateParty>{candidate.party || ''}</CandidateParty>
                          </CandidateInfo>
                        </CandidateRow>
                      ))}
                    </CandidateList>
                  </OfficeSection>
                ))}
              </React.Fragment>
            );
          })}
          {searchText.length < 1 && displayElections.length > visibleCount && (
            <ShowMoreButton onClick={() => setVisibleCount((prev) => prev + 50)}>
              {`Show more (${displayElections.length - visibleCount} remaining)`}
            </ShowMoreButton>
          )}
          {displayElections.length === 0 && (
            <NoResults>{emptyListMessage}</NoResults>
          )}
        </ElectionList>
      </PageContentContainer>
    </>
  );
}

export default ElectionFinderHome;
