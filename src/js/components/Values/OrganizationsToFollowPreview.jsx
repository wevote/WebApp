import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

const GuideList = React.lazy(() => import('../VoterGuide/GuideList'));
const ShowMoreFooter = React.lazy(() => import('../Navigation/ShowMoreFooter'));


export default class OrganizationsToFollowPreview extends Component {
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
    const limit = 2;
    const limitToPublicFigures = false;
    const limitToOrganizations = true;
    this.setState({
      voterGuidesToFollow: VoterGuideStore.getVoterGuidesToFollowAll(limit, limitToPublicFigures, limitToOrganizations),
    });
  }

  goToOrganizations () {
    historyPush('/opinions/f/showOrganizationsFilter');
  }

  render () {
    renderLog('OrganizationsToFollowPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { voterGuidesToFollow } = this.state;

    return (
      <div id="mainContainer" className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <SectionTitle
              id="organizationsSection"
              className="u-cursor--pointer"
              onClick={() => this.goToOrganizations()}
            >
              Organizations to Follow
            </SectionTitle>
            <SectionDescription>
              Follow an organization to add their opinions to your personalized score.
            </SectionDescription>
            <Suspense fallback={<span>Loading...</span>}>
              <GuideList
                hideShowMoreItems
                incomingVoterGuideList={voterGuidesToFollow}
                instantRefreshOn
              />
            </Suspense>
            <ShowMoreFooter
              showMoreId="organizationsToFollowPreviewShowMoreId"
              showMoreLink={() => this.goToOrganizations()}
              showMoreText="Find more organizations"
            />
          </div>
        </section>
      </div>
    );
  }
}
OrganizationsToFollowPreview.propTypes = {
};

const SectionDescription = styled.div`
  font-weight: 200;
  font-size: 14px;
  margin-bottom: 16px;
  width: fit-content;
`;

const SectionTitle = styled.h2`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
  width: fit-content;
`;
