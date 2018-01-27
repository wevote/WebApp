/*
  Displays given message in a toast/flash
  Default: display toast w/ blue bg at top of screen; auto-hides in 3sec
  https://github.com/fkhadra/react-toastify
*/
import { toast } from 'react-toastify';
import isMobile from './isMobile';

export default function (msg, options = {}) {
  // only show toasts on mobile
  if (isMobile()) {
    toast.info(msg, {
      autoClose: 3000,
      hideProgressBar: true,
      className: 'visible-xs-block',
      bodyClassName: {
        fontFamily: '"Source Sans Pro", sans-serif',
        fontSize: '1.4rem',
        textAlign: 'center',
      },
      ...options,
    });
  }
}
