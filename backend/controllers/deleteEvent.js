const { google } = require("googleapis");

const deleteEvent = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Event ID is required.' });
    }

    try {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: token });

        const calendar = google.calendar({ version: 'v3', auth });

        await calendar.events.delete({
            calendarId: 'primary', // Use the primary calendar
            eventId: id,
        });

        res.status(200).send({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error.response?.data || error.message);
        res.status(500).send({ message: 'Failed to delete event', error: error.response?.data });
    }
};

module.exports = deleteEvent;
