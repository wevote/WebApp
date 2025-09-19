import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { hasIPhoneNotch, isAndroidSizeWide } from '../../common/utils/cordovaUtils';
import { isAndroid, isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

class ModalDisplayTemplateB extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    renderLog('ModalDisplayTemplateB');  // Set LOG_RENDER_EVENTS to log all renders
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
              id={`closeModalDisplayTemplateB${externalUniqueId}`}
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
ModalDisplayTemplateB.propTypes = {
  classes: PropTypes.object,
  dialogTitleJSX: PropTypes.object,
  externalUniqueId: PropTypes.string,
  show: PropTypes.bool,
  tallMode: PropTypes.bool,
  textFieldJSX: PropTypes.object,
  toggleModal: PropTypes.func.isRequired,
};

export const templateBStyles = (theme) => ({
  dialogTitle: {
    padding: isAndroid() ? 8 : 'inherit',
    margin: 0,
  },
  opposingLabel: {
    margin: '0 8px',
    padding: '4px 8px',
  },
  styledEditIcon: {
    alignItems: 'center',
    backgroundColor: DesignTokenColors.primary50,
    borderRadius: '50%',
    color: DesignTokenColors.neutral400,
    cursor: 'pointer',
    display: 'flex',
    fontSize: '24px',
    margin: '22px 0 0 -15px',
    padding: '5px',
    position: 'relative',
  },
  dialogPaper: {
    border: `1px solid ${DesignTokenColors.neutral100}`,
    borderRadius: '30px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    marginTop: hasIPhoneNotch() ? 68 : 48,
    minHeight: isAndroid() ? '257px' : '200px',
    maxWidth: '600px',
    top: '50px',
    width: '90%',
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
    [theme.breakpoints.up('sm')]: {
      maxWidth: '500px',
      width: '80%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '600px',
      width: '70%',
    },
  },
  dialogPaperAdditionTall: {
    maxHeight: '550px',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '530px',
    },
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  closeButton: {
    height: '24px',
    position: 'absolute',
    right: '16px',
    width: '24.55px',
    textAlign: 'left',
  },
  formStyles: {
    width: '100%',
  },
  formControl: {
    marginTop: 16,
    width: '100%',
  },
  inputMultiline: {
    fontSize: 16,
    height: '100%',
    width: '100%',
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
  saveButtonRoot: {
    borderRadius: '30px',
    color: 'white',
    fontWeight: 600,
    fontSize: 16,
    height: '40px',
    width: '100%',
    lineHeight: '24px',
    margin: '16px 0 0 0 ',
    '&.Mui-disabled': {
      backgroundColor: DesignTokenColors.neutral100,
      color: DesignTokenColors.whiteUI,
      opacity: 0.6,
    },
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '10px',
    padding: '0',
    width: '100%',

    '@media (max-width: 600px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: '8px',
    },

    '@media (max-width: 375px)': {
      alignItems: 'flex-start',
      gap: '8px',
    },
  },
  radioLabel: {
    alignItems: 'center',
    color: DesignTokenColors.neutral900,
    display: 'flex',
    fontWeight: '400',
    lineHeight: '22px',
    margin: 0,
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px !important',
    },
  },
  radioRoot: {
    color: DesignTokenColors.neutral900,
  },
  radioChecked: {
    color: DesignTokenColors.primary600,
  },
  tooltipPaper: {
    backgroundColor: DesignTokenColors.neutral900,
  },
  tooltipArrow: {
    color: DesignTokenColors.neutral900,
    translate: '40px 0px',
  },
  tooltipLink: {
    color: DesignTokenColors.primary200,
  },
});

export const CommentContainer = styled('div')`
  flex-grow: 1;
  background-color: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 16px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
`;

const DialogContentInnerWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  margin-top:25px;

  @media (max-width: 600px) {
    min-height: 48px;
  }

  @media (min-width: 960px) {
    min-height: 64px;
  }
`;

const DialogTitleInnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  min-height: 56px;

  @media ${(props) => props.theme.breakpoints.down('sm')} {
    min-height: 48px;
  }
`;

export const horizontalEllipsis = '\u2026';

export const TextFieldDiv = styled('div')`
  align-items: flex-start;
  font-size: 16px;
  border: 1px solid ${DesignTokenColors.primary600};
  border-radius: 16px;
  display: flex;
  line-height: 21.82px;
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
  font-size: 18px;
  font-weight: bold;
  line-height: 24.55px;
  margin: 16px 0;
  text-align: left;
  padding-left: 20px;

  @media (max-width: 600px) {
    font-size: 16px;
    line-height: 22px;
  }

  @media (min-width: 960px) {
    font-size: 20px;
    line-height: 28px;
  }
`;
export const VoterAvatarImg = styled('img')`
  border-radius: 50%;
  width: 43px;
  height: 43px;
  display: block;
  @media (max-width: 600px) {
  margin-left: 0px;
  }
`;

export const UserInfoText = styled('div')`
  padding-left: 16px;
  `;
export const UserName = styled('div')`
  color: DesignTokenColors.neutralUI900;
  font-size: 18px;
  font-weight: 600;
  line-height: 25px;
`;

export const VisibilityText = styled('div')`
  color: DesignTokenColors.neutral900;
  font-size: 13px;
  line-height: 20px;
  margin-top: 4px;
`;

export const OpinionButtonsWrapper = styled('div')`
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
`;

export const OpinionButton = styled(Button)`
  border-radius: 16px;
  flex: 1;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  margin: 0 4px;
  text-transform: capitalize;

  @media (max-width: 600px) {
    font-size: 14px;
    line-height: 20px;
  }

  color: ${(props) => (props.selected ? DesignTokenColors.whiteUI : DesignTokenColors.primary600)};
  background-color: ${(props) => (props.selected ? DesignTokenColors.primary600 : 'transparent')};

  &:hover {
  background-color: ${(props) => (props.selected ? DesignTokenColors.primary600 : 'transparent')};
    background-color: ${(props) => (props.selected ? DesignTokenColors.primary600 : DesignTokenColors.primary50)};
  }
`;

export const InputBox = styled.input`
  border: none;
  color: ${DesignTokenColors.neutral900};
  font-size: 16px;
  outline: none;
  flex-grow: 1;
`;
export default withTheme(withStyles(templateBStyles)(ModalDisplayTemplateB));
