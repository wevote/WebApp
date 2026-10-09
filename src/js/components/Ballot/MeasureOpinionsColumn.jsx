import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { getPositionFollowersCount } from './opinionsHelpers';
import PositionList from './PositionList';
import shortenText from '../../common/utils/shortenText';
import { stripHtmlFromString } from '../../common/utils/textFormat';

const VoterPositionEntryAndDisplay = React.lazy(() => import(/* webpackChunkName: 'VoterPositionEntryAndDisplay' */ '../PositionItem/VoterPositionEntryAndDisplay'));

const OPINIONS_TO_SHOW = 2;

class MeasureOpinionsColumn extends Component {
  constructor (props) {
    super(props);
    this.state = {
      opinions: [],
      opinionsCount: 0,
      referendumCon: '',
      referendumPro: '',
    };
  }

  componentDidMount () {
    this.measureStoreListener = MeasureStore.addListener(this.onStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onStoreChange.bind(this));
    this.onStoreChange();
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onStoreChange () {
    const { measureWeVoteId } = this.props;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('componentDidMount, measureWeVoteId: ', measureWeVoteId);
    if (!measure || !measure.we_vote_id) {
      // If the measure isn't in the MeasureStore, retrieve it
      MeasureActions.measureRetrieve(measureWeVoteId);
    }
    const allPositions = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(measureWeVoteId);
    const currentVoterWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    const opinions = allPositions
      .filter(
        (position) => position.is_support &&
          position.statement_text && position.statement_text.length > 0 &&
          !(position.speaker_display_name && position.speaker_display_name.startsWith('Voter-')) &&
          position.speaker_we_vote_id !== currentVoterWeVoteId,
      )
      .sort((a, b) => getPositionFollowersCount(b) - getPositionFollowersCount(a));
    this.setState({
      referendumCon: stripHtmlFromString(measure.referendum_con),
      referendumPro: stripHtmlFromString(measure.referendum_pro),
      opinions,
      opinionsCount: opinions.length,
    });
  }

  onClickShowOrganizationModalWithPositions = () => {
    const { measureWeVoteId } = this.props;
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(measureWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
  };

  render () {
    renderLog('MeasureOpinionsColumn');
    const { openInfoModal } = this.props;
    const { opinions, opinionsCount, referendumCon, referendumPro } = this.state;

    return (
      <OpinionsWrapper>
        {/* FROM INDEPENDENT SOURCES section */}
        {(referendumCon || referendumPro) && (
          <IndependentSourcesSection>
            <IndependentSourcesHeader>FROM INDEPENDENT SOURCES</IndependentSourcesHeader>
            <IndependentSourcesColumns>
              <YesMeansColumn onClick={() => openInfoModal(1)}>
                <YesMeansTitle>
                  <GreenBold>PRO</GreenBold>
                  :
                </YesMeansTitle>
                {referendumPro ? (
                  <SourceDescription>
                    {shortenText(referendumPro, 75)}
                  </SourceDescription>
                ) : (
                  <SourceDescription>No argument available.</SourceDescription>
                )}
                {!!(referendumPro) && (
                  <SeeMoreLink>
                    See more
                  </SeeMoreLink>
                )}
              </YesMeansColumn>
              <NoMeansColumn onClick={() => openInfoModal(2)}>
                <NoMeansTitle>
                  <RedBold>CON</RedBold>
                  :
                </NoMeansTitle>
                {referendumCon ? (
                  <SourceDescription>
                    {shortenText(referendumCon, 75)}
                  </SourceDescription>
                ) : (
                  <SourceDescription>No argument available.</SourceDescription>
                )}
                {!!(referendumCon) && (
                  <SeeMoreLink>
                    See more
                  </SeeMoreLink>
                )}
              </NoMeansColumn>
            </IndependentSourcesColumns>
          </IndependentSourcesSection>
        )}

        {opinionsCount > 0 && (
          <OpinionsCountHeader>{`${opinionsCount} ${opinionsCount === 1 ? 'Opinion' : 'Opinions'}`}</OpinionsCountHeader>
        )}
        {!opinionsCount && (
          <OpinionsCountHeader>Opinions</OpinionsCountHeader>
        )}

        {/* What's your opinion input */}
        <Suspense fallback={<span />}>
          <VoterPositionEntryAndDisplay
            ballotItemWeVoteId={this.props.measureWeVoteId}
            compactMode
            externalUniqueId={`MeasureOpinionsColumn-${this.props.measureWeVoteId}`}
            onModalClose={this.props.onModalClose}
            openEditModalOnLoad={this.props.openEditModalOnLoad}
          />
        </Suspense>

        {/* Opinion entries via PositionList */}
        {opinions.length > 0 && (
          <PositionList
            compactMode
            incomingPositionList={opinions}
            maxToShow={OPINIONS_TO_SHOW}
            onSeeMoreClick={this.onClickShowOrganizationModalWithPositions}
            positionListExistsTitle={<span />}
          />
        )}
      </OpinionsWrapper>
    );
  }
}

MeasureOpinionsColumn.propTypes = {
  measureWeVoteId: PropTypes.string.isRequired,
  onModalClose: PropTypes.func,
  openEditModalOnLoad: PropTypes.bool,
  openInfoModal: PropTypes.func,
};

// Styles

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
  color: ${DesignTokenColors.neutralUI400};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const IndependentSourcesSection = styled('div')`
  border-bottom: 1px solid #ddd;
  padding-bottom: 12px;
  margin-bottom: 12px;
`;

const NoMeansColumn = styled('div')`
  cursor: pointer;
  flex: 1 1 0;
  min-width: 0;
`;

const NoMeansTitle = styled('div')`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const OpinionsCountHeader = styled.div`
  color: ${DesignTokenColors.neutralUI400};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const OpinionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const YesMeansColumn = styled('div')`
  cursor: pointer;
  flex: 1 1 0;
  min-width: 0;
`;

const YesMeansTitle = styled('div')`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export default MeasureOpinionsColumn;
