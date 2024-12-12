import React from "react";
const clientId = import.meta.env.VITE_CLIENT_ID
const redirectUrl = import.meta.env.VITE_REDIRECT_URL

const Login = () => {
    const generateGoogleOAuthURL = () => {
        
      const clientID = clientId
      const redirectURI = redirectUrl;
      const responseType = "token";
      const scopes = [
        "https://www.googleapis.com/auth/calendar","openid","email","profile"
      ];
      const state = Math.random().toString(36).substring(2); 
    
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
    window.location.href = googleOAuthURL; 
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
