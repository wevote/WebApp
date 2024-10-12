import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Confetti from 'react-confetti';
import React, { useState, useEffect } from 'react';

const ThanksForViewingChallenge = ({ sharedByDisplayName }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  useEffect(() => {
    // Show confetti when the component mounts
    setShowConfetti(true);
    // Hide confetti after a short duration
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThanksForViewingOuterWrapper isClosing={isClosing}>
      <ThanksForViewingInnerWrapper isClosing={isClosing}>
        <ThankYouMessageWrapper>
          <ThankYouMessage>
            {showConfetti && <Confetti />}
            Thanks for checking out this challenge
            {sharedByDisplayName && (
              <>
                {' '}
                shared with you by
                {' '}
                {sharedByDisplayName}
              </>
            )}
            ! Join the challenge below.
          </ThankYouMessage>
          <CloseMessageIconWrapper>
            <IconButton
              aria-label="Close"
              onClick={() => setIsClosing(true)}
              size="large"
            >
              <span className="u-cursor--pointer">
                <Close sx={{ color: '#999', width: 24, height: 24 }} />
              </span>
            </IconButton>
          </CloseMessageIconWrapper>
        </ThankYouMessageWrapper>
      </ThanksForViewingInnerWrapper>
    </ThanksForViewingOuterWrapper>
  );
};
ThanksForViewingChallenge.propTypes = {
  sharedByDisplayName: PropTypes.string,
};

const CloseMessageIconWrapper = styled.div`
  background: none;
  border: none;
  display: flex;
  justify-content: flex-end;
`;

const ThanksForViewingInnerWrapper = styled.div`
  width: 500px;
  max-height: ${(props) => (props.isClosing ? '0' : '300px')};
  border-radius: 20px;
  filter: drop-shadow(4px 4px 10px rgba(222,222,222,2));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: white;
  padding: ${(props) => (props.isClosing ? '0' : '0px 10px 10px')};
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              padding 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${(props) => (props.isClosing ? 0 : 1)};
  transform: ${(props) => (props.isClosing ? 'translateY(-20px)' : 'translateY(0)')};
`;

const ThanksForViewingOuterWrapper = styled.div`
  max-height: ${(props) => (props.isClosing ? '0' : '400px')};
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: ${(props) => (props.isClosing ? '0' : '0px 0px 30px')};
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              padding 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              margin-bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${(props) => (props.isClosing ? 0 : 1)};
  margin-bottom:  ${(props) => (props.isClosing ? '0' : '5px')};
  z-index: 100;
  position: relative;
`;

const ThankYouMessage = styled.p`
  font-size: large;
  text-align: left;
  font-family: Poppins;
  font-weight: 500;
  text-decoration: none;
`;

const ThankYouMessageWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;
export default ThanksForViewingChallenge;



