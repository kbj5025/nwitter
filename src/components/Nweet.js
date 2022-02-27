import { DBService, storageService, firebaseInstance } from "mybase";
import React, { useState } from "react";
import { BsFillTrashFill, BsPencilSquare } from "react-icons/bs";
import { ImCancelCircle, ImCheckmark } from "react-icons/im";
import { HiThumbUp, HiOutlineThumbUp } from "react-icons/hi";

const Nweet = ({ nweetObj, isOwner, currentUser, isUserLike }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [isLike, setIsLike] = useState(isUserLike);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await DBService.doc(`nweet/${nweetObj.id}`).delete();
      if (nweetObj.attachmentURL) {
        await storageService.refFromURL(nweetObj.attachmentURL).delete();
      }
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await DBService.doc(`nweet/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const onLikeClick = () => {
    const documentRef = DBService.collection("nweet").doc(nweetObj.id);
    if (isLike === false) {
      documentRef.update({
        likeUsers: firebaseInstance.firestore.FieldValue.arrayUnion(
          currentUser.uid
        ),
        likeCount: firebaseInstance.firestore.FieldValue.increment(1),
      });
      setIsLike(true);
    } else {
      documentRef.update({
        likeUsers: firebaseInstance.firestore.FieldValue.arrayRemove(
          currentUser.uid
        ),
        likeCount: firebaseInstance.firestore.FieldValue.increment(-1),
      });
      setIsLike(false);
    }
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <h4 className="username">{nweetObj.creatorName}</h4>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              onChange={onChange}
              className="new-nweet-input"
            />
            <button type="submit" className="submit-new-nweet">
              <ImCheckmark />
            </button>
          </form>
          <button onClick={toggleEditing} className="cancel-editing">
            <ImCancelCircle />
          </button>
        </>
      ) : (
        <>
          <h4 className="username">{nweetObj.creatorName}</h4>
          <h4 className="nweet-text">{nweetObj.text}</h4>
          {nweetObj.attachmentURL && (
            <img
              src={nweetObj.attachmentURL}
              width="110px"
              height="110px"
              className="dwitte-image"
              alt="img"
            />
          )}
          <div className="like-container">
            <button onClick={onLikeClick} className="like-button">
              {isLike ? <HiThumbUp /> : <HiOutlineThumbUp />}
            </button>
            <p className="like-count">{nweetObj.likeCount}</p>
          </div>
          {isOwner && (
            <>
              <button onClick={onDeleteClick} className="delete-nweet">
                <BsFillTrashFill />
              </button>
              <button onClick={toggleEditing} className="edit-nweet">
                <BsPencilSquare />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
