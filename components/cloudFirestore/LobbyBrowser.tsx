import { Text, Button, Input, Div, Icon, Modal } from "react-native-magnus";
import { useCollection, update } from "@nandorojo/swr-firestore";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import ReactTable from "../ReactTable";
import firebase from "firebase/app";
import { gameSettingOptions, GameSettings } from "./GameSettings";
import { LobbyData } from "./GameLobby";

// browse existing games
// buttons to host new game, join from list, or join from code (api endpoint meme)

// lobby passwords
// on host -> create game function, state change will handle from there

const CreateLobbyPopup = ({ username, isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState((username ?? "Guest") + "'s Room");
  const [password, setPassword] = useState("");
  const inputRef = React.useRef();

  return (
    <Modal isVisible={isOpen}>
      <Button
        bg="gray400"
        h={35}
        w={35}
        position="absolute"
        top={50}
        right={15}
        rounded="circle"
        zIndex={1000}
        onPress={onClose}
      >
        <Icon color="black900" name="close" />
      </Button>


      <Div p={50}>
        <Text mb={8} fontSize="2xl" fontWeight="bold">
          Host a Lobby
        </Text>

        <Div mb={8}>
          <Text mb={4}>Room Name</Text>
          <Input
            mb={8}
            placeholder={"Room Name"}
            value={name}
            onChangeText={setName}
            ref={inputRef}
          />
        </Div>
        <Div mb={4}>
          <Text>Password (optional)</Text>
          <Input
            mb={8}
            placeholder={"Password"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Div>

        <Div row>
          <Button bg={"gray500"} onPress={onClose}>Cancel</Button>
          <Button
            bg="blue500"
            onPress={() => {
              onSubmit({ name: name, password: password });
              onClose();
            }}
            ml={3}
          >
            Create
          </Button>
        </Div>
      </Div>
    </Modal>
  );
};

const PasswordPrompt = ({ lobbyName, target, isOpen, onClose, onSubmit }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const inputRef = React.useRef();

  //TODO: Security: switch to hash, could use axios here to api call
  const handleSubmit = useCallback(
    (silent = false) => {
      if (password === target) {
        onSubmit();
      } else if (!silent) {
        setError("Wrong Password!");
      }
    },
    [onSubmit, password, target]
  );

  useEffect(() => {
    if (!password) setError(null);
  }, [password]);

  useEffect(() => {
    handleSubmit(true);
  }, [password, handleSubmit]);

  return (
    <Modal isVisible={isOpen}>
      <Button
        bg="gray400"
        h={35}
        w={35}
        position="absolute"
        top={50}
        right={15}
        rounded="circle"
        onPress={onClose}
      >
        <Icon color="black900" name="close" />
      </Button>

      <Text fontSize="lg" fontWeight="bold">
          Join {lobbyName}
      </Text>

      <Div>
        <Div mt={4}>
          <Text>Password (optional)</Text>
          <Input
            ref={inputRef}
            value={password}
            onChangeText={setPassword}
          />
        </Div>
      </Div>

      <Div>
        <Button onPress={onClose}>Cancel</Button>
      </Div>
    </Modal>
  );
};

const LobbyBrowser = ({ userData }) => {
  // Create room modal disclosure
  const [createLobbyVisible, setCreateLobbyVisible] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(null);

  // TODO: fetch with pagination instead
  // use startafter / endbefore
  const { data, add, unsubscribe } = useCollection<LobbyData>("games", {
    parseDates: ["created"],
    where: ["finished", "==", false],
    limit: 100,
    listen: true,
  });

  // TODO: add check for participants > row.original.settings.maxPlayers
  const joinLobby = useCallback(
    (id: string) => {
      update("user_data/" + userData?.id, { active_game: id });
      update("games/" + id, {
        participants: firebase.firestore.FieldValue.arrayUnion({
          id: userData.id,
          name: userData.username ?? null,
          connected: true,
        }),
      });
      unsubscribe();
    },
    [userData, unsubscribe]
  );

  const createLobby = useCallback(
    ({ name, password }) => {
      // Create new document file for game lobby
      //TODO: check for duplicate lobby names on creation
      add({
        created: new Date(),
        finished: false,
        paused: false,
        started: false,
        settings: gameSettingOptions.reduce((prev, option) => {
          return { ...prev, [option.key]: option.default };
        }, {}) as GameSettings,
        name: name,
        password: !!password ? password : null,
        participants: [],
      }).then((id) => {
        console.log("New game lobby created!");
        joinLobby(id);
      });
    },
    [add, joinLobby]
  );

  // stored in memory for react-table
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <Text>
            {row.original.name}
            {!!row.original.password && <Icon name={'lock'} ms={2} mt={-1} />}
          </Text>
        ),
      },
      {
        Header: "Status",
        accessor: "started",
        Cell: ({ value }) => <Text>{value ? "Started" : "In Lobby"}</Text>,
      },
      {
        Header: "Players",
        accessor: "participants",
        Cell: ({ value }) => <Text>{value.length}</Text>,
      },
      {
        Header: "Date",
        accessor: "created",
        Cell: ({ value }) => <Text>{value.toLocaleString("en-US")}</Text>,
        sorttype: "datetime",
      },
      {
        accessor: "id",
        Cell: ({ value, row }) => (
          <Button
            alignSelf={'flex-end'}
            p={8}
            onPress={() => {
              if (!!row.original.password) {
                // Open password prompt if a password is set
                setPasswordPrompt(row);
              } else {
                // TODO: eventually move this to an API function for security purposes, with password input sent in req
                joinLobby(value);
              }
            }}
          >
            Join
          </Button>
        ),
      },
    ],
    [joinLobby]
  );

  return (
    <>
      {!!data && <ReactTable columns={columns} data={data} />}
      <CreateLobbyPopup
        username={userData.username}
        isOpen={createLobbyVisible}
        onClose={() => setCreateLobbyVisible(false)}
        onSubmit={({ name, password }) => {
          createLobby({ name, password });
        }}
      />
      <PasswordPrompt
        lobbyName={passwordPrompt?.original.name}
        target={passwordPrompt?.original.password}
        isOpen={passwordPrompt !== null}
        onClose={() => setPasswordPrompt(null)}
        onSubmit={() => joinLobby(passwordPrompt?.original.id)}
      />
      <Button my={4} onPress={() => setCreateLobbyVisible(true)}>
        Host
      </Button>
    </>
  );
};

export default LobbyBrowser;
