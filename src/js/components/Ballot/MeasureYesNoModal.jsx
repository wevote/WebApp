import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA2 from '../Widgets/ModalDisplayTemplateA2';

export default function MeasureYesNoModal ({ initialTab, isOpen, measureWeVoteId, noVoteDescription, onClose, onTabChange, yesVoteDescription }) {
  const tabs = [
    { label: 'YES means' },
    { label: 'NO means' },
  ];

  const tabContentJSX = [
    // Tab 0 — YES means
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

    // Tab 1 — NO means
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

  return (
    <ModalDisplayTemplateA2
      externalUniqueId={`yesNoMeans-${measureWeVoteId}`}
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

MeasureYesNoModal.propTypes = {
  initialTab: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  measureWeVoteId: PropTypes.string,
  noVoteDescription: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onTabChange: PropTypes.func,
  yesVoteDescription: PropTypes.string,
};

// Styles

const SourceBlock = styled.div`
  margin-bottom: 16px;
`;

const SourceBody = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 14px;
  line-height: 1.5;
`;

const TabContent = styled.div`
  padding: 16px 8px 28px 0;
`;
