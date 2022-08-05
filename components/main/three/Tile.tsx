import * as THREE from 'three'
import React, { MutableRefObject, useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three';
import Settlement from './Settlement';


/* eslint-disable react-hooks/exhaustive-deps */

export const tileTypes = [
  { name: 'Water', color: 'blue', hovered: 'darkblue' },
  { name: 'Wood', color: 'green', hovered: 'darkgreen' },
  { name: 'Brick', color: 'red', hovered: 'darkred' },
  { name: 'Wheat', color: 'yellow', hovered: 'orange' },
  { name: 'Ore', color: 'gray', hovered: '#666' },
  { name: 'Sheep', color: 'limegreen', hovered: 'teal' }
]

const playerColors = [
  'red',
  'blue',
  'green',
  'brown',
  'purple',
  'yellow',
  'teal',
  'orange'
]

export interface HexCoords {
  q: number,
  r: number,
  s: number
}

export interface TileData {
  type: number,
  hex: HexCoords,
  odds: number, //weighted likelyhood of being "rolled"
  obj?: any, //any building or object on this tile
  procs?: number //how many times this tile has been "rolled", use listener
  owner?: number //index of player owning this tile
}

function cubeToPos(hex: HexCoords): [number, number, number] {
  return [Math.sqrt(3) * hex.q + Math.sqrt(3)/2 * hex.r, 0, (3/2) * hex.r];
}

export default function Tile({hex, type, procs, odds, obj, owner, onClick}: TileData & { onClick: any }) {
  const ref = useRef<THREE.Mesh>(null!)
  const pos = useMemo(() => cubeToPos(hex), [hex]);
  const { glowOpacity } = useSpring({ glowOpacity: 0 });
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  //When procs increases, this has been rolled, play animation
  useEffect(() => {
    if (procs) {
      glowOpacity.start(0.8).then(() => glowOpacity.start(0));
    }
  }, [procs]);
  //useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  return (
    <>
    { type !== 0 && <mesh
      position={pos}
    >
      <cylinderGeometry args={[1, 1, 0.15, 6]} />
      <animated.meshStandardMaterial transparent={true} opacity={glowOpacity} color={'white'}/>
    </mesh> }

    { /* Render buildings */ }
    { obj && obj.type === 'settlement' && <>
      <Settlement color={playerColors[owner]} position={pos} />
    </>}

    { /* Highlighted ownership of tiles by player color */ }
    { owner !== undefined && <mesh
      position={[pos[0], pos[1] + 0.05, pos[2]]}
    >
      <cylinderGeometry args={[1, 1, 0.05, 6]} />
      <meshStandardMaterial transparent={true} opacity={0.1} color={playerColors[owner]}/>
    </mesh> }



    <mesh
      ref={ref}
      position={pos}
      // rotation={[0, Math.PI / 2, 0]} // Rotate with flat side up
      onClick={(event) => onClick()}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <cylinderGeometry args={[type === 0 ? 1 : 0.85, 1, type === 0 ? 0.1 : odds* 0.15, 6] /* TODO: remove odds here */ } />
      <meshStandardMaterial
        transparent={type === 0}
        opacity={0.5}
        color={hovered ? tileTypes[type].hovered : tileTypes[type].color}
        side={THREE.FrontSide}
      />
    </mesh>
    </>
  )
}