import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import FollowToggle from './FollowToggle';
import { cleanArray } from '../../utils/textFormat';

class PositionSummaryListForPopover extends Component {
  static propTypes = {
    classes: PropTypes.object,
    positionSummaryList: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
      positionSummaryListLength: 0,
    };
  }

  componentDidMount () {
    // console.log('BallotItemSupportOpposeCountDisplay componentDidMount');
    let positionSummaryListLength = 0;
    if (this.props.positionSummaryList) {
      positionSummaryListLength = this.props.positionSummaryList.length;
    }
    this.setState({
      positionSummaryListLength,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps, nextProps: ', nextProps);
    let positionSummaryListLength = 0;
    if (nextProps.positionSummaryList) {
      positionSummaryListLength = nextProps.positionSummaryList.length;
    }
    this.setState({
      positionSummaryListLength,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.positionSummaryListLength !== nextState.positionSummaryListLength) {
      // console.log('this.state.positionSummaryListLength: ', this.state.positionSummaryListLength, ', nextState.positionSummaryListLength', nextState.positionSummaryListLength);
      return true;
    }
    return false;
  }

  render () {
    const { classes, positionSummaryList } = this.props;
    let numberDisplayedSoFar = 0;
    const renderedList = positionSummaryList.map((positionSummary) => {
      numberDisplayedSoFar += 1;
      if (numberDisplayedSoFar > 12) {
        // Only show the first 12
        // return null;
      }
      return (
        <PositionSummaryWrapper
          key={`onePositionForPopover-${positionSummary.ballotItemWeVoteId}-${positionSummary.organizationWeVoteId}-${positionSummary.organizationName}`}
        >
          {positionSummary.organizationSupports && !positionSummary.organizationInVotersNetwork && (
            <SupportButNotPartOfScore>
              <ThumbUpIcon classes={{ root: classes.endorsementIcon }} />
            </SupportButNotPartOfScore>
          )}
          {positionSummary.organizationSupports && positionSummary.organizationInVotersNetwork && (
            <SupportAndPartOfScore>
              +1
            </SupportAndPartOfScore>
          )}
          {positionSummary.organizationOpposes && !positionSummary.organizationInVotersNetwork && (
            <OpposeButNotPartOfScore>
              <ThumbDownIcon classes={{ root: classes.endorsementIcon }} />
            </OpposeButNotPartOfScore>
          )}
          {positionSummary.organizationOpposes && positionSummary.organizationInVotersNetwork && (
            <OpposeAndPartOfScore>
              -1
            </OpposeAndPartOfScore>
          )}
          <OrganizationNameWrapper>
            {positionSummary.organizationName}
          </OrganizationNameWrapper>
          {(positionSummary.voterCanFollowOrganization && !positionSummary.organizationInVotersNetwork) && (
            <FollowToggleWrapper>
              <FollowToggle organizationWeVoteId={positionSummary.organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing />
            </FollowToggleWrapper>
          )}
          {positionSummary.voterIsFollowingOrganization && (
            <FollowingWrapper>
              <CheckCircle className="following-icon" />
            </FollowingWrapper>
          )}
        </PositionSummaryWrapper>
      );
    });
    return cleanArray(renderedList);
  }
}

const styles = () => ({
  endorsementIcon: {
    width: 12,
    height: 12,
  },
});

const PositionSummaryWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;

const SupportAndPartOfScore = styled.div`
  color: white;
  background: ${({ theme }) => theme.colors.supportGreenRgb};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  float: right;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
  @media print{
    border: 2px solid grey;
  }
`;

const OpposeAndPartOfScore = styled.div`
  color: white;
  background: ${({ theme }) => theme.colors.opposeRedRgb};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  float: right;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
  @media print{
    border: 2px solid grey;
  }
`;

const SupportButNotPartOfScore = styled.div`
  color: ${({ theme }) => theme.colors.supportGreenRgb};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid ${({ theme }) => theme.colors.supportGreenRgb};
  float: left;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
`;

const OpposeButNotPartOfScore = styled.div`
  color: ${({ theme }) => theme.colors.opposeRedRgb};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  float: left;
  border: 2px solid ${({ theme }) => theme.colors.opposeRedRgb};
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
`;

const OrganizationNameWrapper = styled.div`
  flex-grow: 8;
`;

const FollowToggleWrapper = styled.div`
`;

const FollowingWrapper = styled.div`
`;

export default withTheme(withStyles(styles)(PositionSummaryListForPopover));
