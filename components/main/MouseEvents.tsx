import { useEventListener } from "@chakra-ui/hooks";
import { ThreeEvent } from "@react-three/fiber";
import React, {
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
  Ref,
  useMemo,
} from "react";

export type Target =
  | {
      type: "unit";
      val: string; //uid
      ref?: any;
    }
  | {
      type: "tile";
      val: number; //index
      ref?: any;
    };

interface TargetContextProps {
  setTarget: (target: Target) => void;
  setHovered: any;
}

export const TargetContext = createContext<TargetContextProps>({
  setTarget: null,
  setHovered: null,
});

// Pass with {...useTarget()} to Three mesh or group, enables target selection and hover effects
export function useTarget(newTarget: Target) {
  const ref = useRef();
  const { setTarget, setHovered } = useContext(TargetContext);
  //const { setUnitTarget } = useUnitActions();

  // Hover Events
  const onPointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      // Only select first target
      event.stopPropagation();
      setHovered({ ...newTarget, ref: ref.current });
    },
    [newTarget, setHovered]
  );
  //const onPointerOut = useCallback(() => setHovered(state => state.filter(mesh => mesh !== ref.current)), [setHovered])

  // Click Events
  const onClick = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      // Only select first target
      event.stopPropagation();
      setTarget({ ...newTarget, ref: ref.current });
    },
    [newTarget, setTarget]
  );
  return { ref, onPointerOver, onClick };
}

// Wrapper for FX and targets that will use useTarget
export const useTargetWrapper = () => {
  const [target, setTarget] = useState<Target>(null);
  const [hovered, setHovered] = useState<Target>(null);

  //TODO: unit actions...

  // TODO: add pause menu
  // Deselect Tile on Escape key press
  useEventListener("keyup", (e: KeyboardEvent) => {
    if (["27", "Escape"].includes(String(e.key))) {
      setTarget(null);
    }
  });

  const TargetWrapper = useMemo(() => ({children}) => (
    <TargetContext.Provider value={{ setTarget, setHovered }}>
      {children}
    </TargetContext.Provider>), []);

  return {
    target: target,
    hovered: hovered,
    TargetWrapper
  };
};
