import React, { useRef, useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fBase";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [attachment, setAttachment] = useState(null);
  const fileInput = useRef();
  const [neweet, setNeweet] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (neweet === "") {
      return;
    }
    let attachmentUrl = "";
    if (attachment !== null) {
      const storageRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const snapshot = await uploadString(storageRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(snapshot.ref);
    }
    const neweetObj = {
      text: neweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    try {
      const docRef = await addDoc(collection(dbService, "neweets"), neweetObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setNeweet("");
    setAttachment(null);
    resetFileForm();
  };
  const onChange = (event) => {
    setNeweet(event.target.value);
  };

  const resetFileForm = () => {
    fileInput.current.value = "";
  };

  const onFileChange = (event) => {
    const files = event.target.files;
    const theFile = files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        setAttachment(reader.result);
      },
      false
    );
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onClearAttachment = () => {
    setAttachment(null);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            type="text"
            name=""
            id=""
            value={neweet}
            onChange={onChange}
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <label htmlFor="attach-file" className="factoryInput__label">
            <span>Add photos</span>
            <FontAwesomeIcon icon={faPlus} />
          </label>
          <input
            id="attach-file"
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={onFileChange}
            style={{
              opacity: 0,
            }}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        {attachment && (
          <div className="factoryForm__attachment">
            <img
              alt="avata"
              src={attachment}
              style={{
                backgroundImage: attachment,
              }}
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default NweetFactory;
