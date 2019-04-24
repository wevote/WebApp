import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { _ } from 'lodash';
import { renderLog } from '../utils/logging';
import OrganizationActions from '../actions/OrganizationActions';
import OrganizationStore from '../stores/OrganizationStore';
import OpinionsFollowedList from '../components/Organization/OpinionsFollowedList';
import SearchBar from '../components/Search/SearchBar';

export default class OpinionsFollowed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationsFollowedList: [],
      editMode: false,
      searchQuery: '',
    };
    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    OrganizationActions.organizationsFollowedRetrieve();
    this.setState({
      organizationsFollowedList: OrganizationStore.getOrganizationsVoterIsFollowing(),
    });
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    this.setState({
      organizationsFollowedList: OrganizationStore.getOrganizationsVoterIsFollowing(),
    });
  }

  onKeyDownEditMode (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({ editMode: !this.state.editMode });
    }
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

  toggleEditMode () {
    const { editMode } = this.state;
    this.setState(() => ({ editMode: !editMode }));
  }

  searchFunction (searchQuery) {
    this.setState({ searchQuery });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    renderLog(__filename);
    let organizationsFollowedListForDisplay = [];
    if (this.state.searchQuery.length > 0) {
      const searchQueryLowercase = this.state.searchQuery.toLowerCase();
      organizationsFollowedListForDisplay = _.filter(this.state.organizationsFollowedList,
        oneOrganization => oneOrganization.organization_name.toLowerCase().includes(searchQueryLowercase) ||
            oneOrganization.organization_twitter_handle.toLowerCase().includes(searchQueryLowercase));
    } else {
      organizationsFollowedListForDisplay = this.state.organizationsFollowedList;
    }

    // console.log("OpinionsFollowed, this.state.organizationsFollowedList: ", this.state.organizationsFollowedList);
    return (
      <div className="opinions-followed__container">
        <Helmet title="Who You're Following - We Vote" />
        <section className="card">
          <div className="card-main">
            <h1 className="h1">Who You&apos;re Following</h1>
            <a // eslint-disable-line
              className="fa-pull-right"
              onKeyDown={this.onKeyDownEditMode.bind(this)}
              onClick={this.toggleEditMode.bind(this)}
            >
              {this.state.editMode ? 'Done Editing' : 'Edit'}
            </a>
            <p>
              Organizations, public figures and other voters you currently follow.
              {' '}
              <em>We will never sell your email</em>
              .
            </p>
            <SearchBar
              clearButton
              searchButton
              placeholder="Search by name or Twitter handle"
              searchFunction={this.searchFunction}
              clearFunction={this.clearFunction}
              searchUpdateDelayTime={0}
            />
            <br />
            <div className="voter-guide-list card">
              <div className="card-child__list-group">
                {
                this.state.organizationsFollowedList && this.state.organizationsFollowedList.length ? (
                  <OpinionsFollowedList
                    organizationsFollowed={organizationsFollowedListForDisplay}
                    editMode={this.state.editMode}
                    instantRefreshOn
                  />
                ) : null
                }
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
