import { DBService } from "mybase";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweetes, setNweetes] = useState([]);

  const getNweetes = () => {
    const unsubscribe = DBService.collection("nweet")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweetes(nweetArray);
      });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getNweetes();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="nweet-container">
      <NweetFactory userObj={userObj} />
      {nweetes.map((NW) => (
        <Nweet
          key={NW.id}
          nweetObj={NW}
          isUserLike={NW.likeUsers.includes(userObj.uid)}
          isOwner={NW.creatorId === userObj.uid}
          currentUser={userObj}
        />
      ))}
    </div>
  );
};

export default Home;
