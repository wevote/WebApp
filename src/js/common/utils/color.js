export function brightnessByColor (color) {
  const isHEX = color.indexOf('#') === 0;
  const isRGB = color.indexOf('rgb') === 0;
  let r; let g; let b;
  if (isHEX) {
    const m = color.substr(1).match(color.length === 7 ? /(\S{2})/g : /(\S{1})/g);
    if (m) {
      r = parseInt(m[0], 16);
      g = parseInt(m[1], 16);
      b = parseInt(m[2], 16);
    }
  }
  if (isRGB) {
    const m = color.match(/(\d+){3}/g);
    if (m) {
      [r, g, b] = m;
    }
  }
  if (typeof r !== 'undefined') {
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
  }
  return null;
}

export function getTextColorFromBackground (color) {
  const brightness = brightnessByColor(color);
  return brightness > 180 ? '#333333' : '#ffffff';
}
