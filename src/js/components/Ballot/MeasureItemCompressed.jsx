import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import extractNumber from '../../utils/extractNumber';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString, shortenText } from '../../utils/textFormat';
import VoterGuideStore from '../../stores/VoterGuideStore';


class MeasureItemCompressed extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    // currentBallotIdInUrl: PropTypes.string,
    organization: PropTypes.object,
    showPositionStatementActionBar: PropTypes.bool,
    // urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    classes: PropTypes.object,
    theme: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      // ballotItemWeVoteId: '',
      componentDidMountFinished: false,
      organization: {},
      showPositionStatement: false,
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.setState({
      // ballotItemWeVoteId: this.props.we_vote_id,
      componentDidMountFinished: true,
      measure: MeasureStore.getMeasure(this.props.we_vote_id),
      supportProps: SupportStore.get(this.props.we_vote_id),
    });
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
        organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
      });
    }
    this.setState({
      measure: MeasureStore.getMeasure(this.props.we_vote_id),
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      // console.log("shouldComponentUpdate: this.state.ballotItemDisplayName", this.state.ballotItemDisplayName, ", nextState.ballotItemDisplayName", nextState.ballotItemDisplayName);
      return true;
    }
    if (this.state.measure !== nextState.measure) {
      // console.log("shouldComponentUpdate: this.state.measure", this.state.measure, ", nextState.measure", nextState.measure);
      return true;
    }
    if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) {
      // console.log("shouldComponentUpdate: this.props.showPositionStatementActionBar change");
      return true;
    }
    if (this.state.showPositionStatement !== nextState.showPositionStatement) {
      // console.log("shouldComponentUpdate: this.state.showPositionStatement change");
      return true;
    }
    if (this.state.supportProps !== undefined && nextState.supportProps !== undefined) {
      const currentNetworkSupportCount = parseInt(this.state.supportProps.support_count) || 0;
      const nextNetworkSupportCount = parseInt(nextState.supportProps.support_count) || 0;
      const currentNetworkOpposeCount = parseInt(this.state.supportProps.oppose_count) || 0;
      const nextNetworkOpposeCount = parseInt(nextState.supportProps.oppose_count) || 0;
      if (currentNetworkSupportCount !== nextNetworkSupportCount || currentNetworkOpposeCount !== nextNetworkOpposeCount) {
        // console.log("shouldComponentUpdate: support or oppose count change");
        return true;
      }
    }
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organization } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organization.organization_we_vote_id),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  onSupportStoreChange () {
    const { organization } = this.state;
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organization.organization_we_vote_id),
      supportProps: SupportStore.get(this.props.we_vote_id),
    });
  }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organization.organization_we_vote_id}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  togglePositionStatement () {
    const { showPositionStatement } = this.state;
    this.setState({
      showPositionStatement: !showPositionStatement,
    });
  }

  render () {
    // console.log("MeasureItemCompressed render");
    renderLog(__filename);
    console.log(this.state.measure);
    const { measure } = this.state;
    const { classes, theme } = this.props;
    let { ballot_item_display_name: ballotItemDisplayName } = this.props;
    const ballotDisplay = ballotItemDisplayName.split(':');
    const ballotItemDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam enim quam, placerat eu tincidunt eget, blandit et ipsum. Aenean tristique sapien ipsum. Ut placerat pellentesque arcu sagittis condimentum. Vivamus nec erat imperdiet mauris feugiat dignissim. Nam iaculis ullamcorper placerat. Suspendisse iaculis sapien facilisis mi efficitur ultricies. Duis sit amet odio eu nisi bibendum varius. Cras commodo fringilla magna, id gravida orci convallis quis. Nunc ultricies non sapien id pellentesque. Sed tristique sollicitudin ex, in commodo enim aliquam non. Donec consectetur purus ac sagittis tempor.';
    const { we_vote_id: measureWeVoteId } = this.props;
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    // let measureGuidesList = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(measureWeVoteId);

    // let measure_for_modal = {
    //   ballotItemDisplayName: ballotItemDisplayName,
    //   voter_guides_to_follow_for_ballot_item_id: measureGuidesList,
    //   kind_of_ballot_item: this.props.kind_of_ballot_item,
    //   measureSubtitle: measureSubtitle,
    //   measure_text: this.props.measure_text,
    //   measure_url: this.props.measure_url,
    //   we_vote_id: measureWeVoteId,
    //   position_list: this.props.position_list,
    // };

    // let measureSupportStore = SupportStore.get(measureWeVoteId);
    // let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(measureWeVoteId);
    // let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(measureWeVoteId);

    // // Voter Support or opposition
    // let isVoterSupport = false;
    // let isVoterOppose = false;
    // let voterStatementText = false;
    // const ballotItemSupportStore = SupportStore.get(this.state.ballotItemWeVoteId);
    // if (ballotItemSupportStore !== undefined) {
    //   // console.log("ballotItemSupportStore: ", ballotItemSupportStore);
    //   isVoterSupport = ballotItemSupportStore.is_support;
    //   isVoterOppose = ballotItemSupportStore.is_oppose;
    //   voterStatementText = ballotItemSupportStore.voter_statement_text;
    // }

    return (
      <Card classes={{ root: classes.cardRoot }}>
        <InfoRow>
          <MeasureInfoWrapper onClick={() => { this.goToMeasureLink(measureWeVoteId); }}>
            <Title>{ballotDisplay[0]}</Title>
            <SubTitle>{ballotDisplay[1]}</SubTitle>
            <Info>{shortenText(ballotItemDescription, 200)}</Info>
          </MeasureInfoWrapper>
          <EndorsementWrapper>
            <B>Endorsements</B>
            <EndorsementRow>
              <Endorsement>
                <ThumbUpIcon classes={{ root: classes.endorsementIconRoot }} />
                100
              </Endorsement>
              <Endorsement>
                <ThumbDownIcon classes={{ root: classes.endorsementIconRoot }} />
                99
              </Endorsement>
              <Endorsement>
                <CommentIcon classes={{ root: classes.endorsementIconRoot }} />
                999
              </Endorsement>
            </EndorsementRow>
          </EndorsementWrapper>
        </InfoRow>
        {
          measure && (
            <ChoicesRow>
              <Choice>
                <ChoiceTitle brandBlue={theme.palette.primary.main}>{`Yes On ${extractNumber(ballotItemDisplayName)}`}</ChoiceTitle>
                <ChoiceInfo>{shortenText(measure.yes_vote_description, 200)}</ChoiceInfo>
              </Choice>
              <Choice>
                <ChoiceTitle brandBlue={theme.palette.primary.main}>{`No On ${extractNumber(ballotItemDisplayName)}`}</ChoiceTitle>
                <ChoiceInfo>{shortenText(measure.no_vote_description, 200)}</ChoiceInfo>
              </Choice>
            </ChoicesRow>
          )
        }
        <Divider />
        <CardFooter onClick={() => { this.goToMeasureLink(measureWeVoteId); }}>
          Show More
          <ArrowForwardIcon classes={{ root: classes.cardFooterIconRoot }} />
        </CardFooter>
      </Card>
    );
  }
}

