import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { checkPermissionContacts } from './cordovaContactUtils';


// React functional component example
export default function ImportContactsButton (props) {
  const { displayState, handleRawContacts } = props;
  renderLog('ImportContactsButton functional component');
  if (displayState !== 2) return '';
  return (
    <ImportContactsButtonWrapper>
      <Button
        color="primary"
        onClick={() => checkPermissionContacts(handleRawContacts)}
        variant="outlined"
        hidden={displayState > 2}
      >
        Import Apple Contacts
      </Button>
    </ImportContactsButtonWrapper>
  );
}
ImportContactsButton.propTypes = {
  displayState: PropTypes.number.isRequired,
  handleRawContacts: PropTypes.func.isRequired,
};


const ImportContactsButtonWrapper = styled.div`
  padding-top: 35px;
  padding-bottom: 20px;
`;
