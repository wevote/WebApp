import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import IssueStore from '../../stores/IssueStore';
import getGroupedFilterSecondClass from './utils/grouped-filter-second-class';

class VoterGuideOrganizationFilter extends Component {
  static propTypes = {
    allItems: PropTypes.array,
    onToggleFilter: PropTypes.func,
    onFilteredItemsChange: PropTypes.func,
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
    if (prevProps.selectedFilters !== this.props.selectedFilters) {
      this.props.onFilteredItemsChange(this.getNewFilteredItems());
    }
    // console.log(this.state.issues);
  }

  getFilteredItemsByLinkedIssue = (issueFilter) => {
    const { allItems } = this.props;
    return allItems.filter(item => item.issue_we_vote_ids_linked === issueFilter.issue_we_vote_id);
  }

  getNewFilteredItems = () => {
    const { allItems, selectedFilters } = this.props;
    let filteredItems = [];
    if (!selectedFilters.length) return allItems;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'news':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'NW')];
          break;
        case 'group':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'O')];
          break;
        case 'publicFigure':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'PF')];
          break;
        case 'pac':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'P')];
          break;
        case 'support':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.is_support_or_positive_rating)];
          break;
        case 'oppose':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.is_oppose_or_negative_rating)];
          break;
        case 'comment':
          filteredItems = [...filteredItems, ...allItems.filter(item => item.statement_text.length)];
          break;
        case 'reach':
          if (filteredItems.length) {
            filteredItems = filteredItems.sort((firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count);
          } else {
            filteredItems = allItems.sort((firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count);
          }
          break;
        default:
          if (typeof filter === 'object') {
            filteredItems = [...filteredItems, ...this.getFilteredItemsByLinkedIssue(filter)];
          }
          break;
      }
    });
    return _.uniqBy(filteredItems, x => x.position_we_vote_id);
  }

  handleChange = (name) => {
    this.props.onToggleFilter(name);
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
    const { showAllFilters, classes } = this.props;

    return (
      <Wrapper showAllFilters={showAllFilters}>
        <FilterRow>
          <FilterColumn>
            <b>Sort By</b>
            <SortByContainer>
              <SortBy onClick={() => this.handleChange('reach')}>Reach</SortBy>
            </SortByContainer>
            <SortByContainer>
              <SortBy onClick={() => this.handleChange('useful')}>Useful</SortBy>
            </SortByContainer>
            <SortByContainer>
              <SortBy onClick={() => this.handleChange('network')}>Network</SortBy>
            </SortByContainer>
          </FilterColumn>
          <FilterColumn>
            <b>Organization</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf('news') > -1}
                  onChange={() => this.handleChange('news')}
                  value="news"
                  color="primary"
                />
              )}
              label="News"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf('group') > -1}
                  onChange={() => this.handleChange('group')}
                  value="group"
                  color="primary"
                />
              )}
              label="Group"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf('publicFigure') > -1}
                  onChange={() => this.handleChange('publicFigure')}
                  value="publicFigure"
                  color="primary"
                />
              )}
              label="Public Figure"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf('pac') > -1}
                  onChange={() => this.handleChange('pac')}
                  value="pac"
                  color="primary"
                />
              )}
              label="PAC"
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
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 14px;
  }
  &:hover {
    filter: opacity(0.7);
  }
`;

export default withStyles(styles)(VoterGuideOrganizationFilter);
