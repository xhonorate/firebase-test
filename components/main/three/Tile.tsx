import * as THREE from "three";
import React, {
  MutableRefObject,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import Settlement from "./Settlement";
import Road from "./Road";

/* eslint-disable react-hooks/exhaustive-deps */

export function findTileTypeByName(name: string) {
  return tileTypes.find((tile) => tile.name === name);
}

export const tileTypes = [
  { name: "Water", color: "#2D719F", hovered: "#255F85" },
  { name: "Wood", color: "#23A84D", hovered: "#1F9846" },
  { name: "Brick", color: "#A30000", hovered: "#8F0000" },
  { name: "Wheat", color: "#DBA11A", hovered: "#C99418" },
  { name: "Ore", color: "#333F71", hovered: "#2C3763" },
  { name: "Sheep", color: "#4BD2BC", hovered: "#31C4AB" },
  { name: "Gold", color: "#D5CB89", hovered: "#CFC477" },
];

export const playerColors = [
  "red",
  "blue",
  "green",
  "brown",
  "purple",
  "yellow",
  "teal",
  "orange",
];

export interface HexCoords {
  q: number;
  r: number;
  s: number;
}

export interface Obj {
  type: string;
  owner?: number;
  level?: number;
}

export interface TileData {
  index?: number;
  type: number;
  hex: HexCoords;
  odds: number; //weighted likelyhood of being "rolled"
  obj?: Obj; //any building or object on this tile
  procs?: number; //how many times this tile has been "rolled", use listener
  owner?: number; //index of player owning this tile
}

type Vector = [number, number, number];

// Combine two vectors of 3 coordinates
function vectorAdd(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function cubeToPos(hex: HexCoords): Vector {
  return [
    Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r,
    0,
    (3 / 2) * hex.r,
  ];
}

export default function Tile({
  hex,
  type,
  procs,
  odds,
  obj,
  owner,
  onClick,
}: TileData & { onClick: any }) {
  const ref = useRef<THREE.Mesh>(null!);
  const pos = useMemo(() => cubeToPos(hex), [hex]);
  const { glowOpacity } = useSpring({ glowOpacity: 0 });
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  //When procs increases, this has been rolled, play animation
  useEffect(() => {
    if (procs) {
      //TODO: Switch to use framer motion's three adapter ?
      glowOpacity.start(0.9).then(() => glowOpacity.start(0));
    }
  }, [procs]);
  //useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  return (
    <>
      {type !== 0 && (
        <mesh position={pos}>
          <cylinderGeometry args={[1, 1, 0.18, 6]} />
          <animated.meshStandardMaterial
            transparent={true}
            opacity={glowOpacity}
            color={"white"}
          />
        </mesh>
      )}

      {/* Render buildings */}
      {obj && (
        <>
          {obj.type === "Settlement" && (
            <Settlement
              level={obj?.level ?? 1 /* whether settlment has been upgraded */}
              color={playerColors[obj?.owner ?? owner]}
              position={vectorAdd(pos, [0, 0.25, 0])}
            />
          )}
          {obj.type === "Road" && (
            <Road
              hex={hex}
              color={playerColors[obj?.owner ?? owner]}
              position={vectorAdd(pos, [0, 0.1, 0])}
            />
          )}
        </>
      )}

      {/* Highlighted ownership of tiles by player color */}
      {owner !== undefined && (
        <mesh position={vectorAdd(pos, [0, 0.1, 0])}>
          <cylinderGeometry args={[1, 1, 0.05, 6]} />
          <meshStandardMaterial
            transparent={true}
            opacity={0.1}
            color={playerColors[owner]}
          />
        </mesh>
      )}
      
      {/* hex has two parts, bottom/water level cylinder, then top 'tile' graduated cylinder
      TODO: Combine into one mesh
      */}
      <mesh position={vectorAdd(pos, [0, -0.2, 0])}>
        <cylinderGeometry args={[1, 1, 0.2, 6]} />
        <meshStandardMaterial
          transparent={type === 0}
          opacity={0.5}
          color={hovered ? tileTypes[type].hovered : tileTypes[type].color}
          side={THREE.FrontSide}
        />
      </mesh>
      {type !== 0 && (
        <mesh
          ref={ref}
          position={pos}
          // rotation={[0, Math.PI / 2, 0]} // Rotate with flat side up
          onClick={(event) => { if (type !== 0) onClick() }}
          onPointerOver={(event) => hover(true)}
          onPointerOut={(event) => hover(false)}
        >
          <cylinderGeometry args={[0.95 - 0.2 * odds, 1, 0.2 * odds, 6]} /*TODO: remove odds */ /> 
          <meshStandardMaterial
            color={hovered ? tileTypes[type].hovered : tileTypes[type].color}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
    </>
  );
}
