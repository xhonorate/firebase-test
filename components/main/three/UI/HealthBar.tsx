import { Billboard, BillboardProps, GradientTexture, Plane } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import React from "react";

interface HealthBarProps extends BillboardProps {
  hp: number;
  maxHp: number;
  width?: number;
  height?: number;
}

const HealthBar = ({ hp, maxHp, width = 1, height = 0.2, ...props }: HealthBarProps) => {
  return (
    <Billboard
      follow={true}
      visible={(hp ?? maxHp) < maxHp /* only render if hp is set and less than max */}
      {...props}
    >
      <Plane args={[width, height]}>
        <meshBasicMaterial color={"black"} />
      </Plane>
      <motion.mesh
        initial={{
          z: 0.1,
          scaleX: 1,
          x: 0
        }}
        animate={{
          scaleX: hp / maxHp,
          x: -(width / 2) * (1 - hp / maxHp),
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={'green'} />
      </motion.mesh>
    </Billboard>
  );
}

export default HealthBar;
