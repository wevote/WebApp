import PropTypes from 'prop-types';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import DonateFaqBody from './DonateFaqBody';
import ModalDisplayTemplateB from '../Widgets/ModalDisplayTemplateB';

const EXTERNAL_UNIQUE_ID = 'donateFaqModal';

// Shows the contents of the DonateFaq page in a modal, so voters don't leave the Donate page
export default function DonateFaqModal ({ show, toggleModal }) {
  return (
    <>
      <TallScrollableModal />
      <ModalDisplayTemplateB
        externalUniqueId={EXTERNAL_UNIQUE_ID}
        show={show}
        toggleModal={toggleModal}
        dialogTitleJSX={(
          <ModalTitle>WeVote Donation FAQ</ModalTitle>
        )}
        textFieldJSX={(
          <DonateFaqBody compactSpacing hideTitle />
        )}
      />
    </>
  );
}
DonateFaqModal.propTypes = {
  show: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
};

// ModalDisplayTemplateB sizes its paper for short content (600px wide at most), and its
// tallMode prop is broken (it spreads a class name string), so grow this one modal the way
// ConfirmCloseModal does. The width steps follow the same breakpoints the template uses in
// its own dialogPaper styles (muiTheme: sm 576, md 768, lg 960), just with roomier caps so
// the FAQ question rows don't wrap every other word. 900px matches the DonateFaq page width.
const PAPER = `.MuiDialog-paper:has(#closeModalDisplayTemplateB${EXTERNAL_UNIQUE_ID})`;

const TallScrollableModal = createGlobalStyle`
  ${PAPER} {
    height: 80vh;
    max-height: 80vh;
    top: 0 !important;
    transform: none !important;
    margin: 24px auto !important;
    width: 92%;
    max-width: 92vw;
  }
  ${PAPER} .MuiDialogContent-root {
    overflow-y: auto;
  }

  @media (min-width: 576px) {
    ${PAPER} {
      width: 88%;
      max-width: 640px;
    }
  }

  @media (min-width: 768px) {
    ${PAPER} {
      width: 82%;
      max-width: 800px;
    }
  }

  @media (min-width: 960px) {
    ${PAPER} {
      width: 76%;
      max-width: 900px;
    }
  }
`;

const ModalTitle = styled('div')`
  font-size: 20px;
  font-weight: 700;
`;
