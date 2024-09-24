import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { isWebApp } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import ChallengesHomeFilterPlaceholder from '../../components/Challenge/ChallengesHomeFilterPlaceholder';
import ChallengeListRootPlaceholder from '../../components/ChallengeListRoot/ChallengeListRootPlaceholder';
import VoterStore from '../../../stores/VoterStore';
import { cordovaSimplePageContainerTopOffset } from '../../../utils/cordovaCalculatedOffsets';

const ChallengesHome = React.lazy(() => import(/* webpackChunkName: 'ChallengesHome' */ './ChallengesHome'));

class ChallengesHomeLoader extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('ChallengesHomeLoader componentDidMount');
    window.scrollTo(0, 0);
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.modalOpenTimer) clearTimeout(this.modalOpenTimer);
  }

  onVoterStoreChange () {
    const { stateCode } = this.state;
    if (!stateCode) {
      this.setState({
        stateCode: VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress(),
      });
    }
  }

  getTopPadding = () => {
    if (isWebApp()) {
      return { paddingTop: '0 !important' };
    }
    cordovaSimplePageContainerTopOffset(VoterStore.getVoterIsSignedIn());
    return {};
  }

  // In Cordova a Suspen[d] fallback must be on one line (or else) this makes it one line
  fallbackMarkup = () => {    // eslint-disable-line arrow-body-style
    return (
      <>
        <ChallengesHomeFilterPlaceholder />
        <WhatIsHappeningSectionLoading>
          <ChallengeListRootPlaceholder titleTextForList="Democracy Challenges" />
        </WhatIsHappeningSectionLoading>
      </>
    );
  }

  render () {
    renderLog('ChallengesHomeLoader');  // Set LOG_RENDER_EVENTS to log all renders
    // const { classes } = this.props;
    // console.log('ChallengesHomeLoader.jsx render');

    const titleText = 'Challenges - WeVote';
    const descriptionText = 'Choose which candidates you support or oppose.';
    // console.log('descriptionText: ', descriptionText);

    return (
      <PageContentContainer>
        <ChallengesHomeContainer className="container-fluid" style={this.getTopPadding()}>
          <Helmet>
            <title>{titleText}</title>
            <link rel="canonical" href="https://wevote.us/challenges" />
            <meta name="description" content={descriptionText} />
          </Helmet>
          <Suspense fallback={this.fallbackMarkup()}>
            <ChallengesHome match={this.props.match} />
          </Suspense>
        </ChallengesHomeContainer>
      </PageContentContainer>
    );
  }
}
ChallengesHomeLoader.propTypes = {
  match: PropTypes.object,
};

const ChallengesHomeContainer = styled('div')`
`;

const WhatIsHappeningSectionLoading = styled('div')`
  height: 460px;
  min-height: 460px;
`;

export default ChallengesHomeLoader;

