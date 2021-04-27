import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Ballot } from '@material-ui/icons';
import { Typography, Button } from '@material-ui/core';
import styled from 'styled-components';
import BallotStore from '../../stores/BallotStore';
import { renderLog } from '../../utils/logging';

class BallotShowAllItemsFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.setState({
      ballot: BallotStore.ballot,
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  onBallotStoreChange () {
    this.setState({
      ballot: BallotStore.ballot,
    });
  }

  jumpToNewSection = () => {
    if (this.props.setActiveRaceItem) {
      this.props.setActiveRaceItem();
    }
    window.scrollTo(0, 0);
  }

  render () {
    renderLog('BallotShowAllItemsFooter');  // Set LOG_RENDER_EVENTS to log all renders

    const { ballot } = this.state;
    const { classes } = this.props;
    if (ballot && ballot.length > 0) {
      return (
        <div className={classes.card}>
          <div className={classes.cardBody}>
            <Typography id="ballotSummaryFooter-showMoreBallotItems" variant="h2" classes={{ root: classes.typography }}>
              <Ballot className={classes.icon} location={window.location} />
              Show All Ballot Items
            </Typography>
            <Row className="row">
              <Button onClick={() => this.jumpToNewSection()} variant="outlined" classes={{ root: classes.button }}>
                Show all Ballot Items
              </Button>
            </Row>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
BallotShowAllItemsFooter.propTypes = {
  classes: PropTypes.object,
  setActiveRaceItem: PropTypes.func,
};

const styles = (theme) => ({
  typography: {
    padding: '16px 0',
    fontWeight: 600,
    fontSize: 18,
    [theme.breakpoints.down('lg')]: {
      padding: '12px 0',
    },
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '0px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12)',
    marginBottom: '16px',
    [theme.breakpoints.down('md')]: {
      marginLeft: '-16px',
      marginRight: '-16px',
    },
    overflowY: 'none',
    border: 'none',
  },
  cardBody: {
    padding: '20px',
  },
  icon: {
    marginRight: 12,
    color: '#2E3C5D',
    fontSize: 32,
  },
});

const Row = styled.div`
  margin: 0 !important;
`;

export default withStyles(styles)(BallotShowAllItemsFooter);
