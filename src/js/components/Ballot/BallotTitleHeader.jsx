import { Edit } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { isAndroidSizeWide, isIPad } from '../../common/utils/cordovaUtils';
import { formatDateToMonthDayYear } from '../../common/utils/dateFormat';
import daysUntil from '../../common/utils/daysUntil';
import initializeMoment from '../../common/utils/initializeMoment';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import { AddressSpanLimited, BallotAddress, BallotAddressWrapper, ClickBlockWrapper, ContentWrapper, ElectionDateBelow, ElectionDateRight, ElectionNameBlock, ElectionNameH1, ElectionNameScrollContent, ElectionStateLabel, OverflowContainer, OverflowContent, VoteByBelowLabel, VoteByBelowWrapper, VoteByRightLabel, VoteByRightWrapper } from '../Style/BallotTitleHeaderStyles';
import BallotTitleHeaderNationalPlaceholder from './BallotTitleHeaderNationalPlaceholder';

const ShareButtonDesktopTablet = React.lazy(() => import(/* webpackChunkName: 'ShareButtonDesktopTablet' */ '../Share/ShareButtonDesktopTablet'));

function BallotOfficeHeader ({
  officeName,
  onViewBallotClick,
}) {
  return (
    <InlineOfficeHeader>
      <span>
        <span className="u-show-mobile">
          Ballot Section for
        </span>
        <span className="u-show-desktop-tablet">
          Ballot section for office of
        </span>

        {' '}

        <strong style={{ fontWeight: 500 }}>
          {officeName}
        </strong>
      </span>

      <ViewBallotButton onClick={onViewBallotClick}>
        View full ballot
      </ViewBallotButton>
    </InlineOfficeHeader>
  );
}

