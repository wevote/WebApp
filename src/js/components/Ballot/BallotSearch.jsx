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

class BallotSearch extends Component {
  static propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object,
    isSearching: PropTypes.bool,
    onToggleSearch: PropTypes.func,
    items: PropTypes.array,
    onBallotSearch: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  filterItems = search => this.props.items.map((item) => {
    const priority = ballotSearchPriority(search, item);
    return { ...item, priority };
  });

  toggleSearch = () => {
    const { isSearching } = this.props;
    if (!isSearching) {
      this.searchInput.select();
    } else {
      this.setState({ searchValue: '' });
    }
    this.props.onToggleSearch(!isSearching);
  }

  handleSearch = (evt) => {
    const { items } = this.props;
    const { value } = evt.target;
    this.setState({ searchValue: value });
    const sortedFiltered = _.sortBy(this.filterItems(value), ['priority']).reverse().filter(item => item.priority > 0);
    if (!value.length) return this.props.onBallotSearch([]);
    if (value.length < 3) return null;
    return this.props.onBallotSearch(sortedFiltered.length ? sortedFiltered : items);
  }

  render () {
    const { classes, theme, isSearching } = this.props;
    const { searchValue } = this.state;
    return (
      <SearchWrapper searching={isSearching} brandBlue={theme.palette.primary.main}>
        <IconButton
          classes={{ root: classes.iconButtonRoot }}
          onClick={this.toggleSearch}
        >
          <SearchIcon classes={{ root: classes.iconRoot }} />
        </IconButton>
        <InputBase
          classes={{ input: isSearching ? classes.input : classes.inputHidden }}
          inputRef={(input) => { this.searchInput = input; }}
          onChange={this.handleSearch}
          value={searchValue}
        />
        <Closer searching={isSearching} brandBlue={theme.palette.primary.main}>
          <IconButton
            classes={{ root: classes.iconButtonRoot }}
            onClick={this.toggleSearch}
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
    [theme.breakpoints.down('md')]: {
      height: 22.5,
    },
  },
  iconButtonRoot: {
    padding: 0,
    borderRadius: 16,
    outline: 'none !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  iconRoot: {
    width: 20,
    height: 20,
  },
  closeIconRoot: {
    width: 20,
    height: 20,
  },
  input: {
    padding: '0 3px',
    width: 150,
    transition: 'all ease-in 150ms',
  },
  inputHidden: {
    padding: 0,
    width: 0,
    transition: 'all ease-in 150ms',
  },
});

const Closer = styled.div`
  border-radius: 16px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 1px solid ${({ brandBlue }) => (brandBlue)};
  display: ${({ searching }) => (searching ? 'inherit' : 'none')};
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 16px;
  height: 26px;
  border: 1px solid ${props => (!props.searching ? 'rgba(0, 0, 0, 0.23)' : props.brandBlue)};
  padding: 0 3px 0 3px;
  margin-right: 16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 22.5px;
    margin-right: 4px;
  }
`;

export default withTheme()(withStyles(styles)(BallotSearch));
