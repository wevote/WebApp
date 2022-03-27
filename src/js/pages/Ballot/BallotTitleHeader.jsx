import { Settings } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    const { classes, electionName, electionDayTextObject, linksOff, showBallotCaveat } = this.props;
    const ballotCaveat = BallotStore.getBallotCaveat();
    const originalTextAddress = BallotStore.getOriginalTextAddress();
    const originalTextState = BallotStore.getOriginalTextState();
    const textForMapSearch = VoterStore.getTextForMapSearch();
    const substitutedAddress = BallotStore.getSubstitutedAddress();
    const substitutedState = BallotStore.getSubstitutedState();

    if (electionName) {
      return (
        <ComponentWrapper>
          <ContentWrapper>
            <OverflowContainer>
              <OverflowContent>
                <ElectionNameScrollContent>
                  <Tooltip
                    aria-disabled={linksOff}
                    aria-label="Change Election"
                    classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}
                    title={linksOff ? '' : 'Change my election'}
                  >
                    <ElectionClickBlock
                      id="ballotTitleHeaderSelectBallotModal"
                      linksOff={linksOff}
                      onClick={this.onClickLocal}
                    >
                      <ElectionNameBlock>
                        {(substitutedState && (substitutedState !== '')) ? (
                          <ElectionStateLabel>
                            {substitutedState || ' '}
                            {' '}
                            Election
                          </ElectionStateLabel>
                        ) : (
                          <ElectionStateLabel>
                            {originalTextState || ' '}
                            {' '}
                            Election
                          </ElectionStateLabel>
                        )}
                        <ElectionNameH1>
                          {electionName}
                          {!linksOff && (
                            <SettingsIconWrapper>
                              <Settings classes={{ root: classes.settingsIcon }} />
                            </SettingsIconWrapper>
                          )}
                        </ElectionNameH1>
                        {(showBallotCaveat && ballotCaveat) ? (
                          <BallotAddress>
                            {ballotCaveat && (
                              <div>{ballotCaveat}</div>
                            )}
                          </BallotAddress>
                        ) : (
                          <>
                            {(substitutedAddress && substitutedAddress !== '') ? (
                              <BallotAddress>
                                Ballot for:
                                {' '}
                                <span className={linksOff ? '' : 'u-link-color'}>
                                  {substitutedAddress}
                                </span>
                              </BallotAddress>
                            ) : (
                              <>
                                {(originalTextAddress && originalTextAddress !== '') && (
                                  <BallotAddress>
                                    Ballot for:
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
                      </ElectionNameBlock>
                    </ElectionClickBlock>
                  </Tooltip>
                </ElectionNameScrollContent>
              </OverflowContent>
            </OverflowContainer>
            {electionDayTextObject && (
              <ShareButtonWrapper>
                <VoteByLabel>
                  Vote By
                </VoteByLabel>
                <ElectionDate>
                  {electionDayTextObject}
                </ElectionDate>
              </ShareButtonWrapper>
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
            <>
              Choose Election...
              <SettingsIconWrapper>
                <Settings classes={{ root: classes.settingsIcon }} />
              </SettingsIconWrapper>
            </>
          )}
        </span>
      );
    }
  }
}
BallotTitleHeader.propTypes = {
  classes: PropTypes.object,
  electionName: PropTypes.string,
  electionDayTextObject: PropTypes.object,
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

const BallotAddress = styled('div')`
  margin-left: 2px;
`;

// const ComponentWrapper = styled('div', {
//   shouldForwardProp: (prop) => !['marginTopOffset'].includes(prop),
// })(({ marginTopOffset }) => (`
//   margin-top: ${marginTopOffset};
//   height: 80px; // Includes 35px for ballot address
//   transition: all 150ms ease-in;
// `));

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

const ElectionDate = styled('div')`
  font-size: 18px;
`;

const ElectionNameBlock = styled('div')`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ElectionNameH1 = styled('h1')(({ theme }) => (`
  font-size: 32px;
  ${theme.breakpoints.down('sm')} {
    font-size: 28px;
  }
  margin: 0px;
`));

const ElectionNameScrollContent = styled('div')`
`;

const ElectionStateLabel = styled('div')`
  color: #888;
  font-size: 12px;
  letter-spacing: .1em;
  margin-left: 2px;
  text-transform: uppercase;
`;

const OverflowContent = styled('div')(({ theme }) => (`
  display: block;
  flex: 1;
  height: 92px; // Includes 35px for ballot address
  // ${theme.breakpoints.down('sm')} {
  //   height: 32px;
  // }
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

const ShareButtonWrapper = styled('div')(({ theme }) => (`
  display: none;
  margin-left: 8px;
  margin-top: 4px;
  ${theme.breakpoints.up('sm')} {
    display: block;
  }
`));

const VoteByLabel = styled('div')`
  color: #888;
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
`;

export default withTheme(withStyles(styles)(BallotTitleHeader));
