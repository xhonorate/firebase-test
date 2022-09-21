import { Billboard, BillboardProps, GradientTexture, Plane } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import React from "react";

interface HealthBarProps extends BillboardProps {
  hp: number;
  maxHp: number;
  width?: number;
  height?: number;
}

const HealthBar = ({ hp, maxHp, width = 2, height = 0.5, ...props }: HealthBarProps) => (
  <Billboard
    visible={(hp ?? maxHp) < maxHp /* only render if hp is set and less than max */}
    {...props}
  >
    <Plane args={[width, height]}>
      <meshBasicMaterial color={'black'} />
    </Plane>
    { /* <mesh>
      <motion.planeGeometry
        initial={{
          scale: 1
        }}
        animate={{
          scale: hp / maxHp
        }}
        args={[width, height]}
      />
      <meshBasicMaterial>
        <GradientTexture
          center-x={0.5}
          center-y={0.5}
          rotation={Math.PI / 2}
          stops={[0, 1]} // As many stops as you want
          colors={["red", "green"]} // Colors need to match the number of stops
          size={10} // Size is optional, default = 1024
        />
      </meshBasicMaterial>
      </mesh> */}
  </Billboard>
);

export default HealthBar;
