import React, {Component, PropTypes } from "react";

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
      query: ""
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
  }

  componentDidMount () {
  }

  componentWillUnmount (){
  }

  clearQuery () {
    this.props.clearFunction();
    this.setState({ query: "" });
  }

  handleKeyPress () {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.searchFunction(this.state.query);
    }, this.props.searchUpdateDelayTime);
  }

  updateResults (event) {
    let query = event.target.value;
    this.props.searchFunction(query);
    this.setState({ query: query });
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
               onChange={this.updateResults} />
        <div className="search-bar-options">
          <button className={this.props.clearButton && this.state.query && this.state.query.length > 0 ? "search-options-btn" : "hidden"}
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
