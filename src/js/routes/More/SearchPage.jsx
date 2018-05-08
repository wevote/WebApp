import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "react-router";
import AnalyticsActions from "../../actions/AnalyticsActions";
import ImageHandler from "../../components/ImageHandler";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";
import SearchAllBox from "../../components/Search/SearchAllBox";

export default class SearchPage extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string,
    voter: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchString: ""
    };
  }

  // let urlString = uriEncode(textformSearchField)
  // <Link to=`/more/search_page/${urlString}` />
  componentDidMount() {
    if (this.props.params.encoded_search_string) {
      this.setState({ searchString: this.props.params.encoded_search_string });
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("HeaderBackToBar componentWillReceiveProps, nextProps: ", nextProps);
    if (nextProps.params.encoded_search_string) {
      this.setState({ searchString: nextProps.params.encoded_search_string });
    }
  }

  componentWillUnmount() {
  }

  render() {
    renderLog(__filename);
    return <span>
      <SearchAllBox text_from_search_field={this.state.searchString}/>
        </span>;
  }
}
