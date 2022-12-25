import React from "react";
import { useState } from "react";
import { dbService } from "../fBase";
import { collection, addDoc } from "firebase/firestore";

const Home = () => {
  const [neweet, setNeweet] = useState("");
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

  return (
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
  );
};
export default Home;
