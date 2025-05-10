const { google } = require("googleapis");

const editEvent = async (req, res) => {
  const authHeader = req.headers.authorization;
  const {id} = req.params

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  const { summary, startDateTime, endDateTime } = req.body;

  if (!summary || !startDateTime || !endDateTime) {
    return res.status(400).json({ message: 'All fields (summary, startDateTime, endDateTime) are required.' });
  }
 
  try { 
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth });

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

    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId: id,
      requestBody: event,
    });

    res.status(200).send({ message: 'Event updated successfully', event: response.data });
  } catch (error) {
    console.error('Error updating event:', error.response?.data.errors || error.message);
    res.status(500).send({ message: 'Failed to update event', error: error.response?.data });
  }
};

module.exports = editEvent;
