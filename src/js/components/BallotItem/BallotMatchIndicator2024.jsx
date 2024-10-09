import PropTypes from "prop-types";
import React from "react";
import { renderLog } from "../../common/utils/logging";
import styled from "styled-components";
import DesignTokenColors from "../../common/components/Style/DesignTokenColors";

export default function BallotMatchIndicator2024({
  isBestMatch,
  isGoodMatch,
  isFairMatch,
  isPoorMatch,
  isItAMatch,
  noData,
}) {

  renderLog("BallotMatchIndicator2024 functional component");

  const getBackgroundColor = () => {
    if (isBestMatch) {
      return DesignTokenColors.confirmation600; // Dark Green
    } else if (isGoodMatch || isFairMatch) {
      return DesignTokenColors.confirmation50; // Light Green
    } else if (isPoorMatch) {
      return DesignTokenColors.alert50; // Light Red
    } else if (isItAMatch || noData) {
      return DesignTokenColors.neutral50; // Light Grey
    } else {
      return "transparent"; // Default background color
    }
  };

  const getTextColor = () => {
    if (isBestMatch) {
      return "white"; // White text
    } else if (isGoodMatch || isFairMatch) {
      return DesignTokenColors.confirmation800; // Dark Green
    } else if (isPoorMatch) {
      return DesignTokenColors.alert700; // Dark Red
    } else if (isItAMatch || noData) {
      return DesignTokenColors.neutral700; // Black
    } else {
      return "inherit"; // Default text color
    }
  };

  const getBorderColor = () => {
    if (isGoodMatch || isFairMatch) {
      return DesignTokenColors.confirmation100; // Medium Green
    } else if (isPoorMatch) {
      return DesignTokenColors.alert100; // Medium Red
    } else if (isItAMatch || noData) {
      return DesignTokenColors.neutral100; // Medium Grey
    } else {
      return "transparent"; // Default border color
    }
  };

  const getMatchLabel = () => {
    if (isBestMatch)
      return (
        <span>
          <BoldText>Best Match</BoldText>
        </span>
      );
    if (isGoodMatch)
      return (
        <span>
          <BoldText>Good Match</BoldText>
        </span>
      );
    if (isFairMatch)
      return (
        <span>
          <BoldText>Fair Match</BoldText>
        </span>
      );
    if (isPoorMatch)
      return (
        <span>
          <BoldText>Poor Match</BoldText>
        </span>
      );
    if (isItAMatch)
      return (
        <span>
          Is it a <BoldText>Match?</BoldText>
        </span>
      );
    if (noData)
      return (
        <span>
          <BoldText>No Data</BoldText>
        </span>
      );
    return "";
  };

  return (
    <StyledButton
      backgroundColor={getBackgroundColor()}
      textColor={getTextColor()}
      borderColor={getBorderColor()}
    >
      {getMatchLabel()}
    </StyledButton>
  );
}

BallotMatchIndicator2024.propTypes = {
  isBestMatch: PropTypes.bool,
  isGoodMatch: PropTypes.bool,
  isFairMatch: PropTypes.bool,
  isPoorMatch: PropTypes.bool,
  isItAMatch: PropTypes.bool,
  noData: PropTypes.bool,
};

// Default props to avoid undefined values
BallotMatchIndicator2024.defaultProps = {
  isBestMatch: false,
  isGoodMatch: false,
  isFairMatch: false,
  isPoorMatch: false,
  isItAMatch: false,
  noData: false,
};

const StyledButton = styled("div")`
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ textColor }) => textColor};
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid ${({ borderColor }) => borderColor};
  font-size: 10px;
  display: inline-flex;
  justify-content: center; // Centers text horizontally
  align-items: center; // Centers text vertically
  min-width: 72px;
  cursor: default;
`;

const BoldText = styled.span`
  font-weight: bold;
`;
