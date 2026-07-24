import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// "Welcome ..." greeting plus the big "Help X get elected in 4 easy steps!" headline.
export default function WelcomeMessage ({ voterFirstName, candidateName }) {
  return (
    <WelcomeWrapper>
      <Greeting>
        Welcome to WeVote,
        {' '}
        {voterFirstName}
        {' - '}
        and thanks for accepting
        {' '}
        {candidateName}
        &rsquo;s invitation!
      </Greeting>
      <Headline>
        Help
        {' '}
        {candidateName}
        {' '}
        get elected in 4 easy steps!
      </Headline>
    </WelcomeWrapper>
  );
}
WelcomeMessage.propTypes = {
  voterFirstName: PropTypes.string,
  candidateName: PropTypes.string,
};

const Greeting = styled.p`
  color: ${DesignTokenColors.neutral800};
  font-size: 17px;
  font-weight: 500;
  margin: 0;
`;

const Headline = styled.h1`
  color: ${DesignTokenColors.neutral900};
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
`;

const WelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
