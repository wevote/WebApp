import React from 'react';

/* Replace CordovaOverlayTrigger with CordovaOverlayTrigger to disable
 We need to add...
     {
      "compilerOptions": {
        "baseUrl": "srcCordova"
      },
      "include": ["srcCordova"]
    }
  in jsconfig.json so that we can import this like
    import CordovaOverlayTrigger from 'utils/CordovaOverlayTrigger';
  without requiring a relative import path like '../../../utils/CordovaOverlayTrigger
  This would be handy in WebApp too, but it seems to require configuration of WebStorm to
  understand the alias, which would be messy for interns with varying editors
*/

// eslint-disable-next-line no-unused-vars,react/prop-types,react/jsx-one-expression-per-line
const CordovaOverlayTrigger = (props, ref) => (
  <>
    {props.children}
  </>
);

export default React.forwardRef(CordovaOverlayTrigger);
