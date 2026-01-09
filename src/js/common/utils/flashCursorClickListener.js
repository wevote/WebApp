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

// check if ripple object exists
function rippleCircle () {
  let ripple = document.querySelector('#clickRipple');
  if (!ripple) {
    ripple = document.createElement('div');
    ripple.id = 'clickRipple';
    ripple.className = 'clickRipple';
  }
  return ripple;
}

export default function flashCursorClickListener () {
  const overlay = cursorOverlayExists();
  const onClick = (e) => {
    // get mouse position
    const x = e.clientX;
    const y = e.clientY;

    // set ripple div on mouse location
    const el = rippleCircle();
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    overlay.appendChild(el);
    window.setTimeout(() => {
      el.remove();
    }, 600);
  };

  // begin event listener
  document.addEventListener('click', onClick, true);

  // return function to remove event listener
  return () => {
    document.removeEventListener('click', onClick, true);
  };
}
