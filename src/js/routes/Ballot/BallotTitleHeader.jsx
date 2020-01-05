import React from 'react';
import styled from 'styled-components';
import { isCordova, isIOsSmallerThanPlus } from '../../utils/cordovaUtils';
import BallotShareButton from '../../components/Ballot/BallotShareButton';

const BallotTitleHeader = ({ electionName, electionDayTextFormatted, scrolled }) => {
  if (isCordova && isIOsSmallerThanPlus() && electionName) {
    return (
      <h1 className="ballot__header__title__cordova">
        <div className="ballot__header__title__cordova-text">
          <span>
            {electionName}
            {!electionDayTextFormatted && (
              <>
                {' '}
                Not Found
              </>
            )}
          </span>
          {electionDayTextFormatted && (
            <>
              <br />
              <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
            </>
          )}
        </div>
      </h1>
    );
  } else if (isCordova && electionName) {
    return (
      <Wrapper scrolled={scrolled}>
        <Title>
          <ElectionName scrolled={scrolled}>
            {electionName}
            {!electionDayTextFormatted && (
              <>
                {' '}
                Not Found
              </>
            )}
          </ElectionName>
          {electionDayTextFormatted && (
            <>
              {' '}
              <span className="d-none d-sm-inline">&mdash;</span>
              {' '}
              <ElectionDate scrolled={scrolled} className="u-gray-mid u-no-break">{electionDayTextFormatted}</ElectionDate>
            </>
          )}
        </Title>
        {electionDayTextFormatted && (
          <ShareButtonWrapper>
            <BallotShareButton />
          </ShareButtonWrapper>
        )}
      </Wrapper>
    );
  } else if (electionName) {
    return (
      <>
        <Title>
          <ElectionName>
            {electionName}
            {!electionDayTextFormatted && (
              <>
                {' '}
                Not Found
              </>
            )}
          </ElectionName>
          {electionDayTextFormatted && (
            <>
              {' '}
              <span className="d-none d-sm-inline">&mdash;</span>
              {' '}
              <ElectionDate>{electionDayTextFormatted}</ElectionDate>
            </>
          )}
        </Title>
        {electionDayTextFormatted && (
          <BallotShareButton />
        )}
      </>
    );
  } else {
    return (
      <span className="u-push--sm">
        Loading Election...
      </span>
    );
  }
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: ${props => (props.scrolled ? '12px' : 0)};
`;

const Title = styled.h1`
  margin: 0;
  @media (min-width: 576px) {

  }
`;

const ElectionName = styled.span`
  font-size: 16px;
  font-weight: bold;
  @media (min-width: 576px) {
    font-size: 16px;
    font-weight: bold;
  }
`;

const ElectionDate = styled.span`
  font-size: 14px;
  @media (min-width: 576px) {
    font-size: 16px;
  }
`;

const ShareButtonWrapper = styled.div`
  display: none;
  margin-left: auto;
  @media (min-width: 576px) {
    display: block;
  }
`;

export default BallotTitleHeader;
