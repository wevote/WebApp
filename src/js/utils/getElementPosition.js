//Source: https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
function getElementPosition ( el ) {
    var _x = 0;
    var _y = 0;
    while ( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;  // eslint-disable-line no-param-reassign
    }
    return { top: _y, left: _x };
}

export default getElementPosition;
