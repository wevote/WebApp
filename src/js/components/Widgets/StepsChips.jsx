import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled, { withTheme } from 'styled-components';

class StepChips extends PureComponent {
  generateChips = () => this.props.chips.map((item, idx) => (
    <React.Fragment key={item}>
      {
        !this.props.mobile ? (
          <Chip
            id={`howItWorksChip${idx}`}
            count={this.props.chips.length}
            selected={this.props.selected === idx}
            onClick={() => this.props.onSelectStep(idx)}
          >
            <ChipIndex selected={this.props.selected === idx}>{idx + 1}</ChipIndex>
            <ChipLabel>{item}</ChipLabel>
          </Chip>
        ) : (
          <ChipIndex
            id={`howItWorksChipMobile${idx}`}
            selected={this.props.selected === idx}
            onClick={() => this.props.onSelectStep(idx)}
          >
            {idx + 1}
          </ChipIndex>
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
StepChips.propTypes = {
  chips: PropTypes.array.isRequired,
  selected: PropTypes.number,
  mobile: PropTypes.bool,
  onSelectStep: PropTypes.func,
};

const Wrapper = styled.div`
  display: flex;
  flex-flow: row;
  height: 44px;
  width: 100%;
  background: ${({ theme }) => theme.colors.grayLighter2};
  justify-content: space-between;
  border-radius: 64px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
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
  cursor: pointer;
  background: ${({ selected, theme }) => (selected ? theme.colors.brandBlue : theme.colors.grayChip)};
  color: ${({ selected, theme }) => (selected ? '#fff' : theme.colors.brandBlue)};
  border-radius: 64px;
  margin: auto 6px;
  transition: all 150ms ease-in;
  &:hover {
    filter: brightness(98%);
  }
  &:active {
    filter: brightness(102%);
  }
`;

const ChipIndex = styled.p`
  margin: auto 6px;
  background: ${({ selected, theme }) => (selected ? theme.colors.brandBlue : theme.colors.grayPale)};
  ${({ selected, theme }) => (selected ? '' : `border: 1px solid ${theme.colors.grayBorder};`)}
  border-radius: 64px;
  color: ${({ selected, theme }) => (selected ? '#fff' : theme.colors.brandBlue)};
  cursor: pointer;
  padding: 2px 9px;
  font-weight: bold;
  transition: all 150ms ease-in;
  filter: ${({ selected }) => (selected ? 'brightness(150%)' : 'brightness(100%)')};
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    // background: ${({ selected }) => (selected ? 'white' : 'rgba(255, 255, 255, 0.2)')};
    font-size: 14px;
    margin: auto 2px;
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
