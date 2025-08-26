import { Close, Search } from '@mui/icons-material';
import { IconButton, InputBase } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import TagManager from 'react-gtm-module';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import OrganizationActions from '../../actions/OrganizationActions';
import { blurTextFieldAndroid, focusTextFieldAndroid, isAndroidSizeWide } from '../../common/utils/cordovaUtils';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import BallotStore from '../../stores/BallotStore';
import OrganizationStore from '../../stores/OrganizationStore';
import ballotSearchPriority from '../../utils/ballotSearchPriority';
import opinionsAndBallotItemsSearchPriority from '../../utils/opinionsAndBallotItemsSearchPriority';
import positionSearchPriority from '../../utils/positionSearchPriority';
import voterGuidePositionSearchPriority from '../../utils/voterGuidePositionSearchPriority';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import VoterStore from '../../stores/VoterStore';

const delayBeforeSearchExecution = 600;

class FilterBaseSearch extends Component {
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
    // console.log('componentDidMount searchTextDefault:', searchTextDefault);
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
    if (this.state.searchTextDefault !== nextState.searchTextDefault) {
      return true;
    }
    return this.props.alwaysOpen !== nextProps.alwaysOpen;
  }

  componentWillUnmount () {
    if (this.timer) clearTimeout(this.timer);
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  handleSearch (event, buttonId) {
    // if search bar always open, isSearching is toggled only when input is given text is cleared with 'x' button
    if (this.props.alwaysOpen && event.target.value && !this.props.isSearching) {
      this.toggleSearch();
    }
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;

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

      this.searchNewItems(searchText, buttonId);
      // Filter out items without the search terms, and put the most likely search result at the top
      // Only return results if they get past the filter
      const sortedFiltered = this.filterItems(searchText);
      // console.log('sortedFiltered:', sortedFiltered);
      return this.props.onFilterBaseSearch(searchText, sortedFiltered.length ? sortedFiltered : []);
    }, delayBeforeSearchExecution);
    return [];
  }

  onBallotStoreChange () {
    // console.log('FilterBaseSearch onBallotStoreChange');
    const { opinionsAndBallotItemsSearchMode } = this.props;
    if (opinionsAndBallotItemsSearchMode) {
      this.handleSearchAllItemsRefresh();
    }
  }

  onOrganizationStoreChange () {
    // console.log('FilterBaseSearch onOrganizationStoreChange');
    const { opinionsAndBallotItemsSearchMode } = this.props;
    if (opinionsAndBallotItemsSearchMode) {
      this.handleSearchAllItemsRefresh();
    }
  }

  filterItems = (search) => {
    // console.log('FilterBaseSearch filterItems allItems:', this.props.allItems);
    const {
      opinionsAndBallotItemsSearchMode,
      positionSearchMode,
      voterGuidePositionSearchMode,
      addVoterGuideMode,
    } = this.props;

    const searchWords = search.toLowerCase().match(/\b(\w+)\b/g) || [];

    return this.props.allItems.map((item) => {
      // If no candidate list, return item as-is. If removed creates filter error
      if (!item.candidate_list || item.candidate_list.length === 0) {
        return item;
      }
      const filteredCandidates = item.candidate_list.filter(
        (candidate) => searchWords.every(
          (searchWord) => candidate.ballot_item_display_name.toLowerCase().includes(searchWord),
        ),
      );
      const candidateMatchFound = filteredCandidates.length > 0;
      const ballotItemNameMatch = searchWords.every(
        (searchWord) => item.ballot_item_display_name.toLowerCase().includes(searchWord),
      );

      let searchResults;
      if (opinionsAndBallotItemsSearchMode) {
        searchResults = opinionsAndBallotItemsSearchPriority(search, item);
      } else if (positionSearchMode) {
        searchResults = positionSearchPriority(search, item);
      } else if (voterGuidePositionSearchMode) {
        searchResults = voterGuidePositionSearchPriority(search, item);
      } else {
        const ignoreDescriptionFields = addVoterGuideMode;
        searchResults = ballotSearchPriority(search, item, ignoreDescriptionFields);
      }
      return {
        ...item,
        ...searchResults,
        candidate_list: filteredCandidates,
        candidateMatchFound,
        foundInSearchWords: candidateMatchFound || ballotItemNameMatch,
      };
    }).filter(
      // Keep items that have matching candidates or match ballot item name and have a search priority
      (item) => (item.foundInSearchWords && item.searchPriority > 0) ||
          (item.candidate_list && item.candidate_list.length > 0),
    ).sort(
      // Sort by priority level, descending order
      (a, b) => b.searchPriority - a.searchPriority,
    );
  };

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

  handleSearchAllItemsRefresh = (buttonId = 'searchInput') => { // eslint-disable-line consistent-return
    // console.log('handleSearchAllItemsRefresh');
    let { searchText } = this.state;
    searchText = searchText.trimStart();

    // If search value is empty, exit
    if (!searchText) return [];
    if (!searchText.length) return [];
    if (searchText.length <= 1) return [];

    // Filter out items without the search terms, and put the most likely search result at the top
    // Only return results if they get past the filter
    this.searchNewItems(searchText, buttonId);
    const sortedFiltered = this.filterItems(searchText);
    // console.log('sortedFiltered:', sortedFiltered);
    return this.props.onFilterBaseSearch(searchText, sortedFiltered.length ? sortedFiltered : []);
  }

  searchNewItems = (searchText, buttonId) => {
    // const { opinionsAndBallotItemsSearchMode } = this.props;
    const { searchTextAlreadyRetrieved } = this.state;
    // console.log('searchNewItems searchText:', searchText, ', searchTextAlreadyRetrieved:', searchTextAlreadyRetrieved);
    // if (opinionsAndBallotItemsSearchMode) {
    // Reach out to API server to get more Organizations or Ballot items.
    if (!searchTextAlreadyRetrieved.includes(searchText)) {
      this.sendSearchDataLayer(searchText, buttonId);
      OrganizationActions.organizationSearch(searchText);
      BallotActions.ballotItemOptionsRetrieve('', searchText);
      searchTextAlreadyRetrieved.push(searchText);
      this.setState({ searchTextAlreadyRetrieved });
    }
    // }
  }

  bigAndroidClick = (isSearching, alwaysOpen) => {
    // console.log('bigAndroidClick ------------------');
    if (isAndroid() && !isSearching && !alwaysOpen) {
      this.toggleSearch();
    }
  }

  sendSearchDataLayer (searchText, buttonId) {
    const dataLayerObject = {
      actionDetails: {
        actionType: 'search',
        buttonId,
        searchKeyword: searchText,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    const electionDetails = BallotStore.getAnalyticsElectionDetails();
    if (electionDetails && electionDetails.electionDate) {
      dataLayerObject.electionDetails = electionDetails;
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  render () {
    const { alwaysOpen, classes, isSearching, searchTextLarge, theme } = this.props;
    const { searchText } = this.state;
    let inputBaseInputClasses;
    const inputBaseRootClasses = searchTextLarge ? classes.inputBaseRootLarge : classes.inputBaseRoot;
    const searchIconClasses = searchTextLarge ? classes.iconRootLarge : classes.iconRoot;
    if (isSearching) {
      inputBaseInputClasses = searchTextLarge ? classes.inputSearchingLarge : classes.inputSearching;
      inputBaseInputClasses = isAndroidSizeWide() ? classes.inputDefaultFold : inputBaseInputClasses;
    } else if (alwaysOpen) {
      inputBaseInputClasses = searchTextLarge ? classes.inputDefaultLarge : classes.inputDefault;
    } else {
      inputBaseInputClasses = classes.inputHidden;
    }
    // console.log('FilterBaseSearch render');
    return (
      <BigAndroidClickableTarget id="androidClickableTarget" onClick={() => this.bigAndroidClick(isSearching, alwaysOpen)}>
        <SearchWrapper
          brandBlue={theme.palette.primary.main}
          isSearching={isSearching}
          searchTextLarge={searchTextLarge}
          // searchOpen={isSearching || alwaysOpen}
        >
          <IconButton
            classes={{ root: classes.iconButtonRoot }}
            id="searchIcon"
            onClick={(!isAndroid() && !alwaysOpen) ? this.toggleSearch : undefined}
            size="large"
            aria-label="Search Button"
            tabIndex={0}
          >
            <Search classes={{ root: searchIconClasses }} />
          </IconButton>
          <Separator isSearching={isSearching} alwaysOpen={alwaysOpen} />
          <InputBase
            classes={{ input: inputBaseInputClasses, root: inputBaseRootClasses }}
            id="searchInput"
            inputRef={(input) => { this.searchInput = input; }}
            onChange={(event) => this.handleSearch(event, 'searchInput')}
            value={searchText}
            onFocus={() => focusTextFieldAndroid('FilterBaseSearch')}
            onBlur={blurTextFieldAndroid}
            placeholder="Search"
            tabIndex={isSearching ? 0 : -1}
          />
          <Closer
            id="searchCloseButton"
            isSearching={isSearching}
            onClick={(isSearching || !alwaysOpen) ? this.toggleSearch : undefined}
            showCloser={isSearching}
            tabIndex={isSearching ? 0 : -1}
          >
            <IconButton classes={{ root: classes.iconButtonRoot }} size="large">
              <Close classes={{ root: classes.closeIconRoot }} />
            </IconButton>
          </Closer>
        </SearchWrapper>
      </BigAndroidClickableTarget>
    );
  }
}
FilterBaseSearch.propTypes = {
  addVoterGuideMode: PropTypes.bool,
  allItems: PropTypes.array,
  alwaysOpen: PropTypes.bool,
  classes: PropTypes.object,
  isSearching: PropTypes.bool,
  onFilterBaseSearch: PropTypes.func,
  opinionsAndBallotItemsSearchMode: PropTypes.bool,
  onToggleSearch: PropTypes.func,
  positionSearchMode: PropTypes.bool,
  searchTextDefault: PropTypes.string,
  searchTextLarge: PropTypes.bool,
  theme: PropTypes.object,
  voterGuidePositionSearchMode: PropTypes.bool,
};

// Breakpoints and media queries, have unexpected effects in Cordova, please avoid them, or condition them as isWebApp only
const styles = (theme) => ({
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
  iconRootLarge: {
    width: 24,
    height: 24,
  },
  closeIconRoot: {
    width: 18,
    height: 18,
  },
  inputBaseRoot: {

  },
  inputBaseRootLarge: {
    width: '100%',
  },
  inputDefault: {
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
  inputDefaultLarge: {
    fontSize: 22,
    marginLeft: 8,
    padding: 0,
    width: '100%',
    transition: 'all ease-in 150ms',
  },
  inputDefaultFold: {
    padding: 0,
    marginLeft: 8,
    width: 75,
    transition: 'all ease-in 150ms',
  },
  inputHidden: {
    padding: 0,
    width: 0,
    transition: 'all ease-in 150ms',
  },
  inputSearching: {
    marginLeft: 8,
    padding: 0,
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
  inputSearchingLarge: {
    fontSize: 22,
    marginLeft: 8,
    padding: 0,
    width: '100%',
    transition: 'all ease-in 150ms',
  },
});

const Closer = styled('div', {
  shouldForwardProp: (prop) => !['isSearching', 'showCloser'].includes(prop),
})(({ isSearching, showCloser }) => (`
  display: ${isSearching ? 'inherit' : 'none'};
  border-radius: 16px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  opacity: ${showCloser ? '1' : '0'};
  pointer-events: ${showCloser ? 'auto' : 'none'};
  transition: all 150ms ease-in;
`));

const Separator = styled('div', {
  shouldForwardProp: (prop) => !['isSearching', 'alwaysOpen'].includes(prop),
})(({ isSearching, alwaysOpen }) => (`
  display: ${isSearching || alwaysOpen ? 'inherit' : 'none'},
  // height: 100%;
  // width: 1px;
  // background: rgba(0, 0, 0, .3);
`));

const BigAndroidClickableTarget = styled.div`
  padding: ${() => (isAndroid() ? '10px' : '')};
  position: ${() => (isAndroid() ? 'relative' : '')};
  top: ${() => (isAndroid() ? '-10px' : '')};
`;
/* For diagnosis: background-color: ${() => (isAndroid() ? 'lightgoldenrodyellow' : '')}; */

const SearchWrapper = styled('div', {
  shouldForwardProp: (prop) => !['isSearching', 'brandBlue', 'searchTextLarge'].includes(prop),
})(({ isSearching, brandBlue, searchTextLarge, theme }) => (`
  display: flex;
  flex-flow: row;
  border-radius: 4px;
  height: ${searchTextLarge ? '32px' : '26px'};
  border: 1px solid ${isSearching ? brandBlue : '#ccc'};
  padding: 0 3px 0 3px;
  margin-right: 16px;
  margin-bottom: 8px;
  ${theme.breakpoints.down('md')} {
    margin-right: 8px;
  }
`));

export default withTheme(withStyles(styles)(FilterBaseSearch));
