import React from "react";
import { useState, useEffect } from "react";
import { dbService } from "../fBase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { faCropSimple } from "@fortawesome/free-solid-svg-icons";

const Home = ({ userObj }) => {
  const [neweet, setNeweet] = useState("");
  const [neweets, setNeweets] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "neweets"), {
        text: neweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setNeweet("");
  };
  const onChange = (event) => {
    setNeweet(event.target.value);
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
        <input type="submit" value="Neweet" />
      </form>
      <div>
        {neweets.map((neweet) => (
          <div key={neweet.id}>
            <h4>{neweet.text}</h4>
          </div>
        ))}
      </div>
    </>
  );
};
export default Home;
