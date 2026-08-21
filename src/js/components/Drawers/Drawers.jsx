import React from 'react';
import SnackNotifier from '../../common/components/Widgets/SnackNotifier';
import { renderLog } from '../../common/utils/logging';
import HeaderProfileDrawer from './HeaderProfileDrawer';
import PoliticianSelfEditDrawer from './PoliticianSelfEditDrawer';


function Drawers () {
  renderLog('Drawers');

  return (
    <>
      <HeaderProfileDrawer />
      <PoliticianSelfEditDrawer />
      <SnackNotifier />
    </>
  );
}

export default Drawers;
