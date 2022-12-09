import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';

class LoadMoreItemsManually extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('LoadMoreItemsManually');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, loadMoreFunction, uniqueExternalId } = this.props;

    let { loadMoreText } = this.props;
    if (!loadMoreText) {
      loadMoreText = 'Show more';
    }

    return (
      <LoadMoreItemsStyled>
        <Button
          classes={{ root: classes.buttonRoot }}
          color="primary"
          id={`loadMoreItems-${uniqueExternalId}`}
          variant="outlined"
          onClick={loadMoreFunction}
        >
          { loadMoreText }
        </Button>
      </LoadMoreItemsStyled>
    );
  }
}
LoadMoreItemsManually.propTypes = {
  classes: PropTypes.object,
  loadMoreFunction: PropTypes.func.isRequired,
  loadMoreText: PropTypes.string,
  uniqueExternalId: PropTypes.string,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 18,
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 400,
    },
  },
});

const LoadMoreItemsStyled = styled('div')`
  display: flex;
  justify-content: center;
  margin: 15px 0;
  width: 100%;
  @media print{
    display: none;
  }
`;

export default withTheme(withStyles(styles)(LoadMoreItemsManually));

