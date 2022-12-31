import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

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
    <div key={neweetObj.id} className="nweet">
      {editing && isOwner ? (
        <>
          <form className="container nweetEdit">
            <input
              onChange={onChange}
              type="text"
              name=""
              id=""
              value={newNeweet}
              required
            />
            <input
              type="submit"
              onClick={onSubmit}
              value="Submit"
              className="formBtn"
            />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{neweetObj.text}</h4>
          {neweetObj.attachmentUrl && (
            <img src={neweetObj.attachmentUrl} alt="avata" />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <button onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Neweet;
