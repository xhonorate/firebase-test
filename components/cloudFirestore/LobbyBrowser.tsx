
import { Text } from '@chakra-ui/react'
import { useCollection } from "@nandorojo/swr-firestore"
import { useMemo } from "react";
import ReactTable from "../ReactTable"

// browse existing games
// buttons to host new game, join from list, or join from code (api endpoint meme)

// lobby passwords
// on host -> create game function, state change will handle from there


const LobbyBrowser = () => {
  // TODO: fetch with pagination instead
  const { data, add } = useCollection('games', {
    parseDates: ['created'],
    where: ['finished', '==', false],
    limit: 100,
    listen: true
  });

  // stored in memory for react-table (colors dep on darkmode / lightmode update)
  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
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
    ],
    [],
  )

  return (
    <>
      {JSON.stringify(data)}
      {!!data && <ReactTable columns={columns} data={data} />}
    </>
  )
}

export default LobbyBrowser