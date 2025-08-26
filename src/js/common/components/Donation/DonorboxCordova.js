import { Button } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

/* global $  */

/* From the embed creation webpage at DonorBox
<script src="https://donorbox.org/widget.js" paypalExpress="true"></script>
<iframe src="https://donorbox.org/embed/test-784093?"
   name="donorbox" allowpaymentrequest="allowpaymentrequest" seamless="seamless"
   frameborder="0" scrolling="no" height="900px" width="100%"
   style="max-width: 500px; min-width: 250px; max-height:none!important" allow="payment">
</iframe>
*/

const DonorboxCordova = () => {
  const OpenInAppBrowser = () => {
    const footerContainerSelector = $('#footer-container');
    footerContainerSelector.css('opacity', '0');
    // footerContainerSelector.css({ display: 'none !important' });
    if (window.cordova && window.cordova.InAppBrowser) {
      const ref = window.cordova.InAppBrowser.open(
        'https://donorbox.org/embed/we-vote-tax-deductible?default_interval=m&amount=10',
        'location=yes',
        'allowpaymentrequest=allowpaymentrequest',
        'seamless=seamless',
        // 'scrolling=no',
        '_blank',
      );
      ref.addEventListener('loaderror', (err) => {
        console.log('DonorboxCordova InAppBrowser loaderror: ', err.toString());
      });
      ref.addEventListener('exit', (ex) => {
        console.log('DonorboxCordova InAppBrowser exit: ', JSON.stringify(ex));
        footerContainerSelector.css('opacity', '1');
        // ref.close();
      });
    } else {
      console.log('InAppBrowser plugin not available');
    }
  };

  return (
    <DonateButtonContainer>
      <Button variant="contained" onClick={OpenInAppBrowser}>Donate</Button>
    </DonateButtonContainer>
  );
};

const DonateButtonContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;
`;

export default DonorboxCordova;
