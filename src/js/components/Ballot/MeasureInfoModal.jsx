import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA2 from '../Widgets/ModalDisplayTemplateA2';

export default function MeasureInfoModal ({
  initialTab, isOpen, measureText, measureSubtitle, measureTitle,
  measureUrl, measureWeVoteId, noVoteDescription, onClose, onTabChange,
  yesVoteDescription,
}) {
  const tabs = [
    { label: 'Description' },
    {
      label: (
        <>
          <span className="u-show-mobile">YES</span>
          <span className="u-show-desktop-tablet">YES means</span>
        </>
      ),
    },
    {
      label: (
        <>
          <span className="u-show-mobile">NO</span>
          <span className="u-show-desktop-tablet">NO means</span>
        </>
      ),
    },
  ];

  const tabContentJSX = [
    // Tab 0 — Description
    <TabContent key="description">
      {!!(measureTitle) && (
        <DescriptionTitle>{measureTitle}</DescriptionTitle>
      )}
      {!!(measureSubtitle) && (
        <ModalText>{measureSubtitle}</ModalText>
      )}
      {!!(measureUrl) && (
        <ModalLink
          href={measureUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {measureUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </ModalLink>
      )}
      <ModalText>{measureText}</ModalText>
    </TabContent>,

    // Tab 1 — YES means
    <TabContent key="yes">
      {yesVoteDescription ? (
        <SourceBlock>
          <SourceBody>{yesVoteDescription}</SourceBody>
        </SourceBlock>
      ) : (
        <SourceBlock>
          <SourceBody>No description available.</SourceBody>
        </SourceBlock>
      )}
    </TabContent>,

    // Tab 2 — NO means
    <TabContent key="no">
      {noVoteDescription ? (
        <SourceBlock>
          <SourceBody>{noVoteDescription}</SourceBody>
        </SourceBlock>
      ) : (
        <SourceBlock>
          <SourceBody>No description available.</SourceBody>
        </SourceBlock>
      )}
    </TabContent>,
  ];

  const dialogTitleJSX = (
    <>
      <ModalTitle>{measureTitle}</ModalTitle>
      <ModalSubtitle>{measureSubtitle}</ModalSubtitle>
    </>
  );

  return (
    <ModalDisplayTemplateA2
      dialogTitleJSX={dialogTitleJSX}
      externalUniqueId={`measureInfo-${measureWeVoteId}`}
      initialTab={initialTab}
      onTabChange={onTabChange}
      show={isOpen}
      tabs={tabs}
      tabContentJSX={tabContentJSX}
      tallMode
      toggleModal={onClose}
    />
  );
}

MeasureInfoModal.propTypes = {
  initialTab: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  measureText: PropTypes.string,
  measureSubtitle: PropTypes.string,
  measureTitle: PropTypes.string,
  measureUrl: PropTypes.string,
  measureWeVoteId: PropTypes.string,
  noVoteDescription: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onTabChange: PropTypes.func,
  yesVoteDescription: PropTypes.string,
};

// Styles

const DescriptionTitle = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 4px 0;
`;

const ModalLink = styled.a`
  color: #1073d4;
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-decoration: none;
  word-break: break-all;
  &:hover {
    text-decoration: underline;
  }
`;

const ModalSubtitle = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  padding-bottom: 12px;
`;

const ModalText = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const ModalTitle = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 2px 0;
`;

const SourceBlock = styled.div`
  margin-bottom: 16px;
`;

const SourceBody = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 14px;
  line-height: 1.5;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const TabContent = styled.div`
  padding: 16px 8px 28px 0;
`;
