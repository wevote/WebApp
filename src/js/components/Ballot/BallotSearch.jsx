import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import _ from 'lodash';
import ballotSearchPriority from '../../utils/ballotSearchPriority';

const delayBeforeSearchExecution = 400;

class BallotSearch extends Component {
  static propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object,
    isSearching: PropTypes.bool,
    onToggleSearch: PropTypes.func,
    items: PropTypes.array,
    onBallotSearch: PropTypes.func,
    alwaysOpen: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      searchValue: '',
      showCloser: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.props.isSearching !== nextProps.isSearching) {
      // console.log("shouldComponentUpdate: this.state.isSearching", this.state.isSearching, ", nextState.isSearching", nextState.isSearching);
      return true;
    }
    if (this.state.searchValue !== nextState.searchValue) {
      // console.log("shouldComponentUpdate: this.state.searchValue", this.state.searchValue, ", nextState.searchValue", nextState.searchValue);
      return true;
    }
    if (this.state.showCloser !== nextState.showCloser) {
      return true;
    }
    if (this.props.alwaysOpen !== nextProps.alwaysOpen) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.searchInputTimer = null;
  }

  filterItems = search => this.props.items.map((item) => {
    const priority = ballotSearchPriority(search, item);
    return { ...item, priority };
  });

  toggleSearch = () => {
    const { isSearching } = this.props;
    if (isSearching) {
      this.setState({ searchValue: '', showCloser: false });
    }
    this.props.onToggleSearch(!isSearching);
  }

  handleSearch (event) { // eslint-disable-line consistent-return
    // if search bar always open, isSearching is toggled only when input is given text is cleared with 'x' button
    if (this.props.alwaysOpen && event.target.value && !this.props.isSearching) {
      this.toggleSearch();
    }
    clearTimeout(this.searchInputTimer);
    const { value } = event.target;
    this.setState({ searchValue: value, showCloser: value.length > 0 });

    // If search value is empty, exit
    if (!value.length) return this.props.onBallotSearch([]);

    // If search value shorter than minimum length, exit
    // if (value.length < 3) return null;

    this.searchInputTimer = setTimeout(() => {
      // Filter out items without the search terms, and put the most likely search result at the top
      const sortedFiltered = _.sortBy(this.filterItems(value), ['priority']).reverse().filter(item => item.priority > 0);
      // Only return results if they get past the filter
      return this.props.onBallotSearch(sortedFiltered.length ? sortedFiltered : []);
    }, delayBeforeSearchExecution);
  }

  render () {
    const { classes, theme, isSearching, alwaysOpen } = this.props;
    const { searchValue, showCloser } = this.state;
    return (
      <SearchWrapper searchOpen={isSearching || alwaysOpen} brandBlue={theme.palette.primary.main}>
        <IconButton
          classes={{ root: classes.iconButtonRoot }}
          onClick={!alwaysOpen ? this.toggleSearch : undefined}
        >
          <SearchIcon classes={{ root: classes.iconRoot }} />
        </IconButton>
        <Separator isSearching={isSearching} />
        <InputBase
          classes={{ input: (isSearching || alwaysOpen) ? classes.input : classes.inputHidden }}
          inputRef={(input) => { this.searchInput = input; }}
          onChange={this.handleSearch}
          value={searchValue}
          placeholder="Search"
        />
        <Closer isSearching={isSearching} showCloser={showCloser} brandBlue={theme.palette.primary.main}>
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
    height: 36,
    [theme.breakpoints.down('md')]: {
      height: 28,
    },
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
    width: 24,
    height: 24,
  },
  closeIconRoot: {
    width: 24,
    height: 24,
  },
  input: {
    padding: 0,
    marginLeft: 8,
    width: '50vw',
    transition: 'all ease-in 150ms',
    [theme.breakpoints.down('md')]: {
      width: '60vw',
    },
  },
  inputHidden: {
    padding: 0,
    width: 0,
    transition: 'all ease-in 150ms',
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
  display: ${({ isSearching }) => (isSearching ? 'inherit' : 'none')};
  height: 100%;
  width: 1px;
  background: rgba(0, 0, 0, .3);
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 4px;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, .3);
  padding: 0 3px 0 3px;
  margin-right: 16px;
  margin-bottom: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 28px;
    margin-right: 4px;
  }
`;

export default withTheme()(withStyles(styles)(BallotSearch));
