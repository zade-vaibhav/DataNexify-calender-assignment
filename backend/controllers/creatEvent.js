const { google } = require("googleapis");

const storedAccessToken = "ya29.a0AeDClZDdAmIDM4gvII1f3G4IQ68gmwf5HuQHbagVjPI5SNMYxmhTJGlhldCDdcLWf3Fd5m_o28XxTfXJwQGSys_ka1n2iphn4dtQKM29DY6TjXMYdCa7AGb52Ky32h4YPJ-T0HEwFANarM1c3FkpZmQmkB7Oxn7g0gaCgYKAfgSARMSFQHGX2MiH7cu2CF1KX33jfoIOm_v0w0169"
const creatEvent =async (req, res) => {
    const { summary, startDateTime, endDateTime } = req.body;
  
    if (!storedAccessToken) {
      return res.status(403).send({ message: 'Access token is missing' });
    }
  
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: storedAccessToken });
  
      const calendar = google.calendar({ version: 'v3', auth });
  
      const event = {
        summary,
        start: { dateTime: startDateTime },
        end: { dateTime: endDateTime },
      };
  
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
  
      res.send(response.data);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).send({ message: 'Failed to create event' });
    } 
  } 

  module.exports = creatEvent