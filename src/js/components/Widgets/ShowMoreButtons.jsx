import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';


class ShowMoreButtons extends React.Component {
  render () {
    renderLog('ShowMoreButtons');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showLessCustomText, showMoreButtonsLink, showMoreButtonWasClicked, showMoreCustomText, showMoreId } = this.props;
    let showMoreText;

    if (showMoreButtonWasClicked) {
      showMoreText = showLessCustomText || 'show less';
    } else {
      showMoreText = showMoreCustomText || 'show more';
    }

    return (
      <ShowMoreButtonsStyled className="card-child" id={`toggleContentButton-${showMoreId}`} onClick={showMoreButtonsLink}>
        <ShowMoreButtonsText>
          { showMoreText }
          {' '}
          {showMoreButtonWasClicked ? (
            <ArrowDropUp
              classes={{ root: classes.cardFooterIconRoot }}
            />
          ) : (
            <ArrowDropDown
              classes={{ root: classes.cardFooterIconRoot }}
            />
          )}
        </ShowMoreButtonsText>
      </ShowMoreButtonsStyled>
    );
  }
}
ShowMoreButtons.propTypes = {
  classes: PropTypes.object,
  showLessCustomText: PropTypes.string,
  showMoreId: PropTypes.string.isRequired,
  showMoreButtonsLink: PropTypes.func.isRequired,
  showMoreButtonWasClicked: PropTypes.bool,
  showMoreCustomText: PropTypes.string,
};

const styles = (theme) => ({
  cardFooterIconRoot: {
    fontSize: 30,
    marginBottom: '.2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
  },
});

const ShowMoreButtonsStyled = styled('button')(({ theme }) => (`
  border: 0 !important;
  color: #206DB3;
  cursor: pointer;
  display: block !important;
  background: #fff !important;
  // font-size: 18px;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
  text-align: center !important;
  user-select: none;
  width: fit-content;
  ${theme.breakpoints.up('md')} {
    font-size: 16px;
  }
  &:hover {
    background-color: rgba(46, 60, 93, 0.15) !important;
    transition-duration: .2s;
  }
  @media print{
    display: none;
  }
`));

const ShowMoreButtonsText = styled('div')`
  margin: 8px 0 0 8px !important;
  padding: 0 !important;
  text-align: center !important;
  &:hover {
    text-decoration: underline;
  }
`;

export default withTheme(withStyles(styles)(ShowMoreButtons));



