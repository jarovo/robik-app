// components/GoogleCalendar.tsx
import React from 'react';
import useGoogleCalendar from '../hooks/useGoogleCalendar';

const GoogleCalendar: React.FC = () => {
  const { isSignedIn, events, handleAuthClick, handleSignOutClick } = useGoogleCalendar();

  return (
    <div>
      {!isSignedIn ? (
        <button onClick={handleAuthClick}>Sign in with Google</button>
      ) : (
        <div>
          <button onClick={handleSignOutClick}>Sign Out</button>
          <h2>Upcoming Events</h2>
          <ul>
            {events.map(event => (
              <li key={event.id}>
                <strong>{event.summary}</strong><br />
                {new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendar;
