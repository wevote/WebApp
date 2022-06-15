import { Settings } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import daysUntil from '../../common/utils/daysUntil';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import {
  BallotAddress,
  ClickBlockWrapper,
  ComponentWrapper,
  ContentWrapper,
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


class BallotTitleHeader extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotCaveat: '',
      daysUntilElection: 0,
      electionDayTextObject: undefined,
      electionName: '',
      originalTextAddress: '',
      originalTextState: '',
      substitutedAddress: '',
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
    const electionDayTextFormatted = electionDayText && window.moment ? window.moment(electionDayText).format('MMM Do, YYYY') : '';
    const electionDayTextObject = electionDayText && window.moment ? <span>{electionDayTextFormatted}</span> : null;
    this.setState({
      ballotCaveat: BallotStore.getBallotCaveat(),
      daysUntilElection: daysUntil(electionDayText),
      electionDayTextObject,
      electionName: BallotStore.currentBallotElectionName || '',
      originalTextAddress: BallotStore.getOriginalTextAddress(),
      originalTextState: BallotStore.getOriginalTextState(),
      substitutedAddress: BallotStore.getSubstitutedAddress(),
      substitutedState: BallotStore.getSubstitutedState(),
    });
  }

  onVoterStoreChange () {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

  showSelectBallotModalChooseElection = () => {
    const { linksOff } = this.props;
    // console.log('BallotTitleHeader showSelectBallotModalChooseElection linksOff:', linksOff);
    if (!linksOff) {
      const showEditAddress = false;
      const showSelectBallotModal = true;
      // this.props.toggleSelectBallotModal('', showEditAddress, false);
      AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
    }
  }

  showSelectBallotModalEditAddress = () => {
    const { linksOff } = this.props;
    // console.log('BallotTitleHeader showSelectBallotModalEditAddress linksOff:', linksOff);
    if (!linksOff) {
      const showEditAddress = true;
      const showSelectBallotModal = true;
      // this.props.toggleSelectBallotModal('', showEditAddress, false);
      AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
    }
  }

  render () {
    renderLog('BallotTitleHeader');  // Set LOG_RENDER_EVENTS to log all renders
    // const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
    const { centerText, classes, electionDateBelow, linksOff, showBallotCaveat, turnOffVoteByBelow } = this.props;
    const {
      ballotCaveat, daysUntilElection, electionDayTextObject,
      electionName, originalTextAddress, originalTextState,
      substitutedAddress, substitutedState, textForMapSearch,
    } = this.state;

    const electionNameContainsWordElection = stringContains('election', electionName.toLowerCase());
    const stateTextUsed = substitutedState || originalTextState || '';
    const electionNameContainsState = stringContains(stateTextUsed.toLowerCase(), electionName.toLowerCase());

    // console.log('BallotTitleHeader daysUntilElection:', daysUntilElection);
    if (electionName) {
      return (
        <ComponentWrapper>
          <ContentWrapper>
            <OverflowContainer>
              <OverflowContent>
                <ElectionNameScrollContent>
                  <ClickBlockWrapper
                    id="ballotTitleHeaderSelectBallotModal"
                  >
                    <ElectionNameBlock>
                      {(substitutedState && (substitutedState !== '')) ? (
                        <ElectionStateLabel
                          centerText={centerText}
                          className="u-cursor--pointer"
                          onClick={this.showSelectBallotModalChooseElection}
                        >
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
                        <ElectionStateLabel
                          centerText={centerText}
                          className="u-cursor--pointer"
                          onClick={this.showSelectBallotModalChooseElection}
                        >
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
                      <ElectionNameH1
                        centerText={centerText}
                        className="u-cursor--pointer"
                        onClick={this.showSelectBallotModalChooseElection}
                      >
                        {electionName}
                      </ElectionNameH1>
                      {(showBallotCaveat && ballotCaveat) ? (
                        <BallotAddress
                          centerText={centerText}
                          className="u-cursor--pointer"
                          onClick={this.showSelectBallotModalEditAddress}
                        >
                          {ballotCaveat && (
                            <div>{ballotCaveat}</div>
                          )}
                        </BallotAddress>
                      ) : (
                        <>
                          {(substitutedAddress && substitutedAddress !== '') ? (
                            <BallotAddress
                              centerText={centerText}
                              className="u-cursor--pointer"
                              onClick={this.showSelectBallotModalEditAddress}
                            >
                              Ballot for
                              {' '}
                              <span className={linksOff ? '' : 'u-link-color'}>
                                {substitutedAddress}
                              </span>
                            </BallotAddress>
                          ) : (
                            <>
                              {(originalTextAddress && originalTextAddress !== '') && (
                                <BallotAddress
                                  centerText={centerText}
                                  className="u-cursor--pointer"
                                  onClick={this.showSelectBallotModalEditAddress}
                                >
                                  Ballot for
                                  {' '}
                                  <span className={linksOff ? '' : 'u-link-color'}>
                                    {(textForMapSearch && textForMapSearch !== '') ? textForMapSearch : originalTextAddress}
                                  </span>
                                </BallotAddress>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {(!turnOffVoteByBelow && electionDayTextObject) && (
                        <VoteByBelowWrapper centerText={centerText} electionDateBelow={electionDateBelow}>
                          <VoteByBelowLabel>
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
                          </VoteByBelowLabel>
                          <ElectionDateBelow>
                            {electionDayTextObject}
                          </ElectionDateBelow>
                        </VoteByBelowWrapper>
                      )}
                    </ElectionNameBlock>
                  </ClickBlockWrapper>
                </ElectionNameScrollContent>
              </OverflowContent>
            </OverflowContainer>
            {electionDayTextObject && (
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
                  {electionDayTextObject}
                </ElectionDateRight>
              </VoteByRightWrapper>
            )}
          </ContentWrapper>
        </ComponentWrapper>
      );
    } else {
      return (
        <span
          className="u-push--sm"
          onClick={this.showSelectBallotModalChooseElection}
          id="ballotTitleHeaderSelectBallotModalLoadingElection"
        >
          {linksOff ? (
            <>
              Choose election below.
            </>
          ) : (
            <div className="u-link-color u-cursor--pointer">
              Choose Election
              <SettingsIconWrapper>
                <Settings classes={{ root: classes.settingsIcon }} />
              </SettingsIconWrapper>
            </div>
          )}
        </span>
      );
    }
  }
}
BallotTitleHeader.propTypes = {
  centerText: PropTypes.bool,
  classes: PropTypes.object,
  electionDateBelow: PropTypes.bool,
  linksOff: PropTypes.bool,
  showBallotCaveat: PropTypes.bool,
  // toggleSelectBallotModal: PropTypes.func,
  turnOffVoteByBelow: PropTypes.bool,
};

const styles = {
  settingsIcon: {
    color: '#999',
    marginTop: '-5px',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
  tooltipPlacementBottom: {
    marginTop: 0,
  },
};

const SettingsIconWrapper = styled('span')`
`;

export default withTheme(withStyles(styles)(BallotTitleHeader));
