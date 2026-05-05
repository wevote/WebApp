import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import CandidateStore from '../../stores/CandidateStore';
import VoterStore from '../../stores/VoterStore';
import PositionList from './PositionList';

const VoterPositionEntryAndDisplay = React.lazy(() => import(/* webpackChunkName: 'VoterPositionEntryAndDisplay' */ '../PositionItem/VoterPositionEntryAndDisplay'));

const OPINIONS_TO_SHOW = 2;

class CandidateOpinionsColumn extends Component {
  constructor (props) {
    super(props);
    this.state = {
      opinions: [],
      opinionsCount: 0,
    };
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onStoreChange.bind(this));
    this.onStoreChange();
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
  }

  onStoreChange () {
    const { candidateWeVoteId } = this.props;
    const allPositions = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
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
    const { candidateWeVoteId } = this.props;
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
  };

  render () {
    renderLog('CandidateOpinionsColumn');
    const { candidateWeVoteId, hasOtherColumns, politicianWeVoteId } = this.props;
    const { opinions, opinionsCount } = this.state;
    const hideHeader = !hasOtherColumns && opinionsCount === 0;
    const headerText = opinionsCount > 0 ? `${opinionsCount} ${opinionsCount === 1 ? 'Opinion' : 'Opinions'}` : 'Opinions';

    return (
      <OpinionsWrapper>
        {!hideHeader && <OpinionsCountHeader>{headerText}</OpinionsCountHeader>}

        <Suspense fallback={<span />}>
          <VoterPositionEntryAndDisplay
            ballotItemWeVoteId={candidateWeVoteId}
            compactMode
            externalUniqueId={`CandidateOpinionsColumn-${candidateWeVoteId}`}
            noBottomMargin={opinionsCount === 0}
            politicianWeVoteId={politicianWeVoteId}
          />
        </Suspense>

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

CandidateOpinionsColumn.propTypes = {
  candidateWeVoteId: PropTypes.string.isRequired,
  hasOtherColumns: PropTypes.bool,
  politicianWeVoteId: PropTypes.string,
};

const OpinionsCountHeader = styled('div')`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const OpinionsWrapper = styled('div')`
  display: flex;
  flex-direction: column;
`;

export default CandidateOpinionsColumn;
