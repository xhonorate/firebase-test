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

export interface GameData {
  created: firebase.firestore.Timestamp;
  started: boolean;
  finished: boolean;
  settings: GameSettings;
  participants: { id: string; name: string; connected: boolean }[];
}

const GameLobby = ({ userData }) => {
  const {
    data,
    update: updateGame,
    deleteDocument,
  } = useDocument<GameData>("games/" + userData?.active_game, { listen: true });
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
      deleteDocument();
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
      updateGame({ started: true });
    } catch (e) {
      console.warn(e);
    }
  }, [updateGame]);

  return (
    <VStack m={4} align={"start"}>
      {data?.started ? (
        <Room
          playerIndex={playerIndex}
          id={data.id}
          updateGame={updateGame}
          participants={data.participants}
          settings={ // Get all default game options for those not set, replace with populated options from database if set
            {
            ...gameSettingOptions.reduce( // Default for all game options
              (obj, item) => ((obj[item.key] = item.default), obj),
              {}
            ),
            ...data.settings, // Override with any set values
          }}
        />
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
              playerIndex !== 0 || data.participants.length !== data.settings.numPlayers
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
