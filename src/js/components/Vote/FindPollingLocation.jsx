import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { Place } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';

class FindPollingLocation extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { classes } = this.props;
    const getPollingLocationUrl = 'https://gttp.votinginfoproject.org/';
    return (
      <Wrapper>
        <OpenExternalWebSite
          url={getPollingLocationUrl}
          target="_blank"
          className="u-gray-mid"
          body={(
            <Button
              classes={{ root: classes.ballotButtonRoot }}
              color="primary"
              variant="contained"
            >
              <Place classes={{ root: classes.ballotButtonIconRoot }} />
              Your Polling Location
            </Button>
          )}
        />
        <InformationTextWrapper className="social-btn-description u-show-desktop">
          <i className="fas fa-info-circle" />
          Find the location where you can hand deliver your official ballot before the end of election day.
        </InformationTextWrapper>
      </Wrapper>
    );
  }
}

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
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  iconRoot: {
    color: '#fff',
    fontSize: 36,
    margin: 'auto 10px',
  },
});

const Wrapper = styled.div`
  margin-bottom: 15px;
  @media print{
    display: none;
  }
`;

const InformationTextWrapper = styled.div`
  margin: 10px 0;
  word-wrap: break-word;
  float: left;
  text-align: left;
  color: #555;
  font-size: 14px;
`;

export default withStyles(styles)(FindPollingLocation);
