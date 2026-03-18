import React from 'react';
import PropTypes from 'prop-types';

function AddPoliticianInputField ({ campaignXWeVoteId, editExistingCampaign }) {
  return (
    <span style={{ display: 'none' }}>
      {campaignXWeVoteId}
      {editExistingCampaign ? '1' : '0'}
    </span>
  );
}

AddPoliticianInputField.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  editExistingCampaign: PropTypes.bool,
};

export default AddPoliticianInputField;
