export function handleHorizontalScroll (el, distance, func, rightMarginSize) {
  const element = el;
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
  // console.log(element.scrollWidth - element.scrollLeft);
  if (element.scrollWidth - element.scrollLeft === element.clientWidth) {
    hideRightArrow = true;
  } else {
    hideRightArrow = false;
  }
  return [hideLeftArrow, hideRightArrow];
}

export function checkDivPositionForLoadMore (el) {
  // true -> call load more cards
  const DISTANCE_AWAY_FROM_LAST_CARD_OF_DIV = 800;
  const element = el;
  if ((element.scrollWidth - element.scrollLeft) - element.clientWidth <= DISTANCE_AWAY_FROM_LAST_CARD_OF_DIV) {
    // console.log('yes');
    return true;
  }
  // console.log('no');
  return false;
}
