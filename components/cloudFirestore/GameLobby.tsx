import {
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { update, useDocument } from "@nandorojo/swr-firestore";
import React, { useCallback, useState, useEffect } from "react";
import firebase from "firebase/app";
import Room from "../main/RoomInstance";
import { GameSettings, gameSettingOptions, SettingsForm } from './GameSettings';
import { deleteRoom, intitializeRoom } from "../realtimeDatabase/roomFunctions";

export interface Participant {
  id: string,
  name?: string,
  connected: boolean,
}

export interface LobbyData {
  created: Date;
  started: boolean;
  finished: boolean;
  paused: boolean
  name?: string;
  password?: string;
  settings: GameSettings;
  participants: { id: string; name: string; connected: boolean }[];
}

export interface LobbyContextProps {
  id: string;
  settings: GameSettings,
  participants: Participant[];
  playerIndex: number;
  paused: boolean;
  updateGame: (data: object) => any;
}

export const LobbyContext = React.createContext<LobbyContextProps>({
  id: null,
  settings: null,
  participants: null,
  playerIndex: null,
  paused: null,
  updateGame: null
});

const GameLobby = ({ userData }) => {
  const {
    data,
    update: updateGame,
    deleteDocument,
  } = useDocument<LobbyData>("games/" + userData?.active_game, { listen: true });
  const [playerIndex, setPlayerIndex] = useState(-1); // Index of player in participants (0 is host, -1 means not found or loading)

  // Fetch player index
  useEffect(() => {
    if (!data?.participants || !Array.isArray(data.participants)) return;
    setPlayerIndex(
      data?.participants.findIndex(
        (participant) => participant.id === userData.id
      )
    );
  }, [data, userData.id]);

  // Remove use from game participants, and set current_game to null. If last to leave, delete the room
  const leaveLobby = useCallback(() => {
    if (data["participants"]?.length <= 1) {
      // If the user leaving was the only user in the lobby, delete it
      try { 
        deleteDocument();
        deleteRoom(userData?.active_game); // delete RTDB document
      } catch (e) {
        console.warn(e);
      }
    } else {
      try { 
        updateGame({
          participants: firebase.firestore.FieldValue.arrayRemove({
            id: userData.id,
            name: userData.username ?? null,
            connected: true,
          }),
        });
      } catch (e) {
        console.warn(e);
      }
    }
    update("user_data/" + userData?.id, { active_game: null });

    // Note: unsubscribe() is not neccessary for useDocument
  }, [userData, updateGame, deleteDocument, data]);

  // Create a game lobby in RTDB and set status to started
  const startGame = useCallback(() => {
    try {
      intitializeRoom(data.id, data.settings, data.participants).then(() => {
        updateGame({ started: true });
      })
    } catch (e) {
      console.warn(e);
    }
  }, [data?.id, data?.participants, data?.settings, updateGame]);

  return (
    <VStack m={4} align={"start"}>
      {data?.started ? (
        <LobbyContext.Provider value={{id: data.id, paused: data.paused, settings:  // Get all default game options for those not set, replace with populated options from database if set
          {
          ...gameSettingOptions.reduce( // Default for all game options
            (obj, item) => ((obj[item.key] = item.default), obj),
            {}
          ),
          ...data.settings, // Override with any set values
        }, participants: data.participants, playerIndex: playerIndex, updateGame}}>
          <Room />
        </LobbyContext.Provider>
      ) : (
        <>
          {data?.participants?.length &&
            data?.participants.map((participant, idx) => {
              const me = participant.id === userData.id;
              return (
                <Text key={idx} color={me ? "yellow.400" : "blue.400"}>
                  {!idx ? "Host" : "User"}:{" "}
                  {participant?.name ?? participant.id}
                  {me && " (me)"}
                </Text>
              );
            })}
          {!!data && (
            <SettingsForm
              settingsRecieved={data?.settings}
              isHost={playerIndex === 0}
              onChange={(settings: GameSettings) =>
                updateGame({ settings: settings })
              }
            />
          )}
          <Button
            colorScheme={"green"}
            isDisabled={
              playerIndex !== 0 //|| (!!data.settings.numPlayers && data.participants.length !== data.settings.numPlayers)
            }
            onClick={startGame}
          >
            Start
          </Button>
        </>
      )}
      <Button onClick={() => leaveLobby()}>Leave</Button>
    </VStack>
  );
};

export default GameLobby;
