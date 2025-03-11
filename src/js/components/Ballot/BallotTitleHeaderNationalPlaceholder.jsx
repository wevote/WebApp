import { Edit } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import daysUntil from '../../common/utils/daysUntil';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import {
  BallotAddress,
  ClickBlockWrapper,
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

  showSelectBallotModalChooseElection = () => {
    const { linksOff } = this.props;
    // console.log('BallotTitleHeaderNationalPlaceholder showSelectBallotModalChooseElection linksOff:', linksOff);
    if (!linksOff) {
      const showEditAddress = false;
      const showSelectBallotModal = true;
      // this.props.toggleSelectBallotModal('', showEditAddress, false);
      AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
    }
  }

  showSelectBallotModalEditAddress = () => {
    const { linksOff } = this.props;
    // console.log('BallotTitleHeaderNationalPlaceholder showSelectBallotModalEditAddress linksOff:', linksOff);
    if (!linksOff) {
      const showEditAddress = true;
      const showSelectBallotModal = true;
      // this.props.toggleSelectBallotModal('', showEditAddress, false);
      AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
    }
  }

  render () {
    renderLog('BallotTitleHeaderNationalPlaceholder');  // Set LOG_RENDER_EVENTS to log all renders
    const { centerText, electionDateBelow, electionDateMDY, electionName, linksOff, turnOffVoteByBelow } = this.props;
    const {
      daysUntilElection,
      originalTextState,
      substitutedState, textForMapSearch,
    } = this.state;
    const allowTextWrap = true;
    const electionNameContainsWordElection = stringContains('election', electionName.toLowerCase());
    const stateTextUsed = substitutedState || originalTextState || '';
    const electionNameContainsState = stringContains(stateTextUsed.toLowerCase(), electionName.toLowerCase());

    const editIconStyled = <Edit style={{ fontSize: 16, margin: '-6px 0 0 2px', color: '#69A7FF' }} />;
    const pigsCanFly = false;
    // console.log('BallotTitleHeaderNationalPlaceholder daysUntilElection:', daysUntilElection);
    if (electionName) {
      return (
        <BallotTitleHeaderNationalPlaceholderWrapper>
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
                          className={linksOff ? '' : 'u-cursor--pointer'}
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
                          className={linksOff ? '' : 'u-cursor--pointer'}
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
                        className={linksOff ? '' : 'u-cursor--pointer'}
                        id="ballotTitleHeaderNationalElectionName"
                        onClick={this.showSelectBallotModalChooseElection}
                      >
                        {electionName}
                      </ElectionNameH1>
                      {(textForMapSearch && textForMapSearch !== '' && textForMapSearch.length > 1) ? (
                        <BallotAddress
                          centerText={centerText}
                          className={linksOff ? '' : 'u-cursor--pointer'}
                          id="ballotTitleBallotAddress"
                          onClick={this.showSelectBallotModalEditAddress}
                        >
                          Ballot for
                          {' '}
                          <span
                            tabIndex={0}
                            role="button"
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') this.showSelectBallotModalEditAddress()
                              }}
                            className={linksOff ? '' : 'u-link-color'}>
                            {textForMapSearch}
                          </span>
                        </BallotAddress>
                      ) : (
                        <BallotAddress
                          allowTextWrap={allowTextWrap}
                          centerText={centerText}
                          className={linksOff ? '' : 'u-cursor--pointer'}
                          id="ballotTitleBallotAddress"
                          onClick={this.showSelectBallotModalEditAddress}
                        >
                          <span className={linksOff ? '' : 'u-link-color'}>
                            Click to enter your address
                          </span>
                          {linksOff ? <></> : editIconStyled}
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
                  </ClickBlockWrapper>
                </ElectionNameScrollContent>
              </OverflowContent>
            </OverflowContainer>
            {(!!(electionDateMDY) && pigsCanFly) && (
              /* This currently doesn't work correctly and needs to be reviewed */
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
        </BallotTitleHeaderNationalPlaceholderWrapper>
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
  turnOffVoteByBelow: PropTypes.bool,
};

const BallotTitleHeaderNationalPlaceholderWrapper = styled('div')`
`;

export default BallotTitleHeaderNationalPlaceholder;
