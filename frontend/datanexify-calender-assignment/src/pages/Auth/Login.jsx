import React from 'react'
import { GoogleLogin } from '@react-oauth/google';

function Login() {

     // Google Login Success
  const handleGoogleLoginSuccess = async (response) => {
    try {
     console.log(response)
    } catch (error) {
     console.log(err)
    }
  };

  // Google Login Failure
  const handleGoogleLoginFailure = (error) => {
    console.error("Google OAuth Error:", error);
   
  };
    return (
        <div>
            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                theme="outline"
                text="continue_with"
                responseType="code"
                accessType="offline"
                scope="openid email prodile https://www.googleapis.com/auth/calendar"
            />
        </div>
    )
}

export default Login
