import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import { avatarGeneric } from '../../../utils/applicationUtils';
import LazyImage from '../LazyImage';
import {
  Comment, CommentName, CommentNameOuterWrapper, CommentTextInnerWrapper,
  CommentTextWrapper, CommentNameTwitterFollowers, CommentNameWithTimeWrapper,
  CommentVoterPhotoWrapper, CommentWrapper, OneCampaignInnerWrapper,
  OneCampaignOuterWrapper, ReadMoreSpan,
} from '../Style/CampaignDetailsStyles';
import abbreviateNumber from '../../utils/abbreviateNumber';
import { getDateFromUltimateElectionDate, getTodayAsInteger, timeFromDate } from '../../utils/dateFormat';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import stringToColor from '../../utils/stringToColor'
import PoliticianStore from '../../stores/PoliticianStore';
import VoterStore from '../../../stores/VoterStore';
import { Avatar } from '@mui/material';
import { blue } from '@mui/material/colors';


class PoliticianEndorsementForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showFullSupporterEndorsement: false,
    };
  }

  componentDidMount () {
    // console.log('PoliticianEndorsementForList componentDidMount');
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      todayAsInteger: getTodayAsInteger(0),
      voterWeVoteId,
    });
  }

  componentWillUnmount () {
    this.politicianStoreListener.remove();
  }

  onPoliticianStoreChange () {
    const { politicianWeVoteId } = this.props;
    const politician = PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId);
    const {
      seo_friendly_path: politicianSEOFriendlyPath,
    } = politician;
    let pathToUseToEditSupporterEndorsement;
    if (politicianSEOFriendlyPath) {
      pathToUseToEditSupporterEndorsement = `/${politicianSEOFriendlyPath}/-/why-do-you-support`;
    } else if (politicianWeVoteId) {
      pathToUseToEditSupporterEndorsement = `/${politicianWeVoteId}/p/why-do-you-support`;
    }
    this.setState({
      pathToUseToEditSupporterEndorsement,
    });
  }

  onHideFullSupporterEndorsement = () => {
    this.setState({
      showFullSupporterEndorsement: false,
    });
  }

  onShowFullSupporterEndorsement = () => {
    this.setState({
      showFullSupporterEndorsement: true,
    });
  }
  
  stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  render () {
    renderLog('PoliticianEndorsementForList');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`PoliticianEndorsementForList window.location.href: ${window.location.href}`);
    }
    const { classes, position } = this.props;
    const { pathToUseToEditSupporterEndorsement, showFullSupporterEndorsement, todayAsInteger, voterWeVoteId } = this.state;
    if (!position || !('position_we_vote_id' in position)) {
      return null;
    }
    const {
      is_oppose_or_negative_rating: isOpposeOrNegativeRating,
      is_support_or_positive_rating: isSupportOrPositiveRating,
      position_ultimate_election_date: positionUltimateElectionDateAsInteger,
      position_we_vote_id: positionWeVoteId,
      position_year: positionYear,
      statement_text: statementText,
      speaker_display_name: speakerDisplayName,
      speaker_we_vote_id: speakerWeVoteId,
      speaker_image_url_https_medium: speakerImageMedium,
      twitter_followers_count: twitterFollowersCount,
    } = position;
    let howLongAgoOrThisYear = '';
    const currentYear = new Date().getFullYear();
    // console.log('currentYear', currentYear, ', positionYear', positionYear);
    // console.log('todayAsInteger', todayAsInteger, ', positionUltimateElectionDateAsInteger', positionUltimateElectionDateAsInteger);
    if (positionYear === currentYear) {
      howLongAgoOrThisYear = 'this year';
    } else if (positionUltimateElectionDateAsInteger && (todayAsInteger <= positionUltimateElectionDateAsInteger)) {
      howLongAgoOrThisYear = 'this year';
    } else if (positionUltimateElectionDateAsInteger && (todayAsInteger > positionUltimateElectionDateAsInteger)) {
      const positionUltimateElectionDate = getDateFromUltimateElectionDate(positionUltimateElectionDateAsInteger);
      howLongAgoOrThisYear = timeFromDate(positionUltimateElectionDate);
    }
    // console.log('position:', position, ', positionWeVoteId:', positionWeVoteId);
    return (
      <PoliticianEndorsementForListWrapper>
        <OneCampaignOuterWrapper>
          <OneCampaignInnerWrapper>
            <CommentWrapper className="comment" key={positionWeVoteId}>
              <CommentVoterPhotoWrapper>
                {speakerImageMedium ? (
                  <LazyImage
                    src={speakerImageMedium}
                    placeholder={avatarGeneric()}
                    className="profile-photo"
                    height={48}
                    width={48}
                    alt=""
                  />
                ) : (
                  <Avatar {...this.stringAvatar(speakerDisplayName)} />
                )}
              </CommentVoterPhotoWrapper>
              <CommentTextWrapper>
                <Comment>
                  {showFullSupporterEndorsement ? (
                    <div>
                      <CommentTextInnerWrapper>{statementText}</CommentTextInnerWrapper>
                      <ReadMoreSpan
                        className="u-cursor--pointer u-link-underline-on-hover"
                        onClick={this.onHideFullSupporterEndorsement}
                      >
                        Read less
                      </ReadMoreSpan>
                    </div>
                  ) : (
                    <TruncateMarkup
                      ellipsis={(
                        <div>
                          <ReadMoreSpan
                            className="u-cursor--pointer u-link-underline-on-hover"
                            onClick={this.onShowFullSupporterEndorsement}
                          >
                            Read more
                          </ReadMoreSpan>
                        </div>
                      )}
                      lines={4}
                      tokenize="words"
                    >
                      <div>
                        {statementText}
                      </div>
                    </TruncateMarkup>
                  )}
                </Comment>
                <CommentNameOuterWrapper>
                  <CommentNameWithTimeWrapper>
                    {!stringContains('Voter-', speakerDisplayName) && (
                      <CommentName>
                        {speakerDisplayName}
                        {' '}
                      </CommentName>
                    )}
                    {isSupportOrPositiveRating ? (
                      <>supported</>
                    ) : (
                      <>
                        {isOpposeOrNegativeRating ? (
                          <>opposed</>
                        ) : (
                          <>commented</>
                        )}
                      </>
                    )}
                    {' '}
                    {howLongAgoOrThisYear}
                    &nbsp;&nbsp;&nbsp;
                  </CommentNameWithTimeWrapper>
                  {!!(twitterFollowersCount) && (
                    <CommentNameTwitterFollowers>
                      { abbreviateNumber(twitterFollowersCount) }
                      {' '}
                      Twitter Followers
                    </CommentNameTwitterFollowers>
                  )}
                  {speakerWeVoteId === voterWeVoteId && (
                    <>
                      &nbsp;&nbsp;&nbsp;
                      <Link to={pathToUseToEditSupporterEndorsement}>
                        Edit
                      </Link>
                    </>
                  )}
                </CommentNameOuterWrapper>
              </CommentTextWrapper>
            </CommentWrapper>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </PoliticianEndorsementForListWrapper>
    );
  }
}
PoliticianEndorsementForList.propTypes = {
  position: PropTypes.object,
  politicianWeVoteId: PropTypes.string,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  accountCircleRoot: {
    color: '#999',
    height: 48,
    marginRight: 8,
    width: 48,
  },
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const PoliticianEndorsementForListWrapper = styled('div')`
`;

export default withStyles(styles)(PoliticianEndorsementForList);
