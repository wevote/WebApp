import React from 'react';
import styled from 'styled-components';

const USAState = props => (
  <>
    <path d={props.dimensions} fill={props.fill} data-name={props.state} className={`${props.state} state`} onClick={props.onClickState}>
      <title fill="white">{props.stateName}</title>
    </path>
    <text>
      <textPath xlinkHref="#p1" startOffset="50%" textAnchor="middle">Test</textPath>
    </text>
  </>
);

const Path = styled.path`
  &::after {
    content: "Test";
    color: orange;
    background: black;
    width: 100px;
    height: 100px;
    display: block;
    z-index: 999 !important;
  }
`;

export default USAState;
