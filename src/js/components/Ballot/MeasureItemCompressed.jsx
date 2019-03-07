import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { withStyles, withTheme } from '@material-ui/core/styles';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
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
    // currentBallotIdInUrl: PropTypes.string,
    organization: PropTypes.object,
    showPositionStatementActionBar: PropTypes.bool,
    // urlWithoutHash: PropTypes.string,
    measureWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
    theme: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      // ballotItemWeVoteId: '',
      componentDidMountFinished: false,
      measureText: '',
      measureWeVoteId: '',
      noVoteDescription: '',
      organization: {},
      showPositionStatement: false,
      yesVoteDescription: '',
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
    const measure = MeasureStore.getMeasure(this.props.measureWeVoteId);
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      componentDidMountFinished: true,
      measure,
      // measureSubtitle: measure.measure_subtitle,
      measureSupportProps: SupportStore.get(this.props.measureWeVoteId),
      measureText: measure.measure_text,
      measureWeVoteId: this.props.measureWeVoteId,
      noVoteDescription: measure.no_vote_description,
      yesVoteDescription: measure.yes_vote_description,
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
    const measure = MeasureStore.getMeasure(nextProps.measureWeVoteId);
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      measure,
      // measureSubtitle: measure.measure_subtitle,
      measureSupportProps: SupportStore.get(nextProps.measureWeVoteId),
      measureText: measure.measure_text,
      measureWeVoteId: nextProps.measureWeVoteId,
      noVoteDescription: measure.no_vote_description,
      yesVoteDescription: measure.yes_vote_description,
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
    if (this.state.measureSupportProps !== undefined && nextState.measureSupportProps !== undefined) {
      const currentNetworkSupportCount = parseInt(this.state.measureSupportProps.support_count) || 0;
      const nextNetworkSupportCount = parseInt(nextState.measureSupportProps.support_count) || 0;
      const currentNetworkOpposeCount = parseInt(this.state.measureSupportProps.oppose_count) || 0;
      const nextNetworkOpposeCount = parseInt(nextState.measureSupportProps.oppose_count) || 0;
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
    const { measureWeVoteId, organization } = this.state;
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organization.organization_we_vote_id),
      measureSupportProps: SupportStore.get(measureWeVoteId),
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
    const { noVoteDescription, yesVoteDescription } = this.state;
    let { ballotItemDisplayName } = this.state;
    const { measureText, measureWeVoteId } = this.state;
    const { classes, theme } = this.props;
    let ballotDisplay = [];
    if (ballotItemDisplayName) {
      ballotDisplay = ballotItemDisplayName.split(':');
    }
    // measureSubtitle = capitalizeString(measureSubtitle);
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    // let measureGuidesList = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(measureWeVoteId);

    // let measure_for_modal = {
    //   ballotItemDisplayName: ballotItemDisplayName,
    //   voter_guides_to_follow_for_ballot_item_id: measureGuidesList,
    //   kind_of_ballot_item: this.props.kind_of_ballot_item,
    //   measureSubtitle: measureSubtitle,
    //   measure_text: this.props.measure_text,
    //   measure_url: this.props.measure_url,
    //   measureWeVoteId,
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
            <Title>
              {ballotDisplay[0]}
              <ArrowForwardIcon
                className="u-show-desktop"
                classes={{ root: classes.cardHeaderIconRoot }}
              />
            </Title>
            <SubTitle>{ballotDisplay[1]}</SubTitle>
            <Info>{shortenText(measureText, 200)}</Info>
          </MeasureInfoWrapper>
          <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={measureWeVoteId} />
        </InfoRow>
        <ChoicesRow>
          <Choice
            brandBlue={theme.palette.primary.main}
            onClick={() => { this.goToMeasureLink(measureWeVoteId); }}
          >
            <ChoiceTitle brandBlue={theme.palette.primary.main}>
              {`Yes On ${extractNumber(ballotItemDisplayName)}`}
            </ChoiceTitle>
            <ChoiceInfo>{shortenText(yesVoteDescription, 200)}</ChoiceInfo>
          </Choice>
          <Choice
            brandBlue={theme.palette.primary.main}
            onClick={() => { this.goToMeasureLink(measureWeVoteId); }}
          >
            <ChoiceTitle brandBlue={theme.palette.primary.main}>
              {`No On ${extractNumber(ballotItemDisplayName)}`}
            </ChoiceTitle>
            <ChoiceInfo>{shortenText(noVoteDescription, 200)}</ChoiceInfo>
          </Choice>
        </ChoicesRow>
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
    padding: '16px 16px 8px 16px',
    [theme.breakpoints.down('lg')]: {
      padding: '16px 16px 0 16px',
    },
  },
  endorsementIconRoot: {
    fontSize: 14,
    margin: '.3rem .3rem 0 .5rem',
  },
  cardHeaderIconRoot: {
    marginTop: '-.3rem',
    fontSize: 20,
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .4rem',
  },
});

const InfoRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const ChoicesRow = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const Choice = styled.div`
  display: flex;
  flex-flow: column;
  padding-right: 8px;
  cursor: pointer;
  transition: all 200ms ease-in;
  @media (min-width: 768px) {
    max-width: 47%;
    border: none;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 0 16px;
    margin-right: 10px;
    margin-bottom: 16px;
    &:hover {
      border: 1px solid ${({ brandBlue }) => brandBlue};
      box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
    }
  }
`;

const ChoiceTitle = styled.h1`
  font-weight: bold;
  color: #4371cc;
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

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: .1rem 0;
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
