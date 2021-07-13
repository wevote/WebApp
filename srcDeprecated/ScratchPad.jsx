import React, { Component } from 'react';
import SearchBar from '../components/Search/SearchBar';
import { renderLog } from '../utils/logging';

const updateInputValue = (event) => {
  this.setState({ query: event.target.value });
};

export default class ScratchPad extends Component {
  render () {
    renderLog('ScratchPad');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div className="container">
        <div className="scratch-pad row">
          <SearchBar clear_button search_button updateInputValue={updateInputValue} />
        </div>
      </div>
    );
  }
}
