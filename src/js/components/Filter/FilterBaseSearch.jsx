import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import sortBy from 'lodash-es/sortBy';
import { blurTextFieldAndroid, focusTextFieldAndroid, isCordova } from '../../utils/cordovaUtils';
import ballotSearchPriority from '../../utils/ballotSearchPriority';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import opinionsAndBallotItemsSearchPriority from '../../utils/opinionsAndBallotItemsSearchPriority';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import positionSearchPriority from '../../utils/positionSearchPriority';
import { arrayContains } from '../../utils/textFormat';
import voterGuidePositionSearchPriority from '../../utils/voterGuidePositionSearchPriority';

const delayBeforeSearchExecution = 600;

class FilterBaseSearch extends Component {
  static propTypes = {
    addVoterGuideMode: PropTypes.bool,
    alwaysOpen: PropTypes.bool,
    classes: PropTypes.object,
    isSearching: PropTypes.bool,
    allItems: PropTypes.array,
    onFilterBaseSearch: PropTypes.func,
    opinionsAndBallotItemsSearchMode: PropTypes.bool,
    onToggleSearch: PropTypes.func,
    positionSearchMode: PropTypes.bool,
    searchTextDefault: PropTypes.string,
    theme: PropTypes.object,
    voterGuidePositionSearchMode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      searchText: '',
      searchTextAlreadyRetrieved: [],
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    const { searchTextDefault } = this.props;
    if (searchTextDefault) {
      this.setState({
        searchText: searchTextDefault,
      }, this.handleSearchAllItemsRefresh);
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.props.allItems && nextProps.allItems) {
      if (this.props.allItems.length !== nextProps.allItems.length) {
        return true;
      }
    }
    if (this.props.isSearching !== nextProps.isSearching) {
      // console.log('shouldComponentUpdate: this.state.isSearching', this.state.isSearching, ', nextState.isSearching', nextState.isSearching);
      return true;
    }
    if (this.state.searchText !== nextState.searchText) {
      // console.log('shouldComponentUpdate: this.state.searchText', this.state.searchText, ', nextState.searchText', nextState.searchText);
      return true;
    }
    if (this.props.alwaysOpen !== nextProps.alwaysOpen) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onBallotStoreChange () {
    const { opinionsAndBallotItemsSearchMode } = this.props;
    if (opinionsAndBallotItemsSearchMode) {
      this.handleSearchAllItemsRefresh();
    }
  }

  onOrganizationStoreChange () {
    const { opinionsAndBallotItemsSearchMode } = this.props;
    if (opinionsAndBallotItemsSearchMode) {
      this.handleSearchAllItemsRefresh();
    }
  }

  filterItems = search => this.props.allItems.map((item) => {
    const { opinionsAndBallotItemsSearchMode, positionSearchMode, voterGuidePositionSearchMode } = this.props;
    const { searchTextAlreadyRetrieved } = this.state;
    let candidatesToShowForSearchResults = [];
    let foundInArray = [];
    let searchPriority = 0;
    if (opinionsAndBallotItemsSearchMode) {
      // Reach out to API server to get more Organizations or Ballot items.
      if (!arrayContains(search, searchTextAlreadyRetrieved)) {
        OrganizationActions.organizationSearch(search);
        // DALE NOTE: 2020-07-10 This second retrieve causes the results to get erased from the display list sometimes
        //  Needs to be fixed.
        BallotActions.ballotItemOptionsRetrieve('', search);
        searchTextAlreadyRetrieved.push(search);
        this.setState({ searchTextAlreadyRetrieved });
      }
      const opinionsAndBallotItemsResults = opinionsAndBallotItemsSearchPriority(search, item);
      ({ searchPriority } = opinionsAndBallotItemsResults);
      ({ foundInArray } = opinionsAndBallotItemsResults);
      ({ candidatesToShowForSearchResults } = opinionsAndBallotItemsResults);
      return { ...item, searchPriority, foundInArray, candidatesToShowForSearchResults };
    } else if (positionSearchMode) {
      const positionResults = positionSearchPriority(search, item);
      ({ searchPriority } = positionResults);
      ({ foundInArray } = positionResults);
      return { ...item, searchPriority, foundInArray, candidatesToShowForSearchResults };
    } else if (voterGuidePositionSearchMode) {
      const voterGuidePositionResults = voterGuidePositionSearchPriority(search, item);
      ({ searchPriority } = voterGuidePositionResults);
      ({ foundInArray } = voterGuidePositionResults);
      return { ...item, searchPriority, foundInArray, candidatesToShowForSearchResults };
    } else {
      const ignoreDescriptionFields = (this.props.addVoterGuideMode);
      const results = ballotSearchPriority(search, item, ignoreDescriptionFields);
      ({ searchPriority } = results);
      ({ foundInArray } = results);
      ({ candidatesToShowForSearchResults } = results);
      return { ...item, searchPriority, foundInArray, candidatesToShowForSearchResults };
    }
  });

  toggleSearch = () => {
    const { isSearching } = this.props;
    // console.log('toggleSearch, isSearching:', isSearching);
    if (isSearching) {
      this.setState({ searchText: '' });
      this.props.onFilterBaseSearch('', []);
    } else {
      this.searchInput.focus();
    }
    this.props.onToggleSearch(isSearching);
  };

  handleSearchAllItemsRefresh = () => { // eslint-disable-line consistent-return
    // console.log('handleSearchAllItemsRefresh');
    let { searchText } = this.state;
    searchText = searchText.trimStart();

    // If search value is empty, exit
    if (!searchText) return [];
    if (!searchText.length) return [];
    if (searchText.length <= 1) return [];

    // Filter out items without the search terms, and put the most likely search result at the top
    // Only return results if they get past the filter
    const sortedFiltered = sortBy(this.filterItems(searchText), ['searchPriority']).reverse().filter(item => item.searchPriority > 0);
    // console.log('sortedFiltered:', sortedFiltered);
    return this.props.onFilterBaseSearch(searchText, sortedFiltered.length ? sortedFiltered : []);
  }

  handleSearch (event) { // eslint-disable-line consistent-return
    // if search bar always open, isSearching is toggled only when input is given text is cleared with 'x' button
    if (this.props.alwaysOpen && event.target.value && !this.props.isSearching) {
      this.toggleSearch();
    }
    clearTimeout(this.timer);

    const { searchText: priorSearchText } = this.state;
    let { value: searchText } = event.target;
    searchText = searchText.trimStart();

    if (priorSearchText !== searchText) {
      this.setState({ searchText });
    }
    // If search value is empty, exit
    if (!searchText.length) return [];

    this.timer = setTimeout(() => {
      if (!searchText) {
        return [];
      }

      // If search value one character or less, exit
      if (searchText.length <= 1) return [];

      // Filter out items without the search terms, and put the most likely search result at the top
      // Only return results if they get past the filter
      const sortedFiltered = sortBy(this.filterItems(searchText), ['searchPriority']).reverse().filter(item => item.searchPriority > 0);
      // console.log('sortedFiltered:', sortedFiltered);
      return this.props.onFilterBaseSearch(searchText, sortedFiltered.length ? sortedFiltered : []);
    }, delayBeforeSearchExecution);
  }

  render () {
    const { classes, theme, isSearching, alwaysOpen } = this.props;
    const { searchText } = this.state;
    let searchClasses;
    if (isSearching) {
      searchClasses = classes.inputSearching;
    } else if (alwaysOpen) {
      searchClasses = classes.input;
    } else {
      searchClasses = classes.inputHidden;
    }
    // console.log('FilterBaseSearch render');
    return (
      <SearchWrapper
        searchOpen={isSearching || alwaysOpen}
        brandBlue={theme.palette.primary.main}
        isCordova={isCordova()}
        isSearching={isSearching}
      >
        <IconButton
          classes={{ root: classes.iconButtonRoot }}
          onClick={!alwaysOpen ? this.toggleSearch : undefined}
        >
          <SearchIcon classes={{ root: classes.iconRoot }} />
        </IconButton>
        <Separator isSearching={isSearching} alwaysOpen={alwaysOpen} />
        <InputBase
          classes={{ input: searchClasses }}
          inputRef={(input) => { this.searchInput = input; }}
          onChange={this.handleSearch}
          value={searchText}
          onFocus={focusTextFieldAndroid}
          onBlur={blurTextFieldAndroid}
          placeholder="Search"
        />
        <Closer isSearching={isSearching} showCloser={isSearching} brandBlue={theme.palette.primary.main}>
          <IconButton
            classes={{ root: classes.iconButtonRoot }}
            onClick={(isSearching || !alwaysOpen) ? this.toggleSearch : undefined}
          >
            <CloseIcon classes={{ root: classes.closeIconRoot }} />
          </IconButton>
        </Closer>
      </SearchWrapper>
    );
  }
}

const styles = theme => ({
  searchRoot: {
    height: 26,
  },
  iconButtonRoot: {
    padding: 0,
    borderRadius: 16,
    margin: 'auto 4px',
    outline: 'none !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  iconRoot: {
    width: 18,
    height: 18,
  },
  closeIconRoot: {
    width: 18,
    height: 18,
  },
  input: {
    padding: 0,
    marginLeft: 8,
    width: 75,
    transition: 'all ease-in 150ms',
    [theme.breakpoints.down('md')]: {
      width: '50%',
      fontSize: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      width: 55,
      fontSize: 'inherit',
    },
  },
  inputHidden: {
    padding: 0,
    width: 0,
    transition: 'all ease-in 150ms',
  },
  inputSearching: {
    padding: 0,
    marginLeft: 8,
    width: 350,
    transition: 'all ease-in 150ms',
    [theme.breakpoints.down('md')]: {
      width: '50%',
      fontSize: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      width: 150,
      fontSize: 'inherit',
    },
  },
});

const Closer = styled.div`
  display: ${({ isSearching }) => (isSearching ? 'inherit' : 'none')};
  border-radius: 16px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  opacity: ${({ showCloser }) => (showCloser ? '1' : '0')};
  pointer-events: ${({ showCloser }) => (showCloser ? 'auto' : 'none')};
  transition: all 150ms ease-in;
`;

const Separator = styled.div`
  display: ${({ isSearching, alwaysOpen }) => (isSearching || alwaysOpen ? 'inherit' : 'none')};
  height: 100%;
  width: 1px;
  background: rgba(0, 0, 0, .3);
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 4px;
  height: 26px;
  border: 1px solid ${({ isSearching, brandBlue }) => (isSearching ? brandBlue : '#ccc')};
  padding: 0 3px 0 3px;
  margin-right: 16px;
  margin-bottom: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-right: 8px;
  }
`;

export default withTheme(withStyles(styles)(FilterBaseSearch));
