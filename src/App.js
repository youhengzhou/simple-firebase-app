import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBFQmKzzSrxwzXJ9Kh7JEiVTY1Wg-gXPK4",
  authDomain: "simple-firebase-app-d8a6f.firebaseapp.com",
  projectId: "simple-firebase-app",
  storageBucket: "simple-firebase-app.appspot.com",
  messagingSenderId: "964124765175",
  appId: "1:964124765175:web:62934df126e52bc150dcf2",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();
const storage = getStorage();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️Open🔥Source💬Therapy</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>If you do not post something real you will be banned from life</p>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState({ text: "", audioFile: null });

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    if (formValue.audioFile) {
      const storageRef = ref(storage, `audio/${formValue.audioFile.name}`);
      await uploadBytes(storageRef, formValue.audioFile);
      const downloadURL = await getDownloadURL(storageRef);

      await messagesRef.add({
        audioURL: downloadURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      });
    } else {
      await messagesRef.add({
        text: formValue.text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      });
    }

    setFormValue({ text: "", audioFile: null });
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue.text}
          onChange={(e) => setFormValue({ ...formValue, text: e.target.value })}
          placeholder="say something real"
        />
        <br />
        here you can also add audio files of your mixtapes
        <br />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) =>
            setFormValue({ ...formValue, audioFile: e.target.files[0] })
          }
        />
        <button
          type="submit"
          disabled={!formValue.text && !formValue.audioFile}
        >
          send
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
          alt="your face is supposed to be here"
        />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
