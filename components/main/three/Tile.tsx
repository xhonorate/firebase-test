import * as THREE from 'three'
import React, { MutableRefObject, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/three';

/* eslint-disable react-hooks/exhaustive-deps */

export const tileTypes = [
  { name: 'Water', color: 'blue', hovered: 'darkblue' },
  { name: 'Wood', color: 'green', hovered: 'darkgreen' },
  { name: 'Brick', color: 'red', hovered: 'darkred' },
  { name: 'Wheat', color: 'yellow', hovered: 'orange' },
  { name: 'Ore', color: 'gray', hovered: '#666' },
  { name: 'Sheep', color: 'limegreen', hovered: 'teal' }
]

export interface TileData {
  type: number,
  x: number, //x-y grid pos (not graphical position)
  y: number,
  odds: number, //weighted likelyhood of being "rolled"
  obj?: any, //any building or object on this tile
  procs?: number //how many times this tile has been "rolled", use listener
  owner?: number //index of player owning this tile
}

function xyToPos(x:number, y:number): [number, number, number] {
  return [x, 0, y + (x%2) * 0.5]
}

export default function Tile({x, y, type, procs, onClick}: TileData & { onClick: any }) {
  const ref = useRef<THREE.Mesh>(null!)
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
      position={xyToPos(x,y)}
      rotation={[0,Math.PI / 2,0]}
    >
      <cylinderGeometry args={[0.65, 0.65, 0.09, 6]} />
      <animated.meshStandardMaterial transparent={true} opacity={glowOpacity} color={'white'}/>
    </mesh> }
    <mesh
      ref={ref}
      position={xyToPos(x,y)}
      rotation={[0,Math.PI / 2,0]}
      onClick={(event) => onClick()}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <cylinderGeometry args={[type === 0 ? 0.65 : 0.5, 0.65, type === 0 ? 0.1 : 0.15, 6]} />
      <meshStandardMaterial transparent={type === 0} opacity={0.5} color={hovered ? tileTypes[type].hovered : tileTypes[type].color } />
    </mesh>
    </>
  )
}