const flashQueue = new Set();

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
    // console.log('ripple position:', el.style.left, el.style.top);
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

export default function flashCursorClickListener () {
  const delay = 500;
  const onPointerDown = (e) => {
    // get mouse position
    const x = e.clientX;
    const y = e.clientY;
    // console.log('mouse position: ', x, y);
    rippleScheduler(x, y, delay);
  };

  const onClick = (e) => {
    // get anchor element
    const anchorElement = e.target.closest?.('a[href]');
    if (!anchorElement) return;

    // intercept anchor opening to new tab
    const blank = (anchorElement.getAttribute('target') || '').toLowerCase();
    if (blank !== '_blank') return;

    const url = anchorElement.getAttribute('href');

    e.preventDefault();
    e.stopPropagation();

    window.setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, delay + delay);
  };

  // begin event listener
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('click', onClick, true);

  // return function to remove event listener
  return () => {
    cleanupRipple();
    document.removeEventListener('pointerdown', onPointerDown, true);
    document.removeEventListener('click', onClick, true);
  };
}
