import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../common/components/Style/Colors';
// import DesignTokenColors from '../../common/components/Style/DesignTokenColors';  // 2024-04-16 Upgrade to using this

const StepIcon = ({ number, completed }) => (
  <StepIconContainer completed={completed}>
    {!completed && <p>{ number }</p>}

    {completed && (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M9.625 14.7221L6.1875 11.2839L7.15894 10.3125L9.625 12.7779L14.8397 7.5625L15.8125 8.53531L9.625 14.7221Z" fill="#007800" />
      <path d="M11 1.375C9.09636 1.375 7.23546 1.9395 5.65264 2.99711C4.06982 4.05471 2.83616 5.55793 2.10766 7.31667C1.37917 9.07541 1.18856 11.0107 1.55995 12.8777C1.93133 14.7448 2.84802 16.4598 4.1941 17.8059C5.54018 19.152 7.25519 20.0687 9.12226 20.4401C10.9893 20.8114 12.9246 20.6208 14.6833 19.8923C16.4421 19.1638 17.9453 17.9302 19.0029 16.3474C20.0605 14.7645 20.625 12.9036 20.625 11C20.625 8.44729 19.6109 5.99913 17.8059 4.1941C16.0009 2.38906 13.5527 1.375 11 1.375ZM11 19.25C9.36831 19.25 7.77326 18.7661 6.41655 17.8596C5.05984 16.9531 4.00242 15.6646 3.378 14.1571C2.75358 12.6496 2.5902 10.9908 2.90853 9.3905C3.22685 7.79016 4.01259 6.32015 5.16637 5.16637C6.32016 4.01259 7.79017 3.22685 9.39051 2.90852C10.9909 2.59019 12.6497 2.75357 14.1571 3.37799C15.6646 4.00242 16.9531 5.05984 17.8596 6.41655C18.7661 7.77325 19.25 9.3683 19.25 11C19.25 13.188 18.3808 15.2865 16.8336 16.8336C15.2865 18.3808 13.188 19.25 11 19.25Z" fill="#007800" />
    </svg>
    )}
  </StepIconContainer>
);

StepIcon.propTypes = {
  number: PropTypes.number,
  completed: PropTypes.bool,
};

const StepIconContainer = styled('div')`
 ${({ completed }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${completed ? 'initial' : Colors.primary2024};
 `}

&& p {
    color: ${Colors.white};
    font-size: 12px;
    font-weight: 700;
    margin: 0;
}
`;

export default StepIcon;
