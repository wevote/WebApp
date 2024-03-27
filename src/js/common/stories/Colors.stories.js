import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from '../components/Style/Colors';

export default {
  title: 'Design System/Colors - Product Brand',
};

const bluePalette = ['#E6F3FF', '#B2D6F8', '#8BBCE9', '#66A2D8', '#4187C6', '#206DB3', '#0858A1', '#074986', '#053C6D', '#042B4E'];
const steelSecondary = ['#ECF2F7', '#C8D4DF', '#A7BACD', '#87A0B9', '#6888A5', '#4E6E8E', '#3A5B7C', '#2C4A66', '#1F3A53', '#142B41'];
const redTertiary = ['#FFEDF1', '#FFC3D0', '#FF98AE', '#FA708D', '#E1516F', '#CB2649', '#AA203D', '#8B1A32', '#74162A', '#53101E'];
const orangeAccent = ['#FCEFE4', '#FBC89C', '#FBA255', '#FB7704', '#D46505', '#AC5204', '#8F4403', '#743703', '#602E02', '#442102'];

const isLight = (color) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const result = (r * 299 + g * 587 + b * 114) / 1000;
  return result > 128;
};

const ColorRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  border-bottom: 0.5px solid var(--colorSplit, ${colors.lightGrey});
  color: ${colors.darkGrey};
`;
const PrimitiveSemanticName = styled.div`
  width: 20%;
  font-family: SF Pro Text;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  padding-left: 14px;
`;

const Circle = styled.div`
  background-color: ${(props) => props.color};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  stroke-width: 2px;
  stroke: #EFEFEF;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Hex = styled.div`
  width: 20%;
  display: flex;
`;

const ColorValue = styled.div`
  width: 30%;
  background-color: ${(props) => props.color};
  color: ${(props) => `rgba(${isLight(props.color) ? '0, 0, 0' : '255, 255, 255'}, 0.80)`};
  height: 100%;
  font-family: SF Pro Text;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  display: flex;
  align-items: center;
  padding-left: 18px;
  border-bottom: 1px solid var(--colorSplit, ${(props) => props.color});
`;

const TableHeaderTitle = styled.div`
  font-weight: 600;
  color: ${colors.darkGrey};
`;

const TableColorHeader = () => (
  <ColorRowContainer style={{ backgroundColor: colors.ultraLightGrey }}>
    <PrimitiveSemanticName>
      <TableHeaderTitle>Primitive Name</TableHeaderTitle>
    </PrimitiveSemanticName>

    <PrimitiveSemanticName>
      <TableHeaderTitle>Semantic Name</TableHeaderTitle>
    </PrimitiveSemanticName>

    <Hex>
      <Circle color="#fffff" />
      <PrimitiveSemanticName>
        <TableHeaderTitle>Hex</TableHeaderTitle>
      </PrimitiveSemanticName>
    </Hex>

    <ColorValue color="#fffff">
      <TableHeaderTitle>Value</TableHeaderTitle>
    </ColorValue>
  </ColorRowContainer>
);

const ColorRow = ({ color, SemanticLabel, PrimitiveLabel, value }) => (
  <ColorRowContainer>
    <PrimitiveSemanticName>{PrimitiveLabel}</PrimitiveSemanticName>
    <PrimitiveSemanticName>{SemanticLabel}</PrimitiveSemanticName>
    <Hex>
      <Circle color={color} />
      <PrimitiveSemanticName>{color}</PrimitiveSemanticName>
    </Hex>
    <ColorValue color={color}>{value}</ColorValue>
  </ColorRowContainer>
);

ColorRow.propTypes = {
  color: PropTypes.string.isRequired,
  SemanticLabel: PropTypes.string.isRequired,
  PrimitiveLabel: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const Colors = ({ palette, title }) => (
  <div style={{  justifyContent: 'center', paddingLeft: '50px', paddingRight: '50px' }}>
    <h2 style={{ color: colors.darkGrey, fontFamily: 'SF Pro Text', fontSize: '24px', fontStyle: 'normal', fontWeight: 600 }}>{ title }</h2>

    <TableColorHeader />
    <div>
      {
        palette?.map((color, index) => (
          <ColorRow
            key={`${title}-${color}`}
            PrimitiveLabel={`${title.split('/')[0].toLowerCase()}-${(index + 1) * 100}`}
            SemanticLabel={`${title.split('/')[1].toLowerCase()}-${(index + 1) * 100}`}
            color={color}
            value={(index + 1) * 100}
          />
        ))
      }
    </div>
  </div>
);

Colors.propTypes = {
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

export const AllColors = () => (
  <>
    <h1 style={{
      color: colors.darkGrey,
      fontFamily: 'SF Pro Text',
      fontSize: '38px',
      fontWeight: 600,
      paddingBottom: '36px',
      paddingTop: '26px',
      paddingLeft: '50px',
    }}
    >
      Colors - Product Brand
    </h1>

    <Colors palette={bluePalette} title="Blue/Primary" />
    <Colors palette={steelSecondary} title="Steel/Secondary" />
    <Colors palette={redTertiary} title="Red/Tertiary" />
    <Colors palette={orangeAccent} title="Orange/Accent" />
  </>
);

export const BluePrimary = () => (
  <Colors palette={bluePalette} title="Blue/Primary" />
);

export const SteelSecondary = () => (
  <Colors palette={steelSecondary} title="Steel/Secondary" />
);

export const RedTertiary = () => (
  <Colors palette={redTertiary} title="Red/Tertiary" />
);

export const OrangeAccent = () => (
  <Colors palette={orangeAccent} title="Orange/Accent" />
);
