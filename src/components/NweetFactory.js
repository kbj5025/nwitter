import React, { useState } from "react";
import { storageService, DBService } from "mybase";
import { v4 as uuidv4 } from "uuid";
import { MdAddAPhoto } from "react-icons/md";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onSubmit = async (event) => {
    if (nweet !== "") {
      event.preventDefault();
      let attachmentURL = "";
      if (attachment !== "") {
        const attachmentRef = storageService
          .ref()
          .child(`${userObj.uid}/${uuidv4()}`);
        const response = await attachmentRef.putString(attachment, "data_url");
        attachmentURL = await response.ref.getDownloadURL();
      }
      const nweetObj = {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        creatorName: userObj.displayName,
        attachmentURL,
        likeCount: 0,
        likeUsers: [],
      };
      await DBService.collection("nweet").add(nweetObj);
      setNweet("");
      setAttachment("");
      setErrorMsg("");
    } else {
      setErrorMsg("no nweet");
    }
  };

  const onClearAttachmentClick = () => {
    setAttachment("");
  };

  return (
    <form onSubmit={onSubmit} className="nweet-form">
      <input
        value={nweet}
        onChange={onChange}
        type="text"
        placeholder="What's your mind?"
        maxLength={120}
        className="nweet-input"
      />
      <input type="submit" value="nweet" className="submit-nweet" />
      <label htmlFor="fileInput" className="file-upload-btn">
        <MdAddAPhoto />
      </label>
      <p className="nweet-error-msg">{errorMsg}</p>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        id="fileInput"
        className="file-input"
      />
      {attachment && (
        <>
          <img
            src={attachment}
            width="50px"
            height="50px"
            className="attach-img"
            alt="img"
          />
          <button onClick={onClearAttachmentClick} className="delete-img">
            X
          </button>
        </>
      )}
    </form>
  );
};

export default NweetFactory;
