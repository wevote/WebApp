import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

// React functional component example
export default function YearState (props) {
  if (props.year || props.stateName) {
    return (
      <YearStateText>
        {' '}
        (
        {(props.year) && (
          <span>{props.year}</span>
        )}
        {(props.year && props.stateName) && (
          <span>
            {' '}
            -
            {' '}
          </span>
        )}
        {(props.stateName) && (
          <span>{props.stateName}</span>
        )}
        )
      </YearStateText>
    );
  } else {
    return null;
  }
}
YearState.propTypes = {
  stateName: PropTypes.string,
  year: PropTypes.string,
};

const YearStateText = styled('span')`
  color: #999;
  font-weight: 200;
  white-space: nowrap;
`;
