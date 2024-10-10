import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import ModalDisplayTemplateA, { templateAStyles, TextFieldWrapper } from '../../../components/Widgets/ModalDisplayTemplateA';
import { DialogTitle, DialogTitleText } from '@mui/material';
import { renderLog } from '../../utils/logging';
import { Card } from 'react-bootstrap';

class YourRankModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }
  render() {
    renderLog('YourRankModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { show, toggleModal } = this.props;

    const dialogTitleText = '';

    // The textField should have the following text:
    // How we calculate the challenge leaderboard ranking
    // At the end of a challenge, the participant who has the most points is ranked as #1 and wins the challenge.
    const textFieldJSX = (
      <PointsWrapper>
        <CardRowsWrapper>
          <CardForListRow>
            <FlexDivLeft>
              <HowWeCalculateDiv>
                <span>How we calculate the challenge leaderboard ranking</span>
              </HowWeCalculateDiv>
            </FlexDivLeft>
          </CardForListRow>
          <CardForListRow>
            <FlexDivLeft>
              <AtTheEndDiv>
                <span>At the end of a challenge, the participant who has the most points is ranked as #1 and wins the challenge.</span>
              </AtTheEndDiv>
            </FlexDivLeft>
          </CardForListRow>
          <CardForListRow>
            <FlexDivLeft>
              <HowYouEarnPointsDiv>
                <span>How you earn points</span>
              </HowYouEarnPointsDiv>
            </FlexDivLeft>
          </CardForListRow>
        </CardRowsWrapper>
        <Table>
          <thead>
            <tr>
              <Th>ACTION</Th>
              <Th>POINTS EARNED</Th>
            </tr>
          </thead>
          <tbody>
            <Tr>
              <Td>Friend you invited joins a challenge</Td>
              <Td>10</Td>
            </Tr>
            <Tr>
              <Td>Friend you invited clicks the invitation link</Td>
              <Td>5</Td>
            </Tr>
            <Tr>
              <Td>Adding a photo to your profile</Td>
              <Td>5</Td>
            </Tr>
            <Tr>
              <Td>Sending a challenge invitation to a friend</Td>
              <Td>2</Td>
            </Tr>
            <Tr>
              <Td>Every time a friend you invited earns 5 points</Td>
              <Td>1</Td>
            </Tr>
          </tbody>
        </Table>
        <CardRowsWrapper>
          <CardForListRow>
            <FlexDivLeft>
              <ViewContestTermsDiv>
                <span>View contest terms</span>
              </ViewContestTermsDiv>
            </FlexDivLeft>
          </CardForListRow>
      </CardRowsWrapper>
      </PointsWrapper>

    );
    
    return (
      <ModalDisplayTemplateA
        dialogTitleJSX={<DialogTitle>{dialogTitleText}</DialogTitle>}
        textFieldJSX={textFieldJSX}
        show={show}
        tallMode
        toggleModal={toggleModal}
      />
    );
  }
}

YourRankModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

const styles = () => ({
  howToVoteRoot: {
    color: '#999',
    height: 18,
    width: 18,
  },
});

const PointsWrapper = styled('div')`
  white-space: normal;
`;

export const CardRowsWrapper = styled('div')`
  margin-top: 2px;
`;

export const CardForListRow = styled('div')`
  color: ${DesignTokenColors.neutral900};
  font-size: 12px;
  line-height: 1.5;
  padding-bottom: 8px;

  &:First-child {
    border-bottom: 1px solid ${DesignTokenColors.neutral300};
  }
  
  &:nth-child(2) {
    padding-top: 8px;
`;

export const FlexDivLeft = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: start;
`;

export const HowWeCalculateDiv = styled('div')`
  font-size: 10px;

`;

export const AtTheEndDiv = styled('div')`
  font-weight: bold;
  font-size: 10px;
`;

export const HowYouEarnPointsDiv = styled('div')`
  font-size: 12px;
`;

export const ViewContestTermsDiv = styled('div')`
  font-size: 8px;
`;

const Table = styled('table')`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled('th')`
  text-align: left;
  color: ${DesignTokenColors.neutral900};
  font-size: 8px;
  padding-top: 8px;

  &:nth-child(2) {
    text-align: right;
  }
`;

const Tr = styled('tr')`
  background-color: white; /* Set background color of all rows to white */

  // No border on last row
  &:last-child {
    td {
      border-bottom: none;
    }
`;

const Td = styled('td')`
  color: ${DesignTokenColors.neutral900};
  font-size: 10px;
  padding: 2px;
  border-bottom: 1px solid ${DesignTokenColors.neutral300};

  &:nth-child(2) {
    text-align: right;
  }
`;

export default withTheme(withStyles(templateAStyles)(YourRankModal));
