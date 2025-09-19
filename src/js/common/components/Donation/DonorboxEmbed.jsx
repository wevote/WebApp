import React, { useState } from 'react';
import ReactIframeResizer from 'iframe-resizer-react';
// import useDonorboxScript from '../../hooks/useDonorboxScript';
// <script src="https://donorbox.org/widget.js" paypalExpress="true"></script>
// <iframe src="https://donorbox.org/embed/we-vote-tax-deductible?default_interval=m&amount=7" name="donorbox" allowpaymentrequest="allowpaymentrequest" seamless="seamless" frameBorder="0" scrolling="no" height="900px" width="100%" style="max-width: 500px; min-width: 250px; max-height:none!important"></iframe>


export default function DonorboxEmbed () {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  // useDonorboxScript('https://donorbox.org/widget.js');
  return (
    <div style={{ position: 'relative', width: '375px', height: '900px' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: 'white',
          zIndex: 1,
        }}
        >
          Loading...
        </div>
      )}
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
        width="375px"
        src="https://donorbox.org/embed/we-vote-tax-deductible?default_interval=m&amount=10"
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
