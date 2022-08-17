import React, { useRef } from "react";
import { GroupProps } from '@react-three/fiber'
import House from "./gltfjsx/objects/house";
import Watchtower from './gltfjsx/objects/watchtower';
import Castle from './gltfjsx/objects/castle';

interface SettlementProps extends GroupProps {
  level: number,
  color: string,
}

// TODO: Import mesh, for now, just using different number of vertexies
export default function Settlement(
  {level, color, ...props}: SettlementProps
) {
  switch (level) {
    case 1:
      return <House {...props} color={color} />
    case 2:
      return <Watchtower {...props} color={color} />
    case 3:
      return <Castle {...props} color={color} />
    default:
      return null;
  }
}