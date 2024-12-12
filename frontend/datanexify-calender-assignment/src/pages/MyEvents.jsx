import React, { useEffect, useState } from "react";
import "../Css/MyEvents.css";
import { useNavigate } from "react-router-dom";

function MyEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken")
            if(!token){
                navigate('/login'); 
                return;
            }

            const response = await fetch("http://localhost:5000/api/v1/user/getAllEvents", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`, // Use your stored token
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

    useEffect(() => {
        fetchEvents();
    }, []);

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
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.summary || "No Summary"}</td>
                                    <td>{new Date(event.start.dateTime || event.start.date).toLocaleString()}</td>
                                    <td>{new Date(event.end.dateTime || event.end.date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default MyEvents;
