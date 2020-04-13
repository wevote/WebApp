import React, { createContext, useMemo, useCallback, useContext, useState, useEffect, memo, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as d3Geo from 'd3-geo';
import { geoPath as geoPath$1, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';

const _extends = Object.assign || function (target) {
  for (let i = 1; i < arguments.length; i++) {
    const source = arguments[i];

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

const objectWithoutProperties = function (obj, keys) {
  const target = {};

  for (const i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

const slicedToArray = (function () {
  function sliceIterator (arr, i) {
    const _arr = [];
    let _n = true;
    let _d = false;
    let _e;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i.return) _i.return();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }
  };
}());

const geoPath = geoPath$1;
const projections = objectWithoutProperties(d3Geo, ['geoPath']);


const MapContext = createContext();

const makeProjection = function makeProjection (_ref) {
  const _ref$projectionConfig = _ref.projectionConfig;
  const projectionConfig = _ref$projectionConfig === undefined ? {} : _ref$projectionConfig;
  const _ref$projection = _ref.projection;
  const projection = _ref$projection === undefined ? 'geoEqualEarth' : _ref$projection;
  const _ref$width = _ref.width;
  const width = _ref$width === undefined ? 800 : _ref$width;
  const _ref$height = _ref.height;
  const height = _ref$height === undefined ? 600 : _ref$height;

  const isFunc = typeof projection === 'function';

  if (isFunc) return projection;

  let proj = projections[projection]().translate([width / 2, height / 2]);

  const supported = [proj.center ? 'center' : null, proj.rotate ? 'rotate' : null, proj.scale ? 'scale' : null, proj.parallels ? 'parallels' : null];

  supported.forEach((d) => {
    if (!d) return;
    proj = proj[d](projectionConfig[d] || proj[d]());
  });

  return proj;
};

const MapProvider = function MapProvider (_ref2) {
  const { width } = _ref2;
  const { height } = _ref2;
  const { projection } = _ref2;
  const { projectionConfig } = _ref2;
  const restProps = objectWithoutProperties(_ref2, ['width', 'height', 'projection', 'projectionConfig']);

  const _ref3 = projectionConfig.center || [];
  const _ref4 = slicedToArray(_ref3, 2);
  const cx = _ref4[0];
  const cy = _ref4[1];

  const _ref5 = projectionConfig.rotate || [];
  const _ref6 = slicedToArray(_ref5, 3);
  const rx = _ref6[0];
  const ry = _ref6[1];
  const rz = _ref6[2];

  const _ref7 = projectionConfig.parallels || [];
  const _ref8 = slicedToArray(_ref7, 2);
  const p1 = _ref8[0];
  const p2 = _ref8[1];

  const s = projectionConfig.scale || null;

  const projMemo = useMemo(() => makeProjection({
    projectionConfig: {
      center: cx || cx === 0 || cy || cy === 0 ? [cx, cy] : null,
      rotate: rx || rx === 0 || ry || ry === 0 ? [rx, ry, rz] : null,
      parallels: p1 || p1 === 0 || p2 || p2 === 0 ? [p1, p2] : null,
      scale: s,
    },
    projection,
    width,
    height,
  }), [width, height, projection, cx, cy, rx, ry, rz, p1, p2, s]);

  const proj = useCallback(projMemo, [projMemo]);

  const value = useMemo(() => ({
    width,
    height,
    projection: proj,
    path: geoPath().projection(proj),
  }), [width, height, proj]);

  return React.createElement(MapContext.Provider, _extends({ value }, restProps));
};

MapProvider.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  projection: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  projectionConfig: PropTypes.object,
};

const ComposableMap = function ComposableMap (_ref) {
  const _ref$width = _ref.width;
  const width = _ref$width === undefined ? 800 : _ref$width;
  const _ref$height = _ref.height;
  const height = _ref$height === undefined ? 600 : _ref$height;
  const _ref$projection = _ref.projection;
  const projection = _ref$projection === undefined ? 'geoEqualEarth' : _ref$projection;
  const _ref$projectionConfig = _ref.projectionConfig;
  const projectionConfig = _ref$projectionConfig === undefined ? {} : _ref$projectionConfig;
  const _ref$className = _ref.className;
  const className = _ref$className === undefined ? '' : _ref$className;
  const restProps = objectWithoutProperties(_ref, ['width', 'height', 'projection', 'projectionConfig', 'className']);

  return React.createElement(
    MapProvider,
    {
      width,
      height,
      projection,
      projectionConfig,
    },
    React.createElement('svg', _extends({
      viewBox: `0 0 ${width} ${height}`,
      className: `rsm-svg ${className}`,
    }, restProps)),
  );
};

ComposableMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  projection: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  projectionConfig: PropTypes.object,
  className: PropTypes.string,
};

function getCoords (w, h, t) {
  const xOffset = (w * t.k - w) / 2;
  const yOffset = (h * t.k - h) / 2;
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k];
}

function fetchGeographies (url) {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return res.json();
  }).catch((error) => {
    console.log('There was a problem when fetching the data: ', error);
  });
}

