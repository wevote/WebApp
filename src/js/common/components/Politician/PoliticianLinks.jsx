import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../Style/Colors';
// import DesignTokenColors from '../Style/DesignTokenColors';

import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';

const PoliticianLinks = ({ links }) => (
  <PoliticianLinksContainer>
    {links.map((link) => {
      const key = Object.keys(link)[0];
      const value = link[key];

      if (!value) return null;

      return (
        <OpenExternalWebSite
          key={key}
          url={value}
          target="_blank"
          className="u-gray-mid"
          rel="noopener noreferrer"
          title={key}
          body={(
            <LinkContainer style={{ paddingRight: '12px', paddingBottom: '4px', display: 'flex' }}>
              {key}

              <IconLink width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6H6C5.46957 6 4.96086 6.21071 4.58579 6.58579C4.21071 6.96086 4 7.46957 4 8V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V12M11 13L20 4M20 4H15M20 4V9" stroke="#9D9D9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </IconLink>

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

const PoliticianLinksContainer = styled.div`
    display: flex;
    margin-top: 2px;
    margin-bottom: 12px;
`;

const IconLink = styled.svg`
  margin-left: 4px;
`;

const LinkContainer = styled.div`
  &:hover ${IconLink} path {
    stroke: ${Colors.primary};
  }
`;

export default PoliticianLinks;
