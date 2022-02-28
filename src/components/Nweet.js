import React, { useState } from "react";
import { updateDoc, deleteDoc, doc } from "@firebase/firestore";
import { db } from "fbase";
const Nweet = ({ nweet: { id, text }, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(text);
  const handleOnClickDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await deleteDoc(doc(db, `nweets/${id}`));
    }
  };
  const toggleEditing = () => {
    setEditing((prevEditing) => !prevEditing);
  };
  const handleOnChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, `nweets/${id}`), {
      text: newNweet,
    });
    setEditing(false);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={handleOnSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              onChange={handleOnChange}
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <h4>{text}</h4>
      )}
      {isOwner && (
        <>
          <button onClick={handleOnClickDelete}>Delete Nweet</button>
          <button onClick={toggleEditing}>Edit Nweet</button>
        </>
      )}
    </div>
  );
};
export default Nweet;
