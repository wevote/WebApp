export function handleHorizontalScrollOld (el, speed, distance, step, func) {
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

export function handleHorizontalScroll (el, distance, func, rightMarginSize) {
  const element = el;
  // console.log(element.scrollLeft);
  // 24 is the size of the right margin of each card
  // TODO: pass in size of right margin
  const offset = (element.scrollLeft % distance);
  let scrollDistance = distance;
  if (element.scrollLeft === 0) {
    scrollDistance = distance - rightMarginSize;
  } else if (offset !== (distance - rightMarginSize)) {
    scrollDistance = distance - offset - rightMarginSize;
  }
  if (distance < 0) {
    scrollDistance -= distance;
  }
  element.scrollTo({
    top: 0,
    left: element.scrollLeft + scrollDistance,
    behavior: 'smooth',
  });
  func(element);
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
