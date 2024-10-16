import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import ModalDisplayTemplateA, { templateAStyles, TextFieldWrapper } from '../../../components/Widgets/ModalDisplayTemplateA';
import { DialogTitle, DialogTitleText } from '@mui/material';
import { renderLog } from '../../utils/logging';

class PointsExplanationModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showTerms: false,
    };
  }

  toggleTerms = () => {
    this.setState({ showTerms: !this.state.showTerms });
  };

  render() {
    renderLog('PointsExplanationModalModal');
    const { show, toggleModal } = this.props;
    const { showTerms } = this.state;

    const dialogTitleText = '';

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
                <ViewContestTermsLink onClick={this.toggleTerms}>
                  <span>{showTerms ? 'Hide contest terms' : 'View contest terms'}</span>
                </ViewContestTermsLink>
              </ViewContestTermsDiv>
            </FlexDivLeft>
          </CardForListRow>

          {showTerms && (
            <>
              <CardForListRow>
                <FlexDivLeft>
                  <ContestTermDiv>
                    <span>Contest terms</span>
                  </ContestTermDiv>
                </FlexDivLeft>
              </CardForListRow>
              <Ul>
                <li>Sponsor: WeVote USA</li>
                <li>Eligibility: Open to residents of the USA who are 18 years or older.</li>
                <li>Entry Period: see challenge homepage</li>
                <li>How to Enter: To enter, simply [Describe entry method].</li>
                <li>Price: One lucky winner will receive [Price Description].</li>
                <li>Odds of Winning: Odds of winning depend on the number of eligible entries received.</li>
                <li>No Purchase necessary: No purchase is necessary to enter or win.</li>
                <li>Alternative Method of Entry: To enter without purchasing, send a handwritten letter to [Address].</li>
                <li>Taxes: Winner is responsible for all applicable taxes.</li>
                <li>Winner Notification: Winners will be notified by email or phone.</li>
                <li>Rules and Regulations: For a complete set of rules, please visit [Link to Rules].</li>
              </Ul>
            </>
          )}
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

PointsExplanationModal.propTypes = {
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
  }
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
  background-color: white; 

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

const ViewContestTermsLink = styled('span')`
  color: ${DesignTokenColors.accent500}; 
  cursor: pointer;
  text-decoration: underline; 
`;

export const ContestTermDiv = styled('div')`
  font-size: 12px;
`;

const Ul = styled('ul')`
  font-size: 10px;
  line-height: 1.5;
  text-align: left;
  padding-left: 10px;
`;

export default withTheme(withStyles(templateAStyles)(PointsExplanationModal));
