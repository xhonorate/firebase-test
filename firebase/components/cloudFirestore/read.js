import { useUser } from '../auth/useUser'
import db from './db'

const ReadDataFromCloudFirestore = () => {
  const { user } = useUser()

  const readData = () => {
    try {
      db
        .collection('user_data')
        .doc(user.id)
        .onSnapshot(function (doc) {
            console.log(doc.data())
        })
    // alert('Data was successfully fetched from cloud firestore! Close this alert and check console for output.')
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  return (
      <button onClick={readData}>Read Data From Cloud Firestore</button>
  )
}

export default ReadDataFromCloudFirestore