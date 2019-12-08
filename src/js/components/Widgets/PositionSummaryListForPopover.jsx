import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { cleanArray } from '../../utils/textFormat';

class PositionSummaryListForPopover extends Component {
  static propTypes = {
    classes: PropTypes.object,
    positionSummaryList: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if not needed
  //   if (this.state.allCachedPositionsForThisCandidateLength !== nextState.allCachedPositionsForThisCandidateLength) {
  //     // console.log('this.state.allCachedPositionsForThisCandidateLength: ', this.state.allCachedPositionsForThisCandidateLength, ', nextState.allCachedPositionsForThisCandidateLength', nextState.allCachedPositionsForThisCandidateLength);
  //     return true;
  //   }
  //   return false;
  // }

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
          key={`onePositionForIssue--${positionSummary.organizationWeVoteId}`}
        >
          {positionSummary.organizationSupports && !positionSummary.organizationInVotersNetwork && (
            <Support>
              <ThumbUpIcon classes={{ root: classes.endorsementIcon }} />
            </Support>
          )}
          {positionSummary.organizationSupports && positionSummary.organizationInVotersNetwork && (
            <SupportFollow>
              +1
            </SupportFollow>
          )}
          {positionSummary.organizationOpposes && !positionSummary.organizationInVotersNetwork && (
            <Oppose>
              <ThumbDownIcon classes={{ root: classes.endorsementIcon }} />
            </Oppose>
          )}
          {positionSummary.organizationOpposes && positionSummary.organizationInVotersNetwork && (
            <OpposeFollow>
              -1
            </OpposeFollow>
          )}
          <div>
            {positionSummary.organizationName}
          </div>
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

const SupportFollow = styled.div`
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

const OpposeFollow = styled.div`
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

const Support = styled.div`
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

const Oppose = styled.div`
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

export default withTheme(withStyles(styles)(PositionSummaryListForPopover));
