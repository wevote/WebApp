import React, { useState } from 'react';
import styled from 'styled-components';
import LegalPoliciesModal from '../More/LegalPoliciesModal';

const ByContinuingNotice = () => {
  const [legalModalTab, setLegalModalTab] = useState(null);

  return (
    <>
      By continuing, you accept WeVote.US&apos;s
      <br />
      {' '}
      <LinkButton
        className="open-web-site"
        id="ByContinuingNoticeTerms"
        type="button"
        onClick={() => setLegalModalTab('terms')}
      >
        <span className="u-no-break">Terms of Service</span>
      </LinkButton>
      {' '}
      and
      {' '}
      <LinkButton
        className="open-web-site"
        id="ByContinuingNoticePrivacy"
        type="button"
        onClick={() => setLegalModalTab('privacy')}
      >
        <span className="u-no-break">Privacy Policy</span>
      </LinkButton>
      .
      {legalModalTab && (
        <LegalPoliciesModal
          isOpen={!!legalModalTab}
          onClose={() => setLegalModalTab(null)}
          initialTab={legalModalTab}
        />
      )}
    </>
  );
};

const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  text-decoration: none;
`;

export default ByContinuingNotice;
