import { useState } from "react";
import AppRouter from "./AppRouter";
import { authService } from "../fBase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    // 항상 사용자 상태가 변경되면 추적함
    // useEffect에 넣은 이유는 화면에 마운트 될 때
    // 이벤트 수신기를 추가하려고 하기 때문에
    onAuthStateChanged(authService, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setIsLoggedIn(true);
        setUserObj(user);
        // ...
      } else {
        // User is signed out
        // ...
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter userObj={userObj} isLoggedIn={isloggedIn} />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Newitter</footer>
    </>
  );
}

export default App;
