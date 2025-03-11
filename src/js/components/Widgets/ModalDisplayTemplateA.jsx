import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { hasIPhoneNotch, isAndroidSizeWide } from '../../common/utils/cordovaUtils';
import { isAndroid, isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';


class ModalDisplayTemplateA extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    renderLog('ModalDisplayTemplateA');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes, dialogTitleJSX, externalUniqueId, show, tallMode, textFieldJSX,
    } = this.props;
    let dialogPaperCombined;
    if (tallMode) {
      dialogPaperCombined = { ...classes.dialogPaper, ...classes.dialogPaperAdditionTall };
    } else {
      dialogPaperCombined = classes.dialogPaper;
    }
    // This template is used by other components like ActivityPostModal, and PositionStatementModal
    return (
      <Dialog
        classes={{ paper: dialogPaperCombined }}
        onClose={() => this.props.toggleModal()}
        open={show}
        style={{ paddingTop: `${isCordova() ? '75px' : 'undefined'}` }}
      >
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          <DialogTitleInnerWrapper>
            <Title>
              {dialogTitleJSX || <>&nbsp;</>}
            </Title>
            <IconButton
              aria-label="Close"
              classes={{ root: classes.closeButton }}
              onClick={() => this.props.toggleModal()}
              id={`closeModalDisplayTemplateA${externalUniqueId}`}
              size="large"
            >
              <Close />
            </IconButton>
          </DialogTitleInnerWrapper>
          <Divider />
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <DialogContentInnerWrapper>
            {textFieldJSX}
          </DialogContentInnerWrapper>
        </DialogContent>
      </Dialog>
    );
  }
}
ModalDisplayTemplateA.propTypes = {
  classes: PropTypes.object,
  dialogTitleJSX: PropTypes.object,
  externalUniqueId: PropTypes.string,
  show: PropTypes.bool,
  tallMode: PropTypes.bool,
  textFieldJSX: PropTypes.object,
  toggleModal: PropTypes.func.isRequired,
};

export const templateAStyles = (theme) => ({
  dialogTitle: {
    padding: isAndroid() ? 8 : 'inherit',
    paddingTop: !isAndroid() ? 16 : 'inherit',
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    minHeight: isAndroid() ? '257px' : '200px',
    maxHeight: '350px',
    height: '80%',
    width: '90%',
    maxWidth: '600px',
    top: '0',
    transform: isAndroid() ? 'translate(0%, -18%)' : 'translate(0%, -20%)',
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: isAndroid() ? '237px' : '200px',
      maxHeight: '330px',
      height: '70%',
      margin: '0 auto',
      transform: 'translate(0%, -30%)',
    },
  },
  dialogPaperAdditionTall: {
    maxHeight: '550px',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '530px',
    },
  },
  dialogContent: {
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: isAndroid() ? '-4px' : theme.spacing(2.8),
  },
  saveButtonRoot: {
    width: '100%',
  },
  formStyles: {
    width: '100%',
  },
  formControl: {
    width: '100%',
    marginTop: 16,
  },
  inputMultiline: {
    fontSize: 20,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
  },
  inputStyles: {
    flex: '1 1 0',
    fontSize: 18,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  select: {
    padding: '12px 12px',
    margin: '0 1px',
  },
});

const DialogContentInnerWrapper = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DialogTitleInnerWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 28px;
`;

export const horizontalEllipsis = '\u2026';

export const PostSaveButton = styled('div')`
  width: 100%;
`;

export const TextFieldDiv = styled('div')`
  align-items: flex-start;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  display: flex;
  margin-bottom: 0;
  padding: ${isAndroidSizeWide() ? '12px 12px 0 12px' : '12px'};
`;

export const TextFieldForm = styled('form')`
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TextFieldWrapper = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled('div')`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  text-align: left;
  padding-left: 16px;
`;

export const VoterAvatarImg = styled('img')`
  border-radius: 6px;
  display: block;
  margin-right: 12px;
  width: 50px;
`;

export default withTheme(withStyles(templateAStyles)(ModalDisplayTemplateA));
