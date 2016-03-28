import React, {Component } from "react";
import GuideActions from "../actions/GuideActions";
import BallotStore from "../stores/BallotStore";

export default class SearchBox extends Component {

  constructor (props){
    super(props);
    this.state = {};
  }

  componentDidMount (){
    React.findDOMNode(this.refs.search).focus();
  }

  componentWillUnmount (){
    //Clear search results when navigating away
    let id = BallotStore.getGoogleCivicElectionId();
    GuideActions.retrieveGuidesToFollow(id);
  }

  updateResults (event){
    let query = event.target.value;
    this.setState({ query: query });
    // Search for orgs based on query regardless of whether they have opinions on your ballot (election_id is 0)
    // If you blank out the query string, return normal results for this election
    let id = query === "" ? BallotStore.getGoogleCivicElectionId() : 0;
    GuideActions.retrieveGuidesToFollow(id, query);
  }

  render () {
    return <input type="text"
                ref="search"
                className="form-control"
                onChange={this.updateResults.bind(this)}
                value={this.state.query}
               placeholder="Search by name or twitter handle." />;
  }
}
