import React, { useState, useEffect } from 'react';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { DialogTitle, Button, TextField } from '@mui/material';
import DesignTokenColors from '../Style/DesignTokenColors';
import ModalDisplayTemplateA, { templateAStyles } from '../../../components/Widgets/ModalDisplayTemplateA';
import ChallengeInviteeStore from '../../stores/ChallengeInviteeStore';

const EditInviteeDetails = ({ inviteeId, show, setShow, setAnchorEl }) => {
  const [inviteeData, setInviteeData] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedMessage, setEditedMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    const fetchInviteeData = async () => {
      // need to do the same for the inviter
      const data = await ChallengeInviteeStore.getChallengeInviteeById(inviteeId);
      setInviteeData(data);
      setEditedName(data?.invitee_name || '');
      setEditedMessage(data?.message || '');
    };
    if (inviteeId) {
      fetchInviteeData();
    }
  }, [inviteeId]);

  const handleClose = () => {
    setShow(false);
    setAnchorEl(null);
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setEditedName(value);
    if (value === '') {
      setNameError('Please enter your friend\'s name');
    } else {
      setNameError('');
    }
  };

  const handleMessageChange = (e) => {
    const { value } = e.target;
    setEditedMessage(value);
    if (value === '') {
      setMessageError('Please enter a message');
    } else {
      setMessageError('');
    }
  };

  const handleSave = () => {
    console.log('Saving edited details:', { name: editedName, message: editedMessage });
    // Add save logic here
    handleClose();
  };

  const dialogTitleText = "Edit Friend's Name and Message";

  const textFieldJSX = (
    <FormContent>
      <FormSection>
        <FormFieldContainer>
          <TextField
            fullWidth
            label="Your friend's name"
            value={editedName}
            onChange={handleNameChange}
            error={!!nameError}
            helperText={nameError}
            variant="outlined"
            size="small"
          />
        </FormFieldContainer>
        <FormFieldContainer>
          <TextField
            fullWidth
            label={`Message to ${editedName || 'your friend'}`}
            multiline
            rows={4}
            value={editedMessage}
            onChange={handleMessageChange}
            error={!!messageError}
            helperText={messageError}
            variant="outlined"
          />
        </FormFieldContainer>
        <UniqueLink>
          [
          {editedName || 'your friend'}
          's unique link]
        </UniqueLink>
      </FormSection>
      <ButtonContainer>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={!editedName || !editedMessage} variant="contained">Save Changes</Button>
      </ButtonContainer>
    </FormContent>
  );

  return (
    <ModalDisplayTemplateA
      dialogTitleJSX={<DialogTitle>{dialogTitleText}</DialogTitle>}
      textFieldJSX={textFieldJSX}
      show={show}
      tallMode
      toggleModal={handleClose}
    />
  );
};

EditInviteeDetails.propTypes = {
  inviteeId: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  setAnchorEl: PropTypes.func.isRequired,
};

const FormContent = styled('div')`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 500px;
`;

const FormSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormFieldContainer = styled('div')`
  width: 100%;
`;

const UniqueLink = styled('div')`
  margin-top: 10px;
  font-size: 12px;
  color: ${DesignTokenColors.neutral600};
`;

const ButtonContainer = styled('div')`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export default withTheme(withStyles(templateAStyles)(EditInviteeDetails));
