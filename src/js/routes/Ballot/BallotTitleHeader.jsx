import React from 'react';
import styled from 'styled-components';
import { isCordova, isIOsSmallerThanPlus } from '../../utils/cordovaUtils';
import BallotShareButton from '../../components/Ballot/BallotShareButton';
import { shortenText } from '../../utils/textFormat';

const webAppConfig = require('../../config');

const BallotTitleHeader = ({ electionName, electionDayTextFormatted, scrolled }) => {
  const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
  if (isCordova() && isIOsSmallerThanPlus() && electionName) {
    return (
      <h1 className="ballot__header__title__cordova">
        <div className="ballot__header__title__cordova-text">
          <span>
            {shortenText(electionName, 26)}
            {!electionDayTextFormatted && (
              <>
                {' '}
                Not Found
              </>
            )}
          </span>
          {electionDayTextFormatted && (
            <>
              {' '}
              <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
            </>
          )}
        </div>
      </h1>
    );
  } else if (isCordova() && electionName) {
    return (
      <Wrapper scrolled={scrolled}>
        <Title>
          <ElectionName scrolled={scrolled}>
            <span className="u-show-mobile-iphone5-or-smaller">
              {shortenText(electionName, 26)}
            </span>
            <span className="u-show-mobile-bigger-than-iphone5">
              {shortenText(electionName, 30)}
            </span>
            <span className="u-show-desktop-tablet">
              {electionName}
            </span>
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
        {electionDayTextFormatted && nextReleaseFeaturesEnabled && (
          <ShareButtonWrapper>
            <BallotShareButton />
          </ShareButtonWrapper>
        )}
      </Wrapper>
    );
  } else if (electionName) {
    return (
      <Wrapper>
        <Title>
          <ElectionName scrolled={scrolled}>
            <span className="u-show-mobile-iphone5-or-smaller">
              {shortenText(electionName, 26)}
            </span>
            <span className="u-show-mobile-bigger-than-iphone5">
              {shortenText(electionName, 30)}
            </span>
            <span className="u-show-desktop-tablet">
              {electionName}
            </span>
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
        {electionDayTextFormatted && nextReleaseFeaturesEnabled && (
          <ShareButtonWrapper>
            <BallotShareButton />
          </ShareButtonWrapper>
        )}
      </Wrapper>
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
  margin-top: 4px;
  @media (min-width: 576px) {
    display: block;
  }
`;

export default BallotTitleHeader;
