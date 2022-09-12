import React, { useContext, useMemo, useState } from "react";
import { GameContext } from "../../RoomInstance";
import { UnitData } from "../../Units";
import { Circle, Edges, Effects, Instance, Instances } from "@react-three/drei";
import { tileSize, heightScale, playerColors } from '../Tiles/Tile';
import { MeshProps } from "@react-three/fiber";
import {
  cubeToPos,
  indexToHex,
  hexToIndex,
  cubeNeighbor,
  HexCoords,
  includesHex,
  cubeDistance,
} from "../../helpers/hexGrid";
import { motion } from "framer-motion-3d";

// Bredth-first search (aka. flood fill)
// Pass condition to be run on HexCoord - return true if hex should be walkable, false if not
// Return array of all hexes which can be reached from given start hex with set num of moves
function reachableHexes(
  start: HexCoords,
  moves: number,
  passable: (hex: HexCoords) => boolean
) {
  const visited = [start]; // set of hexes, add start to visited
  const fringes = []; // array of arrays of hexes
  fringes.push([start]);

  for (let k = 1; k <= moves; k++) {
    fringes.push([]);
    fringes[k - 1].forEach((hex: HexCoords) => {
      for (let dir = 0; dir < 6; dir++) {
        const neighbor = cubeNeighbor(hex, dir);
        if (!includesHex(visited, neighbor) && passable(neighbor)) {
          visited.push(neighbor);
          fringes[k].push(neighbor);
        }
      }
    });
  }
  return visited;
}

// Range and action indicators
export default function UnitControls({
  uid,
  owner,
  type,
  level,
  moves,
  actions,
  range,
  hp,
  hexIdx,
}: UnitData) {
  const { data, update, playerIndex } = useContext(GameContext);

  // Only show controls for units you own
  if (owner !== playerIndex || !data) {
    return null;
  }

  // Get hexes with units currently on them
  const occupiedHexes: { [hexIndex: number]: UnitData } = Object.values(
    data.units
  ).reduce((prev, unit) => {
    return { ...prev, [unit.hexIdx]: unit };
  }, {});

  // Array of hexes in range for this unit -- uses bredth first pathfinding
  const hexesInRange: HexCoords[] = reachableHexes(
    indexToHex(hexIdx),
    moves,
    (hex: HexCoords) => {
      const hexIndex = hexToIndex(hex);
      // If tile is out of bounds of the map
      if (hexIndex >= data.board.tiles.length) {
        return false;
      }
      // If tile is occupied
      if (hexIndex in occupiedHexes) {
        return false;
      }
      return true;
    }
  );

  // Unit actions ON CURRENT HEX, show in HUD -> unitControls
  return (
    <Instances>
      <circleGeometry args={[tileSize, 6]} />
      <motion.meshStandardMaterial
        whileHover={{
          opacity: 1,
        }}
        depthTest={false}
        transparent={true}
        opacity={0.5}
        color={playerColors[playerIndex]}
      />
      {hexesInRange.map((hex, idx) => {
        const pos = cubeToPos(hex);
        const height = data.board.tiles[hexToIndex(hex)].height * heightScale;

        return (
          <Instance
            key={idx}
            onClick={(e) => {
              // TODO: different actions based on type of target
              //TODO: clipping issue, render order?
              // Move Unit to target
              e.stopPropagation();

              update({
                ["/units/" + uid + "/moves"]:
                  moves - cubeDistance(hex, indexToHex(hexIdx)),
                ["/units/" + uid + "/hexIdx"]: hexToIndex(hex),
              });
            }}
            position={[pos[0] * tileSize, 0.6 + height, pos[2] * tileSize]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          />
        );
      })}
    </Instances>
  );
}
