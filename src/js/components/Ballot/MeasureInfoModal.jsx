import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA2 from '../Widgets/ModalDisplayTemplateA2';

export default function MeasureInfoModal ({
  initialTab, isOpen, measureText, measureSubtitle, measureTitle,
  measureUrl, measureWeVoteId, noVoteDescription, onClose, onTabChange,
  referendumCon, referendumPro, yesVoteDescription,
}) {
  const tabs = [
    {
      label: (
        <>
          <span className="u-show-mobile">Description</span>
          <span className="u-show-desktop-tablet">Description</span>
        </>
      ),
    },
    {
      label: (
        <>
          <span className="u-show-mobile">Yes</span>
          <span className="u-show-desktop-tablet">Yes means</span>
        </>
      ),
    },
    {
      label: (
        <>
          <span className="u-show-mobile">No</span>
          <span className="u-show-desktop-tablet">No means</span>
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
      <IndependentSourcesHeader>FROM INDEPENDENT SOURCES</IndependentSourcesHeader>
      <GreenBold>PRO</GreenBold>
      {referendumPro ? (
        <SourceBlock>
          <SourceBody>{referendumPro}</SourceBody>
        </SourceBlock>
      ) : (
        <SourceBlock>
          <SourceBody>No argument available.</SourceBody>
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
      <IndependentSourcesHeader>FROM INDEPENDENT SOURCES</IndependentSourcesHeader>
      <RedBold>CON</RedBold>
      {referendumCon ? (
        <SourceBlock>
          <SourceBody>{referendumCon}</SourceBody>
        </SourceBlock>
      ) : (
        <SourceBlock>
          <SourceBody>No argument available.</SourceBody>
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
  referendumCon: PropTypes.string,
  referendumPro: PropTypes.string,
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

const GreenBold = styled('span')`
  color: ${DesignTokenColors.confirmation700};
  font-weight: bold;
`;

const IndependentSourcesHeader = styled('div')`
  border-top: 1px solid #ddd;
  padding-top: 12px;
  color: ${DesignTokenColors.neutralUI400};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  margin-top: 12px;
  text-transform: uppercase;
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
  // font-size: 14px;
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

const RedBold = styled('span')`
  color: ${DesignTokenColors.alert700};
  font-weight: bold;
`;

const SourceBlock = styled.div`
  margin-bottom: 16px;
`;

const SourceBody = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  // font-size: 14px;
  line-height: 1.5;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const TabContent = styled.div`
  padding: 16px 8px 28px 0;
`;
