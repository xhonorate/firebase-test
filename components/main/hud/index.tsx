import { 
  Box,
  Text
} from "@chakra-ui/react";
import { useContext } from "react";
import { GameContext } from '../room';
import { indexToCoords } from '../Board';


export default function HUD ({ target=null }) {
  const { data, set, update, paused } = useContext(GameContext);
  if (!data) return null;
  return <Box w={'full'} h={'full'} position={'absolute'}>
    { !!target && JSON.stringify(data.board.tiles[target]) }
    { !!target && JSON.stringify(indexToCoords(target, data.board.size)) }
    { !!data?.turn && <Text>Turn: {data.turn}</Text>}
  </Box>
}