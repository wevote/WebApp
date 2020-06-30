import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import GuideList from '../VoterGuide/GuideList';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { renderLog } from '../../utils/logging';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import { historyPush } from '../../utils/cordovaUtils';


export default class PublicFiguresToFollowPreview extends Component {
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
    const limitToPublicFigures = true;
    this.setState({
      voterGuidesToFollow: VoterGuideStore.getVoterGuidesToFollowAll(limit, limitToPublicFigures),
    });
  }

  goToPublicFigures () {
    historyPush('/opinions');
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
              Follow a public figure to see what they think.
            </SectionDescription>
            <Suspense fallback={<span>Loading...</span>}>
              <GuideList
                hideShowMoreItems
                incomingVoterGuideList={voterGuidesToFollow}
                instantRefreshOn
              />
            </Suspense>
            <ShowMoreFooter
              showMoreId="publicFiguresToFollowPreviewShowMoreId"
              showMoreLink={() => this.goToPublicFigures()}
              showMoreText="Explore more public figures"
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
