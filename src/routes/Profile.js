import { auth } from "fbase";
import React from "react";
import { useHistory } from "react-router";
const Profile = () => {
  const history = useHistory();
  const handleOnLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };
  return (
    <>
      <button onClick={handleOnLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
