import { ContentCopy, FileDownloadOutlined, InfoOutlined, Launch, Search, Close, ExpandMore, UnfoldMore, UnfoldLess } from '@mui/icons-material';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { withRouter } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { ElectionNameH1, ElectionStateLabel } from '../../components/Style/BallotTitleHeaderStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import historyPush from '../../common/utils/historyPush';
import { getElectionDetail, getElectionsForState } from './electionFinderData';
import {
  ActionChip, ActionDivider, Breadcrumb, BreadcrumbLink,
  CandidateActions, CandidateInfo, CandidateList, CandidateName,
  CandidateParty, CandidateRow, DetailTitle, ElectionTitleRow,
  ExpandCollapseButton, ExpandCollapseRow, ExpandMoreIcon,
  HighlightSpan, InlineSearchField, NoResults,
  OfficeHeader, OfficeHeaderActions, OfficeHeaderLeft, OfficeName,
  OfficeSection, SearchIconButton, SearchResultCount,
} from './electionFinderStyles';

class ElectionFinderForElection extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedStateCode: '',
      selectedElectionId: '',
      expandedOffices: {},
      electionSearchOpen: false,
      electionSearchText: '',
      hoveredCandidateId: '',
      hoveredOfficeId: '',
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    const { match } = this.props;
    if (match && match.params) {
      const { stateCode, electionId } = match.params;
      if (stateCode) {
        this.setState({ selectedStateCode: stateCode.toUpperCase() });
      }
      if (electionId) {
        this.setState({ selectedElectionId: electionId });
      }
    }
  }

  componentDidUpdate (prevProps) {
    const { match } = this.props;
    if (match && match.params && prevProps.match && prevProps.match.params) {
      if (match.params.stateCode !== prevProps.match.params.stateCode ||
          match.params.electionId !== prevProps.match.params.electionId) {
        if (match.params.stateCode) {
          this.setState({ selectedStateCode: match.params.stateCode.toUpperCase() });
        }
        if (match.params.electionId) {
          this.setState({ selectedElectionId: match.params.electionId });
        }
      }
    }
  }

  onBackToState = () => {
    const { selectedStateCode } = this.state;
    historyPush(`/election-finder/${selectedStateCode.toLowerCase()}`);
  };

  onBackToHome = () => {
    historyPush('/election-finder');
  };

  toggleOfficeExpanded = (officeId) => {
    this.setState((prevState) => {
      const { electionSearchText, expandedOffices } = prevState;
      const hasSearchOverride = electionSearchText && !(officeId in expandedOffices);
      const currentlyExpanded = hasSearchOverride || (expandedOffices[officeId] || false);
      return {
        expandedOffices: {
          ...expandedOffices,
          [officeId]: !currentlyExpanded,
        },
      };
    });
  };

  expandAll = () => {
    const detail = getElectionDetail(this.state.selectedElectionId);
    const expandedOffices = {};
    detail.offices.forEach((office) => {
      expandedOffices[office.id] = true;
    });
    this.setState({ expandedOffices });
  };

  collapseAll = () => {
    const detail = getElectionDetail(this.state.selectedElectionId);
    const expandedOffices = {};
    detail.offices.forEach((office) => {
      expandedOffices[office.id] = false;
    });
    this.setState({ expandedOffices });
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  highlightMatch = (text, query) => {
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
  };

  render () {
    renderLog('ElectionFinderForElection');
    const {
      selectedStateCode, selectedElectionId, expandedOffices,
      electionSearchOpen, electionSearchText,
      hoveredCandidateId, hoveredOfficeId,
    } = this.state;
    const stateName = convertStateCodeToStateText(selectedStateCode);
    const detail = getElectionDetail(selectedElectionId);
    const elections = getElectionsForState(selectedStateCode);
    const upcomingCount = elections.upcoming.length;

    // Filter offices/candidates by search
    let filteredOffices = detail.offices;
    if (electionSearchText) {
      const lowerSearch = electionSearchText.toLowerCase();
      filteredOffices = detail.offices
        .map((office) => {
          const officeNameMatches = office.name.toLowerCase().includes(lowerSearch);
          const matchingCandidates = office.candidates.filter(
            (c) => c.name.toLowerCase().includes(lowerSearch) || c.party.toLowerCase().includes(lowerSearch),
          );
          if (officeNameMatches || matchingCandidates.length > 0) {
            return {
              ...office,
              candidates: officeNameMatches ? office.candidates : matchingCandidates,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    const totalResults = electionSearchText ?
      filteredOffices.reduce((sum, o) => sum + o.candidates.length, 0) :
      null;

    return (
      <>
        <Helmet><title>{`${detail.name} - Election Finder - We Vote`}</title></Helmet>
        <PageContentContainer>
          <ElectionNameH1 style={{ paddingBottom: 4 }}>Election Finder</ElectionNameH1>
          <Breadcrumb>
            <BreadcrumbLink onClick={this.onBackToHome}>
              &larr; Election Finder Home
            </BreadcrumbLink>
            {' / '}
            <BreadcrumbLink onClick={this.onBackToState}>
              {`${stateName} Upcoming Elections (${upcomingCount})`}
            </BreadcrumbLink>
            {' / '}
            <span>{detail.name}</span>
          </Breadcrumb>
          <ElectionStateLabel style={{ marginBottom: 12 }}>{stateName}</ElectionStateLabel>

          <ElectionTitleRow>
            <DetailTitle>{detail.name}</DetailTitle>
            <Tooltip title="Download">
              <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
            </Tooltip>
            {electionSearchOpen ? (
              <InlineSearchField
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={electionSearchText}
                onChange={(e) => this.setState({ electionSearchText: e.target.value })}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => this.setState({ electionSearchOpen: false, electionSearchText: '' })}>
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <SearchIconButton onClick={() => this.setState({ electionSearchOpen: true })}>
                <Search fontSize="small" />
              </SearchIconButton>
            )}
          </ElectionTitleRow>

          <ExpandCollapseRow>
            <ExpandCollapseButton onClick={this.expandAll}>
              <UnfoldMore fontSize="small" />
              {' Expand all'}
            </ExpandCollapseButton>
            <ExpandCollapseButton onClick={this.collapseAll}>
              <UnfoldLess fontSize="small" />
              {' Collapse all'}
            </ExpandCollapseButton>
          </ExpandCollapseRow>

          {totalResults !== null && (
            <SearchResultCount>
              {`${totalResults} results for \u201C${electionSearchText}\u201D`}
            </SearchResultCount>
          )}

          {filteredOffices.map((office) => {
            const hasSearchOverride = electionSearchText && !(office.id in expandedOffices);
            const isExpanded = hasSearchOverride || (expandedOffices[office.id] || false);
            return (
              <OfficeSection key={office.id}>
                <OfficeHeader
                  onClick={() => this.toggleOfficeExpanded(office.id)}
                  onMouseEnter={() => this.setState({ hoveredOfficeId: office.id })}
                  onMouseLeave={() => this.setState({ hoveredOfficeId: '' })}
                >
                  <OfficeHeaderLeft>
                    <ExpandMoreIcon expanded={isExpanded}>
                      <ExpandMore fontSize="small" />
                    </ExpandMoreIcon>
                    <OfficeName>
                      {electionSearchText ?
                        this.highlightMatch(office.name, electionSearchText) :
                        office.name}
                      {` (${office.candidates.length})`}
                    </OfficeName>
                  </OfficeHeaderLeft>
                  <OfficeHeaderActions visible={hoveredOfficeId === office.id} onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Copy office name">
                      <ActionChip onClick={() => this.copyToClipboard(office.name)}>
                        <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
                        Copy office name
                      </ActionChip>
                    </Tooltip>
                    <Tooltip title="Copy link">
                      <ActionChip onClick={() => this.copyToClipboard(window.location.href)}>
                        <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
                        Copy link
                      </ActionChip>
                    </Tooltip>
                    <ActionDivider />
                    <Tooltip title="Info">
                      <IconButton size="small"><InfoOutlined fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Open in new tab">
                      <IconButton size="small"><Launch fontSize="small" /></IconButton>
                    </Tooltip>
                  </OfficeHeaderActions>
                </OfficeHeader>
                {isExpanded && (
                  <CandidateList>
                    {office.candidates.map((candidate) => (
                      <CandidateRow
                        key={candidate.id}
                        onMouseEnter={() => this.setState({ hoveredCandidateId: candidate.id })}
                        onMouseLeave={() => this.setState({ hoveredCandidateId: '' })}
                      >
                        <CandidateInfo>
                          <CandidateName>
                            {electionSearchText ?
                              this.highlightMatch(candidate.name, electionSearchText) :
                              candidate.name}
                          </CandidateName>
                          <CandidateParty>{candidate.party}</CandidateParty>
                        </CandidateInfo>
                        <CandidateActions visible={hoveredCandidateId === candidate.id}>
                          <Tooltip title="Copy candidate name">
                            <ActionChip onClick={() => this.copyToClipboard(candidate.name)}>
                              <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
                              Copy candidate name
                            </ActionChip>
                          </Tooltip>
                          <Tooltip title="Copy link">
                            <ActionChip onClick={() => this.copyToClipboard(window.location.href)}>
                              <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
                              Copy link
                            </ActionChip>
                          </Tooltip>
                          <ActionDivider />
                          <Tooltip title="Open in new tab">
                            <IconButton size="small"><Launch fontSize="small" /></IconButton>
                          </Tooltip>
                        </CandidateActions>
                      </CandidateRow>
                    ))}
                  </CandidateList>
                )}
              </OfficeSection>
            );
          })}

          {filteredOffices.length === 0 && (
            <NoResults>No results found.</NoResults>
          )}
        </PageContentContainer>
      </>
    );
  }
}

ElectionFinderForElection.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      stateCode: PropTypes.string,
      electionId: PropTypes.string,
    }),
  }),
};

export default withRouter(ElectionFinderForElection);
