import React from 'react';
import { geoCentroid } from 'd3-geo';
import styled from 'styled-components';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from './mapChartFunctions';

import allStates from '../../../../json/allStates.json';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21],
};

const positions = {
  FL: [10, 5],
  LA: [-10, 0],
  ID: [0, 15],
};

/* eslint-disable react/prop-types */
const MapChart = (props) => (
  <ComposableMap className="map-svg" projection="geoAlbersUsa">
    <Geographies className="map-svg" geography={geoUrl}>
      {({ geographies }) => (
        <>
          {/* eslint-disable-next-line arrow-body-style */}
          {geographies.map((geo) => {
            const cur = allStates.find((s) => s.val === geo.id);
            // console.log(cur);

            return (
              <StyledGeography
                className="map-svg"
                onClick={() => props.onClickFunction(cur.id)}
                onMouseDown={() => props.onClickFunction(cur.id)}
                key={geo.rsmKey}
                stroke="#FFF"
                geography={geo}
                fill="#DDD"
              />
            );
          })}
          {geographies.map((geo) => {
            const centroid = geoCentroid(geo);
            const cur = allStates.find((s) => s.val === geo.id);
            return (
              <StyledG
                dx={positions[cur.id] ? positions[cur.id][0] : 0}
                dy={positions[cur.id] ? positions[cur.id][1] : 0}
                style={{ cursor: 'pointer' }}
                onClick={() => props.onClickFunction(cur.id)}
                onMouseDown={() => props.onClickFunction(cur.id)}
                key={`${geo.rsmKey}-name`}
              >
                {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <>
                        <StyledMarker onClick={() => props.onClickFunction(cur.id)} onMouseDown={() => props.onClickFunction(cur.id)} coordinates={centroid}>
                          <text onClick={props.onClickFunction} onMouseDown={props.onClickFunction} stroke={cur.color} y="2" fontSize={14} textAnchor="middle">
                            {cur.id}
                          </text>
                        </StyledMarker>

                      </>
                    ) : (
                      <>
                        <StyledAnnotation
                          onClick={props.onClickFunction}
                          onMouseDown={props.onClickFunction}
                          subject={centroid}
                          dx={offsets[cur.id][0]}
                          dy={offsets[cur.id][1]}
                        >
                          <text onClick={props.onClickFunction} onMouseDown={props.onClickFunction} stroke={cur.color} x={4} fontSize={14} alignmentBaseline="middle">
                            {cur.id}
                          </text>
                        </StyledAnnotation>

                      </>
                    ))}
              </StyledG>
            );
          })}
        </>
      )}
    </Geographies>
  </ComposableMap>
);

const StyledGeography = styled(Geography)`
  outline: none !important;
  :hover {
    fill: #2e3c5d !important;
    color: white !important;
    cursor: pointer !important;
    stroke: white !important;
  }
`;

const StyledG = styled.g`
  background: orange !important;
  display: block !important;
  width: 10px !important;
  height: 10px !important;
  position: relative;
  left: ${(props) => props.dx}px;
  top: ${(props) => props.dy}px;
`;

const StyledMarker = styled(Marker)`
  background: orange !important;
  display: block !important;
  width: 10px !important;
  height: 10px !important;
`;

const StyledAnnotation = styled(Annotation)`
  background: orange !important;
  display: block !important;
  width: 10px !important;
  height: 10px !important;
`;

export default MapChart;
