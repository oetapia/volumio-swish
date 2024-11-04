"use client"

import React, { useEffect, useState } from 'react';

function TokenLogin({ ClientId, ClientSecret,setToken, token }) {
  

  // Helper function to base64 encode client credentials
  const encodeCredentials = (clientId, clientSecret) => {
    return btoa(`${clientId}:${clientSecret}`);
  };

  const getToken = async () => {
    try {
      const creds = encodeCredentials(ClientId, ClientSecret);
      const response = await fetch('https://auth.tidal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();

      if (response.ok) {
        const expiryTime = Date.now() + data.expires_in * 1000; // Convert expiry to milliseconds
        const tokenData = {
          token: data.access_token,
          expiry: expiryTime
        };

        // Store token data in localStorage
        localStorage.setItem('authToken', JSON.stringify(tokenData));
        setToken(tokenData.token);
      } else {
        console.error('Failed to fetch token:', data);
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const checkToken = () => {
    const storedToken = localStorage.getItem('authToken');

	console.log("stored",storedToken)

    if (storedToken) {
      const tokenData = JSON.parse(storedToken);

      // Check if the token has expired
      if (Date.now() < tokenData.expiry) {
        setToken(tokenData.token);
      } else {
        // Token has expired; fetch a new one
        getToken();
      }
    } else {
      // No token stored; fetch a new one
      getToken();
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="overlay toast">
      {token ? "" : <p className="active">Loading</p>}
    </div>
  );
}

export default TokenLogin;
