import React from 'react';
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

  return (
    <div style={{
      // boxSizing: 'border-box',
      position: 'relative',
      color: 'rgb(51, 51, 51)',
      backgroundColor: 'white',
      // display: 'block',
      fontFamily: '"Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: 16,
      fontWeight: 400,
      height: '48px',
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
    }}
    >
      <SmallCloud left={`${left}px`} wide />
      <SmallCloud left={`${left + 166}px`} />
      <SmallCloud left={`${left + 256}px`} />
      <SmallCloud left={`${left + 341}px`} />
      <SmallCloud left={`${left + 441}px`} />
      <SmallCloud left={`${left + 926}px`} />
    </div>
  );
}
