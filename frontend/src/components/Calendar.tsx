// Calendar.tsx
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';

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

interface Etag {
  etag: string
}

interface Response {
  "kind": "calendar#events",
  "etag": Etag,
  "summary": string,
  "description": string,
  "updated": Date,
  "timeZone": string,
  "accessRole": string,
  "defaultReminders": [
    {
      "method": string,
      "minutes": Number
    }
  ],
  "nextPageToken": string,
  "nextSyncToken": string,
  "items": [Event]
}


const getHours = (event: Event) => {
  const endTime = new Date(event.end.dateTime).getTime()
  const startTime = new Date(event.start.dateTime).getTime()
  return endTime - startTime
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
      let nextPageToken: string | undefined
      let events: Array<Event> = []
      do {
        try {
          const response = await window.gapi.client.calendar.events.list({
            calendarId: calendar,
            q: query,
            timeMin: dateSince.toISOString(),
            timeMax: dateUntil.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime',
            pageToken: nextPageToken
          });
          nextPageToken = response.result.nextPageToken
          events = events.concat(response.result.items as Event[])
        } catch (error) {
          console.error('Error fetching events', error);
          return
        }
      } while (nextPageToken)
      setEvents(events);
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
        <Table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Since</th>
              <th>Until</th>
              <th>Hours</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <input type="checkbox" defaultChecked={true} aria-label="Checkbox for following text input" />
                </td>
                <td>
                  {new Date(event.start.dateTime).toLocaleString()}
                </td>
                <td>
                  {new Date(event.end.dateTime).toLocaleString()}
                </td>
                <td>
                  {Number(getHours(event) / 1000 / 60 / 60).toFixed(2)}
                </td>
                <td>
                  <Form.Control aria-label="Apperance in invoice" defaultValue={event.summary} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Calendar;

