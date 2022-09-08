import { chakra, Box, Text, FormControl, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

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
  { key: "numPlayers", label: "Number of Players", default: 1, min: 1, max: 8 },
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
    default: 2,
    min: 0,
    max: 4,
    valueLabels: ["Random", "Weak", "Balanced", "Strong", "Epic"],
  },
  {
    key: "pointsToWin",
    label: "Points to Win",
    default: 10,
    min: 6,
    max: 20,
  },
];


export const SettingsForm = ({
  settingsRecieved,
  isHost,
  onChange,
  debounce = 200,
}) => {
  const [settings, setSettings] = useState<GameSettings>(settingsRecieved); // Default to settings from Database

  useEffect(() => {
    if (changeTimeout.current === null) {
      // If we are recieving changes, and do not have any pending, update settings state
      setSettings(settingsRecieved);
    } 
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
        try {
          onChange(newSettings);
        } catch (e) {
          console.warn("Error in GameSettings: ", e);
        }
        changeTimeout.current = null;
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