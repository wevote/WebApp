import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import Helmet from "react-helmet";
import OrganizationActions from "../actions/OrganizationActions";
import OrganizationStore from "../stores/OrganizationStore";
import OpinionsFollowedList from "../components/Organization/OpinionsFollowedList";
import SearchBar from "../components/Search/SearchBar";
var _ = require("lodash");

export default class OpinionsFollowed extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      organizations_followed_list: [],
      editMode: false,
      search_query: "",
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    OrganizationActions.organizationsFollowedRetrieve();
    this.setState({
      organizations_followed_list: OrganizationStore.getOrganizationsVoterIsFollowing()
    });
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
  }

  _onOrganizationStoreChange (){
    this.setState({
      organizations_followed_list: OrganizationStore.getOrganizationsVoterIsFollowing()
    });
  }

  getCurrentRoute (){
    var current_route = "/opinions_followed";
    return current_route;
  }

  toggleEditMode (){
    this.setState({editMode: !this.state.editMode});
  }

  onKeyDownEditMode (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({editMode: !this.state.editMode});
    }
  }

  getFollowingType (){
    switch (this.getCurrentRoute()) {
      case "/opinions":
        return "WHO_YOU_CAN_FOLLOW";
      case "/opinions_followed":
      default :
        return "WHO_YOU_FOLLOW";
    }
  }

  searchFunction (search_query) {
    this.setState({ search_query: search_query });
  }

  clearFunction () {
    this.searchFunction("");
  }

  render () {
    let organizations_followed_list_for_display = [];
    if (this.state.search_query.length > 0) {
      const search_query_lowercase = this.state.search_query.toLowerCase();
      organizations_followed_list_for_display = _.filter(this.state.organizations_followed_list,
        function (one_organization) {
          return one_organization.organization_name.toLowerCase().includes(search_query_lowercase) ||
            one_organization.organization_twitter_handle.toLowerCase().includes(search_query_lowercase);
        });
    } else {
      organizations_followed_list_for_display = this.state.organizations_followed_list;
    }

    // console.log("OpinionsFollowed, this.state.organizations_followed_list: ", this.state.organizations_followed_list);
    return <div className="opinions-followed__container">
      <Helmet title="Organizations You Listen To - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h1">Who You're Listening To</h1>
          <a className="fa-pull-right"
             tabIndex="0"
             onKeyDown={this.onKeyDownEditMode.bind(this)}
             onClick={this.toggleEditMode.bind(this)}>{this.state.editMode ? "Done Editing" : "Edit"}</a>
            <p>
              Organizations, public figures and other voters you currently listen to. <em>We will never sell your email</em>.
            </p>
          <SearchBar clearButton
                      searchButton
                      placeholder="Search by name or Twitter handle"
                      searchFunction={this.searchFunction}
                      clearFunction={this.clearFunction}
                      searchUpdateDelayTime={0} />
          <br />
          <div className="voter-guide-list card">
            <div className="card-child__list-group">
              {
                this.state.organizations_followed_list && this.state.organizations_followed_list.length ?
                <OpinionsFollowedList organizationsFollowed={organizations_followed_list_for_display}
                                      editMode={this.state.editMode}
                                      instantRefreshOn /> :
                  null
              }
            </div>
          </div>

          <Link className="pull-left" to="/opinions">Find organizations to listen to</Link>

          <Link className="pull-right" to="/opinions_ignored">Organizations you are ignoring</Link><br />
          <br />
        </div>
      </section>
    </div>;
  }
}