function getFeatures (geographies, parseGeographies) {
  if (Array.isArray(geographies)) return parseGeographies ? parseGeographies(geographies) : geographies;
  const feats = feature(geographies, geographies.objects[Object.keys(geographies.objects)[0]]).features;
  return parseGeographies ? parseGeographies(feats) : feats;
}

function prepareFeatures (geographies, path) {
  return geographies ? geographies.map((d, i) => _extends({}, d, {
    rsmKey: `geo-${i}`,
    svgPath: path(d),
  })) : [];
}

function createConnectorPath () {
  const dx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
  const dy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
  const curve = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;

  const curvature = Array.isArray(curve) ? curve : [curve, curve];
  const curveX = dx / 2 * curvature[0];
  const curveY = dy / 2 * curvature[1];
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`;
}

function isString (geo) {
  return typeof geo === 'string';
}

function useGeographies (_ref) {
  const { geography } = _ref;
  const { parseGeographies } = _ref;

  const _useContext = useContext(MapContext);
  const { path } = _useContext;

  const _useState = useState();
  const _useState2 = slicedToArray(_useState, 2);
  const geographies = _useState2[0];
  const setGeographies = _useState2[1];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isString(geography)) {
      fetchGeographies(geography).then((geos) => {
        if (geos) setGeographies(getFeatures(geos, parseGeographies));
      });
    } else {
      setGeographies(getFeatures(geography, parseGeographies));
    }
  }, [geography, parseGeographies]);

  const output = useMemo(() => prepareFeatures(geographies, path), [geographies, path]);

  return { geographies: output };
}

const Geographies = function Geographies (_ref) {
  const { geography } = _ref;
  const { children } = _ref;
  const { parseGeographies } = _ref;
  const _ref$className = _ref.className;
  const className = _ref$className === undefined ? '' : _ref$className;
  const restProps = objectWithoutProperties(_ref, ['geography', 'children', 'parseGeographies', 'className']);

  const _useContext = useContext(MapContext);
  const { path } = _useContext;
  const { projection } = _useContext;

  const _useGeographies = useGeographies({ geography, parseGeographies });
  const { geographies } = _useGeographies;

  return React.createElement(
    'g',
    _extends({ className: `rsm-geographies ${className}` }, restProps),
    geographies && geographies.length > 0 && children({ geographies, path, projection }),
  );
};

Geographies.propTypes = {
  geography: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  children: PropTypes.func,
  parseGeographies: PropTypes.func,
  className: PropTypes.string,
};

const Geography = function Geography (_ref) {
  const { geography } = _ref;
  const { onMouseOver } = _ref;
  const { onMouseOut } = _ref;
  const { onMouseDown } = _ref;
  const { onMouseUp } = _ref;
  const { onFocus } = _ref;
  const { onBlur } = _ref;
  const _ref$style = _ref.style;
  const style = _ref$style === undefined ? {} : _ref$style;
  const _ref$className = _ref.className;
  const className = _ref$className === undefined ? '' : _ref$className;
  const restProps = objectWithoutProperties(_ref, ['geography', 'onMouseOver', 'onMouseOut', 'onMouseDown', 'onMouseUp', 'onFocus', 'onBlur', 'style', 'className']);

  const _useState = useState(false);
  const _useState2 = slicedToArray(_useState, 2);
  const isPressed = _useState2[0];
  const setPressed = _useState2[1];

  const _useState3 = useState(false);
  const _useState4 = slicedToArray(_useState3, 2);
  const isFocused = _useState4[0];
  const setFocus = _useState4[1];

  function handleMouseEnter (evt) {
    setFocus(true);
    if (onMouseOver) onMouseOver(evt);
  }

  function handleMouseLeave (evt) {
    setFocus(false);
    if (isPressed) setPressed(false);
    if (onMouseOut) onMouseOut(evt);
  }

  function handleFocus (evt) {
    setFocus(true);
    if (onFocus) onFocus(evt);
  }

  function handleBlur (evt) {
    setFocus(false);
    if (isPressed) setPressed(false);
    if (onBlur) onBlur(evt);
  }

  function handleMouseDown (evt) {
    setPressed(true);
    if (onMouseDown) onMouseDown(evt);
  }

  function handleMouseUp (evt) {
    setPressed(false);
    if (onMouseUp) onMouseUp(evt);
  }

  return React.createElement('path', _extends({
    tabIndex: '0',
    className: `rsm-geography ${isFocused ? 'hovered' : ''} ${className}`,
    d: geography.svgPath,
    onMouseOver: handleMouseEnter,
    onMouseOut: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    style: style[isPressed || isFocused ? isPressed ? 'pressed' : 'hover' : 'default'],
  }, restProps));
};

Geography.propTypes = {
  geography: PropTypes.object,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};

const Geography$1 = memo(Geography);

const Graticule = function Graticule (_ref) {
  const _ref$fill = _ref.fill;
  const fill = _ref$fill === undefined ? 'transparent' : _ref$fill;
  const _ref$stroke = _ref.stroke;
  const stroke = _ref$stroke === undefined ? 'currentcolor' : _ref$stroke;
  const _ref$step = _ref.step;
  const step = _ref$step === undefined ? [10, 10] : _ref$step;
  const _ref$className = _ref.className;
  const className = _ref$className === undefined ? '' : _ref$className;
  const restProps = objectWithoutProperties(_ref, ['fill', 'stroke', 'step', 'className']);

  const _useContext = useContext(MapContext);
  const { path } = _useContext;

  return React.createElement('path', _extends({
    d: path(geoGraticule().step(step)()),
    fill,
    stroke,
    className: `rsm-graticule ${className}`,
  }, restProps));
};

Graticule.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
  step: PropTypes.array,
  className: PropTypes.string,
};

const Graticule$1 = memo(Graticule);

function useZoomPan (_ref) {
  const { center } = _ref;
  const { onMoveStart } = _ref;
  const { onMoveEnd } = _ref;
  const { onMove } = _ref;
  const _ref$translateExtent = _ref.translateExtent;
  const translateExtent = _ref$translateExtent === undefined ? [[-Infinity, -Infinity], [Infinity, Infinity]] : _ref$translateExtent;
  const _ref$scaleExtent = _ref.scaleExtent;
  const scaleExtent = _ref$scaleExtent === undefined ? [1, 8] : _ref$scaleExtent;
  const _ref$zoom = _ref.zoom;
  const zoom$1 = _ref$zoom === undefined ? 1 : _ref$zoom;

  const _useContext = useContext(MapContext);
  const { width } = _useContext;
  const { height } = _useContext;
  const { projection } = _useContext;

  const _center = slicedToArray(center, 2);
  const lon = _center[0];
  const lat = _center[1];

  const _useState = useState({ x: 0, y: 0, k: 1 });
  const _useState2 = slicedToArray(_useState, 2);
  const position = _useState2[0];
  const setPosition = _useState2[1];

  const lastPosition = useRef({ x: 0, y: 0, k: 1 });
  const mapRef = useRef();
  const zoomRef = useRef();
  const bypassEvents = useRef(false);

  const _translateExtent = slicedToArray(translateExtent, 2);
  const a = _translateExtent[0];
  const b = _translateExtent[1];

  const _a = slicedToArray(a, 2);
  const a1 = _a[0];
  const a2 = _a[1];

  const _b = slicedToArray(b, 2);
  const b1 = _b[0];
  const b2 = _b[1];

  const _scaleExtent = slicedToArray(scaleExtent, 2);
  const minZoom = _scaleExtent[0];
  const maxZoom = _scaleExtent[1];

  useEffect(() => {
    const svg = select(mapRef.current);

    function handleZoomStart () {
      if (!onMoveStart || bypassEvents.current) return;
      onMoveStart({ coordinates: projection.invert(getCoords(width, height, event.transform)), zoom: event.transform.k }, event);
    }

    function handleZoom () {
      if (bypassEvents.current) return;
      const { transform } = event;
      const { sourceEvent } = event;

      setPosition({ x: transform.x, y: transform.y, k: transform.k, dragging: sourceEvent });
      if (!onMove) return;
      onMove({ x: transform.x, y: transform.y, k: transform.k, dragging: sourceEvent }, event);
    }

    function handleZoomEnd () {
      if (bypassEvents.current) {
        bypassEvents.current = false;
        return;
      }

      const _projection$invert = projection.invert(getCoords(width, height, event.transform));
      const _projection$invert2 = slicedToArray(_projection$invert, 2);
      const x = _projection$invert2[0];
      const y = _projection$invert2[1];

      lastPosition.current = { x, y, k: event.transform.k };
      if (!onMoveEnd) return;
      onMoveEnd({ coordinates: [x, y], zoom: event.transform.k }, event);
    }

    const zoom$1 = zoom().scaleExtent([minZoom, maxZoom]).translateExtent([[a1, a1], [b1, b2]]).on('start', handleZoomStart)
      .on('zoom', handleZoom)
      .on('end', handleZoomEnd);

    zoomRef.current = zoom$1;
    svg.call(zoom$1);
  }, [width, height, a1, a2, b1, b2, minZoom, maxZoom, projection, onMoveStart, onMove, onMoveEnd]);

  useEffect(() => {
    if (lon === lastPosition.current.x && lat === lastPosition.current.y && zoom$1 === lastPosition.current.k) return;

    const coords = projection([lon, lat]);
    const x = coords[0] * zoom$1;
    const y = coords[1] * zoom$1;
    const svg = select(mapRef.current);

    bypassEvents.current = true;

    svg.call(zoomRef.current.transform, zoomIdentity.translate(width / 2 - x, height / 2 - y).scale(zoom$1));
    setPosition({ x: width / 2 - x, y: height / 2 - y, k: zoom$1 });

    lastPosition.current = { x: lon, y: lat, k: zoom$1 };
  }, [lon, lat, zoom$1, width, height, projection]);

  return {
    mapRef,
    position,
    transformString: `translate(${position.x} ${position.y}) scale(${position.k})`,
  };
}

const ZoomableGroup = function ZoomableGroup (_ref) {
  const _ref$center = _ref.center;
  const center = _ref$center === undefined ? [0, 0] : _ref$center;
  const _ref$zoom = _ref.zoom;
  const zoom = _ref$zoom === undefined ? 1 : _ref$zoom;
  const _ref$minZoom = _ref.minZoom;
  const minZoom = _ref$minZoom === undefined ? 1 : _ref$minZoom;
  const _ref$maxZoom = _ref.maxZoom;
  const maxZoom = _ref$maxZoom === undefined ? 8 : _ref$maxZoom;
  const { translateExtent } = _ref;
  const { onMoveStart } = _ref;
  const { onMove } = _ref;
  const { onMoveEnd } = _ref;
  const { className } = _ref;
  const restProps = objectWithoutProperties(_ref, ['center', 'zoom', 'minZoom', 'maxZoom', 'translateExtent', 'onMoveStart', 'onMove', 'onMoveEnd', 'className']);

  const _useContext = useContext(MapContext);
  const { width } = _useContext;
  const { height } = _useContext;

  const _useZoomPan = useZoomPan({
    center,
    onMoveStart,
    onMove,
    onMoveEnd,
    scaleExtent: [minZoom, maxZoom],
    translateExtent,
    zoom,
  });
  const { mapRef } = _useZoomPan;
  const { transformString } = _useZoomPan;

  return React.createElement(
    'g',
    { ref: mapRef },
    React.createElement('rect', { width, height, fill: 'transparent' }),
    React.createElement('g', _extends({ transform: transformString, className: `rsm-zoomable-group ${className}` }, restProps)),
  );
};

ZoomableGroup.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  translateExtent: PropTypes.arrayOf(PropTypes.array),
  onMoveStart: PropTypes.func,
  onMove: PropTypes.func,
  onMoveEnd: PropTypes.func,
  className: PropTypes.string,
};

const Sphere = function Sphere (_ref) {
  const _ref$id = _ref.id;
  const id = _ref$id === undefined ? 'rsm-sphere' : _ref$id;
  const _ref$fill = _ref.fill;
  const fill = _ref$fill === undefined ? 'transparent' : _ref$fill;
  const _ref$stroke = _ref.stroke;
  const stroke = _ref$stroke === undefined ? 'currentcolor' : _ref$stroke;
  const _ref$strokeWidth = _ref.strokeWidth;
  const strokeWidth = _ref$strokeWidth === undefined ? 0.5 : _ref$strokeWidth;
  const _ref$className = _ref.className;
  const className = _ref$className === undefined ? '' : _ref$className;
  const restProps = objectWithoutProperties(_ref, ['id', 'fill', 'stroke', 'strokeWidth', 'className']);

  const _useContext = useContext(MapContext);
  const { path } = _useContext;

  const spherePath = useMemo(() => path({ type: 'Sphere' }), [path]);
  return React.createElement(
    Fragment,
    null,
    React.createElement(
      'defs',
      null,
      React.createElement(
        'clipPath',
        { id },
        React.createElement('path', { d: spherePath }),
      ),
    ),
    React.createElement('path', _extends({
      d: spherePath,
      fill,
      stroke,
      strokeWidth,
      style: { pointerEvents: 'none' },
      className: `rsm-sphere ${className}`,
    }, restProps)),
  );
};

Sphere.propTypes = {
  id: PropTypes.string,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
};

const Sphere$1 = memo(Sphere);

const Marker = function Marker (_ref) {
  const { coordinates } = _ref;
  const { children } = _ref;
  const { onMouseOver } = _ref;
  const { onMouseOut } = _ref;
  const { onMouseDown } = _ref;
  const { onMouseUp } = _ref;
  const { onFocus } = _ref;
  const { onBlur } = _ref;
  const _ref$style = _ref.style;
  const style = _ref$style === undefined ? {} : _ref$style;
  const _ref$className = _ref.className;
  const className = _ref$className === undefined ? '' : _ref$className;
  const restProps = objectWithoutProperties(_ref, ['coordinates', 'children', 'onMouseOver', 'onMouseOut', 'onMouseDown', 'onMouseUp', 'onFocus', 'onBlur', 'style', 'className']);

  const _useContext = useContext(MapContext);
  const { projection } = _useContext;

  const _useState = useState(false);
  const _useState2 = slicedToArray(_useState, 2);
  const isPressed = _useState2[0];
  const setPressed = _useState2[1];

  const _useState3 = useState(false);
  const _useState4 = slicedToArray(_useState3, 2);
  const isFocused = _useState4[0];
  const setFocus = _useState4[1];

  const _projection = projection(coordinates);
  const _projection2 = slicedToArray(_projection, 2);
  const x = _projection2[0];
  const y = _projection2[1];

  function handleMouseEnter (evt) {
    setFocus(true);
    if (onMouseOver) onMouseOver(evt);
  }

  function handleMouseLeave (evt) {
    setFocus(false);
    if (isPressed) setPressed(false);
    if (onMouseOut) onMouseOut(evt);
  }

  function handleFocus (evt) {
    setFocus(true);
    if (onFocus) onFocus(evt);
  }

  function handleBlur (evt) {
    setFocus(false);
    if (isPressed) setPressed(false);
    if (onBlur) onBlur(evt);
  }

  function handleMouseDown (evt) {
    setPressed(true);
    if (onMouseDown) onMouseDown(evt);
  }

  function handleMouseUp (evt) {
    setPressed(false);
    if (onMouseUp) onMouseUp(evt);
  }

  return React.createElement(
    'g',
    _extends({
      transform: `translate(${x}, ${y})`,
      className: `rsm-marker ${className}`,
      onMouseOver: handleMouseEnter,
      onMouseOut: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      style: style[isPressed || isFocused ? isPressed ? 'pressed' : 'hover' : 'default'],
    }, restProps),
    children,
  );
};

Marker.propTypes = {
  coordinates: PropTypes.array,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};

const Line = function Line (_ref) {
  const _ref$from = _ref.from;
  const from = _ref$from === undefined ? [0, 0] : _ref$from;
  const _ref$to = _ref.to;
  const to = _ref$to === undefined ? [0, 0] : _ref$to;
  const { coordinates } = _ref;
  const _ref$stroke = _ref.stroke;
  const stroke = _ref$stroke === undefined ? 'currentcolor' : _ref$stroke;
  const _ref$strokeWidth = _ref.strokeWidth;
  const strokeWidth = _ref$strokeWidth === undefined ? 3 : _ref$strokeWidth;
  const _ref$fill = _ref.fill;
  const fill = _ref$fill === undefined ? 'transparent' : _ref$fill;
  const _ref$className = _ref.className;
  const className = _ref$className === undefined ? '' : _ref$className;
  const restProps = objectWithoutProperties(_ref, ['from', 'to', 'coordinates', 'stroke', 'strokeWidth', 'fill', 'className']);

  const _useContext = useContext(MapContext);
  const { path } = _useContext;

  const lineData = {
    type: 'LineString',
    coordinates: coordinates || [from, to],
  };

  return React.createElement('path', _extends({
    d: path(lineData),
    className: `rsm-line ${className}`,
    stroke,
    strokeWidth,
    fill,
  }, restProps));
};

Line.propTypes = {
  from: PropTypes.array,
  to: PropTypes.array,
  coordinates: PropTypes.array,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
  className: PropTypes.string,
};

const Annotation = function Annotation (_ref) {
  const { subject } = _ref;
  const { children } = _ref;
  const { connectorProps } = _ref;
  const _ref$dx = _ref.dx;
  const dx = _ref$dx === undefined ? 30 : _ref$dx;
  const _ref$dy = _ref.dy;
  const dy = _ref$dy === undefined ? 30 : _ref$dy;
  const _ref$curve = _ref.curve;
  const curve = _ref$curve === undefined ? 0 : _ref$curve;
  const _ref$className = _ref.className;
  const className = _ref$className === undefined ? '' : _ref$className;
  const restProps = objectWithoutProperties(_ref, ['subject', 'children', 'connectorProps', 'dx', 'dy', 'curve', 'className']);

  const _useContext = useContext(MapContext);
  const { projection } = _useContext;

  const _projection = projection(subject);
  const _projection2 = slicedToArray(_projection, 2);
  const x = _projection2[0];
  const y = _projection2[1];

  const connectorPath = createConnectorPath(dx, dy, curve);

  return React.createElement(
    'g',
    _extends({
      transform: `translate(${x + dx}, ${y + dy})`,
      className: `rsm-annotation ${className}`,
    }, restProps),
    React.createElement('path', _extends({ d: connectorPath, fill: 'transparent', stroke: '#000' }, connectorProps)),
    children,
  );
};

Annotation.propTypes = {
  subject: PropTypes.array,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  dx: PropTypes.number,
  dy: PropTypes.number,
  curve: PropTypes.number,
  connectorProps: PropTypes.object,
  className: PropTypes.string,
};

export { Annotation, ComposableMap, Geographies, Geography$1 as Geography, Graticule$1 as Graticule, Line, Marker, Sphere$1 as Sphere, ZoomableGroup, useGeographies, useZoomPan };
