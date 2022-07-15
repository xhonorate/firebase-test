import { fuego, useDocument } from '@nandorojo/swr-firestore'
import { useUser } from '../auth/useUser'

const ReadDataFromCloudFirestore = () => {
  const { user } = useUser()
  const { data, update, error } = useDocument(`user_data/${user?.id}`);

  const readData = () => {
    console.log(data);
  }

  return (
      <button onClick={readData}>Read Data From Cloud Firestore</button>
  )
}

export default ReadDataFromCloudFirestore