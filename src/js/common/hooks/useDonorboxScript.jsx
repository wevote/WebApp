import { useEffect } from 'react';

const useDonorboxScript = (url) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;
    script.paypalExpress = true;

    return () => {
      document.body.appendChild(script);
    };
  }, [url]);
};

export default useDonorboxScript;
