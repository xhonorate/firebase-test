import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { useUser } from '../auth/useUser'

const WriteToCloudFirestore = () => {
  const { user } = useUser()

  const sendData = () => {
      try {
          // write data here
          firebase
                .firestore()
                .collection('userData')
                .doc(user.id) // leave as .doc() for a random unique doc name to be assigned
                .set({
                    string_data: 'Benjamin Carlson',
                    number_data: 2,
                    boolean_data: true,
                    map_data: { stringInMap: 'Hi', numberInMap: 7 },
                    array_data: ['text', 4],
                    null_data: null,
                    time_stamp: firebase.firestore.Timestamp.fromDate(new Date('December 17, 1995 03:24:00')),
                    geo_point: new firebase.firestore.GeoPoint(34.714322, -131.468435)
                })
                .then(alert('Data was successfully sent to cloud firestore!'))
      } catch (error) {
          console.log(error)
          alert(error)
      }
  }

  return (
      <div style={{ margin: '5px 0' }}>
          <button onClick={sendData}>Send Data To Cloud Firestore</button>
      </div>
  )
}

export default WriteToCloudFirestore