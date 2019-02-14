import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { renderLog } from '../utils/logging';
import VoterGuideStore from '../stores/VoterGuideStore';
import SearchGuidesToFollowBox from '../components/Search/SearchGuidesToFollowBox';
import GuideList from '../components/VoterGuide/GuideList';


export default class Opinions extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotHasGuides: VoterGuideStore.ballotHasGuides(),
      voterGuidesToFollowAll: VoterGuideStore.getVoterGuidesToFollowAll(),
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState({
      ballotHasGuides: VoterGuideStore.ballotHasGuides(),
      voterGuidesToFollowAll: VoterGuideStore.getVoterGuidesToFollowAll(),
    });
  }

  getCurrentRoute () {
    const currentRoute = '/opinions';
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

  render () {
    renderLog(__filename);
    const { ballotHasGuides, voterGuidesToFollowAll } = this.state;
    const floatRight = {
      float: 'right',
    };

    return (
      <div className="opinion-view">
        <Helmet title="Build Your Network - We Vote" />
        <h1 className="h1">Build Your Network</h1>
        <div>
          <p>
            Find opinions about your ballot (ordered by Twitter followers).
            Listen to those you trust. Stop Listening at any time.
            Listening won&apos;t add you to mailing lists.
            <span style={floatRight} className="d-print-none">
              <Link to="/opinions_followed" className="u-margin-left--md u-no-break">See organizations you listen to</Link>
            </span>
          </p>
          <SearchGuidesToFollowBox />
          { ballotHasGuides ?
            <p /> :
            <p>There are no organizations with opinions on your ballot. Here are some popular organizations</p>
          }
          <div className="card">
            <GuideList organizationsToFollow={voterGuidesToFollowAll} instantRefreshOn />
          </div>
        </div>
        <Link className="pull-right" to="/opinions_ignored">Organizations you are ignoring</Link>
        <br />
      </div>
    );
  }
}
