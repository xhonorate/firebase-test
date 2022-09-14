import { useEventListener } from "@chakra-ui/hooks";
import { ThreeEvent } from "@react-three/fiber"
import React, { useRef, useState, createContext, useContext, useCallback } from "react"
import { UnitData, useUnitActions } from './Units';
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
export function useTarget(newTarget: Target) {
  const ref = useRef()
  const { target, setTarget, setHovered } = useContext(TargetContext)
  const { unitAction } = useUnitActions();
  
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
    if (newTarget.val) {
      // Only select first target
      event.stopPropagation();
      // If a unit is currently selected, perform its action
      if (target?.type === 'unit') {
        // Unit actions
        unitAction(target.val, newTarget);
      } else {
        // Tile or nothing selected, select whatever is clicked
        setTarget({...newTarget, ref: ref.current});
      }
    }
  }, [newTarget, target?.type, target.val, unitAction, setTarget]);
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