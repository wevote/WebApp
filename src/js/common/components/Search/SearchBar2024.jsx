import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { blurTextFieldAndroid, focusTextFieldAndroid } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import SearchBase from './SearchBase';
import VoterStore from '../../../stores/VoterStore';
import TagManager from 'react-gtm-module';

/* eslint-disable jsx-a11y/control-has-associated-label  */
class SearchBar2024 extends Component {
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

  
 handleKeyPress = () => {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(() => {
    const { searchString } = this.state;
    if (searchString.length === 0) {
      return;
    }
    this.props.searchFunction(searchString);
    if(this.props.trackSearch){
    const dataLayerObject = {
      event: 'searchKeyword',
      searchKeyword: searchString,
      user:{
        voterWeVoteId: VoterStore.getVoterWeVoteId()
      }
    };
    //console.log(dataLayerObject)
    TagManager.dataLayer({dataLayer: dataLayerObject});
  }
  }, 3000);
  const { searchString } = this.state;
  this.props.searchFunction(searchString);
};

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

  // check limit of 50 characters
  render () {
    renderLog('SearchBar2024');  // Set LOG_RENDER_EVENTS to log all renders
    const { placeholder } = this.props;
    const { searchString } = this.state;
    return (
      <SearchBar2024Wrapper>
        <SearchBase
          id="search_input"
          placeholder={placeholder}
          value={searchString}
          onKeyDown={this.handleKeyPress}
          onChange={this.updateResults}
          onFocus={() => focusTextFieldAndroid('SearchBar2024')}
          onBlur={blurTextFieldAndroid}
          onClear={this.clearQuery}
        />
      </SearchBar2024Wrapper>
    );
  }
}
SearchBar2024.propTypes = {
  clearFunction: PropTypes.func.isRequired,
  clearSearchTextNow: PropTypes.bool,
  placeholder: PropTypes.string,
  searchFunction: PropTypes.func.isRequired,
  searchUpdateDelayTime: PropTypes.number.isRequired,
};

const SearchBar2024Wrapper = styled('div')`
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 4px;
`;

export default SearchBar2024;
