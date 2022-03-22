import styled from '@mui/material/styles/styled';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ShowMoreItems extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { hideShowMoreLink, loadingMoreItemsNow, numberOfItemsDisplayed, numberOfItemsTotal } = this.props;

    if (numberOfItemsDisplayed === 0) {
      return null;
    }

    return (
      <Wrapper>
        Displaying
        {' '}
        {numberOfItemsDisplayed}
        {' '}
        of
        {' '}
        {numberOfItemsTotal}
        {(!hideShowMoreLink && !loadingMoreItemsNow && numberOfItemsDisplayed && numberOfItemsTotal && (numberOfItemsDisplayed < numberOfItemsTotal)) && (
          <span className="u-link-color u-cursor--pointer">
            &nbsp;&ndash;&nbsp;Show More
          </span>
        )}
      </Wrapper>
    );
  }
}
ShowMoreItems.propTypes = {
  hideShowMoreLink: PropTypes.bool,
  loadingMoreItemsNow: PropTypes.bool,
  numberOfItemsDisplayed: PropTypes.number,
  numberOfItemsTotal: PropTypes.number,
};

const Wrapper = styled('div')(({ theme }) => (`
  font-size: 14px;
  text-align: right;
  user-select: none;
  ${theme.breakpoints.down('lg')} {
    padding-top: 5px;
    padding-bottom: 3px;
  }
  @media print{
    display: none;
  }
`));

export default ShowMoreItems;
