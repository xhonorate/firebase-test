import React, { useEffect, useCallback, useRef, useContext } from 'react'
import { GameContext, GameState } from './room';
import { TileData, tileTypes } from './three/Tile';
import { cubeRing, findTileByHex } from './Board';

function procTiles(state: GameState) {
  // TODO: something with this number
  const multiplier = 20;

  // Update tiles with number of times proc'd and assign resources to owners
  state.board.tiles.forEach((tile) => {
    if (tile.type !== 0 && tile.odds > Math.random()*multiplier) {
      tile.procs = (tile.procs ?? 0) + 1;
      // If the tile is owned by a player, assign its resources
      if ('owner' in tile) {
        let amt = 1; 
        // TODO: check for city or tile upgrades, assign more/less resources
        if (tile?.obj?.type === 'City' || cubeRing(tile.hex, 1).map(hex => findTileByHex(state.board.tiles, hex)).some((tile) => !!tile && tile?.obj?.type === 'City')) {
          // If tile is city or any adjacent tile (meaning city this is attatched to) is a city, add +1 to yield
          amt += 1; 
        }
        const type = tileTypes[tile.type].name; // convert index of type to text name of type
        state.players[tile.owner].resources[type] += amt; // give amt of related resource
      }
    } 
  })    
}

export default function HostControl() {
  const { data, set, update, paused } = useContext(GameContext);

  // Store data in ref rather than state so we do not need to remount tick loop on data change
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = (data);
  }, [data])

  const hostTick = useCallback(() => {
    const state = dataRef.current;
    procTiles(state); // Update state information -- tile procs and resources
    update(state)
    //update({turn: (state.turn ?? 0) + 1 })
  }, [update]);

  // Mount ticking timer to perform server actions
  useEffect(() => {
    // If paused, do not mount ticker
    if (paused) {
      console.log("Game Paused");
      return;
    };

    console.log("Host mounted");
    const interval = setInterval(() => {
      console.log('Host Tick!');
      hostTick();
    }, 10000);

    return () => {
      // Clear ticker on dismount or pause
      console.log("Host unmounted");
      clearInterval(interval);
    }
  }, [paused, hostTick]);
  
  return (
    <>
    </>
  )
}