import React, { useEffect, useCallback, useRef, useContext } from 'react'
import { GameContext, GameState } from './room';
import { TileData, tileTypes } from './three/Tile';

function procTiles(state: GameState) {
  // TODO: something with this number
  const multiplier = 20;

  // Update tiles with number of times proc'd and assign resources to owners
  state.board.tiles.forEach((tile) => {
    if (tile.odds > Math.random()*multiplier) {
      tile.procs = (tile.procs ?? 0) + 1;
      if ('owner' in tile) {
        // If the tile is owned by a player, assign its resources
        // TODO: check for city or tile upgrades, assign more/less resources
        const type = tileTypes[tile.type].name; // convert index to text name
        state.players[tile.owner].resources[type] += 1; // give 1 of related resource
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
    }, 5000);

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