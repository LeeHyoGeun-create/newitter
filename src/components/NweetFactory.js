import React, { useRef, useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fBase";
import { addDoc, collection } from "firebase/firestore";

const NweetFactory = ({ userObj }) => {
  const [attachment, setAttachment] = useState(null);
  const fileInput = useRef();
  const [neweet, setNeweet] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
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
    console.log("HI");
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
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name=""
          id=""
          value={neweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <input type="submit" value="Neweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="profile" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
    </>
  );
};

export default NweetFactory;
