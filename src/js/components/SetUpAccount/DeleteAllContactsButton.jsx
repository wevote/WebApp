import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
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
    const { classes, leftAlign, textSizeSmall } = this.props;
    const { deleteAllContactsConfirm } = this.state;
    return (
      <DeleteContactsButtonOuterWrapper leftAlign={leftAlign}>
        {deleteAllContactsConfirm ? (
          <div className={leftAlign ? '' : 'full-width'}>
            <DeleteContactsButtonInnerWrapper leftAlign={leftAlign}>
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
            style={textSizeSmall ? {
              fontSize: 14,
            } : {
              fontSize: 16,
            }}
            onClick={this.deleteAllContactsConfirmToggle}
          >
            <div className={leftAlign ? '' : 'u-no-break'} style={isCordova() || isMobileScreenSize() ? { paddingLeft: 15 } : {}}>
              You can
              {' '}
              <span className="u-link-color u-link-color-on-hover">
                delete your contact information
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
  leftAlign: PropTypes.bool,
  textSizeSmall: PropTypes.bool,
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
    color: '#808080',
    marginTop: 0,
    padding: 0,
    textTransform: 'none',
  },
});

const DeleteContactsButtonInnerCancelWrapper = styled('div')`
  display: flex;
  justify-content:center;
  margin-bottom: 8px;
  width: 100%;
`;

const DeleteContactsButtonInnerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['leftAlign'].includes(prop),
})(({ leftAlign }) => (`
  display: flex;
  justify-content: ${leftAlign ? 'flex-start' : 'center'};
  width: 100%;
`));

const DeleteContactsButtonOuterWrapper = styled('div', {
  shouldForwardProp: (prop) => !['leftAlign'].includes(prop),
})(({ leftAlign }) => (`
  display: flex;
  justify-content: ${leftAlign ? 'flex-start' : 'center'};
  width: 100%;
`));

export default withStyles(styles)(DeleteAllContactsButton);
