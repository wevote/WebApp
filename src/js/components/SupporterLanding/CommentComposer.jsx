import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import HelpMeWriteButton from './HelpMeWriteButton';
import VoterAvatar from './VoterAvatar';

// The highlighted compose box: voter avatar + single-line input, with "Help me write"
// beneath. Demo only — the input isn't wired to anything.
export default function CommentComposer ({ placeholder }) {
  return (
    <Composer>
      <InputRow>
        <VoterAvatar initials="Dn" size={40} />
        <TextInput type="text" placeholder={placeholder} aria-label="Share why you're supporting Jane" />
      </InputRow>
      {/* Indent to line up with the input box (past the 40px avatar + 12px gap) */}
      <HelpMeWriteRow>
        <HelpMeWriteButton />
      </HelpMeWriteRow>
    </Composer>
  );
}
CommentComposer.propTypes = {
  placeholder: PropTypes.string,
};

const Composer = styled.div`
  background: ${DesignTokenColors.caution50};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
`;

const HelpMeWriteRow = styled.div`
  padding-left: 52px;
`;

const InputRow = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
`;

const TextInput = styled.input`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 9999px;
  color: ${DesignTokenColors.neutral900};
  flex: 1;
  font-size: 16px;
  min-width: 0;
  padding: 5px 18px;

  &::placeholder {
    color: ${DesignTokenColors.neutral500};
  }

  &:focus {
    border-color: ${DesignTokenColors.primary600};
    outline: none;
  }
`;
