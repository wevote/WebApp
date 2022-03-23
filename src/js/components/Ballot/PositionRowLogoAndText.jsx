import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import OrganizationActions from '../../actions/OrganizationActions';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
import { isOrganizationInVotersNetwork } from '../../utils/positionFunctions';
import SvgImage from '../../common/components/Widgets/SvgImage';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));


class PositionRowLogoAndText extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationInVotersNetwork: false,
    };
  }

  componentDidMount () {
    const { position } = this.props;
    const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;
    // console.log('PositionRowLogoAndText componentDidMount, position:', position);
    this.onOrganizationInVotersNetworkChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    // We want to make sure we have all the position information so that comments show up
    if (ballotItemWeVoteId) {
      const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);

      if (voterGuidesForThisBallotItem) {
        voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
          // console.log('oneVoterGuide: ', oneVoterGuide);
          if (organizationWeVoteId === oneVoterGuide.organization_we_vote_id) {  // Request position list for the organization of this position
            if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
              OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
            }
          }
        });
      }
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onFriendStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onIssueStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onOrganizationStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onOrganizationInVotersNetworkChange () {
    const { position } = this.props;
    if (position) {
      const organizationWeVoteId = position.organization_we_vote_id || position.speaker_we_vote_id;
      const organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
      const updatedPosition = OrganizationStore.getPositionByPositionWeVoteId(position.position_we_vote_id);

      this.setState({
        organizationInVotersNetwork,
        updatedPosition,
      });
    }
  }

  onVoterGuideStoreChange () {
    const { position } = this.props;
    const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;

    // We want to make sure we have all the position information so that comments show up
    if (ballotItemWeVoteId) {
      const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);

      if (voterGuidesForThisBallotItem) {
        voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
          // console.log('oneVoterGuide: ', oneVoterGuide);
          if (organizationWeVoteId === oneVoterGuide.organization_we_vote_id) {  // Request position list for the organization of this position
            if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
              OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
            }
          }
        });
      }
    }
  }

  onClickShowPositionDrawer (candidateWeVoteId) {
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    // AppObservableStore.setPositionDrawerOrganizationWeVoteId(organizationWeVoteId);
    // AppObservableStore.setPositionDrawerPositionWeVoteId(positionWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    // AppObservableStore.setShowPositionDrawer(true);
  }

  render () {
    renderLog('PositionRowLogoAndText');  // Set LOG_RENDER_EVENTS to log all renders
    let position;
    ({ position } = this.props);
    const { updatedPosition } = this.state;
    if (updatedPosition && updatedPosition.speaker_we_vote_id) {
      position = updatedPosition;
    }
    if (!position || !position.speaker_we_vote_id) {
      return null;
    }
    // console.log('PositionRowLogoAndText position render, position:', position);
    const { ballot_item_we_vote_id: ballotItemWeVoteId } = position;
    const { organizationInVotersNetwork } = this.state;

    // console.log(position);
    let supportOpposeInfo = 'InfoButNotPartOfScore';
    if (position.is_information_only) {
      supportOpposeInfo = 'InfoButNotPartOfScore';
    } else if (organizationInVotersNetwork && position.is_support) {
      supportOpposeInfo = 'SupportAndPartOfScore';
    } else if (!organizationInVotersNetwork && position.is_support) {
      supportOpposeInfo = 'SupportButNotPartOfScore';
    } else if (organizationInVotersNetwork && position.is_oppose) {
      supportOpposeInfo = 'OpposeAndPartOfScore';
    } else if (!position.is_support) {
      supportOpposeInfo = 'OpposeButNotPartOfScore';
    }

    // console.log('PositionRowLogoAndText supportOpposeInfo: ', supportOpposeInfo);

    let imagePlaceholder;
    if (isSpeakerTypeOrganization(position.speaker_type)) {
      const organizationIcon = normalizedImagePath('../../img/global/svg-icons/organization-icon.svg');
      imagePlaceholder = (
        <SvgImage imageName={organizationIcon} />
      );
    } else {
      const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
      imagePlaceholder = (
        <SvgImage imageName={avatar} />
      );
    }

    const showPosition = true;
    const nothingToDisplay = null;

    if (showPosition) {
      return (
        <Wrapper>
          <OrganizationScoreSpacer />
          <OrganizationPhotoOuterWrapper
            onClick={() => this.onClickShowPositionDrawer(ballotItemWeVoteId)}
          >
            <OrganizationPhotoInnerWrapper>
              { position.speaker_image_url_https_medium ? (
                <Suspense fallback={<></>}>
                  <ImageHandler
                    className="card-child__avatar"
                    sizeClassName="icon-lg"
                    imageUrl={position.speaker_image_url_https_medium}
                  />
                </Suspense>
              ) :
                imagePlaceholder }
            </OrganizationPhotoInnerWrapper>
          </OrganizationPhotoOuterWrapper>
          <HorizontalSpacer />
          <YesNoScoreTextWrapper>
            {supportOpposeInfo === 'SupportAndPartOfScore' ? (
              <OrganizationSupportWrapper>
                <SupportAndPartOfScore>
                  <OrganizationSupportWordWrapper>
                    Yes
                  </OrganizationSupportWordWrapper>
                  <ScoreWrapper>
                    <ScoreNumberWrapper>
                      +1
                    </ScoreNumberWrapper>
                    <ToScoreLabel className="u-no-break">
                      to score
                    </ToScoreLabel>
                  </ScoreWrapper>
                </SupportAndPartOfScore>
              </OrganizationSupportWrapper>
            ) : (
              <>
                {supportOpposeInfo === 'OpposeAndPartOfScore' ? (
                  <OrganizationOpposeWrapper>
                    <OpposeAndPartOfScore>
                      <OrganizationOpposeWordWrapper>
                        No
                      </OrganizationOpposeWordWrapper>
                      <ScoreWrapper>
                        <ScoreNumberWrapper>
                          -1
                        </ScoreNumberWrapper>
                        <FromScoreLabel>
                          from score
                        </FromScoreLabel>
                      </ScoreWrapper>
                    </OpposeAndPartOfScore>
                  </OrganizationOpposeWrapper>
                ) : (
                  <>
                    {supportOpposeInfo === 'SupportButNotPartOfScore' ? (
                      <OrganizationSupportWrapper>
                        <OrganizationSupportSquare>
                          <OrganizationSupportWordWrapper>
                            Yes
                          </OrganizationSupportWordWrapper>
                          <AddScoreWrapper className="u-link-color-on-hover">
                            <ToScoreLabel1>
                              add
                            </ToScoreLabel1>
                            <ToScoreLabel2 className="u-no-break">
                              to score
                            </ToScoreLabel2>
                          </AddScoreWrapper>
                        </OrganizationSupportSquare>
                      </OrganizationSupportWrapper>
                    ) : (
                      <>
                        {supportOpposeInfo === 'OpposeButNotPartOfScore' ? (
                          <OrganizationOpposeWrapper>
                            <OrganizationOpposeSquare>
                              <OrganizationOpposeWordWrapper>
                                No
                              </OrganizationOpposeWordWrapper>
                              <AddScoreWrapper className="u-link-color-on-hover">
                                <ToScoreLabel1>
                                  add
                                </ToScoreLabel1>
                                <ToScoreLabel2 className="u-no-break">
                                  to score
                                </ToScoreLabel2>
                              </AddScoreWrapper>
                            </OrganizationOpposeSquare>
                          </OrganizationOpposeWrapper>
                        ) : (
                          <>
                            {supportOpposeInfo === 'InfoButNotPartOfScore' && (
                              <OrganizationInformationOnlyWrapper>
                                <OrganizationInformationOnlySquare>
                                  <OrganizationInfoOnlyWordWrapper>
                                    Info
                                  </OrganizationInfoOnlyWordWrapper>
                                </OrganizationInformationOnlySquare>
                              </OrganizationInformationOnlyWrapper>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </YesNoScoreTextWrapper>
        </Wrapper>
      );
    } else {
      return nothingToDisplay;
    }
  }
}
PositionRowLogoAndText.propTypes = {
  position: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
});

const AddScoreWrapper = styled('div')`
  align-items: center;
  border-top: 1px dotted #dcdcdc;
  color: #ccc;
  display: flex;
  flex-flow: column;
  font-weight: normal;
  justify-content: flex-start;
  padding-top: 4px;
`;

const FromScoreLabel = styled('div')`
  font-size: 10px;
  line-height: 11px;
  margin-top: -4px;
  text-align: center;
`;

const HorizontalSpacer = styled('div')`
  border-bottom: 1px dotted #dcdcdc;
`;

const OpposeAndPartOfScore = styled('div')(({ theme }) => (`
  align-items: center;
  color: ${theme.colors.opposeRedRgb};
  cursor: pointer;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: flex-start;
  width: 40px;
`));

const OrganizationInfoOnlyWordWrapper = styled('div')`
`;

const OrganizationInformationOnlySquare = styled('div')(({ theme }) => (`
  align-items: flex-start;
  background: white;
  color: ${theme.colors.grayMid};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
`));

const OrganizationInformationOnlyWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationOpposeWordWrapper = styled('div')`
  margin-bottom: 1px;
`;

const OrganizationOpposeSquare = styled('div')(({ theme }) => (`
  align-items: center;
  background: white;
  color: ${theme.colors.opposeRedRgb};
  cursor: pointer;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: flex-start;
  width: 40px;
`));

const OrganizationOpposeWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationPhotoInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  height: 42px;
  width: 42px;
  justify-content: center;
  & img, & svg, & path {
    border: 1px solid #ccc;
    border-radius: 29px;
    width: 42px !important;
    height: 42px !important;
    max-width: 42px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const OrganizationPhotoOuterWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  cursor: pointer;
  padding: 4px 3px 6px 4px;
`;

const OrganizationScoreSpacer = styled('div')`
  height: 0px;
`;

const OrganizationSupportWordWrapper = styled('div')`
  margin-bottom: 1px;
`;

const OrganizationSupportSquare = styled('div')(({ theme }) => (`
  align-items: center;
  background: white;
  color: ${theme.colors.supportGreenRgb};
  cursor: pointer;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: flex-start;
  width: 40px;
`));

const OrganizationSupportWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const ScoreNumberWrapper = styled('div')`
`;

const ScoreWrapper = styled('div')`
  align-items: center;
  border-top: 1px dotted #dcdcdc;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  padding-top: 4px;
`;

const SupportAndPartOfScore = styled('div')(({ theme }) => (`
  align-items: center;
  background: white;
  color: ${theme.colors.supportGreenRgb};
  cursor: pointer;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: flex-start;
  width: 40px;
`));

const ToScoreLabel = styled('div')`
  font-size: 10px;
  margin-top: -6px;
`;

const ToScoreLabel1 = styled('div')`
  font-size: 14px;
  margin-top: 0;
`;

const ToScoreLabel2 = styled('div')`
  font-size: 10px;
  margin-top: -3px;
`;

const Wrapper = styled('div')`
`;

const YesNoScoreTextWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  padding: 3px 3px 4px 4px;
`;

export default withTheme(withStyles(styles)(PositionRowLogoAndText));
