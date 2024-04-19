import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';

import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';

const PoliticianLinks = ({ links }) => (
  <PoliticianLinksContainer>
    {links.map((link) => {
      const { linkText, externalLinkUrl } = link;

      if (!externalLinkUrl) return null;

      return (
        <OpenExternalWebSite
          key={linkText}
          url={externalLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={linkText}
          body={(
            <LinkContainer>
              {linkText}
            </LinkContainer>
          )}
        />
      );
    })}
  </PoliticianLinksContainer>
);

PoliticianLinks.propTypes = {
  links: PropTypes.array,
};

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
  margin-right: 16px;
  border-right: 1px solid ${DesignTokenColors.secondary200};
`;

export default PoliticianLinks;
