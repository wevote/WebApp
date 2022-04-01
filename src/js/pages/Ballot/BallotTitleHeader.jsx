import { Settings } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import daysUntil from '../../common/utils/daysUntil';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';


class BallotTitleHeader extends Component {
  onClickLocal = () => {
    const { linksOff } = this.props;
    if (this.props.toggleSelectBallotModal && !linksOff) {
      this.props.toggleSelectBallotModal('', false, false);
    }
  }

  render () {
    renderLog('BallotTitleHeader');  // Set LOG_RENDER_EVENTS to log all renders
    // const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
    const { centerText, classes, electionDateBelow, linksOff, showBallotCaveat } = this.props;
    const ballotCaveat = BallotStore.getBallotCaveat();
    const electionName = BallotStore.currentBallotElectionName || '';
    const originalTextAddress = BallotStore.getOriginalTextAddress();
    const originalTextState = BallotStore.getOriginalTextState();
    const textForMapSearch = VoterStore.getTextForMapSearch();
    const substitutedAddress = BallotStore.getSubstitutedAddress();
    const substitutedState = BallotStore.getSubstitutedState();
    const electionDayText = BallotStore.currentBallotElectionDate;
    const electionDayTextFormatted = electionDayText && window.moment ? window.moment(electionDayText).format('MMM Do, YYYY') : '';
    const electionDayTextObject = electionDayText && window.moment ? <span>{electionDayTextFormatted}</span> : null;
    const daysUntilElection = daysUntil(electionDayText);

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
                          {substitutedState || ' '}
                          {' '}
                          Election
                        </ElectionStateLabel>
                      ) : (
                        <ElectionStateLabel centerText={centerText}>
                          {originalTextState || ' '}
                          {' '}
                          Election
                        </ElectionStateLabel>
                      )}
                      <ElectionNameH1 centerText={centerText}>
                        {electionName}
                        {/* !linksOff && (
                          <SettingsIconWrapper>
                            <Settings classes={{ root: classes.settingsIcon }} />
                          </SettingsIconWrapper>
                        ) */}
                      </ElectionNameH1>
                      {(showBallotCaveat && ballotCaveat) ? (
                        <BallotAddress centerText={centerText}>
                          {ballotCaveat && (
                            <div>{ballotCaveat}</div>
                          )}
                        </BallotAddress>
                      ) : (
                        <>
                          {(substitutedAddress && substitutedAddress !== '') ? (
                            <BallotAddress centerText={centerText}>
                              Ballot for
                              {' '}
                              <span className={linksOff ? '' : 'u-link-color'}>
                                {substitutedAddress}
                              </span>
                            </BallotAddress>
                          ) : (
                            <>
                              {(originalTextAddress && originalTextAddress !== '') && (
                                <BallotAddress centerText={centerText}>
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
                      {electionDayTextObject && (
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
                  </ElectionClickBlock>
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
          onClick={this.onClickLocal}
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
  toggleSelectBallotModal: PropTypes.func,
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

const BallotAddress = styled('div', {
  shouldForwardProp: (prop) => !['centerText'].includes(prop),
})(({ centerText }) => (`
  margin-left: 2px;
  ${centerText ? 'text-align: center;' : ''}
`));

const ComponentWrapper = styled('div')`
`;

const ContentWrapper = styled('div')`
  display: flex;
  flex: 1;
  min-height: 0px;
`;

const ElectionClickBlock = styled('div', {
  shouldForwardProp: (prop) => !['linksOff'].includes(prop),
})(({ linksOff }) => (`
  ${linksOff ? '' : 'cursor: pointer;'}
`));

const ElectionDateBelow = styled('div')`
`;

const ElectionDateRight = styled('div')`
    font-size: 18px;
`;

const ElectionNameBlock = styled('div')`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ElectionNameH1 = styled('h1', {
  shouldForwardProp: (prop) => !['centerText'].includes(prop),
})(({ centerText, theme }) => (`
  font-size: 32px;
  ${theme.breakpoints.down('sm')} {
    font-size: 28px;
  }
  margin: 0px;
  ${centerText ? 'text-align: center;' : ''}
`));

const ElectionNameScrollContent = styled('div')`
`;

const ElectionStateLabel = styled('div', {
  shouldForwardProp: (prop) => !['centerText'].includes(prop),
})(({ centerText }) => (`
  color: #888;
  font-size: 12px;
  letter-spacing: .1em;
  margin-left: 2px;
  ${centerText ? 'text-align: center;' : ''}
  text-transform: uppercase;
`));

const OverflowContent = styled('div')(({ theme }) => (`
  display: block;
  flex: 1;
  height: 97px; // Includes 35px for ballot address
  ${theme.breakpoints.down('sm')} {
    height: unset;
  }
`));

const OverflowContainer = styled('div')`
  flex: 1;
  // overflow-x: hidden;
  // overflow-y: hidden;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SettingsIconWrapper = styled('span')`
`;

const VoteByBelowLabel = styled('div')`
  margin-right: 4px;
`;

const VoteByBelowWrapper = styled('div', {
  shouldForwardProp: (prop) => !['centerText', 'electionDateBelow'].includes(prop),
})(({ centerText, electionDateBelow, theme }) => (`
  display: flex;
  ${centerText ? 'justify-content: center;' : 'justify-content: start;'}
  margin: -2px 0 0 2px;
  ${theme.breakpoints.up('sm')} {
    ${electionDateBelow ? '' : 'display: none;'}
  }
`));

const VoteByRightLabel = styled('div')`
  color: #888;
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
`;

const VoteByRightWrapper = styled('div', {
  shouldForwardProp: (prop) => !['electionDateBelow'].includes(prop),
})(({ electionDateBelow, theme }) => (`
  ${electionDateBelow ? 'display: none;' : 'display: block;'}
  margin-left: 8px;
  margin-top: 4px;
  ${theme.breakpoints.down('sm')} {
    display: none;
  }
`));

export default withTheme(withStyles(styles)(BallotTitleHeader));
