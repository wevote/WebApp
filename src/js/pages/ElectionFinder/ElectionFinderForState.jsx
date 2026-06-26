import { ContentCopy, ExpandMore, FileDownloadOutlined, Launch, Search, Close } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
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
  ElectionDateText, ElectionLink, ElectionList, ElectionRow, ElectionRowActions, ElectionRowText,
  FilterTab, FilterTabsRow, InlineSearchField, NoResults,
  OfficeName, OfficeSection,
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

  const stateElections = electionList.filter((el) => matchesStateCode(el, selectedStateCode));

  // When searching, union election-name matches with candidate-name matches
  // (grouped Election -> Office -> Candidate) before splitting upcoming/past, so
  // the tab counts reflect the search.
  const workingList = searchText ?
    buildCandidateSearchResults(stateElections, candidateList, searchText, selectedStateCode) :
    stateElections;

  const upcomingElections = workingList.filter((el) => el.election_is_upcoming).sort(sortByDateAsc);
  const pastElections = workingList.filter((el) => !el.election_is_upcoming);
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

  const emptyListMessage = (() => {
    if (electionList.length === 0) return 'Loading...';
    if (searchText) {
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
    const request = CandidateActions.candidatesQuery('', [], selectedStateCode, value, 100);
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
  }, [selectedStateCode]);

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
          {(searchText ? displayElections : displayElections.slice(0, visibleCount)).map((election) => {
            const googleCivicElectionId = election.google_civic_election_id;
            return (
              <React.Fragment key={googleCivicElectionId}>
                <ElectionRow onClick={() => onElectionSelect(googleCivicElectionId)}>
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
                {searchText && election.matchedOffices && election.matchedOffices.map((office) => (
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
                          onClick={() => onElectionSelect(googleCivicElectionId)}
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
          {!searchText && displayElections.length > visibleCount && (
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

export default ElectionFinderForState;
