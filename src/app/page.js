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
  const [g_token, setGToken] = useState(null);
  const [socketCommand, setSocketCommand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [playingNow, setPlayingNow] = useState(null);
  const [responseState, setResponseState] = useState(null);
  const [responseQueue, setResponseQueue] = useState(null);
  const clientIdTidal = process.env.NEXT_PUBLIC_CLIENT_ID_TIDAL;
  const clientSecretTidal = process.env.NEXT_PUBLIC_CLIENT_SECRET_TIDAL;


  //console.log("from env",clientId,clientSecret,token)

  const localhost = "http://volumio.local";
  const localAPI = "http://localhost:4000";
  //var g_token = "hHY3vXOwzS0PZCJib3l2Td7vlyHgKvp7xAQiZZnCz1BBSL3B3WAjw1QPRe5U6U6D"

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
      case "addToFavourites":
        setSocketCommand({ command: "addToFavourites",  value: {
          uri: value.uri,
          title: value.title,
          service: value.service,
      }, });
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

      <TokenLogin ClientId={clientIdTidal} setToken={setToken} ClientSecret={clientSecretTidal} service={"tidal"} source={"https://auth.tidal.com/v1/oauth2/token"} setMessage={setMessage} ></TokenLogin>
  
     

      <WebSockets
        url={localhost}
        socketCommand={socketCommand}
        setResponseState={setResponseState}
        setResponseQueue={setResponseQueue}
        setMessage={setMessage}
      />




      <main className={"container"}>

        <ToastMessages message={message}/>

        <SearchVolumio setMessage={setMessage} refresh={refresh} localhost={localhost} setRefresh={setRefresh} searchTerm={searchTerm} />



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
          g_token={g_token}
          refresh={refresh}
          setRefresh={setRefresh}
          token={token}
          setPlayingNow={setPlayingNow}
          localhost={localhost}
          volumioSocketCmd={volumioSocketCmd}
          response={responseState}
          setMessage={setMessage}
          localAPI={localAPI}
          setSearchTerm={setSearchTerm}
        />


      </main>


    </div>
  );
}
