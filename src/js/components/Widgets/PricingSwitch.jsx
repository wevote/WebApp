import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

class PricingSwitch extends PureComponent {
  static propTypes = {
    color: PropTypes.string.isRequired,
    choices: PropTypes.array.isRequired,
    selectedCategoryIndex: PropTypes.number.isRequired,
    switchToDifferentCategoryFunction: PropTypes.func,
  };

  switchToDifferentCategory (switchToChoice = 0) {
    if (this.props.switchToDifferentCategoryFunction) {
      this.props.switchToDifferentCategoryFunction(switchToChoice);
    }
  }

  render () {
    const { color, choices, selectedCategoryIndex } = this.props;
    return (
      <Container color={color}>
        <Choice id="howItWorksSwitchForVoters" selectedCategoryIndex={selectedCategoryIndex === 0} color={color} onClick={() => this.switchToDifferentCategory(0)}>
          <ChoiceText>{choices[0]}</ChoiceText>
        </Choice>
        <Choice id="howItWorksSwitchForOrganizations" selectedCategoryIndex={selectedCategoryIndex === 1} color={color} onClick={() => this.switchToDifferentCategory(1)}>
          <ChoiceText>{choices[1]}</ChoiceText>
        </Choice>
        <Choice id="howItWorksSwitchForCampaigns" selectedCategoryIndex={selectedCategoryIndex === 2} color={color} onClick={() => this.switchToDifferentCategory(2)}>
          <ChoiceText>{choices[2]}</ChoiceText>
        </Choice>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 64px;
  height: 36px;
  max-width: 90%;
  width: 720px;
  margin: 0 auto;
  margin-bottom: 32px;
  cursor: pointer;
  border: 1px solid ${({ color }) => color};
  transition: all 150ms ease-in;
`;

const Choice = styled.div`
  display: flex;
  background: ${({ selectedCategoryIndex, color }) => (selectedCategoryIndex ? color : 'transparent')};
  color: ${({ selectedCategoryIndex, color, theme }) => (selectedCategoryIndex ? theme.colors.brandBlue : color)};
  border-radius: 64px;
  text-transform: uppercase;
  width: 50%;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease-in;
`;

const ChoiceText = styled.p`
  margin: auto;
  font-size: 14px;
  text-align: center;
  transition: all 150ms ease-in;
  @media (max-width: 569px) {
    font-size: 12px;
  }
`;

export default withTheme(PricingSwitch);
