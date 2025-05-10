const { google } = require("googleapis");
const Event = require("../model/eventModel");
const User = require("../model/userModel");

// const getAllEvents = async (req, res) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Authorization token missing or invalid' });
//   }

//   // Extract the token after 'Bearer '
//   const token = authHeader.split(' ')[1];

//   try {
//     // Fetch user info from Google API using the token
//     const userDataResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!userDataResponse.ok) {
//       return res.status(404).json({ message: 'Failed to fetch user info from Google' });
//     }

//     const userData = await userDataResponse.json();
//     const userEmail = userData.email;

//     // Find user in the database
//     const user = await User.findOne({ email: userEmail });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found in the database' });
//     }

//     // Fetch all events associated with the user's ID
//     const events = await Event.find({ userId: user._id });

//     if (!events.length) {
//       return res.status(404).json({ message: 'No events found for this user' });
//     }

//     res.status(200).json({
//       message: 'Events retrieved successfully',
//       events,
//     });
//   } catch (error) {
//     console.error('Error fetching events:', error.message);
//     res.status(500).json({ message: 'Failed to fetch events', error: error.message });
//   }

// };

const getAllEvents = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });

    //Google Calendar API
    const calendar = google.calendar({ version: 'v3', auth });

    // Fetch all events 
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 2500,
      orderBy: 'startTime',
    });

    const events = response.data.items;

    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }

    res.status(200).json({
      message: 'Events retrieved successfully',
      events,
    });
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

module.exports = getAllEvents;

