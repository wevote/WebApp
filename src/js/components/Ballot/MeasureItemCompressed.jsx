import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import MeasureActions from '../../actions/MeasureActions';
import AppObservableStore from '../../common/stores/AppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { BallotHorizontallyScrollingContainer, BallotScrollingInnerWrapper, LeftArrowInnerWrapper, LeftArrowOuterWrapper, RightArrowInnerWrapper, RightArrowOuterWrapper } from '../../common/components/Style/ScrollingStyles';
import { handleHorizontalScroll } from '../../common/utils/leftRightArrowCalculation';
import { renderLog } from '../../common/utils/logging';
import shortenText from '../../common/utils/shortenText';
import { stripHtmlFromString } from '../../common/utils/textFormat';
import toTitleCase from '../../common/utils/toTitleCase';
import BallotStore from '../../stores/BallotStore';
import MeasureStore from '../../stores/MeasureStore';
import { constrainedTextMobileStyles } from '../Style/BallotStyles';
import MeasureInfoModal from './MeasureInfoModal';
import MeasureOpinionsColumn from './MeasureOpinionsColumn';
import PositionRowListCompressed from './PositionRowListCompressed';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));

const MEASURE_TEXT_MAX_LENGTH = 175;

class MeasureItemCompressed extends Component {
  constructor (props) {
    super(props);
    this.scrollElement = React.createRef();
    this.resizeObserver = null;
    this.state = {
      externalUniqueId: '',
      hideLeftArrow: true,
      hideRightArrow: true,
      measureSubtitle: '',
      measureText: '',
      measureUrl: '',
      measureWeVoteId: '',
      noVoteDescription: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      showInfoModal: false,
      infoModalActiveTab: 0,
      openOpinionModal: false,
      yesVoteDescription: '',
    };
    this.onClickShowOrganizationModalWithBallotItemInfo = this.onClickShowOrganizationModalWithBallotItemInfo.bind(this);
    this.onClickShowOrganizationModalWithPositions = this.onClickShowOrganizationModalWithPositions.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfoAndPositions = this.onClickShowOrganizationModalWithBallotItemInfoAndPositions.bind(this);
  }

