import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SearchBar extends Component {
  static propTypes = {
    clearButton: PropTypes.bool,
    searchButton: PropTypes.bool,
    placeholder: PropTypes.string,
    searchFunction: PropTypes.func.isRequired,
    clearFunction: PropTypes.func.isRequired,
    searchUpdateDelayTime: PropTypes.number.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      searchString: ""
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
  }

  componentDidMount () {
    console.log("SearchBar, this.props.searchUpdateDelayTime:", this.props.searchUpdateDelayTime);
  }

  componentWillUnmount (){
  }

  clearQuery () {
    this.props.clearFunction();
    this.setState({ searchString: "" });
  }

  handleKeyPress () {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.searchFunction(this.state.searchString);
    }, this.props.searchUpdateDelayTime);
  }

  updateResults (event) {
    let searchString = event.target.value;
    this.setState({ searchString: searchString });
  }

  render () {
    return (
      <div className="search-bar clearfix">
        <input ref="search_input"
               type="text"
               className="form-control"
               placeholder={this.props.placeholder}
               value={this.state.searchString}
               onKeyDown={this.handleKeyPress}
               onChange={this.updateResults} />
        <div className="search-bar-options">
          <button className={this.props.clearButton && this.state.searchString && this.state.searchString.length > 0 ? "search-options-btn" : "hidden"}
                  onClick={this.clearQuery}>
            <i className="glyphicon glyphicon-remove-circle u-gray-light" />
          </button>
          <button className={this.props.searchButton ? "search-options-btn" : "hidden"}>
            <i className="glyphicon glyphicon-search" />
          </button>
        </div>
      </div>
    );
  }
}
