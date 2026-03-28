import { Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import LazyImage from '../../common/components/LazyImage';
import { timeFromDate } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import speakerDisplayNameToInitials from '../../common/utils/speakerDisplayNameToInitials';
import AppObservableStore from '../../common/stores/AppObservableStore';
import MeasureStore from '../../stores/MeasureStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';

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
    this.supportStoreListener = SupportStore.addListener(this.onStoreChange.bind(this));
    this.onStoreChange();
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onStoreChange () {
    const { measureWeVoteId } = this.props;
    const allPositions = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(measureWeVoteId);
    const opinions = allPositions.filter(
      (position) => position.statement_text && position.statement_text.length > 0 &&
        !(position.speaker_display_name && position.speaker_display_name.startsWith('Voter-')),
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
    const { onClickCommentInput } = this.props;
    const currentVoterWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    const opinionsToDisplay = opinions.slice(0, OPINIONS_TO_SHOW);

    return (
      <OpinionsWrapper>
        {opinionsCount > 0 && (
          <OpinionsCountHeader>{`${opinionsCount} ${opinionsCount === 1 ? 'Opinion' : 'Opinions'}`}</OpinionsCountHeader>
        )}
        {!opinionsCount && (
          <OpinionsCountHeader>Opinions</OpinionsCountHeader>
        )}

        {/* What's your opinion input */}
        <CommentInputRow onClick={onClickCommentInput}>
          <CommentAvatarWrapper>
            <CommentBubbleIcon />
          </CommentAvatarWrapper>
          <CommentInputPlaceholder>
            {'What\'s your opinion?'}
          </CommentInputPlaceholder>
        </CommentInputRow>

        {/* Opinion entries */}
        {opinionsToDisplay.map((opinion) => {
          const { sx: styleWithBackgroundColor, children: initials } = speakerDisplayNameToInitials(opinion.speaker_display_name);
          const isCurrentVoter = opinion.speaker_we_vote_id === currentVoterWeVoteId;
          const displayName = isCurrentVoter ?
            (opinion.speaker_display_name || 'You') :
            (opinion.speaker_display_name || '');
          const relativeTime = timeFromDate(opinion.last_updated || opinion.date_entered);

          return (
            <OpinionEntry key={opinion.position_we_vote_id}>
              <OpinionAvatarWrapper>
                {opinion.speaker_image_url_https_medium ? (
                  <LazyImage
                    src={opinion.speaker_image_url_https_medium}
                    placeholder={avatarGeneric()}
                    className="profile-photo"
                    height={32}
                    width={32}
                    alt=""
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      ...styleWithBackgroundColor,
                      height: '32px',
                      width: '32px',
                      fontSize: '14px',
                    }}
                  >
                    {initials}
                  </Avatar>
                )}
              </OpinionAvatarWrapper>
              <OpinionContent>
                <OpinionHeader>
                  <OpinionAuthor>{displayName}</OpinionAuthor>
                </OpinionHeader>
                <OpinionText>{opinion.statement_text}</OpinionText>
                {relativeTime && (
                  <OpinionTimestamp>
                    {displayName}
                    {' commented '}
                    {relativeTime}
                  </OpinionTimestamp>
                )}
              </OpinionContent>
            </OpinionEntry>
          );
        })}

        {opinionsCount > OPINIONS_TO_SHOW && (
          <SeeMoreLink onClick={this.onClickShowOrganizationModalWithPositions}>
            See more
          </SeeMoreLink>
        )}
      </OpinionsWrapper>
    );
  }
}

MeasureOpinionsColumn.propTypes = {
  measureWeVoteId: PropTypes.string.isRequired,
  onClickCommentInput: PropTypes.func,
};

// Styles

const CommentAvatarWrapper = styled.div`
  flex-shrink: 0;
  margin-right: 8px;
`;

const CommentBubbleIcon = styled.div`
  align-items: center;
  background-color: #ccc;
  border-radius: 50%;
  display: flex;
  height: 28px;
  justify-content: center;
  width: 28px;
  &::after {
    content: '💬';
    font-size: 14px;
  }
`;

const CommentInputPlaceholder = styled.div`
  color: #999;
  font-size: 14px;
`;

const CommentInputRow = styled.div`
  align-items: center;
  background-color: ${DesignTokenColors.neutral50};
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  margin-bottom: 12px;
  padding: 8px 12px;
  &:hover {
    background-color: ${DesignTokenColors.neutral100};
  }
`;

const OpinionAuthor = styled.span`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  font-weight: 600;
`;

const OpinionAvatarWrapper = styled.div`
  flex-shrink: 0;
  margin-right: 8px;
  margin-top: 2px;
`;

const OpinionContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const OpinionEntry = styled.div`
  align-items: flex-start;
  display: flex;
  margin-bottom: 12px;
`;

const OpinionHeader = styled.div`
  align-items: baseline;
  display: flex;
`;

const OpinionText = styled.div`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: ${DesignTokenColors.neutralUI700};
  display: -webkit-box;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  word-break: break-word;
`;

const OpinionTimestamp = styled.div`
  color: #999;
  font-size: 12px;
  margin-top: 2px;
`;

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

const SeeMoreLink = styled.div`
  color: #1073d4;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

export default MeasureOpinionsColumn;
