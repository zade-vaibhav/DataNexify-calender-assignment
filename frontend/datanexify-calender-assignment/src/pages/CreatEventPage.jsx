import React, { useState } from 'react';
import '../Css/creatEventPage.css';
import { useNavigate } from 'react-router-dom';

function CreateEventPage({ relode, setRelode }) {
    const [open, setOpen] = useState(false);
    const [eventData, setEventData] = useState({
        summary: '',
        startDateTime: '',
        endDateTime: '',
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCreateEvent = async () => {
        try {
            const token = localStorage.getItem("accessToken")
            if (!token) {
                navigate('/login');
            }
            const response = await fetch('https://datanexify-calender-assignment.onrender.com/api/v1/user/creatEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(eventData),
            });

            const res = await response.json()
            // console.log(res)
            if (response.ok) {
                alert('Event created successfully!');
                setEventData({
                    summary: '',
                    startDateTime: '',
                    endDateTime: '',
                });
                setOpen(false);
                setRelode(!relode)
            } else {
                const errorData = await response.json();
                alert(`Failed to create event: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('An error occurred while creating the event.');
        }
    };

    return (
        <div className="event-page">
            <button className="create-event-button" onClick={() => setOpen(true)}>
                Create Event
            </button>
            {open && (
                <div className="event-modal">
                    <div className="event-modal-content">
                        <h2>Create Event</h2>
                        <label>
                            Summary:
                            <input
                                type="text"
                                name="summary"
                                value={eventData.summary}
                                onChange={handleInputChange}
                                placeholder="Enter event summary"
                                required
                            />
                        </label>
                        <label>
                            Start Date & Time:
                            <input
                                type="datetime-local"
                                name="startDateTime"
                                value={eventData.startDateTime}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            End Date & Time:
                            <input
                                type="datetime-local"
                                name="endDateTime"
                                value={eventData.endDateTime}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={() => setOpen(false)}>
                                Cancel
                            </button>
                            <button className="submit-button" onClick={handleCreateEvent}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateEventPage;
