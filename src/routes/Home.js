import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { dbService, storageService } from "../fBase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Neweet from "../components/Neweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [neweet, setNeweet] = useState("");
  const [neweets, setNeweets] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const fileInput = useRef();

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

  const resetFileForm = () => {
    console.log("HI");
    fileInput.current.value = "";
  };

  useEffect(() => {
    let isCancelled = false;
    (async function fetchDate() {
      const querySnapshot = await getDocs(collection(dbService, "neweets"));
      if (!isCancelled) {
        querySnapshot.forEach((document) => {
          const neweetsObj = {
            ...document.data(),
            id: document.id,
          };
          setNeweets((prev) => [neweetsObj, ...prev]);
        });
      }
    })();
    const q = query(
      collection(dbService, "neweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      // const neweetArray = [];
      // querySnapshot.forEach((doc) => {
      //   neweetArray.push(doc.data());
      // });
      const neweetsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNeweets(neweetsArray);
    });
    return () => {
      isCancelled = true;
    };
  }, []);

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
      <div>
        {neweets.map((neweet) => (
          <Neweet
            dbService={dbService}
            key={neweet.id}
            neweetObj={neweet}
            isOwner={neweet.creatorId === userObj.uid}
            storageService={storageService}
          />
        ))}
      </div>
    </>
  );
};
export default Home;
