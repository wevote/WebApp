import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

class StepChips extends PureComponent {
  static propTypes = {
    chips: PropTypes.array.isRequired,
    selected: PropTypes.number,
    mobile: PropTypes.bool,
  };

  generateChips = () => this.props.chips.map((item, idx) => (
    <React.Fragment key={item}>
      {
        !this.props.mobile ? (
          <Chip count={this.props.chips.length} selected={this.props.selected === idx}>
            <ChipIndex selected={this.props.selected === idx}>{idx + 1}</ChipIndex>
            <ChipLabel>{item}</ChipLabel>
          </Chip>
        ) : (
          <ChipIndex selected={this.props.selected === idx}>{idx + 1}</ChipIndex>
        )
      }
    </React.Fragment>
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
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    background: rgba(255, 255, 255, 0.1);
    height: 32px;
    margin: auto 0;
    padding: 0 4px;
  }
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
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    color: ${({ theme }) => theme.colors.brandBlue};
    background: ${({ selected }) => (selected ? 'white' : 'rgba(255, 255, 255, 0.2)')};
    margin: auto 2px;
    font-size: 14px;
    padding: 2px 8px;
  }
`;

const ChipLabel = styled.p`
  margin: auto;
  font-weight: bold;
  padding-right: 24px;
  transition: all 150ms ease-in;
`;

export default withTheme(StepChips);
