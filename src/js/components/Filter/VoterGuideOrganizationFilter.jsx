import { Checkbox, FormControlLabel } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import { uniqBy } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ShareStore from '../../common/stores/ShareStore';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import VoterStore from '../../stores/VoterStore';
import getGroupedFilterSecondClass from './utils/grouped-filter-second-class';


const groupTypeIdentifiers = ['C', 'C3', 'C4', 'G', 'NP', 'O', 'P'];
const privateCitizenIdentifiers = ['I', 'V'];

class VoterGuideOrganizationFilter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issues: IssueStore.getAllIssues(),
      currentFriendsOrganizationWeVoteIds: [],
      currentFriendsOrganizationWeVoteIdsLength: 0,
      currentSharedItemOrganizationWeVoteIds: [],
      currentSharedItemOrganizationWeVoteIdsLength: 0,
      currentVoterOrganizationWeVoteId: '',
      sortedBy: '',
    };
  }

  componentDidMount () {
    const currentFriendsOrganizationWeVoteIds = FriendStore.currentFriendsOrganizationWeVoteIDList();
    const currentSharedItemOrganizationWeVoteIds = ShareStore.currentSharedItemOrganizationWeVoteIDList();
    const currentVoterOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    this.setState({
      currentFriendsOrganizationWeVoteIds,
      currentFriendsOrganizationWeVoteIdsLength: currentFriendsOrganizationWeVoteIds.length,
      currentSharedItemOrganizationWeVoteIds,
      currentSharedItemOrganizationWeVoteIdsLength: currentSharedItemOrganizationWeVoteIds.length,
      currentVoterOrganizationWeVoteId,
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('VoterGuideOrganizationFilter componentDidUpdate:', prevProps.selectedFilters, this.props.selectedFilters);
    if ((JSON.stringify(prevProps.selectedFilters) !== JSON.stringify(this.props.selectedFilters)) ||
      (prevState.currentFriendsOrganizationWeVoteIdsLength !== this.state.currentFriendsOrganizationWeVoteIdsLength) ||
      (prevState.currentSharedItemOrganizationWeVoteIdsLength !== this.state.currentSharedItemOrganizationWeVoteIdsLength) ||
      (prevState.sortedBy !== this.state.sortedBy)
    ) {
      this.props.onFilteredItemsChange(this.getNewFilteredItems());
    }
    // console.log(this.state.issues);
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.shareStoreListener.remove();
  }

  onFriendStoreChange () {
    const currentFriendsOrganizationWeVoteIds = FriendStore.currentFriendsOrganizationWeVoteIDList();
    const currentVoterOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    this.setState({
      currentFriendsOrganizationWeVoteIds,
      currentFriendsOrganizationWeVoteIdsLength: currentFriendsOrganizationWeVoteIds.length,
      currentVoterOrganizationWeVoteId,
    });
  }

  onShareStoreChange () {
    const currentSharedItemOrganizationWeVoteIds = ShareStore.currentSharedItemOrganizationWeVoteIDList();
    this.setState({
      currentSharedItemOrganizationWeVoteIds,
      currentSharedItemOrganizationWeVoteIdsLength: currentSharedItemOrganizationWeVoteIds.length,
    });
  }

  getFilteredItemsByLinkedIssue = (issueFilter) => {
    const { allItems } = this.props;
    return allItems.filter((item) => item.issue_we_vote_ids_linked === issueFilter.issue_we_vote_id);
  };

  orderByCurrentFriendsFirst = (firstGuide, secondGuide) => {
    const secondGuideIsFromFriend = secondGuide && secondGuide.currentFriend === true ? 1 : 0;
    const firstGuideIsFromFriend = firstGuide && firstGuide.currentFriend === true ? 1 : 0;
    return secondGuideIsFromFriend - firstGuideIsFromFriend;
  };

  orderByCurrentVoterFirst = (firstGuide, secondGuide) => {
    const { currentVoterOrganizationWeVoteId } = this.state;
    const secondGuideIsFromCurrentVoter = secondGuide && secondGuide.speaker_we_vote_id === currentVoterOrganizationWeVoteId ? 1 : 0;
    const firstGuideIsFromCurrentVoter = firstGuide && firstGuide.speaker_we_vote_id === currentVoterOrganizationWeVoteId ? 1 : 0;
    return secondGuideIsFromCurrentVoter - firstGuideIsFromCurrentVoter;
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
    // console.log('allItems:', allItems);
    const { currentFriendsOrganizationWeVoteIds, currentSharedItemOrganizationWeVoteIds, currentVoterOrganizationWeVoteId } = this.state;
    // console.log('currentFriendsOrganizationWeVoteIds:', currentFriendsOrganizationWeVoteIds);
    let filteredItems = [];
    if (!selectedFilters || !selectedFilters.length) return allItems;
    // First, bring in only the kinds of organizations with checkmark
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'endorsingGroup':
          filteredItems = [...filteredItems, ...allItems.filter((item) => groupTypeIdentifiers.includes(item.speaker_type))];
          break;
        case 'individualVoter':
          filteredItems = [...filteredItems, ...allItems.filter((item) => privateCitizenIdentifiers.includes(item.speaker_type) && !currentSharedItemOrganizationWeVoteIds.includes(item.speaker_we_vote_id))];
          break;
        case 'newsOrganization':
          filteredItems = [...filteredItems, ...allItems.filter((item) => item.speaker_type === 'NW')];
          break;
        case 'publicFigure':
          filteredItems = [...filteredItems, ...allItems.filter((item) => item.speaker_type === 'PF')];
          break;
        case 'yourFriends':
          filteredItems = [...filteredItems, ...allItems.filter((item) => currentFriendsOrganizationWeVoteIds.includes(item.speaker_we_vote_id) || currentSharedItemOrganizationWeVoteIds.includes(item.speaker_we_vote_id) || currentVoterOrganizationWeVoteId === item.speaker_we_vote_id)];
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
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => item.is_support_or_positive_rating)];
            break;
          case 'showOpposeFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => item.is_oppose_or_negative_rating)];
            break;
          case 'showInformationOnlyFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => item.is_information_only)];
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
            filteredItems = [...filteredItems, ...filterItemsCommentSnapshot.filter((item) => item.statement_text && item.statement_text.length)];
            break;
          default:
            break;
        }
      });
    }
    // Sort Order
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'sortByMagic':
          // Put written comments on top, and then within those two separations, move Twitter followers to the top
          // console.log('sortByMagic');
          filteredItems = filteredItems.sort(this.orderByTwitterFollowers);
          filteredItems = filteredItems.sort(this.orderByWrittenComment);
          filteredItems = filteredItems.sort(this.orderByFollowedOrgsFirst);
          filteredItems = filteredItems.sort(this.orderByCurrentFriendsFirst);
          filteredItems = filteredItems.sort(this.orderByCurrentVoterFirst); // Always put current voter at top
          this.setState({
            sortedBy: 'sortByMagic',
          });
          break;
        case 'sortByReach':
          // Put written comments on top, and then within those two separations, move Twitter followers to the top
          // console.log('sortByReach');
          // filteredItems = filteredItems.sort(this.orderByWrittenComment);
          // filteredItems = filteredItems.sort(this.orderByCurrentFriendsFirst);
          filteredItems = filteredItems.sort(this.orderByTwitterFollowers);
          filteredItems = filteredItems.sort(this.orderByCurrentVoterFirst); // Always put current voter at top
          this.setState({
            sortedBy: 'sortByReach',
          });
          break;
        case 'sortByNetwork':
          // console.log('sortByNetwork');
          // filteredItems = filteredItems.sort(this.orderByTwitterFollowers);
          // filteredItems = filteredItems.sort(this.orderByWrittenComment);
          filteredItems = filteredItems.sort(this.orderByFollowedOrgsFirst);
          filteredItems = filteredItems.sort(this.orderByCurrentFriendsFirst);
          filteredItems = filteredItems.sort(this.orderByCurrentVoterFirst); // Always put current voter at top
          this.setState({
            sortedBy: 'sortByNetwork',
          });
          break;
        default:
          // Skip over all other filters
          // console.log('sort by default, filter:', filter);
          // if (typeof filter === 'object') {
          //   // console.log('sort by object');
          //   filteredItems = [...filteredItems, ...this.getFilteredItemsByLinkedIssue(filter)];
          // }
          break;
      }
    });
    return uniqBy(filteredItems, (x) => x.position_we_vote_id);
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
    // console.log('VoterGuideOrganizationFilter render');

    return (
      <Wrapper showAllFilters={showAllFilters}>
        <FilterRow>
          <FilterColumn>
            <b>Sort By</b>
            <SortByContainer>
              <SortBy selected={selectedFilters.indexOf('sortByMagic') > -1} onClick={() => this.selectSortByFilter('sortByMagic')}>Magic</SortBy>
            </SortByContainer>
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
            <b>Endorsements From...</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('yourFriends') > -1}
                  onChange={() => this.toggleFilter('yourFriends')}
                  value="yourFriends"
                  color="primary"
                />
              )}
              label="Your Friends"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('newsOrganization') > -1}
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
                  checked={selectedFilters.indexOf('endorsingGroup') > -1}
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
                  checked={selectedFilters.indexOf('publicFigure') > -1}
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
                  checked={selectedFilters.indexOf('individualVoter') > -1}
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
VoterGuideOrganizationFilter.propTypes = {
  allItems: PropTypes.array,
  onFilteredItemsChange: PropTypes.func,
  onSelectSortByFilter: PropTypes.func,
  onToggleFilter: PropTypes.func,
  selectedFilters: PropTypes.array,
  showAllFilters: PropTypes.bool,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  formControlLabel: {
    [theme.breakpoints.down('lg')]: {
      fontSize: 14,
    },
  },
});

const Wrapper = styled('div', {
  shouldForwardProp: (prop) => !['showAllFilters'].includes(prop),
})(({ showAllFilters }) => (`
  display: ${showAllFilters ? 'flex' : 'none'};
  flex-flow: column;
  padding-top: 1rem;
`));

const FilterRow = styled('div')`
  display: flex;
  flex-flow: row;
`;

const FilterColumn = styled('div')`
  display: flex;
  flex-flow: column;
  margin-right: 2rem;
`;

const SortBy = styled('p')(({ selected, theme }) => (`
  font-size: ${selected ? '.95rem' : '.875rem'};
  margin: 8px 0 0 0;
  cursor: pointer;
  color: ${selected ? theme.colors.brandBlue : '#555'};
  font-weight: ${selected ? '800' : '400'};
  ${theme.breakpoints.down('lg')} {
    font-size: 14px;
  }
  &:hover {
    filter: opacity(0.7);
  }
`));

const SortByContainer = styled('div')`
  height: 40px;
  display: flex;
  align-items: center;
`;

export default withStyles(styles)(VoterGuideOrganizationFilter);
