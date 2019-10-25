import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { renderLog } from '../../utils/logging';


class ShowMoreFooter extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    showMoreId: PropTypes.string.isRequired,
    showMoreLink: PropTypes.func.isRequired,
    showMoreText: PropTypes.string,
  };

  render () {
    renderLog('ShowMoreFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showMoreId, showMoreLink } = this.props;

    let { showMoreText } = this.props;
    if (!showMoreText) {
      showMoreText = 'Show more';
    }

    return (
      <ShowMoreFooterStyled id={showMoreId} onClick={showMoreLink}>
        <ShowMoreFooterText>
          { showMoreText }
          {' '}
          <ArrowForwardIcon classes={{ root: classes.cardFooterIconRoot }} />
        </ShowMoreFooterText>
      </ShowMoreFooterStyled>
    );
  }
}

const styles = theme => ({
  cardFooterIconRoot: {
    fontSize: 16,
    margin: '0 0 .1rem .3rem',
    [theme.breakpoints.down('lg')]: {
      marginBottom: '.2rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 18,
    },
  },
});

const ShowMoreFooterStyled = styled.div`
  color: #4371cc;
  font-size: 16px;
  text-align: center;
  user-select: none;
  cursor: pointer;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-top: 5px;
    padding-bottom: 3px;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: #f8f8f8;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
  }
  &:hover {
    background-color: #eee;
  }
  @media print{
    display: none;
  }
`;

const ShowMoreFooterText = styled.div`
  &:hover {
    text-decoration: underline;
  }
`;

export default withTheme(withStyles(styles)(ShowMoreFooter));



