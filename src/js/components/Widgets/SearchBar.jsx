import React, {Component } from "react";

export default class SearchBar extends Component {
  constructor(props){
    super(props);

    this.state = {
      query: ""
    };

    this.updateInputValue = this.props.updateInputValue.bind(this); // some outside provider
    this.clearQuery = this.clearQuery.bind(this);
  }

  clearQuery () {
    this.setState({ query: "" });
    this.updateInputValue({ target: { value: "" }}); // hacky, but current solution
  }

  render () {
    return (
      <div className="search-bar clearfix">
          <input ref="search_input"
            type="text"
            className="form-control"
            placeholder={this.props.placeholder} 
            value={this.state.query}
            onChange={this.updateInputValue} />
        <div className="search-bar-options">
          <button className={this.props.clear_button && this.state.query.length > 0 ? "search-options-btn" : "hidden"} onClick={this.clearQuery}>
            <i className="glyphicon glyphicon-remove-circle u-gray-light" />
          </button> 
          <button className={this.props.search_button ? "search-options-btn" : "hidden"} onClick={this.updateInputValue}>
            <i className="glyphicon glyphicon-search" />
          </button>
        </div>  
      </div>
    );
  }
}
