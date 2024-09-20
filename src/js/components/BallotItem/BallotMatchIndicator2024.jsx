import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import { Button } from '@mui/material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

export default function BallotMatchIndicator2024({ matchLevel }) {
    renderLog('BallotMatchIndicator2024 functional component');

    const getStyles = () => {
        switch (matchLevel) {
        case 'Best Match':
            return {
            backgroundColor: DesignTokenColors.confirmation600, // Dark Green
            color: 'white', // White
            };
        case 'Good Match':
        case 'Fair Match':
            return {
            backgroundColor: DesignTokenColors.confirmation50, // Light Green
            borderColor: DesignTokenColors.confirmation100, // Medium Green
            color: DesignTokenColors.confirmation800, // Dark Green
            };
        case 'Poor Match':
            return {
            backgroundColor: DesignTokenColors.alert50, // Light Red
            borderColor: DesignTokenColors.alert100, // Medium Red
            color: DesignTokenColors.alert700, // Dark Red
            };
        case 'Is it a Match?':
        case 'No Data':
            return {
            backgroundColor: DesignTokenColors.neutral50, // Light Grey
            borderColor: DesignTokenColors.neutral100, // Medium Grey
            color: DesignTokenColors.neutral700, // Black
            };
        default:
            return {};
        }
    };

    return (
        <Button
            variant="contained"
            disableElevation
            style={{
                // fix prop spreading
                ...getStyles(),
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '8px',
                border: `2px solid ${getStyles().borderColor || 'transparent'}`,
                fontWeight: 'bold',
                width: '200px',
                textTransform: 'none',
            }}
        >
        {matchLevel}
        </Button>
    );
}

// Add booleans for the different types

BallotMatchIndicator2024.propTypes = {
    isBestMatch: PropTypes.bool,
    matchLevel: PropTypes.oneOf([
        'Best Match',
        'Good Match',
        'Fair Match',
        'Poor Match',
        'Is it a Match?',
        'No Data',
    ]).isRequired,
};