  componentDidMount () {
    const { externalUniqueId, measureWeVoteId } = this.props;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('componentDidMount, measureWeVoteId: ', measureWeVoteId);
    if (!measure.we_vote_id) {
      // If the measure isn't in the MeasureStore, retrieve it
      MeasureActions.measureRetrieve(measureWeVoteId);
    }
    if (measureWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic:', measureWeVoteId);
      MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
      const { positionListHasBeenRetrievedOnce } = this.state;
      positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListHasBeenRetrievedOnce,
      });
    }
    if (measureWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListFromFriendsHasBeenRetrievedOnce,
      });
    }
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      // componentDidMountFinished: true,
      externalUniqueId,
      localUniqueId: measureWeVoteId,
      // measure,
      measureSubtitle: measure.measure_subtitle,
      measureText: stripHtmlFromString(measure.measure_text),
      measureUrl: measure.measure_url || '',
      measureWeVoteId,
      noVoteDescription: stripHtmlFromString(measure.no_vote_description),
      yesVoteDescription: stripHtmlFromString(measure.yes_vote_description),
    });
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.resizeObserver = new ResizeObserver(() => {
      this.checkArrowVisibility();
    });
    if (this.scrollElement.current) {
      this.resizeObserver.observe(this.scrollElement.current);
    }
  }

  componentDidUpdate () {
    // The scroll element may not exist on first render (measureWeVoteId starts empty, render returns null).
    // Once state populates and the component actually renders, attach the ResizeObserver.
    if (this.scrollElement.current && this.resizeObserver && !this.observingScrollElement) {
      this.observingScrollElement = true;
      this.resizeObserver.observe(this.scrollElement.current);
    }
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('MeasureItemCompressed, onMeasureStoreChange, measureWeVoteId:', measureWeVoteId);
    if (measureWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('onMeasureStoreChange positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
      const { positionListHasBeenRetrievedOnce } = this.state;
      positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListHasBeenRetrievedOnce,
      });
    }
    if (measureWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListFromFriendsHasBeenRetrievedOnce,
      });
    }
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      measureSubtitle: measure.measure_subtitle,
      measureText: stripHtmlFromString(measure.measure_text),
      measureUrl: measure.measure_url || '',
      noVoteDescription: stripHtmlFromString(measure.no_vote_description),
      yesVoteDescription: stripHtmlFromString(measure.yes_vote_description),
    });
  }

  onClickShowOrganizationModalWithBallotItemInfo () {
    const { measureWeVoteId } = this.props;
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(measureWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalPositions(true);
  }

  onClickShowOrganizationModalWithPositions () {
    const { measureWeVoteId } = this.props;
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(measureWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
  }

  onClickShowOrganizationModalWithBallotItemInfoAndPositions () {
    const { measureWeVoteId } = this.props;
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(measureWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
  }

  localPositionListHasBeenRetrievedOnce = (measureWeVoteId) => {
    if (measureWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  };

  localPositionListFromFriendsHasBeenRetrievedOnce = (measureWeVoteId) => {
    if (measureWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  };

  checkArrowVisibility = () => {
    const el = this.scrollElement.current;
    if (el) {
      if (el.scrollWidth > el.clientWidth) {
        this.setState({
          hideLeftArrow: el.scrollLeft <= 0,
          hideRightArrow: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
        });
      } else {
        this.setState({
          hideLeftArrow: true,
          hideRightArrow: true,
        });
      }
    }
  };

  openOpinionModalFromDiscuss = () => {
    this.setState({ openOpinionModal: true });
  };

  handleOpinionModalClose = () => {
    this.setState({ openOpinionModal: false });
  };

  checkMeasureHasEndorsements = () => {
    // Callback for PositionRowListCompressed
  };

  toggleInfoModal = () => {
    const { showInfoModal } = this.state;
    this.setState({ showInfoModal: !showInfoModal });
  };

  openInfoModal = (tabIndex) => {
    this.setState({ showInfoModal: true, infoModalActiveTab: tabIndex });
  };

  handleInfoModalTabChange = (newTabIndex) => {
    this.setState({ infoModalActiveTab: newTabIndex });
  };

  render () {
    renderLog('MeasureItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      externalUniqueId, localUniqueId, measureSubtitle, measureText,
      measureUrl, measureWeVoteId, noVoteDescription, openOpinionModal,
      showInfoModal, infoModalActiveTab,
      yesVoteDescription,
    } = this.state;
    let { ballotItemDisplayName } = this.state;
    if (!measureWeVoteId) {
      return null;
    }
    let ballotDisplay = [];
    if (ballotItemDisplayName) {
      ballotDisplay = ballotItemDisplayName.split(':');
    }
    const measureSubtitleCapitalized = toTitleCase(measureSubtitle);
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);

    return (
      <MeasureItemCompressedWrapper>
        <MeasureTitleItem onClick={this.onClickShowOrganizationModalWithBallotItemInfoAndPositions}>
          {ballotDisplay[0]}
        </MeasureTitleItem>

        {/* Main content row: measure text | endorsements + sources | opinions */}
        <BallotScrollingInnerWrapper>
          <LeftArrowOuterWrapper className="u-show-desktop-tablet">
            <LeftArrowInnerWrapper id="measureLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, -640, this.checkArrowVisibility, 24); }}>
              {this.state.hideLeftArrow ? null : <ArrowBackIos classes={{ fontSize: 'medium' }} />}
            </LeftArrowInnerWrapper>
          </LeftArrowOuterWrapper>
          <BallotHorizontallyScrollingContainer
            ref={this.scrollElement}
            onScroll={this.checkArrowVisibility}
            showLeftGradient={!this.state.hideLeftArrow}
            showRightGradient={!this.state.hideRightArrow}
            style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'stretch', whiteSpace: 'normal', borderBottom: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
          >
            {/* Left column: Measure description */}
            <MeasureDescriptionColumn
              className="u-cursor--pointer"
              onClick={() => this.openInfoModal(0)}
            >
              <SubTitle>{measureSubtitleCapitalized}</SubTitle>
              <MeasureText>
                {shortenText(measureText, MEASURE_TEXT_MAX_LENGTH)}
                {measureText && measureText.length > MEASURE_TEXT_MAX_LENGTH && (
                  <>
                    &nbsp;
                    <span className="u-link-color">more</span>
                  </>
                )}
                {measureText && measureText.length <= MEASURE_TEXT_MAX_LENGTH && (
                  <>
                    <br />
                    <span className="u-link-color">more</span>
                  </>
                )}
              </MeasureText>
            </MeasureDescriptionColumn>

            {/* Middle column: endorsements + FROM INDEPENDENT SOURCES */}
            <EndorsementsAndSourcesColumn>
              {/* Support and Oppose endorsements side by side */}
              <EndorsementRow>
                <EndorsementColumn>
                  <PositionRowListCompressed
                    ballotItemWeVoteId={measureWeVoteId}
                    showSupport
                    firstInstance={false}
                    checkCandidateHasEndorsements={this.checkMeasureHasEndorsements}
                  />
                </EndorsementColumn>
                <EndorsementColumn>
                  <PositionRowListCompressed
                    ballotItemWeVoteId={measureWeVoteId}
                    showOppose
                    firstInstance={false}
                    checkCandidateHasEndorsements={this.checkMeasureHasEndorsements}
                  />
                </EndorsementColumn>
              </EndorsementRow>

              {/* FROM INDEPENDENT SOURCES section */}
              <IndependentSourcesSection>
                <IndependentSourcesHeader>FROM INDEPENDENT SOURCES</IndependentSourcesHeader>
                <IndependentSourcesColumns>
                  <YesMeansColumn>
                    <YesMeansTitle>
                      <GreenBold>YES</GreenBold>
                      {' means:'}
                    </YesMeansTitle>
                    {yesVoteDescription ? (
                      <SourceDescription>
                        {shortenText(yesVoteDescription, 200)}
                      </SourceDescription>
                    ) : (
                      <SourceDescription>No description available.</SourceDescription>
                    )}
                    {!!(yesVoteDescription) && (
                      <SeeMoreLink onClick={() => this.openInfoModal(1)}>
                        See more
                      </SeeMoreLink>
                    )}
                  </YesMeansColumn>
                  <NoMeansColumn>
                    <NoMeansTitle>
                      <RedBold>NO</RedBold>
                      {' means:'}
                    </NoMeansTitle>
                    {noVoteDescription ? (
                      <SourceDescription>
                        {shortenText(noVoteDescription, 200)}
                      </SourceDescription>
                    ) : (
                      <SourceDescription>No description available.</SourceDescription>
                    )}
                    {!!(noVoteDescription) && (
                      <SeeMoreLink onClick={() => this.openInfoModal(2)}>
                        See more
                      </SeeMoreLink>
                    )}
                  </NoMeansColumn>
                </IndependentSourcesColumns>
              </IndependentSourcesSection>
            </EndorsementsAndSourcesColumn>

            {/* Opinions column */}
            <OpinionsColumn>
              <MeasureOpinionsColumn
                measureWeVoteId={measureWeVoteId}
                onModalClose={this.handleOpinionModalClose}
                openEditModalOnLoad={openOpinionModal}
              />
            </OpinionsColumn>
          </BallotHorizontallyScrollingContainer>
          <RightArrowOuterWrapper className="u-show-desktop-tablet">
            <RightArrowInnerWrapper id="measureRightArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, 640, this.checkArrowVisibility, 24); }}>
              {this.state.hideRightArrow ? null : <ArrowForwardIos classes={{ fontSize: 'medium' }} />}
            </RightArrowInnerWrapper>
          </RightArrowOuterWrapper>
        </BallotScrollingInnerWrapper>

        {/* Bottom action bar: Vote Yes / Vote No / Comment */}
        <ItemActionBarOutsideWrapper>
          <Suspense fallback={<span />}>
            <ItemActionBar
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={measureWeVoteId}
              externalUniqueId={`${externalUniqueId}-${localUniqueId}-MeasureItemCompressed-${measureWeVoteId}`}
              shareButtonHide
              hidePositionPublicToggle
              togglePositionStatementFunction={this.openOpinionModalFromDiscuss}
            />
          </Suspense>
        </ItemActionBarOutsideWrapper>
        {/* Modal: Combined description + YES/NO means (3 tabs) */}
        <MeasureInfoModal
          initialTab={infoModalActiveTab}
          isOpen={showInfoModal}
          measureText={measureText}
          measureSubtitle={measureSubtitleCapitalized}
          measureTitle={ballotDisplay[0]}
          measureUrl={measureUrl}
          measureWeVoteId={measureWeVoteId}
          noVoteDescription={noVoteDescription}
          onClose={this.toggleInfoModal}
          onTabChange={this.handleInfoModalTabChange}
          yesVoteDescription={yesVoteDescription}
        />

      </MeasureItemCompressedWrapper>
    );
  }
}
MeasureItemCompressed.propTypes = {
  externalUniqueId: PropTypes.string,
  measureWeVoteId: PropTypes.string.isRequired,
};

const styles = (theme) => ({
  buttonRoot: {
    padding: 4,
    fontSize: 12,
    minWidth: 60,
    height: 30,
    [theme.breakpoints.down('md')]: {
      minWidth: 60,
      height: 30,
    },
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 50,
      height: 30,
      padding: '0 8px',
      fontSize: 10,
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

// Styled Components

const EndorsementColumn = styled('div')`
  flex: 1 1 0;
  min-width: 0;
`;

const EndorsementRow = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 16px;
  &:has(span, img) {
    border-bottom: 1px solid #ddd;
    padding-bottom: 12px;
  }
  &:not(:has(span, img)) {
    display: none;
  }
`;

const EndorsementsAndSourcesColumn = styled('div')`
  display: flex;
  flex: 0 0 370px;
  flex-direction: column;
  gap: 12px;
  max-width: 370px;
  min-width: 370px;
`;

const GreenBold = styled('span')`
  color: ${DesignTokenColors.confirmation700};
  font-weight: bold;
`;

const IndependentSourcesColumns = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

const IndependentSourcesHeader = styled('div')`
  color: #999;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const IndependentSourcesSection = styled('div')`
`;

const ItemActionBarOutsideWrapper = styled('div')`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  padding-bottom: 12px;
  padding-left: 8px;
  width: 100%;
`;

const MeasureDescriptionColumn = styled('div')`
  border-right: 1px solid #ddd;
  flex: 0 0 230px;
  max-width: 230px;
  min-width: 230px;
  padding: 0 16px 8px 8px;
`;

const MeasureItemCompressedWrapper = styled('div')`
  border: none;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  position: relative;
  transition: box-shadow 0.2s ease, background-color 0.3s ease;
  &:hover {
    background-color: ${DesignTokenColors.neutral50};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  }
  ${LeftArrowOuterWrapper},
  ${RightArrowOuterWrapper} {
    background: transparent;
  }
`;

const MeasureText = styled('div')`
  color: #777;
  font-weight: 300;
  white-space: normal;
  ${constrainedTextMobileStyles}
`;

const MeasureTitleItem = styled('h1')`
  color: #4371cc;
  cursor: pointer;
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 0;
  margin-top: 0;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NoMeansColumn = styled('div')`
  flex: 1 1 0;
  min-width: 0;
`;

const NoMeansTitle = styled('div')`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const OpinionsColumn = styled('div')`
  border-left: 1px solid #ddd;
  flex: 0 0 295px;
  max-width: 295px;
  min-width: 295px;
  padding-left: 16px;
`;

const RedBold = styled('span')`
  color: ${DesignTokenColors.alert700};
  font-weight: bold;
`;

const SeeMoreLink = styled('div')`
  color: #1073d4;
  cursor: pointer;
  font-size: 14px;
  margin-top: 4px;
  &:hover {
    text-decoration: underline;
  }
`;

const SourceDescription = styled('div')`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
  color: #555;
  display: -webkit-box;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  white-space: normal;
`;

const SubTitle = styled('h3')`
  color: #4371cc;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 6px;
  margin-top: 0;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  ${constrainedTextMobileStyles}
`;

const YesMeansColumn = styled('div')`
  flex: 1 1 0;
  min-width: 0;
`;

const YesMeansTitle = styled('div')`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export default withTheme(withStyles(styles)(MeasureItemCompressed));
