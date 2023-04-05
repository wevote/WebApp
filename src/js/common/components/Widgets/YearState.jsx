import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

// React functional component example
export default function YearState (props) {
  if (props.year || props.stateName || props.politicalParty) {
    return (
      <YearStateText centeredText={props.centeredText}>
        {' '}
        {(props.year) && (
          <div>{props.year}</div>
        )}
        {(props.year && props.stateName) && (
          <DotStyleWrapper>
            <DotStyle>
              •
            </DotStyle>
          </DotStyleWrapper>
        )}
        {(props.stateName) && (
          <div>{props.stateName}</div>
        )}
        {((props.stateName || props.year) && props.politicalParty) && (
          <DotStyleWrapper>
            <DotStyle>
              •
            </DotStyle>
          </DotStyleWrapper>
        )}
        {(props.politicalParty) && (
          <PoliticalPartyWrapper>
            {props.politicalParty}
          </PoliticalPartyWrapper>
        )}
      </YearStateText>
    );
  } else {
    return null;
  }
}
YearState.propTypes = {
  centeredText: PropTypes.bool,
  politicalParty: PropTypes.string,
  stateName: PropTypes.string,
  year: PropTypes.string,
};

const DotStyle = styled('div')`
  font-size: 10px;
  margin-bottom: 1px;
`;

const DotStyleWrapper = styled('div')`
  align-items: center;
  display: flex;
  padding: 3px;
`;

const PoliticalPartyWrapper = styled('div')`
  line-height: 1.1;
  max-width: 23ch;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const YearStateText = styled('div', {
  shouldForwardProp: (prop) => !['centeredText'].includes(prop),
})(({ centeredText }) => (`
  ${centeredText ? 'justify-content: center;' : ''}
  align-items: center;
  color: #999;
  display: flex;
  font-weight: 200;
  white-space: nowrap;
`));
