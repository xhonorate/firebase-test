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
  useEffect,
} from "react";
import { setUnitTarget } from "./Units";

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
  onTarget: (target: Target) => void;
  onHover: (target: Target) => void;
}

export const TargetContext = createContext<TargetContextProps>({
  onTarget: null,
  onHover: null,
});

// Pass with {...useTarget()} to Three mesh or group, enables target selection and hover effects
export function useTarget(newTarget: Target) {
  const ref = useRef();
  const { onTarget, onHover } = useContext(TargetContext);
  
  // Hover Events
  const onPointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      // Only select first target
      event.stopPropagation();
      onHover({ ...newTarget, ref: ref.current });
    },
    [newTarget, onHover]
  );

  // Click Events
  const onClick = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      // Only select first target
      event.stopPropagation();
      onTarget({ ...newTarget, ref: ref.current });
    },
    [newTarget, onTarget]
  );
  return { ref, onPointerOver, onClick };
}

// Wrapper for FX and targets that will use useTarget
export const useTargetWrapper = (id: string) => {
  const [target, setTarget] = useState<Target>(null);
  const [hovered, setHovered] = useState<Target>(null);

  // Keep track of previous target (without forcing remounts)
  const prevTarget = useRef<Target>(null);
  useEffect(() => {
    prevTarget.current = target;
  }, [target])

  //Recieve and handle updates from any objects with onHover / onTarget listeners
  const onHover = useCallback((newTarget: Target) => {
    setHovered(newTarget);
  }, []);

  const onTarget = useCallback((newTarget: Target) => {
    console.log(prevTarget.current);
    // If a unit is already selected, do unit actions
    if (prevTarget.current?.type === 'unit') {
      setUnitTarget(id, prevTarget.current.val, newTarget);
    } else {
      setTarget(newTarget);
    }
  }, []);

  // TODO: add pause menu
  // Deselect Tile on Escape key press
  useEventListener("keyup", (e: KeyboardEvent) => {
    if (["27", "Escape"].includes(String(e.key))) {
      setTarget(null);
    }
  });

  const TargetWrapper = useMemo(() => ({children}) => (
    <TargetContext.Provider value={{ onTarget, onHover }}>
      {children}
    </TargetContext.Provider>), []);

  return {
    target: target,
    hovered: hovered,
    TargetWrapper
  };
};
