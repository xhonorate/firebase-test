import { useThree, useFrame, context, extend } from "@react-three/fiber"
import { useRef, useState, useMemo, useEffect, createContext, useContext, useCallback } from "react"
import { Vector2 } from "three"
import { EffectComposer, FXAAShader, OutlinePass, RenderPass, ShaderPass } from "three-stdlib"

extend({ EffectComposer, RenderPass, OutlinePass, ShaderPass })

const OutlineContext = createContext(null);

export function useHover() {
  const ref = useRef()
  const setHovered = useContext(OutlineContext)
  const onPointerOver = useCallback(() => setHovered(state => [...state, ref.current]), [])
  const onPointerOut = useCallback(() => setHovered(state => state.filter(mesh => mesh !== ref.current)), [])
  return { ref, onPointerOver, onPointerOut }
}

const Outline = ({ children }) => {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef(null)
  const [hovered, set] = useState([])
  const aspect = useMemo(() => new Vector2(size.width, size.height), [size])
  useEffect(() => composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  console.log(hovered);
  return (
    <OutlineContext.Provider value={set}>
      {children}
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" args={[scene, camera]} />
        <outlinePass
          attachArray="passes"
          args={[aspect, scene, camera]}
          selectedObjects={hovered}
          visibleEdgeColor="white"
          edgeStrength={50}
          edgeThickness={10}
        />
        <shaderPass attachArray="passes" args={[FXAAShader]} uniforms-resolution-value={[1 / size.width, 1 / size.height]} />
      </effectComposer>
    </OutlineContext.Provider>
  )
}

export default Outline