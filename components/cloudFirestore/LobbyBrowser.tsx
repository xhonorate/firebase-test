
import { LockIcon } from '@chakra-ui/icons';
import { Text, Button, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogOverlay, Input, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'
import { useCollection, update } from "@nandorojo/swr-firestore"
import React, { useMemo, useCallback, useState } from "react";
import ReactTable from "../ReactTable"
import firebase from 'firebase/app'

// browse existing games
// buttons to host new game, join from list, or join from code (api endpoint meme)

// lobby passwords
// on host -> create game function, state change will handle from there

export interface Participant {
  id: string,
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

const LobbyBrowser = ({userData}) => {
  // Create room modal disclosure
  const { isOpen, onOpen, onClose } = useDisclosure()

  // TODO: fetch with pagination instead
  // use startafter / endbefore
  const { data, add, unsubscribe } = useCollection<GameData>('games', {
    parseDates: ['created'],
    where: ['finished', '==', false],
    limit: 100,
    listen: true
  });

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
        settings: {},
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
        Cell: ({row}) => <Text>{row.original.name}{!!row.original.password && <LockIcon />}</Text>
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
        Cell: ({value}) => <Button onClick={() => joinLobby(value)}>Join</Button>
      },
    ],
    [joinLobby],
  )

  return (
    <>
      {JSON.stringify(data)}
      {!!data && <ReactTable columns={columns} data={data} />}
      <CreateLobbyPopup 
        username={userData.username} 
        isOpen={isOpen} 
        onClose={onClose} 
        onSubmit={({name, password}) => {
          createLobby({name, password});
        }} 
      />
      <Button onClick={() => onOpen()}>Host</Button>
    </>
  )
}

export default LobbyBrowser