import React from 'react';
import ReactIframeResizer from 'iframe-resizer-react';
// import useDonorboxScript from '../../hooks/useDonorboxScript';
// <script src="https://donorbox.org/widget.js" paypalExpress="true"></script>
// <iframe src="https://donorbox.org/embed/we-vote-tax-deductible?default_interval=m&amount=7" name="donorbox" allowpaymentrequest="allowpaymentrequest" seamless="seamless" frameBorder="0" scrolling="no" height="900px" width="100%" style="max-width: 500px; min-width: 250px; max-height:none!important"></iframe>


export default function DonorboxEmbed () {
  // useDonorboxScript('https://donorbox.org/widget.js');
  return (
    <ReactIframeResizer
      // frameBorder={0}
      // log
      warningTimeout={0}
      style={{ maxWidth: 500, minWidth: 250, maxHeight: 'none !important' }}
      id="donorbox-iframe"
      name="donorbox"
      allowpaymentrequest="allowpaymentrequest"
      seamless="seamless"
      scrolling="no"
      height="900px"
      width="100%"
      src="https://donorbox.org/embed/we-vote-tax-deductible?default_interval=m&amount=10"
    />
  );
}