class BallotTitleHeader extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotCaveat: '',
      daysUntilElection: 0,
      electionDayTextObject: undefined,
      electionName: '',
      nextNationalElectionDateMDY: '',
      originalTextAddress: '',
      originalTextState: '',
      substitutedAddress: '',
      substitutedState: '',
      textForMapSearch: '',
    };
  }

  componentDidMount () {
    this._mounted = true;
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this._mounted = false;
    this.ballotStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    const electionDayText = BallotStore.currentBallotElectionDate;
    const electionDayTextFormatted = electionDayText && window.moment ? window.moment(electionDayText).format('MMM Do, YYYY') : '';
    const electionDayTextObject = electionDayText && window.moment ? <span>{electionDayTextFormatted}</span> : null;
    const nextNationalElectionDayText = `${BallotStore.nextNationalElectionDayText || '2026-11-03'}`;
    // console.log('nextNationalElectionDayText:', nextNationalElectionDayText);
    initializeMoment(() => {
      const { moment } = window;
      // this.setNextNationalElectionDateFromDayText(nextNationalElectionDayText);
      const nextNationalElectionDayMDYSlash = moment(nextNationalElectionDayText, 'YYYY-MM-DD').format('MM/DD/YYYY');
      const nextNationalElectionDate = new Date(nextNationalElectionDayMDYSlash);
      const nextNationalElectionDateMDY = formatDateToMonthDayYear(nextNationalElectionDate);
      if (this._mounted) {
        // Only set the state if the component is still mounted to avoid "Can't perform a React state update on an unmounted component"
        this.setState({
          nextNationalElectionDateMDY,
        });
      }
    });
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
    let text = VoterStore.getTextForMapSearch();
    if (text && text.length > 0) {
      text = text.replace(', USA', '');
    }
    this.setState({
      textForMapSearch: text,
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
  };

  showSelectBallotModalEditAddress = (buttonId) => {
    // console.log('Passed buttonId:', buttonId);
    const { linksOff } = this.props;
    // console.log('BallotTitleHeader showSelectBallotModalEditAddress linksOff:', linksOff);
    if (!linksOff) {
      const showEditAddress = true;
      const showSelectBallotModal = true;
      // this.props.toggleSelectBallotModal('', showEditAddress, false);
      const dataLayerObject = {
        actionDetails: {
          actionType: 'openModal',
          buttonId,
        },
        event: 'action',
        pageDetails: getPageDetails(),
        userDetails: VoterStore.getAnalyticsUserDetails(),
      };
      const electionDetails = BallotStore.getAnalyticsElectionDetails();
      if (electionDetails && electionDetails.electionDate) {
        dataLayerObject.electionDetails = electionDetails;
      }
      // console.log('dataLayerObject:', dataLayerObject);
      TagManager.dataLayer({ dataLayer: dataLayerObject });

      AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
    }
  };

  render () {
    renderLog('BallotTitleHeader');  // Set LOG_RENDER_EVENTS to log all renders
    const { allowTextWrap, centerText, linksOff, shareButtonText, showBallotCaveat, showShareButton, turnOffVoteByBelow, officeName, onViewBallotClick } = this.props;
    const {
      ballotCaveat, daysUntilElection, electionDayTextObject,
      electionName, nextNationalElectionDateMDY, originalTextAddress, originalTextState,
      substitutedAddress, substitutedState, textForMapSearch,
    } = this.state;
    // console.log('BallotTitleHeader daysUntilElection:', daysUntilElection);
    const electionNameContainsWordElection = stringContains('election', electionName.toLowerCase());
    const stateTextUsed = substitutedState || originalTextState || '';
    const electionNameContainsState = stringContains(stateTextUsed.toLowerCase(), electionName.toLowerCase());

    const fromOfficePage = officeName && officeName.trim() !== '';
    // console.log('Button onViewBallotClick:', onViewBallotClick);

    const electionNameTooltip = isMobileScreenSize() ? (<></>) : (
      <Tooltip className="u-z-index-9020" id="election-name-tooltip">
        {electionName}
      </Tooltip>
    );

    const editIconStyled = <Edit style={{ fontSize: 16, margin: '-6px 0 0 2px', color: '#69A7FF' }} />;
    // console.log('BallotTitleHeader allowTextWrap:', allowTextWrap);
    if (electionName) {
      return (
        <BallotTitleHeaderWrapper>
          <ContentWrapper spaceBetween={(electionDayTextObject || showShareButton) && !centerText}>
            <OverflowContainer allowTextWrap={allowTextWrap}>
              <OverflowContent>
                <ElectionNameScrollContent>
                  <ClickBlockWrapper
                    id="ballotTitleHeaderSelectBallotModal"
                  >
                    <ElectionNameBlock allowTextWrap={allowTextWrap}>
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
                      <OverlayTrigger placement="bottom-end" overlay={electionNameTooltip}>
                        <ElectionNameH1
                          tabIndex={0}
                          centerText={centerText}
                          className={linksOff ? '' : 'u-cursor--pointer'}
                          id="ballotTitleHeaderElectionName"
                          onClick={this.showSelectBallotModalChooseElection}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              this.showSelectBallotModalChooseElection();
                            }
                          }}
                        >
                          {electionName}
                        </ElectionNameH1>
                      </OverlayTrigger>
                      {fromOfficePage ? (
                        <BallotOfficeHeader
                            officeName={officeName}
                            onViewBallotClick={onViewBallotClick}
                        />
                      ) : (
                        <>
                          {(showBallotCaveat && ballotCaveat) ? (
                            <BallotAddress tabIndex={-1}
                              allowTextWrap={allowTextWrap}
                              centerText={centerText}
                              className={linksOff ? '' : 'u-cursor--pointer'}
                              id="ballotTitleBallotAddress"
                              onClick={() => this.showSelectBallotModalEditAddress('ballotTitleBallotAddress')}
                            >
                              {ballotCaveat && (
                                <div>{ballotCaveat}</div>
                              )}
                            </BallotAddress>
                          ) : (
                            <>
                              {((textForMapSearch && textForMapSearch !== '' && textForMapSearch.length >= 2) || (originalTextAddress && originalTextAddress !== '' && originalTextAddress.length >= 2)) ? (
                                <BallotAddressWrapper id="BallotAddressWrapper1">
                                  <BallotAddress tabIndex={-1}
                                    allowTextWrap={allowTextWrap}
                                    centerText={centerText}
                                    className={linksOff ? '' : 'u-cursor--pointer'}
                                    id="ballotTitleBallotAddress"
                                    onClick={() => this.showSelectBallotModalEditAddress('ballotTitleBallotAddress')}
                                  >
                                    Ballot for
                                    {' '}
                                      <AddressSpanLimited id="BallotFor1" className={linksOff ? '' : 'u-link-color u-link-underline-on-hover'}>
                                        {(textForMapSearch && textForMapSearch !== '') ? textForMapSearch : originalTextAddress}
                                      </AddressSpanLimited>
                                      {linksOff ? <></> : editIconStyled}
                                  </BallotAddress>
                                </BallotAddressWrapper>
                              ) : (
                                <>
                                  {(substitutedAddress && substitutedAddress !== '' && substitutedAddress.length >= 2) ? (
                                    <BallotAddressWrapper id="BallotAddressWrapper2">
                                      <BallotAddress
                                        allowTextWrap={allowTextWrap}
                                        centerText={centerText}
                                        className={linksOff ? '' : 'u-cursor--pointer'}
                                        id="ballotTitleBallotAddressSubstituted"
                                        onClick={() => this.showSelectBallotModalEditAddress('ballotTitleBallotAddressSubstituted')}
                                      >
                                        Ballot for
                                        {' '}
                                        <AddressSpanLimited id="BallotFor2" className={linksOff ? '' : 'u-link-color u-link-underline-on-hover'}>
                                          {substitutedAddress}
                                        </AddressSpanLimited>
                                        {linksOff ? <></> : editIconStyled}
                                      </BallotAddress>
                                    </BallotAddressWrapper>
                                  ) : (
                                    <BallotAddress tabIndex={-1}
                                      allowTextWrap={allowTextWrap}
                                      centerText={centerText}
                                      className={linksOff ? '' : 'u-cursor--pointer'}
                                      id="ballotTitleBallotAddress"
                                      onClick={() => this.showSelectBallotModalEditAddress('ballotTitleBallotAddress')}
                                    >
                                      <span
                                        // tabIndex={0}
                                        className={linksOff ? '' : 'u-link-color u-link-underline-on-hover'}
                                      >
                                        Click to enter your address
                                      </span>
                                      {linksOff ? <></> : editIconStyled}
                                    </BallotAddress>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {(!turnOffVoteByBelow && electionDayTextObject) && (
                        <VoteByBelowWrapper centerText={centerText}>
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
            {(!turnOffVoteByBelow && electionDayTextObject) && (
              <VoteByRightWrapper>
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
            {showShareButton && (
              <BallotShareWrapper className="u-show-desktop-tablet">
                <Suspense fallback={<></>}>
                  <ShareButtonDesktopTablet shareButtonText={shareButtonText || undefined} />
                </Suspense>
              </BallotShareWrapper>
            )}
          </ContentWrapper>
        </BallotTitleHeaderWrapper>
      );
    } else if (!fromOfficePage) {
      return (
        <span
          className="u-push--sm"
          id="ballotTitleHeaderSelectBallotModalLoadingElection"
        >
          {linksOff ? (
            <>
              Choose election below.
            </>
          ) : (
            <BallotTitleHeaderNationalPlaceholder
              centerText
              electionDateMDY={nextNationalElectionDateMDY}
              electionName="General Election"
            />
          )}
        </span>
      );
    } else {
      return null;
    }
  }
}
BallotTitleHeader.propTypes = {
  allowTextWrap: PropTypes.bool,
  centerText: PropTypes.bool,
  linksOff: PropTypes.bool,
  shareButtonText: PropTypes.string,
  showBallotCaveat: PropTypes.bool,
  showShareButton: PropTypes.bool,
  // toggleSelectBallotModal: PropTypes.func,
  turnOffVoteByBelow: PropTypes.bool,
  officeName: PropTypes.string,
  onViewBallotClick: PropTypes.func,
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

const BallotShareWrapper = styled('div')`
  ${() => (isAndroidSizeWide() ? { margin: 0 } : { margin: '0 -8px 0 -8px' })};
  ${() => (isIPad() ? { display: 'revert !important' } : {})};  // override u-show-desktop-tablet
  margin-bottom: 12px;
  padding-left: 2px;
`;

const BallotTitleHeaderWrapper = styled('div')`
  min-height: ${isAndroid() ? '110px' : '90px'};
  height: auto;
`;

const ViewBallotButton = styled.button`
  background: ${DesignTokenColors.primary700};
  color:${DesignTokenColors.whiteUI};
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  padding: 6px 6px;
  font-weight: 400;
  &:hover {
    background: ${DesignTokenColors.primary800};
  }
`;

const InlineOfficeHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;   /* controls spacing properly */
`;

export default withTheme(withStyles(styles)(BallotTitleHeader));
