import { filter } from 'lodash-es';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import OrganizationActions from '../actions/OrganizationActions';
import OrganizationStore from '../stores/OrganizationStore';
import apiCalming from '../common/utils/apiCalming';
import { renderLog } from '../common/utils/logging';

import OpinionsFollowedList from '../components/Organization/OpinionsFollowedList';
import SearchBar2024 from '../components/Search/SearchBar2024';

export default class OpinionsFollowed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationsFollowedList: [],
      searchQuery: '',
    };
    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    this.setState({
      organizationsFollowedList: OrganizationStore.getOrganizationsVoterIsFollowing(),
    });
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    this.setState({
      organizationsFollowedList: OrganizationStore.getOrganizationsVoterIsFollowing(),
    });
  }

  getCurrentRoute () {
    const currentRoute = '/opinions_followed';
    return currentRoute;
  }

  getFollowingType () {
    switch (this.getCurrentRoute()) {
      case '/opinions':
        return 'WHO_YOU_CAN_FOLLOW';
      case '/opinions_followed':
      default:
        return 'WHO_YOU_FOLLOW';
    }
  }

  searchFunction (searchQuery) {
    this.setState({ searchQuery });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    renderLog('OpinionsFollowed.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    let organizationsFollowedListForDisplay = [];
    if (this.state.searchQuery.length > 0) {
      const searchQueryLowercase = this.state.searchQuery.toLowerCase();
      organizationsFollowedListForDisplay = filter(this.state.organizationsFollowedList,
        (oneOrganization) => oneOrganization.organization_name.toLowerCase().includes(searchQueryLowercase) ||
            oneOrganization.organization_twitter_handle.toLowerCase().includes(searchQueryLowercase));
    } else {
      organizationsFollowedListForDisplay = this.state.organizationsFollowedList;
    }

    // console.log('OpinionsFollowed, organizationsFollowedListForDisplay: ', organizationsFollowedListForDisplay);
    return (
      <div className="opinions-followed__container">
        <Helmet title="Who You're Following - WeVote" />
        <section className="card">
          <div className="card-main">
            <h1 className="h1">Who You&apos;re Following</h1>
            <p>
              Organizations, public figures and other voters you currently follow.
              {' '}
              <em>We will never sell your email</em>
              .
            </p>
            <SearchBar2024
              clearButton
              searchButton
              placeholder="Search by name or X handle"
              searchFunction={this.searchFunction}
              clearFunction={this.clearFunction}
              searchUpdateDelayTime={250}
            />
            <br />
            <div className="voter-guide-list card">
              <div className="card-child__list-group">
                { organizationsFollowedListForDisplay && organizationsFollowedListForDisplay.length ? (
                  <OpinionsFollowedList
                    organizationsFollowed={organizationsFollowedListForDisplay}
                  />
                ) : null}
              </div>
            </div>
            <Link className="pull-left" to="/opinions">Find organizations to follow</Link>
            <Link className="pull-right" to="/opinions_ignored">Organizations you are ignoring</Link>
            <br />
            <br />
          </div>
        </section>
      </div>
    );
  }
}
