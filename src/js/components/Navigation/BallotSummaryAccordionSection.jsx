import { IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';


class BallotSummaryAccordionSection extends Component {
  onClick = () => {
    this.props.onClick(this.props.label);
  };

  render () {
    renderLog('BallotSummaryAccordionSection');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      onClick,
      props: { isOpen, label, classes },
    } = this;

    return (
      <AccordionWrapper>
        <AccordionBorderWrapper>
          <AccordionTitle isOpen={!!isOpen} onClick={onClick} style={{ cursor: 'pointer' }}>
            {label}
            <div style={{ float: 'right' }}>
              <IconButton classes={{ root: classes.iconButtonRoot }} size="large">
                {isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
              </IconButton>
            </div>
          </AccordionTitle>
          {isOpen && (
            <AccordionBody>
              {this.props.children}
            </AccordionBody>
          )}
        </AccordionBorderWrapper>
      </AccordionWrapper>
    );
  }
}
BallotSummaryAccordionSection.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const styles = () => ({
  iconButtonRoot: {
    padding: 0,
    borderRadius: 3,
    border: '1px solid #ddd',
    height: 25,
    width: 25,
  },
});

const AccordionWrapper = styled('div')`
  background: none;
  padding: 0 16px;
`;

const AccordionBorderWrapper = styled('div')`
  border-bottom: 1px solid #ddd;
  padding: 16px 0;
`;

const AccordionTitle = styled('div', {
  shouldForwardProp: (prop) => !['isOpen'].includes(prop),
})(({ isOpen }) => (`
  font-weight: ${isOpen ? 600 : 500};
  font-size: 16px;
  width: 100%;
`));

const AccordionBody = styled('div')`
  font-size: 13px;
  padding-top: 8px;
`;

export default withStyles(styles)(BallotSummaryAccordionSection);
