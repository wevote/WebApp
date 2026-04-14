import { ContentCopy, FileDownloadOutlined, InfoOutlined, Launch, Search, Close, ExpandMore, UnfoldMore, UnfoldLess } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import BallotActions from '../../actions/BallotActions';
import CandidateActions from '../../actions/CandidateActions';
import ElectionActions from '../../actions/ElectionActions';
import SupportActions from '../../actions/SupportActions';
import { renderLog } from '../../common/utils/logging';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import ElectionStore from '../../stores/ElectionStore';
import ElectionFinderHeader from './ElectionFinderHeader';
import {
  ActionChip, ActionDivider, DarkTooltip,
  CandidateActions as CandidateActionsRow, CandidateInfo, CandidateList, CandidateName,
  CandidateParty, CandidateRow, DetailTitle, ElectionTitleRow,
  ExpandCollapseButton, ExpandCollapseRow, ExpandMoreIcon,
  HighlightSpan, InlineSearchField, NoResults,
  OfficeHeader, OfficeHeaderActions, OfficeHeaderLeft, OfficeName, OfficePrimaryPartySpan,
  OfficeSection, SearchIconButton, SearchResultCount, ShowMoreButton,
} from './electionFinderStyles';
import webAppConfig from '../../config';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

function ElectionFinderForElection () {
  renderLog('ElectionFinderForElection');
  const params = useParams();
  const selectedStateCode = (params.stateCode || '').toUpperCase();
  const selectedElectionId = params.electionId || '';
  const googleCivicElectionId = parseInt(selectedElectionId, 10) || 0;
  const stateName = convertStateCodeToStateText(selectedStateCode);

  const [ballotItems, setBallotItems] = useState([]);
  const [ballotLoaded, setBallotLoaded] = useState(false);
  const [expandedOffices, setExpandedOffices] = useState({});
  const [visibleCount, setVisibleCount] = useState(50);
  const [electionSearchOpen, setElectionSearchOpen] = useState(false);
  const [electionSearchText, setElectionSearchText] = useState('');

  const searchInputRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const officesFetchedRef = useRef({});
  const candidatesFetchedRef = useRef({});

  // Derived from stores — no need to cache in state
  const electionName = ElectionStore.getElectionName(googleCivicElectionId) || 'Election';
  const isUpcoming = ElectionStore.isElectionUpcoming(googleCivicElectionId);
  const electionList = ElectionStore.getElectionList();
  const stateElections = electionList.filter(
    (el) => el.state_code_list && el.state_code_list.includes(selectedStateCode),
  );
  const upcomingCount = stateElections.filter((el) => el.election_is_upcoming).length;
  const pastCount = stateElections.filter((el) => !el.election_is_upcoming).length;

  // Mount: subscribe to stores, fetch data
  useEffect(() => {
    window.scrollTo(0, 0);
    const electionListener = ElectionStore.addListener(() => {
      // Force re-render to pick up derived values above
      setBallotItems((prev) => [...prev]);
    });
    const ballotListener = BallotStore.addListener(() => {
      const allItems = BallotStore.getAllBallotItemsFlattened(googleCivicElectionId);
      const offices = allItems.filter((item) => item.kind_of_ballot_item === 'OFFICE');
      const loaded = BallotStore.allBallotItemsHaveBeenRetrievedForElection(googleCivicElectionId, selectedStateCode);
      setBallotItems(offices);
      setBallotLoaded(loaded);
    });

    ElectionActions.electionsRetrieve();
    SupportActions.voterAllPositionsRetrieve();
    if (googleCivicElectionId) {
      BallotActions.allBallotItemsRetrieve(googleCivicElectionId, selectedStateCode);
    }

    return () => {
      electionListener.remove();
      ballotListener.remove();
      clearTimeout(searchDebounceRef.current);
    };
  }, [googleCivicElectionId, selectedStateCode]);

  const fetchCandidatesForOffice = useCallback((officeWeVoteId) => {
    if (!officesFetchedRef.current[officeWeVoteId]) {
      officesFetchedRef.current[officeWeVoteId] = true;
      CandidateActions.candidatesRetrieve(officeWeVoteId);
    }
  }, []);

  const toggleOfficeExpanded = useCallback((officeWeVoteId) => {
    setExpandedOffices((prev) => {
      const hasSearchOverride = electionSearchText && !(officeWeVoteId in prev);
      const currentlyExpanded = hasSearchOverride || (prev[officeWeVoteId] || false);
      const willExpand = !currentlyExpanded;
      if (willExpand) {
        fetchCandidatesForOffice(officeWeVoteId);
      }
      return { ...prev, [officeWeVoteId]: willExpand };
    });
  }, [electionSearchText, fetchCandidatesForOffice]);

  const expandAll = useCallback(() => {
    const expanded = {};
    ballotItems.slice(0, visibleCount).forEach((office) => {
      expanded[office.we_vote_id] = true;
      fetchCandidatesForOffice(office.we_vote_id);
    });
    setExpandedOffices(expanded);
  }, [ballotItems, visibleCount, fetchCandidatesForOffice]);

  const collapseAll = useCallback(() => {
    setExpandedOffices({});
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
  }, []);

  const getCandidatePath = useCallback((candidate) => {
    const candidateWeVoteId = candidate.we_vote_id;
    const fullCandidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
    const seoPath = fullCandidate.seo_friendly_path || candidate.seo_friendly_path;
    const politicianId = fullCandidate.politician_we_vote_id || candidate.politician_we_vote_id;
    if (seoPath) {
      return `/${seoPath}/-/`;
    } else if (politicianId) {
      return `/${politicianId}/p/`;
    }
    // Data not available yet — trigger a fetch so it's ready next time
    if (!candidatesFetchedRef.current[candidateWeVoteId]) {
      candidatesFetchedRef.current[candidateWeVoteId] = true;
      CandidateActions.candidateRetrieve(candidateWeVoteId);
    }
    return `/candidate/${candidateWeVoteId}`;
  }, []);

  const onCandidateClick = useCallback((candidate) => {
    const candidateWeVoteId = candidate.we_vote_id;
    const fullCandidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
    if (!fullCandidate || !fullCandidate.seo_friendly_path) {
      CandidateActions.candidateRetrieve(candidateWeVoteId);
    }
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(false);
    AppObservableStore.setHideOrganizationModalPositions(false);
    AppObservableStore.setShowOrganizationModal(true);
  }, []);

  const highlightMatch = useCallback((text, query) => {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, idx) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return <HighlightSpan key={`hl-${idx}-${part}`}>{part}</HighlightSpan>; // eslint-disable-line react/no-array-index-key
      }
      return part;
    });
  }, []);

  // Filter offices/candidates by search
  let filteredOffices = ballotItems;
  if (electionSearchText) {
    const lowerSearch = electionSearchText.toLowerCase();
    filteredOffices = ballotItems
      .map((office) => {
        const officeNameMatches = office.ballot_item_display_name.toLowerCase().includes(lowerSearch);
        const candidates = office.candidate_list || [];
        const matchingCandidates = candidates.filter(
          (c) => c.ballot_item_display_name.toLowerCase().includes(lowerSearch) ||
                 (c.party || '').toLowerCase().includes(lowerSearch),
        );
        if (officeNameMatches || matchingCandidates.length > 0) {
          return {
            ...office,
            candidate_list: officeNameMatches ? candidates : matchingCandidates,
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  const totalResults = electionSearchText ?
    filteredOffices.reduce((sum, o) => sum + (o.candidate_list || []).length, 0) :
    null;

  return (
    <>
      <Helmet><title>{`${electionName} - Election Finder - We Vote`}</title></Helmet>
      <PageContentContainer>
        <ElectionFinderHeader
          breadcrumbs={[
            { label: '\u2190 Election Finder Home', href: '/election-finder' },
            { label: `${stateName} ${isUpcoming ? 'Upcoming' : 'Past'} Elections (${isUpcoming ? upcomingCount : pastCount})`, href: `/election-finder/${selectedStateCode.toLowerCase()}` },
            { label: electionName },
          ]}
          stateLabel={stateName}
        />

        <ElectionTitleRow>
          <DetailTitle>{electionName}</DetailTitle>
          {nextReleaseFeaturesEnabled && (
            <DarkTooltip title="Download election data">
              <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
            </DarkTooltip>
          )}
          {electionSearchOpen ? (
            <InlineSearchField
              variant="outlined"
              size="small"
              placeholder="Search..."
              inputRef={searchInputRef}
              defaultValue=""
              onChange={(e) => {
                clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = setTimeout(() => setElectionSearchText(e.target.value), 300);
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
                        setElectionSearchOpen(false);
                        setElectionSearchText('');
                        setExpandedOffices({});
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <SearchIconButton onClick={() => setElectionSearchOpen(true)}>
              <Search fontSize="small" />
            </SearchIconButton>
          )}
        </ElectionTitleRow>

        <ExpandCollapseRow>
          <ExpandCollapseButton onClick={expandAll}>
            <UnfoldMore fontSize="small" />
            {' Expand all'}
          </ExpandCollapseButton>
          <ExpandCollapseButton onClick={collapseAll}>
            <UnfoldLess fontSize="small" />
            {' Collapse all'}
          </ExpandCollapseButton>
        </ExpandCollapseRow>

        {totalResults !== null && (
          <SearchResultCount>
            {`${totalResults} results for \u201C${electionSearchText}\u201D`}
            <DarkTooltip title="Download search results">
              <IconButton size="small" style={{ marginLeft: 8 }}><FileDownloadOutlined fontSize="small" /></IconButton>
            </DarkTooltip>
          </SearchResultCount>
        )}

        {(electionSearchText ? filteredOffices : filteredOffices.slice(0, visibleCount)).map((office) => {
          const officeWeVoteId = office.we_vote_id;
          const hasSearchOverride = electionSearchText && !(officeWeVoteId in expandedOffices);
          const isExpanded = hasSearchOverride || (expandedOffices[officeWeVoteId] || false);
          return (
            <OfficeSectionItem
              key={officeWeVoteId}
              office={office}
              isExpanded={isExpanded}
              searchText={electionSearchText}
              onToggle={toggleOfficeExpanded}
              onCandidateClick={onCandidateClick}
              getCandidatePath={getCandidatePath}
              copyToClipboard={copyToClipboard}
              highlightMatch={highlightMatch}
            />
          );
        })}

        {!electionSearchText && filteredOffices.length > visibleCount && (
          <ShowMoreButton onClick={() => setVisibleCount((prev) => prev + 50)}>
            {`Show more (${filteredOffices.length - visibleCount} remaining)`}
          </ShowMoreButton>
        )}

        {filteredOffices.length === 0 && (
          <NoResults>{ballotLoaded ? 'No results found.' : 'Loading...'}</NoResults>
        )}
      </PageContentContainer>
    </>
  );
}

// Memoized office section — only re-renders when its own props change
function OfficeSectionItemInner ({ // eslint-disable-line react/no-multi-comp
  office, isExpanded, searchText,
  onToggle, onCandidateClick, getCandidatePath, copyToClipboard, highlightMatch,
}) {
  // console.log('OfficeSectionItemInner render office: ', office);
  const officeWeVoteId = office.we_vote_id;
  const officeName = office.ballot_item_display_name;
  const primaryParty = office.primary_party || '';
  const candidates = office.candidate_list || [];
  const officeNameWithPrimaryParty = (
    <span>
      {officeName}
      {primaryParty && (
        <OfficePrimaryPartySpan>
          ,
          {' '}
          {primaryParty}
          {' '}
          Primary
        </OfficePrimaryPartySpan>
      )}
    </span>
  );
  return (
    <OfficeSection>
      <OfficeHeader onClick={() => onToggle(officeWeVoteId)}>
        <OfficeHeaderLeft>
          <ExpandMoreIcon expanded={isExpanded}>
            <ExpandMore fontSize="small" />
          </ExpandMoreIcon>
          <OfficeName>
            {searchText ? highlightMatch(officeNameWithPrimaryParty, searchText) : officeNameWithPrimaryParty}
            {` (${candidates.length})`}
          </OfficeName>
        </OfficeHeaderLeft>
        <OfficeHeaderActions className="u-show-desktop-tablet" onClick={(e) => e.stopPropagation()}>
          <DarkTooltip title="Copy office name">
            <ActionChip onClick={() => copyToClipboard(officeName)}>
              <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
              Copy office name
            </ActionChip>
          </DarkTooltip>
          <DarkTooltip title="Copy link">
            <ActionChip onClick={() => copyToClipboard(`${window.location.origin}/office/${officeWeVoteId}`)}>
              <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
              Copy link
            </ActionChip>
          </DarkTooltip>
          <ActionDivider />
          {nextReleaseFeaturesEnabled && (
            <DarkTooltip title="Info">
              <IconButton size="small"><InfoOutlined fontSize="small" /></IconButton>
            </DarkTooltip>
          )}
          <DarkTooltip title="Open in new tab">
            <IconButton size="small" onClick={() => window.open(`/office/${officeWeVoteId}`, '_blank')}>
              <Launch fontSize="small" />
            </IconButton>
          </DarkTooltip>
        </OfficeHeaderActions>
      </OfficeHeader>
      {isExpanded && (
        <CandidateList>
          {candidates.map((candidate) => {
            const candidateWeVoteId = candidate.we_vote_id;
            const candidateName = candidate.ballot_item_display_name;
            const candidateParty = candidate.party || '';
            return (
              <CandidateRow key={candidateWeVoteId}>
                <CandidateInfo onClick={() => onCandidateClick(candidate)} style={{ cursor: 'pointer' }}>
                  <CandidateName>
                    {searchText ? highlightMatch(candidateName, searchText) : candidateName}
                  </CandidateName>
                  <CandidateParty>{candidateParty}</CandidateParty>
                </CandidateInfo>
                <CandidateActionsRow className="u-show-desktop-tablet">
                  <DarkTooltip title="Copy candidate name">
                    <ActionChip onClick={() => copyToClipboard(candidateName)}>
                      <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
                      Copy candidate name
                    </ActionChip>
                  </DarkTooltip>
                  <DarkTooltip title="Copy link">
                    <ActionChip onClick={() => copyToClipboard(`${window.location.origin}${getCandidatePath(candidate)}`)}>
                      <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
                      Copy link
                    </ActionChip>
                  </DarkTooltip>
                  <ActionDivider />
                  <DarkTooltip title="Open in new tab">
                    <IconButton size="small" onClick={() => window.open(getCandidatePath(candidate), '_blank')}>
                      <Launch fontSize="small" />
                    </IconButton>
                  </DarkTooltip>
                </CandidateActionsRow>
              </CandidateRow>
            );
          })}
        </CandidateList>
      )}
    </OfficeSection>
  );
}

OfficeSectionItemInner.propTypes = {
  office: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  searchText: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  onCandidateClick: PropTypes.func.isRequired,
  getCandidatePath: PropTypes.func.isRequired,
  copyToClipboard: PropTypes.func.isRequired,
  highlightMatch: PropTypes.func.isRequired,
};

const OfficeSectionItem = React.memo(OfficeSectionItemInner);

export default ElectionFinderForElection;
