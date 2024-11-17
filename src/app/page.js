"use client"

import { useState } from "react";
import SearchVolumio from "./components/SearchVolumio";
import TokenLogin from "./components/TokenLogin";
import PlayingNow from "./components/PlayingNow";
import QueueList from "./components/QueueList";
import ToastMessages from "./components/ToastMessages";
import WebSockets from './components/WebSockets';
import DraggableDroppable from './components/DraggableDroppable';


export default function Home() {

  const [refresh, setRefresh] = useState(false)
  const [token, setToken] = useState(null);
  const [socketCommand, setSocketCommand] = useState(null);
  const [message, setMessage] = useState(null);
  const [playingNow, setPlayingNow] = useState(null);
  const [responseState, setResponseState] = useState(null);
  const [responseQueue, setResponseQueue] = useState(null);
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  //console.log("from env",clientId,clientSecret,token)

  const localhost = "http://volumio.local";

  // Function to handle different player controls using WebSocket commands
  function volumioSocketCmd(command, value = null) {
    
    switch (command) {
      case "play":
      case "pause":
      case "unmute":
      case "mute":
      case "stop":
      case "prev":
      case "next":
        setSocketCommand(command);
        break;
      case "seek":
        if (value !== null) setSocketCommand(`seek ${value}`);
        break;
      case "random":
        setSocketCommand({ command: "setRandom", value: { value } });
        break;
      case "repeat":
        setSocketCommand({ command: "setRepeat", value: { value } });
        break;
      case "volume":
        setSocketCommand({ command: "volume", value: value });
        break;
      case "getQueue":
        console.log("Setting socket command to getQueue"); // Debug log
        setSocketCommand(command); // Should trigger getQueue in WebSockets.js
        break;
      case "getState":
        setSocketCommand(command);
        break;
      case "removeFromQueue":
        setSocketCommand({ command: "removeFromQueue", value: value });
        break;
      case "addToQueue":
        setSocketCommand({ command: "addToQueue", uri: value });
        break;
      case "moveQueue":
        setSocketCommand({ command: "moveQueue", from: value.from, to: value.to });
        break;
      default:
        console.error("Unknown command");
    }
    
  }

  return (
    <div className={"whole"}>

<DraggableDroppable> </DraggableDroppable>


      <TokenLogin ClientId={clientId} token={token} setToken={setToken} ClientSecret={clientSecret} setMessage={setMessage} ></TokenLogin>

      <WebSockets
        url={localhost}
        socketCommand={socketCommand}
        setResponseState={setResponseState}
        setResponseQueue={setResponseQueue}
        setMessage={setMessage}
      />




      <main className={"container"}>

        <ToastMessages message={message}/>

        <SearchVolumio setMessage={setMessage} refresh={refresh} localhost={localhost} setRefresh={setRefresh} />



        <QueueList
          onMove={volumioSocketCmd}
          refresh={refresh}
          setRefresh={setRefresh}
          token={token}
          response={responseQueue}
          playingNow={playingNow}
          localhost={localhost}
          setMessage={setMessage}
          volumioSocketCmd={volumioSocketCmd}
        />
        <PlayingNow
          refresh={refresh}
          setRefresh={setRefresh}
          token={token}
          setPlayingNow={setPlayingNow}
          localhost={localhost}
          volumioSocketCmd={volumioSocketCmd}
          response={responseState}
          setMessage={setMessage}
        />


      </main>


    </div>
  );
}
