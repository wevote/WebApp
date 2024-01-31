import { CancelOutlined, Search } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { blurTextFieldAndroid, focusTextFieldAndroid, isIPhoneMiniOrSmaller } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';

/* eslint-disable jsx-a11y/control-has-associated-label  */

export default class SearchBar extends Component {
  constructor (props) {
    super(props);

    this.state = {
      searchString: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
  }

  componentDidMount () {
    // console.log("SearchBar, this.props.clearSearchTextNow:", this.props.clearSearchTextNow);
    if (this.props.clearSearchTextNow) {
      if (this.props.clearFunction) {
        this.props.clearFunction();
      }
      const { searchString } = this.state;
      if (searchString) {
        this.setState({
          searchString: '',
        });
      }
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.clearSearchTextNow !== prevProps.clearSearchTextNow) {
      if (this.props.clearSearchTextNow) {
        if (this.props.clearFunction) {
          this.props.clearFunction();
        }
        const { searchString } = this.state;
        if (searchString) {
          this.setState({
            searchString: '',
          });
        }
      }
    }
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  handleKeyPress () {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.searchFunction(this.state.searchString);
    }, this.props.searchUpdateDelayTime);
  }

  clearQuery () {
    this.props.clearFunction();
    this.setState({ searchString: '' });
  }

  updateResults (event) {
    const searchString = event.target.value;
    this.setState({
      searchString,
    });
  }

  render () {
    renderLog('SearchBar');  // Set LOG_RENDER_EVENTS to log all renders
    const { clearButton, placeholder, searchButton } = this.props;
    const { searchString } = this.state;
    return (
      <div className="search-bar clearfix">
        <SearchInput
          id="search_input"
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchString}
          onKeyDown={this.handleKeyPress}
          onChange={this.updateResults}
          onFocus={() => focusTextFieldAndroid('SearchBar')}
          onBlur={blurTextFieldAndroid}
        />
        <div className="search-bar-options">
          {(clearButton && searchString && searchString.length > 0) && (
            <button
              className="search-clear-btn"
              onClick={this.clearQuery}
              type="button"
              id="search-clear"
            >
              <CancelOutlined />
            </button>
          )}
          {(searchButton) && (
            <button
              className="search-options-btn"
              type="button"
              id="search"
              style={{ paddingLeft: 0 }}
            >
              <Search />
            </button>
          )}
        </div>
      </div>
    );
  }
}
SearchBar.propTypes = {
  clearButton: PropTypes.bool,
  clearFunction: PropTypes.func.isRequired,
  clearSearchTextNow: PropTypes.bool,
  placeholder: PropTypes.string,
  searchButton: PropTypes.bool,
  searchFunction: PropTypes.func.isRequired,
  searchUpdateDelayTime: PropTypes.number.isRequired,
};

const SearchInput = styled('input')`
  ${isIPhoneMiniOrSmaller() ? 'font-size: 0.8rem' : ''};
`;