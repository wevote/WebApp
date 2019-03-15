import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { renderLog } from '../../utils/logging';


class ShowMoreFooter extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    measureWeVoteId: PropTypes.string,
    showMoreLink: PropTypes.func.isRequired,
    showMoreText: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    const { showMoreLink, classes } = this.props;
    let { measureWeVoteId } = this.props;
    if (!measureWeVoteId) {
      measureWeVoteId = '';
    }

    let { showMoreText } = this.props;
    if (!showMoreText) {
      showMoreText = 'Show more';
    }

    return (
      <ShowMoreFooterStyled onClick={() => showMoreLink(measureWeVoteId)}>
        { showMoreText }
        {' '}
        <ArrowForwardIcon classes={{ root: classes.cardFooterIconRoot }} />
      </ShowMoreFooterStyled>
    );
  }
}

const styles = theme => ({
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .3rem',
    [theme.breakpoints.down('lg')]: {
      marginBottom: '.2rem',
    },
  },
});

const ShowMoreFooterStyled = styled.div`
  font-size: 12px;
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
  &:hover {
    background-color: #f8f8f8;
}
`;

export default withTheme()(withStyles(styles)(ShowMoreFooter));



