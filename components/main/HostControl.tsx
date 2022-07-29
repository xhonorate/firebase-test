import React, { useEffect, useCallback, useRef, useContext } from 'react'
import { GameContext } from './room';
import { TileData } from './three/Tile';

function procTiles(tiles: TileData[]) {
  // TODO: something with this number
  const multiplier = 10;
  tiles.forEach((tile) => {
    if (tile.odds > Math.random()*multiplier) {
      console.log('Proc!' + JSON.stringify(tile));
      tile.procs = (tile.procs ?? 0) + 1;
      //TODO: assign resources on proc
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
    // do some magic
    // give resources and stuff
    // update tiles[] with number of times proc'd
    let state = dataRef.current;
    const tiles = state.board.tiles;
    procTiles(tiles);
    update({
      board: {
        tiles: tiles,
        size: state.board.size
      }
    })
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