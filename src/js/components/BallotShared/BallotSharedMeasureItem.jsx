import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import MeasureActions from '../../actions/MeasureActions';
import extractNumber from '../../common/utils/extractNumber';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import shortenText from '../../common/utils/shortenText';
import toTitleCase from '../../common/utils/toTitleCase';
import AppObservableStore from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import MeasureStore from '../../stores/MeasureStore';
import SupportStore from '../../stores/SupportStore';
import { stripHtmlFromString } from '../../utils/textFormat';
import {
  OverflowContainer,
  PositionRowListEmptyWrapper,
  PositionRowListInnerWrapper,
  PositionRowListOneWrapper,
  PositionRowListOuterWrapper,
  PositionRowListScoreColumn,
  PositionRowListScoreHeader,
  PositionRowListScoreSpacer,
} from '../Style/PositionRowListStyles';
import PositionRowList from '../Ballot/PositionRowList';
import PositionRowEmpty from '../Ballot/PositionRowEmpty';

const BallotItemSupportOpposeScoreDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeScoreDisplay' */ '../Widgets/ScoreDisplay/BallotItemSupportOpposeScoreDisplay'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const TopCommentByBallotItem = React.lazy(() => import(/* webpackChunkName: 'TopCommentByBallotItem' */ '../Widgets/TopCommentByBallotItem'));

class BallotSharedMeasureItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // componentDidMountFinished: false,
      externalUniqueId: '',
      measureSubtitle: '',
      measureText: '',
      measureWeVoteId: '',
      noVoteDescription: '',
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      showPositionStatement: false,
      // numberOfOpposePositionsForScore: 0,
      // numberOfSupportPositionsForScore: 0,
      voterSupportsBallotItem: false,
      yesVoteDescription: '',
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfo = this.onClickShowOrganizationModalWithBallotItemInfo.bind(this);
    this.onClickShowOrganizationModalWithPositions = this.onClickShowOrganizationModalWithPositions.bind(this);
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    const { externalUniqueId, measureWeVoteId, organization } = this.props;
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
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
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
    const organizationWeVoteId = (organization && organization.organization_we_vote_id) ? organization.organization_we_vote_id : this.props.organizationWeVoteId;
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      // componentDidMountFinished: true,
      externalUniqueId,
      localUniqueId: measureWeVoteId,
      // measure,
      measureSubtitle: measure.measure_subtitle,
      measureText: stripHtmlFromString(measure.measure_text),
      measureWeVoteId,
      noVoteDescription: stripHtmlFromString(measure.no_vote_description),
      yesVoteDescription: stripHtmlFromString(measure.yes_vote_description),
      organizationWeVoteId,
    });
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
    if (ballotItemStatSheet) {
      const {
        // numberOfOpposePositionsForScore, numberOfSupportPositionsForScore,
        voterSupportsBallotItem,
      } = ballotItemStatSheet;
      this.setState({
        // numberOfOpposePositionsForScore,
        // numberOfSupportPositionsForScore,
        voterSupportsBallotItem,
      });
    }
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('BallotSharedMeasureItem, onMeasureStoreChange, measureWeVoteId:', measureWeVoteId);
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
      // measure,
      measureSubtitle: measure.measure_subtitle,
      measureText: stripHtmlFromString(measure.measure_text),
      noVoteDescription: stripHtmlFromString(measure.no_vote_description),
      yesVoteDescription: stripHtmlFromString(measure.yes_vote_description),
    });
  }

  onSupportStoreChange () {
    const { measureWeVoteId } = this.state;
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
    if (ballotItemStatSheet) {
      const {
        // numberOfOpposePositionsForScore, numberOfSupportPositionsForScore,
        voterSupportsBallotItem,
      } = ballotItemStatSheet;
      this.setState({
        // numberOfOpposePositionsForScore,
        // numberOfSupportPositionsForScore,
        voterSupportsBallotItem,
      });
    }
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

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organizationWeVoteId) {
      // If there is an organizationWeVoteId, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organizationWeVoteId, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  togglePositionStatement () {
    const { showPositionStatement } = this.state;
    this.setState({
      showPositionStatement: !showPositionStatement,
    });
  }

  localPositionListHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('BallotSharedMeasureItem');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      externalUniqueId, localUniqueId, measureSubtitle, measureText,
      measureWeVoteId, noVoteDescription,
      voterSupportsBallotItem, yesVoteDescription,
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
      <BallotSharedMeasureItemWrapper>
        <MeasureTitle onClick={this.onClickShowOrganizationModalWithBallotItemInfo}>
          {ballotDisplay[0]}
        </MeasureTitle>
        <MeasureContainer>
          <MeasureWrapper>
            <InfoDetailsRow className="u-cursor--pointer" onClick={this.onClickShowOrganizationModalWithBallotItemInfo}>
              <SubTitle>{measureSubtitleCapitalized}</SubTitle>
              <MeasureText>
                {shortenText(measureText, 200)}
                &nbsp;
                <span className="u-link-color">
                  more
                </span>
              </MeasureText>
            </InfoDetailsRow>
            <ChoiceSpecificsColumns>
              <ChoiceSpecifics
                id={`measureItemCompressedChoiceYes-${measureWeVoteId}`}
              >
                <ChoiceTitle onClick={this.onClickShowOrganizationModalWithBallotItemInfo}>
                  {`Yes On ${extractNumber(ballotItemDisplayName)}`}
                </ChoiceTitle>
                <ChoiceInfo>
                  {/* If there is a "yes vote" quote about the measure, show that. If not, show the yesVoteDescription */}
                  <Suspense fallback={<></>}>
                    <DelayedLoad showLoadingText waitBeforeShow={500}>
                      <>
                        <Suspense fallback={<></>}>
                          <ItemActionBar
                            ballotItemDisplayName={ballotItemDisplayName}
                            ballotItemWeVoteId={measureWeVoteId}
                            commentButtonHide
                            commentButtonHideInMobile
                            externalUniqueId={`${externalUniqueId}-${localUniqueId}-BallotSharedMeasureItemVoteYes-${measureWeVoteId}`}
                            hideOpposeNo
                            shareButtonHide
                            hidePositionPublicToggle
                          />
                        </Suspense>
                        <TopCommentByBallotItem
                          ballotItemWeVoteId={measureWeVoteId}
                          childChangeIndicator={yesVoteDescription}
                          // learnMoreUrl={this.getMeasureLink(measureWeVoteId)}
                          limitToYes
                        >
                          <span>
                            {shortenText(yesVoteDescription, 200)}
                          </span>
                        </TopCommentByBallotItem>
                      </>
                    </DelayedLoad>
                  </Suspense>
                </ChoiceInfo>
              </ChoiceSpecifics>
              <ChoiceSpecifics
                id={`measureItemCompressedChoiceNo-${measureWeVoteId}`}
              >
                <ChoiceTitle onClick={this.onClickShowOrganizationModalWithBallotItemInfo}>
                  {`No On ${extractNumber(ballotItemDisplayName)}`}
                </ChoiceTitle>
                <ChoiceInfo>
                  {/* If there is a "no vote" quote about the measure, show that. If not, show the noVoteDescription */}
                  <Suspense fallback={<></>}>
                    <DelayedLoad showLoadingText waitBeforeShow={500}>
                      <>
                        <Suspense fallback={<></>}>
                          <ItemActionBar
                            ballotItemDisplayName={ballotItemDisplayName}
                            ballotItemWeVoteId={measureWeVoteId}
                            commentButtonHide
                            commentButtonHideInMobile
                            externalUniqueId={`${externalUniqueId}-${localUniqueId}-BallotSharedMeasureItemVoteNo-${measureWeVoteId}`}
                            hideSupportYes
                            shareButtonHide
                            hidePositionPublicToggle
                          />
                        </Suspense>
                        <TopCommentByBallotItem
                          ballotItemWeVoteId={measureWeVoteId}
                          childChangeIndicator={noVoteDescription}
                          // learnMoreUrl={this.getMeasureLink(measureWeVoteId)}
                          limitToNo
                        >
                          <span>
                            {shortenText(noVoteDescription, 200)}
                          </span>
                        </TopCommentByBallotItem>
                      </>
                    </DelayedLoad>
                  </Suspense>
                </ChoiceInfo>
              </ChoiceSpecifics>
            </ChoiceSpecificsColumns>
          </MeasureWrapper>
          <PositionRowListOuterWrapper>
            <OverflowContainer>
              <PositionRowListInnerWrapper>
                <PositionRowListOneWrapper>
                  <PositionRowList
                    ballotItemWeVoteId={measureWeVoteId}
                    showSupport
                  />
                </PositionRowListOneWrapper>
                {voterSupportsBallotItem && (
                  <PositionRowListOneWrapper>
                    <PositionRowList
                      ballotItemWeVoteId={measureWeVoteId}
                      showOppose
                    />
                  </PositionRowListOneWrapper>
                )}
                <PositionRowListOneWrapper>
                  <PositionRowList
                    ballotItemWeVoteId={measureWeVoteId}
                    showInfoOnly
                  />
                </PositionRowListOneWrapper>
                <PositionRowListEmptyWrapper>
                  <PositionRowEmpty
                    ballotItemWeVoteId={measureWeVoteId}
                  />
                </PositionRowListEmptyWrapper>
                <PositionRowListScoreColumn>
                  <PositionRowListScoreHeader>
                    Score
                  </PositionRowListScoreHeader>
                  <PositionRowListScoreSpacer>
                    <Suspense fallback={<></>}>
                      <BallotItemSupportOpposeScoreDisplay
                        ballotItemWeVoteId={measureWeVoteId}
                        onClickFunction={this.onClickShowOrganizationModalWithPositions}
                        hideEndorsementsOverview
                        hideNumbersOfAllPositions
                      />
                    </Suspense>
                  </PositionRowListScoreSpacer>
                </PositionRowListScoreColumn>
              </PositionRowListInnerWrapper>
            </OverflowContainer>
          </PositionRowListOuterWrapper>
        </MeasureContainer>
      </BallotSharedMeasureItemWrapper>
    );
  }
}
BallotSharedMeasureItem.propTypes = {
  externalUniqueId: PropTypes.string,
  measureWeVoteId: PropTypes.string.isRequired,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
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
  cardRoot: {
    padding: '16px 16px 8px 16px',
    [theme.breakpoints.down('lg')]: {
      padding: '16px 16px 0 16px',
    },
  },
  endorsementIconRoot: {
    fontSize: 14,
    margin: '.3rem .3rem 0 .5rem',
  },
  cardHeaderIconRoot: {
    marginTop: '-.3rem',
    fontSize: 20,
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .4rem',
  },
});

