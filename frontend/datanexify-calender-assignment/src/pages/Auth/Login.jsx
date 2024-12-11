import React from "react";
const clientId = import.meta.env.CLIENT_ID

const Login = () => {
    console.log(clientId)
    const generateGoogleOAuthURL = () => {
        
      const clientID = "1009323095218-rtmecje2fqu3qpqsnt6k1ogq48qhqbdd.apps.googleusercontent.com"; // Replace with your Google client ID
      const redirectURI = "http://localhost:5173"; // Replace with your redirect URI
      const responseType = "token";
      const scopes = [
        "https://www.googleapis.com/auth/calendar","openid","email","profile"
      ];
      const state = Math.random().toString(36).substring(2); // Simple random state for CSRF protection
    
      const baseURL = "https://accounts.google.com/o/oauth2/v2/auth";
      const params = new URLSearchParams({
        client_id: clientID,
        redirect_uri: redirectURI,
        response_type: responseType,
        scope: scopes.join(" "),
        state: state,
        flowName: "GeneralOAuthFlow"
      });
    
      return `${baseURL}?${params.toString()}`;
    };
    
  const handleLogin = () => {
    const googleOAuthURL = generateGoogleOAuthURL();
    window.location.href = googleOAuthURL; // Redirect the user to Google's OAuth 2.0 endpoint
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
