import React from "react";
import { authService, storageService } from "../fBase";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { dbService } from "../fBase.js";
import { useState } from "react";
import Neweet from "../components/Neweet";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [neweetsArray, setNeweetsArray] = useState([]);
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/", { replace: true });
  };

  const getMyNeweets = async () => {
    const q = query(
      collection(dbService, "neweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const neweetsArray = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setNeweetsArray(neweetsArray);
  };

  const onChange = (event) => {
    const value = event.target.value;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName === newDisplayName) return;
    await updateProfile(authService.currentUser, {
      displayName: newDisplayName,
    });
    refreshUser();
  };

  useEffect(() => {
    getMyNeweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name=""
          id=""
          onChange={onChange}
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      {neweetsArray.map((neweetObj) => (
        <Neweet
          neweetObj={neweetObj}
          isOwner={true}
          dbService={dbService}
          storageService={storageService}
        ></Neweet>
      ))}
    </>
  );
};
export default Profile;
