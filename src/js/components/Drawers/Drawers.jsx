import React from 'react';
import { renderLog } from '../../common/utils/logging';
import HeaderProfileDrawer from './HeaderProfileDrawer';
import PoliticianSelfEditDrawer from './PoliticianSelfEditDrawer';


function Drawers () {
  renderLog('Drawers');

  return (
    <>
      <HeaderProfileDrawer />
      <PoliticianSelfEditDrawer />
    </>
  );
}

export default Drawers;
