import { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

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
  
const useGoogleCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsSignedIn);
        if (authInstance.isSignedIn.get()) {
          listUpcomingEvents();
        }
      });
    };

    gapi.load('client:auth2', initClient);
  }, []);

  const listUpcomingEvents = () => {
    gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    }).then((response: any) => {
      const events = response.result.items as Event[];
      setEvents(events);
    });
  };
/*
const auth: Auth.GoogleAuth = new google.auth.GoogleAuth();
const calendar: calendar_v3.Calendar = google.calendar({
  version: 'v3',
  auth,
});

const listUpcomingEvents = () => {
    return calendar.events.list()
}
*/

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  return { isSignedIn, events, handleAuthClick, handleSignOutClick };
};

export default useGoogleCalendar;