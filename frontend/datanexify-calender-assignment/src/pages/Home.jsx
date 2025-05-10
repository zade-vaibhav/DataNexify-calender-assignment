import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateEventPage from './CreatEventPage';
import MyEvents from './MyEvents';

function Home() {
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [relode, setRelode] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {

        const hash = window.location.hash;
        // console.log("inside ",hash)
        let token = null;

        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            token = params.get('access_token');
            // console.log(token)
            if (token) {
                localStorage.setItem("accessToken", token);
                setAccessToken(token);

                window.history.replaceState(null, null, window.location.pathname);
            }
        } else {
            token = localStorage.getItem("accessToken");
            if (!token) {
                navigate('/login');
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
                setAccessToken(token);
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
            const response = await fetch('https://datanexify-calender-assignment.onrender.com/api/v1/user/storeToken', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                // console.log(data,"  hello")
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
            <CreateEventPage relode={relode} setRelode={setRelode} />
            {accessToken && <MyEvents relode={relode} setRelode={setRelode} />}
        </div>
    );
}

export default Home;
