import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';

const PoliticianLinks = ({ links }) => (
  <PoliticianLinksContainerOverflow>
    <PoliticianLinksContainerLeft16>
      <PoliticianLinksContainer>
        {links.map((link, index) => {
          const { linkText, externalLinkUrl } = link;
          if (!externalLinkUrl) return null;

          return (
            <LinkContainer key={linkText} isFirst={index !== 0}>
              <OpenExternalWebSite
                key={linkText}
                url={externalLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={linkText}
                body={linkText}
              />
            </LinkContainer>
          );
        })}
      </PoliticianLinksContainer>
    </PoliticianLinksContainerLeft16>
  </PoliticianLinksContainerOverflow>
);

PoliticianLinks.propTypes = {
  links: PropTypes.array,
};

const PoliticianLinksContainerOverflow = styled('div')`
  overflow: hidden;
`;

const PoliticianLinksContainerLeft16 = styled('div')`
  display: block;
  position: relative;
  left: -16px;
`;

const PoliticianLinksContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  margin-top: 2px;
  margin-bottom: 12px;
  width: 100%;
`;

const LinkContainer = styled('div')`
  padding-bottom: 4px;
  padding-right: 16px;
  padding-left: 16px;
  border-left: 1px solid ${DesignTokenColors.secondary200};  
`;

export default PoliticianLinks;
