import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

class HeaderSwitch extends PureComponent {
  static propTypes = {
    color: PropTypes.string.isRequired,
    choices: PropTypes.object.isRequired,
    selected: PropTypes.number.isRequired,
    onSwitch: PropTypes.func,
  };

  render () {
    const { color, choices, selected } = this.props;
    return (
      <Container color={color} onClick={this.props.onSwitch}>
        <Choice selected={selected === 0} color={color}>
          <ChoiceText>{choices[0]}</ChoiceText>
        </Choice>
        <Choice selected={selected === 1} color={color}>
          <ChoiceText>{choices[1]}</ChoiceText>
        </Choice>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 64px;
  height: 40px;
  min-width: 250px;
  width: 350px;
  cursor: pointer;
  border: 1px solid ${({ color }) => color};
  transition: all 150ms ease-in;
`;

const Choice = styled.div`
  background: ${({ selected, color }) => (selected ? color : 'transparent')};
  color: ${({ selected, color, theme }) => (selected ? theme.colors.brandBlue : color)};
  border-radius: 64px;
  text-transform: uppercase;
  width: 50%;
  font-weight: bold;
  padding: 8px 16px;
  transition: all 150ms ease-in;
`;

const ChoiceText = styled.p`
  margin: auto;
  font-size: 16px;
  text-align: center;
  transition: all 150ms ease-in;
`;

export default withTheme(HeaderSwitch);
