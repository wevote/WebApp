import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';

export default function PasteListModal({
  isOpen,
  onClose,
  pasteText,
  onPasteTextChange,
  mirrorHTML,
  pasteErrors,
  onImport,
  prospectiveCount,
}) {
  const dialogTitleJSX = (
    <HeaderRow>
      <Title>Paste voters</Title>
    </HeaderRow>
  );

  const textFieldJSX = (
    <div style={{ padding: '0px 18px 28px' }}>
      <Intro>
        <BulletList>
          <li>Paste a list of voters and their info, separated by line breaks</li>
          <BulletNoWrap>
            The content of each info section can be with or without brackets, i.e.&nbsp;
            <code>name@email.com</code>
            {' '}
            or
            {' '}
            <code>&lt;name@email.com&gt;</code>
          </BulletNoWrap>
        </BulletList>

        <ExampleBox aria-label="Example">
          <b>Example:</b>
          <pre>
            {`Jane Dough, jd@email.com, (212)-123-4567
John Dough, jd@email.com, (213)-123-4567`}
          </pre>
        </ExampleBox>
      </Intro>

      {pasteErrors.length > 0 && (
        <ErrorBanner role="alert" aria-live="polite">
          <ErrorIconWrap><WarningIcon fontSize="small" /></ErrorIconWrap>
          <div>
            <strong>Whoops! We’re having trouble importing your list of voters.</strong>
            <div>Please check the highlighted lines and make sure that:</div>
            <ul>
              <li>
                There&apos;s a <b>line break</b> after each voter (use Enter/Return)
              </li>
              <li>
                There&apos;s a <b>single comma</b> separating each piece of information
              </li>
            </ul>
            <small>
              Problem {pasteErrors.length > 1 ? 'lines' : 'line'}:&nbsp;
              {pasteErrors.map((e) => e.line + 1).join(', ')}
            </small>
          </div>
        </ErrorBanner>
      )}

      <EditAreaWrapper>
        <HighlightLayer
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: mirrorHTML || escapeHTML(pasteText || '') }}
        />
        <EditTextArea
          value={pasteText}
          onChange={onPasteTextChange}
          aria-label="Paste voters list"
        />
      </EditAreaWrapper>

      <Footer style={{ justifyContent: 'space-between' }}>
        <PlainButton type="button" onClick={onClose}>Cancel</PlainButton>
        <PrimaryButton
          type="button"
          onClick={onImport}
          disabled={!pasteText.trim()}
        >
          {prospectiveCount
            ? `Import ${prospectiveCount} voter${prospectiveCount > 1 ? 's' : ''}` : 'Import'}
        </PrimaryButton>
      </Footer>
    </div>
  );

  return (
    <>
      <HideTemplateADivider />
      <WidenPasteModal />
      <SoftenCorners />
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={onClose}
        externalUniqueId="pasteListModal"
        dialogTitleJSX={dialogTitleJSX}
        tallMode={false}
        textFieldJSX={textFieldJSX}
      />
    </>
  );
}

PasteListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pasteText: PropTypes.string.isRequired,
  onPasteTextChange: PropTypes.func.isRequired,
  mirrorHTML: PropTypes.string.isRequired,
  pasteErrors: PropTypes.arrayOf(PropTypes.shape({
    line: PropTypes.number.isRequired,
    reason: PropTypes.string.isRequired,
  })).isRequired,
  onImport: PropTypes.func.isRequired,
  prospectiveCount: PropTypes.number.isRequired,
};

const escapeHTML = (s) => s.replace(/[&<>]/g, (element) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', }[element]));

// Global Styles

const HideTemplateADivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateApasteListModal) > hr {
    display: none !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateApasteListModal) {
    border-radius: 14px !important;
  }
`;

const WidenPasteModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateApasteListModal) {
    width: 96% !important;
    max-width: 860px !important;
  }
`;

// Styles

const BulletList = styled.ul`
  font-size: 13px;        /* smaller bullets */
  line-height: 1.35;
  padding: 0 18px;
  margin: 0 0 8px;

  code { font-size: 12.5px; white-space: nowrap; } /* keep emails on one line & a touch smaller */
`;

const BulletNoWrap = styled.li`
  @media (min-width: 900px) { white-space: nowrap; }
  code { white-space: nowrap; }
`;

const EditAreaWrapper = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 10px;
  min-height: 260px;
  overflow: hidden;
  position: relative;
`;

const EditTextArea = styled.textarea`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.neutralUI900};
  font: inherit;
  min-height: 300px;
  outline: none;
  padding: 14px;
  position: relative;
  resize: vertical;
  width: 100%;
  z-index: 1;
`;

const ErrorBanner = styled.div`
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 10px;
  align-items: flex-start;
  background: ${DesignTokenColors.alert50};
  border: 1px solid ${DesignTokenColors.alert200};
  border-radius: 12px;
  color: ${DesignTokenColors.neutralUI800};
  font-size: 12px;
  padding: 12px 14px;
  margin: 8px 0 12px;

  strong { display: block; margin-bottom: 6px; }
  ul { margin: 6px 0 0 18px; }
`;

const ErrorIconWrap = styled.span`
  color: ${DesignTokenColors.warning600};
  display: inline-flex;
  line-height: 1;
  margin-top: 2px;
`;

const ExampleBox = styled.div`
  margin: 0 0 6px;

  pre {
    font-family: inherit;
    font-size: 13px;
    line-height: 1.35;
    margin: 0;
    white-space: pre-wrap;
  }
`;

const Footer = styled.div`
  display: flex;
  margin-top: 12px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 12px 0 18px;
`;

const HighlightLayer = styled.pre`
  color: transparent;
  font: inherit;
  inset: 0;
  line-height: inherit;
  margin: 0;
  padding: 14px;
  pointer-events: none;
  position: absolute;
  white-space: pre-wrap;
  word-wrap: break-word;
  z-index: 0;

  .err {
    background: ${DesignTokenColors.alert50};
    border-radius: 6px;
    display: inline-block;
    line-height: inherit;
    padding: 0 4px;
    vertical-align: top;
    width: 100%;
  }
`;

const Intro = styled.div`
  margin: 0 0 8px;
`;

const PlainButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: none;
  border-radius: 9999px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  padding: 10px 18px;

  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const PrimaryButton = styled.button`
  background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border: 1px solid ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  padding: 10px 18px;
  margin-left: auto;

  &:hover {
    background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
    border-color: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
  }
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
