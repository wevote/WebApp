import styled from '@mui/material/styles/styled';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

class PricingSwitch extends PureComponent {
  switchToDifferentCategory (switchToChoice = 0) {
    if (this.props.switchToDifferentCategoryFunction) {
      this.props.switchToDifferentCategoryFunction(switchToChoice);
    }
  }

  render () {
    const { choices, selectedPricingPlanIndex } = this.props;
    let { chosenBackgroundColor, chosenTextColor } = this.props;
    if (!chosenBackgroundColor) {
      chosenBackgroundColor = 'white';
    }
    if (!chosenTextColor) {
      chosenTextColor = '#2e3c5d'; // brandBlue;
    }
    return (
      <Container chosenBackgroundColor={chosenBackgroundColor}>
        <Choice
          id="howItWorksSwitchForVoters"
          thisPricingPlanInView={selectedPricingPlanIndex === 0}
          chosenTextColor={chosenTextColor}
          chosenBackgroundColor={chosenBackgroundColor}
          onClick={() => this.switchToDifferentCategory(0)}
        >
          <ChoiceText>{choices[0]}</ChoiceText>
        </Choice>
        <Choice
          id="howItWorksSwitchForOrganizations"
          thisPricingPlanInView={selectedPricingPlanIndex === 1}
          chosenTextColor={chosenTextColor}
          chosenBackgroundColor={chosenBackgroundColor}
          onClick={() => this.switchToDifferentCategory(1)}
        >
          <ChoiceText>{choices[1]}</ChoiceText>
        </Choice>
        <Choice
          id="howItWorksSwitchForCampaigns"
          thisPricingPlanInView={selectedPricingPlanIndex === 2}
          chosenTextColor={chosenTextColor}
          chosenBackgroundColor={chosenBackgroundColor}
          onClick={() => this.switchToDifferentCategory(2)}
        >
          <ChoiceText>{choices[2]}</ChoiceText>
        </Choice>
      </Container>
    );
  }
}
PricingSwitch.propTypes = {
  chosenTextColor: PropTypes.string,
  chosenBackgroundColor: PropTypes.string,
  choices: PropTypes.array.isRequired,
  selectedPricingPlanIndex: PropTypes.number.isRequired,
  switchToDifferentCategoryFunction: PropTypes.func,
};

const Container = styled('div', {
  shouldForwardProp: (prop) => !['chosenBackgroundColor'].includes(prop),
})(({ chosenBackgroundColor }) => (`
  display: flex;
  flex-flow: row;
  border-radius: 64px;
  height: 36px;
  max-width: 90%;
  width: 720px;
  margin: 0 auto;
  margin-bottom: 32px;
  cursor: pointer;
  border: 1px solid ${chosenBackgroundColor};
  transition: all 150ms ease-in;
`));

const Choice = styled('div', {
  shouldForwardProp: (prop) => !['thisPricingPlanInView', 'chosenBackgroundColor', 'chosenTextColor'].includes(prop),
})(({ thisPricingPlanInView, chosenBackgroundColor, chosenTextColor }) => (`
  display: flex;
  background: ${thisPricingPlanInView ? chosenBackgroundColor : 'transparent'};
  color: ${thisPricingPlanInView ? chosenTextColor : chosenBackgroundColor};
  border-radius: 64px;
  text-transform: uppercase;
  width: 50%;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease-in;
`));

const ChoiceText = styled('p')`
  margin: auto;
  font-size: 14px;
  text-align: center;
  transition: all 150ms ease-in;
  @media (max-width: 569px) {
    font-size: 12px;
  }
`;

export default withTheme(PricingSwitch);
