// Calendar.tsx
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';

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
          calendarId: 'primary',
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
  }, [token, dateSince, dateUntil]);

  return (
    <div>
      <h2>Events</h2>
        <InputGroup>
          <label>Date since <input name="date since" type="date" onChange={e => setDateSince(new Date(e.target.value))}/></label> 
          <label>Date until <input name="date until" type="date" onChange={e => setDateUntil(new Date(e.target.value))}/></label>
        </InputGroup>
        <div>
          {events.map((event) => (
            <>
                <Form.Label>{(new Date(event.start.dateTime).toLocaleString())
                  +  ' - ' + (new Date(event.end.dateTime).toLocaleString())}</Form.Label>

                <InputGroup className="mb-3">                  
                  <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                    <Form.Control aria-label="Apperance in invoice" defaultValue={event.summary} />
                </InputGroup>
            </>
          ))}
        </div>
    </div>
  );
}

export default Calendar;

