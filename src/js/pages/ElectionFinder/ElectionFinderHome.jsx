import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { renderLog } from '../../common/utils/logging';
import { stateCodeMap } from '../../common/utils/addressFunctions';
import { ElectionNameH1 } from '../../components/Style/BallotTitleHeaderStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import historyPush from '../../common/utils/historyPush';
import { StateSelect, Subtitle, TitleWrapper } from './electionFinderStyles';

class ElectionFinderHome extends Component {
  componentDidMount () {
    window.scrollTo(0, 0);
  }

  onStateChange = (e) => {
    const stateCode = e.target.value;
    if (stateCode) {
      historyPush(`/election-finder/${stateCode.toLowerCase()}`);
    }
  };

  render () {
    renderLog('ElectionFinderHome');
    const stateNames = Object.entries(stateCodeMap)
      .filter(([code]) => code !== 'NA')
      .sort((a, b) => a[1].localeCompare(b[1]));

    return (
      <>
        <Helmet><title>Election Finder - We Vote</title></Helmet>
        <PageContentContainer>
          <TitleWrapper>
            <ElectionNameH1 style={{ paddingBottom: 0 }}>Election Finder</ElectionNameH1>
          </TitleWrapper>
          <Subtitle>Find past or upcoming elections.</Subtitle>
          <StateSelect value="" onChange={this.onStateChange}>
            <option value="">Select state</option>
            {stateNames.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </StateSelect>
        </PageContentContainer>
      </>
    );
  }
}

export default ElectionFinderHome;
