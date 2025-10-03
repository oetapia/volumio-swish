"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import SearchVolumio from "./components/SearchVolumio";
import TokenLogin from "./components/TokenLogin";
import PlayingNow from "./components/PlayingNow";
import LyricsNow from "./components/LyricsNow";
import QueueList from "./components/QueueList";
import ToastMessages from "./components/ToastMessages";
import WebSockets from './components/WebSockets';
import DraggableDroppable from './components/DraggableDroppable';

export default function Home() {
  const searchParams = useSearchParams();

// Read values from URL with defaults
const initQueuePanel =
  searchParams.get("queuePanel") !== null
    ? searchParams.get("queuePanel") === "true"
    : true; // default true

const initLyricsPanel =
  searchParams.get("lyricsPanel") !== null
    ? searchParams.get("lyricsPanel") === "true"
    : false; // default false

const initLyricsSize = searchParams.get("lyricsSize") || ""; // default empty string

const initLyricsState =
  searchParams.get("lyricsState") !== null
    ? searchParams.get("lyricsState") === "true"
    : false; // default false


  // Panels & UI states
  const [lyricsPanel, setLyricsPanel] = useState(initLyricsPanel);
  const [queuePanel, setQueuePanel] = useState(initQueuePanel);
  const [lyricsSize, setLyricsSize] = useState(initLyricsSize);
  const [lyricsState, setLyricsState] = useState(initLyricsState);

  // Other states
  const [refresh, setRefresh] = useState(false);
  const [token, setToken] = useState(null);
  const [g_token, setGToken] = useState(null);
  const [socketCommand, setSocketCommand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [playingNow, setPlayingNow] = useState(null);
  const [responseState, setResponseState] = useState(null);
  const [responseQueue, setResponseQueue] = useState(null);

  // Env vars
  const clientIdTidal = process.env.NEXT_PUBLIC_CLIENT_ID_TIDAL;
  const clientSecretTidal = process.env.NEXT_PUBLIC_CLIENT_SECRET_TIDAL;
  const clientIdGenius = process.env.NEXT_PUBLIC_CLIENT_ID_GENIUS;
  const clientSecretGenius = process.env.NEXT_PUBLIC_CLIENT_SECRET_GENIUS;

  const localhost = "http://volumio.local";
  const localAPI = "http://localhost:4008";

  // Handle Volumio WebSocket commands
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
        setSocketCommand({ command: "volume", value });
        break;
      case "getQueue":
        setSocketCommand(command);
        break;
      case "getState":
        setSocketCommand(command);
        break;
      case "addToFavourites":
        setSocketCommand({
          command: "addToFavourites",
          value: { uri: value.uri, title: value.title, service: value.service },
        });
        break;
      case "removeFromQueue":
        setSocketCommand({ command: "removeFromQueue", value });
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
    <div className="whole">
      <DraggableDroppable />

      <TokenLogin
        ClientId={clientIdTidal}
        setToken={setToken}
        ClientSecret={clientSecretTidal}
        service={"tidal"}
        source={"https://auth.tidal.com/v1/oauth2/token"}
        setMessage={setMessage}
      />

      <WebSockets
        url={localhost}
        socketCommand={socketCommand}
        setResponseState={setResponseState}
        setResponseQueue={setResponseQueue}
        setMessage={setMessage}
      />

      <main className="container">
        <ToastMessages message={message} />

        <SearchVolumio
          setMessage={setMessage}
          refresh={refresh}
          localhost={localhost}
          setRefresh={setRefresh}
          searchTerm={searchTerm}
        />

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
          queuePanel={queuePanel}
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

        <LyricsNow
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
          lyricsPanel={lyricsPanel}
          lyricsSize={lyricsSize}
          lyricsState={lyricsState}
        />
      </main>
    </div>
  );
}
