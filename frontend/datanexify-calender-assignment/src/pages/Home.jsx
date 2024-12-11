import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate(); // For navigation to login page

    useEffect(() => {
        // Extract the hash part of the URL
        const hash = window.location.hash;

        let token = null;

        if (hash) {
            const params = new URLSearchParams(hash.substring(1)); // Remove the '#' at the start
            token = params.get('access_token'); // Get the 'access_token' parameter
            if (token) {
                localStorage.setItem("accessToken", token); // Store the access token in localStorage
                setAccessToken(token); // Store the access token in state
                // Remove the hash from the URL
                window.history.replaceState(null, null, window.location.pathname);
            }
        } else {
            token = localStorage.getItem("accessToken"); // Get the token from localStorage
            if (!token) {
                navigate('/login'); // Redirect to login if no token is found
                return;
            }
        }

        if (token) {
            validateToken(token);
        }
    }, []); // Run only once when the component mounts

    const validateToken = async (token) => {
        try {
            // Validate the token by making a request to Google API or your server
            const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token);
            if (response.ok) {
                const data = await response.json();
                storeToken(token); // Fetch and store user info
            } else {
                console.error('Token is invalid or expired, redirecting to login...');
                localStorage.removeItem("accessToken"); // Clear the invalid token
                navigate('/login'); // Redirect to login
            }
        } catch (error) {
            console.error('Error validating token:', error.message);
            localStorage.removeItem("accessToken"); // Clear the invalid token
            navigate('/login'); // Redirect to login
        }
    };

    const storeToken = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/user/storeToken', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data.user); // Store user info in state
            } else {
                console.error('Failed to fetch user info:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user info:', error.message);
        }
    };

    return (
        <div>
            <h1>Home</h1>
            {accessToken ? (
                <div>
                    <p>Access Token is securely stored</p>
                    {userInfo ? (
                        <div>
                            <p>Welcome, {userInfo.name}!</p>
                            <p>Email: {userInfo.email}</p>
                        </div>
                    ) : (
                        <p>Loading user information...</p>
                    )}
                </div>
            ) : (
                <p>No Access Token Found</p>
            )}
        </div>
    );
}

export default Home;
