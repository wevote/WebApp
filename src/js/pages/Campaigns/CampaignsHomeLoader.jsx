import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { convertStateCodeToStateText, convertStateTextToStateCode } from '../../common/utils/addressFunctions';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import CampaignsHomeFilterPlaceholder from '../../components/CampaignsHome/CampaignsHomeFilterPlaceholder';
import CandidateListRootPlaceholder from '../../components/CampaignsHome/CandidateListRootPlaceholder';
import VoterStore from '../../stores/VoterStore';
import { cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';

const CampaignsHome = React.lazy(() => import(/* webpackChunkName: 'CampaignsHome' */ './CampaignsHome'));

class CampaignsHomeLoader extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignsHomeLoader componentDidMount');
    window.scrollTo(0, 0);
    const { match: { params: {
      state_candidates_phrase: stateCandidatesPhrase,
    } } } = this.props;
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    let stateName;
    if (stateCandidatesPhrase) {
      const campaignsHomeMode = (stateCandidatesPhrase.includes('-candidates'));
      // const detailsListMode = (stateCandidatesPhrase.includes('-politicians-list'));
      // this.setState({
      //   // campaignsHomeMode,
      //   detailsListMode,
      // });
      if (campaignsHomeMode) {
        stateName = stateCandidatesPhrase.replace('-candidates', '');
      }
      // else if (detailsListMode) {
      //   stateName = stateCandidatesPhrase.replace('-politicians-list', '');
      // }
    }
    if (stateName) {
      stateName = stateName.replace('-', ' ');
      let newStateCode = convertStateTextToStateCode(stateName);
      if (newStateCode.toLowerCase() === 'na') {
        newStateCode = 'all';
      }
      // console.log('componentDidMount newStateCode:', newStateCode);
      this.setState({
        stateCode: newStateCode,
      });
    } else if (VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress()) {
      const voterStateCode =  VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress();
      const newPathname = this.getStateNamePathnameFromStateCode(voterStateCode);
      const { location: { pathname } } = window;
      if (pathname !== newPathname) {
        historyPush(newPathname);
      } else {
        this.setState({ stateCode: voterStateCode });
      }
    }
  }

  componentDidUpdate (prevProps) {
    const { match: { params: { state_candidates_phrase: previousStateCandidatesPhrase } } } = prevProps;
    const { match: { params: { state_candidates_phrase: stateCandidatesPhrase } } } = this.props;
    if (stateCandidatesPhrase && (stateCandidatesPhrase !== previousStateCandidatesPhrase)) {
      const campaignsHomeMode = (stateCandidatesPhrase.includes('-candidates'));
      // const detailsListMode = (stateCandidatesPhrase.includes('-politicians-list'));
      // this.setState({
      //   // campaignsHomeMode,
      //   detailsListMode,
      // });
      let stateName;
      if (campaignsHomeMode) {
        stateName = stateCandidatesPhrase.replace('-candidates', '');
      }
      // else if (detailsListMode) {
      //   stateName = stateCandidatesPhrase.replace('-politicians-list', '');
      // }

      if (stateName) {
        stateName = stateName.replace('-', ' ');
        const { stateCode } = this.state;
        let newStateCode = convertStateTextToStateCode(stateName);
        // console.log('stateCode:', stateCode, ', newStateCode:', newStateCode);
        if (newStateCode.toLowerCase() === 'na') {
          newStateCode = 'all';
        }
        if (newStateCode !== stateCode) {
          this.setState({
            stateCode: newStateCode,
          });
        }
      }
      window.scrollTo(0, 0);
    }
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

  getStateNamePathnameFromStateCode = (stateCode) => {
    const stateName = convertStateCodeToStateText(stateCode);
    const stateNamePhrase = `${stateName}-candidates`;
    const stateNamePhraseLowerCase = stateNamePhrase.replace(/\s+/g, '-').toLowerCase();
    return `/${stateNamePhraseLowerCase}/cs/`;
  }

  getTopPadding = () => {
    if (isWebApp()) {
      return { paddingTop: '0 !important' };
    }
    cordovaSimplePageContainerTopOffset(VoterStore.getVoterIsSignedIn());
    return {};
  }

  // In Cordova a Suspen[d] fallback must be on one line (or else) this makes it one line
  fallbackMarkup = (stateCode) => {    // eslint-disable-line arrow-body-style
    return (
      <>
        <CampaignsHomeFilterPlaceholder stateCode={stateCode} />
        <WhatIsHappeningSectionLoading>
          <CandidateListRootPlaceholder titleTextForList="Candidates in Close Races" />
        </WhatIsHappeningSectionLoading>
        <WhatIsHappeningSectionLoading>
          <CandidateListRootPlaceholder titleTextForList="Current Representatives" />
        </WhatIsHappeningSectionLoading>
        <WhatIsHappeningSectionLoading>
          <CandidateListRootPlaceholder titleTextForList="On Your Ballot" />
        </WhatIsHappeningSectionLoading>
      </>
    );
  }

  render () {
    renderLog('CampaignsHomeLoader');  // Set LOG_RENDER_EVENTS to log all renders
    // const { classes } = this.props;
    const {
      stateCode,
    } = this.state;
    // console.log('CampaignsHomeLoader.jsx render');

    let titleText;
    let descriptionText;
    const { match: { params: { state_candidates_phrase: stateCandidatesPhrase } } } = this.props;
    if (stateCode && stateCode !== 'na') {
      const stateText = convertStateCodeToStateText(stateCode);
      descriptionText = `Choose which candidates from ${stateText} you support or oppose.`;
      titleText = `${stateText} Candidates - We Vote`;
    } else {
      descriptionText = 'Choose which candidates you support or oppose.';
      titleText = 'Candidates - We Vote';
    }
    // console.log('descriptionText: ', descriptionText);

    return (
      <PageContentContainer>
        <CampaignsHomeContainer className="container-fluid" style={this.getTopPadding()}>
          <Helmet>
            <title>{titleText}</title>
            {stateCandidatesPhrase && (
              <link rel="canonical" href={`https://wevote.us/${stateCandidatesPhrase}/cs`} />
            )}
            <meta name="description" content={descriptionText} />
          </Helmet>
          <Suspense fallback={this.fallbackMarkup(stateCode)}>
            <CampaignsHome match={this.props.match} />
          </Suspense>
        </CampaignsHomeContainer>
      </PageContentContainer>
    );
  }
}
CampaignsHomeLoader.propTypes = {
  match: PropTypes.object,
};

const CampaignsHomeContainer = styled('div')`
`;

const WhatIsHappeningSectionLoading = styled('div')`
  height: 460px;
  min-height: 460px;
`;

export default CampaignsHomeLoader;

