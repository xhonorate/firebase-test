import {
  Text,
  Button,
  VStack,
  Stack,
  Box,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  FormControl,
  FormLabel,
  chakra,
  Heading,
} from "@chakra-ui/react";
import { update, useDocument } from "@nandorojo/swr-firestore";
import React, { useCallback, useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import Room from "../main/RoomInstance";

export interface GameSettings {
  numPlayers: number; // Max players that can join room, also min players to start game
  boardSize: number; // Max radius of tiles to spawn
  tickRate: number;
  yieldFrequency: number; // TODO: once done testing with this, move to a select of options which affect spawns
  resourceSpawns: number; // rate 1-10
  spawnStrength: number; // rate 1-10
  pointsToWin: number;
  //TODO: more board generation settings
}

export const gameSettingOptions: {
  key: string;
  label: string;
  default: number;
  min: number;
  max: number;
  step?: number;
  valueLabels?: string[]; // Pass array of strings to display based on value (will clamp to closest, last is at max)
}[] = [
  { key: "numPlayers", label: "Number of Players", default: 2, min: 1, max: 8 },
  {
    key: "boardSize",
    label: "Board Size",
    default: 7,
    min: 4,
    max: 20,
    valueLabels: ["Tiny", "Small", "Medium", "Large", "Huge"],
  },
  {
    key: "tickRate",
    label: "Turn Timer",
    default: 5000,
    min: 1000,
    max: 20000,
    valueLabels: ["Blazing", "Fast", "Medium", "Slow", "Boring"],
  },
  {
    key: "yieldFrequency",
    label: "Yield Frequency",
    default: 5,
    min: 1,
    max: 10,
    valueLabels: ["Rare", "Normal", "Frequent"],
  },
  {
    key: "resourceSpawns",
    label: "Resource Spawns",
    default: 3,
    min: 1,
    max: 10,
    valueLabels: ["Scarce", "Normal", "Abundant"],
  },
  {
    key: "spawnStrength",
    label: "Start Strength",
    default: 0,
    min: 0,
    max: 4,
    valueLabels: ["Random", "Weak", "Normal", "Strong", "Epic"],
  },
  {
    key: "pointsToWin",
    label: "Points to Win",
    default: 10,
    min: 6,
    max: 20,
  },
];

export interface GameData {
  created: firebase.firestore.Timestamp;
  started: boolean;
  finished: boolean;
  settings: GameSettings;
  participants: { id: string; name: string; connected: boolean }[];
}

const SettingsForm = ({
  settingsRecieved,
  isHost,
  onChange,
  debounce = 100,
}) => {
  const [settings, setSettings] = useState<GameSettings>(settingsRecieved); // Default to settings from Database

  useEffect(() => {
    setSettings(settingsRecieved);
  }, [settingsRecieved]);

  // Keep track of debounce
  const changeTimeout = useRef(null);

  const handleChange = ([field, value]) => {
    if (isHost) {
      const newSettings = { ...settings, [field]: value };
      setSettings(newSettings);
      if (changeTimeout.current) {
        // Clear previous timeout, so there are not multiple submits
        clearTimeout(changeTimeout.current);
      }
      // Set timeout for update to debounce rate
      changeTimeout.current = setTimeout(() => {
        console.log("Settings Updated");
        onChange(newSettings);
      }, debounce);
    }
  };

  return (
    <Box py={4}>
      <Heading>Settings</Heading>
      <Stack minW={300} dir={"column"} spacing={4} pt={2}>
        {gameSettingOptions.map((option) => {
          // Use default form value if not set in DB
          const value = settings?.[option.key] ?? option.default;

          return (
            <FormControl key={option.key}>
              <Stack dir={"row"}>
                <Text>
                  {option.label}
                  {": "}
                  {
                    <chakra.span as={"b"}>
                      {option?.valueLabels?.[
                        Math.floor(
                          ((value - option.min) / (option.max - option.min)) *
                            (option.valueLabels.length - 1)
                        )
                      ] ?? value}
                    </chakra.span>
                  }
                </Text>

                <Slider
                  isDisabled={!isHost}
                  min={option.min}
                  max={option.max}
                  step={option?.step}
                  value={value}
                  aria-label="slider-ex-6"
                  onChange={(val) => handleChange([option.key, val])}
                >
                  <SliderTrack h={2} w={"full"}>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={5} />
                </Slider>
              </Stack>
            </FormControl>
          );
        })}
      </Stack>
    </Box>
  );
};

// TODO: migrate to settings
const minPlayers = 1;

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
      updateGame({
        participants: firebase.firestore.FieldValue.arrayRemove({
          id: userData.id,
          name: userData.username ?? null,
          connected: true,
        }),
      });
    }
    update("user_data/" + userData?.id, { active_game: null });

    // Note: unsubscribe() is not neccessary for useDocument
  }, [userData, updateGame, deleteDocument, data]);

  // Create a game lobby in RTDB and set status to started
  const startGame = useCallback(() => {
    updateGame({ started: true });
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
            ...gameSettingOptions.reduce(
              (obj, item) => ((obj[item.key] = item.default), obj),
              {}
            ),
            ...data.settings,
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
              debounce={2000}
            />
          )}
          <Button
            colorScheme={"green"}
            isDisabled={
              playerIndex !== 0 || data.participants.length < minPlayers
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