const styles = theme => ({
  cardRoot: {
    padding: '8px 16px',
    [theme.breakpoints.down('lg')]: {
      padding: '2px 16px',
    },
  },
  endorsementIconRoot: {
    fontSize: 14,
    margin: '.3rem .3rem 0 .5rem',
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .4rem',
  },
});

const InfoRow = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const ChoicesRow = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const Choice = styled.div`
  display: flex;
  flex-flow: column;
  padding-right: 8px;
`;

const ChoiceTitle = styled.h1`
  font-weight: bold;
  color: ${({ brandBlue }) => brandBlue};
`;

const ChoiceInfo = styled.p`
  font-size: 12px;
  color: #777;
  @media (max-width: 768px) {
    max-width: 140%;
  }
`;

const MeasureInfoWrapper = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 75%;
  cursor: pointer;
  user-select: none;
  padding-right: 8px;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const EndorsementWrapper = styled.div`
  max-width: 25%;
  color: #888;
  padding-top: .67rem;
  text-align: right;
  user-select: none;
  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-flow: row;
    padding-bottom: 8px;
    justify-content: space-between;
  }
`;

const Endorsement = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const EndorsementRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
`;

const B = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: .1rem;
  @media (max-width: 960px) {
    font-size: 16px;
  }
`;

const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 300;
  color: #555;
  @media (max-width: 960px) {
    font-size: 13px;
  }
`;

const Info = styled.p`
  font-size: 13px;
  font-weight: 300;
  color: #777;
`;

const CardFooter = styled.div`
  font-size: 12px;
  padding-top: 8px;
  text-align: center;
  user-select: none;
  cursor: pointer;
  @media (max-width: 960px) {
    padding-bottom: 8px;
  }
`;

export default withTheme()(withStyles(styles)(MeasureItemCompressed));
