import { AccountCircle } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import anonymous from '../../../../img/global/icons/avatar-generic.png';
import LazyImage from '../LazyImage';
import { timeFromDate } from '../../utils/dateFormat';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import VoterStore from '../../../stores/VoterStore';

class CampaignCommentForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXSupporter: {},
      showFullSupporterEndorsement: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignCommentForList componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    const { campaignXSupporterId } = this.props;
    const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterById(campaignXSupporterId);
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      campaignXSupporter,
      voterWeVoteId,
    });
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
    } = campaignX;
    let pathToUseToEditSupporterEndorsement;
    if (campaignSEOFriendlyPath) {
      pathToUseToEditSupporterEndorsement = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else if (campaignXWeVoteId) {
      pathToUseToEditSupporterEndorsement = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      pathToUseToEditSupporterEndorsement,
    });
  }

  onCampaignSupporterStoreChange () {
    const { campaignXSupporterId } = this.props;
    const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterById(campaignXSupporterId);
    // console.log('onCampaignSupporterStoreChange campaignXSupporter:', campaignXSupporter);
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      campaignXSupporter,
      voterWeVoteId,
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

  render () {
    renderLog('CampaignCommentForList');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignCommentForList window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const { campaignXSupporter, pathToUseToEditSupporterEndorsement, showFullSupporterEndorsement, voterWeVoteId } = this.state;
    if (!campaignXSupporter || !('id' in campaignXSupporter)) {
      return null;
    }
    const {
      date_supported: dateSupported,
      id,
      supporter_endorsement: supporterEndorsement,
      supporter_name: supporterName,
      voter_we_vote_id: supporterVoterWeVoteId,
      we_vote_hosted_profile_image_url_tiny: voterPhotoUrlTiny,
    } = campaignXSupporter;
    // console.log('supporterVoterWeVoteId:', supporterVoterWeVoteId);
    return (
      <Wrapper>
        <OneCampaignOuterWrapper>
          <OneCampaignInnerWrapper>
            <CommentWrapper className="comment" key={id}>
              <CommentVoterPhotoWrapper>
                {voterPhotoUrlTiny ? (
                  <LazyImage
                    src={voterPhotoUrlTiny}
                    placeholder={anonymous}
                    className="profile-photo"
                    height={48}
                    width={48}
                    alt="Your Settings"
                  />
                ) : (
                  <AccountCircle classes={{ root: classes.accountCircleRoot }} />
                )}
              </CommentVoterPhotoWrapper>
              <CommentTextWrapper>
                <Comment>
                  {showFullSupporterEndorsement ? (
                    <div>
                      <CommentTextInnerWrapper>{supporterEndorsement}</CommentTextInnerWrapper>
                      <div
                        className="u-cursor--pointer u-link-underline u-link-color--gray"
                        onClick={this.onHideFullSupporterEndorsement}
                      >
                        Read less
                      </div>
                    </div>
                  ) : (
                    <TruncateMarkup
                      ellipsis={(
                        <div>
                          <span
                            className="u-cursor--pointer u-link-underline u-link-color--gray"
                            onClick={this.onShowFullSupporterEndorsement}
                          >
                            Read more
                          </span>
                        </div>
                      )}
                      lines={4}
                      tokenize="words"
                    >
                      <div>
                        {supporterEndorsement}
                      </div>
                    </TruncateMarkup>
                  )}
                </Comment>
                <CommentNameWrapper>
                  {!stringContains('Voter-', supporterName) && (
                    <CommentName>
                      {supporterName}
                      {' '}
                    </CommentName>
                  )}
                  supported
                  {' '}
                  {timeFromDate(dateSupported)}
                  {supporterVoterWeVoteId === voterWeVoteId && (
                    <>
                      &nbsp;&nbsp;&nbsp;
                      <Link to={pathToUseToEditSupporterEndorsement}>
                        Edit
                      </Link>
                    </>
                  )}
                </CommentNameWrapper>
              </CommentTextWrapper>
            </CommentWrapper>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </Wrapper>
    );
  }
}
CampaignCommentForList.propTypes = {
  campaignXSupporterId: PropTypes.number,
  campaignXWeVoteId: PropTypes.string,
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

const Comment = styled('div')`
  font-size: 18px;
  margin: 0;
`;

const CommentName = styled('span')`
  color: #808080;
  font-weight: 500 !important;
`;

const CommentNameWrapper = styled('div')`
  color: #999;
  font-size: 12px;
`;

const CommentTextInnerWrapper = styled('div')`
  white-space: pre-wrap;
`;

const CommentTextWrapper = styled('div')`
  margin-top: 5px;
`;

const CommentVoterPhotoWrapper = styled('div')`
  margin-right: 6px;
`;

const CommentWrapper = styled('div')`
  border-radius: 10px;
  border-top-left-radius: 0;
  display: flex;
  justify-content: flex-start;
  margin: 8px 0;
  width: 100%;
`;

const OneCampaignInnerWrapper = styled('div')(({ theme }) => (`
  margin: 15px 0;
  ${theme.breakpoints.up('sm')} {
    display: flex;
    justify-content: space-between;
    margin: 15px;
  }
`));

const OneCampaignOuterWrapper = styled('div')(({ theme }) => (`
  border-top: 1px solid #ddd;
  margin-top: 15px;
  ${theme.breakpoints.up('sm')} {
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`));

const Wrapper = styled('div')`
`;

export default withStyles(styles)(CampaignCommentForList);
