import { Div, Text } from "react-native-magnus";
import FirebaseAuth from "../components/auth/FirebaseAuth";
import { useUser } from "../components/auth/useUser";
import { useDocument } from "@nandorojo/swr-firestore";
import React from "react";
import CreateUser from "../components/cloudFirestore/CreateUser";

export const UserContext = React.createContext({
  data: null,
  update: null
});

const UserDataWrapper = ({ user, children }) => {
  // SWR to pull user data
  const {
    data,
    update,
    loading,
    error,
  } = useDocument(`user_data/${user.id}`, {
    parseDates: ["created"],
    listen: true,
    onError: console.error,
  });

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (!data.exists) {
    return <CreateUser id={user.id} isAnonymous={user.isAnonymous} />;
  }

  return <UserContext.Provider value={{data, update }}>{children}</UserContext.Provider>;
};

// Render auth instead until authentication is complete
const AuthWrapper = ({ children }) => {
  const { user, loading, logout } = useUser();

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (!user) {
    return (
      <Div>
        <FirebaseAuth />
      </Div>
    );
  }

  return <UserDataWrapper user={user}>{children}</UserDataWrapper>;
};

export default AuthWrapper;
