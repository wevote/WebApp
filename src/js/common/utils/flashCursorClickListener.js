// queue of flash animations
const flashQueue = new Set();

// click flash delay (ms)
const flashDelayMs = 1000;

function isPointerClickable (el) {
  return window.getComputedStyle(el).cursor === 'pointer';
}

function findClickable (el) {
  let element = el;
  while (element && element !== document.body) {
    if (isPointerClickable(element)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

// check if overlay exists, if not create one
function cursorOverlayExists () {
  let overlay = document.querySelector('#flashCursorOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'flashCursorOverlay';
    overlay.className = 'flashCursorOverlay';
    document.body.appendChild(overlay);
  }
  return overlay;
}
const overlay = cursorOverlayExists();

// check if ripple object exists
function rippleCircle () {
  const ripple = document.createElement('div');
  ripple.id = 'clickRipple';
  ripple.className = 'clickRipple';
  return ripple;
}

function rippleScheduler (x = 0, y = 0, delay = 500) {
  // set ripple div on mouse location
  const el = rippleCircle();
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  // set delay for ripple
  const id = window.setTimeout(() => {
    flashQueue.delete(id);
    overlay.appendChild(el);

    // set delay to remove child
    window.setTimeout(() => {
      el.remove();
    }, delay + 100);
  }, delay);

  // queue timeouts
  flashQueue.add(id);
}

function cleanupRipple () {
  flashQueue.forEach((timeout) => {
    window.clearTimeout(timeout);
  });
  flashQueue.clear();
}

function shouldInterceptNavigationClick (e) {
  // only left click, no modifier keys (so ctrl/cmd click still works)
  if (e.button !== 0) return false;
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
}

function attachNavigationClickInterceptor ({ delayMs = 500 }) {
  const onClickCapture = (e) => {
    // if (!isEnabled()) return;
    if (!shouldInterceptNavigationClick(e)) return;

    // Prevent infinite loops when we re-dispatch the click
    const BYPASS_ATTR = 'data-delay-bypass-click';

    // If this is our re-dispatched click, let it through
    const bypassEl = e.target?.closest?.(`[${BYPASS_ATTR}="1"]`);
    if (bypassEl) {
      // clean up bypass flag immediately
      bypassEl.removeAttribute(BYPASS_ATTR);
      return;
    }

    // Find a button-like element
    const btn = findClickable(e.target);
    if (btn) {
      // Stop the original click from doing anything
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

      // Capture some useful info for redispatch
      const { clientX, clientY } = e;
      window.setTimeout(() => {
        // Mark this element so the interceptor won't catch it again
        btn.setAttribute(BYPASS_ATTR, '1');
        // Re-dispatch a click event so React/DOM handlers run normally
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX,
          clientY,
        });
        btn.dispatchEvent(clickEvent);
      }, 2 * delayMs);
    }

    const a = findClickable(e.target);
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    // Let browser handle downloads/mailto/tel
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // Decide whether it's internal SPA route or full navigation
    const url = new URL(a.href, window.location.href);
    // const isSameOrigin = url.origin === window.location.origin;

    // If same-origin and looks like SPA route, delay it ourselves
    // (If your app uses real server routes too, you may want stricter detection)
    const target = (a.getAttribute('target') || '').toLowerCase();

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();

    // set url param and routes
    url.searchParams.set('flashCursor', '1');
    const nextRoute = `${url.pathname}${url.search}${url.hash}`;

    // Flash is already shown on pointerdown; this delays the actual nav.
    if (target === '_blank') {
      // popup-safe approach:
      window.setTimeout(() => {
        window.open(url.toString(), '_blank', 'noopener,noreferrer');
      }, 2 * delayMs);
      return;
    }

    window.setTimeout(() => {
      // For same-tab navigation:
      global.weVoteGlobalHistory.push(nextRoute);
    }, 2 * delayMs);
  };

  document.addEventListener('click', onClickCapture, true);
  return () => document.removeEventListener('click', onClickCapture, true);
}

export default function flashCursorClickListener () {
  const onPointerDown = (e) => {
    // get mouse position
    const x = e.clientX;
    const y = e.clientY;
    rippleScheduler(x, y, flashDelayMs);
  };

  // begin event listener
  document.addEventListener('pointerdown', onPointerDown, true);
  const linkCapture = attachNavigationClickInterceptor({ delayMs: flashDelayMs });

  // return function to remove event listener
  return () => {
    cleanupRipple();
    document.removeEventListener('pointerdown', onPointerDown, true);
    linkCapture();
  };
}
