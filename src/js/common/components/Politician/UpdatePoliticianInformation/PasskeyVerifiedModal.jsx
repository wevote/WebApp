import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ModalDisplayTemplateB from '../../../../components/Widgets/ModalDisplayTemplateB';
import { SubmitButton } from './VerifyOtherWaysModal';

const PasskeyVerifiedModal = ({ politicianName, passkeyVerified, setPasskeyVerified }) => {
  const usersEditingPermissions = ['Add profile content', 'Invite supporters', 'Grow awareness'];
  const otherEditors = [`john@${politicianName.toLowerCase().replaceAll(/[. ]/g, '')}.com`, `jane@${politicianName.toLowerCase().replaceAll(/[. ]/g, '')}.com`];
  const dialogTitleJSX = (
    <>
      <PasskeyVerifiedHeader>
        Congratulations!
      </PasskeyVerifiedHeader>
      <PasskeyVerifiedHeader>
        You can now manage and edit
        {' '}
        {politicianName}
        &#39;s account.
      </PasskeyVerifiedHeader>
    </>
  );

  const textFieldJSX = (
    <>
      <ul>
        {
          usersEditingPermissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))
        }
      </ul>
      {otherEditors.length > 0 && (
        <>
          <OtherEditorsHeader>
            Other editors
          </OtherEditorsHeader>
          <ul>
            {
              otherEditors.map((editor) => (
                <li key={editor}>{editor}</li>
              ))
            }
          </ul>
        </>
      )}
      <SubmitButtonContainer>
        <SubmitButton>
          Get started
        </SubmitButton>
      </SubmitButtonContainer>
    </>
  );
  return (
    <ModalDisplayTemplateB
      dialogTitleJSX={dialogTitleJSX}
      show={passkeyVerified}
      toggleModal={setPasskeyVerified}
      textFieldJSX={textFieldJSX}
    />
  );
};

PasskeyVerifiedModal.propTypes = {
  politicianName: PropTypes.string,
  setPasskeyVerified: PropTypes.func,
  passkeyVerified: PropTypes.bool,
};

const PasskeyVerifiedHeader = styled('h1')`
  font-size: 18px;
  margin: 0 0 0 24px;
`;

const OtherEditorsHeader = styled('h4')`
  margin: 0 0 0 24px;
`;

const SubmitButtonContainer = styled('div')`
  display: flex;
  justify-content: center;
  margin: 34px 0 0 0;
  width: 100%;
`;

export default PasskeyVerifiedModal;

