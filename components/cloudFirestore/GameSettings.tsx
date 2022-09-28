import { Div, Box, Text, Button, Select, SelectRef } from "react-native-magnus";
import React, { useEffect, useRef, useState } from "react";
import NumberInput from "../../styles/components/NumberInput";

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

export const SettingsForm = ({ settingsRecieved, isHost, onChange, debounce = 200 }) => {
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
    <Box py={8}>
      <Text variant={"heading"}>Settings</Text>
      <Div minW={300} pt={2}>
        {gameSettingOptions.map((option) => {
          // Use default form value if not set in DB
          const selectValue = settings?.[option.key] ?? option.default;
          const selectRef = React.createRef<SelectRef>();

          if (option.valueLabels) {
            return (
              <Div key={option.key}>
                <Button
                  disabled={!isHost}
                  w={'100%'}
                  borderWidth={1}
                  bg="white"
                  color="gray900"
                  borderColor="gray300"
                  onPress={() => {
                    if (selectRef.current) {
                      selectRef.current.open();
                    }
                  }}
                >
                  <Text>
                    {option.label}
                    {" - "}
                    {option.valueLabels?.[
                      Math.floor(
                        ((selectValue - option.min) / (option.max - option.min)) *
                          (option.valueLabels.length - 1)
                      )
                    ] ?? selectValue}
                  </Text>
                </Button>

                <Select
                  onSelect={(val) => handleChange([option.key, val])}
                  ref={selectRef}
                  value={selectValue}
                  multiple={false}
                  title={option.label}
                  mt="md"
                  pb="2xl"
                  roundedTop="xl"
                  data={option.valueLabels}
                  renderItem={(item, index) => (
                    <Select.Option
                      value={Math.round(
                        (index / (option.valueLabels.length - 1)) * (option.max - option.min) +
                          option.min
                      )}
                      py="md"
                      px={'lg'}
                    >
                      <Text>{item}</Text>
                    </Select.Option>
                  )}
                />
              </Div>
            );
          }

          return (
            <NumberInput
              w={'100%'}
              pre={option.label + " - "}
              key={option.key}
              min={option.min}
              max={option.max}
              step={option.step ?? 1}
              value={selectValue}
              setValue={(val) => handleChange([option.key, val])}
            />
          );
        })}
      </Div>
    </Box>
  );
};
