import React from 'react';
import { Link } from 'react-router-dom';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';



const ByContinuingNotice = (params) => {
  const { cordovaClose } = params;

  const closeModal = () => {
    if (isCordova() && cordovaClose) {
      cordovaClose();
    }
  }

  return (
    <>
      By continuing, you accept WeVote.US&apos;s
      <br />
      {' '}
      <Link className="open-web-site"
            id="ByContinuingNoticeTerms"
            to="/more/terms"
            onClick={closeModal}
            target={isWebApp() ? "_blank" : ""}>
        <span className="u-no-break">Terms of Service</span>
      </Link>
      {' '}
      and
      {' '}
      <Link className="open-web-site"
            id="ByContinuingNoticePrivacy"
            to="/privacy"
            onClick={closeModal}
            target={isWebApp() ? "_blank" : ""}>
        <span className="u-no-break">Privacy Policy</span>
      </Link>
      .
    </>
  )
}

export default ByContinuingNotice;
