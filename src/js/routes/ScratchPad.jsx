import React, {Component } from "react";
import SearchBar from "../components/Widgets/SearchBar";

let updateInputValue = function (event) {
  this.setState({ query: event.target.value });
};

export default class ScratchPad extends Component {
  render () {
    return (
      <div className="container">
        <div className="scratch-pad row">
          <SearchBar clear_button search_button updateInputValue={updateInputValue} />
        </div>
      </div>
    );
  }
}
