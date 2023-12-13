import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../common/components/Style/Colors';

const StyledButton = styled.button`
/* Default styles */
color: ${colors.white};
font-weight: 600;
border-radius: 4px;
aria-label: "Button";
border: none;
cursor: pointer;

&:focus {
  outline: 2px solid ${colors.primary} !important;
  outline-offset: 2px;
}

/* Hover state */
&:hover {
  background-color: ${colors.primaryHover};
}

/* Primary styles */
${(props) => props.primary && `
  background-color: ${colors.primary};
  color: white;
`}

/* Primary Disabled styles */
${(props) => !props.primary && `
  background-color: ${colors.lightGrey};
  color: ${colors.grey};
  cursor: not-allowed;

  &:hover {
    background-color: ${colors.lightGrey};
    color: ${colors.grey};
  }
`}

/* Secondary styles */
  ${(props) => props.secondary && `
  background-color: transparent;
  color: ${colors.grey};

  &:hover {
    background-color: ${colors.secondaryHover};
    color: ${colors.primary}};
    cursor: pointer;
  }
    `}

  /* Size styles */
  ${(props) => props.size === 'small' && `
    font-size: 12px;
    padding: 6px;
    width: 150px;
  `}
  ${(props) => props.size === 'medium' && `
    font-size: 16px;
    padding: 10px;
    width: 350px;
  `}
  ${(props) => props.size === 'large' && `
    font-size: 18px;
    padding: 15px;
    width: 450px;
  `}
`;

const Button = ({ primary, size, label, onClick, ...props }) => (
  <StyledButton
    primary={primary === true}
    size={size}
    aria-label={label}
    onClick={onClick}
    {...props}
  >
    
export default Button;
Button.propTypes = {
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  primary: false,
  size: 'medium',
  onClick: undefined,
};
