import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import MeasureActions from '../../actions/MeasureActions';
import AppObservableStore from '../../common/stores/AppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import shortenText from '../../common/utils/shortenText';
import { stripHtmlFromString } from '../../common/utils/textFormat';
import toTitleCase from '../../common/utils/toTitleCase';
import BallotStore from '../../stores/BallotStore';
import MeasureStore from '../../stores/MeasureStore';
import { constrainedTextMobileStyles } from '../Style/BallotStyles';
import MeasureDescriptionModal from './MeasureDescriptionModal';
import MeasureOpinionsColumn from './MeasureOpinionsColumn';
import MeasureYesNoModal from './MeasureYesNoModal';
import PositionRowListCompressed from './PositionRowListCompressed';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const PositionStatementModal = React.lazy(() => import(/* webpackChunkName: 'PositionStatementModal' */ '../Widgets/PositionStatementModal'));

class MeasureItemCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      externalUniqueId: '',
      measureSubtitle: '',
      measureText: '',
      measureUrl: '',
      measureWeVoteId: '',
      noVoteDescription: '',
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      showDescriptionModal: false,
      showPositionStatementModal: false,
      showYesNoModal: false,
      yesNoActiveTab: 0,
      yesVoteDescription: '',
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfo = this.onClickShowOrganizationModalWithBallotItemInfo.bind(this);
    this.onClickShowOrganizationModalWithPositions = this.onClickShowOrganizationModalWithPositions.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfoAndPositions = this.onClickShowOrganizationModalWithBallotItemInfoAndPositions.bind(this);
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
    const organizationWeVoteId = (organization && organization.organization_we_vote_id) ? organization.organization_we_vote_id : this.props.organizationWeVoteId;
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
      organizationWeVoteId,
    });
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
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
      // measure,
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

  checkMeasureHasEndorsements = () => {
    // Callback for PositionRowListCompressed
  };

  toggleDescriptionModal = () => {
    const { showDescriptionModal } = this.state;
    this.setState({ showDescriptionModal: !showDescriptionModal });
  };

  togglePositionStatementModal = () => {
    const { showPositionStatementModal } = this.state;
    this.setState({ showPositionStatementModal: !showPositionStatementModal });
  };

  toggleYesNoModal = () => {
    const { showYesNoModal } = this.state;
    this.setState({ showYesNoModal: !showYesNoModal });
  };

  openYesNoModal = (tabIndex) => {
    this.setState({ showYesNoModal: true, yesNoActiveTab: tabIndex });
  };

  handleYesNoTabChange = (newTabIndex) => {
    this.setState({ yesNoActiveTab: newTabIndex });
  };

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
    renderLog('MeasureItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      externalUniqueId, localUniqueId, measureSubtitle, measureText,
      measureUrl, measureWeVoteId, noVoteDescription,
      showDescriptionModal, showPositionStatementModal, showYesNoModal, yesNoActiveTab,
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
        <SubTitle>{measureSubtitleCapitalized}</SubTitle>

        {/* Main content row: measure text | endorsements + sources | opinions */}
        <MeasureContentRow>
          {/* Left column: Measure description */}
          <MeasureDescriptionColumn
            className="u-cursor--pointer"
            onClick={this.toggleDescriptionModal}
          >
            <MeasureText>
              {shortenText(measureText, 200)}
              &nbsp;
              <span className="u-link-color">more</span>
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
                    <SeeMoreLink onClick={() => this.openYesNoModal(0)}>
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
                    <SeeMoreLink onClick={() => this.openYesNoModal(1)}>
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
              onClickCommentInput={this.togglePositionStatementModal}
            />
          </OpinionsColumn>
        </MeasureContentRow>

        {/* Bottom action bar: Vote Yes / Vote No / Comment */}
        <ItemActionBarOutsideWrapper>
          <Suspense fallback={<span />}>
            <ItemActionBar
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={measureWeVoteId}
              externalUniqueId={`${externalUniqueId}-${localUniqueId}-MeasureItemCompressed-${measureWeVoteId}`}
              shareButtonHide
              hidePositionPublicToggle
            />
          </Suspense>
        </ItemActionBarOutsideWrapper>
        {/* Modal: Full measure description */}
        <MeasureDescriptionModal
          isOpen={showDescriptionModal}
          measureText={measureText}
          measureSubtitle={measureSubtitleCapitalized}
          measureTitle={ballotDisplay[0]}
          measureUrl={measureUrl}
          measureWeVoteId={measureWeVoteId}
          onClose={this.toggleDescriptionModal}
        />

        {/* Modal: Position statement / opinion */}
        {showPositionStatementModal && (
          <Suspense fallback={<span />}>
            <PositionStatementModal
              ballotItemWeVoteId={measureWeVoteId}
              externalUniqueId={`MeasureItemCompressed-${measureWeVoteId}`}
              show={showPositionStatementModal}
              toggleModal={this.togglePositionStatementModal}
            />
          </Suspense>
        )}

        {/* Modal: YES/NO means tabbed */}
        <MeasureYesNoModal
          initialTab={yesNoActiveTab}
          isOpen={showYesNoModal}
          measureWeVoteId={measureWeVoteId}
          noVoteDescription={noVoteDescription}
          onClose={this.toggleYesNoModal}
          onTabChange={this.handleYesNoTabChange}
          yesVoteDescription={yesVoteDescription}
        />
      </MeasureItemCompressedWrapper>
    );
  }
}
MeasureItemCompressed.propTypes = {
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
`;

const EndorsementsAndSourcesColumn = styled('div')`
  display: flex;
  flex: 2 1 0;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

const GreenBold = styled('span')`
  color: ${DesignTokenColors.confirmation700};
  font-weight: bold;
`;

const IndependentSourcesColumns = styled('div')(({ theme }) => (`
  display: flex;
  flex-direction: row;
  gap: 24px;
  ${theme.breakpoints.down('md')} {
    flex-direction: column;
    gap: 16px;
  }
`));

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

const MeasureContentRow = styled('div')(({ theme }) => (`
  align-items: stretch;
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  ${theme.breakpoints.down('md')} {
    flex-direction: column;
  }
`));

const MeasureDescriptionColumn = styled('div')(({ theme }) => (`
  border-right: 1px solid #ddd;
  flex: 0 0 250px;
  max-width: 280px;
  padding-right: 16px;
  ${theme.breakpoints.down('md')} {
    border-bottom: 1px solid #ddd;
    border-right: none;
    flex: 1 1 auto;
    max-width: 100%;
    padding-bottom: 12px;
    padding-right: 0;
  }
`));

const MeasureItemCompressedWrapper = styled('div')`
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  position: relative;
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

const OpinionsColumn = styled('div')(({ theme }) => (`
  border-left: 1px solid #ddd;
  flex: 1 1 0;
  min-width: 200px;
  padding-left: 16px;
  ${theme.breakpoints.down('md')} {
    border-left: none;
    border-top: 1px solid #ddd;
    padding-left: 0;
    padding-top: 12px;
  }
`));

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
  color: #555;
  font-size: 14px;
  line-height: 1.4;
  white-space: normal;
`;

const SubTitle = styled('h3')`
  color: #4371cc;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 4px;
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
