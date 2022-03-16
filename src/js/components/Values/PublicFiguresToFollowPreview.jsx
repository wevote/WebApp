import React, { Component, Suspense } from 'react';
import styled from '@mui/material/styles/styled';
import VoterGuideStore from '../../stores/VoterGuideStore';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';

const GuideList = React.lazy(() => import(/* webpackChunkName: 'GuideList' */ '../VoterGuide/GuideList'));
const ShowMoreFooter = React.lazy(() => import(/* webpackChunkName: 'ShowMoreFooter' */ '../Navigation/ShowMoreFooter'));


export default class PublicFiguresToFollowPreview extends Component {
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
    const limitToPublicFigures = true;
    this.setState({
      voterGuidesToFollow: VoterGuideStore.getVoterGuidesToFollowAll(limit, limitToPublicFigures),
    });
  }

  goToPublicFigures () {
    historyPush('/opinions/f/showPublicFiguresFilter');
  }

  render () {
    renderLog('PublicFiguresToFollowPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { voterGuidesToFollow } = this.state;

    return (
      <div id="mainContainer" className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <SectionTitle
              id="publicFiguresSection"
              className="u-cursor--pointer"
              onClick={() => this.goToPublicFigures()}
            >
              Public Figures to Follow
            </SectionTitle>
            <SectionDescription>
              Follow a public figure to add their opinions to your personalized score.
            </SectionDescription>
            <Suspense fallback={<></>}>
              <GuideList
                hideShowMoreItems
                incomingVoterGuideList={voterGuidesToFollow}
                instantRefreshOn
              />
            </Suspense>
            <Suspense fallback={<></>}>
              <ShowMoreFooter
                showMoreId="publicFiguresToFollowPreviewShowMoreId"
                showMoreLink={() => this.goToPublicFigures()}
                showMoreText="Find more public figures"
              />
            </Suspense>
          </div>
        </section>
      </div>
    );
  }
}
PublicFiguresToFollowPreview.propTypes = {
};

const SectionDescription = styled('h2')`
  font-weight: 200;
  font-size: 14px;
  margin-bottom: 16px;
  width: fit-content;
`;

const SectionTitle = styled('h2')`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
  width: fit-content;
`;
