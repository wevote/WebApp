import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';

function SmallCloud (params) {
  const styleObj = {
    position: 'absolute',
    top: '30%',
    marginLeft: params.left,
  };

  const wider = params.wide !== undefined;

  return (
    <div style={styleObj}>
      <span
        style={{
          width: wider ? 180 : 160,
          height: 20,
          background: 'grey',
          borderRadius: '50%',
          filter: 'blur(3px)',
        }}
      >
        <span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </span>
    </div>
  );
}



export default function HeaderBarSuspense () {
  renderLog('"Render" of HeaderBarSuspense');
  const left = (window.innerWidth - 964) / 2;  // about 358 on a high res screen
  const leftForBeta = (left + 80).toString();

  const { headerObjects: temp } = window;
  if (!temp) {
    window.headerObjects = {
      logo: null,
      ready: null,
      ballot: null,
      opinions: null,
      discuss: null,
      bell: null,
      photo: null,
    };
  }
  const { headerObjects } = window;
  let logoModified = window.headerObjects.logo;
  if (logoModified && logoModified.includes('>beta<')) {
    const parts = logoModified.split('>beta<');
    logoModified = `${parts[0]} style="top: 14px; left: ${leftForBeta}">beta<${parts[1]}`;
  }

  return (
    <div style={{
      // boxSizing: 'border-box',
      position: 'relative',
      color: 'rgb(51, 51, 51)',
      backgroundColor: 'white',
      fontFamily: '"Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, sans-serif',
      height: '48px',
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
    }}
    >
      {headerObjects.logo ?
        <MenuLogo style={{ position: 'absolute', top: '8%', left: `${left + 2}px` }} dangerouslySetInnerHTML={{ __html: logoModified }} /> :
        <SmallCloud left={`${left}px`} wide /> }
      {headerObjects.ready ?
        <MenuText style={{ left: `${left + 167}px` }} dangerouslySetInnerHTML={{ __html: window.headerObjects.ready }} /> :
        <SmallCloud left={`${left + 167}px`} /> }
      {headerObjects.ballot ?
        <MenuText style={{ left: `${left + 258}px` }} dangerouslySetInnerHTML={{ __html: window.headerObjects.ballot }} /> :
        <SmallCloud left={`${left + 258}px`} /> }
      {headerObjects.opinions ?
        <MenuText style={{ left: `${left + 344}px` }} dangerouslySetInnerHTML={{ __html: window.headerObjects.opinions }} /> :
        <SmallCloud left={`${left + 344}px`} /> }
      {headerObjects.discuss ?
        <MenuText style={{ left: `${left + 439}px` }} dangerouslySetInnerHTML={{ __html: window.headerObjects.discuss }} /> :
        <SmallCloud left={`${left + 441}px`} /> }
      {headerObjects.bell ?
        <MenuBell style={{ left: `${left + 868}px` }} dangerouslySetInnerHTML={{ __html: window.headerObjects.bell }} /> :
        <SmallCloud left={`${left + 926}px`} /> }
      {headerObjects.photo ?
        <MenuBell style={{ left: `${left + 928}px` }} dangerouslySetInnerHTML={{ __html: window.headerObjects.photo }} /> : null }
    </div>
  );
}

const MenuText = styled.div`
  text-transform: uppercase;
  line-height: 24.5px;
  white-space: normal;
  letter-spacing: 0.4px;
  font-weight: 400;
  font-size: 14px;
  opacity: 0.7;
  position: absolute;
  top: 22.5%;
`;

const MenuLogo = styled.div`
  font-size: 10px;
  font-weight: 400;
  opacity: 1;
  position: absolute;
  top: 6px;
`;

const MenuBell = styled.div`
  opacity: 1;
  position: absolute;
`;

