import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Paper } from "@mui/material";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import EventDialog from "./EventDialog";
import { useClub } from "../contexts/clubContext";

// Main calendar component
function Calendar() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clubCalendar, setClubCalendar] = useState();
  const { clubs } = useClub();

  useEffect(() => {
    if (clubs[0]) {
      setClubCalendar(clubs[0].calendars[0]);
    }
  }, [clubs]);

  const handleClick = (date, event) => {
    const dateStr = date.dateStr.slice(0, 10);
    const calendarApi = calendarRef.current.getApi();
    let filteredEvents = calendarApi
      .getEvents()
      .filter((e) => e.startStr.slice(0, 10) === dateStr);
    if (event) {
      // If event is provided, handle it as an event click
      event.jsEvent.preventDefault();
      setSelectedEvent(event.event);
    } else {
      // If no event is provided, handle it as a date click
      if (filteredEvents.length === 1) {
        setSelectedEvent(filteredEvents[0]);
      } else {
        setSelectedEvent(null);
      }
    }
    setSelectedDate(dateStr);
    setEvents(filteredEvents);
    // Only open the dialog if there are events on the selected date
    if (filteredEvents.length > 0) {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (calendarRef.current && clubCalendar) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.addEventSource({
        googleCalendarApiKey: `${process.env.REACT_APP_CALENDAR_APIKEY}`,
        googleCalendarId: clubCalendar,
      });
    }
  }, [calendarRef, clubCalendar]);

  return (
    <Paper sx={{ maxWidth: "800px", margin: "10 auto", mt: 4, p: 2 }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
        initialView="dayGridMonth"
        dateClick={handleClick}
        eventClick={(info) =>
          handleClick({ dateStr: info.event.startStr }, info)
        }
      />
      <EventDialog
        open={open}
        setOpen={setOpen}
        selectedDate={selectedDate}
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        calendarRef={calendarRef}
        googleCalendarId={clubCalendar}
      />
    </Paper>
  );
}

export default Calendar;
