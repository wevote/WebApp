import React from 'react';
import { renderLog } from '../../common/utils/logging';
import HeaderProfileDrawer from './HeaderProfileDrawer';


const Drawers = () => {
  renderLog('Drawers');

  return (
    <>
      <HeaderProfileDrawer />
    </>
  );
};

export default Drawers;
