import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import VoterGuideActions from '../actions/VoterGuideActions';
import OpinionsIgnoredList from '../components/Organization/OpinionsIgnoredList';
import VoterGuideStore from '../stores/VoterGuideStore';
import { renderLog } from '../utils/logging';

// NOTE FROM DALE: This should be refactored to pull in Organizations instead of Voter Guides
export default class OpinionsIgnored extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voter_guide_ignored_list: [],
    };
  }

  componentDidMount () {
    this.setState({ voter_guide_ignored_list: VoterGuideStore.getVoterGuidesVoterIsIgnoring() });
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    VoterGuideActions.voterGuidesIgnoredRetrieve();
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    const list = VoterGuideStore.getVoterGuidesVoterIsIgnoring();

    if (list !== undefined && list.length > 0) {
      this.setState({ voter_guide_ignored_list: VoterGuideStore.getVoterGuidesVoterIsIgnoring() });
      // console.log(this.state.voter_guide_ignored_list);
    }
  }

  render () {
    renderLog('OpinionsIgnored');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div className="opinions-followed__container">
        <Helmet title="Who You're Ignoring - We Vote" />
        <section className="card">
          <div className="card-main">
            <h1 className="h1">Who You&apos;re Ignoring</h1>
            <p>
              Organizations, public figures and other voters you&apos;re ignoring.
            </p>
            <div className="voter-guide-list card">
              <div className="card-child__list-group">
                { this.state.voter_guide_ignored_list && this.state.voter_guide_ignored_list.length ? (
                  <OpinionsIgnoredList
                    organizationsIgnored={this.state.voter_guide_ignored_list}
                    instantRefreshOn
                  />
                ) : null}
              </div>
            </div>
            <Link className="pull-right" to="/opinions_followed">See organizations you follow</Link>
            <br />
          </div>
        </section>
      </div>
    );
  }
}
