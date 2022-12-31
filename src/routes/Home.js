import { useState, useEffect } from "react";
import { dbService, storageService } from "../fBase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Neweet from "../components/Neweet";
import NweetFactory from "../components/NweetFactory";

const Home = ({ userObj }) => {
  const [neweets, setNeweets] = useState([]);

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
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
    </div>
  );
};
export default Home;
