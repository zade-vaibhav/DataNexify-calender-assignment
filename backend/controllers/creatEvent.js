const { google } = require("googleapis");
const User = require("../model/userModel");
const Event = require("../model/eventModel");

const creatEvent = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  // Extract the token after 'Bearer '
  const token = authHeader.split(' ')[1];

  const { summary, startDateTime, endDateTime } = req.body;

  // Validate inputs
  if (!summary || !startDateTime || !endDateTime) {
    return res.status(400).json({ message: 'All fields (summary, startDateTime, endDateTime) are required.' });
  }

  try {
    // Fetch user info from Google API
    const userDataResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userDataResponse.ok) {
      return res.status(404).json({ message: 'Failed to fetch user info from Google' });
    }

    const userData = await userDataResponse.json();
    const userEmail = userData.email;

    // Find user in the database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found in the database' });
    }

    // Initialize Google Calendar API
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth });

    // Define the event object
    const event = {
      summary,
      start: {
        dateTime: new Date(startDateTime).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(endDateTime).toISOString(),
        timeZone: 'UTC',
      },
    };

    console.log('Event being sent to Google Calendar:', event);

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    const createdEvent = response.data;

    console.log('Event created successfully:', createdEvent);

    // Save event details in the database
    const dbEvent = new Event({
      userId: user._id,
      summery: summary,
      startDate: startDateTime,
      endDate: endDateTime,
      eventId: createdEvent.id, // Store the eventId from Google Calendar
    });

    await dbEvent.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: createdEvent,
      savedEvent: dbEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to create event', error: error.response?.data || error.message });
  }
};

module.exports = creatEvent;

