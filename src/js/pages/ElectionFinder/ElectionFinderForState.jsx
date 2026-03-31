import { FileDownloadOutlined, Launch, Search, Close } from '@mui/icons-material';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { withRouter } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';
import { stateCodeMap, convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { ElectionNameH1 } from '../../components/Style/BallotTitleHeaderStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import historyPush from '../../common/utils/historyPush';
import { getElectionsForState } from './electionFinderData';
import {
  ElectionLink, ElectionList, ElectionRow, ElectionRowActions,
  FilterTab, FilterTabsRow, InlineSearchField, NoResults,
  SearchIconButton, SectionTitle, SectionTitleRow, StateSelect,
} from './electionFinderStyles';

class ElectionFinderForState extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedStateCode: '',
      filterTab: 'upcoming',
      searchOpen: false,
      searchText: '',
      hoveredElectionId: '',
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    const { match } = this.props;
    if (match && match.params && match.params.stateCode) {
      this.setState({ selectedStateCode: match.params.stateCode.toUpperCase() });
    }
  }

  componentDidUpdate (prevProps) {
    const { match } = this.props;
    if (match && match.params && prevProps.match && prevProps.match.params) {
      if (match.params.stateCode !== prevProps.match.params.stateCode) {
        this.setState({ selectedStateCode: match.params.stateCode.toUpperCase() });
      }
    }
  }

  onStateChange = (e) => {
    const stateCode = e.target.value;
    if (stateCode) {
      this.setState({
        selectedStateCode: stateCode,
        filterTab: 'upcoming',
        searchOpen: false,
        searchText: '',
      });
      historyPush(`/election-finder/${stateCode.toLowerCase()}`);
    } else {
      historyPush('/election-finder');
    }
  };

  onFilterTabChange = (tab) => {
    this.setState({ filterTab: tab });
  };

  onElectionSelect = (electionId) => {
    const { selectedStateCode } = this.state;
    historyPush(`/election-finder/${selectedStateCode.toLowerCase()}/${electionId}`);
  };

  render () {
    renderLog('ElectionFinderForState');
    const { selectedStateCode, filterTab, searchOpen, searchText, hoveredElectionId } = this.state;
    const stateName = convertStateCodeToStateText(selectedStateCode);
    const elections = getElectionsForState(selectedStateCode);
    const upcomingCount = elections.upcoming.length;
    const pastCount = elections.past.length;

    let displayElections = [];
    let sectionTitle = '';
    if (filterTab === 'all') {
      displayElections = [...elections.upcoming, ...elections.past];
      sectionTitle = `${stateName} \u2013 All Elections`;
    } else if (filterTab === 'upcoming') {
      displayElections = elections.upcoming;
      sectionTitle = `${stateName} \u2013 Upcoming Elections`;
    } else {
      displayElections = elections.past;
      sectionTitle = `${stateName} \u2013 Past Elections`;
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      displayElections = displayElections.filter((el) => el.name.toLowerCase().includes(lowerSearch));
    }

    return (
      <>
        <Helmet><title>{`${stateName} Elections - Election Finder - We Vote`}</title></Helmet>
        <PageContentContainer>
          <ElectionNameH1>Election Finder</ElectionNameH1>
          <StateSelect value={selectedStateCode} onChange={this.onStateChange}>
            <option value="">Select state</option>
            {Object.entries(stateCodeMap)
              .filter(([code]) => code !== 'NA')
              .sort((a, b) => a[1].localeCompare(b[1]))
              .map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
          </StateSelect>

          <FilterTabsRow>
            <FilterTab active={filterTab === 'all'} onClick={() => this.onFilterTabChange('all')}>
              All
            </FilterTab>
            <FilterTab active={filterTab === 'upcoming'} onClick={() => this.onFilterTabChange('upcoming')}>
              {`Upcoming (${upcomingCount})`}
            </FilterTab>
            <FilterTab active={filterTab === 'past'} onClick={() => this.onFilterTabChange('past')}>
              {`Past (${pastCount})`}
            </FilterTab>
            {searchOpen ? (
              <InlineSearchField
                variant="outlined"
                size="small"
                placeholder="Search elections..."
                value={searchText}
                onChange={(e) => this.setState({ searchText: e.target.value })}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => this.setState({ searchOpen: false, searchText: '' })}>
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <SearchIconButton onClick={() => this.setState({ searchOpen: true })}>
                <Search fontSize="small" />
              </SearchIconButton>
            )}
          </FilterTabsRow>

          <SectionTitleRow>
            <SectionTitle>{sectionTitle}</SectionTitle>
            <Tooltip title="Download">
              <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
            </Tooltip>
          </SectionTitleRow>

          <ElectionList>
            {displayElections.map((election) => (
              <ElectionRow
                key={election.id}
                onClick={() => this.onElectionSelect(election.id)}
                onMouseEnter={() => this.setState({ hoveredElectionId: election.id })}
                onMouseLeave={() => this.setState({ hoveredElectionId: '' })}
              >
                <ElectionLink>
                  {election.name}
                </ElectionLink>
                <ElectionRowActions visible={hoveredElectionId === election.id} onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Download">
                    <IconButton size="small"><FileDownloadOutlined fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Open in new tab">
                    <IconButton size="small" onClick={() => window.open(`/election-finder/${selectedStateCode.toLowerCase()}/${election.id}`, '_blank')}>
                      <Launch fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ElectionRowActions>
              </ElectionRow>
            ))}
            {displayElections.length === 0 && (
              <NoResults>No elections found.</NoResults>
            )}
          </ElectionList>
        </PageContentContainer>
      </>
    );
  }
}

ElectionFinderForState.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      stateCode: PropTypes.string,
    }),
  }),
};

export default withRouter(ElectionFinderForState);
