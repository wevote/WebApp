import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import uniqBy from 'lodash-es/uniqBy';
import FormControlLabel from '@material-ui/core/esm/FormControlLabel';
import { withStyles } from '@material-ui/core/esm/styles';
import Checkbox from '@material-ui/core/esm/Checkbox';
import IssueStore from '../../stores/IssueStore';
import getGroupedFilterSecondClass from './utils/grouped-filter-second-class';
import { renderLog } from '../../utils/logging';

const groupTypeIdentifiers = ['C', 'C3', 'C4', 'G', 'NP', 'O', 'P'];
const privateCitizenIdentifiers = ['I', 'V'];

class VoterGuideOrganizationFilter extends Component {
  static propTypes = {
    allItems: PropTypes.array,
    onFilteredItemsChange: PropTypes.func,
    onSelectSortByFilter: PropTypes.func,
    onToggleFilter: PropTypes.func,
    selectedFilters: PropTypes.array,
    showAllFilters: PropTypes.bool,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      issues: IssueStore.getAllIssues(),
    };
  }

  componentDidUpdate (prevProps) {
    // console.log('VoterGuideOrganizationFilter componentDidUpdate');
    if (prevProps.selectedFilters !== this.props.selectedFilters) {
      this.props.onFilteredItemsChange(this.getNewFilteredItems());
    }
    // console.log(this.state.issues);
  }

  getFilteredItemsByLinkedIssue = (issueFilter) => {
    const { allItems } = this.props;
    return allItems.filter(item => item.issue_we_vote_ids_linked === issueFilter.issue_we_vote_id);
  };

  orderByFollowedOrgsFirst = (firstGuide, secondGuide) => secondGuide.followed - firstGuide.followed;

  orderByTwitterFollowers = (firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;

  orderByWrittenComment = (firstGuide, secondGuide) => {
    const secondGuideHasStatement = secondGuide && secondGuide.statement_text && secondGuide.statement_text.length ? 1 : 0;
    const firstGuideHasStatement = firstGuide && firstGuide.statement_text && firstGuide.statement_text.length ? 1 : 0;
    return secondGuideHasStatement - firstGuideHasStatement;
  };

  getNewFilteredItems = () => {
    const { allItems, selectedFilters } = this.props;
    let filteredItems = [];
    if (!selectedFilters || !selectedFilters.length) return allItems;
    // First, bring in only the kinds of organizations with checkmark
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'newsOrganization':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'NW')];
          break;
        case 'endorsingGroup':
          filteredItems = [...filteredItems, ...allItems.filter(item => groupTypeIdentifiers.includes(item.speaker_type))];
          break;
        case 'publicFigure':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'PF')];
          break;
        case 'individualVoter':
          filteredItems = [...filteredItems, ...allItems.filter(item => privateCitizenIdentifiers.includes(item.speaker_type))];
          break;
        default:
          break;
      }
    });
    // Which showSupportFilter/showOpposeFilter/showCommentFilter to show?
    // Make sure one of them is chosen. If not, do not limit by support/oppose/comment
    let containsAtLeastOneSupportOpposeComment = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'showSupportFilter':
          containsAtLeastOneSupportOpposeComment = true;
          break;
        case 'showOpposeFilter':
          containsAtLeastOneSupportOpposeComment = true;
          break;
        case 'showInformationOnlyFilter':
          containsAtLeastOneSupportOpposeComment = true;
          break;
        default:
          break;
      }
    });
    if (containsAtLeastOneSupportOpposeComment) {
      const filterItemsSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'showSupportFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.is_support_or_positive_rating)];
            break;
          case 'showOpposeFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.is_oppose_or_negative_rating)];
            break;
          case 'showInformationOnlyFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.is_information_only)];
            break;
          default:
            break;
        }
      });
    }
    // Comment or no comment?
    let containsCommentFilter = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'showCommentFilter':
          containsCommentFilter = true;
          break;
        default:
          break;
      }
    });
    if (containsCommentFilter) {
      const filterItemsCommentSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'showCommentFilter':
            filteredItems = [...filteredItems, ...filterItemsCommentSnapshot.filter(item => item.statement_text && item.statement_text.length)];
            break;
          default:
            break;
        }
      });
    }
    // Sort Order
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'sortByReach':
          // Put written comments on top, and then within those two separations, move Twitter followers to the top
          filteredItems = filteredItems.sort(this.orderByTwitterFollowers);
          filteredItems = filteredItems.sort(this.orderByWrittenComment);
          break;
        case 'sortByNetwork':
          filteredItems = filteredItems.sort(this.orderByTwitterFollowers);
          filteredItems = filteredItems.sort(this.orderByWrittenComment);
          filteredItems = filteredItems.sort(this.orderByFollowedOrgsFirst);
          break;
        default:
          if (typeof filter === 'object') {
            filteredItems = [...filteredItems, ...this.getFilteredItemsByLinkedIssue(filter)];
          }
          break;
      }
    });
    return uniqBy(filteredItems, x => x.position_we_vote_id);
  }

  toggleFilter = (name) => {
    this.props.onToggleFilter(name);
  }

  selectSortByFilter = (name) => {
    this.props.onSelectSortByFilter(name);
  }

  generateIssuesFilters = () => this.state.issues.slice(0, 1).map((item, itemIndex) => (
    <div
        key={item.filterName}
        className={`groupedFilter ${getGroupedFilterSecondClass(itemIndex, this.state.issues.length)} ${this.props.selectedFilters.indexOf(item.issue_we_vote_id) > -1 ? 'listFilterSelected' : ''}`}
        onClick={() => this.toggleFilter(item.filterName)}
    >
      {
          item.iconName ? (
            <div>
              <ion-icon className="ion" name={item.iconName} />
            </div>
          ) : null
      }
      {
        item.filterDisplayName ? (
          <span className="listFilter__text">
            &nbsp;
            {item.filterDisplayName}
          </span>
        ) : null
      }
    </div>
  ));

  render () {
    renderLog('VoterGuideOrganizationFilter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showAllFilters, selectedFilters } = this.props;

    return (
      <Wrapper showAllFilters={showAllFilters}>
        <FilterRow>
          <FilterColumn>
            <b>Sort By</b>
            <SortByContainer>
              <SortBy selected={selectedFilters.indexOf('sortByReach') > -1} onClick={() => this.selectSortByFilter('sortByReach')}>Reach</SortBy>
            </SortByContainer>
            {/*
            <SortByContainer>
              <SortBy selected={selectedFilters.indexOf('sortByUsefulness') > -1} onClick={() => this.toggleFilter('sortByUsefulness')}>Useful</SortBy>
            </SortByContainer>
            */}
            <SortByContainer>
              <SortBy selected={selectedFilters.indexOf('sortByNetwork') > -1} onClick={() => this.selectSortByFilter('sortByNetwork')}>Network</SortBy>
            </SortByContainer>
          </FilterColumn>
          <FilterColumn>
            <b>Organization</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf('newsOrganization') > -1}
                  onChange={() => this.toggleFilter('newsOrganization')}
                  value="newsOrganization"
                  color="primary"
                />
              )}
              label="News"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf('endorsingGroup') > -1}
                  onChange={() => this.toggleFilter('endorsingGroup')}
                  value="endorsingGroup"
                  color="primary"
                />
              )}
              label="Groups"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf('publicFigure') > -1}
                  onChange={() => this.toggleFilter('publicFigure')}
                  value="publicFigure"
                  color="primary"
                />
              )}
              label="Public Figures"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf('individualVoter') > -1}
                  onChange={() => this.toggleFilter('individualVoter')}
                  value="individualVoter"
                  color="primary"
                />
              )}
              label="Private Citizens"
            />
          </FilterColumn>
        </FilterRow>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  formControlLabel: {
    [theme.breakpoints.down('lg')]: {
      fontSize: 14,
    },
  },
});

const Wrapper = styled.div`
  display: ${({ showAllFilters }) => (showAllFilters ? 'flex' : 'none')};
  flex-flow: column;
  padding-top: 1rem;
`;

const FilterRow = styled.div`
  display: flex;
  flex-flow: row;
`;

const FilterColumn = styled.div`
  display: flex;
  flex-flow: column;
  margin-right: 2rem;
`;

const SortByContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
`;

const SortBy = styled.p`
  font-size: .875rem;
  margin: 8px 0 0 0;
  cursor: pointer;
  color: ${({ selected, theme }) => (selected ? theme.colors.brandBlue : '#333')};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 14px;
  }
  &:hover {
    filter: opacity(0.7);
  }
`;

export default withStyles(styles)(VoterGuideOrganizationFilter);
