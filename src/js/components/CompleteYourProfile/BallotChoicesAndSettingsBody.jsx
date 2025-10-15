import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { renderLog } from '../../common/utils/logging';

//const CandidateItem = React.lazy(() => import(/* webpackChunkName: 'CandidateItem' */ '../Ballot/CandidateItem'));

class BallotChoicesAndSettingsBody extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render() {
    renderLog('BallotChoicesAndSettingsBody');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.settingsSection}>
          <h3>1. Do you want to know how your personal data is being stored?</h3>
          <Button
            variant="text"
            color="primary"
            href="https://help.wevote.us/hc/en-us/articles/360034759253-How-are-you-using-my-personal-data-What-protections-do-you-guarantee-me"
            className={classes.settingsLink}
          >
            How are you using my personal data? What protections do you guarantee me?
          </Button>
        </div>

        <div className={classes.settingsSection}>
          <h3>2. Do you want to remove all your data and voting references?</h3>
          <Button
            variant="text"
            color="primary"
            href="https://help.wevote.us/hc/en-us/articles/360041733393-How-do-I-remove-all-of-my-data-and-voting-preferences"
            className={classes.settingsLink}
          >
            How do I remove all of my data and voting preferences?
          </Button>
        </div>

        <div className={classes.settingsSection}>
          <h3>3. Do you want to edit your profile?</h3>
          <p>Click on the head icon/your profile photo on the top</p>
        </div>
      </div>
    );
  }
}

BallotChoicesAndSettingsBody.propTypes = {
  classes: PropTypes.object,
  inModal: PropTypes.bool,
  //markPersonalizedScoreIntroCompleted: PropTypes.func,
  // show: PropTypes.bool,
  //stepAdvanced: PropTypes.func,
  //toggleFunction: PropTypes.func,
};


const styles = () => ({
  root: {
    padding: '24px',
  },
  settingsSection: {
    marginBottom: '24px',
    '& h3': {
      fontSize: '18px',
      marginBottom: '12px',
      fontWeight: 500,
    },
    '& p': {
      marginTop: '8px',
      color: '#555',
    },
  },
  settingsLink: {
    textTransform: 'none',
    textAlign: 'left',
    justifyContent: 'flex-start',
    padding: '4px 0',
  },
});

export default withTheme(withStyles(styles)(BallotChoicesAndSettingsBody));
