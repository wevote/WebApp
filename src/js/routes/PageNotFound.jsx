import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Ballot } from '@material-ui/icons';
import { Button, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../utils/logging';
import { historyPush, isCordova } from '../utils/cordovaUtils';

class PageNotFound extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  static getProps () {
    return {};
  }

  render () {
    renderLog('PageNotFound');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    return (
      <div className="page-content-container">
        <div className="container-fluid">
          <Helmet title="Page Not Found - We Vote" />
          <Wrapper cordova={isCordova()}>
            <Card>
              <EmptyBallotMessageContainer>
                <EmptyBallotText>Page not found.</EmptyBallotText>
                <Button
                  classes={{ root: classes.ballotButtonRoot }}
                  color="primary"
                  variant="contained"
                  onClick={() => historyPush('/ballot')}
                >
                  <Ballot classes={{ root: classes.ballotButtonIconRoot }} />
                  Go to Ballot
                </Button>
              </EmptyBallotMessageContainer>
            </Card>
          </Wrapper>
        </div>
      </div>
    );
  }
}

const Wrapper = styled.div`
  @media (max-width: ${({ theme, cordova }) => (cordova ? undefined : theme.breakpoints.md)}) {
    margin: 1em 0;
  }
`;

const EmptyBallotMessageContainer = styled.div`
  padding: 3em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyBallotText = styled.p`
  font-size: 24px;
  text-align: center;
  margin: 1em 2em 3em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em;
  }
`;

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

export default withStyles(styles)(PageNotFound);
