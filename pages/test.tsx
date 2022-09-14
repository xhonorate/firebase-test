import { HStack, Text, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Switch, VStack, Box, Tooltip } from '@chakra-ui/react';
import React, { useReducer, useState } from 'react'
import { indexToHex, hexToIndex, cubeDistance, adjacentIndexes } from '../components/main/helpers/hexGrid';

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

  return <VStack align={'start'} p={5}>
    <HStack>
      <Text>{'Index: '}</Text>
      <NumberInput min={0} w={'200px'} value={indexInput} onChange={(val) => {
          setIndexInput(parseInt(val));
          setHexInput(indexToHex(parseInt(val)));
        }}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </HStack>

    <HStack py={5}>
      <Text>{'Hex: '}</Text>
      <NumberInput w={'200px'} value={hexInput.q} onChange={(val) => {
          let newHex = {...hexInput, q: parseInt(val)};
          setHexInput(newHex);
          setIndexInput(hexToIndex(newHex));
        }}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <NumberInput w={'200px'} value={hexInput.r} onChange={(val) => {
          let newHex = {...hexInput, r: parseInt(val)};
          setHexInput(newHex);
          setIndexInput(hexToIndex(newHex));
        }}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <NumberInput w={'200px'} value={hexInput.s} onChange={(val) => {
          let newHex = {...hexInput, s: parseInt(val)};
          setHexInput(newHex);
          setIndexInput(hexToIndex(newHex));
        }}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </HStack>
    
    <Box>
      R: {Math.max(Math.abs(hexInput.q), Math.abs(hexInput.r), Math.abs(hexInput.s))}
    </Box>

    <Box>
      hexToIndex: {hexToIndex(hexInput)}
    </Box>

    <Box>
      adjacentIndexes: {JSON.stringify(adj)}
    </Box>

    <Box>View: <Switch isChecked={view} onChange={toggleView} /></Box>
    { view && <Box w={'500px'} h={'500px'} position={'relative'}>
      {[...Array(Math.max(...adj) + 1)].map((_,idx) => {
        let hex = indexToHex(idx);
        return <Box position={'absolute'} {...cubeToPos(hex, 500, indexInput)} key={idx}><Tooltip label={hex.q + ',' + hex.r + ',' + hex.s}><Text color={idx === indexInput ? 'blue' : adj.includes(idx) ? 'orange' : 'unset'}>{idx}</Text></Tooltip></Box>
      })}
    </Box>}
  </VStack>
}