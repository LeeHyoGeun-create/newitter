import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

const Neweet = ({ neweetObj, isOwner, dbService, storageService }) => {
  const [editing, setEditing] = useState(false);
  const [newNeweet, setNewNeweet] = useState(neweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this neweet?");
    if (ok) {
      await deleteDoc(doc(dbService, "neweets", neweetObj.id));
      if (neweetObj.attachmentUrl) {
        const desertRef = ref(storageService, neweetObj.attachmentUrl);
        await deleteObject(desertRef);
      }
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const washingtonRef = doc(dbService, "neweets", neweetObj.id);
    await updateDoc(washingtonRef, {
      text: newNeweet,
    });
    toggleEditing();
  };

  const onChange = (event) => {
    setNewNeweet(event.target.value);
  };

  return (
    <div key={neweetObj.id}>
      {editing && isOwner ? (
        <>
          <form>
            <input
              onChange={onChange}
              type="text"
              name=""
              id=""
              value={newNeweet}
              required
            />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
          <input type="submit" onClick={onSubmit} value="Submit" />
        </>
      ) : (
        <>
          <h4>{neweetObj.text}</h4>
          {neweetObj.attachmentUrl && (
            <img
              src={neweetObj.attachmentUrl}
              alt="avata"
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <>
              <>
                <button onClick={onDeleteClick}>Delete Neweet</button>
                <button onClick={toggleEditing}>Edit Neweet</button>
              </>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Neweet;
