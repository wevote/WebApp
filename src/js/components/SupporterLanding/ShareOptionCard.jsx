import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ShareOptionButton from './ShareOptionButton';

// A white card holding one or two share options side by side.
export default function ShareOptionCard ({ options, onShare }) {
  return (
    <Card>
      {options.map((option) => (
        <ShareOptionButton
          key={option.key}
          label={option.label}
          icon={option.icon}
          brand={option.brand}
          onClick={onShare}
        />
      ))}
    </Card>
  );
}
ShareOptionCard.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    brand: PropTypes.string,
  })),
  onShare: PropTypes.func,
};

const Card = styled.div`
  align-items: stretch;
  background: ${DesignTokenColors.whiteUI};
  border-radius: 12px;
  display: flex;
  gap: 8px;
  padding: 16px 14px;

  @media (max-width: 575px) {
    gap: 4px;
    padding: 14px 8px;
  }
`;
