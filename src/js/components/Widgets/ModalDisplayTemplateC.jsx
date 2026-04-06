import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dialog } from '@mui/material';
import { isAndroid, isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';


class ModalDisplayTemplateC extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('ModalDisplayTemplateC');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      show, toggleModal, headerJSX, bodyJSX, footerJSX,
    } = this.props;
    // This template is used by other components like EnterOneByOneModal
    return (
      <StyledDialog
        open={show}
        onClose={toggleModal}
        fullScreen
      >
        {headerJSX && <ModalHeader>{headerJSX}</ModalHeader>}
        {bodyJSX && <ModalBody>{bodyJSX}</ModalBody>}
        {footerJSX && <ModalFooter>{footerJSX}</ModalFooter>}
      </StyledDialog>
    );
  }
}

ModalDisplayTemplateC.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  headerJSX: PropTypes.node,
  bodyJSX: PropTypes.node,
  footerJSX: PropTypes.node,
};

const StyledDialog = styled(Dialog)`
  && {
    .MuiDialog-paper {
      max-width: 100%;
      max-height: 100%;
      background: ${DesignTokenColors.whiteUI};
      display: flex;
      flex-direction: column;
      box-shadow: none;
      border: 1px solid ${DesignTokenColors.neutralUI300};
      margin: 0;

      @media (max-width: 599px) {
        ${isAndroid() ? 'min-height: 237px;' : ''}
      }
    }
    .MuiBackdrop-root {
      background-color: ${DesignTokenColors.whiteUI};
    }
  }

  ${isCordova() && `
    padding-top: 75px;
  `}
`;

const ModalHeader = styled.div`
  background: ${DesignTokenColors.whiteUI};
  padding: ${isAndroid() ? '8px 12px 8px 20px' : '10px 12px 8px 20px'};
  padding-top: ${isAndroid() ? '8px' : '10px'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: ${DesignTokenColors.neutralUI50};
`;

const ModalFooter = styled.div`
  background: ${DesignTokenColors.whiteUI};
  padding: 12px 20px;
  display: flex;
  gap: 20px;
  align-items: center;
`;

export default ModalDisplayTemplateC;
