import React from 'react';
import PropTypes from 'prop-types';

function EditPoliticianList ({ campaignXWeVoteId, editExistingCampaign }) {
  return (
    <span style={{ display: 'none' }}>
      {campaignXWeVoteId}
      {editExistingCampaign ? '1' : '0'}
    </span>
  );
}

EditPoliticianList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  editExistingCampaign: PropTypes.bool,
};

export default EditPoliticianList;
