import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import BallotItemVoterGuideSupportOpposeDisplay from '../Widgets/BallotItemVoterGuideSupportOpposeDisplay';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import BallotStore from '../../stores/BallotStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateStore from '../../stores/CandidateStore';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import OfficeNameText from '../Widgets/OfficeNameText';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import { capitalizeString, stringContains } from '../../utils/textFormat';
import ReadMore from '../Widgets/ReadMore';
import AppActions from '../../actions/AppActions';

class VoterGuidePositionItem extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string,
    position: PropTypes.object.isRequired,
    searchResultsNode: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      hidePositionStatement: false,
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
    };
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
    this.onClickFunction = this.onClickFunction.bind(this);
  }

  componentDidMount () {
    const { position } = this.props;
    const { ballot_item_we_vote_id: ballotItemWeVoteId } = position;
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    if (ballotItemWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      if (isCandidate) {
        CandidateActions.positionListForBallotItemPublic(ballotItemWeVoteId);
      } else if (isMeasure) {
        MeasureActions.positionListForBallotItemPublic(ballotItemWeVoteId);
      }
      if (isCandidate || isMeasure) {
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
    }
    if (ballotItemWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId)
    ) {
      if (isCandidate) {
        CandidateActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
      } else if (isMeasure) {
        MeasureActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
      }
      if (isCandidate || isMeasure) {
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    }

    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    // console.log('VoterGuidePositionItem, onCandidateStoreChange');
    if (isCandidate) {
      if (ballotItemWeVoteId &&
        !this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        // console.log('VoterGuidePositionItem, onCandidateStoreChange, calling positionListForBallotItemPublic');
        CandidateActions.positionListForBallotItemPublic(ballotItemWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (ballotItemWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        // console.log('VoterGuidePositionItem, onCandidateStoreChange, calling positionListForBallotItemPublic');
        CandidateActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    }
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    // console.log('VoterGuidePositionItem, onMeasureStoreChange');
    if (isMeasure) {
      if (ballotItemWeVoteId &&
        !this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        // console.log('VoterGuidePositionItem, onMeasureStoreChange, calling positionListForBallotItemPublic');
        MeasureActions.positionListForBallotItemPublic(ballotItemWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (ballotItemWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        // console.log('VoterGuidePositionItem, onMeasureStoreChange, calling positionListForBallotItemPublic');
        MeasureActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    }
  }

  onClickFunction () {
    AppActions.setShowOrganizationModal(true);
    AppActions.setOrganizationModalId(Object.keys(this.state.positionListFromFriendsHasBeenRetrievedOnce)[0]);
  }

  togglePositionStatement () {
    const { hidePositionStatement } = this.state;
    this.setState({ hidePositionStatement: !hidePositionStatement });
  }

  localPositionListHasBeenRetrievedOnce (ballotItemWeVoteId) {
    if (ballotItemWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[ballotItemWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (ballotItemWeVoteId) {
    if (ballotItemWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('VoterGuidePositionItem');  // Set LOG_RENDER_EVENTS to log all renders
    const { position, searchResultsNode } = this.props;
    // const { thisYearInteger } = this.state;
    // console.log('VoterGuidePositionItem render');
    let {
      ballot_item_display_name: ballotItemDisplayName,
      more_info_url: moreInfoUrl,
    } = position;
    const {
      ballot_item_image_url_https_large: ballotItemImageUrlHttpsLarge,
      ballot_item_we_vote_id: ballotItemWeVoteId,
      is_information_only: organizationInformationOnlyBallotItem,
      is_oppose: organizationOpposesBallotItem,
      is_support: organizationSupportsBallotItem,
      kind_of_ballot_item: kindOfBallotItem,
      position_year: positionYear,
      speaker_image_url_https_tiny: organizationImageUrlHttpsTiny,
      statement_text: statementText,
    } = position;
    const isCandidate = String(kindOfBallotItem) === 'CANDIDATE';
    // console.log('kindOfBallotItem:', kindOfBallotItem, 'isCandidate:', isCandidate);
    if (!ballotItemWeVoteId) {
      // console.log('VoterGuidePositionItem cannot render yet -- missing ballotItemWeVoteId');
      return null;
    }

    if (ballotItemDisplayName) {
      ballotItemDisplayName = capitalizeString(ballotItemDisplayName);
    } else {
      ballotItemDisplayName = '';
    }

    // const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);
    let contestOfficeName;
    // let politicalParty;
    let ballotDisplay = [];
    if (isCandidate) {
      contestOfficeName = position.contest_office_name;
      // politicalParty = position.ballot_item_political_party;
    } else {
      ballotDisplay = ballotItemDisplayName.split(':');
    }
    if (moreInfoUrl) {
      if (!moreInfoUrl.toLowerCase().startsWith('http')) {
        moreInfoUrl = `http://${moreInfoUrl}`;
      }
    }
    return (
      <div>
        <Card>
          <BallotItemPadding>
            <SearchResultsNodeWrapper>
              {searchResultsNode}
            </SearchResultsNodeWrapper>
            <BallotItemWrapper className="card-main__media-object">
              {isCandidate ? (
                <CandidateItemWrapper onClick={this.onClickFunction}>
                  <BallotItemImageWrapper>
                    <ImageHandler
                      className="card-main__avatar"
                      sizeClassName="icon-lg "
                      imageUrl={ballotItemImageUrlHttpsLarge}
                      alt="candidate-photo"
                      kind_of_ballot_item={kindOfBallotItem}
                    />
                  </BallotItemImageWrapper>
                  <Candidate>
                    <h2 className="card-main__display-name">
                      {ballotItemDisplayName}
                    </h2>
                    <div className="u-show-desktop-tablet">
                      {(contestOfficeName) && (
                        <OfficeNameText
                          contestOfficeName={contestOfficeName}
                          // politicalParty={politicalParty}
                          showOfficeName
                        />
                      )}
                      {(positionYear) && (
                        <PositionYearText>
                          {' '}
                          (
                          {positionYear}
                          )
                        </PositionYearText>
                      )}
                    </div>
                  </Candidate>
                </CandidateItemWrapper>
              ) : (
                <MeasureItemWrapper>
                  <Title>
                    {ballotDisplay[0]}
                  </Title>
                  <SubTitle>
                    {ballotDisplay[1]}
                    {(positionYear) && (
                      <PositionYearText>
                        {' '}
                        (
                        {positionYear}
                        )
                      </PositionYearText>
                    )}
                  </SubTitle>
                </MeasureItemWrapper>
              )}
              {/* (signedInWithThisTwitterAccount ||
              signedInWithThisOrganization ||
              signedInWithThisFacebookAccount) &&
              <FriendsOnlyIndicator isFriendsOnly={!voterPositionIsPublic} />
              */}
              <BallotItemSupportOpposeCountDisplayWrapper>
                <BallotItemSupportOpposeCountDisplay
                  ballotItemDisplayName={this.props.ballotItemDisplayName}
                  ballotItemWeVoteId={ballotItemWeVoteId}
                  hideNumbersOfAllPositions
                />
                <VerticalSeparator />
                <BallotItemVoterGuideSupportOpposeDisplay
                  organizationInformationOnlyBallotItem={organizationInformationOnlyBallotItem}
                  organizationOpposesBallotItem={organizationOpposesBallotItem}
                  organizationSupportsBallotItem={organizationSupportsBallotItem}
                  organizationImageUrlHttpsTiny={organizationImageUrlHttpsTiny}
                  positionItem={position}
                />
              </BallotItemSupportOpposeCountDisplayWrapper>
              {' '}
            </BallotItemWrapper>
            <span className="u-show-mobile">
              {contestOfficeName && (
                <div>
                  <OfficeNameText
                    contestOfficeName={contestOfficeName}
                    // politicalParty={politicalParty}
                    showOfficeName
                  />
                </div>
              )}
              {(positionYear) && (
                <PositionYearText>
                  {' '}
                  (
                  {positionYear}
                  )
                </PositionYearText>
              )}
              {statementText && (
                <MobileItemDescription>
                  {organizationImageUrlHttpsTiny && (
                    <OrganizationImageWrapper>
                      <ImageHandler
                        sizeClassName="image-24x24 "
                        imageUrl={organizationImageUrlHttpsTiny}
                        alt="organization-photo"
                        kind_of_ballot_item="ORGANIZATION"
                      />
                    </OrganizationImageWrapper>
                  )}
                  <ReadMore
                    textToDisplay={statementText}
                    numberOfLines={4}
                  />
                  <MobileItemFooter>
                    {moreInfoUrl ? (
                      <SourceLink>
                        <OpenExternalWebSite
                          body={(
                            <span>
                              source
                              {' '}
                              <i className="fas fa-external-link-alt" aria-hidden="true" />
                            </span>
                          )}
                          className="u-gray-mid"
                          target="_blank"
                          url={moreInfoUrl}
                        />
                      </SourceLink>
                    ) : null
                    }
                  </MobileItemFooter>
                </MobileItemDescription>
              )}
            </span>
            <span className="u-show-desktop-tablet">
              {statementText && (
                <DesktopItemDescription>
                  {organizationImageUrlHttpsTiny && (
                    <OrganizationImageWrapper>
                      <ImageHandler
                        sizeClassName="image-24x24 "
                        imageUrl={organizationImageUrlHttpsTiny}
                        alt="organization-photo"
                        kind_of_ballot_item="ORGANIZATION"
                      />
                    </OrganizationImageWrapper>
                  )}
                  <ReadMore
                    textToDisplay={statementText}
                    numberOfLines={3}
                  />
                  <DesktopItemFooter>
                    {moreInfoUrl ? (
                      <SourceLink>
                        <OpenExternalWebSite
                          body={(
                            <span>
                              view source
                              {' '}
                              <i className="fas fa-external-link-alt" aria-hidden="true" />
                            </span>
                          )}
                          className="u-gray-mid"
                          target="_blank"
                          url={moreInfoUrl}
                        />
                      </SourceLink>
                    ) : null
                    }
                  </DesktopItemFooter>
                </DesktopItemDescription>
              )}
            </span>
          </BallotItemPadding>
        </Card>
      </div>
    );
  }
}

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const CandidateItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
`;

const BallotItemImageWrapper = styled.span`
  padding-right: 10px;
`;

const BallotItemPadding = styled.div`
  padding: 15px;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const BallotItemSupportOpposeCountDisplayWrapper = styled.div`
  cursor: pointer;
  display: flex;
  float: right;
`;

const BallotItemWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-bottom: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-bottom: 2px;
  }
`;

const Candidate = styled.div`
`;

const DesktopItemDescription = styled.div`
  font-size: 16px;
  border-radius: 5px;
  list-style: none;
  padding: 6px;
  background: #eee;
  flex: 1 1 0;
`;

const DesktopItemFooter = styled.div`
  font-size: 12px;
  margin-top: 8px;
  padding-bottom: 12px;
`;

const MeasureItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: row wrap;
`;

const MobileItemDescription = styled.div`
  font-size: 16px;
  border-radius: 2px;
  list-style: none;
  padding: 4px;
  background: #eee;
  flex: 1 1 0;
`;

const MobileItemFooter = styled.div`
  font-size: 12px;
  margin-top: 8px;
  padding-bottom: 12px;
`;

const OrganizationImageWrapper = styled.span`
  padding-right: 4px;
`;

const PositionYearText = styled.div`
  font-weight: 200;
  color: #999;
`;

const SourceLink = styled.div`
  float: right;
  margin-bottom: -4px;
`;

const SearchResultsNodeWrapper = styled.div`
  margin-bottom: 2px !important;
`;

const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 300;
  color: #555;
  margin-top: .6rem;
  width: 135%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: .1rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }
`;

const VerticalSeparator = styled.div`
  height: 44px;
  width: 2px;
  background: #ccc;
  margin: 0 4px;
`;

export default withStyles(styles)(VoterGuidePositionItem);
