import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import ItemActionBar from '../Widgets/ItemActionBar/ItemActionBar';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString, shortenText } from '../../utils/textFormat';
import ItemPositionStatementActionBar from '../Widgets/ItemPositionStatementActionBar';


class MeasureItemForAddPositions extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string.isRequired,
    ballotItemWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
    measureText: PropTypes.string,
    organization: PropTypes.object,
    organization_we_vote_id: PropTypes.string,
    showPositionStatementActionBar: PropTypes.bool,
    inModal: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      componentDidMountFinished: false,
      measureText: '',
      ballotItemWeVoteId: '',
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
      organizationWeVoteId: '',
      showPositionStatement: false,
      voterTextStatement: '',
    };
    // this.getMeasureLink = this.getMeasureLink.bind(this);
    this.openMeasureLinkModal = this.openMeasureLinkModal.bind(this);
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    const { ballotItemWeVoteId, ballotItemDisplayName, measureText } = this.props;
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organization_we_vote_id;
    if (ballotItemWeVoteId) {
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      if (ballotItemStatSheet) {
        const { voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet;
        this.setState({
          voterOpposesBallotItem,
          voterSupportsBallotItem,
          voterTextStatement,
        });
      }
    }
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      componentDidMountFinished: true,
      measureText,
      organizationWeVoteId,
    });
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    const organizationWeVoteId = (nextProps.organization && nextProps.organization.organization_we_vote_id) ? nextProps.organization.organization_we_vote_id : nextProps.organization_we_vote_id;
    if (nextProps.ballotItemWeVoteId) {
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(nextProps.ballotItemWeVoteId);
      if (ballotItemStatSheet) {
        const { voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet;
        this.setState({
          voterOpposesBallotItem,
          voterSupportsBallotItem,
          voterTextStatement,
        });
      }
    }
    this.setState({
      ballotItemDisplayName: nextProps.ballotItemDisplayName,
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      measureText: nextProps.measureText,
      organizationWeVoteId,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId:', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId:', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      // console.log('this.state.ballotItemDisplayName:', this.state.ballotItemDisplayName, ', nextState.ballotItemDisplayName:', nextState.ballotItemDisplayName);
      return true;
    }
    if (this.state.measure !== nextState.measure) {
      // console.log('this.state.measure:', this.state.measure, ', nextState.measure:', nextState.measure);
      return true;
    }
    if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) {
      // console.log('this.props.showPositionStatementActionBar change');
      return true;
    }
    if (this.state.voterOpposesBallotItem !== nextState.voterOpposesBallotItem) {
      // console.log('this.state.voterOpposesBallotItem: ', this.state.voterOpposesBallotItem, ', nextState.voterOpposesBallotItem: ', nextState.voterOpposesBallotItem);
      return true;
    }
    if (this.state.voterSupportsBallotItem !== nextState.voterSupportsBallotItem) {
      // console.log('this.state.voterSupportsBallotItem: ', this.state.voterSupportsBallotItem, ', nextState.voterSupportsBallotItem: ', nextState.voterSupportsBallotItem);
      return true;
    }
    if (this.state.showPositionStatement !== nextState.showPositionStatement) {
      // console.log('this.state.showPositionStatement: ', this.state.showPositionStatement, ', nextState.showPositionStatement: ', nextState.showPositionStatement);
      return true;
    }
    if (this.state.voterTextStatement !== nextState.voterTextStatement) {
      // console.log('this.state.voterTextStatement: ', this.state.voterTextStatement, ', nextState.voterTextStatement: ', nextState.voterTextStatement);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
  }

  onSupportStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    if (ballotItemWeVoteId) {
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      if (ballotItemStatSheet) {
        const { voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet;
        this.setState({
          voterOpposesBallotItem,
          voterSupportsBallotItem,
          voterTextStatement,
        });
      }
    }
  }

  // getMeasureLink (oneMeasureWeVoteId) {
  //   if (this.state.organizationWeVoteId) {
  //     // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
  //     return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
  //   } else {
  //     // If no organization_we_vote_id, signal that we want to link back to default ballot
  //     return `/measure/${oneMeasureWeVoteId}/b/btdb`; // back-to-default-ballot
  //   }
  // }

  openMeasureLinkModal (oneMeasureWeVoteId) {
    console.log('Open measure viewer for ', oneMeasureWeVoteId);
  }

  togglePositionStatement () {
    const { showPositionStatement } = this.state;
    this.setState({
      showPositionStatement: !showPositionStatement,
      // shouldFocusCommentArea: true,
    });
  }

  render () {
    renderLog('MeasureItemForAddPositions');  // Set LOG_RENDER_EVENTS to log all renders
    let { ballotItemDisplayName } = this.state;
    const { measureText, ballotItemWeVoteId, showPositionStatement, voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement } = this.state;
    if (!ballotItemWeVoteId) {
      return null;
    }
    const { classes } = this.props;
    let ballotDisplay = [];
    if (ballotItemDisplayName) {
      ballotDisplay = ballotItemDisplayName.split(':');
    }
    // measureSubtitle = capitalizeString(measureSubtitle);
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    const commentDisplayDesktop = voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement || showPositionStatement ? (
      <div className="d-none d-sm-block u-min-50 u-stack--sm u-push--xs">
        <ItemPositionStatementActionBar
          ballotItemWeVoteId={ballotItemWeVoteId}
          ballotItemDisplayName={ballotItemDisplayName}
          commentEditModeOn={showPositionStatement}
          externalUniqueId="desktopPositionStatement"
          // shouldFocus={this.state.shouldFocusCommentArea}
          transitioning={this.state.transitioning}
          type="MEASURE"
          shownInList
        />
      </div>
    ) :
      null;

    const commentDisplayMobile = voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement ? (
      <div className="d-block d-sm-none u-min-50 u-push--xs">
        <ItemPositionStatementActionBar
          ballotItemWeVoteId={ballotItemWeVoteId}
          ballotItemDisplayName={ballotItemDisplayName}
          externalUniqueId="mobilePositionStatement"
          // shouldFocus={this.state.shouldFocusCommentArea}
          transitioning={this.state.transitioning}
          type="MEASURE"
          shownInList
          mobile
        />
      </div>
    ) :
      null;

    return (
      <Card classes={{ root: classes.cardRoot }}>
        <InfoRow>
          <MeasureInfoWrapper onClick={() => { this.openMeasureLinkModal(ballotItemWeVoteId); }}>
            <Title>
              {ballotDisplay[0]}
            </Title>
            <SubTitle>{ballotDisplay[1]}</SubTitle>
            <MeasureText>{shortenText(measureText, 200)}</MeasureText>
          </MeasureInfoWrapper>
          {/* Action Buttons: Support/Oppose/Comment */}
          <ItemActionBar
            inModal={this.props.inModal}
            ballotItemDisplayName={ballotItemDisplayName}
            ballotItemWeVoteId={ballotItemWeVoteId}
            buttonsOnly
            externalUniqueId={`measureItemForAddPositions-${ballotItemWeVoteId}`}
            shareButtonHide
            togglePositionStatementFunction={this.togglePositionStatement}
            // transitioning={this.state.transitioning}
          />
        </InfoRow>
        {commentDisplayDesktop}
        {commentDisplayMobile}
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

const MeasureInfoWrapper = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 75%;
  cursor: pointer;
  user-select: none;
  padding-right: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 70%;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: .1rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 16px;
  }
`;

const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 300;
  color: #555;
  margin-top: .6rem;
  width: 135%;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 13px;
  }
`;

const MeasureText = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: #777;
  width: 135%;
`;

export default withTheme(withStyles(styles)(MeasureItemForAddPositions));
