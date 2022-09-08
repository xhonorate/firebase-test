import React from 'react'
import AnimatedCharacter from '../gltfjsx/characters/AnimatedChar';
import { UnitData } from '../../Units';
import { indexToHex } from '../../Board';
import { cubeToPos } from '../Tiles/Tile';

export default function Unit({type, hex}: UnitData) {

  // Use ref to affect pos/rotation ... 
  // Pass group ref somehow.. oooor, just move it and have a useEffect inside of animatedChar ? 

  return (
    <AnimatedCharacter
      character={type}
      position={cubeToPos(indexToHex(hex))} //TODO: animate position
      anim={"Idle"}
      onClick={console.log} //Show options in hud?
    />
  );
}