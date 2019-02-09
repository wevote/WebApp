import React, { Component } from "react";
import { renderLog } from "../utils/logging";
import SearchBar from "../components/Search/SearchBar";

const updateInputValue = (event) => {
  this.setState({ query: event.target.value });
};

export default class ScratchPad extends Component {
  render () {
    renderLog(__filename);
    return (
      <div className="container">
        <div className="scratch-pad row">
          <SearchBar clear_button search_button updateInputValue={updateInputValue} />
        </div>
      </div>
    );
  }
}
