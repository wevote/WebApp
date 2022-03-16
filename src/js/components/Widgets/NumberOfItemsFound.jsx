import React, { Component } from 'react';
import styled from '@mui/material/styles/styled';
import PropTypes from 'prop-types';

class NumberOfItemsFound extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { numberOfItemsTotal } = this.props;
    // console.log('NumberOfItemsFound render numberOfItemsTotal:', numberOfItemsTotal);

    if (numberOfItemsTotal === 0) {
      return null;
    }

    return (
      <Wrapper>
        {numberOfItemsTotal}
        {' '}
        <span className="u-show-mobile">
          Found
        </span>
        <span className="u-show-desktop-tablet">
          Items Found
        </span>
      </Wrapper>
    );
  }
}
NumberOfItemsFound.propTypes = {
  numberOfItemsTotal: PropTypes.number,
};

const Wrapper = styled('div')`
  font-size: 14px;
  text-align: right;
  user-select: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-top: 5px;
    padding-bottom: 3px;
  }
  @media print{
    display: none;
  }
`;

export default NumberOfItemsFound;
