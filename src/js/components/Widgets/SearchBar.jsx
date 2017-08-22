import React, {Component, PropTypes } from "react";

export default class SearchBar extends Component {
  static propTypes = {
    clear_button: PropTypes.bool,
    search_button: PropTypes.bool,
    placeholder: PropTypes.string,
    handleKeyPress: PropTypes.func.isRequired,
    updateInputValue: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      query: ""
    };
    this.handleKeyPress = this.props.handleKeyPress.bind(this);
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
            onKeyDown={this.handleKeyPress}
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
