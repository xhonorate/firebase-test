import { Button, Div, Text } from 'react-native-magnus';
import LobbyBrowser from '../components/cloudFirestore/LobbyBrowser';
import GameLobby from '../components/cloudFirestore/GameLobby';
import { useContext } from 'react';
import { UserContext } from './auth';

export default function Home() {
  const { data, update } = useContext(UserContext);

  if (data['active_game']) {
    return <GameLobby userData={data} />
  } else {
    return <>
      <Text>Select from list:</Text>
      <LobbyBrowser userData={data} />
    </>
  }
}