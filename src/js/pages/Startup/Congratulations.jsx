import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';

// React functional component example
export default function Congratulations (props) {
  const { displayState } = props;
  renderLog('Congratulations functional component');
  if (displayState !== 4) return '';
  return (
    <CongratsBox>
      <Congrats>Congratulations</Congrats>
      <Congrats>
        We noticed you recently supported a campaign.  Do you want to choose friends to share that campaign with?
      </Congrats>
    </CongratsBox>
  );
}
Congratulations.propTypes = {
  displayState: PropTypes.number.isRequired,
};

const CongratsBox = styled.div`
  margin: 25px;
`;

const Congrats = styled.div`
  text-align: center;
  padding: 40px 20px 20px 20px;
`;

