import PropTypes from 'prop-types';
import React, { Component } from 'react';
import daysUntil from '../../common/utils/daysUntil';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import {
  BallotAddress,
  ComponentWrapper,
  ContentWrapper,
  ElectionClickBlock,
  ElectionDateBelow,
  ElectionDateRight,
  ElectionNameBlock,
  ElectionNameH1,
  ElectionNameScrollContent,
  ElectionStateLabel,
  OverflowContainer,
  OverflowContent,
  VoteByBelowLabel,
  VoteByBelowWrapper,
  VoteByRightLabel,
  VoteByRightWrapper,
} from '../Style/BallotTitleHeaderStyles';


class BallotTitleHeaderNationalPlaceholder extends Component {
  constructor (props) {
    super(props);
    this.state = {
      daysUntilElection: 0,
      originalTextState: '',
      substitutedState: '',
      textForMapSearch: '',
    };
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    const electionDayText = BallotStore.currentBallotElectionDate;
    this.setState({
      daysUntilElection: daysUntil(electionDayText),
      originalTextState: BallotStore.getOriginalTextState(),
      substitutedState: BallotStore.getSubstitutedState(),
    });
  }

  onVoterStoreChange () {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

  onClickLocal = () => {
    const { linksOff } = this.props;
    if (this.props.toggleSelectBallotModal && !linksOff) {
      this.props.toggleSelectBallotModal('', false, false);
    }
  }

  render () {
    renderLog('BallotTitleHeaderNationalPlaceholder');  // Set LOG_RENDER_EVENTS to log all renders
    // const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
    const { centerText, electionDateBelow, electionDateMDY, electionName, linksOff, turnOffVoteByBelow } = this.props;
    const {
      daysUntilElection,
      originalTextState,
      substitutedState, textForMapSearch,
    } = this.state;

    const electionNameContainsWordElection = stringContains('election', electionName.toLowerCase());
    const stateTextUsed = substitutedState || originalTextState || '';
    const electionNameContainsState = stringContains(stateTextUsed.toLowerCase(), electionName.toLowerCase());

    if (electionName) {
      return (
        <ComponentWrapper>
          <ContentWrapper>
            <OverflowContainer>
              <OverflowContent>
                <ElectionNameScrollContent>
                  <ElectionClickBlock
                    id="ballotTitleHeaderSelectBallotModal"
                    linksOff={linksOff}
                    onClick={this.onClickLocal}
                  >
                    <ElectionNameBlock>
                      {(substitutedState && (substitutedState !== '')) ? (
                        <ElectionStateLabel centerText={centerText}>
                          {!electionNameContainsState && (
                            <>
                              {substitutedState || ' '}
                            </>
                          )}
                          {!electionNameContainsWordElection && (
                            <>
                              {' '}
                              Election
                            </>
                          )}
                        </ElectionStateLabel>
                      ) : (
                        <ElectionStateLabel centerText={centerText}>
                          {!electionNameContainsState && (
                            <>
                              {originalTextState || ' '}
                            </>
                          )}
                          {!electionNameContainsWordElection && (
                            <>
                              {' '}
                              Election
                            </>
                          )}
                        </ElectionStateLabel>
                      )}
                      <ElectionNameH1 centerText={centerText}>
                        {electionName}
                      </ElectionNameH1>
                      {(textForMapSearch && textForMapSearch !== '') && (
                        <BallotAddress centerText={centerText}>
                          Ballot for
                          {' '}
                          <span className={linksOff ? '' : 'u-link-color'}>
                            {textForMapSearch}
                          </span>
                        </BallotAddress>
                      )}
                      {(!turnOffVoteByBelow && !!(electionDateMDY)) && (
                        <VoteByBelowWrapper
                          centerText={centerText}
                          electionDateBelow={electionDateBelow}
                        >
                          <VoteByBelowLabel>
                            Vote by
                          </VoteByBelowLabel>
                          <ElectionDateBelow>
                            {electionDateMDY}
                          </ElectionDateBelow>
                        </VoteByBelowWrapper>
                      )}
                    </ElectionNameBlock>
                  </ElectionClickBlock>
                </ElectionNameScrollContent>
              </OverflowContent>
            </OverflowContainer>
            {!!(electionDateMDY) && (
              <VoteByRightWrapper electionDateBelow={electionDateBelow}>
                <VoteByRightLabel>
                  {daysUntilElection > 0 ? (
                    <>Vote by</>
                  ) : (
                    <>
                      {daysUntilElection === 0 ? (
                        <>Vote Today!</>
                      ) : (
                        <>Election was</>
                      )}
                    </>
                  )}
                </VoteByRightLabel>
                <ElectionDateRight>
                  {electionDateMDY}
                </ElectionDateRight>
              </VoteByRightWrapper>
            )}
          </ContentWrapper>
        </ComponentWrapper>
      );
    } else {
      return null;
    }
  }
}
BallotTitleHeaderNationalPlaceholder.propTypes = {
  centerText: PropTypes.bool,
  electionDateBelow: PropTypes.bool,
  electionDateMDY: PropTypes.string,
  electionName: PropTypes.string,
  linksOff: PropTypes.bool,
  toggleSelectBallotModal: PropTypes.func,
  turnOffVoteByBelow: PropTypes.bool,
};

export default BallotTitleHeaderNationalPlaceholder;
