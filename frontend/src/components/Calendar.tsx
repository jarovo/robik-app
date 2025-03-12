// Calendar.tsx
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import {useDraggable} from '@dnd-kit/core';
import { CalendarEvents } from './CalendarEvents';

interface CalendarProps {
  token: string
  EventsComponent: ReactElement;
  setCalendarEvents: (daa: GoogleEvent[]) => void;
}

export interface GoogleEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

const Calendar: React.FC<CalendarProps> = ({token, EventsComponent, setCalendarEvents}) => {
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
      let events: Array<GoogleEvent> = []
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
          events = events.concat(response.result.items as GoogleEvent[])
        } catch (error) {
          console.error('Error fetching events', error);
          return
        }
      } while (nextPageToken)
      setCalendarEvents(events);
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
        {EventsComponent}
      </div>
    </div>
  );
}

export default Calendar;

