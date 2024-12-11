const { google } = require("googleapis");
const fetch = require("node-fetch"); // Ensure you have node-fetch installed
const User = require("../model/userModel")

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENTID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5173" // Your redirect URI
);

const userAuth = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        // Extract the token after 'Bearer '
        const token = authHeader.split(' ')[1];
        console.log("Token received:", token);

        // Fetch user info from Google API
        const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("User data from Google:", data);

            // Check if the user already exists in the database
            let user = await User.findOne({ email: data.email });

            if (user) {
                // Update the user's access token
                user.accessToken = token;
                await user.save();
                console.log("User updated in the database.");
            } else {
                // Create a new user in the database
                user = new User({
                    accessToken: token,
                    name: data.name,
                    email: data.email,
                    image: data.picture, // Assuming 'picture' contains the profile image URL
                });

                await user.save();
                console.log("New user created in the database.");
            }

            res.status(200).json({
                message: "User authenticated successfully",
                user,
            });
        } else {
            console.log('Failed to fetch user info:', response.statusText);
            res.status(response.status).json({ message: 'Failed to fetch user info' });
        }
    } catch (err) {
        console.error("Error during user authentication:", err.message);
        res.status(500).json({ message: "Failed to authenticate user" });
    }
};

module.exports = userAuth;


