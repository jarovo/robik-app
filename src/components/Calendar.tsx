// Calendar.tsx
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

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

const Calendar: React.FC<CalendarProps> = ({token}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [dateSince, setDateSince] = useState<Date>(new Date())
  const [dateUntil, setDateUntil] = useState<Date>(new Date())
  const [calendar, setCalendar] = useState('primary')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const loadGapi = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
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
          calendarId: calendar,
          q: query,
          timeMin: dateSince.toISOString(),
          timeMax: dateUntil.toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        });

        const events = response.result.items as Event[];
        setEvents(events);
      } catch (error) {
        console.error('Error fetching events', error);
        return
      }
    };

    loadGapi();
  }, [token, dateSince, dateUntil, calendar, query]);

  return (
    <div>
      <h2>Events</h2>
        <InputGroup>
          <label>Calendar<input name="calendar" type="text" onChange={e => setCalendar(e.target.value)} defaultValue={calendar}/></label>
          <label>Query<input name="query" type="text" onChange={e => setQuery(e.target.value)} defaultValue={query}/></label>
          <label>Date since <input name="date since" type="date" onChange={e => setDateSince(new Date(e.target.value))}/></label> 
          <label>Date until <input name="date until" type="date" onChange={e => setDateUntil(new Date(e.target.value))}/></label>
        </InputGroup>
        <div>
          {events.map((event) => (
            <>
                <InputGroup className="mb-3">                  
                  <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                  <InputGroup.Text>{
                  (new Date(event.start.dateTime).toLocaleString()) + ' - ' + (new Date(event.end.dateTime).toLocaleString())}
                  </InputGroup.Text>
                    <Form.Control aria-label="Apperance in invoice" defaultValue={event.summary} />
                </InputGroup>
            </>
          ))}
        </div>
    </div>
  );
}

export default Calendar;

