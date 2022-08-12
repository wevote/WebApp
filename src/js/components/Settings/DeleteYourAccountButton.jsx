import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import historyPush from '../../common/utils/historyPush';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';


class DeleteYourAccountButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      deleteAllDataConfirm: false,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('ReadyTaskBallot, onVoterStoreChange voter: ', VoterStore.getVoter());
    const voterDeleted = VoterStore.getVoterDeleted();
    if (voterDeleted) {
      historyPush({
        pathname: '/ready',   // SnackNotifier that SHOULD handle this is in Friends or Values
        state: {
          message: 'All profile information deleted.',
          severity: 'success',
        },
      });
    }
  }

  deleteAllData = () => {
    const deleteVoterAccount = true;
    VoterActions.voterAccountDelete(deleteVoterAccount);
    this.setState({
      deletingAllDataNow: true,
    });
  }

  deleteAllDataConfirmToggle = () => {
    const { deleteAllDataConfirm } = this.state;
    this.setState({
      deleteAllDataConfirm: !deleteAllDataConfirm,
    });
  }

  render () {
    renderLog('DeleteYourAccountButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, leftAlign, textSizeSmall } = this.props;
    const { deleteAllDataConfirm, deletingAllDataNow } = this.state;
    return (
      <>
        {deleteAllDataConfirm && (
          <DeleteAllConfirmText>
            Are you 100% sure you want to delete your account, and all of your data?
            Once you click this button there is no way to cancel or recover any of the following information:
            <ul>
              <li>How you plan to vote</li>
              <li>How you have voted in the past</li>
              <li>Who your friends are</li>
            </ul>
            Please contact us by clicking &apos;Help&apos; if you have any questions.
          </DeleteAllConfirmText>
        )}
        <DeleteYourAccountButtonOuterWrapper leftAlign={leftAlign}>
          {deleteAllDataConfirm ? (
            <div className={leftAlign ? '' : 'full-width'}>
              <DeleteYourAccountButtonInnerWrapper leftAlign={leftAlign}>
                <Button
                  color="primary"
                  disabled={deletingAllDataNow}
                  onClick={this.deleteAllData}
                  style={{
                    backgroundColor: 'red',
                    boxShadow: 'none !important',
                    textTransform: 'none',
                  }}
                  variant="contained"
                >
                  {deletingAllDataNow ? 'Deleting all of your data now...' : 'Permanently delete all of your data'}
                </Button>
              </DeleteYourAccountButtonInnerWrapper>
              {!deletingAllDataNow && (
                <DeleteYourAccountButtonInnerCancelWrapper>
                  <Button
                    classes={{ root: classes.deleteAllDataCancelLink }}
                    onClick={this.deleteAllDataConfirmToggle}
                  >
                    Cancel
                  </Button>
                </DeleteYourAccountButtonInnerCancelWrapper>
              )}
            </div>
          ) : (
            <Button
              classes={{ root: classes.deleteAllDataLink }}
              style={textSizeSmall ? {
                fontSize: 14,
              } : {
                fontSize: 16,
              }}
              onClick={this.deleteAllDataConfirmToggle}
            >
              <div className={leftAlign ? '' : 'u-no-break'} style={isCordova() || isMobileScreenSize() ? { paddingLeft: 11 } : {}}>
                You can
                {' '}
                <span className="u-link-color u-link-color-on-hover">
                  delete your account and all of your data
                </span>
                {' '}
                at any time.
              </div>
            </Button>
          )}
        </DeleteYourAccountButtonOuterWrapper>
      </>
    );
  }
}
DeleteYourAccountButton.propTypes = {
  classes: PropTypes.object,
  leftAlign: PropTypes.bool,
  textSizeSmall: PropTypes.bool,
};

const styles = () => ({
  deleteAllDataCancelLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
  deleteAllDataLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 0,
    padding: 0,
    textTransform: 'none',
  },
});

const DeleteAllConfirmText = styled('div')`
  color: #999;
  margin-bottom: 12px;
`;

const DeleteYourAccountButtonInnerCancelWrapper = styled('div')`
  display: flex;
  justify-content:center;
  margin-bottom: 8px;
  width: 100%;
`;

const DeleteYourAccountButtonInnerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['leftAlign'].includes(prop),
})(({ leftAlign }) => (`
  display: flex;
  justify-content: ${leftAlign ? 'flex-start' : 'center'};
  width: 100%;
`));

const DeleteYourAccountButtonOuterWrapper = styled('div', {
  shouldForwardProp: (prop) => !['leftAlign'].includes(prop),
})(({ leftAlign }) => (`
  display: flex;
  justify-content: ${leftAlign ? 'flex-start' : 'center'};
  width: 100%;
`));

export default withStyles(styles)(DeleteYourAccountButton);
