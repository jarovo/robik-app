// Calendar.tsx
import React, { useEffect, useState } from 'react';

interface CalendarProps {
  token: string;
}

interface Event {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

const Calendar: React.FC<CalendarProps> = ({ token }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadGapi = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        console.log("GAPI", window.gapi)
        window.gapi.load('client', initializeGapiClient);
      };
      document.body.appendChild(script);
    };

    const initializeGapiClient = async () => {
      await window.gapi.client.init({
        apiKey: process.env.REACT_APP_GAPI_API_KEY,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        ],
      });

      window.gapi.client.setToken({ access_token: token });
      listUpcomingEvents();
    };

    const listUpcomingEvents = async () => {
      try {
        const response = await window.gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        });

        const events = response.result.items as Event[];
        setEvents(events);
      } catch (error) {
        console.error('Error fetching events', error);
      }
    };

    loadGapi();
  }, [token]);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.summary}</strong>
            <br />
            {new Date(event.start.dateTime).toLocaleString()} -{' '}
            {new Date(event.end.dateTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;
