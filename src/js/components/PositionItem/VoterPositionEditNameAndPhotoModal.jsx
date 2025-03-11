import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { Close as CloseIcon } from '@mui/icons-material';
import VoterStore from '../../stores/VoterStore';
import SettingsProfilePicture from '../Settings/SettingsProfilePicture';
import SettingsWidgetFirstLastName from '../Settings/SettingsWidgetFirstLastName';
import SettingsWidgetOrganizationWebsite from '../Settings/SettingsWidgetOrganizationWebsite';
import SettingsWidgetOrganizationDescription from '../Settings/SettingsWidgetOrganizationDescription';
import SettingsWidgetAccountType from '../Settings/SettingsWidgetAccountType';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const VoterPositionEditNameAndPhotoModal = ({ show, toggleModal, classes }) => {
  const [voter, setVoter] = useState(null);

  useEffect(() => {
    if (show) {
      // Fetch voter data when modal is displayed
      const voterData = VoterStore.getVoter();
      setVoter(voterData);
    }
  }, [show]);

  if (!voter) {
    return null; // Prevent rendering until voter data is available
  }

  return (
    <Dialog open={show} onClose={toggleModal} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit Profile
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={toggleModal}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <p>
          We are serious about protecting your information. We are a non-profit and will never sell your data.
          {' '}
          <a
            href="/frequently-asked-questions"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.a}
          >
            Frequently Asked Questions.
          </a>
        </p>
        <div>
          {/* Profile picture */}
          <SettingsProfilePicture
            voterPhotoUrl={voter.voter_photo_url_medium}
            externalUniqueId="edit-profile-modal"
          />

          {/* First and last name */}
          <SettingsWidgetFirstLastName
            firstName={voter.first_name}
            lastName={voter.last_name}
            externalUniqueId="edit-profile-modal"
          />

          {/* Website */}
          <SettingsWidgetOrganizationWebsite
            organizationWebsite={voter.linked_organization_website}
            externalUniqueId="edit-profile-modal"
          />

          {/* Organization description */}
          <SettingsWidgetOrganizationDescription
            organizationDescription={voter.linked_organization_description}
            externalUniqueId="edit-profile-modal"
          />

          {/* Account type */}
          <SettingsWidgetAccountType
            accountType={voter.account_type}
            externalUniqueId="edit-profile-modal"
            closeEditFormOnChoice
            showEditToggleOption
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

VoterPositionEditNameAndPhotoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = {
  modalContent: {
    padding: '20px',
  },
  a: {
    color: DesignTokenColors.primary500,
  },
  closeButton: {
    color: DesignTokenColors.neutral100,
    position: 'absolute',
    right: '8px',
    top: '8px',
  },
};

export default withStyles(styles)(VoterPositionEditNameAndPhotoModal);
