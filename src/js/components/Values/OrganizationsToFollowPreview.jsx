import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import GuideList from '../VoterGuide/GuideList';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { renderLog } from '../../utils/logging';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import { historyPush } from '../../utils/cordovaUtils';


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

  goToOrganizations () {
    historyPush('/opinions');
  }

  render () {
    renderLog('OrganizationsToFollowPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { voterGuidesToFollow } = this.state;

    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <SectionTitle>Organizations to Follow</SectionTitle>
            <Suspense fallback={<span>Loading...</span>}>
              <GuideList incomingVoterGuideList={voterGuidesToFollow} instantRefreshOn />
            </Suspense>
            <ShowMoreFooter showMoreId="organizationsToFollowPreviewShowMoreId" showMoreLink={() => this.goToOrganizations()} showMoreText="Explore more organizations" />
          </div>
        </section>
      </div>
    );
  }
}

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
