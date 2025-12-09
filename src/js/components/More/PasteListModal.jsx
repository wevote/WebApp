import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';

const escapeHTML = (s) => s.replace(/[&<>]/g, (element) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[element]));

const emailRE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

function parsePastedList (text) {
  const lines = text.split(/\r?\n/);
  const rows = [];
  const errors = [];

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line) return;

    const parts = line.split(',').map((s) => s.trim()).filter(Boolean);
    const emailCount = (line.match(emailRE) || []).length;

    if (parts.length > 3) {
      errors.push({ line: idx, reason: 'Too many commas' });
      return;
    }
    if (emailCount > 1) {
      errors.push({ line: idx, reason: 'Two emails on one line (missing line break?)' });
      return;
    }
    // Must have at least "Name, Email"
    if (parts.length < 2) {
      errors.push({ line: idx, reason: 'Missing email (format: Name, email[, phone])' });
      return;
    }
    // Validate email
    const emailPart = parts[1].replace(/[<>]/g, '');
    if (!emailRE.test(emailPart)) {
      errors.push({ line: idx, reason: 'Invalid email' });
      return;
    }

    rows.push({
      name: parts[0] || '',
      email: emailPart || '',
      phone: parts[2] || '',
    });
  });

  return { rows, errors };
}

function buildMirrorHTML (text, errors) {
  const errSet = new Set(errors.map((e) => e.line));
  return text.split(/\r?\n/).map((line, i) => {
    const isError = errSet.has(i) && line.trim().length > 0;
    const safe = escapeHTML(line);
    return isError ? `<span class="err">${safe}</span>` : safe;
  }).join('\n');
}

export default function PasteListModal ({
  isOpen,
  onClose,
  onImport,
}) {
  const [pasteText, setPasteText] = useState('');
  const [pasteErrors, setPasteErrors] = useState([]);
  const [mirrorHTML, setMirrorHTML] = useState('');

  const onPasteTextChange = (e) => {
    const { value } = e.target;
    setPasteText(value);
    const { errors } = parsePastedList(value);
    setPasteErrors(errors);
    setMirrorHTML(buildMirrorHTML(value, errors));
  };

  const prospectiveCount = useMemo(() => parsePastedList(pasteText).rows.length, [pasteText]);

  const handlePasteImport = () => {
    const { rows, errors } = parsePastedList(pasteText);
    if (errors.length) {
      setPasteErrors(errors);
      setMirrorHTML(buildMirrorHTML(pasteText, errors));
      return; // block import until fixed
    }
    onImport(rows);
  };

  const handleClose = () => {
    // Reset state on close
    setPasteText('');
    setPasteErrors([]);
    setMirrorHTML('');
    onClose();
  };

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
                There&apos;s a
                {' '}
                <b>line break</b>
                {' '}
                after each voter (use Enter/Return)
              </li>
              <li>
                There&apos;s a
                {' '}
                <b>single comma</b>
                {' '}
                separating each piece of information
              </li>
            </ul>
            <small>
              Problem
              {' '}
              {pasteErrors.length > 1 ? 'lines' : 'line'}
              :&nbsp;
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
        <PlainButton type="button" onClick={handleClose}>Cancel</PlainButton>
        <PrimaryButton
          type="button"
          onClick={handlePasteImport}
          disabled={!pasteText.trim()}
        >
          {prospectiveCount ?
            `Import ${prospectiveCount} voter${prospectiveCount > 1 ? 's' : ''}` : 'Import'}
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
        toggleModal={handleClose}
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
  onImport: PropTypes.func.isRequired,
};

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
