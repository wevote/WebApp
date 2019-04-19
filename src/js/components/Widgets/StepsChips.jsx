import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

class StepChips extends PureComponent {

  static propTypes = {
    chips: PropTypes.object.isRequired,
    selected: PropTypes.number,
  };

  generateChips = () => this.props.chips.map((item, idx) => (
    <Chip key={item} count={this.props.chips.length} selected={this.props.selected === idx}>
      <ChipIndex selected={this.props.selected === idx}>{idx + 1}</ChipIndex>
      <ChipLabel>{item}</ChipLabel>
    </Chip>
  ));

  render () {
    return (
      <Wrapper>
        {this.generateChips()}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-flow: row;
  height: 44px;
  width: 100%;
  margin: 16px 0;
  background: ${({ theme }) => theme.colors.grayPale};
  justify-content: space-between;
  border-radius: 64px;
`;

const Chip = styled.div`
  display: flex;
  flex-flow: row;
  min-width: 100px;
  width: ${({ count }) => `${100 / count}%`};
  font-size: 16px;
  height: 36px;
  background: ${({ selected, theme }) => (selected ? theme.colors.brandBlue : theme.colors.grayChip)};
  color: ${({ selected, theme }) => (selected ? 'white' : theme.colors.brandBlue)};
  border-radius: 64px;
  margin: auto 6px;
  transition: all 150ms ease-in;
`;

const ChipIndex = styled.p`
  margin: auto 6px;
  background: ${({ selected, theme }) => (selected ? theme.colors.brandBlue : theme.colors.grayPale)};
  border-radius: 64px;
  padding: 2px 9px;
  font-weight: bold;
  transition: all 150ms ease-in;
  filter: ${({ selected }) => (selected ? 'brightness(150%)' : 'brightness(100%)')};
`;

const ChipLabel = styled.p`
  margin: auto;
  font-weight: bold;
  padding-right: 24px;
  transition: all 150ms ease-in;
`;

export default withTheme(StepChips);
