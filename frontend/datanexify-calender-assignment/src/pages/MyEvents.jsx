import React, { useEffect, useState } from "react";
import "../Css/MyEvents.css";
import { useNavigate } from "react-router-dom";

function MyEvents({relode}) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken");

            const response = await fetch("http://localhost:5000/api/v1/user/getAllEvents", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.statusText}`);
            }

            const data = await response.json();
            setEvents(data.events || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async (eventData) => {

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://localhost:5000/api/v1/user/event/update/${eventData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update event: ${response.statusText}`);
            }

            const updatedEvent = await response.json();
            setEvents((prev) =>
                prev.map((event) =>
                    event.id === updatedEvent.event.id ? updatedEvent.event : event
                )
            );
            setFormVisible(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Error updating event:", error.message);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (selectedEvent) {
            handleUpdateEvent(selectedEvent);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (eventId) => {
        try {
            const token = localStorage.getItem("accessToken");
            
            const response = await fetch(`http://localhost:5000/api/v1/user/event/delete/${eventId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, // Use your stored token
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete event: ${response.statusText}`);
            }

            // Refresh events after deletion
            fetchEvents();
            alert("Event deleted successfully.");
        } catch (error) {
            console.error("Error deleting event:", error.message);
            alert("Failed to delete event.");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [relode]);

    return (
        <div className="my-events">
            <div className="container">
                <h1 className="title">My Events</h1>
                {loading ? (
                    <p className="status">Loading events...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : events.length === 0 ? (
                    <p className="status">No events found</p>
                ) : (
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>Summary</th>
                                <th>Start Date & Time</th>
                                <th>End Date & Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.summary || "No Summary"}</td>
                                    <td>{new Date(event.start.dateTime || event.start.date).toLocaleString()}</td>
                                    <td>{new Date(event.end.dateTime || event.end.date).toLocaleString()}</td>
                                    <td>
                                        <div className="btn-container">
                                        <button
                                            className="update-btn"
                                            onClick={() => {
                                                setSelectedEvent({
                                                    id: event.id,
                                                    summary: event.summary,
                                                    startDateTime: new Date(event.start.dateTime || event.start.date).toISOString(),
                                                    endDateTime: new Date(event.end.dateTime || event.end.date).toISOString(),
                                                });
                                                setFormVisible(true);
                                            }}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => {
                                                handleDelete(event.id)
                                            }}
                                        >
                                            delete
                                        </button>
                                        </div>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {formVisible && selectedEvent && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="modal-title">Update Event</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="summary">Summary</label>
                                <input
                                    type="text"
                                    id="summary"
                                    name="summary"
                                    value={selectedEvent.summary}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="startDateTime">Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    id="startDateTime"
                                    name="startDateTime"
                                    value={selectedEvent.startDateTime.slice(0, 16)}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="endDateTime">End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    id="endDateTime"
                                    name="endDateTime"
                                    value={selectedEvent.endDateTime.slice(0, 16)}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">Update</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setFormVisible(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyEvents;
