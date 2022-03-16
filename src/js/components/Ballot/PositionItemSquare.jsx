import { withStyles, withTheme } from '@material-ui/core/styles';
import { Info, ThumbDown, ThumbUp } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { renderLog } from '../../common/utils/logging';
import { isOrganizationInVotersNetwork } from '../../utils/positionFunctions';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));


class PositionItemSquare extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationInVotersNetwork: false,
    };
  }

  componentDidMount () {
    const { position } = this.props;
    const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;
    // console.log('PositionItemSquare componentDidMount, position:', position);
    this.onOrganizationInVotersNetworkChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    // We want to make sure we have all of the position information so that comments show up
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

    // We want to make sure we have all of the position information so that comments show up
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

  render () {
    renderLog('PositionItemSquare');  // Set LOG_RENDER_EVENTS to log all renders
    let position;
    ({ position } = this.props);
    const { updatedPosition } = this.state;
    if (updatedPosition && updatedPosition.speaker_we_vote_id) {
      position = updatedPosition;
    }
    if (!position || !position.speaker_we_vote_id) {
      return null;
    }
    // console.log('PositionItemSquare position render, position:', position);
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

    // console.log('PositionItemSquare supportOpposeInfo: ', supportOpposeInfo);

    const showPosition = true;
    const nothingToDisplay = null;

    if (showPosition) {
      return (
        <div>
          {supportOpposeInfo === 'SupportAndPartOfScore' ? (
            <OrganizationSupportWrapper>
              <SupportAndPartOfScore>
                <ScoreNumberWrapper advisorImageExists={position.speaker_image_url_https_medium}>
                  +1
                </ScoreNumberWrapper>
                <ToScoreLabel advisorImageExists={position.speaker_image_url_https_medium} className="u-no-break">
                  to score
                </ToScoreLabel>
              </SupportAndPartOfScore>
              {position.speaker_image_url_https_medium && (
                <OverlayImage>
                  <Suspense fallback={<></>}>
                    <ImageHandler
                      alt="organization-photo-16x16"
                      className="image-border-support "
                      imageUrl={position.speaker_image_url_https_medium}
                      kind_of_ballot_item="ORGANIZATION"
                      sizeClassName="image-16x16 "
                    />
                  </Suspense>
                </OverlayImage>
              )}
            </OrganizationSupportWrapper>
          ) : (
            <>
              {supportOpposeInfo === 'OpposeAndPartOfScore' ? (
                <OrganizationOpposeWrapper>
                  <OpposeAndPartOfScore>
                    <ScoreNumberWrapper advisorImageExists={position.speaker_image_url_https_medium}>
                      -1
                    </ScoreNumberWrapper>
                    {position.speaker_image_url_https_medium ? (
                      <FromScoreLabel>
                        from score
                      </FromScoreLabel>
                    ) : (
                      <FromScoreLabelNoImage>
                        from score
                      </FromScoreLabelNoImage>
                    )}
                  </OpposeAndPartOfScore>
                  {position.speaker_image_url_https_medium && (
                    <OverlayImage>
                      <Suspense fallback={<></>}>
                        <ImageHandler
                          alt="organization-photo-16x16"
                          className="image-border-oppose "
                          imageUrl={position.speaker_image_url_https_medium}
                          kind_of_ballot_item="ORGANIZATION"
                          sizeClassName="image-16x16 "
                        />
                      </Suspense>
                    </OverlayImage>
                  )}
                </OrganizationOpposeWrapper>
              ) : (
                <>
                  {supportOpposeInfo === 'SupportButNotPartOfScore' ? (
                    <OrganizationSupportWrapper>
                      <OrganizationSupportSquare>
                        <OrganizationSupportIconWrapper speakerImageExists={!!(position.speaker_image_url_https_medium)}>
                          <ThumbUp />
                        </OrganizationSupportIconWrapper>
                      </OrganizationSupportSquare>
                      {position.speaker_image_url_https_medium && (
                        <OverlayImage>
                          <Suspense fallback={<></>}>
                            <ImageHandler
                              alt="organization-photo-16x16"
                              className="image-border-support "
                              imageUrl={position.speaker_image_url_https_medium}
                              kind_of_ballot_item="ORGANIZATION"
                              sizeClassName="image-16x16 "
                            />
                          </Suspense>
                        </OverlayImage>
                      )}
                    </OrganizationSupportWrapper>
                  ) : (
                    <>
                      {supportOpposeInfo === 'OpposeButNotPartOfScore' ? (
                        <OrganizationOpposeWrapper>
                          <OrganizationOpposeSquare>
                            <OrganizationOpposeIconWrapper speakerImageExists={!!(position.speaker_image_url_https_medium)}>
                              <ThumbDown />
                            </OrganizationOpposeIconWrapper>
                          </OrganizationOpposeSquare>
                          {position.speaker_image_url_https_medium && (
                            <OverlayImage>
                              <Suspense fallback={<></>}>
                                <ImageHandler
                                  alt="organization-photo-16x16"
                                  className="image-border-oppose "
                                  imageUrl={position.speaker_image_url_https_medium}
                                  kind_of_ballot_item="ORGANIZATION"
                                  sizeClassName="image-16x16 "
                                />
                              </Suspense>
                            </OverlayImage>
                          )}
                        </OrganizationOpposeWrapper>
                      ) : (
                        <>
                          {supportOpposeInfo === 'InfoButNotPartOfScore' && (
                            <OrganizationInformationOnlyWrapper>
                              <OrganizationInformationOnlySquare>
                                <OrganizationInfoOnlyIconWrapper speakerImageExists={!!(position.speaker_image_url_https_medium)}>
                                  <Info />
                                </OrganizationInfoOnlyIconWrapper>
                              </OrganizationInformationOnlySquare>
                              {position.speaker_image_url_https_medium && (
                                <OverlayImage>
                                  <Suspense fallback={<></>}>
                                    <ImageHandler
                                      alt="organization-photo-16x16"
                                      className="image-border-gray-border "
                                      imageUrl={position.speaker_image_url_https_medium}
                                      kind_of_ballot_item="ORGANIZATION"
                                      sizeClassName="image-16x16 "
                                    />
                                  </Suspense>
                                </OverlayImage>
                              )}
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
        </div>
      );
    } else {
      return nothingToDisplay;
    }
  }
}
PositionItemSquare.propTypes = {
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
  buttonOutlinedPrimary: {
    background: 'white',
  },
  twitterLogo: {
    color: '#1d9bf0',
    height: 18,
    marginRight: '-2px',
    marginTop: '-4px',
  },
});

const FromScoreLabel = styled('div')`
  font-size: 10px;
  line-height: .7;
  margin-top: -13px;
  margin-left: 15px;
`;

const FromScoreLabelNoImage = styled('div')`
  font-size: 10px;
  line-height: .7;
  margin-top: -13px;
  margin-left: 9px;
`;

const OpposeAndPartOfScore = styled('div')`
  align-items: center;
  background: ${({ theme }) => theme.colors.opposeRedRgb};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
  height: 40px;
  @media print{
    border: 2px solid grey;
  }
`;

const OrganizationInfoOnlyIconWrapper = styled('div')`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '4px' : '0')};
  margin-top: ${({ speakerImageExists }) => (speakerImageExists ? '-5px' : '0')};
`;

const OrganizationInformationOnlySquare = styled('div')`
  color: ${({ theme }) => theme.colors.grayMid};
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 3px solid ${({ theme }) => theme.colors.grayMid};
  font-size: 20px;
  font-weight: bold;
`;

const OrganizationInformationOnlyWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationOpposeIconWrapper = styled('div')`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '2px' : '0')};
  margin-top: ${({ speakerImageExists }) => (speakerImageExists ? '-2px' : '0')};
`;

const OrganizationOpposeSquare = styled('div')`
  background: white;
  border: 3px solid ${({ theme }) => theme.colors.opposeRedRgb};
  color: ${({ theme }) => theme.colors.opposeRedRgb};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
`;

const OrganizationOpposeWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationSupportIconWrapper = styled('div')`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '2px' : '0')};
`;

const OrganizationSupportSquare = styled('div')`
  align-items: center;
  background: white;
  border: 3px solid ${({ theme }) => theme.colors.supportGreenRgb};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.supportGreenRgb};
  cursor: pointer;
  display: flex;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
`;

const OrganizationSupportWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OverlayImage = styled('div')`
  margin-left: -2px;
  margin-top: -17px;
  z-index: 2;
`;

const ScoreNumberWrapper = styled('div')`
  ${({ advisorImageExists }) => (advisorImageExists ? 'margin-top: -5px;' : 'margin-top: 0px;')}
`;

const SupportAndPartOfScore = styled('div')`
  align-items: center;
  background: ${({ theme }) => theme.colors.supportGreenRgb};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
  height: 40px;
  @media print{
    border: 2px solid grey;
  }
`;

const ToScoreLabel = styled('div')`
  font-size: 10px;
  ${({ advisorImageExists }) => (advisorImageExists ? 'margin-top: -23px;' : 'margin-top: -20px;')}
`;

export default withTheme(withStyles(styles)(PositionItemSquare));
