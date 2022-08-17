import React, { useEffect, useCallback, useRef, useContext } from 'react'
import { GameContext, GameState } from './RoomInstance';
import { resourceTypes } from './three/Tiles/Tile';
import { cubeRing, findTileByHex } from './Board';
import { GameSettings } from '../cloudFirestore/GameLobby';

function procTiles(state: GameState, frequency: number) {
  // TODO: something with this number
  const multiplier = 25 - frequency;

  // Update tiles with number of times proc'd and assign resources to owners
  state.board.tiles.forEach((tile) => {
    if (tile.type !== 0 && tile.odds > Math.random()*multiplier) {
      tile.procs = (tile.procs ?? 0) + 1;
      // If the tile is owned by a player, assign its resources
      if ('owner' in tile) {
        let amt = 1; 
        // TODO: check for city or tile upgrades, assign more/less resources
        if (tile?.obj?.level > 1 || cubeRing(tile.hex, 1).map(hex => findTileByHex(state.board.tiles, hex)).some((tile) => !!tile && tile?.obj?.level > 1)) {
          // If tile is city or any adjacent tile (meaning city this is attatched to) is a city, add +1 to yield
          amt += 1; 
        }
        
        if (state.players[tile.owner]) {
          const type = resourceTypes[tile.type].name; // convert index of type to text name of type
          state.players[tile.owner].resources[type] += amt; // give amt of related resource
        }
      }
    } 
  })    
}

export default function HostControl(settings: GameSettings) {
  const { data, set, update, paused } = useContext(GameContext);

  // Store data in ref rather than state so we do not need to remount tick loop on data change
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = (data);
  }, [data])

  const hostTick = useCallback(() => {
    const state = dataRef.current;
    procTiles(state, settings.yieldFrequency); // Update state information -- tile procs and resources
    update(state)
    //update({turn: (state.turn ?? 0) + 1 })
  }, [update, settings.yieldFrequency]);

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
    }, settings.tickRate ?? 5000);

    return () => {
      // Clear ticker on dismount or pause
      console.log("Host unmounted");
      clearInterval(interval);
    }
  }, [paused, hostTick, settings.tickRate]);
  
  return (
    <>
    </>
  )
}