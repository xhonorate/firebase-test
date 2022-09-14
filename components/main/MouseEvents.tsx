import { useEventListener } from "@chakra-ui/hooks";
import { ThreeEvent } from "@react-three/fiber"
import React, { useRef, useState, createContext, useContext, useCallback } from "react"
import { UnitData } from './Units';
import { GameContext } from './RoomInstance';
import { cubeDistance, indexToHex } from './helpers/hexGrid';
import { TileData } from './three/Tiles/Tile';

export type Target = {
  type: 'unit',
  val: UnitData,
  ref?: any;
} | {
  type: 'tile',
  val: TileData,
  ref?: any;
}

interface TargetContextProps {
  target: Target;
  setTarget: (target: Target) => void;
  hovered: any;
  setHovered: any;
}

export const TargetContext = createContext<TargetContextProps>({
  target: null,
  setTarget: null,
  hovered: null,
  setHovered: null,
});

// Pass with {...useTarget()} to Three mesh or group, enables target selection and hover effects
export function useTarget(type?: Target['type'], val?: Target['val']) {
  const ref = useRef()
  const { target, setTarget, setHovered } = useContext(TargetContext)
  const { data, update } = useContext(GameContext) // Is this inefficient?
  
  // Hover Events
  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    // Only select first target
    event.stopPropagation();
    setHovered([ref.current])
  }, [setHovered])
  const onPointerOut = useCallback(() => setHovered(state => state.filter(mesh => mesh !== ref.current)), [setHovered])

  // Click Events
  const onClick = useCallback((event: ThreeEvent<PointerEvent>) => {
    // If onClick has val
    if (val) {
      // Only select first target
      event.stopPropagation();
      if (target?.type === 'unit') {
        const unit = target?.val;
        // Unit actions
        if (type === 'tile') {
          // Unit clicking on tile
          const tile = val;
          update({
            ["/units/" + unit.uid + "/moves"]:
              unit.moves - cubeDistance(tile['hex'], indexToHex(unit.hexIdx)),
            ["/units/" + unit.uid + "/hexIdx"]: tile['index'],
          });
        }
      } else {
        // Tile or nothing selected, select whatever is clicked on
        //@ts-ignore
        setTarget({type, val, ref: ref.current});
      }
    }
  }, [val, target?.type, target?.val, type, update, setTarget]);
  return { ref, onPointerOver, onPointerOut, onClick }
}

// Wrapper for FX and targets that will use useTarget
const TargetWrapper = ({ children }) => {
  const [target, setTarget] = useState(null)
  const [hovered, setHovered] = useState([])

  // TODO: add pause menu
  // Deselect Tile on Escape key press
  useEventListener("keyup", (e: KeyboardEvent) => {
    if (["27", "Escape"].includes(String(e.key))) {
      setTarget(null);
    }
  });
  
  return (
    <TargetContext.Provider value={{target, setTarget, hovered, setHovered }}>
      {children}
    </TargetContext.Provider>
  )
}

export default TargetWrapper