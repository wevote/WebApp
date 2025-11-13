import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';
import {WarningAmber as WarningIcon} from '@mui/icons-material';
import { renderLog } from '../../common/utils/logging';
import ModalDisplayTemplateA from '../../components/Widgets/ModalDisplayTemplateA';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';


export default function PasteListModal({
  showPaste,
  closePaste,
  pasteText,
  onPasteTextChange,
  handlePasteImport,
  pasteErrors,
  mirrorHTML,
  escapeHTML,
  prospectiveCount }) {
  renderLog('PasteListModal');  // Set LOG_RENDER_EVENTS to log all renders

  const PasteListBody = (
    <ModalBackdrop role="dialog" aria-modal="true" aria-labelledby="paste-title">
      <ModalCard>
        <ModalHeader>
          <ModalTitle id="paste-title">Paste voters</ModalTitle>
          <CloseX type="button" aria-label="Close" onClick={closePaste}>×</CloseX>
        </ModalHeader>
        <ModalIntro>
          <BulletList>
            <li>Paste a list of voters and their info, separated by line breaks</li>
            <BulletNoWrap>
              The content of each info section can be with or without brackets, i.e.
              <code> name@email.com</code>
              {' '}
              or
              <code>&lt;name@email.com&gt;</code>
            </BulletNoWrap>
          </BulletList>

          <ExampleBox>
            <b>Example:</b>
            <pre>
              {`Jane Dough, jd@email.com, (212)-123-4567
                  John Dough, jd@email.com, (213)-123-4567`}
            </pre>
          </ExampleBox>
        </ModalIntro>

        {pasteErrors.length > 0 && (
        <ErrorBanner role="alert" aria-live="polite">
          <ErrorIconWrap><WarningIcon fontSize="small" /></ErrorIconWrap>
          <div>
            <strong>Whoops! We’re having trouble importing your list of voters.</strong>
            <div>Please check the highlighted lines and make sure that:</div>
            <ul>
              <li>
                There’s a
                <b>line break</b>
                {' '}
                after each voter (using the Enter or Return key)
              </li>
              <li>
                There’s a
                <b>single comma</b>
                {' '}
                separating each piece of information
              </li>
            </ul>
            <small>
              Problem
              {' '}
              {pasteErrors.length > 1 ? 'lines' : 'line'}
              :
              {' '}
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

        <ModalFooter style={{ justifyContent: 'space-between' }}>
          <EditCloseButton type="button" onClick={closePaste}>Cancel</EditCloseButton>
          <PrimarySaveBtn
                    type="button"
                    onClick={handlePasteImport}
                    disabled={!pasteText.trim()}
          >
            {prospectiveCount ? `Import ${prospectiveCount} voter${prospectiveCount > 1 ? 's' : ''}` : 'Import'}
          </PrimarySaveBtn>
        </ModalFooter>
      </ModalCard>
    </ModalBackdrop>
  );



  return (
    <ModalDisplayTemplateA
          dialogTitleJSX={<></>}
          show={showPaste}
          toggleModal={closePaste}
          textFieldJSX={PasteListBody}
    />

  );
}

PasteListModal.propTypes = {
  showPaste: PropTypes.bool.isRequired,
  closePaste: PropTypes.func.isRequired,
  pasteText: PropTypes.string.isRequired,
  onPasteTextChange: PropTypes.func.isRequired,
  handlePasteImport: PropTypes.func.isRequired,
  pasteErrors: PropTypes.array.isRequired,
  mirrorHTML: PropTypes.string.isRequired,
  escapeHTML: PropTypes.func.isRequired,
  prospectiveCount: PropTypes.number.isRequired,
};

// bullets
const BulletList = styled.ul`
  font-size: 13px;        /* smaller bullets */
  line-height: 1.35;
  padding: 0 18px;

  code { font-size: 12.5px; white-space: nowrap; } /* keep emails on one line & a touch smaller */
`;

const BulletNoWrap = styled.li`
  @media (min-width: 900px) { white-space: nowrap; }
  code { white-space: nowrap; }
`;

const ErrorBanner = styled.div`
  align-items: flex-start;
  background: ${DesignTokenColors.alert50};
  border: 1px solid ${DesignTokenColors.alert200};
  border-radius: 12px;
  color: ${DesignTokenColors.neutralUI800};
  display: grid;
  font-size: 12px;
  gap: 10px;
  grid-template-columns: 22px 1fr;
  margin: 8px 0 12px;
  padding: 12px 14px;

  strong { display: block; margin-bottom: 6px; }
  ul { margin: 6px 0 0 18px; }
`;

const ErrorIconWrap = styled.span`
  color: ${DesignTokenColors.warning600};
  display: inline-flex;
  font-size: inherit;
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
    margin: 0;
    padding: 0 4px;
    vertical-align: top;
    width: 100%;
  }
`;

const ModalBackdrop = styled.div`
  align-items: center;
  background: rgba(16,24,40,0.4);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9999;
`;

const ModalCard = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(16,24,40,0.18);
  max-width: 860px;
  padding: 18px 18px 14px;
  width: calc(100% - 28px);
`;

const ModalHeader = styled.div`
  align-items: start;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const ModalIntro = styled.div`
  margin: 0 0 8px;
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  margin: 4px 0 8px;
`;

const CloseX = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  padding: 2px 6px;
`;


const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
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

const EditCloseButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: none;
  border-radius: 9999px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  padding: 10px 18px;

  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const PrimarySaveBtn = styled.button`
  background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border: 1px solid ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  padding: 10px 18px;

  &:hover {
    background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
    border-color: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
  }
`;




