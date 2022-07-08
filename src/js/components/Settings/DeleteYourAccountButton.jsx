import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';


class DeleteYourAccountButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      deleteAllDataConfirm: false,
    };
  }

  componentDidMount () {
  }

  deleteAllData = () => {
    const deleteVoterAccount = true;
    VoterActions.voterAccountDelete(deleteVoterAccount);
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
    const { deleteAllDataConfirm } = this.state;
    return (
      <>
        {deleteAllDataConfirm && (
          <DeleteAllConfirmText>
            Are you 100% sure you want to delete your account, and all of your data?
            Once you click this button there is no way to recover any of the following information:
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
                  onClick={this.deleteAllData}
                  style={{
                    backgroundColor: 'red',
                    boxShadow: 'none !important',
                    textTransform: 'none',
                  }}
                  variant="contained"
                >
                  Permanently delete all of your data
                </Button>
              </DeleteYourAccountButtonInnerWrapper>
              <DeleteYourAccountButtonInnerCancelWrapper>
                <Button
                  classes={{ root: classes.deleteAllDataCancelLink }}
                  onClick={this.deleteAllDataConfirmToggle}
                >
                  Cancel
                </Button>
              </DeleteYourAccountButtonInnerCancelWrapper>
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
              <div className={leftAlign ? '' : 'u-no-break'}>
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
