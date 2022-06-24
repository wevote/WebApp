import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';


class DeleteAllContactsButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      deleteAllContactsConfirm: false,
    };
  }

  componentDidMount () {
  }

  deleteAllContacts = () => {
    const deleteAllVoterContactEmails = true;
    VoterActions.voterContactListDelete(deleteAllVoterContactEmails);
  }

  deleteAllContactsConfirmToggle = () => {
    const { deleteAllContactsConfirm } = this.state;
    this.setState({
      deleteAllContactsConfirm: !deleteAllContactsConfirm,
    });
  }

  render () {
    renderLog('DeleteAllContactsButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { deleteAllContactsConfirm } = this.state;
    return (
      <DeleteContactsButtonOuterWrapper>
        {deleteAllContactsConfirm ? (
          <div className="full-width">
            <DeleteContactsButtonInnerWrapper>
              <Button
                color="primary"
                onClick={this.deleteAllContacts}
                style={{
                  backgroundColor: 'red',
                  boxShadow: 'none !important',
                  textTransform: 'none',
                  width: 300,
                }}
                variant="contained"
              >
                Permanently delete all contacts
              </Button>
            </DeleteContactsButtonInnerWrapper>
            <DeleteContactsButtonInnerCancelWrapper>
              <Button
                classes={{ root: classes.deleteAllContactsCancelLink }}
                onClick={this.deleteAllContactsConfirmToggle}
              >
                Cancel
              </Button>
            </DeleteContactsButtonInnerCancelWrapper>
          </div>
        ) : (
          <Button
            classes={{ root: classes.deleteAllContactsLink }}
            onClick={this.deleteAllContactsConfirmToggle}
          >
            <div className="u-no-break">
              You can
              {' '}
              <span className="u-link-color u-link-color-on-hover">
                delete contact information
              </span>
              {' '}
              at any time.
            </div>
          </Button>
        )}
      </DeleteContactsButtonOuterWrapper>
    );
  }
}
DeleteAllContactsButton.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  deleteAllContactsCancelLink: {
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
  deleteAllContactsLink: {
    boxShadow: 'none !important',
    color: '#999',
    fontSize: 14,
    marginTop: 0,
    padding: 0,
    textTransform: 'none',
    width: 250,
  },
});

const DeleteContactsButtonInnerCancelWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  width: 100%;
`;

const DeleteContactsButtonInnerWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const DeleteContactsButtonOuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export default withStyles(styles)(DeleteAllContactsButton);
