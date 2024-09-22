import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import JoinedGreenCircle from '../../../../img/global/svg-icons/issues/joined-green-circle.svg';
import InfoOutlineIcon from '../../../../img/global/svg-icons/issues/material-symbols-info-outline.svg';

const ImageHandler = React.lazy(() => import('../../../components/ImageHandler'));

function JoinedAndDaysLeft({
  daysLeft,
  challengeTitle,
  imageUrl,
  goToChallengeHome,
  classes,
}) {
  const isMoreThanFiveDaysLeft = daysLeft > 5;
  return (
    <JoinedAndDaysLeftWrapper>
      <JoinedAndDaysLeftContainer>
        <div className="inner-content">
          <ChallengeTitleRow>
            <ChallengePhotoAndTitle>
              {/* Image or Icon */}
              <Suspense fallback={<div>Loading...</div>}>
                <StyledImageHandler
                  imageUrl={imageUrl}
                  alt={challengeTitle}
                />
              </Suspense>
              {/* Challenge Title */}
              <ChallengeNameH4>{challengeTitle}</ChallengeNameH4>
            </ChallengePhotoAndTitle>
            {/* Close Button */}
            <CloseDrawerIconWrapper>
              <IconButton
                aria-label="Close"
                className={classes?.closeButton}
                onClick={goToChallengeHome}
                size="large"
              >
                <Close classes={{ root: classes?.closeIcon }} />
              </IconButton>
            </CloseDrawerIconWrapper>
          </ChallengeTitleRow>

          {/* Additional Info */}
          <InfoWrapper>
            {/* SVG, Joined, Dot, and Days Left */}
            <JoinedInfoWrapper>
              {isMoreThanFiveDaysLeft ? (
                <>
                  <JoinedIcon src={JoinedGreenCircle} alt="Joined" />
                  <JoinedText>Joined</JoinedText>
                  <DotSeparator>•</DotSeparator>
                </>
              ) : (
                <InfoIcon src={InfoOutlineIcon} alt="Info" />
              )}
              <DaysLeftText isMoreThanFiveDays={isMoreThanFiveDaysLeft}>
                {daysLeft} Days Left
              </DaysLeftText>
            </JoinedInfoWrapper>
          </InfoWrapper>
        </div>
      </JoinedAndDaysLeftContainer>
    </JoinedAndDaysLeftWrapper>
  );
}

JoinedAndDaysLeft.propTypes = {
  daysLeft: PropTypes.number.isRequired,
  challengeTitle: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  goToChallengeHome: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

// Styled Components

const JoinedAndDaysLeftWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 445px; 
  margin: 0 auto;
  background-color: #f5f5f5;
`;

const JoinedAndDaysLeftContainer = styled('div')`
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;

const ChallengeTitleRow = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 81px;
`;

const ChallengePhotoAndTitle = styled('div')`
  align-items: center;
  display: flex;
`;
const StyledImageHandler = styled(ImageHandler)`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 1px solid #9D9D9D;
`;

const ChallengeNameH4 = styled('div')`
  color: #2a2a2c;
  font-family: Poppins;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 18px;
  margin-bottom: 0;
  padding: 0 15px;
  text-align: left;
  text-transform: capitalize;

`;

const CloseDrawerIconWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
  &:hover {
    background-color: unset;
  }
`;

const InfoIcon = styled('img')`
height: 17px;
margin-right: 5px;
width: 17px;
`;

const InfoWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
`;

const JoinedInfoWrapper = styled('div')`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #d2d2d2;
  border-radius: 20px;
  display: flex;
  height: auto;
  justify-content: center;
  padding: 5px 10px;
  width: auto;
`;

const JoinedIcon = styled('img')`
  height: 17px;
  margin-right: 5px;
  width: 17px;
`;

const JoinedText = styled('span')`
  color: #2a2a2c;
  font-family: Poppins;
  font-size: 13px;
  font-weight: 400;
`;

const DotSeparator = styled('span')`
  color: #6b6b6b;
  font-size: 13px;
  font-weight: 400;
  margin: 0 5px;
`;

const DaysLeftText = styled('span')`
  color: #2a2a2c;
  font-family: Poppins;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

export default JoinedAndDaysLeft;
