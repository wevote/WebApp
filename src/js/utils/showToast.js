/*
  Displays given message in a toast/flash w select defaults
  Default: display toast w/ blue bg at top of screen; auto-hides in 3sec
  https://github.com/fkhadra/react-toastify
  and https://fkhadra.github.io/react-toastify/
*/
import { toast } from "react-toastify";
import { hasIPhoneNotch } from "./cordovaUtils";

let DEFAULT_OPTIONS = {
  autoClose: 2000,
  bodyClassName: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1.2rem",
    textAlign: "center",
    marginTop: null,
  },
  hideProgressBar: true,
  position: toast.POSITION.TOP_CENTER,
};

export function showToastError (msg, options = {}) {
  if (hasIPhoneNotch()) {
    DEFAULT_OPTIONS.bodyClassName.marginTop = 30;
  }

  toast.error(msg, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

export function showToastSuccess (msg, options = {}) {
  if (hasIPhoneNotch()) {
    DEFAULT_OPTIONS.bodyClassName.marginTop = 30;
  }

  toast.success(msg, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}
