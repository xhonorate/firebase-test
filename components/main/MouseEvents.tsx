import { useEventListener } from "@chakra-ui/hooks";
import { ThreeEvent, MeshProps, GroupProps } from '@react-three/fiber';
import React, { useRef, useState, createContext, useContext, useCallback, Ref } from "react"
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
  hovered: Target;
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
  const { setUnitTarget } = useUnitActions();
  
  // Hover Events
  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    // Only select first target
    event.stopPropagation();
    setHovered({...newTarget, ref: ref.current})
  }, [newTarget, setHovered])
  //const onPointerOut = useCallback(() => setHovered(state => state.filter(mesh => mesh !== ref.current)), [setHovered])

  // Click Events
  const onClick = useCallback((event: ThreeEvent<PointerEvent>) => {
    // If onClick has val
    if (newTarget.val) {
      // Only select first target
      event.stopPropagation();
      // If a unit is currently selected, perform its action
      if (target?.type === 'unit') {
        // Unit actions
        setUnitTarget(target.val, newTarget);
        setTarget(null);
      } else {
        // Tile or nothing selected, select whatever is clicked
        setTarget({...newTarget, ref: ref.current});
      }
    }
  }, [newTarget, target?.type, target?.val, setUnitTarget, setTarget]);
  return { ref, onPointerOver, onClick }
}

// Wrapper for FX and targets that will use useTarget
const TargetWrapper = ({ children }) => {
  const [target, setTarget] = useState<Target>(null)
  const [hovered, setHovered] = useState<Target>(null)

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