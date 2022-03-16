import React from 'react';
import PropTypes from 'prop-types';
import styled from '@mui/material/styles/styled';
import withTheme from '@mui/styles/withTheme';
import withStyles from '@mui/styles/withStyles';
import { ArrowForward } from '@mui/icons-material';
import { renderLog } from '../../common/utils/logging';


class ShowMoreFooter extends React.Component {
  render () {
    renderLog('ShowMoreFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, hideArrow, showMoreId, showMoreLink, textAlign } = this.props;

    let { showMoreText } = this.props;
    if (!showMoreText) {
      showMoreText = 'Show more';
    }
    const cleanTextAlign = (textAlign !== undefined && (typeof textAlign === 'string' || textAlign instanceof String)) ? textAlign : '';

    return (
      <ShowMoreFooterStyled id={showMoreId} onClick={showMoreLink} textalign={cleanTextAlign}>
        <ShowMoreFooterText textalign={cleanTextAlign}>
          { showMoreText }
          {!hideArrow && (
            <>
              {' '}
              <ArrowForward classes={{ root: classes.cardFooterIconRoot }} />
            </>
          )}
        </ShowMoreFooterText>
      </ShowMoreFooterStyled>
    );
  }
}
ShowMoreFooter.propTypes = {
  classes: PropTypes.object,
  hideArrow: PropTypes.bool,
  showMoreId: PropTypes.string.isRequired,
  showMoreLink: PropTypes.func.isRequired,
  showMoreText: PropTypes.string,
  textAlign: PropTypes.string,
};

const styles = (theme) => ({
  cardFooterIconRoot: {
    fontSize: 16,
    margin: '0 0 .1rem .3rem',
    [theme.breakpoints.down('xl')]: {
      marginBottom: '.2rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 18,
    },
  },
});

const ShowMoreFooterStyled = styled('div')`
  border: 0px !important;
  color: #2e3c5d;
  cursor: pointer;
  display: block !important;
  background: #fff !important;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0px !important;
  margin-top: 0px !important;
  padding: 0px !important;
  text-align: ${({ textAlign }) => (textAlign ? { textAlign } : 'right')} !important;
  user-select: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
  }
  &:hover {
    background-color: rgba(46, 60, 93, 0.15) !important;
    transition-duration: .2s;
  }
  @media print{
    display: none;
  }
`;

const ShowMoreFooterText = styled('div')`
  margin-top: 8px !important;
  padding: 8px !important;
  padding-bottom: 0px !important;
  text-align: ${({ textAlign }) => (textAlign ? { textAlign } : 'right')} !important;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    white-space: nowrap;
  }
  &:hover {
    text-decoration: underline;
  }
`;

export default withTheme(withStyles(styles)(ShowMoreFooter));



