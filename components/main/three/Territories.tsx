import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from "three";
import { BoardState } from '../Board';
import { HexCoords, cubeNeighbor, cubeDistance, cubeToPos } from '../helpers/hexGrid';
import { playerColors } from './Tiles/Tile';

export default function Territories ({ tiles, numPlayers }: BoardState & { numPlayers: number }) {
  const [ownedHexes, setOwnedHexes] = useState<HexCoords[][]>(null);
  const justSet = useRef(false);

  // On tiles update, check if any territory has changed
  useEffect(() => {
    if (!tiles) return;

    // Prevent unneccesary calls after owned tiles were just updated
    if (justSet.current) {
      justSet.current = false;
      return;
    }
    const newOwnedHexes = Array(numPlayers);
    tiles.forEach(tile => {
      if ('owner' in tile) {
        if (!newOwnedHexes[tile.owner]) {
          // Initialize empty array
          newOwnedHexes[tile.owner] = [];
        }
        // Add to corrosponding array owner player's index
        newOwnedHexes[tile.owner].push(tile.hex);
      }
    });

    // If there have been any changes
    if (newOwnedHexes.some((hexArray, idx) => hexArray.length !== ownedHexes?.[idx]?.length)) {
      justSet.current = true;
      setOwnedHexes(newOwnedHexes);
    }
    
  }, [tiles, numPlayers, ownedHexes]);

  // Tile ownership has updated
  const territoryShapes = useMemo(() => {
    if (!ownedHexes) return null;

    /// TODO:
    /// BLARG!
    /// Not an ambiturner
    /// Instead... lets pick a hex, check if on edge
    // if so -- add point for it, otherwise step in a random direction until we reach an edge
    // register "start" edge point
    // We could map hexes to edges first ? then work with array of edges instead?
    // FOLLOW THE EDGES, not the hexes...
    //
    // remember previous --> delta of our direction
    // always attempt to increase 


    function traceBorder(hexArray: HexCoords[]) {
      function inHexArray (hex) {
        return hexArray.some((arrayItem) => hex.q === arrayItem.q && hex.r === arrayItem.r && hex.s === arrayItem.s);
      }

      let currentDir = 0;
      let current = hexArray[0];
      let next = hexArray[0];
      // Move until an edge is reached
      while (inHexArray(next)) {
        current = next;
        next = cubeNeighbor(current, 0);
      }

      let start = null;
      const points = [current];
      let safety = 1000;
      // Stop when current reaches start again
      whileLoop: while (safety && (!start || !(current.q === start.q && current.r === start.r && current.s === start.s))) {
        // Try each direction in a circle
        safety -= 1;
        for (let i = 0; i < 6; i++) {
          next = cubeNeighbor(current, (currentDir + i) % 6);
          // If there is another hex in our array in this direcion
          if (inHexArray(next)) {
            if (start === null) {
              // Store starting edge position
              start = current;
            }
            current = next;
            points.push(next); // add new hex
            currentDir += i+4; // Rotate direcion 90 degrees relative to delta
            continue whileLoop;
          }
        }
        // If we reach here, thats an issue...
        console.log("None found");
        return points;
      }

      return points;
    }

    // Pop element from hex array, then recursively pop all adjacent elements
    function recursivePop (hexArray: HexCoords[], hex: HexCoords): HexCoords[] {

      // Get all adjacent hexes
      const adjHexes = hexArray.filter((e) => cubeDistance(e, hex) < 2);

      // Check if there are any tiles left in the array adjacent to this tile
      if (!adjHexes.length) return [hex];
      
      // FIRST remove all from array
      adjHexes.forEach((adjHex: HexCoords) => {
        hexArray.splice(hexArray.indexOf(adjHex), 1)[0]
      });

      // THEN call recursive function on new hexes
      return adjHexes.reduce((prev, adjHex) => [...prev, ...recursivePop(hexArray, adjHex)], [hex]);
    }

    return ownedHexes.map((hexArray: HexCoords[], playerIndex: number) => {
      // If this player has no territory, return null
      if (!hexArray) return null;

      const groups = [];
      // Avoid mutability issues
      const clonedHexes = [...hexArray];

      while(clonedHexes.length) {
        // separate hexes into groups of connected territory
        groups.push(recursivePop(clonedHexes, clonedHexes.splice(0,1)[0]))
      }

      return (<mesh key={playerIndex} scale={1.16} rotation={[-Math.PI/2, 0, 0]} position={[0,1.5,0]}><shapeGeometry args={[
          // Draw shape of each set of territory 
          groups.map((group: HexCoords[]) => {
            // Convert to points
            const edgePoints = traceBorder(group).map((hex => cubeToPos(hex)));
            
            const territoryShape = new THREE.Shape();
            territoryShape.moveTo(edgePoints[0][0], -edgePoints[0][2]);
            edgePoints.forEach((point) => {
              territoryShape.lineTo(point[0],-point[2]);
            })
            territoryShape.lineTo(edgePoints[0][0], -edgePoints[0][2]);
            
            return territoryShape;
        }), 10]} /><meshBasicMaterial transparent={true} opacity={0.5} color={playerColors[playerIndex]} /></mesh>)
    });
  }, [ownedHexes])

  return <>{territoryShapes}</>
}