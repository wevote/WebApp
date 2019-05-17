import React, { Component, Suspense } from 'react';
import { Link } from 'react-router';
import GuideList from '../VoterGuide/GuideList';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { renderLog } from '../../utils/logging';


export default class OrganizationsToFollowPreview extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      voterGuidesToFollow: [],
    };
  }

  componentDidMount () {
    this.onVoterGuideStoreChange();
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    const limit = 3;
    const limitToPublicFigures = false;
    const limitToOrganizations = true;
    this.setState({
      voterGuidesToFollow: VoterGuideStore.getVoterGuidesToFollowAll(limit, limitToPublicFigures, limitToOrganizations),
    });
  }

  render () {
    renderLog(__filename);
    const { voterGuidesToFollow } = this.state;

    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <h1 className="h4">Organizations to Follow</h1>
            <Suspense fallback={<span>Loading...</span>}>
              <GuideList incomingVoterGuideList={voterGuidesToFollow} instantRefreshOn />
            </Suspense>
            <div>
              <Link id="myValuesExploreMoreOrganizations" to="/opinions">Explore more organizations</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
