import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Shown below the Step 4 card once the word is spread: a thank-you headline and a
// "What else you can do" list of follow-on links.
export default function StepFourComplete ({ heading, whatElseHeading, items }) {
  return (
    <Wrapper>
      <ThanksHeading>{heading}</ThanksHeading>
      <WhatElseHeading>{whatElseHeading}</WhatElseHeading>
      <List>
        {items.map((item) => (
          <Item key={item.key}>
            <ItemText>{item.text}</ItemText>
            <Links>
              {item.links.map((link) => (
                <NavLink key={link.label} to={link.to}>{link.label}</NavLink>
              ))}
            </Links>
          </Item>
        ))}
      </List>
    </Wrapper>
  );
}
StepFourComplete.propTypes = {
  heading: PropTypes.string,
  whatElseHeading: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    text: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, to: PropTypes.string })),
  })),
};

const Item = styled.li`
  color: ${DesignTokenColors.neutral700};
`;

const ItemText = styled.p`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px;
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: disc;
  margin: 0;
  padding-left: 22px;
`;

const NavLink = styled(Link)`
  color: ${DesignTokenColors.primary600};
  font-size: 15px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ThanksHeading = styled.h2`
  color: ${DesignTokenColors.neutral700};
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const WhatElseHeading = styled.h3`
  color: ${DesignTokenColors.neutral700};
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 8px;
`;
