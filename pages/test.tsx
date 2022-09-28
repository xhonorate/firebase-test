import React, { createRef, useReducer, useState } from 'react'
import { indexToHex, hexToIndex, cubeDistance, adjacentIndexes } from '../components/main/helpers/hexGrid';
import { Div, Text, Tooltip, Toggle, Icon, TooltipRef } from 'react-native-magnus';
import NumberInput from '../styles/components/NumberInput';

function cubeToPos (hex, scale, count) {
  return { 
    left: scale / 2.0 + (scale / (3* Math.sqrt(count))) * (Math.sqrt(3) * hex.q + Math.sqrt(3)/2 * hex.r), 
    top: scale / 2.0 + (scale / (3* Math.sqrt(count))) * (3/2) * hex.r
  };
}

export default function Test () {
  const [indexInput, setIndexInput] = useState(0);
  const [hexInput, setHexInput] = useState({q: 0, r: 0, s: 0})

  const [view, toggleView] = useReducer(((view) => !view), false);

  const adj = adjacentIndexes(indexInput);

  return <Div>
    <Div row m={4} alignItems={'center'}>
      <Text variant={'heading'}>{'Index: '}</Text>
      <NumberInput min={0} max={500} ms={4} value={indexInput} setValue={(val) => {
        setIndexInput(val);
        setHexInput(indexToHex(val));
      }} />
    </Div>

    <Div py={5} flexWrap={'wrap'} row alignItems={'center'}>
      <Text variant={'heading'}>{'Hex: '}</Text>

      <NumberInput min={0} max={50} ms={4} value={hexInput.q} setValue={(val) => {
          let newHex = {...hexInput, q: parseInt(val)};
          setHexInput(newHex);
          setIndexInput(hexToIndex(newHex));
      }} />
      <NumberInput min={0} max={50} ms={4} value={hexInput.r} setValue={(val) => {
          let newHex = {...hexInput, r: parseInt(val)};
          setHexInput(newHex);
          setIndexInput(hexToIndex(newHex));
        }} />

      <NumberInput min={0} max={50} ms={4} value={hexInput.s} setValue={(val) => {
          let newHex = {...hexInput, s: parseInt(val)};
          setHexInput(newHex);
          setIndexInput(hexToIndex(newHex));
        }} />
    </Div>
    
    <Text my={4} variant={'heading'}>
      R: {Math.max(Math.abs(hexInput.q), Math.abs(hexInput.r), Math.abs(hexInput.s))}
    </Text>

    <Text my={4} variant={'heading'}>
      hexToIndex: {hexToIndex(hexInput)}
    </Text>

    <Text my={4} variant={'heading'}>
      adjacentIndexes: {JSON.stringify(adj)}
    </Text>

    <Div my={4} row alignItems={'center'}>
      <Text variant={'heading'}>
        View:
      </Text>
      <Toggle 
        circleBg={'blue500'}
        activeBg={'blue700'}
        h={20}
        w={30}
        onPress={toggleView}
        on={view}
      />
    </Div>
    { view && <Div w={'100%'} h={'100%'} p={10} ms={20} position={'relative'}>
      {[...Array(Math.max(...adj) + 1)].map((_,idx) => {
        let hex = indexToHex(idx);
        const tooltipRef = createRef<TooltipRef>();
        return <Div position={'absolute'} {...cubeToPos(hex, 200, indexInput + 1)} key={idx}>
            <Tooltip ref={tooltipRef} text={hex.q + ',' + hex.r + ',' + hex.s}>
              <Text onPress={() => tooltipRef.current.show()}>{idx}</Text>
            </Tooltip>
        </Div>
      })}
    </Div>}
  </Div>
}