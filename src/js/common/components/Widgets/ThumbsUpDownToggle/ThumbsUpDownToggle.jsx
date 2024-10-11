import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { styled, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import DesignTokenColors from '../../Style/DesignTokenColors';
import ThumbsUpDownToggleIcon from './ThumbsUpDownToggleIcon';
import numberAbbreviate from '../../../utils/numberAbbreviate';

function ThumbsUpDownToggle ({ classes }) {
  const [thumbsUpAmountLocal, setThumbsUpAmountLocal] = useState(9000);
  const [thumbsDownAmountLocal, setThumbsDownAmountLocal] = useState(9990);
  const [supports, setSupports] = useState(false);
  const [opposes, setOpposes] = useState(false);

  const handleThumbsUpClick = () => {
    if (!supports) {
      if (!opposes) {
        setSupports(true);
        setThumbsUpAmountLocal((prevAmountLocal) => prevAmountLocal + 1);
      } else {
        setSupports(true);
        setOpposes(false);
        setThumbsUpAmountLocal((prevAmountLocal) => prevAmountLocal + 1);
        setThumbsDownAmountLocal((prevAmountLocal) => prevAmountLocal - 1);
      }
    }
    if (supports) {
      setSupports(false);
      setThumbsUpAmountLocal((prevAmountLocal) => prevAmountLocal - 1);
    }
  };

  const handleThumbsDownClick = () => {
    if (!opposes) {
      if (!supports) {
        setOpposes(true);
        setThumbsDownAmountLocal((prevAmountLocal) => prevAmountLocal + 1);
      } else {
        setOpposes(true);
        setSupports(false);
        setThumbsUpAmountLocal((prevAmountLocal) => prevAmountLocal - 1);
        setThumbsDownAmountLocal((prevAmountLocal) => prevAmountLocal + 1);
      }
    }
    if (opposes) {
      setOpposes(false);
      setThumbsDownAmountLocal((prevAmountLocal) => prevAmountLocal - 1);
    }
  };

  const handleThumbsUpToolTipMessage = () => {
    if (opposes) {
      return (
        <>
          <p>
            Favorited by
            {' '}
            {thumbsUpAmountLocal}
            {' '}
            people
          </p>
          <p>Favoriting helps us show you what other candidates match your values</p>
        </>
      );
    } if (supports) {
      return 'Remove Favorite';
    } else {
      return 'Favoriting helps us show you what other candidates match your values.';
    }
  };

  const handleThumbsDownToolTipMessage = () => {
    if (opposes) {
      return 'Remove Dislike';
    } else {
      return (
        <>
          <p>
            Disliked by
            {' '}
            {thumbsDownAmountLocal}
            {' '}
            people
          </p>
          <p>Disliking helps us show you what other candidates match your values</p>
        </>
      );
    }
  };

  return (
    <ThumbsUpThumbsDownContainer>
      <ThumbsContainer>
        <Tooltip
          placement="top-end"
          title={handleThumbsUpToolTipMessage()}
          classes={{ tooltip: classes.toolTip, arrow: classes.arrow }}
          arrow
        >
          <ThumbsUpClickableContainer onClick={handleThumbsUpClick}>
            <ThumbsUpDownToggleIcon isFavorite supports={supports} />
          </ThumbsUpClickableContainer>
        </Tooltip>
        <Amount className={opposes ? 'hidden' : ''}>{numberAbbreviate(thumbsUpAmountLocal)}</Amount>
      </ThumbsContainer>
      <ThumbsUpDownSeperator>&nbsp;</ThumbsUpDownSeperator>
      <ThumbsContainer>
        <Tooltip
          placement="top-start"
          title={handleThumbsDownToolTipMessage()}
          classes={{ tooltip: classes.toolTip, arrow: classes.arrow }}
          arrow
        >
          <ThumbsDownClickableContainer onClick={handleThumbsDownClick}>
            <ThumbsUpDownToggleIcon isDislike opposes={opposes} />
          </ThumbsDownClickableContainer>
        </Tooltip>
        <Amount className={!opposes ? 'hidden' : ''}>{numberAbbreviate(thumbsDownAmountLocal)}</Amount>
      </ThumbsContainer>
    </ThumbsUpThumbsDownContainer>
  );
}

ThumbsUpDownToggle.propTypes = {
  classes: PropTypes.object,
};

const ThumbsUpThumbsDownContainer = styled('div')`
  display: flex;
  max-width: 100px;
  justify-content: space-evenly;
`;

const ThumbsContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ThumbsUpClickableContainer = styled('button')`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

const ThumbsDownClickableContainer = styled('button')`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

const Amount = styled('span')`
  color: ${DesignTokenColors.neutral900};
  margin: 0 5px 0 5px;
  overflow: hidden;
  max-width: 200px;
  transition: max-width .3s ease-in-out, opacity 1s ease-in-out;

  &.hidden {
    max-width: 0px;
    opacity: 0;
  }
`;

const ThumbsUpDownSeperator = styled('div')`
  max-width: 1px;
  border-right: 1px solid ${DesignTokenColors.neutralUI100};
`;

const styles = () => ({
  toolTip: {
    backgroundColor: `${DesignTokenColors.neutral900}`,
    fontSize: '12px',
  },
  arrow: {
    color: `${DesignTokenColors.neutral900}`,
  },
});


export default withStyles(styles)(ThumbsUpDownToggle);
