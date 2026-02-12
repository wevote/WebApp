export default function patchHistoryForFlashCursor (history, { isEnabled, delayMs = 300 }) {
  return {
    ...history,

    push: (...args) => {
      if (!isEnabled()) {
        history.push(...args);
        return;
      }
      console.log('calling push in patchHistoryForFlashCursor');
      window.setTimeout(() => history.push(...args), 2 * delayMs);
    },

    replace: (...args) => {
      if (!isEnabled()) {
        history.replace(...args);
        return;
      }
      console.log('calling replace in patchHistoryForFlashCursor');
      window.setTimeout(() => history.replace(...args), 2 * delayMs);
    },
  };
}