const InfoDetailsRow = styled('div')`
`;

const ChoiceSpecificsColumns = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const ChoiceSpecifics = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: column;
  // min-width: 47%;
  padding-right: 8px;
  ${theme.breakpoints.up('md')} {
    max-width: 47%;
  }
`));

const ChoiceTitle = styled('h1')`
  color: #4371cc;
  cursor: pointer;
  font-weight: bold;
`;

const ChoiceInfo = styled('span')(({ theme }) => (`
  font-size: 12px;
  color: #777;
  ${theme.breakpoints.down('md')} {
    max-width: 140%;
  }
`));

const MeasureContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  // padding: 10px 5px 0 10px;
`;

const BallotSharedMeasureItemWrapper = styled('div')`
  display: flex;
  border: 1px solid #fff;
  flex-direction: column;
  margin-bottom: 60px;
  position: relative;
`;

const MeasureTitle = styled('h1')`
  color: #4371cc;
  cursor: pointer;
  font-weight: 400;
  font-size: 32px;
  margin-bottom: 0;
  margin-top: 0;
  white-space: nowrap;
  width: 100%;
`;

const MeasureWrapper = styled('div')(({ theme }) => (`
  width: 320px;
  // ${theme.breakpoints.down('sm')} {
  //   width: 100%;
  // }
  // ${theme.breakpoints.up('sm')} {
  //   min-width: 320px;
  // }
`));

const SubTitle = styled('h3')(({ theme }) => (`
  font-size: 20px;
  // font-weight: 300;
  // color: #555;
  margin-top: 9px;
  // ${theme.breakpoints.down('lg')} {
  //   font-size: 13px;
  // }
`));

const MeasureText = styled('div')`
  font-size: 13px;
  font-weight: 300;
  color: #777;
  width: 100%;
`;

export default withTheme(withStyles(styles)(BallotSharedMeasureItem));
