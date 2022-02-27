import { AuthService, DBService } from "mybase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Nweet from "components/Nweet";

const Profile = ({ userObj, refreshUserObj }) => {
  const [nweetArray, setNweetArray] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const history = useHistory();

  const onLogoutClick = () => {
    AuthService.signOut();
    history.push("/");
  };

  const getMyNweetes = () => {
    const unsubscribe = DBService.collection("nweet")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweetArray(nweetArray);
      });
    return unsubscribe;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUserObj(newDisplayName);
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  useEffect(() => {
    const unsubscribe = getMyNweetes();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <form onSubmit={onSubmit} className="edit-profile-form">
        <input
          type="text"
          value={newDisplayName}
          placeholder="Display name"
          onChange={onChange}
          className="new-username-input"
        />
        <button type="submit" className="submit-username">
          수정
        </button>
        <button onClick={onLogoutClick} className="logout">
          logout
        </button>
      </form>
      <div className="nweet-container">
        {nweetArray &&
          nweetArray.map((NW) => (
            <Nweet
              key={NW.id}
              nweetObj={NW}
              isUserLike={NW.likeUsers.includes(userObj.uid)}
              isOwner={NW.creatorId === userObj.uid}
              currentUser={userObj}
            />
          ))}
      </div>
    </>
  );
};

export default Profile;
