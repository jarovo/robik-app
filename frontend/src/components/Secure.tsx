import {DndContext} from '@dnd-kit/core';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Calendar, { GoogleEvent } from "./Calendar";
import Invoices from "./Invoices";
import { CalendarEvents } from './CalendarEvents';


export default function Secure() {
  const [googleEvents, setGoogleEvents] = useState<GoogleEvent[]>([])
  const [invoiceEvents, setInvoiceEvents] = useState<GoogleEvent[]>([]);

  const googleAccessToken = Cookies.get("google_access_token");
  const fakturoidAccessToken = Cookies.get("fakturoid_access_token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!googleAccessToken || !fakturoidAccessToken) {
      navigate("/");
      return
    }

  }, [navigate, googleAccessToken, fakturoidAccessToken]);
  
  function handleDragEnd(event: any) {
    console.log("Drag end", event)
    const googleEvent = googleEvents.find(ev => ev.id === event.active.id)
    if (!googleEvent) return

    invoiceEvents.push(googleEvent)
    console.log("Found dragged", googleEvent)
  }

  return (
    <>
    <DndContext onDragEnd={handleDragEnd}>
      <div className="row">
        <div className="col">
          <Calendar token={googleAccessToken!}
            setCalendarEvents={setGoogleEvents}
            EventsComponent={<CalendarEvents id="google-cal-events" events={googleEvents}/>} />
        </div>
        <div className="col"> 
          <Invoices
            accessToken={fakturoidAccessToken!} 
            CalendarEvents={<CalendarEvents id="invoice-events" events={invoiceEvents}/>} />
        </div>
      </div>
    </DndContext>
    </>
  );
}