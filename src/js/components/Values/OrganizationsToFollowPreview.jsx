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

const SectionDescription = styled.h2`
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
