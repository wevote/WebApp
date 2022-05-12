import { Ballot } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';

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
        <BallotShowAllItemsFooterWrapper>
          <ContentBody>
            <Typography id="ballotSummaryFooter-showMoreBallotItems" variant="h2" classes={{ root: classes.typography }}>
              <Ballot className={classes.icon} location={window.location} />
              Show All Ballot Items
            </Typography>
            <Button onClick={() => this.jumpToNewSection()} variant="outlined" classes={{ root: classes.button }}>
              Show all
            </Button>
          </ContentBody>
        </BallotShowAllItemsFooterWrapper>
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
  icon: {
    marginRight: 12,
    color: '#2E3C5D',
    fontSize: 32,
  },
});

const BallotShowAllItemsFooterWrapper = styled('div')(({ theme }) => (`
  background-color: #fff;
  border: none;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  overflow-y: none;
  ${theme.breakpoints.down('md')} {
      margin-left: -16px;
      margin-right: -16px;
  }
`));

const ContentBody = styled('div')`
  align-items: center;
  flex-direction: column;
  display: flex;
  justify-content: center;
`;

export default withStyles(styles)(BallotShowAllItemsFooter);
