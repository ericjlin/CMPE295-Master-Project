import './App.css';

import io from "socket.io-client";
import {useEffect} from 'react';

const socket = io.connect("http://localhost:3000");


function App() {
  const sendMessage = () => {
    socket.emit("send_message", {message: "Hello!"});
  };

  useEffect(() => {
    socket.on("sendNotification", (data) => {
      console.log(data);
      alert(data);
    });
  });

  return (
    <div className="App">
      <input placeholder="Messge..."/>
      <button onClick={sendMessage}>Send Message</button>
      {/* <h1> Message:</h1>
      {messageReceived} */}
    </div>
  );
}

export default App;
