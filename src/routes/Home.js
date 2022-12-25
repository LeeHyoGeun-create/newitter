import React from "react";
import { useState, useEffect } from "react";
import { dbService } from "../fBase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const Home = () => {
  const [neweet, setNeweet] = useState("");
  const [neweets, setNeweets] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "neweets"), {
        neweet,
        createdAt: Date.now(),
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
    return () => {
      isCancelled = true;
    };
  }, []);
  console.log(neweets);
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
            <h4>{neweet.neweet}</h4>
          </div>
        ))}
      </div>
    </>
  );
};
export default Home;
