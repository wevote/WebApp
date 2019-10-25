import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { renderLog } from '../../utils/logging';


class BallotSummaryAccordionSection extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object,
  };

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
              <IconButton
                classes={{ root: classes.iconButtonRoot }}
              >
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

const styles = () => ({
  iconButtonRoot: {
    padding: 0,
    borderRadius: 3,
    border: '1px solid #ddd',
    height: 25,
    width: 25,
  },
});

const AccordionWrapper = styled.div`
  background: none;
  padding: 0 16px;
`;

const AccordionBorderWrapper = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 16px 0;
`;

const AccordionTitle = styled.div`
  font-weight: ${props => (props.isOpen ? 600 : 500)};
  font-size: 16px;
  width: 100%;
`;

const AccordionBody = styled.div`
  font-size: 13px;
  padding-top: 8px;
`;

export default withStyles(styles)(BallotSummaryAccordionSection);
