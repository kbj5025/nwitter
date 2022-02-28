import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import Loading from "components/Loading";
import { auth } from "fBase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((User) => {
      if (User) {
        setUserObj({
          displayName: User.displayName,
          uid: User.uid,
          updateProfile: (newProfile) => {
            User.updateProfile(newProfile);
          },
        });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUserObj = (newDisplayName) => {
    setUserObj({
      displayName: newDisplayName,
      uid: userObj.uid,
      updateProfile: (newProfile) => {
        userObj.updateProfile(newProfile);
      },
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUserObj={refreshUserObj}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
