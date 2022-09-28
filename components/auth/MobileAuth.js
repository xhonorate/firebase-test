import * as React from 'react';
import {
  Text,
  View
} from 'react-native';

//TODO: convert anonymous logins to email / Oauth users after login
//https://firebase.google.com/docs/auth/web/anonymous-auth

export default function MobileAuth({firebaseConfig, auth}) {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    auth.signInAnonymously().then(() => {
      setLoading(false);
    });
  }, [auth]);
  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      {loading ? <Text>Loading...</Text>
      : <Text>Signed in!</Text>}
    </View>
  );
}