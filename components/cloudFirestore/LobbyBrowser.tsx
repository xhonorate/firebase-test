
import { LockIcon } from '@chakra-ui/icons';
import { Text, Button, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogOverlay, Input, FormControl, FormLabel, FormHelperText, FormErrorMessage } from '@chakra-ui/react'
import { useCollection, update } from "@nandorojo/swr-firestore"
import React, { useMemo, useCallback, useState, ChangeEvent, useEffect } from "react";
import ReactTable from "../ReactTable"
import firebase from 'firebase/app'
import { gameSettingOptions } from './GameLobby';

// browse existing games
// buttons to host new game, join from list, or join from code (api endpoint meme)

// lobby passwords
// on host -> create game function, state change will handle from there

export interface Participant {
  id: string,
  name?: string,
  connected: boolean,
}

export interface GameData {
  created: Date,
  finished: boolean,
  started: boolean,
  name?: string,
  password?: string,
  participants: Participant[]
}

const CreateLobbyPopup = ({username, isOpen, onClose, onSubmit}) => {
  const [name, setName] = useState((username ?? 'Guest') + '\'s Room');
  const [password, setPassword] = useState('');
  const inputRef = React.useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={inputRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              onSubmit({name: name, password: password});
            }}>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Host a Lobby
              </AlertDialogHeader>

              <AlertDialogBody>
                <FormControl>
                  <FormLabel>Room Name</FormLabel>
                  <Input isRequired minLength={4} type={'text'} size={'lg'} value={name} onChange={e => setName(e.target.value)} ref={inputRef} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Password (optional)</FormLabel>
                  <Input autoComplete={'current-password'} type={'password'} size={'lg'} value={password} onChange={e => setPassword(e.target.value)} />
                </FormControl>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={onClose}>
                  Cancel
                </Button>
                <Button type={'submit'} colorScheme='blue' onClick={onClose} ml={3}>
                  Create
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )  
}


const PasswordPrompt = ({lobbyName, target, isOpen, onClose, onSubmit}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const inputRef = React.useRef();

  //TODO: Security: switch to hash, could use axios here to api call
  const handleSubmit = useCallback((silent=false) => {
    if (password === target) {
      onSubmit();
    } else if (!silent) {
      setError("Wrong Password!");
    }
  }, [onSubmit, password, target]);

  useEffect(() => {
    if (!password) setError(null);
  }, [password])

  useEffect(() => {
    handleSubmit(true);
  }, [password, handleSubmit])

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={inputRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Join {lobbyName}
              </AlertDialogHeader>

              <AlertDialogBody>
                <FormControl mt={4} isInvalid={!!error}>
                  <FormLabel>Password</FormLabel>
                  <Input ref={inputRef} autoComplete={'current-password'} size={'lg'} value={password} onChange={(e) => setPassword(e.target.value)} />
                  {!!error && <FormErrorMessage>{error}</FormErrorMessage> }
                </FormControl>                
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={onClose}>
                  Cancel
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )  
}

const LobbyBrowser = ({userData}) => {
  // Create room modal disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [passwordPrompt, setPasswordPrompt] = useState(null);

  // TODO: fetch with pagination instead
  // use startafter / endbefore
  const { data, add, unsubscribe } = useCollection<GameData>('games', {
    parseDates: ['created'],
    where: ['finished', '==', false],
    limit: 100,
    listen: true
  });

  // TODO: add check for participants > row.original.settings.maxPlayers
  const joinLobby = useCallback(
    (id: string) => {
      update('user_data/' + userData?.id, {active_game: id});
      update('games/' + id, { participants: firebase.firestore.FieldValue.arrayUnion({id: userData.id, name: userData.username ?? null, connected: true})})
      unsubscribe();
    },
    [userData, unsubscribe],
  );

  const createLobby = useCallback(
    ({name, password}) => {
      // Create new document file for game lobby
      //TODO: check for duplicate lobby names on creation
      add({
        created: new Date(),
        finished: false,
        started: false,
        settings: gameSettingOptions.map((option) => option.default),
        name: name,
        password: !!password ? password : null,
        participants: []
      }).then((id) => {
        console.log('New game lobby created!');
        joinLobby(id);
      })
    },
    [add, joinLobby]
  );

  // stored in memory for react-table
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({row}) => <Text>{row.original.name}{!!row.original.password && <LockIcon ms={2} mt={-1} />}</Text>
      },
      {
        Header: 'Status',
        accessor: 'started',
        Cell: ({value}) => <Text>{value ? 'Started' : 'In Lobby'}</Text>
      },
      {
        Header: 'Players',
        accessor: 'participants',
        Cell: ({value}) => <Text>{value.length}</Text>
      },
      {
        Header: 'Date',
        accessor: 'created',
        Cell: ({value}) => <Text>{value.toLocaleString('en-US')}</Text>,
        sorttype: 'datetime'
      },
      {
        accessor: 'id',
        Cell: ({value, row}) => <Button onClick={() => {
          if (!!row.original.password) {
            // Open password prompt if a password is set
            setPasswordPrompt(row);
          } else {
            // TODO: eventually move this to an API function for security purposes, with password input sent in req
            joinLobby(value);
          }
        }}>Join</Button>
      },
    ],
    [joinLobby],
  )
    console.log(passwordPrompt)
  return (
    <>
      {!!data && <ReactTable columns={columns} data={data} />}
      <CreateLobbyPopup 
        username={userData.username} 
        isOpen={isOpen} 
        onClose={onClose} 
        onSubmit={({name, password}) => {
          createLobby({name, password});
        }} 
      />
      <PasswordPrompt 
        lobbyName={passwordPrompt?.original.name}
        target={passwordPrompt?.original.password}
        isOpen={passwordPrompt !== null}
        onClose={() => setPasswordPrompt(null)}
        onSubmit={() => joinLobby(passwordPrompt?.original.id)}
      />
      <Button my={4} onClick={() => onOpen()}>Host</Button>
    </>
  )
}

export default LobbyBrowser