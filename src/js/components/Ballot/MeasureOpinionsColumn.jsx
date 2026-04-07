import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import MeasureStore from '../../stores/MeasureStore';
import VoterStore from '../../stores/VoterStore';
import PositionList from './PositionList';

const VoterPositionEntryAndDisplay = React.lazy(() => import(/* webpackChunkName: 'VoterPositionEntryAndDisplay' */ '../PositionItem/VoterPositionEntryAndDisplay'));

const OPINIONS_TO_SHOW = 3;

class MeasureOpinionsColumn extends Component {
  constructor (props) {
    super(props);
    this.state = {
      opinions: [],
      opinionsCount: 0,
    };
  }

  componentDidMount () {
    this.measureStoreListener = MeasureStore.addListener(this.onStoreChange.bind(this));
    this.onStoreChange();
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
  }

  onStoreChange () {
    const { measureWeVoteId } = this.props;
    const allPositions = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(measureWeVoteId);
    const currentVoterWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    const opinions = allPositions.filter(
      (position) => position.statement_text && position.statement_text.length > 0 &&
        !(position.speaker_display_name && position.speaker_display_name.startsWith('Voter-')) &&
        position.speaker_we_vote_id !== currentVoterWeVoteId,
    );
    this.setState({
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
    const { opinions, opinionsCount } = this.state;

    return (
      <OpinionsWrapper>
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
};

// Styles

const OpinionsCountHeader = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const OpinionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default MeasureOpinionsColumn;
