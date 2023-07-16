export function handleHorizontalScroll (el, speed, distance, step, func) {
  let scrollAmount = 0;
  const element = el;
  const slideTimer = setInterval(() => {
    element.scrollLeft += step;
    scrollAmount += Math.abs(step);
    if (scrollAmount >= distance) {
      clearInterval(slideTimer);
    }
    func(element);
  }, speed);
}

export function leftAndRightArrowStateCalculation (el) {
  const element = el;
  let hideLeftArrow;
  let hideRightArrow;
  // hide left arrow
  if (element.scrollLeft === 0) {
    hideLeftArrow = true;
  } else {
    hideLeftArrow = false;
  }
  // hide right arrow
  if (element.scrollWidth - element.scrollLeft === element.clientWidth) {
    hideRightArrow = true;
  } else {
    hideRightArrow = false;
  }
  return [hideLeftArrow, hideRightArrow];
}
