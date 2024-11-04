"use client"

import { useState } from "react";
import ApiRequest from "./components/ApiRequest";
import SearchVolumio from "./components/SearchVolumio";
import TokenLogin from "./components/TokenLogin";


export default function Home() {
  
  const [refresh, setRefresh] = useState(false)
  const [token, setToken] = useState(null);

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  console.log("from env",clientId,clientSecret)

  return (
    <div className={"whole"}>

      
      <TokenLogin ClientId={clientId} token={token} setToken={setToken} ClientSecret={clientSecret} ></TokenLogin>
      <main className={"container"}>

            <SearchVolumio refresh={refresh} setRefresh={setRefresh} />   
                        
            <ApiRequest refresh={refresh} setRefresh={setRefresh} token={token} request={"/api/v1/getQueue"} type="multi"/>      
            <ApiRequest  refresh={refresh} setRefresh={setRefresh} token={token} request={"/api/v1/getState"} type="single"/>
 
        
      </main>


    </div>
  );
}
